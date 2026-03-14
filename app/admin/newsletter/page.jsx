'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaBell, FaEnvelope, FaUser, FaAt, FaCopy, FaCheck, FaDownload } from 'react-icons/fa';

const NewsletterPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && session.user.role !== 'admin') { router.push('/'); return; }
    if (status === 'authenticated') {
      fetch('/api/newsletter')
        .then((res) => res.json())
        .then((d) => { setData(d); setLoading(false); });
    }
  }, [status, session, router]);

  const copyEmails = () => {
    if (!data?.subscribers) return;
    const emails = data.subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadCsv = () => {
    if (!data?.subscribers) return;
    const header = 'Name,Email,Username,Joined';
    const rows = data.subscribers.map(
      (s) =>
        `"${s.name}","${s.email}","${s.username || ''}","${new Date(s.joinedAt).toLocaleDateString('en-ZA')}"`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 animate-pulse text-lg">Loading subscribers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-black uppercase tracking-widest text-white"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Newsletter Subscribers
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Players who opted in to receive offers, fixtures & arena news
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={copyEmails}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:border-gray-600 transition-all"
            >
              {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
              {copied ? 'Copied!' : 'Copy Emails'}
            </button>
            <button
              onClick={downloadCsv}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)', boxShadow: '0 0 15px rgba(34,197,94,0.3)' }}
            >
              <FaDownload size={12} /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-900/20 border border-green-800/40 rounded-2xl p-5 text-center">
            <FaBell className="text-green-400 text-3xl mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{data?.count ?? 0}</p>
            <p className="text-xs text-green-600 uppercase tracking-widest mt-1">Total Subscribers</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <FaEnvelope className="text-blue-400 text-3xl mx-auto mb-2" />
            <p className="text-3xl font-black text-white">{data?.count ?? 0}</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Active List Size</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <FaUser className="text-purple-400 text-3xl mx-auto mb-2" />
            <p className="text-3xl font-black text-white">
              {data?.subscribers?.filter((s) => s.username).length ?? 0}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">With Username</p>
          </div>
        </div>

        {/* Subscribers list */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h3
              className="text-sm font-black uppercase tracking-widest text-white"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Subscriber List
            </h3>
            <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
              {data?.count ?? 0} subscribers
            </span>
          </div>

          {!data?.subscribers?.length ? (
            <div className="text-center py-16">
              <FaBell className="text-gray-700 text-4xl mx-auto mb-4" />
              <p className="text-gray-600">No subscribers yet.</p>
              <p className="text-gray-700 text-xs mt-1">Customers can opt in from their Profile page.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Name</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Email</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Username</th>
                    <th className="px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subscribers.map((sub, i) => (
                    <tr key={i} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-900/40 border border-green-800/60 flex items-center justify-center text-green-400 text-xs font-black flex-shrink-0">
                            {sub.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="font-semibold text-white">{sub.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={`mailto:${sub.email}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors font-mono text-xs"
                        >
                          {sub.email}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        {sub.username ? (
                          <span className="text-green-400 font-mono text-xs flex items-center gap-1">
                            <FaAt size={9} />{sub.username}
                          </span>
                        ) : (
                          <span className="text-gray-700 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">
                        {new Date(sub.joinedAt).toLocaleDateString('en-ZA', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-gray-700 text-xs">
          Customers toggle newsletter opt-in from their{' '}
          <a href="/profile" className="text-green-600 hover:text-green-500">Profile page</a>.
          Unsubscribes are immediate.
        </p>
      </div>
    </div>
  );
};

export default NewsletterPage;
