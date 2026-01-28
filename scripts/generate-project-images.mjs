#!/usr/bin/env node

/**
 * generate-project-images.mjs
 * 
 * Scans public/projects/* folders and generates a manifest of images
 * for each project. This allows dynamic image loading without hardcoding
 * filenames in projects.json.
 * 
 * Output: src/content/projectImages.json
 * 
 * Usage: node scripts/generate-project-images.mjs
 * Runs automatically via prebuild/predev hooks
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PROJECTS_DIR = path.join(ROOT, 'public', 'projects')
const PROFILE_DIR = path.join(ROOT, 'public', 'profile')
const OUTPUT_FILE = path.join(ROOT, 'src', 'content', 'projectImages.json')
const PROFILE_OUTPUT_FILE = path.join(ROOT, 'src', 'content', 'profileImages.json')

// Supported image extensions
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])

// Files to exclude from the image list (placeholder only)
const EXCLUDED_FILES = new Set(['placeholder.svg'])

// Hero image pattern (logo.* with valid image extension)
const HERO_PATTERN = /^logo\./i

/**
 * Check if a file is an image based on extension
 */
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase()
  return IMAGE_EXTENSIONS.has(ext) && !EXCLUDED_FILES.has(filename.toLowerCase())
}

/**
 * Check if a file is the hero image (logo.* with valid extension)
 */
function isHeroImage(filename) {
  return HERO_PATTERN.test(filename.toLowerCase()) && isImageFile(filename)
}

/**
 * Scan a project folder for images
 * Returns { images: string[], heroImage: string | null }
 * Note: heroImage (logo.*) is ALSO included as the first item in images array
 */
function scanProjectFolder(projectSlug) {
  const projectPath = path.join(PROJECTS_DIR, projectSlug)
  
  if (!fs.existsSync(projectPath)) {
    return { images: [], heroImage: null }
  }

  const stats = fs.statSync(projectPath)
  if (!stats.isDirectory()) {
    return { images: [], heroImage: null }
  }

  const files = fs.readdirSync(projectPath)
  const images = []
  let heroImage = null

  for (const file of files) {
    const filePath = path.join(projectPath, file)
    const fileStats = fs.statSync(filePath)
    
    if (!fileStats.isFile()) continue

    if (isHeroImage(file)) {
      heroImage = file
    } else if (isImageFile(file)) {
      images.push(file)
    }
  }

  // Sort images alphabetically for consistent ordering
  images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  // If hero image exists, prepend it to the images array
  const allImages = heroImage ? [heroImage, ...images] : images

  return { images: allImages, heroImage }
}

/**
 * Main function
 */
function main() {
  console.log('🖼️  Scanning project images...')

  // Ensure projects directory exists
  if (!fs.existsSync(PROJECTS_DIR)) {
    console.warn(`⚠️  Projects directory not found: ${PROJECTS_DIR}`)
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({}, null, 2))
    return
  }

  // Get all project folders
  const projectFolders = fs.readdirSync(PROJECTS_DIR).filter(item => {
    const itemPath = path.join(PROJECTS_DIR, item)
    return fs.statSync(itemPath).isDirectory()
  })

  // Build manifest
  const manifest = {}
  let totalImages = 0

  for (const projectSlug of projectFolders) {
    const { images, heroImage } = scanProjectFolder(projectSlug)
    manifest[projectSlug] = {
      images,
      heroImage,
    }
    totalImages += images.length
    
    const heroStatus = heroImage ? `hero: ${heroImage}` : 'no hero'
    console.log(`  � ${projectSlug}: ${images.length} images (${heroStatus})`)
  }

  // Write manifest
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2))
  
  console.log(`✅ Generated ${OUTPUT_FILE}`)
  console.log(`   ${projectFolders.length} projects, ${totalImages} total images`)

  // ─────────────────────────────────────────────────────────────────
  // Scan profile folder for personal images
  // ─────────────────────────────────────────────────────────────────
  console.log('\n🖼️  Scanning profile images...')

  if (!fs.existsSync(PROFILE_DIR)) {
    console.warn(`⚠️  Profile directory not found: ${PROFILE_DIR}`)
    fs.writeFileSync(PROFILE_OUTPUT_FILE, JSON.stringify({ images: [], heroImage: null }, null, 2))
  } else {
    const profileFiles = fs.readdirSync(PROFILE_DIR)
    const profileImages = []
    let profileHero = null

    for (const file of profileFiles) {
      const filePath = path.join(PROFILE_DIR, file)
      const fileStats = fs.statSync(filePath)
      
      if (!fileStats.isFile()) continue

      if (isHeroImage(file)) {
        profileHero = file
      } else if (isImageFile(file)) {
        profileImages.push(file)
      }
    }

    // Sort images alphabetically
    profileImages.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    // Hero first, then rest
    const allProfileImages = profileHero ? [profileHero, ...profileImages] : profileImages

    const profileManifest = {
      images: allProfileImages,
      heroImage: profileHero,
    }

    fs.writeFileSync(PROFILE_OUTPUT_FILE, JSON.stringify(profileManifest, null, 2))

    const heroStatus = profileHero ? `hero: ${profileHero}` : 'no hero'
    console.log(`  📁 profile: ${allProfileImages.length} images (${heroStatus})`)
    console.log(`✅ Generated ${PROFILE_OUTPUT_FILE}`)
  }
}

main()
