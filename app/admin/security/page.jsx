"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaLock,
  FaUserShield,
  FaGlobe,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaPlus,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";

const SUPER_ADMIN_EMAIL = "rkholofelo@gmail.com";

/* ─── Mock Data ──────────────────────────────────────────────── */

// TODO: Replace with API calls to /api/admin/security/*
const MOCK_SESSIONS = [
  { id: 1, user: "rkholofelo@gmail.com", ip: "102.134.56.78", device: "Chrome / Windows 11", lastActive: "2 min ago" },
  { id: 2, user: "manager@fivesarena.com", ip: "102.134.56.90", device: "Safari / macOS", lastActive: "15 min ago" },
  { id: 3, user: "player1@gmail.com", ip: "41.13.22.100", device: "Mobile / Android", lastActive: "1 hr ago" },
];

const MOCK_LOGIN_ATTEMPTS = [
  { id: 1, email: "unknown@test.com", ip: "185.220.101.34", timestamp: "2026-04-12 09:14:22", status: "blocked" },
  { id: 2, email: "admin@fivesarena.com", ip: "102.134.56.78", timestamp: "2026-04-12 08:55:01", status: "failed" },
  { id: 3, email: "hacker@evil.com", ip: "45.33.32.156", timestamp: "2026-04-12 07:30:44", status: "blocked" },
  { id: 4, email: "manager@fivesarena.com", ip: "102.134.56.90", timestamp: "2026-04-12 06:12:10", status: "failed" },
];

const RATE_LIMITS = [
  { id: "api", label: "API Endpoints", limit: "100 req/min", enabled: true },
  { id: "auth", label: "Auth Endpoints", limit: "10 req/min", enabled: true },
  { id: "admin", label: "Admin Endpoints", limit: "50 req/min", enabled: true },
];

const SECURITY_HEADERS = [
  { name: "X-Frame-Options", status: true, value: "DENY" },
  { name: "Content-Security-Policy", status: true, value: "default-src 'self'" },
  { name: "Strict-Transport-Security", status: true, value: "max-age=31536000" },
  { name: "X-Content-Type-Options", status: true, value: "nosniff" },
  { name: "Referrer-Policy", status: true, value: "strict-origin-when-cross-origin" },
];
// NOTE: Header statuses are hardcoded — verify against actual server config

/* ─── Animation Variants ─────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* ─── Section Card Wrapper ───────────────────────────────────── */

function SectionCard({ icon: Icon, title, children }) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <Icon className="text-green-400" size={18} />
        <h2 className="text-sm font-black uppercase tracking-widest text-white">
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
}

/* ─── Page Component ─────────────────────────────────────────── */

export default function AdminSecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // IP Whitelist state (localStorage-backed)
  const [whitelist, setWhitelist] = useState([]);
  const [newIp, setNewIp] = useState("");

  // Rate limit toggle state (placeholder)
  const [rateLimits, setRateLimits] = useState(RATE_LIMITS);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session.user.email !== SUPER_ADMIN_EMAIL) {
      router.push("/");
    }
  }, [status, session, router]);

  // Load whitelist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin_ip_whitelist");
      if (saved) setWhitelist(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const saveWhitelist = (list) => {
    setWhitelist(list);
    localStorage.setItem("admin_ip_whitelist", JSON.stringify(list));
  };

  const addIp = () => {
    const trimmed = newIp.trim();
    if (!trimmed || whitelist.includes(trimmed)) return;
    saveWhitelist([...whitelist, trimmed]);
    setNewIp("");
  };

  const removeIp = (ip) => {
    saveWhitelist(whitelist.filter((i) => i !== ip));
  };

  const toggleRateLimit = (id) => {
    // TODO: Wire to API
    setRateLimits((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  /* ─── Guards ─────────────────────────────────────────────────── */

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <FaSpinner className="text-green-500 animate-spin" size={24} />
      </div>
    );
  }

  if (session?.user?.email !== SUPER_ADMIN_EMAIL) return null;

  /* ─── Render ─────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-gray-950 pt-28 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaShieldAlt className="text-green-400" size={22} />
            <h1 className="text-2xl font-black uppercase tracking-widest text-white">
              Security Control Center
            </h1>
          </div>
          <p className="text-sm text-gray-500 tracking-wide">
            Super admin only &mdash; monitor sessions, rate limits, and security posture.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* ── 1. Active Sessions ──────────────────────────────── */}
          <SectionCard icon={FaUserShield} title="Active Sessions">
            {/* TODO: Fetch from /api/admin/security/sessions */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                    <th className="pb-3 pr-4">User</th>
                    <th className="pb-3 pr-4">IP</th>
                    <th className="pb-3 pr-4">Device</th>
                    <th className="pb-3 pr-4">Last Active</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SESSIONS.map((s) => (
                    <tr key={s.id} className="border-b border-gray-800/50">
                      <td className="py-3 pr-4 text-white font-medium">{s.user}</td>
                      <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{s.ip}</td>
                      <td className="py-3 pr-4 text-gray-400">{s.device}</td>
                      <td className="py-3 pr-4 text-gray-500">{s.lastActive}</td>
                      <td className="py-3">
                        <button
                          className="rounded-lg border border-red-700/50 bg-red-900/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-400 hover:bg-red-900/60 transition-colors"
                          onClick={() => {
                            // TODO: Call revoke session API
                            alert(`Revoke session for ${s.user} — not yet wired`);
                          }}
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* ── 2. Login Attempts ───────────────────────────────── */}
          <SectionCard icon={FaExclamationTriangle} title="Recent Failed Login Attempts">
            {/* TODO: Fetch from /api/admin/security/login-attempts */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4">IP</th>
                    <th className="pb-3 pr-4">Timestamp</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_LOGIN_ATTEMPTS.map((a) => (
                    <tr key={a.id} className="border-b border-gray-800/50">
                      <td className="py-3 pr-4 text-white font-medium">{a.email}</td>
                      <td className="py-3 pr-4 text-gray-400 font-mono text-xs">{a.ip}</td>
                      <td className="py-3 pr-4 text-gray-500 font-mono text-xs">{a.timestamp}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
                            a.status === "blocked"
                              ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* ── 3. Rate Limiting ────────────────────────────────── */}
          <SectionCard icon={FaLock} title="Rate Limiting">
            <div className="grid gap-4 sm:grid-cols-3">
              {rateLimits.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-gray-800 bg-gray-950/60 p-4 flex flex-col gap-3"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                    {r.label}
                  </p>
                  <p className="text-lg font-bold text-white">{r.limit}</p>
                  <button
                    onClick={() => toggleRateLimit(r.id)}
                    className={`mt-auto self-start rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
                      r.enabled
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-zinc-500/15 text-zinc-300 border-zinc-500/30"
                    }`}
                  >
                    {r.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              ))}
            </div>
            {/* TODO: Wire toggles to actual rate-limit config API */}
          </SectionCard>

          {/* ── 4. IP Whitelist ─────────────────────────────────── */}
          <SectionCard icon={FaGlobe} title="IP Whitelist">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIp()}
                placeholder="e.g. 102.134.56.78"
                className="flex-1 rounded-xl border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-green-500/50 transition-colors"
              />
              <button
                onClick={addIp}
                className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-green-400 hover:bg-green-500/20 transition-colors"
              >
                <FaPlus size={14} />
              </button>
            </div>
            {whitelist.length === 0 ? (
              <p className="text-sm text-gray-600">No whitelisted IPs yet.</p>
            ) : (
              <ul className="space-y-2">
                {whitelist.map((ip) => (
                  <li
                    key={ip}
                    className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950/60 px-4 py-2.5"
                  >
                    <span className="text-sm font-mono text-gray-300">{ip}</span>
                    <button
                      onClick={() => removeIp(ip)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {/* TODO: Persist whitelist to database instead of localStorage */}
          </SectionCard>

          {/* ── 5. Security Headers ────────────────────────────── */}
          <SectionCard icon={FaShieldAlt} title="Security Headers">
            {/* NOTE: Statuses are hardcoded — verify against actual next.config / middleware headers */}
            <ul className="space-y-3">
              {SECURITY_HEADERS.map((h) => (
                <li
                  key={h.name}
                  className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-950/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-bold text-white">{h.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{h.value}</p>
                  </div>
                  {h.status ? (
                    <FaCheckCircle className="text-emerald-400" size={16} />
                  ) : (
                    <FaTimes className="text-red-400" size={16} />
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>
        </motion.div>
      </div>
    </div>
  );
}
