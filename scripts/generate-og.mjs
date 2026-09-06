#!/usr/bin/env node
/**
 * Regenerates the social share card public/images/og/portfolio.png (1200x630).
 *
 * The card is drawn as SVG from the site's design tokens (src/app/globals.css) and the
 * profile photo is composited on top with sharp. Run it locally on Windows so the text
 * renders in Segoe UI like the original card (`npm run gen:og`); a Linux runner would
 * pick a different fallback font, which is why this is not part of the build.
 */
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUTPUT = path.join(ROOT, 'public/images/og/portfolio.png')
const AVATAR_SOURCE = path.join(ROOT, 'public/images/profile/hero-320@2x.jpg')

const WIDTH = 1200
const HEIGHT = 630
const TEXT_X = 88
const AVATAR = { cx: 946, cy: 316, radius: 126, ring: 4 }
const FONT_FAMILY = "'Segoe UI', Inter, 'Helvetica Neue', Arial, sans-serif"

// Design tokens (src/app/globals.css)
const COLORS = {
  bg: '#040304',
  fg: '#EFD2BC',
  fgMuted: '#D2B6A1',
  accent: '#DCA293',
  copper: '#A66B57',
}

const LINES = [
  { text: 'Adrián Montes Linares', y: 236, size: 64, weight: 700, fill: COLORS.fg },
  { text: 'Telematics Engineer', y: 298, size: 38, weight: 400, fill: COLORS.fgMuted },
  { text: "Master's student in Telecommunications Engineering", y: 342, size: 28, weight: 400, fill: COLORS.fgMuted },
  { text: 'Cloud & Systems N2 · Full-Stack · XR · Code-XR', y: 388, size: 28, weight: 400, fill: COLORS.accent },
  { text: 'Portfolio · adrianmonteslinares.com', y: 540, size: 28, weight: 400, fill: COLORS.fgMuted },
]
const RULE = { y: 418, x1: TEXT_X, x2: 560 }

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function buildCardSvg() {
  const texts = LINES.map(
    (line) =>
      `<text x="${TEXT_X}" y="${line.y}" font-size="${line.size}" font-weight="${line.weight}" fill="${line.fill}">${escapeXml(line.text)}</text>`,
  ).join('\n    ')
  const ringRadius = AVATAR.radius + AVATAR.ring / 2

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow-top" cx="${AVATAR.cx}" cy="150" r="440" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${COLORS.copper}" stop-opacity="0.22"/>
      <stop offset="1" stop-color="${COLORS.copper}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-bottom" cx="140" cy="640" r="380" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${COLORS.copper}" stop-opacity="0.12"/>
      <stop offset="1" stop-color="${COLORS.copper}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.bg}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow-top)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow-bottom)"/>
  <g font-family="${FONT_FAMILY}">
    ${texts}
  </g>
  <rect x="${RULE.x1}" y="${RULE.y}" width="${RULE.x2 - RULE.x1}" height="1" fill="${COLORS.copper}" fill-opacity="0.64"/>
  <circle cx="${AVATAR.cx}" cy="${AVATAR.cy}" r="${ringRadius}" fill="none" stroke="${COLORS.accent}" stroke-width="${AVATAR.ring}"/>
</svg>`
}

async function buildAvatar() {
  const size = AVATAR.radius * 2
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  )

  return sharp(AVATAR_SOURCE)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

/** Right edge of the lit pixels in a text band, to make sure nothing runs into the photo. */
async function measureTextEdges() {
  const { data, info } = await sharp(OUTPUT).raw().toBuffer({ resolveWithObject: true })
  // Left edge of the photo ring; pixels from there on belong to the avatar, not the text.
  const limitX = AVATAR.cx - AVATAR.radius - AVATAR.ring - 4

  const rightEdge = (y0, y1) => {
    let max = 0
    for (let y = Math.max(0, y0); y < Math.min(info.height, y1); y += 1) {
      for (let x = 0; x < limitX; x += 1) {
        const i = (y * info.width + x) * info.channels
        const luminance = (data[i] + data[i + 1] + data[i + 2]) / 3
        if (luminance > 70 && x > max) max = x
      }
    }
    return max
  }

  return LINES.map((line) => {
    const edge = rightEdge(line.y - line.size, line.y + 10)
    return { text: line.text, rightEdge: edge, fits: edge < limitX - 24 }
  })
}

async function main() {
  const avatar = await buildAvatar()

  // sharp rasterises SVG at 72 dpi, so the 1200x630 viewBox maps 1:1 to pixels.
  await sharp(Buffer.from(buildCardSvg()))
    .composite([{ input: avatar, left: AVATAR.cx - AVATAR.radius, top: AVATAR.cy - AVATAR.radius }])
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT)

  const [metadata, fileStat, edges] = await Promise.all([sharp(OUTPUT).metadata(), stat(OUTPUT), measureTextEdges()])
  console.log(`og: wrote ${path.relative(ROOT, OUTPUT)} ${metadata.width}x${metadata.height} (${Math.round(fileStat.size / 1024)} KB)`)
  for (const edge of edges) {
    console.log(`og: ${edge.fits ? 'ok  ' : 'WIDE'} right edge x=${edge.rightEdge} — ${edge.text}`)
  }
  if (edges.some((edge) => !edge.fits)) {
    process.exitCode = 1
  }
}

await main()
