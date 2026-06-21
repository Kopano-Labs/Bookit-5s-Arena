"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaHistory,
  FaFilter,
  FaDownload,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";

const SUPER_ADMIN_EMAIL = "rkholofelo@gmail.com";

/* ─── Mock Data ──────────────────────────────────────────────── */

const MOCK_LOG_ENTRIES = [
  { id: 1, timestamp: "2026-04-12 10:42:18", action: "Auth", user: "rkholofelo@gmail.com", details: "Super admin login via Google OAuth", ip: "102.134.56.78", status: "success" },
  { id: 2, timestamp: "2026-04-12 10:38:05", action: "Role Change", user: "rkholofelo@gmail.com", details: "Promoted manager@fivesarena.com to Manager role", ip: "102.134.56.78", status: "success" },
  { id: 3, timestamp: "2026-04-12 10:15:33", action: "Feature Flag", user: "rkholofelo@gmail.com", details: "Enabled 'rewards_system' feature flag", ip: "102.134.56.78", status: "success" },
  { id: 4, timestamp: "2026-04-12 09:55:12", action: "Auth", user: "unknown@test.com", details: "Failed login attempt — invalid credentials", ip: "185.220.101.34", status: "error" },
  { id: 5, timestamp: "2026-04-12 09:44:01", action: "Booking", user: "player1@gmail.com", details: "Booked Court 1 — 18:00-19:00 (R350)", ip: "41.13.22.100", status: "success" },
  { id: 6, timestamp: "2026-04-12 09:30:22", action: "System", user: "system", details: "Automated backup completed successfully", ip: "127.0.0.1", status: "success" },
  { id: 7, timestamp: "2026-04-12 09:14:22", action: "Auth", user: "hacker@evil.com", details: "Blocked login — rate limit exceeded", ip: "45.33.32.156", status: "error" },
  { id: 8, timestamp: "2026-04-12 08:55:01", action: "Auth", user: "manager@fivesarena.com", details: "Manager login via credentials", ip: "102.134.56.90", status: "success" },
  { id: 9, timestamp: "2026-04-12 08:30:44", action: "Booking", user: "player2@gmail.com", details: "Cancelled booking #B-1042 — refund issued (R350)", ip: "41.13.55.201", status: "warning" },
  { id: 10, timestamp: "2026-04-12 08:12:10", action: "Role Change", user: "rkholofelo@gmail.com", details: "Revoked admin access from test@fivesarena.com", ip: "102.134.56.78", status: "warning" },
  { id: 11, timestamp: "2026-04-12 07:45:00", action: "System", user: "system", details: "Database connection pool recycled", ip: "127.0.0.1", status: "success" },
  { id: 12, timestamp: "2026-04-12 07:30:18", action: "Feature Flag", user: "rkholofelo@gmail.com", details: "Disabled 'dark_mode_v2' feature flag", ip: "102.134.56.78", status: "success" },
  { id: 13, timestamp: "2026-04-12 07:00:00", action: "System", user: "system", details: "Scheduled maintenance window started", ip: "127.0.0.1", status: "warning" },
  { id: 14, timestamp: "2026-04-12 06:45:33", action: "Booking", user: "player3@gmail.com", details: "Booked Court 2 — 20:00-21:00 (R350)", ip: "102.134.88.12", status: "success" },
  { id: 15, timestamp: "2026-04-12 06:12:10", action: "Auth", user: "admin@fivesarena.com", details: "Password reset requested", ip: "102.134.56.90", status: "warning" },
];

const ACTION_TYPES = ["All", "Auth", "Role Change", "Feature Flag", "Booking", "System"];

/* ─── Helpers ────────────────────────────────────────────────── */

const statusBadge = (status) => {
  const map = {
    success: "bg-green-900/40 text-green-400 border-green-700/50",
    warning: "bg-yellow-900/40 text-yellow-400 border-yellow-700/50",
    error: "bg-red-900/40 text-red-400 border-red-700/50",
  };
  return map[status] || "bg-gray-800 text-gray-400 border-gray-700";
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/* ─── Component ──────────────────────────────────────────────── */

export default function AuditLogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [actionFilter, setActionFilter] = useState("All");
  const [userSearch, setUserSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated" && session?.user?.email !== SUPER_ADMIN_EMAIL) {
      router.replace("/admin/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || session?.user?.email !== SUPER_ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-green-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  /* ── Filtering ── */
  const filtered = MOCK_LOG_ENTRIES.filter((e) => {
    if (actionFilter !== "All" && e.action !== actionFilter) return false;
    if (userSearch && !e.user.toLowerCase().includes(userSearch.toLowerCase())) return false;
    return true;
  });

  /* ── Stats ── */
  const totalToday = MOCK_LOG_ENTRIES.length;
  const authEvents = MOCK_LOG_ENTRIES.filter((e) => e.action === "Auth").length;
  const adminActions = MOCK_LOG_ENTRIES.filter((e) => ["Role Change", "Feature Flag"].includes(e.action)).length;
  const systemEvents = MOCK_LOG_ENTRIES.filter((e) => e.action === "System").length;

  const stats = [
    { label: "Total Events", value: totalToday, icon: FaHistory },
    { label: "Auth Events", value: authEvents, icon: FaShieldAlt },
    { label: "Admin Actions", value: adminActions, icon: FaFilter },
    { label: "System Events", value: systemEvents, icon: FaShieldAlt },
  ];

  // TODO: Implement CSV export
  const handleExport = () => {
    alert("CSV export coming soon");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8 md:px-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-widest uppercase text-green-400 flex items-center gap-3">
            <FaHistory /> Audit Log
          </h1>
          <p className="text-gray-500 text-sm mt-1">All system events and admin actions</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-300 hover:text-green-400 hover:border-green-700/50 px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <FaDownload /> Export CSV
        </button>
      </motion.div>

      {/* ── Filter Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-green-700 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-green-700 focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">Action Type</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-green-700 focus:outline-none"
          >
            {ACTION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-1 block">User Search</label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs" />
            <input
              type="text"
              placeholder="Search by email..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-300 focus:border-green-700 focus:outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* ── Stats Row ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest mb-2">
              <s.icon className="text-green-400" /> {s.label}
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Log Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {["Timestamp", "Action", "User", "Details", "IP Address", "Status"].map((h) => (
                  <th
                    key={h}
                    className="text-[10px] uppercase tracking-widest text-gray-500 font-medium text-left px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody variants={stagger} initial="hidden" animate="show">
              {filtered.map((entry) => (
                <motion.tr
                  key={entry.id}
                  variants={fadeUp}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap font-mono text-xs">{entry.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-800 text-gray-300 border border-gray-700 text-xs px-2 py-0.5 rounded-full">
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{entry.user}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{entry.details}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">{entry.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusBadge(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-600 py-8">No log entries match your filters.</td>
                </tr>
              )}
            </motion.tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
