#!/usr/bin/env node

import { createServer } from 'http'
import { createReadStream, existsSync, statSync } from 'fs'
import { extname, join, normalize, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = join(ROOT, 'out')
const PORT = Number(process.env.PORT || 4173)

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
}

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${PORT}`).pathname)
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(OUT_DIR, safePath)

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html')
  }

  if (!existsSync(filePath) && !extname(filePath)) {
    filePath = join(filePath, 'index.html')
  }

  return filePath.startsWith(OUT_DIR) ? filePath : join(OUT_DIR, '404.html')
}

if (!existsSync(OUT_DIR)) {
  console.error('Missing ./out. Run npm run build before npm run preview.')
  process.exit(1)
}

createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || '/')

  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Not found')
    return
  }

  res.writeHead(200, {
    'Content-Type': MIME_TYPES[extname(filePath)] || 'application/octet-stream',
  })
  createReadStream(filePath).pipe(res)
}).listen(PORT, () => {
  console.log(`Static preview running at http://localhost:${PORT}`)
})
