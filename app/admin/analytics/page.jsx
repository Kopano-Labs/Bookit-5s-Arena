'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  FaChartBar, FaUsers, FaGlobe, FaDesktop, FaMobile, FaTablet,
  FaExternalLinkAlt, FaRobot, FaSpinner, FaMousePointer,
} from 'react-icons/fa';

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = 'text-green-400' }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className={`text-2xl mb-2 ${color}`}>{icon}</div>
      <p className="text-2xl font-black text-white">{value ?? '—'}</p>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1 truncate">{sub}</p>}
    </div>
  );
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────

function BarChart({ data }) {
  if (!data || !data.length) {
    return <div className="text-center text-gray-600 py-10 text-sm">No data yet</div>;
  }
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1 h-40 w-full overflow-x-auto pb-1">
      {data.map((d) => {
        const pct = Math.max((d.count / max) * 100, 2);
        return (
          <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-[24px] group">
            <div className="relative w-full flex justify-center">
              <div
                style={{
                  height: `${(pct / 100) * 140}px`,
                  background: 'linear-gradient(180deg, #22c55e 0%, #15803d 100%)',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '4px',
                  width: '80%',
                  opacity: 0.85,
                  transition: 'opacity 0.15s',
                }}
                className="group-hover:opacity-100"
                title={`${d.date}: ${d.count} views`}
              />
              <span className="absolute -top-5 text-[10px] text-green-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {d.count}
              </span>
            </div>
            <span className="text-[9px] text-gray-600 rotate-45 origin-left whitespace-nowrap">
              {d.date.slice(5)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = '#22c55e' }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && session.user.role !== 'admin') { router.push('/'); return; }
  }, [status, session, router]);

  const fetchData = useCallback(() => {
    if (status !== 'authenticated') return;
    setLoading(true);
    setAiInsight(null);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status, days]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAiInsights = async () => {
    if (!data) return;
    setAiLoading(true);
    setAiError(null);
    setAiInsight(null);
    try {
      const res = await fetch('/api/admin/analytics/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed');
      setAiInsight(result.insight);
    } catch (e) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 animate-pulse text-lg">Loading analytics…</div>
      </div>
    );
  }

  const topPage = data?.topPages?.[0]?.path || '—';
  const topReferrer = data?.topReferrers?.[0]?.referrer || 'direct';
  const totalDevice = (data?.deviceBreakdown?.desktop || 0) + (data?.deviceBreakdown?.mobile || 0) + (data?.deviceBreakdown?.tablet || 0);

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              Analytics
            </h1>
            <p className="text-gray-500 text-sm mt-1">Website traffic and engagement for the last {days} days</p>
          </div>

          {/* Date range selector */}
          <div className="flex gap-2 bg-gray-900 border border-gray-800 rounded-xl p-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
                  ${days === d
                    ? 'bg-green-900/40 border border-green-700 text-green-400'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<FaChartBar />}
            label="Page Views"
            value={data?.totalPageViews?.toLocaleString() ?? '0'}
            color="text-green-400"
          />
          <StatCard
            icon={<FaUsers />}
            label="Unique Visitors"
            value={data?.totalVisitors?.toLocaleString() ?? '0'}
            color="text-blue-400"
          />
          <StatCard
            icon={<FaExternalLinkAlt />}
            label="Top Page"
            value={topPage}
            sub={`${data?.topPages?.[0]?.views ?? 0} views`}
            color="text-purple-400"
          />
          <StatCard
            icon={<FaGlobe />}
            label="Top Source"
            value={topReferrer}
            sub={`${data?.topReferrers?.[0]?.visits ?? 0} visits`}
            color="text-yellow-400"
          />
        </div>

        {/* Page Views Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-6" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            Page Views — Last {days} Days
          </h2>
          <BarChart data={data?.pageViewsByDay || []} />
        </div>

        {/* Two-column: Top Pages + Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-sm font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Top Pages</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-left">Path</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Views</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topPages || []).length === 0 && (
                  <tr><td colSpan={3} className="px-5 py-8 text-center text-gray-600 text-xs">No data</td></tr>
                )}
                {(data?.topPages || []).map((p, i) => (
                  <tr key={i} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-white truncate max-w-[160px]">{p.path}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs text-right">{p.views.toLocaleString()}</td>
                    <td className="px-5 py-3 text-green-500 text-xs text-right font-bold">{p.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Traffic Sources */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-sm font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Traffic Sources</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-left">Referrer</th>
                  <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Visits</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topReferrers || []).length === 0 && (
                  <tr><td colSpan={2} className="px-5 py-8 text-center text-gray-600 text-xs">No referrer data</td></tr>
                )}
                {(data?.topReferrers || []).map((r, i) => (
                  <tr key={i} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-white">{r.referrer || 'direct'}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs text-right">{r.visits.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white mb-5" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            Device Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { key: 'desktop', label: 'Desktop', icon: <FaDesktop />, color: '#22c55e' },
              { key: 'mobile',  label: 'Mobile',  icon: <FaMobile />,  color: '#3b82f6' },
              { key: 'tablet',  label: 'Tablet',  icon: <FaTablet />,  color: '#a855f7' },
            ].map(({ key, label, icon, color }) => {
              const count = data?.deviceBreakdown?.[key] || 0;
              const pct = totalDevice > 0 ? Math.round((count / totalDevice) * 100) : 0;
              return (
                <div key={key} className="bg-gray-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2" style={{ color }}>
                      {icon}
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-300">{label}</span>
                    </div>
                    <span className="text-white font-black text-lg">{pct}%</span>
                  </div>
                  <ProgressBar value={count} max={totalDevice} color={color} />
                  <p className="text-gray-600 text-xs">{count.toLocaleString()} sessions</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Tracking */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-sm font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Event Tracking</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-left">Event</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Count</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topEvents || []).length === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-8 text-center text-gray-600 text-xs">
                    No custom events tracked yet. Use{' '}
                    <code className="text-green-500 font-mono">window.trackEvent('event_name')</code>{' '}
                    anywhere in your app.
                  </td>
                </tr>
              )}
              {(data?.topEvents || []).map((e, i) => (
                <tr key={i} className="border-b border-gray-800/50 last:border-0 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <FaMousePointer className="text-yellow-500" size={11} />
                      <span className="font-mono text-xs text-white">{e.event}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-400 text-xs text-right font-bold">{e.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Insights */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                AI Insights
              </h2>
              <p className="text-gray-600 text-xs mt-1">Claude analyses your data and suggests improvements</p>
            </div>
            <button
              onClick={handleAiInsights}
              disabled={aiLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-wait"
              style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}
            >
              {aiLoading ? <FaSpinner className="animate-spin" size={13} /> : <FaRobot size={13} />}
              {aiLoading ? 'Generating…' : 'Generate AI Insights'}
            </button>
          </div>

          {aiError && (
            <div className="bg-red-900/20 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
              {aiError}
            </div>
          )}

          {aiInsight && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FaRobot className="text-green-400" size={14} />
                <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Claude Analysis</span>
              </div>
              <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{aiInsight}</div>
            </div>
          )}

          {!aiInsight && !aiError && !aiLoading && (
            <div className="text-center py-6 text-gray-700 text-sm">
              Click the button above to get AI-powered insights about your traffic and how to improve bookings.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
