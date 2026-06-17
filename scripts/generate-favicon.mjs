/**
 * One-shot script — run once to bake favicon PNGs from the source SVG.
 * Usage: node scripts/generate-favicon.mjs
 * Requires: npm install --save-dev sharp
 */

import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcPath = join(root, "public", "favicon-source.jpeg");
const srcBuffer = readFileSync(srcPath);

const sizes = [
  { name: "favicon-48.png",       size: 48  },
  { name: "favicon-192.png",      size: 192 },
  { name: "favicon-512.png",      size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  const dest = join(root, "public", name);
  await sharp(srcBuffer)
    .resize(size, size, { fit: "contain", background: { r: 7, g: 7, b: 10, alpha: 1 } })
    .png()
    .toFile(dest);
  console.log(`✓ public/${name}  (${size}×${size})`);
}

console.log("\nDone. Commit the new files in public/ and push.");
