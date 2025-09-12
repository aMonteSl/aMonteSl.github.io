#!/usr/bin/env node

import sharp from 'sharp'
import { existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Paths
const originalImage = join(__dirname, '../public/images/profile/original.jpg')
const outputDir = join(__dirname, '../public/images/profile')

// Ensure output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true })
}

// Image variants configuration
const variants = [
  // Avatar variants (header)
  { name: 'avatar-40', size: 40, quality: { avif: 55, webp: 70, jpeg: 82 } },
  { name: 'avatar-40@2x', size: 80, quality: { avif: 55, webp: 70, jpeg: 82 } },
  
  // Hero variants (main photo)
  { name: 'hero-196', size: 196, quality: { avif: 55, webp: 70, jpeg: 82 } },
  { name: 'hero-196@2x', size: 392, quality: { avif: 55, webp: 70, jpeg: 82 } },
  
  // Spare variants for future layouts
  { name: 'hero-256', size: 256, quality: { avif: 55, webp: 70, jpeg: 82 } },
  { name: 'hero-256@2x', size: 512, quality: { avif: 55, webp: 70, jpeg: 82 } },
  { name: 'hero-320', size: 320, quality: { avif: 55, webp: 70, jpeg: 82 } },
  { name: 'hero-320@2x', size: 640, quality: { avif: 55, webp: 70, jpeg: 82 } },
]

// Image formats to generate
const formats = ['avif', 'webp', 'jpeg']

async function generateImages() {
  console.log('🖼️  Generating responsive image variants from original.jpg...')
  
  if (!existsSync(originalImage)) {
    console.error('❌ Original image not found at:', originalImage)
    process.exit(1)
  }
  
  try {
    // Get original image metadata
    const originalMetadata = await sharp(originalImage).metadata()
    console.log(`📊 Original image: ${originalMetadata.width}x${originalMetadata.height}`)
    
    let generated = 0
    const total = variants.length * formats.length
    
    for (const variant of variants) {
      console.log(`\n🔄 Processing ${variant.name} (${variant.size}px)...`)
      
      // Create base pipeline with square crop (center)
      const basePipeline = sharp(originalImage)
        .resize({
          width: variant.size,
          height: variant.size,
          fit: 'cover',
          position: 'center'
        })
      
      // Generate each format
      for (const format of formats) {
        const extension = format === 'jpeg' ? 'jpg' : format
        const outputPath = join(outputDir, `${variant.name}.${extension}`)
        
        try {
          let pipeline = basePipeline.clone()
          
          switch (format) {
            case 'avif':
              pipeline = pipeline.avif({ 
                quality: variant.quality.avif,
                effort: 6 
              })
              break
            case 'webp':
              pipeline = pipeline.webp({ 
                quality: variant.quality.webp,
                effort: 6 
              })
              break
            case 'jpeg':
              pipeline = pipeline.jpeg({ 
                quality: variant.quality.jpeg,
                progressive: true,
                mozjpeg: true 
              })
              break
          }
          
          await pipeline.toFile(outputPath)
          generated++
          
          console.log(`  ✅ ${extension.toUpperCase()}: ${variant.size}x${variant.size}px`)
          
        } catch (error) {
          console.error(`  ❌ Failed to generate ${extension.toUpperCase()}:`, error.message)
        }
      }
    }
    
    console.log(`\n🎉 Successfully generated ${generated}/${total} image variants!`)
    console.log(`📂 Output directory: ${outputDir}`)
    
    // List generated files
    console.log('\n📋 Generated files:')
    for (const variant of variants) {
      for (const format of formats) {
        const extension = format === 'jpeg' ? 'jpg' : format
        const filename = `${variant.name}.${extension}`
        const filepath = join(outputDir, filename)
        if (existsSync(filepath)) {
          console.log(`  📄 ${filename}`)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error generating images:', error)
    process.exit(1)
  }
}

// Run the script
generateImages().catch(console.error)
