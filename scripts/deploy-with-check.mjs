#!/usr/bin/env node

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEPLOY_COUNT_FILE = path.join(__dirname, '..', '.deploycount')
const SITE_URL = 'https://amontesl.github.io'

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(color, text) {
  console.log(`${colors[color] || ''}${text}${colors.reset}`)
}

function getCommitNumber() {
  try {
    if (fs.existsSync(DEPLOY_COUNT_FILE)) {
      const content = fs.readFileSync(DEPLOY_COUNT_FILE, 'utf-8').trim()
      return parseInt(content) + 1
    }
  } catch (e) {
    // File doesn't exist, start at 1
  }
  return 1
}

function saveCommitNumber(num) {
  fs.writeFileSync(DEPLOY_COUNT_FILE, num.toString())
}

function getCommitMessage() {
  // Get message from command line arguments
  const args = process.argv.slice(2)
  const customMessage = args.join(' ').trim()
  
  const commitNum = getCommitNumber()
  
  if (customMessage) {
    return `${customMessage} (Commit${commitNum})`
  } else {
    return `Commit${commitNum}`
  }
}

async function main() {
  log('bright', '\n🚀 Iniciando Deploy a GitHub Pages\n')

  const commitNum = getCommitNumber()
  const commitMessage = getCommitMessage()

  // Step 1: Git Add
  log('cyan', '⏳ Git add...')
  try {
    execSync('git add .', { encoding: 'utf-8', stdio: 'pipe' })
    log('green', '✅ Git add')
  } catch (error) {
    log('red', '❌ Git add falló')
    process.exit(1)
  }

  // Step 2: Git Commit
  log('cyan', '⏳ Git commit...')
  try {
    execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8', stdio: 'pipe' })
    log('green', '✅ Git commit')
  } catch (error) {
    const msg = error.message || ''
    if (msg.includes('nothing to commit')) {
      log('yellow', '⚠️  No hay cambios. Creando commit vacío para disparar deploy...')
      try {
        execSync(`git commit --allow-empty -m "${commitMessage}"`, { encoding: 'utf-8', stdio: 'pipe' })
        log('green', '✅ Commit vacío creado')
      } catch (emptyError) {
        log('red', '❌ Git commit vacío falló')
        log('red', (emptyError.message || '').substring(0, 300))
        process.exit(1)
      }
    } else {
      log('red', '❌ Git commit falló')
      log('red', msg.substring(0, 300))
      process.exit(1)
    }
  }

  // Step 3: Git Push
  log('cyan', '⏳ Git push...')
  try {
    execSync('git push origin main', { encoding: 'utf-8', stdio: 'pipe' })
    log('green', '✅ Git push')
  } catch (error) {
    log('red', '❌ Git push falló')
    log('red', error.message.substring(0, 300))
    process.exit(1)
  }

  log('green', `✅ ${commitMessage} enviado a main\n`)

  // Save the commit number for next time
  saveCommitNumber(commitNum)

  // Final success message
  log('bright', '\n' + '='.repeat(60))
  log('green', '✅ DEPLOY INICIADO')
  log('bright', '='.repeat(60))
  log('cyan', `Commit: ${commitMessage}`)
  log('cyan', `GitHub Actions: https://github.com/aMonteSl/aMonteSl.github.io/actions`)
  log('cyan', `Sitio: ${SITE_URL}`)
  log('yellow', 'Los cambios se desplegarán en 1-2 minutos...')
  log('bright', '='.repeat(60) + '\n')

  process.exit(0)
}

main().catch(error => {
  log('red', `\n❌ Error fatal: ${error.message}\n`)
  process.exit(1)
})
