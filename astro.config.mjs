import { defineConfig } from 'astro/config';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { relative, dirname, sep } from 'node:path';
import { glob } from 'node:fs/promises';

/**
 * Rewrites root-absolute internal URLs (/_astro/…, /favicon.png) to document-relative
 * ones (./_astro/…) after the build.
 *
 * The site is served from two mount points: the GitHub Pages project path
 * (billoosijok.github.io/dishtributer-website/) and, once DNS lands, the apex
 * custom domain (dishtributer.com/). Root-absolute paths only work at the apex;
 * a hardcoded `base` only works at the project path. Relative paths work at both.
 */
function relativeAssetPaths() {
  return {
    name: 'relative-asset-paths',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        let count = 0;

        for await (const file of glob('**/*.html', { cwd: outDir })) {
          const abs = `${outDir}${file}`;
          const html = await readFile(abs, 'utf8');

          // Depth of this page below the site root determines the prefix:
          // index.html -> "./", about/index.html -> "../"
          const depth = dirname(relative(outDir, abs)).split(sep).filter((s) => s && s !== '.').length;
          const prefix = depth === 0 ? './' : '../'.repeat(depth);

          // Only single-slash root-absolute URLs; leaves //cdn, https://, and #anchors alone.
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
