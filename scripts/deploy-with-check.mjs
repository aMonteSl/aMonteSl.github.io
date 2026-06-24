#!/usr/bin/env node

import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

function log(color, text) {
  console.log(`${colors[color] || ''}${text}${colors.reset}`)
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: 'utf-8',
    stdio: options.capture ? 'pipe' : 'inherit',
    shell: process.platform === 'win32',
  })
}

function git(args, options = {}) {
  return run('git', args, options)
}

function npm(args) {
  return run('npm', args)
}

function getCurrentBranch() {
  return git(['branch', '--show-current'], { capture: true }).trim()
}

function getCommitMessage() {
  const message = process.argv.slice(2).join(' ').trim()
  return message || 'chore: ship portfolio updates'
}

function hasChanges() {
  return git(['status', '--porcelain'], { capture: true }).trim().length > 0
}

function main() {
  log('bright', '\nPreparing portfolio branch for GitHub\n')

  const branch = getCurrentBranch()
  if (!branch) {
    log('red', 'Could not detect the current branch.')
    process.exit(1)
  }

  if (branch === 'main') {
    log('red', 'Refusing to commit or push directly to main. Create a feature branch first.')
    process.exit(1)
  }

  log('cyan', 'Running checks...')
  npm(['run', 'check'])

  log('cyan', 'Building static export...')
  npm(['run', 'build'])

  if (!hasChanges()) {
    log('yellow', 'No changes to commit. Pushing the current branch anyway.')
    git(['push', '-u', 'origin', branch])
    return
  }

  const commitMessage = getCommitMessage()

  log('cyan', 'Staging changes...')
  git(['add', '-A'])

  log('cyan', `Creating commit: ${commitMessage}`)
  git(['commit', '-m', commitMessage])

  log('cyan', `Pushing ${branch}...`)
  git(['push', '-u', 'origin', branch])

  log('green', `\nBranch pushed: ${branch}`)
  log('cyan', 'Open a pull request into main to trigger the reviewed GitHub Pages deploy.')
}

main()
