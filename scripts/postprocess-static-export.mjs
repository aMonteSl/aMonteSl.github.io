import { existsSync } from 'node:fs';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.resolve('out');
const SPANISH_OUT_DIR = path.join(OUT_DIR, 'es');

async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findHtmlFiles(fullPath);
      }

      return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
    }),
  );

  return files.flat();
}

async function updateSpanishHtmlLang() {
  if (!existsSync(SPANISH_OUT_DIR)) {
    console.log('postbuild: no Spanish export directory found, skipping lang patch.');
    return;
  }

  const htmlFiles = await findHtmlFiles(SPANISH_OUT_DIR);
  let updated = 0;

  await Promise.all(
    htmlFiles.map(async (filePath) => {
      const html = await readFile(filePath, 'utf8');
      const nextHtml = html
        .replace('<html lang="en"', '<html lang="es"')
        .replaceAll('\\"lang\\":\\"en\\"', '\\"lang\\":\\"es\\"');

      if (nextHtml !== html) {
        await writeFile(filePath, nextHtml);
        updated += 1;
      }
    }),
  );

  console.log(`postbuild: patched lang="es" in ${updated} Spanish HTML file(s).`);
}

await updateSpanishHtmlLang();
