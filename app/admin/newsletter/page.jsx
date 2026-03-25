'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser, FaPen, FaBullhorn, FaCalendarAlt, FaArrowLeft
} from 'react-icons/fa';
import Link from 'next/link';

// Component Imports
import SubscribersTab from '@/components/admin/newsletter/SubscribersTab';
import ComposeTab from '@/components/admin/newsletter/ComposeTab';
import CampaignsTab from '@/components/admin/newsletter/CampaignsTab';
import CalendarTab from '@/components/admin/newsletter/CalendarTab';

const TABS = [
  { id: 'subscribers', label: 'Network Registry', icon: FaUser },
  { id: 'compose',     label: 'Command Compose',  icon: FaPen },
  { id: 'campaigns',   label: 'Tactical Archive', icon: FaBullhorn },
  { id: 'calendar',    label: 'Deployment Grid',  icon: FaCalendarAlt },
];

export default function NewsletterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('subscribers');
  const [subData, setSubData] = useState(null);
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && session.user.role !== 'admin') { router.push('/'); return; }
  }, [status, session, router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, nRes] = await Promise.all([
        fetch('/api/newsletter'),
        fetch('/api/admin/newsletters')
      ]);
      const [sData, nData] = await Promise.all([sRes.json(), nRes.json()]);
      setSubData(sData);
      setNewsletters(nData.newsletters || []);
    } catch (e) {
      console.error('FETCH_ERROR: Connection failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') fetchData();
  }, [status, fetchData]);

  const handleEdit = (id) => {
    setEditingId(id);
    setActiveTab('compose');
  };

  const handleSaved = () => {
    setEditingId(null);
    fetchData();
    setActiveTab('campaigns');
  };

  const handleComposeOnDate = (d, m, y) => {
    setEditingId(null);
    setActiveTab('compose');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-20">
         <div className="w-16 h-16 rounded-full border-4 border-t-green-500 border-gray-900 animate-spin mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]" />
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500 animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-green-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.05)_0%,transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 p-6 md:p-12 lg:p-20 max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all mb-4 group">
               <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
             </Link>
             <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none" style={{ fontFamily: 'Impact, sans-serif' }}>
               Newsletter <span className="text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.3)]">Master</span>
             </h1>
             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /> Global Communications Terminal v4.0.1
             </p>
           </motion.div>

           <div className="flex bg-gray-900/40 p-1.5 rounded-3xl border border-gray-800 backdrop-blur-xl">
             {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTab(t.id); if (t.id !== 'compose') setEditingId(null); }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === t.id 
                    ? 'bg-green-600/90 text-white shadow-[0_10px_30px_rgba(34,197,94,0.3)]' 
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <t.icon size={12} className={activeTab === t.id ? 'animate-bounce' : ''} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
             ))}
           </div>
        </header>

        <main className="min-h-[600px] relative">
          <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -30 }}
               transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
             >
               {activeTab === 'subscribers' && <SubscribersTab data={subData} loading={loading} />}
               {activeTab === 'compose'     && <ComposeTab editingId={editingId} onSaved={handleSaved} />}
               {activeTab === 'campaigns'   && <CampaignsTab newsletters={newsletters} loading={loading} onEdit={handleEdit} onRefresh={fetchData} />}
               {activeTab === 'calendar'    && <CalendarTab newsletters={newsletters} onCompose={handleComposeOnDate} />}
             </motion.div>
          </AnimatePresence>
        </main>

        <footer className="pt-20 border-t border-gray-900 flex flex-col items-center gap-4 text-center">
           <div className="text-[9px] font-black text-gray-800 uppercase tracking-[0.5em]">5S ARENA SECURITY PROTOCOLS ACTIVE</div>
           <p className="text-[8px] text-gray-700 max-w-lg leading-relaxed uppercase tracking-widest">
             Unauthorized access to the communications terminal is strictly prohibited. All logs are recorded and monitored in accordance with the God-Mode Directive.
           </p>
        </footer>
      </div>
    </div>
  );
}
