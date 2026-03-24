'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FaTrophy, FaUsers, FaChartLine, FaRobot,
  FaEdit, FaSave, FaSignOutAlt, FaFutbol,
} from 'react-icons/fa';

/* ─── World Cup teams ───────────────────────── */
const WORLD_CUP_TEAMS = [
  { name: 'Argentina', player: 'Lionel Messi', logo: '/images/tournment/worldcup-logos/lionel-messi-team.jpg' },
  { name: 'Portugal', player: 'Cristiano Ronaldo', logo: '/images/tournment/worldcup-logos/cristiano-ronaldo-team.jpg' },
  { name: 'France', player: 'Kylian Mbappé', logo: '/images/tournment/worldcup-logos/kylian-mbappe-team.jpg' },
  { name: 'Brazil', player: 'Vinícius Jr', logo: '/images/tournment/worldcup-logos/vinícius-jr-team.jpg' },
  { name: 'Spain', player: 'Lamine Yamal', logo: '/images/tournment/worldcup-logos/lamine-yamal-team.jpg' },
  { name: 'England', player: 'Harry Kane', logo: '/images/tournment/worldcup-logos/harry-kane-team.jpg' },
  { name: 'Germany', player: 'Florian Wirtz', logo: '/images/tournment/worldcup-logos/florian-wirtz-team.jpg' },
  { name: 'South Korea', player: 'Son Heung-Min', logo: '/images/tournment/worldcup-logos/son-heung-min-team.jpg' },
];

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];

export default function TournamentManagerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('squad'); // squad, stats, ai
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Temporary state for editing
  const [editForm, setEditForm] = useState(null);

  // AI Chat state
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AI Co-Coach. Need tactical advice or opponent analysis?" }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // In a real app, we'd fetch the user's registered team from the DB here
      // fetch('/api/tournament/my-team').then(...)
      
      // Mock data for demonstration
      const mockTeam = {
        _id: 'team123',
        teamName: 'Milnerton All Stars',
        worldCupTeam: 'Argentina (Lionel Messi)',
        managerName: session.user.name || 'Manager',
        status: 'approved',
        players: [
          { name: 'John Doe', position: 'FWD', isReserve: false },
          { name: 'Mike Smith', position: 'MID', isReserve: false },
          { name: 'Sarah Jones', position: 'DEF', isReserve: false },
          { name: 'Chris Lee', position: 'DEF', isReserve: false },
          { name: 'Alex Brown', position: 'GK', isReserve: false },
          { name: 'Tom Wilson', position: 'MID', isReserve: true },
        ],
        supportGuests: [
          { name: 'Jane Doe', role: 'Coach' },
        ]
      };
      
      setTeam(mockTeam);
      setEditForm(JSON.parse(JSON.stringify(mockTeam)));
      setLoading(false);
    }
  }, [status, router, session]);

  const handleSave = () => {
    setSaving(true);
    // Simulate API save
    setTimeout(() => {
      setTeam(JSON.parse(JSON.stringify(editForm)));
      setSaving(false);
      setEditMode(false);
    }, 1000);
  };

  const handleAIChat = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: inputMsg }]);
    const userMsg = inputMsg;
    setInputMsg('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Based on your squad of ${team.players.length} players, I suggest focusing on quick passing in the midfield. Your selected team (${team.worldCupTeam.split(' ')[0]}) plays best with a high press.`
      }]);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <FaFutbol className="text-green-500 animate-spin text-4xl mb-4" />
        <p className="text-green-400 font-bold uppercase tracking-widest text-sm">Loading Dashboard...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
        <FaTrophy className="text-gray-600 text-6xl mb-6" />
        <h1 className="text-2xl font-black uppercase text-white mb-2" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          No Team Found
        </h1>
        <p className="text-gray-400 mb-6 max-w-md">You haven&apos;t registered a team for the 5s Arena World Cup yet.</p>
        <button 
          onClick={() => router.push('/tournament')}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm"
        >
          Register Now
        </button>
      </div>
    );
  }

  const selectedWC = WORLD_CUP_TEAMS.find(t => editForm.worldCupTeam.includes(t.name)) || WORLD_CUP_TEAMS[0];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-20 pointer-events-none">
            <Image src={selectedWC.logo} alt="" fill className="object-cover mask-gradient-left" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-green-900/40 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-md">
                {team.status === 'approved' ? 'Registration Approved' : 'Pending Approval'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-widest mb-1" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              {team.teamName}
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <FaUsers className="text-gray-500" /> Manager: <span className="text-white font-bold">{team.managerName}</span>
            </p>
          </div>
          
          <div className="relative z-10 flex gap-3">
            {!editMode ? (
              <button 
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-xl text-sm font-bold transition-all"
              >
                <FaEdit /> Edit Squad
              </button>
            ) : (
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
            <button 
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl text-red-400 hover:text-red-300 text-sm font-bold transition-all"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'squad', label: 'Squad Management', icon: FaUsers },
            { id: 'stats', label: 'Live Stats & Fixtures', icon: FaChartLine },
            { id: 'ai', label: 'AI Co-Coach', icon: FaRobot },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                  : 'text-gray-400 hover:bg-gray-800/50'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* ─── SQUAD MANAGEMENT ─── */}
            {activeTab === 'squad' && (
              <motion.div
                key="squad"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Left Column: World Cup Team & Support Staff */}
                <div className="space-y-6">
                  {/* World Cup Team */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                      <FaTrophy className="text-yellow-500" /> Selected Nation
                    </h3>
                    
                    {!editMode ? (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-700 relative flex-shrink-0">
                          <Image src={selectedWC.logo} alt={selectedWC.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-black uppercase text-xl text-white">{selectedWC.name}</p>
                          <p className="text-sm text-gray-400">{selectedWC.player}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {WORLD_CUP_TEAMS.map(wc => {
                          const val = `${wc.name} (${wc.player})`;
                          const isSelected = editForm.worldCupTeam === val;
                          return (
                            <button
                              key={wc.name}
                              onClick={() => setEditForm({...editForm, worldCupTeam: val})}
                              className={`p-2 rounded-lg border text-left text-xs ${isSelected ? 'border-green-500 bg-green-900/30 text-white font-bold' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                            >
                              {wc.name}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Support Guests */}
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex justify-between items-center">
                      <span>Support Staff (Max 3)</span>
                    </h3>
                    
                    <div className="space-y-3">
                      {editForm.supportGuests.map((guest, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            value={guest.name}
                            onChange={(e) => {
                              const newGuests = [...editForm.supportGuests];
                              newGuests[i].name = e.target.value;
                              setEditForm({...editForm, supportGuests: newGuests});
                            }}
                            disabled={!editMode}
                            placeholder="Full Name"
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-70 disabled:border-transparent outline-none focus:border-green-500"
                          />
                          <input 
                            value={guest.role}
                            onChange={(e) => {
                              const newGuests = [...editForm.supportGuests];
                              newGuests[i].role = e.target.value;
                              setEditForm({...editForm, supportGuests: newGuests});
                            }}
                            disabled={!editMode}
                            placeholder="Role (e.g. Coach)"
                            className="w-1/3 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-70 disabled:border-transparent outline-none focus:border-green-500"
                          />
                        </div>
                      ))}
                      
                      {editMode && editForm.supportGuests.length < 3 && (
                        <button 
                          onClick={() => setEditForm({...editForm, supportGuests: [...editForm.supportGuests, {name: '', role: ''}]})}
                          className="w-full py-2 border border-dashed border-gray-600 rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-400 uppercase tracking-widest font-bold"
                        >
                          + Add Support Staff
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Players List */}
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                      <FaFutbol className="text-green-500" /> Playing Squad
                    </h3>
                    <div className="flex gap-3 text-xs font-bold">
                      <span className="text-green-400">Starters: {editForm.players.filter(p => !p.isReserve).length}/5</span>
                      <span className="text-gray-400">Reserves: {editForm.players.filter(p => p.isReserve).length}/3</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Header row */}
                    <div className="flex gap-2 px-3 pb-2 border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      <div className="w-8">No.</div>
                      <div className="flex-1">Player Name</div>
                      <div className="w-24">Position</div>
                      <div className="w-20 text-center">Status</div>
                    </div>

                    {editForm.players.map((player, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        <div className={`w-8 text-center text-xs font-bold ${player.isReserve ? 'text-gray-600' : 'text-green-500'}`}>
                          {i + 1}
                        </div>
                        <input 
                          value={player.name}
                          onChange={(e) => {
                            const newPlayers = [...editForm.players];
                            newPlayers[i].name = e.target.value;
                            setEditForm({...editForm, players: newPlayers});
                          }}
                          disabled={!editMode}
                          placeholder="Player Name"
                          className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white disabled:opacity-80 disabled:bg-transparent outline-none focus:border-green-500"
                        />
                        <select
                          value={player.position}
                          onChange={(e) => {
                            const newPlayers = [...editForm.players];
                            newPlayers[i].position = e.target.value;
                            setEditForm({...editForm, players: newPlayers});
                          }}
                          disabled={!editMode}
                          className="w-24 bg-gray-800/50 border border-gray-700/50 rounded-lg px-2 py-2 text-xs text-gray-300 disabled:opacity-80 disabled:bg-transparent outline-none focus:border-green-500 disabled:appearance-none cursor-pointer"
                        >
                          {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                        </select>
                        <select
                          value={player.isReserve ? 'reserve' : 'starter'}
                          onChange={(e) => {
                            const newPlayers = [...editForm.players];
                            newPlayers[i].isReserve = e.target.value === 'reserve';
                            setEditForm({...editForm, players: newPlayers});
                          }}
                          disabled={!editMode}
                          className={`w-24 bg-transparent border-0 rounded-lg py-2 text-xs font-bold font-mono tracking-widest text-center outline-none disabled:appearance-none cursor-pointer ${player.isReserve ? 'text-gray-500' : 'text-green-400'}`}
                        >
                          <option value="starter">STARTER</option>
                          <option value="reserve">RESERVE</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  {editMode && editForm.players.length < 8 && (
                    <button 
                      onClick={() => setEditForm({...editForm, players: [...editForm.players, {name: '', position: 'MID', isReserve: true}]})}
                      className="mt-6 w-full py-3 border border-dashed border-gray-600 rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-400 uppercase tracking-widest font-bold"
                    >
                      + Add Player to Squad
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── LIVE STATS & FIXTURES ─── */}
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center p-12 bg-gray-900 border border-gray-800 rounded-2xl text-center"
              >
                <div className="w-20 h-20 mb-6 rounded-full bg-blue-900/30 border border-blue-500/50 flex items-center justify-center">
                  <FaChartLine size={30} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-black uppercase mb-3" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                  Tournament Not Started
                </h2>
                <p className="text-gray-400 max-w-md">
                  Live scores, group standings, and knockout brackets will appear here once the 5s Arena World Cup kicks off on May 26, 2026.
                </p>
              </motion.div>
            )}

            {/* ─── AI CO-COACH ─── */}
            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="bg-gray-900 border border-gray-800 rounded-2xl h-[500px] flex flex-col overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gray-800/80 p-4 border-b border-gray-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/50 flex items-center justify-center">
                    <FaRobot className="text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Tactical AI Assistant</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">Powered by 5s Arena Tech</p>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'ai' 
                          ? 'bg-gray-800 text-gray-300 rounded-tl-none border border-gray-700' 
                          : 'bg-green-600/20 text-green-100 rounded-tr-none border border-green-500/30'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                  <form onSubmit={handleAIChat} className="flex gap-3">
                    <input 
                      value={inputMsg}
                      onChange={e => setInputMsg(e.target.value)}
                      placeholder="Ask for formation advice, opponent analysis..."
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
                    />
                    <button 
                      type="submit"
                      disabled={!inputMsg.trim()}
                      className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
