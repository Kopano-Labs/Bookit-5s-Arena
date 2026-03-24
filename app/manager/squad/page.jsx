'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, FaEdit, FaSave, FaTimes, FaCheckCircle, 
  FaHourglassHalf, FaExclamationTriangle, FaArrowLeft,
  FaFutbol, FaIdBadge
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function ManagerSquadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedPlayers, setEditedPlayers] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated') {
      if (session.user.role !== 'manager' && session.user.role !== 'admin') {
        router.replace('/');
      } else {
        fetchMyTeam();
      }
    }
  }, [status, session]);

  const fetchMyTeam = async () => {
    try {
      const res = await fetch('/api/tournament');
      const data = await res.json();
      if (res.ok) {
        // Filter for the logged-in manager's team
        const myTeam = (data.teams || []).find(t => t.managerEmail === session.user.email);
        setTeam(myTeam);
        if (myTeam) setEditedPlayers([...myTeam.players]);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlayer = (idx, field, value) => {
    const newPlayers = [...editedPlayers];
    newPlayers[idx] = { ...newPlayers[idx], [field]: value };
    setEditedPlayers(newPlayers);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/tournament/squad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: team._id, players: editedPlayers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      
      setTeam({ ...team, players: editedPlayers });
      setEditing(false);
      setMessage({ type: 'success', text: 'Squad updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-green-500">
        <FaUsers className="animate-pulse text-4xl" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <FaExclamationTriangle className="text-yellow-500 text-5xl mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-widest mb-2">No Registration Found</h1>
        <p className="text-gray-400 max-w-md mb-8">You haven't registered a team for the 5s Arena World Cup yet. Register now to manage your squad.</p>
        <Link href="/tournament" className="px-8 py-3 bg-green-600 text-white font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">Register Team</Link>
      </div>
    );
  }

  const isConfirmed = team.paymentStatus === 'confirmed';

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb */}
        <Link href="/manager/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8">
          <FaArrowLeft /> Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-800 pb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                isConfirmed ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-yellow-900/20 text-yellow-500 border-yellow-500/30'
              }`}>
                {isConfirmed ? <><FaCheckCircle className="inline mr-1" /> Confirmed</> : <><FaHourglassHalf className="inline mr-1" /> Payment Pending</>}
              </span>
              <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">Tournament ID: {team._id.slice(-6).toUpperCase()}</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight" style={{ fontFamily: 'Impact, sans-serif' }}>
              {team.teamName} <span className="text-green-400">Squad</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Representing <span className="text-white font-bold">{team.worldCupTeam}</span></p>
          </div>

          {!isConfirmed && (
            <div className="bg-red-900/20 border border-red-800/30 p-4 rounded-2xl flex items-start gap-3 max-w-sm">
              <FaExclamationTriangle className="text-red-500 flex-shrink-0 mt-1" />
              <p className="text-[10px] text-red-300 leading-relaxed uppercase font-black tracking-wider">
                Editing is disabled until your Proof of Payment is verified by our finance team in "God-Mode".
              </p>
            </div>
          )}
        </div>

        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl text-xs font-black uppercase tracking-widest border ${
              message.type === 'success' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-red-900/20 text-red-500 border-red-500/30'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Squad Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {team.players.map((p, i) => (
            <motion.div 
              key={i}
              className={`p-5 rounded-3xl border transition-all ${
                editing ? 'bg-gray-800 border-green-500/30' : 'bg-gray-900 border-gray-800'
              }`}
              whileHover={editing ? {} : { scale: 1.02 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center text-green-500 border border-gray-700">
                  {i < 5 ? <FaFutbol className="text-xl" /> : <FaIdBadge className="text-xl text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                    {i < 5 ? `Starter #${i+1}` : `Substitute #${i-4}`}
                  </p>
                  {editing ? (
                    <div className="space-y-2">
                      <input 
                        value={editedPlayers[i]?.name}
                        onChange={(e) => handleUpdatePlayer(i, 'name', e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-green-500 outline-none"
                        placeholder="Player Name"
                      />
                      <select
                        value={editedPlayers[i]?.position}
                        onChange={(e) => handleUpdatePlayer(i, 'position', e.target.value)}
                        className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-green-500 outline-none"
                      >
                        <option value="GK">Goalkeeper (GK)</option>
                        <option value="DEF">Defender (DEF)</option>
                        <option value="MID">Midfielder (MID)</option>
                        <option value="FWD">Forward (FWD)</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-sm text-white">{p.name || `Unnamed Player ${i+1}`}</h3>
                      <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">{p.position}</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          {isConfirmed && !editing && (
            <button 
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-black uppercase tracking-widest rounded-xl border border-gray-700 hover:bg-gray-700 transition-all cursor-pointer"
            >
              <FaEdit /> Edit Squad
            </button>
          )}

          {editing && (
            <>
              <button 
                onClick={() => { setEditing(false); setEditedPlayers([...team.players]); }}
                className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-gray-400 font-black uppercase tracking-widest rounded-xl border border-gray-800 hover:text-white transition-all cursor-pointer"
              >
                <FaTimes /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-green-500 shadow-lg shadow-green-900/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : <><FaSave /> Save Changes</>}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
