'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaTrophy, FaCheck, FaArrowRight, FaArrowLeft,
  FaFutbol, FaUsers, FaWhatsapp, FaEnvelope,
  FaPhone, FaShieldAlt, FaChevronDown, FaUpload,
  FaMoneyBillWave, FaFileUpload, FaExclamationTriangle,
  FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';

/* ─── All 48 World Cup teams ───────────────────────────────── */
const WORLD_CUP_TEAMS = [
  { name: 'Argentina', player: 'Lionel Messi', logo: '/images/tournment/worldcup-logos/lionel-messi-team.jpg', profile: '/images/tournment/worldcup-player-profiles/lionel-messi.jpg' },
  { name: 'Portugal', player: 'Cristiano Ronaldo', logo: '/images/tournment/worldcup-logos/cristiano-ronaldo-team.jpg', profile: '/images/tournment/worldcup-player-profiles/cristiano-ronaldo.jpg' },
  { name: 'France', player: 'Kylian Mbappé', logo: '/images/tournment/worldcup-logos/kylian-mbappe-team.jpg', profile: '/images/tournment/worldcup-player-profiles/kylian-mbappe.jpg' },
  { name: 'Brazil', player: 'Vinícius Jr', logo: '/images/tournment/worldcup-logos/vinícius-jr-team.jpg', profile: '/images/tournment/worldcup-player-profiles/vinícius-jr.jpg' },
  { name: 'Spain', player: 'Lamine Yamal', logo: '/images/tournment/worldcup-logos/lamine-yamal-team.jpg', profile: '/images/tournment/worldcup-player-profiles/lamine-yamal.jpg' },
  { name: 'England', player: 'Harry Kane', logo: '/images/tournment/worldcup-logos/harry-kane-team.jpg', profile: '/images/tournment/worldcup-player-profiles/harry-kane.jpg' },
  { name: 'Germany', player: 'Florian Wirtz', logo: '/images/tournment/worldcup-logos/florian-wirtz-team.jpg', profile: '/images/tournment/worldcup-player-profiles/florian-wirtz.jpg' },
  { name: 'South Korea', player: 'Son Heung-Min', logo: '/images/tournment/worldcup-logos/son-heung-min-team.jpg', profile: '/images/tournment/worldcup-player-profiles/son-heung-min.jpg' },
  { name: 'Italy', player: 'Gianluigi Donnarumma', logo: '/images/tournment/worldcup-logos/gianluigi-donnarumma-team.jpg', profile: '/images/tournment/worldcup-player-profiles/gianluigi-donnarumma.jpg' },
  { name: 'Morocco', player: 'Achraf Hakimi', logo: '/images/tournment/worldcup-logos/achraf-hakimi-team.jpg', profile: '/images/tournment/worldcup-player-profiles/achraf-hakimi.jpg' },
  { name: 'Japan', player: 'Takefusa Kubo', logo: '/images/tournment/worldcup-logos/takefusa-kubo-team.jpg', profile: '/images/tournment/worldcup-player-profiles/takefusa-kubo.jpg' },
  { name: 'USA', player: 'Christian Pulisic', logo: '/images/tournment/worldcup-logos/jordan-pefok-team.jpg', profile: '/images/tournment/worldcup-player-profiles/christian-pulisic.png' },
  { name: 'Mexico', player: 'Santiago Giménez', logo: '/images/tournment/worldcup-logos/santiago-gimenez-team.jpg', profile: '/images/tournment/worldcup-player-profiles/santiago-gimenez.jpg' },
  { name: 'Netherlands', player: 'Virgil van Dijk', logo: '/images/tournment/worldcup-logos/santiago-donnama-team.jpg', profile: '/images/tournment/worldcup-player-profiles/virgil-van-dijk.png' },
  { name: 'Nigeria', player: 'Victor Osimhen', logo: '/images/tournment/worldcup-logos/cape-verde-team.jpg', profile: '/images/tournment/worldcup-player-profiles/victor-osimhen.png' },
  { name: 'Senegal', player: 'Sadio Mané', logo: '/images/tournment/worldcup-logos/curaçao-team.jpg', profile: '/images/tournment/worldcup-player-profiles/sadio-mane.png' },
  { name: 'Colombia', player: 'Luis Díaz', logo: '/images/tournment/worldcup-logos/Jordan-team.jpg', profile: '/images/tournment/worldcup-player-profiles/luis-diaz.png' },
  { name: 'Croatia', player: 'Luka Modrić', logo: '/images/tournment/worldcup-logos/uzbekistan-team.jpg', profile: '/images/tournment/worldcup-player-profiles/luka-modric.png' },
  { name: 'Belgium', player: 'Kevin De Bruyne', logo: '/images/tournment/worldcup-logos/jordan-pefok-team.jpg', profile: '/images/tournment/worldcup-player-profiles/kevin-de-bruyne.png' },
  { name: 'Uruguay', player: 'Federico Valverde', logo: '/images/tournment/worldcup-logos/jordan-pefok-team.jpg', profile: '/images/tournment/worldcup-player-profiles/federico-valverde.png' },
  { name: 'Cape Verde', player: 'Cape Verde Star', logo: '/images/tournment/worldcup-logos/cape-verde-team.jpg', profile: '/images/tournment/worldcup-player-profiles/cape-verde.jpg' },
  { name: 'Curaçao', player: 'Curaçao Star', logo: '/images/tournment/worldcup-logos/curaçao-team.jpg', profile: '/images/tournment/worldcup-player-profiles/curaçao.jpg' },
  { name: 'Jordan', player: 'Jordan Star', logo: '/images/tournment/worldcup-logos/Jordan-team.jpg', profile: '/images/tournment/worldcup-player-profiles/jordan.jpg' },
  { name: 'Uzbekistan', player: 'Uzbekistan Star', logo: '/images/tournment/worldcup-logos/uzbekistan-team.jpg', profile: '/images/tournment/worldcup-player-profiles/uzbekistan.jpg' },
];

const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'];
const emptyPlayer = () => ({ name: '', position: 'MID', isReserve: false });

/* ── Player Carousel Component ── */
function PlayerCarousel() {
  const [currentSet, setCurrentSet] = useState(0);
  const timerRef = useRef(null);
  const VISIBLE = 4;
  const totalSets = Math.ceil(WORLD_CUP_TEAMS.length / VISIBLE);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentSet((prev) => (prev + 1) % totalSets);
    }, 15000);
    return () => clearInterval(timerRef.current);
  }, [totalSets]);

  const currentPlayers = WORLD_CUP_TEAMS.slice(
    currentSet * VISIBLE,
    currentSet * VISIBLE + VISIBLE
  );

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-green-400 text-xs font-bold uppercase tracking-[0.2em]">
          ⚽ Representing Nations
        </h3>
        <div className="flex gap-2">
          <motion.button
            onClick={() => setCurrentSet((p) => (p - 1 + totalSets) % totalSets)}
            className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 cursor-pointer"
            whileHover={{ scale: 1.1, borderColor: '#22c55e' }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronLeft size={10} />
          </motion.button>
          <motion.button
            onClick={() => setCurrentSet((p) => (p + 1) % totalSets)}
            className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 cursor-pointer"
            whileHover={{ scale: 1.1, borderColor: '#22c55e' }}
            whileTap={{ scale: 0.9 }}
          >
            <FaChevronRight size={10} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSet}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {currentPlayers.map((team) => (
            <motion.div
              key={team.name}
              className="relative group cursor-pointer"
              whileHover={{ y: -8, transition: { duration: 0.2, type: 'tween' } }}
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-gray-800 group-hover:border-green-500/50 transition-colors">
                <Image
                  src={team.profile}
                  alt={team.player}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-bold">{team.player}</p>
                  <p className="text-green-400 text-[10px] font-bold uppercase tracking-wider">{team.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: totalSets }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrentSet(i)}
            className={`rounded-full cursor-pointer transition-all ${
              i === currentSet ? 'w-6 h-2 bg-green-500' : 'w-2 h-2 bg-gray-700'
            }`}
            whileHover={{ scale: 1.3 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
export default function TournamentPage() {
  // Steps: 0=gate, 1=rules, 2=terms, 3=form, 4=payment, 5=congrats
  const [step, setStep] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [rulesRead, setRulesRead] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentUploading, setPaymentUploading] = useState(false);

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
        body: JSON.stringify({ ...form, agreedToTerms: true, agreedToRules: rulesRead }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(data.message);
      setStep(4); // Go to payment step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentUpload = async () => {
    if (!paymentFile) return;
    setPaymentUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', paymentFile);
      formData.append('teamName', form.teamName);
      formData.append('managerEmail', form.managerEmail);
      const res = await fetch('/api/tournament/payment', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setStep(5); // Congrats
    } catch (err) {
      setError(err.message);
    } finally {
      setPaymentUploading(false);
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
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-gray-950/90 to-gray-950" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* Progress indicator */}
        {step > 0 && step < 5 && (
          <div className="flex items-center justify-center gap-1.5 mb-10 flex-wrap">
            {['Rules', 'Terms', 'Register', 'Payment'].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <motion.div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                    step > i + 1
                      ? 'bg-green-600 border-green-500 text-white'
                      : step === i + 1
                      ? 'border-green-500 text-green-400'
                      : 'border-gray-700 text-gray-600'
                  }`}
                  animate={step === i + 1 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {step > i + 1 ? <FaCheck size={8} /> : i + 1}
                </motion.div>
                <span className={`text-[9px] uppercase tracking-widest font-bold ${
                  step >= i + 1 ? 'text-green-400' : 'text-gray-600'
                }`}>
                  {label}
                </span>
                {i < 3 && <div className={`w-6 h-px ${step > i + 1 ? 'bg-green-500' : 'bg-gray-700'}`} />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Step 0: Gate / Welcome ── */}
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
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaTrophy className="text-green-400" size={40} />
              </motion.div>
              <h1
                className="font-black uppercase mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                5s ARENA <span className="text-green-400">WORLD CUP</span>
              </h1>
              <p className="text-gray-400 text-lg mb-2">May 29 – 31, 2026 · Hellenic Football Club</p>
              <p className="text-gray-500 text-sm mb-2">
                {tournamentInfo
                  ? `${tournamentInfo.registeredCount}/${tournamentInfo.totalSlots} teams registered`
                  : 'Loading...'}
              </p>

              {/* Tournament format info */}
              <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
                {[
                  { icon: '🏟️', label: '8 Groups' },
                  { icon: '⚽', label: '6 Teams / Group' },
                  { icon: '🏆', label: 'Top 4 Advance' },
                  { icon: '🎯', label: 'Round of 32 → Finals' },
                ].map((item) => (
                  <span key={item.label} className="px-3 py-1.5 rounded-full bg-gray-800/60 border border-gray-700 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {item.icon} {item.label}
                  </span>
                ))}
              </div>

              {/* Registration fee banner */}
              <motion.div
                className="bg-yellow-900/20 border border-yellow-600/30 rounded-2xl p-4 mb-8 max-w-md mx-auto"
                animate={{ borderColor: ['rgba(202,138,4,0.3)', 'rgba(202,138,4,0.6)', 'rgba(202,138,4,0.3)'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaMoneyBillWave className="text-yellow-400 text-xl mx-auto mb-2" />
                <p className="text-yellow-400 text-sm font-black uppercase tracking-widest">Registration Fee</p>
                <p className="text-white text-2xl font-black mt-1" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>ZAR 3,000.00</p>
                <p className="text-yellow-600 text-[10px] mt-1 uppercase tracking-wider">Non-negotiable · One-time · Bank deposit only</p>
              </motion.div>

              <motion.button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 text-white font-black uppercase tracking-widest text-sm cursor-pointer"
                style={{ boxShadow: '0 0 30px rgba(34,197,94,0.4)' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(34,197,94,0.6)', transition: { duration: 0.2, type: 'tween' } }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFutbol size={16} /> Register Your Team <FaArrowRight size={12} />
              </motion.button>

              <p className="text-gray-600 text-[10px] mt-6">
                By proceeding, you&apos;ll need to read the tournament rules, accept our Terms &amp; Conditions, and upload proof of payment.
              </p>

              {/* Player Carousel */}
              <PlayerCarousel />
            </motion.div>
          )}

          {/* ── Step 1: Rules (FIRST) ── */}
          {step === 1 && (
            <motion.div
              key="rules"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                📖 Tournament Rules
              </h2>
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-6 max-h-96 overflow-y-auto space-y-4 text-sm text-gray-300">
                <h3 className="text-green-400 font-bold uppercase tracking-widest text-xs">Format — UEFA Champions League Style</h3>
                <p>The 5s Arena World Cup follows the UEFA Champions League format:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li><strong className="text-white">8 Groups</strong> with <strong className="text-white">6 teams</strong> each (48 teams total)</li>
                  <li>Each team plays <strong className="text-white">one match</strong> against every other team in their group</li>
                  <li><strong className="text-green-400">Top 4 teams</strong> from each group advance to the <strong className="text-white">Round of 32</strong></li>
                  <li>From R32 onwards: single-elimination knockout (R32 → R16 → QF → SF → Final)</li>
                  <li>All knockout matches are <strong className="text-white">single game</strong> — win or go home</li>
                </ul>

                <h3 className="text-green-400 font-bold uppercase tracking-widest text-xs mt-6">Registration Fee</h3>
                <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
                  <p className="text-red-400 font-bold">⚠️ IMPORTANT INFORMATION</p>
                  <p className="mt-2">The registration fee is <strong className="text-white text-lg">ZAR 3,000.00</strong> per team.</p>
                  <p className="text-gray-400 mt-1">This is <strong className="text-red-400">non-negotiable</strong> with <strong className="text-red-400">no installment options</strong>. One-time payment only.</p>
                  <p className="text-gray-400 mt-2">We <strong className="text-red-400">adamantly only accept bank deposits</strong> for the tournament. No other payment methods.</p>
                </div>

                <h3 className="text-green-400 font-bold uppercase tracking-widest text-xs mt-6">Banking Details</h3>
                <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 space-y-1">
                  <p><strong className="text-gray-300">Bank:</strong> <span className="text-white">Capitec</span></p>
                  <p><strong className="text-gray-300">Account Name:</strong> <span className="text-white">Hellenic Courts</span></p>
                  <p><strong className="text-gray-300">Account Number:</strong> <span className="text-white font-mono">2503477980</span></p>
                  <p><strong className="text-gray-300">SWIFT/BIC:</strong> <span className="text-white font-mono">CABLZAJJ</span></p>
                </div>

                <h3 className="text-green-400 font-bold uppercase tracking-widest text-xs mt-6">Payment Approval Process</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Upload your proof of payment during registration</li>
                  <li>A staff member will confirm your payment within <strong className="text-white">24 hours</strong> (latest 2 working days)</li>
                  <li><strong className="text-yellow-400">Weekends not included</strong> — only special occasions (contact via WhatsApp)</li>
                  <li>Team management features unlock <strong className="text-white">only after payment approval</strong></li>
                </ul>

                <h3 className="text-green-400 font-bold uppercase tracking-widest text-xs mt-6">General Rules</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>All players must be 16+. Under-16s require parental consent.</li>
                  <li>Sign-ups close <strong className="text-red-400">1 week before the tournament</strong>. Late sign-ups will NOT be accepted.</li>
                  <li>Teams that fail to comply with the deadline will be removed entirely.</li>
                  <li>The manager is fully accountable for their team&apos;s conduct and compliance.</li>
                  <li>Any intentional damage to equipment — you pay for it.</li>
                  <li>Refunds available up to 48 hours before the event. No refunds after.</li>
                </ul>

                <h3 className="text-green-400 font-bold uppercase tracking-widest text-xs mt-6">🏅 Rewards Program</h3>
                <p>Teams earn points through social media engagement:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Take pictures/videos and <strong className="text-white">tag @fivesarena</strong> on social media</li>
                  <li>Paste the link in your Manager Dashboard to submit for points</li>
                  <li>More posts = more points. Points scale with engagement (likes, shares, reach)</li>
                  <li>Admin verifies each submission before awarding points</li>
                  <li><strong className="text-yellow-400">Special prizes at the Awards Ceremony</strong> for teams with the highest reward points</li>
                  <li>Awards ceremony prizes announced <strong className="text-white">1 week before tournament starts</strong></li>
                </ul>
              </div>

              <label className="flex items-center gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rulesRead}
                  onChange={(e) => setRulesRead(e.target.checked)}
                  className="w-5 h-5 rounded accent-green-500"
                />
                <span className="text-sm text-gray-300">
                  I have read and understand the tournament rules
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
                  onClick={() => rulesRead && setStep(2)}
                  disabled={!rulesRead}
                  className={`px-6 py-2 rounded-lg text-sm font-bold cursor-pointer ${
                    rulesRead
                      ? 'bg-green-600 text-white hover:bg-green-500'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                  whileHover={rulesRead ? { scale: 1.03 } : {}}
                >
                  Continue <FaArrowRight size={10} className="inline ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Terms & Conditions ── */}
          {step === 2 && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                <FaShieldAlt className="inline text-green-400 mr-2" size={20} />
                Terms &amp; Conditions
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
                <p>11. The registration fee of <strong className="text-white">ZAR 3,000.00</strong> is non-refundable after the 48-hour window.</p>
                <p>12. Team features (edit squad, manage lineup) are only available after proof of payment is verified.</p>
              </div>

              <label className="flex items-center gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 rounded accent-green-500"
                />
                <span className="text-sm text-gray-300">
                  I have read and agree to the Terms &amp; Conditions
                </span>
              </label>

              <div className="flex justify-between">
                <motion.button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm font-bold cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                >
                  <FaArrowLeft size={10} className="inline mr-2" /> Back
                </motion.button>
                <motion.button
                  onClick={() => termsAccepted && setStep(3)}
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

          {/* ── Step 3: Registration Form ── */}
          {step === 3 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              {/* Congrats header */}
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2
                  className="text-2xl font-black uppercase tracking-widest mb-2"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  🎉 <span className="text-green-400">WELCOME</span> TO THE WORLD CUP!
                </h2>
                <p className="text-gray-400 text-sm">You&apos;re signing up for the 5s Arena World Cup 2026. Let&apos;s get your team registered!</p>
              </motion.div>

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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-2">
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

                {/* Support Guests */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">Support Guests (Optional, max 3)</h3>
                  {form.supportGuests.map((guest, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        value={guest.name}
                        onChange={(e) => {
                          const g = [...form.supportGuests];
                          g[i] = { ...g[i], name: e.target.value };
                          setForm({ ...form, supportGuests: g });
                        }}
                        placeholder="Guest name"
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                      />
                      <input
                        value={guest.role}
                        onChange={(e) => {
                          const g = [...form.supportGuests];
                          g[i] = { ...g[i], role: e.target.value };
                          setForm({ ...form, supportGuests: g });
                        }}
                        placeholder="Role (e.g. Water carrier)"
                        className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm outline-none focus:border-green-500"
                      />
                    </div>
                  ))}
                  {form.supportGuests.length < 3 && (
                    <motion.button
                      onClick={addSupportGuest}
                      className="text-green-400 text-xs font-bold uppercase tracking-wider cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      + Add Support Guest
                    </motion.button>
                  )}
                </div>

                {/* Communication Preference */}
                <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
                  <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">Communication Preference</h3>
                  <div className="flex gap-3">
                    {[
                      { value: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp', c: '#22c55e' },
                      { value: 'email', icon: FaEnvelope, label: 'Email', c: '#3b82f6' },
                      { value: 'sms', icon: FaPhone, label: 'SMS', c: '#a855f7' },
                    ].map(({ value, icon: Icon, label, c }) => (
                      <motion.button
                        key={value}
                        onClick={() => setForm({ ...form, communicationPref: value })}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold cursor-pointer ${
                          form.communicationPref === value
                            ? 'border-green-500 bg-green-900/30 text-green-400'
                            : 'border-gray-700 text-gray-500'
                        }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Icon size={14} style={{ color: form.communicationPref === value ? c : undefined }} /> {label}
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
                    {loading ? 'Registering...' : 'Register & Continue to Payment'} <FaArrowRight size={10} className="inline ml-2" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Payment Upload ── */}
          {step === 4 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="text-center"
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-900/30 border-2 border-yellow-500/50 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaFileUpload className="text-yellow-400" size={30} />
              </motion.div>

              <h2
                className="text-2xl font-black uppercase tracking-widest mb-4"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                Upload <span className="text-yellow-400">Proof of Payment</span>
              </h2>

              <p className="text-gray-400 text-sm mb-6">
                Team registration saved! Now upload your deposit slip to complete the process.
              </p>

              {/* Banking details reminder */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 mb-6 text-left max-w-md mx-auto">
                <h3 className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">Banking Details</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-400">Bank: <span className="text-white">Capitec</span></p>
                  <p className="text-gray-400">Account: <span className="text-white">Hellenic Courts</span></p>
                  <p className="text-gray-400">Number: <span className="text-white font-mono">2503477980</span></p>
                  <p className="text-gray-400">SWIFT: <span className="text-white font-mono">CABLZAJJ</span></p>
                  <p className="text-gray-400 mt-2">Amount: <span className="text-yellow-400 font-bold">ZAR 3,000.00</span></p>
                </div>
              </div>

              {/* Upload area */}
              <div className="max-w-md mx-auto mb-6">
                <label
                  className={`flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                    paymentFile
                      ? 'border-green-500 bg-green-900/10'
                      : 'border-gray-700 bg-gray-900/40 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                  />
                  {paymentFile ? (
                    <div className="text-center">
                      <FaCheck className="text-green-400 text-2xl mx-auto mb-2" />
                      <p className="text-green-400 text-sm font-bold">{paymentFile.name}</p>
                      <p className="text-gray-500 text-xs mt-1">Click to change file</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FaUpload className="text-gray-600 text-2xl mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Click to upload deposit slip</p>
                      <p className="text-gray-600 text-xs mt-1">PNG, JPG, or PDF</p>
                    </div>
                  )}
                </label>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-xl p-3 mb-4 text-red-400 text-sm max-w-md mx-auto">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={handlePaymentUpload}
                  disabled={!paymentFile || paymentUploading}
                  className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm cursor-pointer ${
                    paymentFile
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                  style={paymentFile ? { boxShadow: '0 0 25px rgba(34,197,94,0.4)' } : {}}
                  whileHover={paymentFile ? { scale: 1.03 } : {}}
                  whileTap={paymentFile ? { scale: 0.97 } : {}}
                >
                  {paymentUploading ? 'Uploading...' : 'Submit Proof of Payment'}
                </motion.button>
              </div>

              <p className="text-gray-600 text-[10px] mt-4">
                Your payment will be verified within 24 hours (max 2 working days). Team features unlock after approval.
              </p>
            </motion.div>
          )}

          {/* ── Step 5: Congratulations ── */}
          {step === 5 && (
            <motion.div
              key="congrats"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-green-600/20 border-2 border-green-500 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 40px rgba(34,197,94,0.5)', '0 0 0 rgba(34,197,94,0)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <FaCheck className="text-green-400" size={36} />
              </motion.div>
              <h2
                className="text-3xl font-black uppercase tracking-widest mb-4"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                🎉 <span className="text-green-400">CONGRATULATIONS!</span>
              </h2>
              <p className="text-gray-300 text-lg mb-2">Your team has been registered for the 5s Arena World Cup 2026!</p>
              <p className="text-gray-500 text-sm mb-4">
                Your proof of payment has been submitted and will be reviewed by our staff within 24 hours.
              </p>
              <p className="text-gray-500 text-sm mb-8">
                A copy of the tournament rules and sign-up details will be sent to your preferred communication channel.
                Once payment is confirmed, you&apos;ll unlock the Manager Dashboard to edit your team.
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
      </div>
    </div>
  );
}
