import {
  FaEye, FaPen, FaClone, FaTrash, FaBullhorn, FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const buildEmailPreview = (newsletter) => {
  return `
    <!DOCTYPE html><html><head><meta charset="utf-8" /></head><body style="margin:0;padding:0;background:#eee;">
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background-color:#0a0a0a;padding:24px 28px;border-radius:12px 12px 0 0;border-bottom:2px solid #22c55e;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="background:linear-gradient(135deg,#15803d,#22c55e);width:48px;height:48px;border-radius:50%;text-align:center;vertical-align:middle;">
            <span style="color:#fff;font-size:20px;font-weight:900;font-family:Impact,Arial Black,sans-serif;line-height:48px;">5S</span>
          </td>
          <td style="padding-left:14px;vertical-align:middle;">
            <div style="color:#fff;font-size:22px;font-family:Impact,Arial Black,sans-serif;letter-spacing:3px;line-height:1;">5S ARENA</div>
            <div style="color:#22c55e;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-top:3px;">Milnerton · Cape Town</div>
          </td>
        </tr></table>
      </div>
      <div style="background-color:#f9f9f9;padding:32px 28px;border-radius:0 0 12px 12px;border:1px solid #e5e5e5;border-top:none;">
        <h2 style="color:#111;margin-top:0;font-size:22px;">${newsletter.title || 'Newsletter Title'}</h2>
        <div style="color:#333;line-height:1.7;font-size:15px;">${newsletter.body || '<p>Your newsletter content will appear here.</p>'}</div>
        <div style="margin:28px 0 20px;">
          <a href="#" style="display:inline-block;background:linear-gradient(135deg,#15803d,#22c55e);color:#fff;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px;">⚽ Visit 5S Arena</a>
        </div>
        <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;"/>
        <p style="font-size:12px;color:#aaa;margin:0;">You are receiving this because you subscribed to the 5S Arena newsletter. <a href="#" style="color:#aaa;">Unsubscribe</a></p>
      </div>
    </div></body></html>
  `;
};

const STATUS_MAP = {
  draft:     { bg: 'bg-gray-800 text-gray-500 border-gray-700', label: 'DRAFT' },
  scheduled: { bg: 'bg-blue-900/20 text-blue-400 border-blue-700/50', label: 'LOCKED' },
  sent:      { bg: 'bg-green-900/20 text-green-400 border-green-700/50', label: 'DECOY_SENT' },
};

export default function CampaignsTab({ newsletters, loading, onEdit, onRefresh }) {
  const [previewNL, setPreviewNL] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('ARCHIVE_DELETE: Confirm total removal from database?')) return;
    await fetch(`/api/admin/newsletters/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleDuplicate = async (nl) => {
    await fetch('/api/admin/newsletters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `DUPE_${nl.title}`,
        subject: nl.subject,
        fromName: nl.fromName,
        bodyHtml: nl.body,
        status: 'draft',
      }),
    });
    onRefresh();
  };

  if (loading) return <div className="text-gray-500 text-sm py-24 text-center animate-pulse">Accessing archives...</div>;

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {previewNL && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gray-900 border-2 border-gray-800 rounded-[50px] w-full max-w-4xl overflow-hidden shadow-[0_0_100px_rgba(34,197,94,0.15)]">
              <div className="flex items-center justify-between px-10 py-8 border-b border-gray-800 bg-black/40">
                <div>
                  <h3 className="text-xl font-black uppercase text-white tracking-widest" style={{ fontFamily: 'Impact, sans-serif' }}>Optical Review</h3>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-1">{previewNL.title}</p>
                </div>
                <button onClick={() => setPreviewNL(null)} className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-all"><FaTimes/></button>
              </div>
              <div className="bg-white" style={{ height: '600px' }}>
                <iframe srcDoc={buildEmailPreview(previewNL)} className="w-full h-full border-none" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-gray-900/40 border border-gray-800 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-2xl">
        <div className="px-10 py-6 border-b border-gray-800 flex items-center justify-between bg-black/20">
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white" style={{ fontFamily: 'Impact, sans-serif' }}>Campaign Archives</h3>
          <span className="text-[10px] text-gray-500 font-black bg-gray-800/80 px-4 py-1.5 rounded-full uppercase tracking-widest">{newsletters.length} Total Logs</span>
        </div>

        {!newsletters.length ? (
          <div className="text-center py-32">
            <FaBullhorn className="text-gray-800 text-6xl mx-auto mb-8 opacity-10 animate-pulse" />
            <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-xs underline decoration-gray-800 decoration-4 underline-offset-8">No Active Campaigns</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 bg-black/40">
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Internal Marker</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Sync State</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Created</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-left">Timer</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-tighter text-right">Terminals</th>
                  <th className="px-10 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Access</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((nl) => (
                  <tr key={nl._id} className="border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-all group">
                    <td className="px-10 py-6">
                      <p className="text-[11px] font-black text-white uppercase tracking-widest truncate max-w-[200px]">{nl.title}</p>
                      <p className="text-[9px] text-gray-600 font-black uppercase tracking-tighter mt-1">SUB_REF: {nl.subject}</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest ${STATUS_MAP[nl.status]?.bg}`}>
                        {STATUS_MAP[nl.status]?.label || nl.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 font-mono text-[10px] text-gray-500 uppercase">
                      {new Date(nl.createdAt).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-6 font-mono text-[10px] text-gray-500">
                      {nl.scheduledAt ? new Date(nl.scheduledAt).toLocaleString('en-ZA', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).toUpperCase() : '—'}
                    </td>
                    <td className="px-10 py-6 text-right font-black text-gray-400 text-xs">
                      {nl.status === 'sent' ? nl.recipientCount : '—'}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-all">
                        <button onClick={() => setPreviewNL(nl)} className="w-9 h-9 rounded-xl bg-gray-800 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><FaEye size={12} /></button>
                        {nl.status !== 'sent' && (
                          <button onClick={() => onEdit(nl._id)} className="w-9 h-9 rounded-xl bg-gray-800 text-green-400 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><FaPen size={12} /></button>
                        )}
                        <button onClick={() => handleDuplicate(nl)} className="w-9 h-9 rounded-xl bg-gray-800 text-yellow-500 flex items-center justify-center hover:bg-yellow-600 hover:text-white transition-all"><FaClone size={12} /></button>
                        <button onClick={() => handleDelete(nl._id)} className="w-9 h-9 rounded-xl bg-gray-800 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><FaTrash size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
