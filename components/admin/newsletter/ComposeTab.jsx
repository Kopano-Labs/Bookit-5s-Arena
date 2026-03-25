import {
  FaSave, FaClock, FaPlay, FaEye, FaEyeSlash, FaBold, FaItalic, FaHeading, FaLink, FaList, FaAt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

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

export default function ComposeTab({ editingId, onSaved }) {
  const [form, setForm] = useState({
    title: '',
    subject: '',
    fromName: '5S Arena',
    body: '',
  });
  const [preview, setPreview] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!editingId) return;
    fetch(`/api/admin/newsletters/${editingId}`)
      .then((r) => r.json())
      .then(({ newsletter }) => {
        if (!newsletter) return;
        setForm({
          title: newsletter.title || '',
          subject: newsletter.subject || '',
          fromName: newsletter.fromName || '5S Arena',
          body: newsletter.body || '',
        });
        if (newsletter.scheduledAt) setScheduledAt(newsletter.scheduledAt.slice(0, 16));
      });
  }, [editingId]);

  const insertAtCursor = (before, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = form.body.substring(start, end);
    const newText =
      form.body.substring(0, start) +
      before + selected + after +
      form.body.substring(end);
    setForm((f) => ({ ...f, body: newText }));
    setTimeout(() => {
      ta.focus();
      const newCursor = start + before.length + selected.length + after.length;
      ta.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const toolbarButtons = [
    { icon: <FaBold />, label: 'Bold', action: () => insertAtCursor('<strong>', '</strong>') },
    { icon: <FaItalic />, label: 'Italic', action: () => insertAtCursor('<em>', '</em>') },
    { icon: <FaHeading />, label: 'H2', action: () => insertAtCursor('<h2>', '</h2>') },
    { icon: <FaLink />, label: 'Link', action: () => insertAtCursor('<a href="https://">', '</a>') },
    { icon: <FaList />, label: 'List', action: () => insertAtCursor('<ul>\n  <li>', '</li>\n</ul>') },
  ];

  const doSave = async (status, schedAt) => {
    if (!form.title.trim()) { setMsg({ type: 'error', text: 'Operational Title is required' }); return; }
    setSaving(true);
    setMsg(null);
    try {
      const payload = { title: form.title, subject: form.subject, fromName: form.fromName, bodyHtml: form.body, status };
      if (schedAt) payload.scheduledAt = schedAt;
      const url = editingId ? `/api/admin/newsletters/${editingId}` : '/api/admin/newsletters';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      setMsg({ type: 'success', text: `Campaign protocol ${status === 'scheduled' ? 'locked' : 'synced'} successfully` });
      if (onSaved) onSaved(data.newsletter);
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSendNow = async () => {
    if (!confirm('EXECUTE DISPATCH: Broadcast to all active subscribers now?')) return;
    setSending(true);
    setMsg(null);
    try {
      let id = editingId;
      if (!id) {
        const url = '/api/admin/newsletters';
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, bodyHtml: form.body, status: 'draft' }),
        });
        const data = await res.json();
        id = data.newsletter._id;
      }
      const res = await fetch(`/api/admin/newsletters/${id}/send`, { method: 'POST' });
      const data = await res.json();
      setMsg({ type: 'success', text: `Broadcast successful: Dispatched to ${data.sent} terminals` });
      if (onSaved) onSaved();
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setSending(false);
    }
  };

  const inputClass = "bg-gray-900/50 border border-gray-800 rounded-2xl px-5 py-4 text-[11px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-700";

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Internal Title</label>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="COMPETITION_UPDATE_V1" className={inputClass + " w-full"} />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Broadcast Subject</label>
          <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="⚽ NEW FIXTURES ARE LIVE" className={inputClass + " w-full"} />
        </div>
      </div>

      <div className="bg-gray-900/40 border-2 border-dashed border-gray-800 rounded-[40px] p-8">
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white" style={{ fontFamily: 'Impact, sans-serif' }}>Campaign Architecture</h3>
           </div>
           <motion.button whileHover={{ scale: 1.05 }} onClick={() => setPreview(!preview)} className="px-6 py-2.5 bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-gray-700 hover:border-blue-500 transition-all text-blue-400">
             {preview ? <FaEyeSlash size={11} className="inline mr-2" /> : <FaEye size={11} className="inline mr-2" />}
             {preview ? 'Edit Source' : 'Optical Preview'}
           </motion.button>
        </div>

        {!preview ? (
          <div className="bg-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800 bg-black/40">
              {toolbarButtons.map(btn => (
                <button key={btn.label} onClick={btn.action} className="p-3 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl transition-all">{btn.icon}</button>
              ))}
            </div>
            <textarea ref={textareaRef} value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="w-full bg-transparent px-8 py-8 text-[11px] font-bold text-gray-300 font-mono focus:outline-none min-h-[400px] leading-relaxed" placeholder="<p>INITIATE BROADCAST CONTENT...</p>" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl h-[500px]">
             <iframe srcDoc={buildEmailPreview(form)} className="w-full h-full border-none" />
          </div>
        )}
      </div>

      {msg && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${msg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-green-500/10 border-green-500/30 text-green-500'}`}>
          {msg.text}
        </motion.div>
      )}

      <div className="flex flex-wrap gap-4 pt-4">
         <motion.button whileHover={{ y: -4 }} onClick={() => doSave('draft')} disabled={saving} className="px-10 py-5 bg-gray-800 border border-gray-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:text-white hover:border-gray-500 transition-all disabled:opacity-50">
           <FaSave className="inline mr-3" /> {saving ? 'SYNCING...' : 'Save Protocol'}
         </motion.button>
         <motion.button whileHover={{ y: -4 }} onClick={() => setScheduleOpen(!scheduleOpen)} className="px-10 py-5 bg-blue-900/20 border border-blue-500/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:bg-blue-500/10 transition-all">
           <FaClock className="inline mr-3" /> Schedule Dispatch
         </motion.button>
         <motion.button whileHover={{ y: -4 }} onClick={handleSendNow} disabled={sending} className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 shadow-[0_15px_30px_rgba(34,197,94,0.3)] rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white disabled:opacity-50 ml-auto">
           <FaPlay className="inline mr-3 animate-pulse" /> {sending ? 'BROADCASTING...' : 'DECOY_READY'}
         </motion.button>
      </div>

      {scheduleOpen && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-blue-950/20 border border-blue-500/20 rounded-3xl p-8 backdrop-blur-xl">
           <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Dispatch Timer Config</h4>
           <div className="flex gap-4">
              <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} className={inputClass + " flex-1"} />
              <button onClick={() => { doSave('scheduled', scheduledAt); setScheduleOpen(false); }} className="px-10 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white">Commit Timer</button>
           </div>
        </motion.div>
      )}
    </div>
  );
}
