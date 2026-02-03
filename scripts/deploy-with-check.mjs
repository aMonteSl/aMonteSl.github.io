#!/usr/bin/env node

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEPLOY_COUNT_FILE = path.join(__dirname, '..', '.deploycount')
const REPO_URL = 'https://api.github.com/repos/aMonteSl/aMonteSl.github.io'
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
  log('cyan', '⏳ Esperando a que GitHub Actions complete el build...')
  
  const startTime = Date.now()
  let lastStatus = null
  let attemptCount = 0
  const maxAttempts = 24 // 2 minutos con 5 segundos entre intentos

  while (Date.now() - startTime < maxWaitSeconds * 1000 && attemptCount < maxAttempts) {
    try {
      // Obtener el último workflow run
      const response = await fetch(
        `${REPO_URL}/actions/runs?branch=main&event=push`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Deploy-Script'
          }
        }
      )

      if (!response.ok) {
        log('yellow', `  ⚠️  GitHub API no disponible (${response.status})`)
        await sleep(5000)
        attemptCount++
        continue
      }

      const data = await response.json()
      if (data.workflow_runs && data.workflow_runs.length > 0) {
        const run = data.workflow_runs[0]
        const status = run.status
        const conclusion = run.conclusion

        // Mostrar progreso cada intento
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000)
        log('cyan', `  ⏳ Estado: ${status} | Tiempo: ${elapsedSeconds}s`)

        if (status === 'completed') {
          if (conclusion === 'success') {
            log('green', `✅ GitHub Actions completó el build exitosamente`)
            return true
          } else {
            log('red', `❌ GitHub Actions falló con conclusión: ${conclusion}`)
            log('red', `Ver logs: https://github.com/aMonteSl/aMonteSl.github.io/actions/runs/${run.id}`)
            return false
          }
        }
      }

      await sleep(5000)
      attemptCount++
    } catch (error) {
      log('yellow', `  ⚠️  Error verificando GitHub Actions: ${error.message}`)
      await sleep(5000)
      attemptCount++
    }
  }

  log('red', '❌ Timeout esperando GitHub Actions (2 minutos)')
  return false
}

async function verifySiteUpdate() {
  log('cyan', '⏳ Verificando que la página se actualizó...')
  
  try {
    const response = await fetch(SITE_URL, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })

    if (response.ok) {
      const content = await response.text()
      // Check that the page loaded properly
      if (content.includes('<!DOCTYPE') || content.includes('<html')) {
        log('green', `✅ Página cargó correctamente (${response.status})`)
        return true
      } else {
        log('yellow', `⚠️  Página cargó pero contenido sospechoso`)
        return true // Still consider it success
      }
    } else {
      log('red', `❌ Error al cargar página (${response.status})`)
      return false
    }
  } catch (error) {
    log('red', `❌ No se pudo conectar a ${SITE_URL}`)
    log('red', error.message)
    return false
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  log('bright', '\n🚀 Iniciando Deploy a GitHub Pages\n')

  const commitNum = getCommitNumber()
  const commitMessage = getCommitMessage()

  // Step 1: Git Add
  log('cyan', '⏳ Git add...')
  try {
    execSync('git add .', { encoding: 'utf-8' })
    log('green', '✅ Git add')
  } catch (error) {
    log('red', '❌ Git add falló')
    process.exit(1)
  }

  // Step 2: Git Commit
  log('cyan', '⏳ Git commit...')
  try {
    execSync(`git commit -m "${commitMessage}"`, { encoding: 'utf-8' })
    log('green', '✅ Git commit')
  } catch (error) {
    const msg = error.message || ''
    if (msg.includes('nothing to commit')) {
      log('yellow', '⚠️  No hay cambios para commitear')
    } else {
      log('red', '❌ Git commit falló')
      log('red', msg.substring(0, 300))
      process.exit(1)
    }
  }

  // Step 3: Git Push
  log('cyan', '⏳ Git push...')
  try {
    execSync('git push origin main', { encoding: 'utf-8' })
    log('green', '✅ Git push')
  } catch (error) {
    log('red', '❌ Git push falló')
    log('red', error.message.substring(0, 300))
    process.exit(1)
  }

  log('green', `✅ ${commitMessage} enviado a main\n`)

  // Save the commit number for next time
  saveCommitNumber(commitNum)

  // Step 4: Wait for GitHub Actions
  log('bright', '\n📋 Etapa 2: Validar Deployment en GitHub\n')
  
  const actionsSuccess = await waitForGitHubActions()
  
  if (!actionsSuccess) {
    log('red', '\n❌ Deploy FALLÓ en GitHub Actions')
    log('red', 'Acciones:')
    log('red', '  1. Revisar los logs en: https://github.com/aMonteSl/aMonteSl.github.io/actions')
    log('red', '  2. Corregir el código')
    log('red', '  3. Reintentar: npm run deploy "tu mensaje"\n')
    process.exit(1)
  }

  // Wait a bit for the site to be updated
  log('cyan', '⏳ Esperando a que el sitio se actualice (30 segundos)...')
  await sleep(30000)

  // Step 5: Verify site update
  log('bright', '\n🌐 Etapa 3: Validar Actualización del Sitio\n')
  
  const siteSuccess = await verifySiteUpdate()

  if (!siteSuccess) {
    log('yellow', '\n⚠️  Advertencia: No se pudo validar la actualización del sitio')
    log('yellow', 'Pero GitHub Actions completó exitosamente.')
    log('yellow', 'Verifica manualmente: https://amontesl.github.io\n')
  }

  // Final success message
  log('bright', '\n' + '='.repeat(60))
  log('green', '✅ DEPLOY EXITOSO')
  log('bright', '='.repeat(60))
  log('cyan', `Commit: ${commitMessage}`)
  log('cyan', `Sitio: ${SITE_URL}`)
  log('cyan', `GitHub Actions: https://github.com/aMonteSl/aMonteSl.github.io/actions`)
  log('bright', '='.repeat(60) + '\n')

  process.exit(0)
}

main().catch(error => {
  log('red', `\n❌ Error fatal: ${error.message}\n`)
  process.exit(1)
})
