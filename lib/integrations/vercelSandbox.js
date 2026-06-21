import { readFile } from "node:fs/promises";
import path from "node:path";
import { Sandbox } from "@vercel/sandbox";
import { getFirstEnv } from "@/lib/config/env";

const DEFAULT_SANDBOX_TIMEOUT_MS = 5 * 60 * 1000;
const DEFAULT_PREVIEW_PORT = 3000;

const PRESETS = {
  "hello-node": {
    key: "hello-node",
    label: "Hello Node",
    description: "Create a sandbox, write a tiny Node script, run it, and capture stdout plus an output file.",
    runtime: "node24",
  },
  "preview-http": {
    key: "preview-http",
    label: "Preview Server",
    description: "Create a sandbox, boot a tiny HTTP server, expose port 3000, and return a live preview URL.",
    runtime: "node24",
    port: DEFAULT_PREVIEW_PORT,
  },
};

async function readLinkedProjectFile() {
  try {
    const projectFile = path.join(process.cwd(), ".vercel", "project.json");
    const raw = await readFile(projectFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getSandboxPresets() {
  return Object.values(PRESETS);
}

export async function getVercelSandboxConfig() {
  const linkedProject = await readLinkedProjectFile();
  const token = getFirstEnv("VERCEL_TOKEN");
  const oidcToken = getFirstEnv("VERCEL_OIDC_TOKEN");
  const projectId =
    getFirstEnv("VERCEL_PROJECT_ID", "NEXT_PUBLIC_VERCEL_PROJECT_ID") ||
    linkedProject.projectId ||
    "";
  const teamId =
    getFirstEnv("VERCEL_TEAM_ID", "VERCEL_ORG_ID", "NEXT_PUBLIC_VERCEL_TEAM_ID") ||
    linkedProject.orgId ||
    "";

  return {
    configured: Boolean(projectId && teamId && (token || oidcToken)),
    projectId,
    teamId,
    authMode: token ? "token" : oidcToken ? "oidc" : "missing",
    hasToken: Boolean(token),
    hasOidcToken: Boolean(oidcToken),
    runtime: "node24",
    linkedProjectName: linkedProject.projectName || "",
  };
}

async function getSandboxCredentials() {
  const config = await getVercelSandboxConfig();

  if (!config.projectId || !config.teamId) {
    throw new Error("Vercel Sandbox requires linked project and team identifiers.");
  }

  if (!config.hasToken && !config.hasOidcToken) {
    throw new Error("Vercel Sandbox credentials are missing. Add VERCEL_TOKEN locally or use OIDC in Vercel.");
  }

  return {
    projectId: config.projectId,
    teamId: config.teamId,
    ...(config.hasToken ? { token: getFirstEnv("VERCEL_TOKEN") } : {}),
  };
}

async function createSandboxBase({ runtime, port }) {
  const credentials = await getSandboxCredentials();

  return Sandbox.create({
    ...credentials,
    runtime,
    timeout: DEFAULT_SANDBOX_TIMEOUT_MS,
    ...(port ? { ports: [port] } : {}),
  });
}

async function runHelloNodePreset() {
  const sandbox = await createSandboxBase({ runtime: PRESETS["hello-node"].runtime });

  try {
    await sandbox.writeFiles([
      {
        path: "index.mjs",
        content: `
import { writeFileSync } from "node:fs";

const report = {
  message: "Hello from Vercel Sandbox",
  runtime: process.version,
  cwd: process.cwd(),
};

writeFileSync("report.json", JSON.stringify(report, null, 2));
console.log(report.message);
console.log(report.runtime);
        `.trim(),
      },
    ]);

    const result = await sandbox.runCommand("node", ["index.mjs"]);
    const reportBuffer = await sandbox.readFileToBuffer({ path: "report.json" });

    return {
      preset: PRESETS["hello-node"].key,
      sandboxId: sandbox.sandboxId,
      runtime: PRESETS["hello-node"].runtime,
      status: sandbox.status,
      exitCode: result.exitCode,
      stdout: await result.stdout(),
      stderr: await result.stderr(),
      report: reportBuffer ? JSON.parse(reportBuffer.toString("utf8")) : null,
      previewUrl: "",
    };
  } finally {
    await sandbox.stop({ blocking: true }).catch(() => null);
  }
}

async function runPreviewHttpPreset() {
  const sandbox = await createSandboxBase({
    runtime: PRESETS["preview-http"].runtime,
    port: PRESETS["preview-http"].port,
  });

  await sandbox.writeFiles([
    {
      path: "server.mjs",
      content: `
import http from "node:http";

const port = Number(process.env.PORT || 3000);

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(\`
    <html>
      <body style="font-family:Arial,sans-serif;padding:24px;background:#0f172a;color:#e2e8f0">
        <h1>Bookit 5's Arena Sandbox</h1>
        <p>This preview is running inside a Vercel Sandbox microVM.</p>
      </body>
    </html>
  \`);
});

server.listen(port, "0.0.0.0", () => {
  console.log("preview-ready:" + port);
});
      `.trim(),
    },
  ]);

  const command = await sandbox.runCommand({
    cmd: "node",
    args: ["server.mjs"],
    detached: true,
    env: { PORT: String(DEFAULT_PREVIEW_PORT) },
  });

  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    preset: PRESETS["preview-http"].key,
    sandboxId: sandbox.sandboxId,
    cmdId: command.cmdId,
    runtime: PRESETS["preview-http"].runtime,
    status: sandbox.status,
    exitCode: command.exitCode,
    stdout: "",
    stderr: "",
    previewUrl: sandbox.domain(DEFAULT_PREVIEW_PORT),
  };
}

export async function runSandboxPreset(presetKey) {
  if (presetKey === PRESETS["hello-node"].key) {
    return runHelloNodePreset();
  }

  if (presetKey === PRESETS["preview-http"].key) {
    return runPreviewHttpPreset();
  }

  throw new Error("Unknown sandbox preset.");
}

export async function getSandboxStatus({ sandboxId, cmdId }) {
  const credentials = await getSandboxCredentials();
  const sandbox = await Sandbox.get({
    ...credentials,
    sandboxId,
  });

  let command = null;
  let stdout = "";
  let stderr = "";
  let exitCode = null;

  if (cmdId) {
    command = await sandbox.getCommand(cmdId);
    stdout = await command.stdout().catch(() => "");
    stderr = await command.stderr().catch(() => "");
    exitCode = command.exitCode;
  }

  let previewUrl = "";
  try {
    previewUrl = sandbox.domain(DEFAULT_PREVIEW_PORT);
  } catch {
    previewUrl = "";
  }

  return {
    sandboxId: sandbox.sandboxId,
    cmdId: command?.cmdId || cmdId || "",
    status: sandbox.status,
    exitCode,
    stdout,
    stderr,
    previewUrl,
    runtime: "node24",
  };
}

export async function stopSandboxInstance(sandboxId) {
  const credentials = await getSandboxCredentials();
  const sandbox = await Sandbox.get({
    ...credentials,
    sandboxId,
  });
  const stopped = await sandbox.stop({ blocking: true });

  return {
    sandboxId: sandbox.sandboxId,
    status: stopped.status,
  };
}
