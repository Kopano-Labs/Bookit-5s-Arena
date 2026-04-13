"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PDFViewer from "@/components/PDFViewer";
import {
  FaCalendarAlt,
  FaFutbol,
  FaMoneyBillWave,
  FaClock,
  FaFilter,
  FaTimes,
  FaUsers,
  FaCheckCircle,
  FaBan,
  FaArrowUp,
  FaChartBar,
  FaUserSecret,
  FaCogs,
  FaShieldAlt,
  FaBullhorn,
  FaTrophy,
  FaUpload,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import InfoTooltip from "@/components/InfoTooltip";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";

const statusBadge = (status) => {
  const map = {
    confirmed: "bg-green-900/40 text-green-400 border-green-700/50",
    pending: "bg-yellow-900/40 text-yellow-400 border-yellow-700/50",
    cancelled: "bg-red-900/40 text-red-400 border-red-700/50",
  };
  return map[status] || "bg-gray-800 text-gray-400 border-gray-700";
};

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [_selectedCourt, _setSelectedCourt] = useState(null);

  const [teams, setTeams] = useState([]);
  const [verifying, setVerifying] = useState(null);
  const [pdfModal, setPdfModal] = useState(null); // { url, teamName }
  const canGodMode = useFeatureAccess('admin.dashboard.godmode');

  // God-mode panel/modal states
  const [showGhostLog, setShowGhostLog] = useState(false);
  const [showFlags, setShowFlags] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showBanhammer, setShowBanhammer] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [banEmail, setBanEmail] = useState("");
  const [banStatus, setBanStatus] = useState(null); // null | "banned" | "active"

  // Mock data for Ghost Log
  // TODO: Replace with fetch from /api/admin/audit-log
  const mockAuditLog = [
    { action: "Role changed", user: "test@email.com", by: "admin", timestamp: "2026-04-12 10:30" },
    { action: "User banned", user: "spammer@fake.com", by: "admin", timestamp: "2026-04-12 09:15" },
    { action: "Feature flag toggled", user: "maintenance_mode", by: "admin", timestamp: "2026-04-11 22:00" },
    { action: "Broadcast sent", user: "all_users", by: "admin", timestamp: "2026-04-11 18:45" },
    { action: "Booking cancelled", user: "player@mail.com", by: "admin", timestamp: "2026-04-11 14:20" },
  ];

  // Mock feature flags
  // TODO: Replace with fetch/PUT to /api/admin/feature-flags
  const [featureFlags, setFeatureFlags] = useState([
    { key: "maintenance_mode", label: "Maintenance Mode", enabled: false },
    { key: "tournament_registration", label: "Tournament Registration", enabled: true },
    { key: "stripe_payments", label: "Stripe Payments", enabled: true },
    { key: "guest_booking", label: "Guest Booking", enabled: true },
    { key: "rewards_system", label: "Rewards System", enabled: false },
  ]);

  const toggleFlag = (key) => {
    // TODO: POST to /api/admin/feature-flags with { key, enabled }
    setFeatureFlags((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleBroadcast = () => {
    // TODO: POST to /api/admin/broadcast with { message: broadcastMsg }
    alert(`Broadcast sent: "${broadcastMsg}"`);
    setBroadcastMsg("");
    setShowBroadcast(false);
  };

  const handleBanSearch = () => {
    // TODO: GET /api/admin/users/ban?email=banEmail to check status
    // Mock: toggle between states
    setBanStatus(banStatus === "banned" ? "active" : "banned");
  };

  const handleBanToggle = () => {
    // TODO: POST to /api/admin/users/ban with { email: banEmail, action: banStatus === "banned" ? "unban" : "ban" }
    setBanStatus(banStatus === "banned" ? "active" : "banned");
  };

  const fetchStats = useCallback(
    (params) => {
      const p = params || new URLSearchParams();
      if (!params) {
        if (fromDate) p.set("from", fromDate);
        if (toDate) p.set("to", toDate);
        if (statusFilter) p.set("status", statusFilter);
      }
      setLoading(true);
      fetch(`/api/admin/stats?${p.toString()}`)
        .then((r) => r.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        });
    },
    [fromDate, toDate, statusFilter],
  );

  const fetchTeams = useCallback(() => {
    fetch("/api/tournament")
      .then((r) => r.json())
      .then((data) => setTeams(data.teams || []))
      .catch(console.error);
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
    if (status === "authenticated") {
      fetchStats(new URLSearchParams());
      fetchTeams();
    }
  }, [status, session, router, fetchStats, fetchTeams]);

  const handleVerify = async (teamId, action) => {
    setVerifying(teamId);
    try {
      const res = await fetch("/api/admin/tournament/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, action }),
      });
      if (res.ok) fetchTeams();
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(null);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 animate-pulse text-lg">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const inputClass =
    "bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all";
  const maxRevenue = Math.max(
    ...(stats.revenueTrend?.map((d) => d.revenue) ?? [1]),
    1,
  );

  const topCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: <FaCalendarAlt className="text-2xl text-blue-400" />,
      bg: "bg-blue-900/20 border-blue-800/40",
      sub: `${stats.upcomingBookings} upcoming`,
      tip: "All bookings across all statuses (confirmed, pending and cancelled) for the selected date range.",
    },
    {
      label: "Total Revenue",
      value: `R${stats.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-2xl text-green-400" />,
      bg: "bg-green-900/20 border-green-800/40",
      sub: `Avg R${stats.avgBookingValue}/booking`,
      sub2:
        stats.paidCount > 0
          ? `R${(stats.paidRevenue ?? 0).toLocaleString()} confirmed paid`
          : null,
      tip: 'Total revenue across confirmed bookings. "Confirmed paid" reflects only those with payment verified via Stripe or manually marked paid.',
    },
    {
      label: "Total Courts",
      value: stats.totalCourts,
      icon: <FaFutbol className="text-2xl text-yellow-400" />,
      bg: "bg-yellow-900/20 border-yellow-800/40",
      sub: stats.mostBookedCourt
        ? `⭐ ${stats.mostBookedCourt.name}`
        : "No data yet",
      tip: "Number of active courts on the platform. ⭐ indicates your most popular court by booking count.",
    },
    {
      label: "Registered Users",
      value: stats.totalUsers,
      icon: <FaUsers className="text-2xl text-purple-400" />,
      bg: "bg-purple-900/20 border-purple-800/40",
      sub: "Total accounts",
      tip: "Total registered member accounts. Guest bookings (pay at venue) are not counted here.",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-950 py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1
              className="text-3xl font-black uppercase tracking-widest text-white"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Revenue, bookings &amp; business insights
            </p>
          </div>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/admin/bookings"
                className="px-4 py-2 text-xs font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:text-white hover:border-gray-600 transition-all uppercase tracking-widest"
              >
                Manage Bookings
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:text-white hover:border-gray-600 transition-all uppercase tracking-widest"
              >
                <FaChartBar size={11} /> Analytics
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/admin/integrations"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-400 bg-gray-800 border border-gray-700 rounded-xl hover:text-white hover:border-gray-600 transition-all uppercase tracking-widest"
              >
                <FaCogs size={11} /> Integrations
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/admin/sandbox"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-xl hover:text-white hover:border-cyan-400 transition-all uppercase tracking-widest"
              >
                <FaShieldAlt size={11} /> Sandbox
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-wrap gap-4 items-end shadow-lg">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Period
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="">All Bookings</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
          <button
            onClick={() => fetchStats()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 bg-green-600 shadow-lg shadow-green-900/30"
          >
            <FaFilter size={11} /> Apply
          </button>
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setStatusFilter("");
              fetchStats(new URLSearchParams());
            }}
            className="flex items-center gap-2 px-5 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
          >
            <FaTimes size={11} /> Clear
          </button>
        </div>

        {/* Top cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {topCards.map((card) => (
            <div
              key={card.label}
              className={`border rounded-2xl p-5 flex flex-col items-center text-center gap-2 shadow-lg ${card.bg}`}
            >
              <div className="p-3 rounded-xl bg-gray-900/60">{card.icon}</div>
              <p className="text-2xl font-black text-white">{card.value}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide leading-tight">
                {card.label}
              </p>
              <p className="text-xs text-gray-600">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* God-Mode Control Center */}
        {canGodMode && (
        <div className="bg-black/60 border-2 border-red-600/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="bg-red-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <div>
              <h2
                className="text-2xl font-black text-white uppercase tracking-widest leading-none"
                style={{ fontFamily: "Impact, sans-serif" }}
              >
                God-Mode <span className="text-red-600">Command</span>
              </h2>
              <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] mt-2">
                System Status: Critical Priority
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowGhostLog(true)} className="flex flex-col items-center justify-center p-5 bg-gray-900/80 border border-gray-800 hover:border-purple-500 rounded-2xl transition-all group">
                <FaUserSecret className="text-2xl text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Ghost Log
                </span>
              </button>
              <button onClick={() => setShowFlags(!showFlags)} className="relative flex flex-col items-center justify-center p-5 bg-gray-900/80 border border-gray-800 hover:border-blue-500 rounded-2xl transition-all group">
                <FaCogs className="text-2xl text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Flags
                </span>
              </button>
              <button onClick={() => setShowBroadcast(true)} className="flex flex-col items-center justify-center p-5 bg-gray-900/80 border border-gray-800 hover:border-yellow-500 rounded-2xl transition-all group">
                <FaBullhorn className="text-2xl text-yellow-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Broadcast
                </span>
              </button>
              <button onClick={() => setShowBanhammer(true)} className="flex flex-col items-center justify-center p-5 bg-gray-900/80 border border-gray-800 hover:border-red-600 rounded-2xl transition-all group">
                <FaBan className="text-2xl text-red-600 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  Banhammer
                </span>
              </button>
            </div>
            <div className="lg:col-span-2 bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3">
              {/* Flags dropdown panel */}
              <AnimatePresence>
                {showFlags && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Feature Flags</span>
                      <button onClick={() => setShowFlags(false)} className="text-gray-500 hover:text-white"><FaTimes size={12} /></button>
                    </div>
                    {featureFlags.map((flag) => (
                      <div key={flag.key} className="flex items-center justify-between bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5">
                        <span className="text-xs text-gray-300 font-semibold">{flag.label}</span>
                        <button
                          onClick={() => toggleFlag(flag.key)}
                          className={`w-10 h-5 rounded-full relative transition-colors ${flag.enabled ? "bg-green-600" : "bg-gray-700"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${flag.enabled ? "left-5" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {!showFlags && (
                <div className="flex-1 flex flex-col justify-center items-center gap-3 py-4">
                  <p className="text-gray-600 text-xs font-mono">System ready. Select a command or dispatch.</p>
                  <button
                    onClick={() => router.push("/admin/sandbox")}
                    className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 transition-all"
                  >
                    Execute Dispatch
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── GOD-MODE MODALS ── */}

          {/* Ghost Log — slide-out panel */}
          <AnimatePresence>
            {showGhostLog && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-40"
                  onClick={() => setShowGhostLog(false)}
                />
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 250 }}
                  className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-950 border-l border-gray-800 z-50 p-6 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-purple-400 uppercase tracking-widest">Ghost Log</h3>
                    <button onClick={() => setShowGhostLog(false)} className="text-gray-500 hover:text-white"><FaTimes size={16} /></button>
                  </div>
                  {/* TODO: Fetch from /api/admin/audit-log */}
                  <div className="space-y-3">
                    {mockAuditLog.map((entry, i) => (
                      <div key={i} className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4">
                        <p className="text-xs font-bold text-white">{entry.action}</p>
                        <p className="text-[10px] text-gray-500 mt-1">User: {entry.user}</p>
                        <p className="text-[10px] text-gray-600">By: {entry.by} &middot; {entry.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Broadcast modal */}
          <AnimatePresence>
            {showBroadcast && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-40"
                  onClick={() => setShowBroadcast(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest">Broadcast</h3>
                      <button onClick={() => setShowBroadcast(false)} className="text-gray-500 hover:text-white"><FaTimes size={16} /></button>
                    </div>
                    <textarea
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      placeholder="Type your announcement..."
                      rows={4}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none placeholder:text-gray-700 font-mono"
                    />
                    {/* TODO: POST to /api/admin/broadcast */}
                    <button
                      onClick={handleBroadcast}
                      disabled={!broadcastMsg.trim()}
                      className="mt-4 w-full px-6 py-2.5 bg-yellow-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-yellow-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Send to All
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Banhammer modal */}
          <AnimatePresence>
            {showBanhammer && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-40"
                  onClick={() => setShowBanhammer(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Banhammer</h3>
                      <button onClick={() => { setShowBanhammer(false); setBanEmail(""); setBanStatus(null); }} className="text-gray-500 hover:text-white"><FaTimes size={16} /></button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={banEmail}
                        onChange={(e) => { setBanEmail(e.target.value); setBanStatus(null); }}
                        placeholder="user@email.com"
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-gray-700"
                      />
                      {/* TODO: GET /api/admin/users/ban?email=... */}
                      <button
                        onClick={handleBanSearch}
                        disabled={!banEmail.trim()}
                        className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-gray-600 transition-all disabled:opacity-40"
                      >
                        Search
                      </button>
                    </div>
                    {banStatus && (
                      <div className="mt-4 bg-gray-900/80 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{banEmail}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${banStatus === "banned" ? "text-red-400" : "text-green-400"}`}>
                            Status: {banStatus}
                          </p>
                        </div>
                        {/* TODO: POST to /api/admin/users/ban */}
                        <button
                          onClick={handleBanToggle}
                          className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                            banStatus === "banned"
                              ? "bg-green-600 text-white hover:bg-green-500"
                              : "bg-red-600 text-white hover:bg-red-500"
                          }`}
                        >
                          {banStatus === "banned" ? "Unban" : "Ban"}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        )}

        {/* ── TOURNAMENT REGISTRATIONS (POP AUDIT) ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3
              className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              <FaTrophy className="text-yellow-500" /> Tournament POP Audit
              <InfoTooltip
                text="Manage tournament entries. 'Pending' teams have uploaded POP but need verification."
                size={12}
              />
            </h3>
            <span className="text-[10px] text-gray-500 font-bold">
              {teams.length} total entries
            </span>
          </div>
          {!teams.length ? (
            <p className="p-10 text-center text-gray-600 text-sm italic">
              No registrations found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-gray-800/50 text-gray-400 uppercase tracking-widest border-b border-gray-800 font-bold">
                    <th className="px-6 py-4">Team</th>
                    <th className="px-6 py-4">Nation</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Audit</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {teams.map((team) => (
                    <tr
                      key={team._id}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-white">{team.teamName}</p>
                        <p className="text-[10px] text-gray-500">
                          {team.managerName}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {team.worldCupTeam}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-black uppercase text-[8px] border ${
                            team.paymentStatus === "confirmed"
                              ? "bg-green-900/40 text-green-400 border-green-700/50"
                              : team.paymentStatus === "pending"
                                ? "bg-yellow-900/40 text-yellow-400 border-yellow-700/50"
                                : team.paymentStatus === "rejected"
                                  ? "bg-red-900/40 text-red-400 border-red-700/50"
                                  : "bg-gray-800 text-gray-500 border-gray-700"
                          }`}
                        >
                          {team.paymentStatus || "unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {team.paymentScreenshot ? (
                          <>
                            <button
                              onClick={() =>
                                setPdfModal({
                                  url: `/uploads/payments/${team.paymentScreenshot}`,
                                  teamName: team.teamName,
                                })
                              }
                              className="text-blue-400 hover:text-blue-200 flex items-center gap-1 underline"
                            >
                              <FaUpload size={10} /> View PDF
                            </button>
                            <Link
                              href={`/uploads/payments/${team.paymentScreenshot}`}
                              target="_blank"
                              className="ml-2 text-gray-400 hover:text-gray-200 text-xs underline"
                            >
                              Download
                            </Link>
                          </>
                        ) : (
                          <span className="text-gray-700">None</span>
                        )}
                      </td>
                      {/* PDF Modal */}
                      {pdfModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                          <div
                            className="absolute inset-0"
                            onClick={() => setPdfModal(null)}
                          />
                          <div className="relative z-10 bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl flex flex-col items-center">
                            <h2 className="text-lg font-black mb-4 text-gray-900">
                              Deposit Slip: {pdfModal.teamName}
                            </h2>
                            <PDFViewer
                              url={pdfModal.url}
                              className="w-full h-96 border rounded-xl bg-white"
                            />
                            <button
                              onClick={() => setPdfModal(null)}
                              className="mt-4 px-6 py-2 rounded-xl bg-gray-900 text-white font-bold uppercase text-xs"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {team.paymentStatus !== "confirmed" && (
                            <button
                              onClick={() => handleVerify(team._id, "confirm")}
                              disabled={verifying === team._id}
                              className="w-7 h-7 rounded-lg bg-green-900/30 text-green-500 border border-green-700/50 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"
                            >
                              <FaCheckCircle size={12} />
                            </button>
                          )}
                          {team.paymentStatus !== "rejected" && (
                            <button
                              onClick={() => handleVerify(team._id, "reject")}
                              disabled={verifying === team._id}
                              className="w-7 h-7 rounded-lg bg-red-900/30 text-red-500 border border-red-700/50 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                            >
                              <FaBan size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => handleVerify(team._id, "reset")}
                            disabled={verifying === team._id}
                            className="w-7 h-7 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center border border-gray-700 hover:bg-gray-700 transition-all"
                          >
                            <FaClock size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Revenue trend + Status breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3
              className="text-sm font-black uppercase tracking-widest text-white mb-5 flex items-center gap-2"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              <FaArrowUp className="text-green-400" /> Revenue — Last 7 Days
            </h3>
            <div className="flex items-end gap-2 h-32">
              {stats.revenueTrend?.map((day) => {
                const heightPct = (day.revenue / maxRevenue) * 100;
                return (
                  <div
                    key={day.date}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t-lg bg-green-600 transition-all duration-500"
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    />
                    <span className="text-[10px] text-gray-500">
                      {new Date(day.date + "T12:00:00").toLocaleDateString(
                        "en-ZA",
                        { weekday: "short" },
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3
              className="text-sm font-black uppercase tracking-widest text-white mb-5 flex items-center gap-2"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              <FaChartBar className="text-blue-400" /> Status
            </h3>
            <div className="space-y-4">
              {["confirmed", "pending", "cancelled"].map((s) => (
                <div key={s}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="capitalize">{s}</span>
                    <span className="font-bold">
                      {stats.statusCounts?.[s] || 0}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${(stats.statusCounts?.[s] / stats.totalBookings) * 100 || 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Court Breakdown + Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-800">
              <h3
                className="text-sm font-black uppercase tracking-widest text-white"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                Court Performance
              </h3>
            </div>
            <div className="divide-y divide-gray-800">
              {stats.courtBreakdown?.map((c) => (
                <div
                  key={c._id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/40 transition-colors"
                >
                  <span className="font-semibold text-sm">{c.name}</span>
                  <span className="font-bold text-green-400">
                    R{c.revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-gray-800">
              <h3
                className="text-sm font-black uppercase tracking-widest text-white"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                Recent Bookings
              </h3>
            </div>
            <div className="divide-y divide-gray-800">
              {stats.recentBookings?.slice(0, 5).map((b) => (
                <div
                  key={b._id}
                  className="px-6 py-3.5 hover:bg-gray-800/40 transition-colors flex justify-between"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {b.courtName}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {b.userName} · {b.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400 text-sm">
                      R{b.total_price}
                    </p>
                    <span
                      className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${statusBadge(b.status)}`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
