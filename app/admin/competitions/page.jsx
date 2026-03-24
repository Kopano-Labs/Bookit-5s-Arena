'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy, FaFutbol, FaArrowLeft, FaTimes, FaSave, 
  FaUserTie, FaChevronRight, FaSync, FaUserEdit
} from 'react-icons/fa';
import Image from 'next/image';

const StatusBadge = ({ status }) => {
  const map = {
    confirmed: 'bg-green-900/40 text-green-400 border-green-700/50',
    pending: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50',
    disqualified: 'bg-red-900/40 text-red-400 border-red-700/50',
    official: 'bg-blue-900/40 text-blue-400 border-blue-700/50',
  };
  return <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${map[status] || 'bg-gray-800 text-gray-500'}`}>{status}</span>;
};

export default function AdminCompetitionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('hub'); 
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [tournamentTab, setTournamentTab] = useState('profile'); 
  const [editingPlayerIndex, setEditingPlayerIndex] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && session.user.role !== 'admin') { router.push('/'); return; }
  }, [status, session, router]);

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

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setEditForm({ ...team });
    setTournamentTab('profile'); 
    setEditingPlayerIndex(null);
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

  const handlePlayerEdit = (index) => {
    setEditingPlayerIndex(index);
    setTournamentTab('players-edit');
  };

  if (activeTab === 'hub') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_0%,transparent_70%)] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10 mb-10 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-black uppercase text-white tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>
            Competition <span className="text-green-500">Hub</span>
          </h1>
          <div className="h-1 w-20 md:w-24 bg-green-500 mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl w-full z-10 px-4 md:px-0">
          <motion.button onClick={() => setActiveTab('tournament')} whileHover={{ scale: 1.02, y: -10 }} className="group relative h-64 md:h-80 rounded-[30px] md:rounded-[40px] overflow-hidden border border-green-500/20 bg-gray-900 shadow-2xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-black/90 to-black z-0" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 md:p-10 text-center">
               <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <FaTrophy size={40} className="text-yellow-400" />
               </div>
               <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-2">Tournament</h2>
               <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Real-Time Standings & Roster Control</p>
            </div>
          </motion.button>

          <motion.button onClick={() => setActiveTab('league')} whileHover={{ scale: 1.02, y: -10 }} className="group relative h-64 md:h-80 rounded-[30px] md:rounded-[40px] overflow-hidden border border-blue-500/20 bg-gray-900 shadow-2xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-black/90 to-black z-0" />
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6 md:p-10 text-center">
               <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  <FaFutbol size={40} className="text-blue-400" />
               </div>
               <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-2">Weekly Leagues</h2>
               <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Ongoing Season Management</p>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  if (activeTab === 'tournament') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col pt-20">
        <div className="fixed top-20 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800 flex items-center h-16 px-8 justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => { setActiveTab('hub'); setSelectedTeam(null); }} className="p-3 hover:bg-gray-900 rounded-2xl transition-all border border-transparent hover:border-gray-800"><FaArrowLeft /></button>
            <div>
              <h2 className="font-black uppercase tracking-widest text-lg" style={{ fontFamily: 'Impact, sans-serif' }}><span className="text-green-500">Tournament</span> Master</h2>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{teams.length} Squads Registered</p>
            </div>
          </div>
          <div className="flex bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
            {['profile', 'players', 'standings'].map(t => (
              <button key={t} onClick={() => { setTournamentTab(t); setEditingPlayerIndex(null); }} className={`text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-xl transition-all ${tournamentTab.startsWith(t) ? 'bg-green-600 text-white shadow-[0_10px_20px_rgba(34,197,94,0.3)]' : 'text-gray-500 hover:text-white'}`}>
                {t === 'profile' && 'Edit Profile'}
                {t === 'players' && 'Edit Players'}
                {t === 'standings' && 'Update Scores'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className={`flex-1 relative bg-gray-950 transition-all duration-700 ${selectedTeam ? 'pr-[500px]' : ''}`}>
             <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
             <div className="relative w-full h-full p-10 md:p-20 flex flex-wrap items-center justify-center content-center gap-12 md:gap-24 overflow-y-auto max-h-screen scrollbar-hide">
               {teams.map((team) => (
                 <motion.div key={team._id} layoutId={`team-${team._id}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: selectedTeam?._id === team._id ? 1.2 : 1 }} whileHover={{ scale: 1.1, y: -10 }} onClick={() => handleSelectTeam(team)} className="flex flex-col items-center cursor-pointer relative group">
                   <div className="relative w-24 h-24 md:w-40 md:h-40 flex items-center justify-center p-4">
                      <motion.div className="absolute inset-0 rounded-full bg-green-500/5 opacity-0 group-hover:opacity-100 blur-3xl" animate={{ scale: [1, 1.4, 1], opacity: [0, 0.1, 0] }} transition={{ duration: 4, repeat: Infinity }} />
                      {team.worldCupTeamLogo ? (
                        <div className="relative w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_20px_40px_rgba(34,197,94,0.4)] transition-all">
                          <Image src={team.worldCupTeamLogo} alt={team.teamName} fill className="object-contain" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-2xl border-2 border-dashed border-gray-800 flex items-center justify-center text-3xl font-black text-gray-800">{team.teamName[0]}</div>
                      )}
                   </div>
                   <h4 className="mt-4 text-[9px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.3em] group-hover:text-green-500 transition-colors text-center max-w-[120px] md:max-w-[160px]">{team.worldCupTeam.split(' (')[0]}</h4>
                   <p className="text-[7px] md:text-[9px] font-bold text-gray-700 uppercase tracking-widest">{team.teamName}</p>
                 </motion.div>
               ))}
             </div>
          </div>

          <AnimatePresence>
            {selectedTeam && (
              <motion.div initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} className="fixed right-0 top-16 bottom-0 w-[500px] bg-gray-900 border-l border-gray-800 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] z-30 flex flex-col">
                 <div className="absolute top-0 right-0 h-full w-full opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
                    <div className="relative w-[1200px] h-[1200px]">
                       {selectedTeam.worldCupTeamLogo && <Image src={selectedTeam.worldCupTeamLogo} alt="" fill className="object-contain" />}
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 relative z-10 scrollbar-hide">
                    <div className="flex items-center justify-between mb-10">
                       <div>
                         <h3 className="text-xs font-black uppercase text-green-500 tracking-[0.4em] mb-1">COMMAND CONSOLE</h3>
                         <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>{selectedTeam.teamName}</h2>
                       </div>
                       <button onClick={() => setSelectedTeam(null)} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-all"><FaTimes/></button>
                    </div>

                    {tournamentTab === 'profile' && (
                       <div className="space-y-8">
                          <div className="bg-gray-800/20 rounded-3xl p-6 border border-white/5 backdrop-blur-md">
                             <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-1 h-1 bg-green-400 rounded-full"/> General Identity</h4>
                             <div className="space-y-5">
                                <div className="flex items-center gap-4 mb-2">
                                   <div className="relative w-16 h-16 rounded-2xl bg-gray-950 border border-white/5 overflow-hidden">
                                      {editForm.managerImage ? <Image src={editForm.managerImage} alt="" fill className="object-cover" /> : <FaUserTie className="absolute inset-0 m-auto text-gray-800" size={30} />}
                                   </div>
                                   <div className="flex-1">
                                      <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block">Manager Image (1:1)</label>
                                      <input value={editForm.managerImage || ''} onChange={e => setEditForm({...editForm, managerImage: e.target.value})} placeholder="https://..." className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-bold text-white" />
                                   </div>
                                </div>
                                <div>
                                   <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block">Manager Full Name</label>
                                   <input value={editForm.managerName} onChange={e => setEditForm({...editForm, managerName: e.target.value})} className="w-full bg-gray-950 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:border-green-500 outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block">Phone Direct</label>
                                      <input value={editForm.managerPhone} onChange={e => setEditForm({...editForm, managerPhone: e.target.value})} className="w-full bg-gray-950 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white" />
                                   </div>
                                   <div>
                                      <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block">Email Command</label>
                                      <input value={editForm.managerEmail} onChange={e => setEditForm({...editForm, managerEmail: e.target.value})} className="w-full bg-gray-950 border border-white/5 rounded-2xl px-5 py-4 text-xs font-bold text-white" />
                                   </div>
                                </div>
                             </div>
                          </div>
                          <div className="bg-gray-800/20 rounded-3xl p-6 border border-white/5 backdrop-blur-md">
                             <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 flex items-center gap-2"><div className="w-1 h-1 bg-blue-400 rounded-full"/> Technical Staff</h4>
                             <div className="space-y-4">
                                {editForm.supportGuests?.map((guest, idx) => (
                                   <div key={idx} className="space-y-3">
                                      <div className="grid grid-cols-2 gap-3 items-end">
                                         <div>
                                            <label className="text-[8px] font-black text-gray-600 uppercase mb-1 block">Full Name</label>
                                            <input value={guest.name} onChange={e => {
                                               const next = [...editForm.supportGuests];
                                               next[idx].name = e.target.value;
                                               setEditForm({...editForm, supportGuests: next});
                                            }} placeholder="Staff Name" className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white" />
                                         </div>
                                         <div>
                                            <label className="text-[8px] font-black text-gray-600 uppercase mb-1 block">Operational Role</label>
                                            <input value={guest.role} onChange={e => {
                                               const next = [...editForm.supportGuests];
                                               next[idx].role = e.target.value;
                                               setEditForm({...editForm, supportGuests: next});
                                            }} placeholder="Role (e.g. Ball Boy)" className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-white" />
                                         </div>
                                      </div>
                                      <div>
                                         <label className="text-[8px] font-black text-gray-600 uppercase mb-1 block">Profile URL (1:1 Aspect)</label>
                                         <input value={guest.image || ''} onChange={e => {
                                            const next = [...editForm.supportGuests];
                                            next[idx].image = e.target.value;
                                            setEditForm({...editForm, supportGuests: next});
                                         }} placeholder="Image URL (ID Format 1:1)" className="w-full bg-gray-950 border border-white/5 rounded-xl px-4 py-3 text-[9px] font-bold text-white" />
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    )}

                    {tournamentTab === 'players' && (
                       <div className="grid grid-cols-2 gap-4">
                          {editForm.players.map((player, idx) => (
                             <motion.button key={idx} whileHover={{ scale: 1.05 }} onClick={() => handlePlayerEdit(idx)} className="aspect-[1/1] bg-gray-950 border border-white/5 rounded-3xl p-4 flex flex-col items-center justify-center text-center group transition-all hover:border-green-500/30">
                                <div className="relative w-24 h-24 rounded-full bg-gray-900 border border-gray-800 overflow-hidden mb-3">
                                   {player.image ? <Image src={player.image} alt="" fill className="object-cover" /> : <div className="absolute inset-0 flex items-end justify-center"><div className="w-16 h-16 bg-gray-800 rounded-full opacity-50" /></div>}
                                </div>
                                <h4 className="text-[10px] font-black uppercase text-white truncate w-full">{player.name || 'NEW PLAYER'}</h4>
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-1">{player.position}</p>
                                {player.isReserve && <span className="absolute top-3 right-3 text-[7px] font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded uppercase">SUB</span>}
                             </motion.button>
                          ))}
                       </div>
                    )}

                    {tournamentTab === 'players-edit' && (
                       <div className="space-y-8">
                          <button onClick={() => setTournamentTab('players')} className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"><FaArrowLeft/> Back to Roster</button>
                          <div className="bg-gray-800/30 rounded-[40px] p-8 border border-white/5 relative overflow-hidden group">
                             <div className="relative w-full aspect-[1/1] bg-gray-950 rounded-[40px] border border-white/10 overflow-hidden mb-8 shadow-2xl">
                                {editForm.players[editingPlayerIndex].image ? <Image src={editForm.players[editingPlayerIndex].image} alt="" fill className="object-cover" /> : <div className="absolute inset-0 flex items-center justify-center"><div className="relative w-48 h-64 bg-gray-900 rounded-[100px_100px_20px_20px] opacity-20" /></div>}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6 right-6">
                                   <StatusBadge status="official" />
                                   <h3 className="text-3xl font-black uppercase text-white tracking-widest mt-2">{editForm.players[editingPlayerIndex].name || 'UNNAMED PLAYER'}</h3>
                                </div>
                             </div>
                             <div className="space-y-6">
                                <div>
                                   <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Player Name</label>
                                   <input value={editForm.players[editingPlayerIndex].name} onChange={e => {
                                      const next = [...editForm.players];
                                      next[editingPlayerIndex].name = e.target.value;
                                      setEditForm({...editForm, players: next});
                                   }} className="w-full bg-gray-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white focus:border-green-500 outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Tactical Position</label>
                                      <select value={editForm.players[editingPlayerIndex].position} onChange={e => {
                                         const next = [...editForm.players];
                                         next[editingPlayerIndex].position = e.target.value;
                                         setEditForm({...editForm, players: next});
                                      }} className="w-full bg-gray-950 border border-white/5 rounded-2xl px-6 py-4 text-[11px] font-bold text-white cursor-pointer select-none">
                                         <option value="GK">Goalkeeper</option>
                                         <option value="DEF">Defender</option>
                                         <option value="MID">Midfielder</option>
                                         <option value="FWD">Forward</option>
                                      </select>
                                   </div>
                                   <div>
                                      <label className="text-[10px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Profile URL (1:1)</label>
                                      <input value={editForm.players[editingPlayerIndex].image || ''} onChange={e => {
                                         const next = [...editForm.players];
                                         next[editingPlayerIndex].image = e.target.value;
                                         setEditForm({...editForm, players: next});
                                      }} className="w-full bg-gray-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-bold text-white" placeholder="https://..." />
                                   </div>
                                </div>
                                <div className="flex items-center gap-3 bg-indigo-900/10 p-4 rounded-2xl border border-indigo-500/20">
                                   <input type="checkbox" checked={editForm.players[editingPlayerIndex].isReserve} onChange={e => {
                                      const next = [...editForm.players];
                                      next[editingPlayerIndex].isReserve = e.target.checked;
                                      setEditForm({...editForm, players: next});
                                   }} className="w-4 h-4 rounded accent-indigo-500 cursor-pointer" />
                                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">SQUAD RESERVE STATUS</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}

                    {tournamentTab === 'standings' && (
                       <div className="space-y-6">
                          <div className="bg-gray-800/20 rounded-[40px] p-8 border border-white/5 backdrop-blur-md">
                             <div className="flex items-center justify-between mb-8">
                                <div>
                                  <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-1">REAL-TIME STANDINGS</h4>
                                  <button onClick={() => {
                                     const gf = parseInt(editForm.gf) || 0;
                                     const ga = parseInt(editForm.ga) || 0;
                                     setEditForm({...editForm, gd: gf - ga});
                                  }} className="text-[9px] font-bold text-gray-600 hover:text-white uppercase transition-colors">Auto-Refresh Goal Difference</button>
                                </div>
                                <div className="text-right">
                                   <span className="text-4xl font-black text-white italic">{editForm.pts || 0}</span>
                                   <p className="text-[9px] font-black text-gray-700 uppercase">POINTS TOTAL</p>
                                </div>
                             </div>
                             <div className="grid grid-cols-4 gap-4 md:gap-6">
                                {[
                                   { label: 'MP', key: 'mp' }, { label: 'W', key: 'w' }, { label: 'D', key: 'd' }, { label: 'L', key: 'l' },
                                   { label: 'GF', key: 'gf' }, { label: 'GA', key: 'ga' }, { label: 'GD', key: 'gd' }, { label: 'PTS', key: 'pts' }
                                ].map(m => (
                                   <div key={m.key} className="flex flex-col gap-2">
                                      <label className="text-center text-[9px] font-black text-gray-600 uppercase tracking-tighter">{m.label}</label>
                                      <input type="number" value={editForm[m.key]||0} onChange={e => setEditForm({...editForm, [m.key]: parseInt(e.target.value)||0})} className="w-full bg-gray-950 border border-white/5 rounded-xl py-3 text-center text-xs font-black text-white focus:border-cyan-500 outline-none" />
                                   </div>
                                ))}
                             </div>
                             <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                                <div>
                                   <label className="text-[10px] font-black text-gray-600 uppercase mb-3 block tracking-widest">Group Assignment</label>
                                   <div className="relative">
                                     <select value={editForm.groupLetter || ''} onChange={e => setEditForm({...editForm, groupLetter: e.target.value})} className="w-full bg-gray-950 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white appearance-none cursor-pointer focus:border-cyan-500 outline-none">
                                        <option value="">UNASSIGNED</option>
                                        {['A','B','C','D','E','F','G','H'].map(l => <option key={l} value={l}>GROUP {l}</option>)}
                                     </select>
                                     <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"><FaChevronRight className="rotate-90" size={10} /></div>
                                   </div>
                                </div>
                                <div>
                                   <label className="text-[10px] font-black text-gray-600 uppercase mb-3 block tracking-widest">Live Table Position</label>
                                   <div className="flex items-center gap-4">
                                     <input type="range" min="1" max="6" value={editForm.groupRank || 1} onChange={e => setEditForm({...editForm, groupRank: parseInt(e.target.value)})} className="flex-1 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                                     <div className="w-12 h-12 rounded-xl bg-gray-950 border border-white/5 flex items-center justify-center text-lg font-black text-cyan-400">{editForm.groupRank || 1}</div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    )}
                 </div>

                 <div className="p-8 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800">
                    <motion.button whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={handleSaveTeam} disabled={saving} className="w-full h-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-[20px] text-xs font-black uppercase tracking-[0.4em] shadow-[0_15px_40px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50">
                       {saving ? <FaSync className="animate-spin" /> : <FaSave />}
                       {saving ? 'SYNCING REAL-TIME...' : 'DEPLOY CHANGES'}
                    </motion.button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (activeTab === 'league') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-20">
         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
           <FaFutbol size={80} className="text-blue-500 mx-auto mb-8 animate-bounce" />
           <h2 className="text-4xl font-black uppercase mb-4" style={{ fontFamily: 'Impact, sans-serif' }}>League Control <span className="text-blue-400">Offline</span></h2>
           <p className="text-gray-500 mb-12 max-w-md mx-auto">The administrative interface for weekly leagues is currently undergoing a tactical overhaul for Season 1.</p>
           <button onClick={() => setActiveTab('hub')} className="px-10 py-4 border border-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-colors">Return to Hub</button>
         </motion.div>
      </div>
    );
  }
}
