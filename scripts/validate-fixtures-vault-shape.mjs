#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(root, "../lib/offline/schemas/sim.schema.json");
const vaultPath = path.resolve(root, "../lib/offline/fixturesVault.js");
const clientPath = path.resolve(root, "../lib/offline/fixturesVaultClient.js");
const dbPath = path.resolve(root, "../lib/offline/kopanoVaultDb.js");

const requiredExports = [
  ["fixturesVault.js", ["fixturesCacheKey", "readFixturesSnapshot", "writeFixturesSnapshot", "validateFixturesSnapshot"]],
  ["fixturesVaultClient.js", ["hydrateFromVaultThenFetch", "loadLeagueHubBundle", "loadFeaturedMatches"]],
  ["kopanoVaultDb.js", ["openKopanoVaultDB", "VAULT_STORES"]],
];

let failed = 0;

try {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  if (!schema.definitions?.FixturesSnapshot || !schema.definitions?.VaultFixture) {
    console.error("FAIL  sim.schema.json missing FixturesSnapshot or VaultFixture definitions");
    failed += 1;
  } else {
    console.log("OK    sim.schema.json shape");
  }
} catch (error) {
  console.error(`FAIL  sim.schema.json ${error.message}`);
  failed += 1;
}

for (const [label, exportsList] of requiredExports) {
  const filePath =
    label === "fixturesVault.js"
      ? vaultPath
      : label === "fixturesVaultClient.js"
        ? clientPath
        : dbPath;
  const source = await readFile(filePath, "utf8");
  for (const symbol of exportsList) {
    if (!source.includes(`export function ${symbol}`) && !source.includes(`export async function ${symbol}`) && !source.includes(`export const ${symbol}`)) {
      console.error(`FAIL  ${label} missing export ${symbol}`);
      failed += 1;
    }
  }
  if (failed === 0) {
    console.log(`OK    ${label} exports`);
  }
}

if (failed) {
  console.error(`\nvalidate-fixtures-vault-shape: ${failed} check(s) failed`);
  process.exit(1);
}

console.log("\nvalidate-fixtures-vault-shape: all checks passed");
