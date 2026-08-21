import { defineConfig } from 'astro/config';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, dirname, sep } from 'node:path';

/**
 * Rewrites root-absolute internal URLs (/_astro/…, /favicon.png) to document-relative
 * ones (./_astro/…) after the build.
 *
 * The site is served from the GitHub Pages project path
 * (billoosijok.github.io/dishtributer-website/), where root-absolute paths resolve
 * outside the site and 404. A hardcoded `base` would fix that URL but break the apex
 * custom domain; relative paths work at both, so the same artifact can move between
 * them with no config change.
 */
async function* walkHtml(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkHtml(full);
    else if (entry.isFile() && entry.name.endsWith('.html')) yield full;
  }
}

function relativeAssetPaths() {
  return {
    name: 'relative-asset-paths',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        let count = 0;

        for await (const abs of walkHtml(outDir)) {
          const html = await readFile(abs, 'utf8');

          // Depth below the site root sets the prefix:
          // index.html -> "./", about/index.html -> "../"
          const depth = dirname(relative(outDir, abs))
            .split(sep)
            .filter((s) => s && s !== '.').length;
          const prefix = depth === 0 ? './' : '../'.repeat(depth);

          // Single-slash root-absolute URLs only; leaves //cdn, https:// and #anchors alone.
          const rewritten = html.replace(/((?:href|src)=")\/(?!\/)/g, `$1${prefix}`);

          if (rewritten !== html) {
            await writeFile(abs, rewritten);
            count++;
          }
        }

        logger.info(`Rewrote absolute asset paths in ${count} page(s) to be mount-agnostic`);
      },
    },
  };
}

export default defineConfig({
  site: 'https://dishtributer.com',
  integrations: [relativeAssetPaths()],
});
