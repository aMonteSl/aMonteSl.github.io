#!/usr/bin/env node

/**
 * Scans public image folders and generates typed manifests used by the app.
 *
 * Output:
 * - src/content/projectImages.json
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PROJECTS_DIR = path.join(ROOT, 'public', 'projects')
const PROJECTS_DATA_FILE = path.join(ROOT, 'src', 'content', 'projects.json')
const OUTPUT_FILE = path.join(ROOT, 'src', 'content', 'projectImages.json')

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])
const EXCLUDED_FILES = new Set(['placeholder.svg'])
const HERO_PATTERN = /^logo\./i

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return IMAGE_EXTENSIONS.has(ext) && !EXCLUDED_FILES.has(filename.toLowerCase())
}

function isHeroImage(filename) {
  return HERO_PATTERN.test(filename.toLowerCase()) && isImageFile(filename)
}

function getProjectFolders() {
  if (!fs.existsSync(PROJECTS_DIR)) {
    return []
  }

  return fs.readdirSync(PROJECTS_DIR).filter((item) => {
    const itemPath = path.join(PROJECTS_DIR, item)
    return fs.statSync(itemPath).isDirectory()
  })
}

function getProjectDataSlugs() {
  if (!fs.existsSync(PROJECTS_DATA_FILE)) {
    return []
  }

  const projects = JSON.parse(fs.readFileSync(PROJECTS_DATA_FILE, 'utf8'))

  if (!Array.isArray(projects)) {
    return []
  }

  return projects
    .map((project) => project?.slug)
    .filter((slug) => typeof slug === 'string' && slug.length > 0)
}

function getProjectDataBySlug() {
  if (!fs.existsSync(PROJECTS_DATA_FILE)) {
    return new Map()
  }

  const projects = JSON.parse(fs.readFileSync(PROJECTS_DATA_FILE, 'utf8'))

  if (!Array.isArray(projects)) {
    return new Map()
  }

  return new Map(
    projects
      .filter((project) => typeof project?.slug === 'string')
      .map((project) => [project.slug, project])
  )
}

function scanImageFolder(folderPath, projectData) {
  if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
    return { images: [], heroImage: null }
  }

  const availableImages = []
  let detectedHeroImage = null

  for (const file of fs.readdirSync(folderPath)) {
    const filePath = path.join(folderPath, file)
    const fileStats = fs.statSync(filePath)

    if (!fileStats.isFile()) {
      continue
    }

    if (isHeroImage(file)) {
      detectedHeroImage = file
    } else if (isImageFile(file)) {
      availableImages.push(file)
    }
  }

  const fileSet = new Set([...availableImages, detectedHeroImage].filter(Boolean))
  const declaredImages = Array.isArray(projectData?.images) ? projectData.images : []
  const orderedDeclaredImages = declaredImages.filter((file) => fileSet.has(file))
  const extras = [...fileSet]
    .filter((file) => !orderedDeclaredImages.includes(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const heroImage = fileSet.has(projectData?.heroImage) ? projectData.heroImage : detectedHeroImage

  return {
    images: [...orderedDeclaredImages, ...extras],
    heroImage,
  }
}

function writeProjectManifest() {
  console.log('Scanning project images...')

  if (!fs.existsSync(PROJECTS_DIR)) {
    console.warn(`Projects directory not found: ${PROJECTS_DIR}`)
  }

  const projectSlugs = Array.from(new Set([...getProjectDataSlugs(), ...getProjectFolders()])).sort()
  const projectDataBySlug = getProjectDataBySlug()
  const manifest = {}
  let totalImages = 0

  for (const projectSlug of projectSlugs) {
    const { images, heroImage } = scanImageFolder(
      path.join(PROJECTS_DIR, projectSlug),
      projectDataBySlug.get(projectSlug)
    )

    manifest[projectSlug] = {
      images,
      heroImage,
    }

    totalImages += images.length

    const heroStatus = heroImage ? `hero: ${heroImage}` : 'no hero'
    console.log(`  - ${projectSlug}: ${images.length} image(s), ${heroStatus}`)
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2))
  console.log(`Generated ${OUTPUT_FILE}`)
  console.log(`Project manifest: ${projectSlugs.length} project(s), ${totalImages} image(s)`)
}

writeProjectManifest()
