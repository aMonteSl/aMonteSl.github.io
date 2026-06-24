import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NODE = process.execPath;

const checks = [
  {
    label: 'lint',
    args: [path.join(ROOT, 'node_modules/eslint/bin/eslint.js')],
  },
  {
    label: 'typecheck',
    args: [path.join(ROOT, 'node_modules/typescript/bin/tsc'), '--noEmit'],
  },
  {
    label: 'translations',
    args: [path.join(ROOT, 'scripts/check-translations.mjs')],
  },
  {
    label: 'journey timeline',
    args: [path.join(ROOT, 'scripts/check-journey-timeline.mjs')],
  },
];

for (const check of checks) {
  console.log(`\n> ${check.label}`);

  const result = spawnSync(NODE, check.args, {
    cwd: ROOT,
    env: process.env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
