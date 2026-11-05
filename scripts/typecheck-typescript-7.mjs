import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const typescriptVersion = process.env.TYPESCRIPT_7_VERSION ?? "7.0.2";
const checkerCount = process.env.TYPESCRIPT_7_CHECKERS ?? "2";
const workspace = mkdtempSync(join(tmpdir(), "fivesarena-typescript-7-"));
const npmExecutable = process.platform === "win32" ? "npm.cmd" : "npm";
const tscExecutable = join(
  workspace,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "tsc.cmd" : "tsc",
);
const spawnOptions = {
  stdio: "inherit",
  ...(process.platform === "win32" ? { shell: true } : {}),
};

let exitCode = 1;

try {
  console.log(`[TypeScript 7] Installing typescript@${typescriptVersion} in an isolated workspace...`);

  const installResult = spawnSync(
    npmExecutable,
    [
      "install",
      "--prefix",
      workspace,
      "--no-package-lock",
      "--no-save",
      `typescript@${typescriptVersion}`,
    ],
    spawnOptions,
  );

  if (installResult.status !== 0) {
    exitCode = installResult.status ?? 1;
  } else {
    const versionResult = spawnSync(tscExecutable, ["--version"], {
      cwd: process.cwd(),
      ...spawnOptions,
    });

    if (versionResult.status !== 0) {
      exitCode = versionResult.status ?? 1;
    } else {
      const typecheckResult = spawnSync(
        tscExecutable,
        [
          "--project",
          "tsconfig.json",
          "--noEmit",
          "--pretty",
          "false",
          "--checkers",
          checkerCount,
          ...process.argv.slice(2),
        ],
        {
          cwd: process.cwd(),
          ...spawnOptions,
        },
      );

      exitCode = typecheckResult.status ?? 1;
    }
  }
} finally {
  rmSync(workspace, { recursive: true, force: true });
}

process.exitCode = exitCode;
