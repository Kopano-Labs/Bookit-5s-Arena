'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  FaTrophy, FaFutbol, FaArrowLeft, FaTimes, FaSave, 
  FaUserEdit, FaTable, FaClipboardList, FaPlus, FaTrashAlt,
  FaShieldAlt, FaUsers, FaDribbble, FaUserTie, FaChevronRight,
  FaSync
} from 'react-icons/fa';
import Image from 'next/image';
import TeamBadge from '@/app/fixtures/page'; // We can use the logic, or redefine a simpler one

// ── Components & Views ──

const StatusBadge = ({ status }) => {
  const map = {
    confirmed: 'bg-green-900/40 text-green-400 border-green-700/50',
    pending: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50',
    disqualified: 'bg-red-900/40 text-red-400 border-red-700/50',
  };
  return <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${map[status] || 'bg-gray-800 text-gray-500'}`}>{status}</span>;
};

/* ═══════════════════════════════════════════════════════════ */

export default function AdminCompetitionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State Management
  const [activeTab, setActiveTab] = useState('hub'); // hub, tournament, league
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [tournamentTab, setTournamentTab] = useState('profile'); // profile, players, standings

  // Role Protection
  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && session.user.role !== 'admin') { router.push('/'); return; }
  }, [status, session, router]);

  // Fetch Teams
  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tournament');
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || []);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'tournament') fetchTeams();
  }, [activeTab, fetchTeams]);

  // Actions
  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setEditForm({ ...team });
    setTournamentTab('profile'); // Default to profile when selecting
  };

  const handleSaveTeam = async () => {
    if (!editForm) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/competitions/tournament/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: editForm._id, updates: editForm }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTeams(prev => prev.map(t => t._id === editForm._id ? updated.team : t));
        setSelectedTeam(updated.team);
        setMessage({ type: 'success', text: 'Real-time update successful!' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to sync update.' });
    } finally {
      setSaving(false);
    }
  };

  // ── Render Selection Hub ──
  if (activeTab === 'hub') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl w-full text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black uppercase text-white mb-4 tracking-tighter"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Admin <span className="text-green-500 underline decoration-green-500/20">Competitions</span>
          </motion.h1>
          <p className="text-gray-500 text-sm mb-12 uppercase tracking-widest font-bold">Pick a theater of operations</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEAGUE CHOICE */}
            <motion.button
              onClick={() => setActiveTab('league')}
              whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-gray-800 bg-gray-900 group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/80 z-0 opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                <FaFutbol size={48} className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-1">Leagues</h2>
                <p className="text-gray-500 text-[10px] uppercase font-bold">Seasonal Home & Away Management</p>
              </div>
            </motion.button>

            {/* TOURNAMENT CHOICE */}
            <motion.button
              onClick={() => setActiveTab('tournament')}
              whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-green-800/40 bg-gray-900 group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 to-black/80 z-0 opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                <FaTrophy size={48} className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
                <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-1">Tournaments</h2>
                <p className="text-gray-500 text-[10px] uppercase font-bold">Knockout & Group Stage Ops</p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Tournament Manager ──
  if (activeTab === 'tournament') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col pt-20">
        {/* Sub Header */}
        <div className="fixed top-20 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 flex items-center h-14 px-6 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setActiveTab('hub'); setSelectedTeam(null); }}
              className="p-2 hover:bg-gray-900 rounded-full transition-colors text-gray-500 hover:text-white"
            >
              <FaArrowLeft size={16} />
            </button>
            <h2 className="font-black uppercase tracking-widest text-sm" style={{ fontFamily: 'Impact, sans-serif' }}>
              Tournament <span className="text-yellow-500">Commander</span>
            </h2>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${message.type === 'success' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2">
            {['profile', 'players', 'standings'].map(t => (
              <button 
                key={t}
                onClick={() => setTournamentTab(t)}
                className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                  tournamentTab === t ? 'bg-yellow-600 border-yellow-500 text-black' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                {t === 'profile' && <><FaUserTie className="inline mr-1" /> Edit Profile</>}
                {t === 'players' && <><FaUsers className="inline mr-1" /> Edit Players</>}
                {t === 'standings' && <><FaTable className="inline mr-1" /> Update Scores</>}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interface Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: Management Panel (Slide-out or Fixed) */}
          <AnimatePresence mode="wait">
            {selectedTeam && (
              <motion.div 
                key="edit-panel"
                initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}
                className="w-[450px] bg-gray-900 border-r border-gray-800 h-[calc(100vh-140px)] fixed bottom-0 left-0 z-30 flex flex-col shadow-2xl overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black uppercase tracking-[0.2em] text-gray-500 text-[10px]">Team Command Console</h3>
                    <button onClick={() => setSelectedTeam(null)} className="text-gray-600 hover:text-white transition"><FaTimes /></button>
                  </div>

                  {/* PROFILE EDIT TAB */}
                  {tournamentTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
                         <h4 className="text-[9px] font-black uppercase text-yellow-500 tracking-widest mb-4">Core Identity</h4>
                         <div className="space-y-4">
                           <div>
                             <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">Squad Name</label>
                             <input 
                               value={editForm.teamName} onChange={e => setEditForm({...editForm, teamName: e.target.value})}
                               className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none transition-colors" 
                             />
                           </div>
                           <div>
                             <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">World Cup Theme</label>
                             <input 
                               value={editForm.worldCupTeam} onChange={e => setEditForm({...editForm, worldCupTeam: e.target.value})}
                               className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none transition-colors" 
                             />
                           </div>
                         </div>
                      </div>

                      <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
                         <h4 className="text-[9px] font-black uppercase text-yellow-500 tracking-widest mb-4">Personnel Command</h4>
                         <div className="space-y-4">
                           <div>
                             <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">Manager Direct</label>
                             <input 
                               value={editForm.managerName} onChange={e => setEditForm({...editForm, managerName: e.target.value})}
                               placeholder="Manager Full Name"
                               className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none transition-colors" 
                             />
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                             <div>
                               <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">Manager Phone</label>
                               <input 
                                 value={editForm.managerPhone} onChange={e => setEditForm({...editForm, managerPhone: e.target.value})}
                                 className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none transition-colors" 
                               />
                             </div>
                             <div>
                               <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">Manager Email</label>
                               <input 
                                 value={editForm.managerEmail} onChange={e => setEditForm({...editForm, managerEmail: e.target.value})}
                                 className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-yellow-500 outline-none transition-colors" 
                               />
                             </div>
                           </div>
                         </div>
                      </div>

                      <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
                        <h4 className="text-[9px] font-black uppercase text-yellow-500 tracking-widest mb-4">Support Staff</h4>
                        <div className="space-y-3">
                          {editForm.supportGuests?.map((guest, idx) => (
                            <div key={idx} className="flex gap-2 items-end">
                              <div className="flex-1">
                                <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">Staff {idx+1} Name</label>
                                <input 
                                  value={guest.name} onChange={e => {
                                    const next = [...editForm.supportGuests];
                                    next[idx].name = e.target.value;
                                    setEditForm({...editForm, supportGuests: next});
                                  }}
                                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-[11px] text-white outline-none focus:border-yellow-500" 
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">Role (e.g. Ball Boy / Water Boy)</label>
                                <input 
                                  value={guest.role} onChange={e => {
                                    const next = [...editForm.supportGuests];
                                    next[idx].role = e.target.value;
                                    setEditForm({...editForm, supportGuests: next});
                                  }}
                                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-[11px] text-white outline-none focus:border-yellow-500" 
                                />
                              </div>
                            </div>
                          ))}
                          {editForm.supportGuests?.length < 3 && (
                            <button 
                              onClick={() => setEditForm({...editForm, supportGuests: [...(editForm.supportGuests||[]), {name: '', role: ''}]})}
                              className="w-full py-2 border border-dashed border-gray-700 rounded-xl text-[10px] text-gray-500 hover:text-white hover:border-gray-500 transition-all font-bold uppercase tracking-widest"
                            >
                              <FaPlus className="inline mr-1" /> Add Support Staff
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PLAYERS EDIT TAB */}
                  {tournamentTab === 'players' && (
                    <div className="space-y-4">
                      <h4 className="text-[9px] font-black uppercase text-green-500 tracking-widest mb-4">Roster Management</h4>
                      {editForm.players.map((player, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors ${player.isReserve ? 'bg-indigo-900/10 border-indigo-900/40' : 'bg-gray-800/40 border-gray-700/50'}`}>
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black uppercase text-gray-600">{player.isReserve ? 'RESERVE PLAYER' : 'OFFICIAL SQUAD'}</span>
                            <button onClick={() => {
                              const next = editForm.players.filter((_, i) => i !== idx);
                              setEditForm({...editForm, players: next});
                            }} className="text-gray-700 hover:text-red-500"><FaTrashAlt size={10} /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              value={player.name} onChange={e => {
                                const next = [...editForm.players];
                                next[idx].name = e.target.value;
                                setEditForm({...editForm, players: next});
                              }}
                              placeholder="Player Name"
                              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-green-500" 
                            />
                            <select 
                              value={player.position} onChange={e => {
                                const next = [...editForm.players];
                                next[idx].position = e.target.value;
                                setEditForm({...editForm, players: next});
                              }}
                              className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-[11px] text-white outline-none focus:border-green-500 cursor-pointer"
                            >
                              <option value="GK">Goalkeeper</option>
                              <option value="DEF">Defender</option>
                              <option value="MID">Midfielder</option>
                              <option value="FWD">Forward</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                             <input 
                               type="checkbox" checked={player.isReserve} onChange={e => {
                                 const next = [...editForm.players];
                                 next[idx].isReserve = e.target.checked;
                                 setEditForm({...editForm, players: next});
                               }}
                               className="w-3 h-3 text-green-500" 
                             />
                             <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Set as Reserve</span>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setEditForm({...editForm, players: [...editForm.players, {name: '', position: 'MID', isReserve: false}]})}
                        className="w-full py-4 border border-dashed border-gray-700 rounded-xl text-xs text-gray-500 hover:text-white hover:border-gray-500 transition-all font-bold uppercase tracking-widest"
                      >
                        <FaPlus className="inline mr-2" /> Add Player to Roster
                      </button>
                    </div>
                  )}

                  {/* STANDINGS EDIT TAB */}
                  {tournamentTab === 'standings' && (
                    <div className="space-y-6">
                      <h4 className="text-[9px] font-black uppercase text-cyan-500 tracking-widest mb-4">Official Performance Metrics</h4>
                      
                      <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-5">
                         <div className="flex items-center justify-between mb-4">
                           <h5 className="text-[10px] font-bold text-white uppercase italic">Real-Time Sync Ready</h5>
                           <StatusBadge status={editForm.status} />
                         </div>

                         <div className="grid grid-cols-4 gap-3">
                           {[
                             { label: 'MP', key: 'mp' }, { label: 'W', key: 'w' }, { label: 'D', key: 'd' }, { label: 'L', key: 'l' },
                             { label: 'GF', key: 'gf' }, { label: 'GA', key: 'ga' }, { label: 'GD', key: 'gd' }, { label: 'PTS', key: 'pts' }
                           ].map(metric => (
                             <div key={metric.key} className="flex flex-col gap-1">
                               <label className="text-center text-[8px] font-black text-gray-600 uppercase tracking-tighter">{metric.label}</label>
                               <input 
                                type="number"
                                value={editForm[metric.key] || 0}
                                onChange={e => setEditForm({...editForm, [metric.key]: parseInt(e.target.value) || 0})}
                                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-1 py-2 text-center text-xs font-black text-white focus:border-cyan-500 outline-none transition-colors"
                               />
                             </div>
                           ))}
                         </div>

                         <div className="mt-6 flex flex-col gap-4">
                            <div>
                               <label className="block text-[8px] font-bold text-gray-600 uppercase mb-1">Group Assignment</label>
                               <div className="flex gap-2">
                                  <input 
                                    type="number" placeholder="No." min="1" max="8"
                                    value={editForm.groupNumber || ''} onChange={e => setEditForm({...editForm, groupNumber: parseInt(e.target.value)}) }
                                    className="w-16 bg-gray-900 border border-gray-800 rounded-lg px-2 py-2 text-center text-xs text-white" 
                                  />
                                  <select 
                                    className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white"
                                    value={editForm.groupLetter || ''} onChange={e => setEditForm({...editForm, groupLetter: e.target.value})}
                                  >
                                    <option value="">No Group</option>
                                    {['A','B','C', 'D', 'E', 'F', 'G', 'H'].map(l => <option key={l} value={l}>Group {l}</option>)}
                                  </select>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* Persistence Bar */}
                  <div className="mt-12 sticky bottom-0 left-0 right-0 bg-gray-900 pt-4 pb-8 space-y-3">
                    <motion.button 
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleSaveTeam}
                      disabled={saving}
                      className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-green-900/30 transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {saving ? <><FaSync className="animate-spin" /> Syncing...</> : <><FaSave /> Deploy Changes</>}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT: Floating Logo Grid View */}
          <div className={`flex-1 relative transition-all duration-700 ${selectedTeam ? 'pl-[450px]' : 'pl-0'}`}>
            <div className="absolute inset-0 bg-gray-950 overflow-hidden">
               {/* Decorative background grid */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
               
               {/* Selection Canvas */}
               <div className="relative w-full h-full p-20 flex items-center justify-center">
                 <AnimatePresence>
                   {!selectedTeam ? (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-20"
                     >
                       {teams.map((team, idx) => (
                         <motion.div
                           key={team._id}
                           layoutId={`team-logo-${team._id}`}
                           initial={{ opacity: 0, scale: 0.5 }}
                           animate={{ 
                             opacity: 1, 
                             scale: 1,
                             y: [0, Math.sin(idx) * 10, 0],
                             x: [0, Math.cos(idx) * 10, 0],
                           }}
                           transition={{
                             opacity: { delay: idx * 0.05 },
                             scale: { delay: idx * 0.05 },
                             y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
                             x: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' },
                           }}
                           whileHover={{ scale: 1.2, zIndex: 10 }}
                           onClick={() => handleSelectTeam(team)}
                           className="flex flex-col items-center gap-4 cursor-pointer group"
                         >
                           <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-gray-900 border border-gray-800 group-hover:border-yellow-500/50 shadow-2xl transition-all">
                              {team.worldCupTeamLogo ? (
                                <Image src={team.worldCupTeamLogo} alt={team.teamName} fill className="object-contain p-4 group-hover:scale-110 transition-transform" />
                              ) : (
                                <span className="text-3xl font-black text-gray-800">{team.teamName[0]}</span>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full" />
                           </div>
                           <h4 className="text-[9px] font-black uppercase text-gray-500 group-hover:text-white transition-colors tracking-widest text-center max-w-[120px] truncate">{team.teamName}</h4>
                         </motion.div>
                       ))}
                     </motion.div>
                   ) : (
                     /* MASSIVE LOGO ON RIGHT VIEW */
                     <div className="w-full h-full flex items-center justify-end pr-20">
                        <motion.div 
                          layoutId={`team-logo-${selectedTeam._id}`}
                          className="relative w-[500px] h-[500px] opacity-20 grayscale group"
                        >
                          {selectedTeam.worldCupTeamLogo ? (
                            <Image src={selectedTeam.worldCupTeamLogo} alt={selectedTeam.teamName} fill className="object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center border border-gray-800 rounded-full">
                               <span className="text-[200px] font-black text-gray-800/20">{selectedTeam.teamName[0]}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <motion.h1 
                               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                               className="text-8xl font-black text-white/10 uppercase tracking-tighter"
                               style={{ fontFamily: 'Impact, sans-serif' }}
                             >
                               {selectedTeam.teamName}
                             </motion.h1>
                          </div>
                        </motion.div>
                     </div>
                   )}
                 </AnimatePresence>

                 {/* Empty State */}
                 {!loading && teams.length === 0 && (
                   <div className="text-center">
                     <FaShieldAlt size={64} className="text-gray-800 mx-auto mb-6" />
                     <p className="text-gray-600 font-bold uppercase tracking-widest">No strategic squads registered</p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render League Manager ──
  if (activeTab === 'league') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-20">
         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
           <FaFutbol size={80} className="text-blue-500 mx-auto mb-8 animate-bounce" />
           <h2 className="text-4xl font-black uppercase mb-4" style={{ fontFamily: 'Impact, sans-serif' }}>League Control <span className="text-blue-400">Offline</span></h2>
           <p className="text-gray-500 mb-12 max-w-md mx-auto">The administrative interface for weekly leagues is currently undergoing a tactical overhaul for Season 1.</p>
           <button 
            onClick={() => setActiveTab('hub')}
            className="px-10 py-4 border border-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-colors"
           >
            Return to Hub
           </button>
         </motion.div>
      </div>
    );
  }
}
