'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaUser,
  FaSearch,
  FaWhatsapp,
  FaFutbol,
  FaPlus,
  FaTimes,
} from 'react-icons/fa';

// ─── mock data ──────────────────────────────────────────────
const mockPlayers = [
  {
    id: 1,
    name: 'Sipho M.',
    position: 'Striker',
    skill: 'Advanced',
    availability: 'Weekends',
    bio: 'Looking for a competitive team in Milnerton area.',
    whatsapp: '27612345678',
  },
  {
    id: 2,
    name: 'James K.',
    position: 'Midfielder',
    skill: 'Intermediate',
    availability: 'Both',
    bio: 'Available most evenings after 6pm. Prefer social games.',
    whatsapp: '27623456789',
  },
  {
    id: 3,
    name: 'Thabo N.',
    position: 'Goalkeeper',
    skill: 'Advanced',
    availability: 'Weekdays',
    bio: 'Experienced keeper, played university level. Based in Parklands.',
    whatsapp: '27634567890',
  },
  {
    id: 4,
    name: 'Liam v/d Berg',
    position: 'Defender',
    skill: 'Beginner',
    availability: 'Weekends',
    bio: 'Just getting into 5-a-side. Keen to learn and have fun.',
    whatsapp: '27645678901',
  },
  {
    id: 5,
    name: 'Ayanda Z.',
    position: 'Winger',
    skill: 'Intermediate',
    availability: 'Both',
    bio: 'Quick on the wing, good crossing. Looking for regular games.',
    whatsapp: '27656789012',
  },
  {
    id: 6,
    name: 'Riyaad F.',
    position: 'Midfielder',
    skill: 'Advanced',
    availability: 'Weekdays',
    bio: 'Technical midfielder. Can play any midfield role. Tableview area.',
    whatsapp: '27667890123',
  },
];

const mockTeams = [
  {
    id: 1,
    name: 'Milnerton FC',
    positionsNeeded: 'Goalkeeper, Defender',
    skill: 'Intermediate',
    availability: 'Weekends',
    bio: 'Social team looking for 2 players to complete our squad.',
    whatsapp: '27712345678',
  },
  {
    id: 2,
    name: 'Cape Crusaders',
    positionsNeeded: 'Striker',
    skill: 'Beginner',
    availability: 'Weekdays',
    bio: 'Weekday evening team. All about fun, no pressure. Any level welcome.',
    whatsapp: '27723456789',
  },
  {
    id: 3,
    name: 'Parklands United',
    positionsNeeded: 'Midfielder, Winger',
    skill: 'Advanced',
    availability: 'Both',
    bio: 'Competitive side entering the Monday Night League. Need quality players.',
    whatsapp: '27734567890',
  },
  {
    id: 4,
    name: 'Table Bay FC',
    positionsNeeded: 'Any position',
    skill: 'Intermediate',
    availability: 'Weekends',
    bio: 'Saturday morning regulars. Friendly bunch, all welcome.',
    whatsapp: '27745678901',
  },
  {
    id: 5,
    name: 'Blouberg Strikers',
    positionsNeeded: 'Defender, Goalkeeper',
    skill: 'Intermediate',
    availability: 'Weekdays',
    bio: 'Wednesday league team needs defensive reinforcements.',
    whatsapp: '27756789012',
  },
  {
    id: 6,
    name: 'West Coast Warriors',
    positionsNeeded: 'Striker, Midfielder',
    skill: 'Advanced',
    availability: 'Both',
    bio: 'Top of the league. Looking for serious players to strengthen the squad.',
    whatsapp: '27767890123',
  },
];

// ─── helpers ────────────────────────────────────────────────
const skillBadge = (level) => {
  const map = {
    Beginner:     'bg-blue-900/50 text-blue-400 border-blue-800/60',
    Intermediate: 'bg-yellow-900/50 text-yellow-400 border-yellow-800/60',
    Advanced:     'bg-green-900/50 text-green-400 border-green-800/60',
  };
  return map[level] ?? map.Beginner;
};

const availBadge = (av) => {
  const map = {
    Weekdays: 'bg-purple-900/50 text-purple-400 border-purple-800/60',
    Weekends: 'bg-orange-900/50 text-orange-400 border-orange-800/60',
    Both:     'bg-cyan-900/50 text-cyan-400 border-cyan-800/60',
  };
  return map[av] ?? map.Both;
};

// ─── card variants ──────────────────────────────────────────
const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
  exit: { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

// ─── component ──────────────────────────────────────────────
const FindPlayersPage = () => {
  const [tab, setTab] = useState('players'); // 'players' | 'teams'
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(false);

  // form state
  const [form, setForm] = useState({
    name: '',
    type: 'player',
    position: '',
    skill: 'Intermediate',
    availability: 'Both',
    message: '',
    whatsapp: '',
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
    setToast(true);
    setTimeout(() => setToast(false), 3500);
    setForm({
      name: '',
      type: 'player',
      position: '',
      skill: 'Intermediate',
      availability: 'Both',
      message: '',
      whatsapp: '',
    });
  };

  const tabs = [
    { key: 'players', label: 'LOOKING FOR TEAM', icon: <FaUser size={13} /> },
    { key: 'teams',   label: 'LOOKING FOR PLAYERS', icon: <FaUsers size={13} /> },
  ];

  const data = tab === 'players' ? mockPlayers : mockTeams;

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Hero ──────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 border border-green-800/50 mb-5">
            <FaSearch className="text-2xl text-green-400" />
          </div>
          <h1
            className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Find Players
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Connect with the 5s Arena community. Find a team or recruit players for yours.
          </p>
        </motion.div>

        {/* ── Post Ad button ────────────────────────────────── */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 py-3 px-7 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
              boxShadow: '0 0 24px rgba(34,197,94,0.35)',
            }}
          >
            <FaPlus size={12} /> Post Your Ad
          </button>
        </motion.div>

        {/* ── Tabs ──────────────────────────────────────────── */}
        <div className="flex justify-center gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                tab === t.key
                  ? 'bg-green-900/40 text-green-400 border border-green-700'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Cards ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="grid gap-4 md:grid-cols-2"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {data.map((item, i) => (
              <motion.div
                key={item.id}
                custom={i}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-lg hover:border-gray-700 transition-colors"
              >
                {/* header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-green-400">
                      {tab === 'players' ? <FaUser size={14} /> : <FaUsers size={14} />}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm">{item.name}</h3>
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <FaFutbol size={10} className="text-green-500" />
                        {tab === 'players' ? item.position : item.positionsNeeded}
                      </p>
                    </div>
                  </div>
                </div>

                {/* badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${skillBadge(item.skill)}`}>
                    {item.skill}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${availBadge(item.availability)}`}>
                    {item.availability}
                  </span>
                </div>

                {/* bio */}
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">{item.bio}</p>

                {/* whatsapp */}
                <a
                  href={`https://wa.me/${item.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-700 hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp size={14} /> WhatsApp
                </a>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Toast ─────────────────────────────────────────── */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-900/90 border border-green-700 text-green-300 px-6 py-3 rounded-xl text-sm font-bold shadow-2xl z-50"
            >
              Your ad has been posted successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Modal ─────────────────────────────────────────── */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* backdrop */}
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
              />

              {/* form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2
                    className="text-xl font-black uppercase tracking-widest text-white"
                    style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                  >
                    Post Your Ad
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-600 transition-colors"
                      placeholder="Your name or team name"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      I am a...
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-600 transition-colors cursor-pointer"
                    >
                      <option value="player">Player looking for a team</option>
                      <option value="team">Team looking for players</option>
                    </select>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {form.type === 'player' ? 'Position' : 'Positions Needed'}
                    </label>
                    <input
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-600 transition-colors"
                      placeholder={form.type === 'player' ? 'e.g. Striker' : 'e.g. Goalkeeper, Defender'}
                    />
                  </div>

                  {/* Skill + Availability */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Skill Level
                      </label>
                      <select
                        name="skill"
                        value={form.skill}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-600 transition-colors cursor-pointer"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Availability
                      </label>
                      <select
                        name="availability"
                        value={form.availability}
                        onChange={handleChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-green-600 transition-colors cursor-pointer"
                      >
                        <option>Weekdays</option>
                        <option>Weekends</option>
                        <option>Both</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-600 transition-colors resize-none"
                      placeholder="Tell us a bit about yourself or your team..."
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      name="whatsapp"
                      value={form.whatsapp}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-600 transition-colors"
                      placeholder="e.g. 0612345678"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-sm font-black text-white uppercase tracking-widest transition-all hover:scale-[1.02] cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                      boxShadow: '0 0 20px rgba(34,197,94,0.35)',
                    }}
                  >
                    Submit
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FindPlayersPage;
