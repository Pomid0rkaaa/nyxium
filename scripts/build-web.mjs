import { build } from "esbuild";
import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, "..");

const outdir = resolve(root, "dist/web");

await mkdir(outdir, { recursive: true });

await build({
	entryPoints: [resolve(root, "src/web.ts")],
	bundle: true,
	platform: "browser",
	target: "es2022",
	format: "iife",
	outfile: resolve(outdir, "nyxium.min.js"),
	minify: true,
	sourcemap: false,
});

await cp(resolve(root, "web/index.html"), resolve(outdir, "index.html"));
await cp(resolve(root, "web/style.css"), resolve(outdir, "style.css"));

console.log(`Built web bundle to ${resolve(outdir, "nyxium.min.js")}`);
