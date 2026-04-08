"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaCloud,
  FaExternalLinkAlt,
  FaPlay,
  FaShieldAlt,
  FaStop,
  FaSyncAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

function StatusPill({ status }) {
  const styles = {
    running: "bg-cyan-500/15 text-cyan-200 border-cyan-500/30",
    stopped: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
    pending: "bg-amber-500/15 text-amber-200 border-amber-500/30",
    failed: "bg-rose-500/15 text-rose-200 border-rose-500/30",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${styles[status] || styles.stopped}`}>
      {status || "idle"}
    </span>
  );
}

export default function AdminSandboxPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState("hello-node");
  const [runState, setRunState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function loadSandboxInfo() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/sandbox", { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to load sandbox info");
      }

      setConfig(payload.config);
      setPresets(payload.presets || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session.user.activeRole !== "admin") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      loadSandboxInfo();
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!runState?.sandboxId || !runState?.cmdId || runState?.status === "stopped") {
      return undefined;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/admin/sandbox?sandboxId=${runState.sandboxId}&cmdId=${runState.cmdId}`,
          { cache: "no-store" },
        );
        const payload = await response.json();

        if (response.ok) {
          setRunState((current) => ({
            ...current,
            ...payload,
          }));
        }
      } catch {
        // Leave the last known state in place during polling failures.
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [runState?.sandboxId, runState?.cmdId, runState?.status]);

  const selectedPresetMeta = useMemo(
    () => presets.find((preset) => preset.key === selectedPreset),
    [presets, selectedPreset],
  );

  async function handleRunPreset() {
    setRunning(true);
    setError("");

    try {
      const response = await fetch("/api/admin/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "run",
          preset: selectedPreset,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to run sandbox preset");
      }

      setRunState(payload);
    } catch (runError) {
      setError(runError.message);
    } finally {
      setRunning(false);
    }
  }

  async function handleStopSandbox() {
    if (!runState?.sandboxId) {
      return;
    }

    setRunning(true);
    setError("");

    try {
      const response = await fetch("/api/admin/sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "stop",
          sandboxId: runState.sandboxId,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to stop sandbox");
      }

      setRunState((current) => ({
        ...current,
        ...payload,
      }));
    } catch (stopError) {
      setError(stopError.message);
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-5xl rounded-3xl border border-gray-800 bg-gray-900 p-8 text-center text-sm text-gray-400">
          Loading sandbox console…
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-950 px-4 py-10 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white">
              Sandbox Console
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Admin-only Firecracker workflows with whitelisted presets and explicit stop controls.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadSandboxInfo}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-300 transition hover:border-gray-500 hover:text-white"
            >
              <FaSyncAlt size={11} />
              Refresh
            </button>
            <Link
              href="/admin/integrations"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/20"
            >
              Integrations
              <FaExternalLinkAlt size={11} />
            </Link>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                  Configuration
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <FaCloud className="text-2xl text-cyan-300" />
                  <StatusPill status={config?.configured ? "running" : "failed"} />
                </div>
              </div>
              <FaShieldAlt className="text-xl text-gray-500" />
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-300">
              <div>Project: {config?.projectId || "missing"}</div>
              <div>Team: {config?.teamId || "missing"}</div>
              <div>Auth mode: {config?.authMode || "missing"}</div>
              <div>Linked project: {config?.linkedProjectName || "unknown"}</div>
            </div>

            <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-950/70 p-4 text-sm leading-6 text-gray-400">
              The console only runs whitelisted workflows. There is no arbitrary shell box here, and every active sandbox has an explicit stop path.
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-5">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Presets
            </div>
            <div className="mt-4 space-y-3">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => setSelectedPreset(preset.key)}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    selectedPreset === preset.key
                      ? "border-cyan-400 bg-cyan-500/10"
                      : "border-gray-800 bg-gray-950/70 hover:border-gray-700"
                  }`}
                >
                  <div className="text-lg font-bold text-white">{preset.label}</div>
                  <div className="mt-1 text-sm text-gray-400">{preset.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={handleRunPreset}
                disabled={running || !config?.configured}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaPlay size={11} />
                {running ? "Running…" : `Run ${selectedPresetMeta?.label || "Preset"}`}
              </button>
              <button
                onClick={handleStopSandbox}
                disabled={running || !runState?.sandboxId || runState?.status === "stopped"}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaStop size={11} />
                Stop
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-gray-900 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Last run
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="text-lg font-bold text-white">
                  {runState?.preset || "No preset run yet"}
                </div>
                <StatusPill status={runState?.status} />
              </div>
            </div>

            {runState?.previewUrl ? (
              <a
                href={runState.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/20"
              >
                Open Preview
                <FaExternalLinkAlt size={11} />
              </a>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Metadata
              </div>
              <div className="mt-3 space-y-2 text-sm text-gray-300">
                <div>Sandbox: {runState?.sandboxId || "—"}</div>
                <div>Command: {runState?.cmdId || "—"}</div>
                <div>Runtime: {runState?.runtime || "—"}</div>
                <div>Exit code: {runState?.exitCode ?? "pending"}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Structured result
              </div>
              <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-6 text-gray-300">
                {runState?.report ? JSON.stringify(runState.report, null, 2) : "No report payload yet."}
              </pre>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Stdout
              </div>
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-6 text-gray-200">
                {runState?.stdout || "No stdout captured yet."}
              </pre>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-950/70 p-4">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Stderr
              </div>
              <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-6 text-rose-200">
                {runState?.stderr || "No stderr captured."}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
