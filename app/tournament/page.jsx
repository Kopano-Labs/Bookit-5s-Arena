'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaTrophy, FaCheck, FaArrowRight, FaArrowLeft,
  FaFutbol, FaUsers, FaWhatsapp, FaEnvelope,
  FaPhone, FaShieldAlt, FaChevronDown,
} from 'react-icons/fa';
import GiscusComments from '@/components/GiscusComments';

/* ─── World Cup teams for selection ───────────────────────── */
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

const emptyPlayer = () => ({ name: '', position: 'MID', isReserve: false });

/* ═══════════════════════════════════════════════════════════ */
export default function TournamentPage() {
  const [step, setStep] = useState(0); // 0=gate, 1=terms, 2=rules, 3=form, 4=congrats
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [rulesSkipped, setRulesSkipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* Form state */
  const [form, setForm] = useState({
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    teamName: '',
    worldCupTeam: '',
    communicationPref: 'whatsapp',
    players: [emptyPlayer(), emptyPlayer(), emptyPlayer(), emptyPlayer(), emptyPlayer()],
    supportGuests: [],
  });

  /* Tournament info from API */
  const [tournamentInfo, setTournamentInfo] = useState(null);

  useEffect(() => {
    fetch('/api/tournament')
      .then((r) => r.json())
      .then(setTournamentInfo)
      .catch(() => {});
  }, []);

  const updatePlayer = (idx, field, value) => {
    setForm((prev) => {
      const players = [...prev.players];
      players[idx] = { ...players[idx], [field]: value };
      return { ...prev, players };
    });
  };

  const addPlayer = (isReserve = false) => {
    if (form.players.length >= 8) return;
    setForm((prev) => ({
      ...prev,
      players: [...prev.players, { ...emptyPlayer(), isReserve }],
    }));
  };

  const addSupportGuest = () => {
    if (form.supportGuests.length >= 3) return;
    setForm((prev) => ({
      ...prev,
      supportGuests: [...prev.supportGuests, { name: '', role: '' }],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tournament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, agreedToTerms: true, agreedToRules: !rulesSkipped }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(data.message);
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Step renderer ─────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/tournment/backgrounds/tourment-background-page.jpg"
          alt=""
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 to-gray-950" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* Progress indicator */}
        {step > 0 && step < 4 && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {['Terms', 'Rules', 'Register'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    step > i + 1
                      ? 'bg-green-600 border-green-500 text-white'
                      : step === i + 1
                      ? 'border-green-500 text-green-400'
                      : 'border-gray-700 text-gray-600'
                  }`}
                  animate={step === i + 1 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {step > i + 1 ? <FaCheck size={10} /> : i + 1}
                </motion.div>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${
                  step >= i + 1 ? 'text-green-400' : 'text-gray-600'
                }`}>
                  {label}
                </span>
                {i < 2 && <div className={`w-8 h-px ${step > i + 1 ? 'bg-green-500' : 'bg-gray-700'}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Step 0: Gate ── */}
          {step === 0 && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-900/30 border-2 border-green-500/50 flex items-center justify-center"
                animate={{ boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 40px rgba(34,197,94,0.3)', '0 0 0 rgba(34,197,94,0)'] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <FaTrophy className="text-green-400" size={40} />
              </motion.div>
              <h1
                className="font-black uppercase mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                5s ARENA <span className="text-green-400">WORLD CUP</span>
              </h1>
              <p className="text-gray-400 text-lg mb-2">May 26 – 31, 2026 · Hellenic Football Club</p>
              <p className="text-gray-500 text-sm mb-8">
                {tournamentInfo
                  ? `${tournamentInfo.registeredCount}/${tournamentInfo.totalSlots} teams registered`
                  : 'Loading...'}
              </p>

              <motion.button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 text-white font-black uppercase tracking-widest text-sm cursor-pointer"
                style={{ boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(34,197,94,0.6)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFutbol size={16} /> Register Your Team <FaArrowRight size={12} />
              </motion.button>

              <p className="text-gray-600 text-xs mt-6">
                By proceeding, you&apos;ll need to accept our Terms & Conditions and review the tournament rules.
              </p>
            </motion.div>
          )}

          {/* ── Step 1: Terms ── */}
          {step === 1 && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                <FaShieldAlt className="inline text-green-400 mr-2" size={20} />
                Terms & Conditions
              </h2>
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6 max-h-80 overflow-y-auto space-y-3 text-sm text-gray-300">
                <p>1. By registering, you agree to all rules outlined on our Rules of the Game page.</p>
                <p>2. Participants play at their own risk. 5s Arena is not liable for injuries during play.</p>
                <p>3. All players must be 16+. Under-16s need parental consent.</p>
                <p>4. Personal belongings are your responsibility.</p>
                <p>5. 5s Arena reserves the right to refuse entry or remove anyone without refund.</p>
                <p>6. Sign-ups close 1 week before the tournament. <strong className="text-red-400">Late sign-ups will NOT be accepted.</strong></p>
                <p>7. Teams that fail to comply with the deadline will be removed from the system entirely.</p>
                <p>8. Refunds available up to 48 hours before the event. No refunds after.</p>
                <p>9. Any intentional damage to equipment — you pay for it.</p>
                <p>10. The manager is fully accountable for their team&apos;s conduct and compliance.</p>
              </div>

              <label className="flex items-center gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 rounded accent-green-500"
                />
                <span className="text-sm text-gray-300">
                  I have read and agree to the Terms & Conditions
                </span>
              </label>

              <div className="flex justify-between">
                <motion.button
                  onClick={() => setStep(0)}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm font-bold cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                >
                  <FaArrowLeft size={10} className="inline mr-2" /> Back
                </motion.button>
                <motion.button
                  onClick={() => termsAccepted && setStep(2)}
                  disabled={!termsAccepted}
                  className={`px-6 py-2 rounded-lg text-sm font-bold cursor-pointer ${
                    termsAccepted
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                  whileHover={termsAccepted ? { scale: 1.03 } : {}}
                >
                  Continue <FaArrowRight size={10} className="inline ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Rules (skippable) ── */}
          {step === 2 && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="text-center"
            >
              <h2 className="text-2xl font-black uppercase tracking-widest mb-4" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                Tournament Rules
              </h2>
              <p className="text-gray-400 mb-8">
                We recommend reading the full rules before registering. You can also skip and read later.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Link href="/rules-of-the-game" target="_blank">
                  <motion.button
                    className="px-6 py-3 rounded-xl bg-green-600 text-white font-bold uppercase tracking-widest text-sm cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    📖 Read Full Rules
                  </motion.button>
                </Link>
                <motion.button
                  onClick={() => { setRulesSkipped(true); setStep(3); }}
                  className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 font-bold uppercase tracking-widest text-sm cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                >
                  Skip for Now →
                </motion.button>
              </div>

              <motion.button
                onClick={() => { setRulesSkipped(false); setStep(3); }}
                className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold uppercase tracking-widest text-sm cursor-pointer"
                whileHover={{ scale: 1.03 }}
              >
                I&apos;ve Read Them — Continue →
              </motion.button>

              <div className="mt-6">
                <motion.button
                  onClick={() => setStep(1)}
                  className="text-gray-600 text-sm cursor-pointer"
                  whileHover={{ color: '#9ca3af' }}
                >
                  ← Back to Terms
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Registration Form ── */}
          {step === 3 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                <FaUsers className="inline text-green-400 mr-2" size={20} />
                Register Your Team
              </h2>

              {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-xl p-3 mb-4 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Manager Details */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">Manager / Captain</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={form.managerName}
                      onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                      placeholder="Full Name *"
                      className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                    />
                    <input
                      value={form.managerEmail}
                      onChange={(e) => setForm({ ...form, managerEmail: e.target.value })}
                      placeholder="Email *"
                      type="email"
                      className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                    />
                    <input
                      value={form.managerPhone}
                      onChange={(e) => setForm({ ...form, managerPhone: e.target.value })}
                      placeholder="Phone Number *"
                      type="tel"
                      className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                    />
                    <input
                      value={form.teamName}
                      onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                      placeholder="Team Name *"
                      className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                {/* World Cup Team Selection */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">Choose Your Country</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {WORLD_CUP_TEAMS.map((wc) => {
                      const val = `${wc.name} (${wc.player})`;
                      const selected = form.worldCupTeam === val;
                      return (
                        <motion.button
                          key={wc.name}
                          onClick={() => setForm({ ...form, worldCupTeam: val })}
                          className={`relative p-3 rounded-xl border text-center cursor-pointer overflow-hidden ${
                            selected
                              ? 'border-green-500 bg-green-900/30'
                              : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-12 h-12 mx-auto mb-2 rounded-lg overflow-hidden relative">
                            <Image src={wc.logo} alt={wc.name} fill className="object-cover" sizes="48px" />
                          </div>
                          <p className="text-white text-xs font-bold">{wc.name}</p>
                          <p className="text-gray-500 text-[10px]">{wc.player}</p>
                          {selected && (
                            <motion.div
                              className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <FaCheck size={8} className="text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Players */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">
                    Players ({form.players.filter((p) => !p.isReserve).length} starters, {form.players.filter((p) => p.isReserve).length} reserves)
                  </h3>
                  <div className="space-y-2">
                    {form.players.map((player, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`text-xs font-bold w-6 text-center ${player.isReserve ? 'text-gray-600' : 'text-green-400'}`}>
                          {player.isReserve ? 'R' : i + 1}
                        </span>
                        <input
                          value={player.name}
                          onChange={(e) => updatePlayer(i, 'name', e.target.value)}
                          placeholder={player.isReserve ? 'Reserve name' : `Player ${i + 1} name *`}
                          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                        />
                        <select
                          value={player.position}
                          onChange={(e) => updatePlayer(i, 'position', e.target.value)}
                          className="px-2 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 text-xs outline-none cursor-pointer"
                        >
                          {POSITIONS.map((pos) => (
                            <option key={pos} value={pos}>{pos}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  {form.players.length < 8 && (
                    <motion.button
                      onClick={() => addPlayer(true)}
                      className="mt-3 text-green-400 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      + Add Reserve Player
                    </motion.button>
                  )}
                </div>

                {/* Communication Preference */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">Communication Preference</h3>
                  <div className="flex gap-3">
                    {[
                      { value: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', color: 'green' },
                      { value: 'email', icon: FaEnvelope, label: 'Email', color: 'blue' },
                      { value: 'sms', icon: FaPhone, label: 'SMS', color: 'purple' },
                    ].map(({ value, icon: Icon, label, color }) => (
                      <motion.button
                        key={value}
                        onClick={() => setForm({ ...form, communicationPref: value })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold cursor-pointer ${
                          form.communicationPref === value
                            ? `border-${color}-500 bg-${color}-900/30 text-${color}-400`
                            : 'border-gray-700 text-gray-500'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Icon size={14} /> {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-between pt-4">
                  <motion.button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm font-bold cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    <FaArrowLeft size={10} className="inline mr-2" /> Back
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-3 rounded-xl bg-green-600 text-white font-black uppercase tracking-widest text-sm cursor-pointer disabled:opacity-50"
                    style={{ boxShadow: '0 0 25px rgba(34,197,94,0.4)' }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {loading ? 'Registering...' : 'Register Team'} <FaArrowRight size={10} className="inline ml-2" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Congratulations ── */}
          {step === 4 && (
            <motion.div
              key="congrats"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-600/20 border-2 border-green-500 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 40px rgba(34,197,94,0.5)', '0 0 0 rgba(34,197,94,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaCheck className="text-green-400" size={36} />
              </motion.div>
              <h2
                className="text-3xl font-black uppercase tracking-widest mb-4"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                🎉 <span className="text-green-400">CONGRATULATIONS!</span>
              </h2>
              <p className="text-gray-300 text-lg mb-2">{success}</p>
              <p className="text-gray-500 text-sm mb-8">
                A confirmation will be sent to your preferred communication channel. Keep an eye out for fixture announcements!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/">
                  <motion.button
                    className="px-6 py-3 rounded-xl bg-gray-800 text-white font-bold uppercase tracking-widest text-sm cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    Back to Home
                  </motion.button>
                </Link>
                <Link href="/rules-of-the-game">
                  <motion.button
                    className="px-6 py-3 rounded-xl border border-green-600 text-green-400 font-bold uppercase tracking-widest text-sm cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                  >
                    Read the Rules
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Comments / Fan Zone ── */}
        <div className="mt-20 relative z-20">
          <GiscusComments />
        </div>
      </div>
    </div>
  );
}
