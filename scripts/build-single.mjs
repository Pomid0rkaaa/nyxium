import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

const minify = process.argv.includes('--minify');

await build({
  entryPoints: [resolve(root, 'src/index.ts')],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: resolve(root, minify ? 'dist/nyxium.min.mjs' : 'dist/nyxium.mjs'),
  minify,
  sourcemap: false,
  packages: 'external',
});

console.log(`Built ${minify ? 'minified' : 'single-file'} bundle to dist/${minify ? 'nyxium.min.mjs' : 'nyxium.mjs'}`);
