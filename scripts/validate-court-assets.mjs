#!/usr/bin/env node
/**
 * CI guard: courts.json must reference .jpg assets that exist on disk.
 * Blocks regression to green SVG placeholders in static court data.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const courtsPath = join(root, "data", "courts.json");
const imagesDir = join(root, "public", "images", "courts");

function fail(message) {
  console.error(`validate-court-assets: ${message}`);
  process.exit(1);
}

let courts;
try {
  courts = JSON.parse(readFileSync(courtsPath, "utf8"));
} catch (err) {
  fail(`could not read ${courtsPath}: ${err.message}`);
}

if (!Array.isArray(courts)) {
  fail("courts.json must be a JSON array");
}

const errors = [];

for (const court of courts) {
  const name = court?.name || court?.$id || "unknown";
  const image = typeof court?.image === "string" ? court.image.trim() : "";

  if (!image) {
    errors.push(`${name}: missing image field`);
    continue;
  }

  if (/\.svg$/i.test(image)) {
    const jpgName = image.replace(/\.svg$/i, ".jpg");
    errors.push(
      `${name}: "${image}" is not allowed in courts.json — use "${jpgName}" (SVG placeholders are runtime fallback only)`,
    );
    continue;
  }

  if (!/\.(jpe?g|png|webp)$/i.test(image)) {
    errors.push(`${name}: "${image}" must be a raster photo (.jpg, .png, .webp)`);
    continue;
  }

  const diskPath = join(imagesDir, image);
  if (!existsSync(diskPath)) {
    errors.push(`${name}: "${image}" not found at public/images/courts/${image}`);
  }

  if (/^court-[1-4]\./i.test(image)) {
    const svgSibling = image.replace(/\.(jpe?g|png|webp)$/i, ".svg");
    const svgPath = join(imagesDir, svgSibling);
    if (existsSync(svgPath) && !existsSync(diskPath)) {
      errors.push(
        `${name}: only placeholder ${svgSibling} exists — add public/images/courts/${image}`,
      );
    }
  }
}

if (errors.length) {
  console.error("Court asset validation failed:\n");
  for (const line of errors) {
    console.error(`  - ${line}`);
  }
  process.exit(1);
}

console.log(`validate-court-assets: OK (${courts.length} courts)`);
