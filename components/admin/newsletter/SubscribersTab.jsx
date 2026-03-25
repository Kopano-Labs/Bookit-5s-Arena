import {
  FaBell, FaEnvelope, FaUser, FaCheck, FaCopy, FaDownload, FaAt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SubscribersTab({ data, loading }) {
  const [copied, setCopied] = useState(false);

  const copyEmails = () => {
    if (!data?.subscribers) return;
    navigator.clipboard.writeText(data.subscribers.map((s) => s.email).join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadCsv = () => {
    if (!data?.subscribers) return;
    const header = 'Name,Email,Username,Joined';
    const rows = data.subscribers.map(
      (s) => `"${s.name}","${s.email}","${s.username || ''}","${new Date(s.joinedAt).toLocaleDateString('en-ZA')}"`
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

  if (loading) return <div className="text-gray-500 text-sm py-8 text-center animate-pulse">Synchronizing database...</div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-900/20 border border-green-800/40 rounded-2xl p-5 text-center backdrop-blur-md">
          <FaBell className="text-green-400 text-3xl mx-auto mb-2 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <p className="text-3xl font-black text-white tracking-tighter">{data?.count ?? 0}</p>
          <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.2em] mt-1">Total Subscribers</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 text-center backdrop-blur-md">
          <FaEnvelope className="text-blue-400 text-3xl mx-auto mb-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <p className="text-3xl font-black text-white tracking-tighter">{data?.count ?? 0}</p>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Active List Size</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 text-center backdrop-blur-md">
          <FaUser className="text-purple-400 text-3xl mx-auto mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <p className="text-3xl font-black text-white tracking-tighter">
            {data?.subscribers?.filter((s) => s.username).length ?? 0}
          </p>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">With Username</p>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end items-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={copyEmails} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-gray-500 transition-all">
          {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
          {copied ? 'Copied' : 'Copy Emails'}
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={downloadCsv} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all shadow-[0_10px_20px_rgba(34,197,94,0.2)] bg-gradient-to-r from-green-700 to-emerald-500">
          <FaDownload size={10} /> Export CSV
        </motion.button>
      </div>

      {/* Table */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="px-8 py-5 border-b border-gray-800 flex items-center justify-between bg-black/20">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white" style={{ fontFamily: 'Impact, sans-serif' }}>Subscriber Registry</h3>
          <span className="text-[9px] text-gray-500 font-black bg-gray-800/50 px-3 py-1 rounded-full uppercase tracking-widest">{data?.count ?? 0} entries</span>
        </div>
        {!data?.subscribers?.length ? (
          <div className="text-center py-24">
            <FaBell className="text-gray-800 text-5xl mx-auto mb-6 opacity-20" />
            <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Registry Empty</p>
            <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest mt-2">Customers can opt in via their Profile Command Console</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-black/40">
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Identity</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Internal Comm</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Ref Tag</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Onboard Date</th>
                </tr>
              </thead>
              <tbody>
                {data.subscribers.map((sub, i) => (
                  <tr key={i} className="border-b border-gray-800/50 last:border-0 hover:bg-green-500/5 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/10 flex items-center justify-center text-green-400 text-xs font-black group-hover:scale-110 transition-transform">
                          {sub.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">{sub.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <a href={`mailto:${sub.email}`} className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-[10px] lowercase tracking-tighter">{sub.email}</a>
                    </td>
                    <td className="px-8 py-5 text-gray-500">
                      {sub.username ? (
                        <span className="text-green-500/70 font-mono text-[10px] flex items-center gap-1"><FaAt size={8} />{sub.username}</span>
                      ) : (
                        <span className="text-gray-800 text-[9px] font-black uppercase tracking-widest">NO_TAG</span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-gray-600 text-[10px] font-bold tracking-widest">
                      {new Date(sub.joinedAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-center text-gray-700 text-[9px] font-black uppercase tracking-[0.2em]">
        System Notice: Opt-in toggles are managed via 
        <a href="/profile" className="text-green-600 hover:text-green-400 ml-1">Profile Master Console</a>
      </p>
    </div>
  );
}
