"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGoogle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChartLine,
  FaShieldAlt,
  FaYoutube,
  FaTable,
  FaEnvelope,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
  FaUsers,
  FaCog,
  FaSave,
  FaSyncAlt,
  FaCrown,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const API_ICONS = {
  maps: FaMapMarkerAlt,
  calendar: FaCalendarAlt,
  analytics: FaChartLine,
  recaptcha: FaShieldAlt,
  youtube: FaYoutube,
  sheets: FaTable,
  gmail: FaEnvelope,
  search: FaSearch,
};

const API_COLORS = {
  maps: "from-green-500/20 to-green-900/10 border-green-500/30",
  calendar: "from-blue-500/20 to-blue-900/10 border-blue-500/30",
  analytics: "from-orange-500/20 to-orange-900/10 border-orange-500/30",
  recaptcha: "from-purple-500/20 to-purple-900/10 border-purple-500/30",
  youtube: "from-red-500/20 to-red-900/10 border-red-500/30",
  sheets: "from-emerald-500/20 to-emerald-900/10 border-emerald-500/30",
  gmail: "from-rose-500/20 to-rose-900/10 border-rose-500/30",
  search: "from-cyan-500/20 to-cyan-900/10 border-cyan-500/30",
};

const ICON_COLORS = {
  maps: "text-green-400",
  calendar: "text-blue-400",
  analytics: "text-orange-400",
  recaptcha: "text-purple-400",
  youtube: "text-red-400",
  sheets: "text-emerald-400",
  gmail: "text-rose-400",
  search: "text-cyan-400",
};

const ROLES = ["guest", "user", "manager", "admin"];

function RoleBadge({ role, active, onClick }) {
  const colors = {
    guest: active
      ? "bg-zinc-500/30 text-zinc-200 border-zinc-400/50"
      : "bg-zinc-900/30 text-zinc-600 border-zinc-700/30",
    user: active
      ? "bg-blue-500/30 text-blue-200 border-blue-400/50"
      : "bg-zinc-900/30 text-zinc-600 border-zinc-700/30",
    manager: active
      ? "bg-amber-500/30 text-amber-200 border-amber-400/50"
      : "bg-zinc-900/30 text-zinc-600 border-zinc-700/30",
    admin: active
      ? "bg-red-500/30 text-red-200 border-red-400/50"
      : "bg-zinc-900/30 text-zinc-600 border-zinc-700/30",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-200 hover:scale-105 ${colors[role]}`}
    >
      {role}
    </button>
  );
}

export default function AdminGoogleApisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);

  const isSuperAdmin =
    session?.user?.email?.toLowerCase() === "rkholofelo@gmail.com";

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/google", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setConfigs(data.configs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session.user.activeRole !== "admin") {
      router.push("/");
      return;
    }
    if (status === "authenticated") fetchConfigs();
  }, [status, session, router, fetchConfigs]);

  async function toggleApi(apiKey, currentEnabled) {
    setSaving(apiKey);
    setError("");
    try {
      const res = await fetch("/api/admin/google", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, enabled: !currentEnabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to toggle");
      setConfigs((prev) =>
        prev.map((c) => (c.apiKey === apiKey ? data.config : c)),
      );
      setSuccess(`${data.config.label} ${data.config.enabled ? "enabled" : "disabled"}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  }

  async function toggleRole(apiKey, role, currentVisibleTo) {
    setSaving(apiKey);
    try {
      const newVisibleTo = { ...currentVisibleTo, [role]: !currentVisibleTo[role] };
      const res = await fetch("/api/admin/google", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, visibleTo: newVisibleTo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setConfigs((prev) =>
        prev.map((c) => (c.apiKey === apiKey ? data.config : c)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-4">
          <FaGoogle className="animate-spin text-4xl text-white/30" />
          <span className="text-sm text-white/40">Loading Google APIs...</span>
        </div>
      </div>
    );
  }

  const enabledCount = configs.filter((c) => c.enabled).length;
  const configuredCount = configs.filter((c) => c.configured).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <FaGoogle className="text-2xl text-white/80" />
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                Google APIs
              </h1>
              {isSuperAdmin && (
                <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-400">
                  <FaCrown className="text-[8px]" /> God Mode
                </span>
              )}
            </div>
            <p className="text-sm text-white/40">
              Toggle APIs, control feature visibility per role, manage all
              Google integrations.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <div className="text-lg font-black text-green-400">{enabledCount}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">
                Active
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <div className="text-lg font-black text-cyan-400">{configuredCount}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">
                Configured
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
              <div className="text-lg font-black text-white/60">{configs.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30">
                Total
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Seed prompt */}
        {configs.length === 0 && !loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <FaGoogle className="mx-auto mb-4 text-4xl text-white/20" />
            <p className="mb-2 text-white/60">No Google API configs found.</p>
            <p className="text-sm text-white/30">
              Run{" "}
              <code className="rounded bg-white/10 px-2 py-1 font-mono text-xs">
                node scripts/seedGoogleApis.js
              </code>{" "}
              to seed defaults.
            </p>
          </div>
        )}

        {/* API Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {configs.map((config) => {
            const Icon = API_ICONS[config.apiKey] || FaGoogle;
            const colorClass = API_COLORS[config.apiKey] || "";
            const iconColor = ICON_COLORS[config.apiKey] || "text-white/60";
            const isExpanded = expandedCard === config.apiKey;
            const visibleTo = config.visibleTo || {};

            return (
              <motion.div
                key={config.apiKey}
                layout
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all ${colorClass} ${config.enabled ? "opacity-100" : "opacity-60"}`}
              >
                {/* Top row */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl bg-black/30 ${iconColor}`}
                    >
                      <Icon className="text-lg" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{config.label}</h3>
                      <p className="max-w-[220px] text-[11px] leading-snug text-white/40">
                        {config.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle */}
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => toggleApi(config.apiKey, config.enabled)}
                      disabled={saving === config.apiKey}
                      className="transition-transform hover:scale-110"
                    >
                      {config.enabled ? (
                        <FaToggleOn className="text-3xl text-green-400" />
                      ) : (
                        <FaToggleOff className="text-3xl text-white/20" />
                      )}
                    </button>
                  )}
                </div>

                {/* Status badges */}
                <div className="mb-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                      config.enabled
                        ? "border-green-500/30 bg-green-500/15 text-green-300"
                        : "border-zinc-500/30 bg-zinc-500/15 text-zinc-400"
                    }`}
                  >
                    {config.enabled ? "Active" : "Disabled"}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                      config.configured
                        ? "border-cyan-500/30 bg-cyan-500/15 text-cyan-300"
                        : "border-amber-500/30 bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    {config.configured ? "Configured" : "Needs Setup"}
                  </span>
                </div>

                {/* Role distribution */}
                <div className="mb-3">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <FaUsers className="text-[10px] text-white/30" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                      Visible to
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {ROLES.map((role) => (
                      <RoleBadge
                        key={role}
                        role={role}
                        active={visibleTo[role]}
                        onClick={() =>
                          isSuperAdmin &&
                          toggleRole(config.apiKey, role, visibleTo)
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Expand for settings */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedCard(isExpanded ? null : config.apiKey)
                  }
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30 transition-colors hover:text-white/60"
                >
                  <FaCog className="text-[8px]" />
                  {isExpanded ? "Hide Settings" : "Settings"}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <div className="rounded-xl bg-black/30 p-3">
                        <pre className="max-h-40 overflow-auto text-[11px] leading-relaxed text-white/50">
                          {JSON.stringify(config.settings, null, 2)}
                        </pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Loading overlay */}
                {saving === config.apiKey && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                    <FaSyncAlt className="animate-spin text-xl text-white/60" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer hint */}
        {configs.length > 0 && (
          <p className="mt-6 text-center text-[11px] text-white/20">
            Only the super admin (God Mode) can toggle APIs and change role
            visibility. Changes take effect immediately.
          </p>
        )}
      </div>
    </div>
  );
}
