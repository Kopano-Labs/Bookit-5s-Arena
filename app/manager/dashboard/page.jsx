'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUserShield, FaTrophy, FaCalendarCheck, FaGift, FaUsersCog, FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';

export default function ManagerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated') {
      // Extra client-side security check just in case middleware is bypassed in dev mode
      if (session?.user?.role !== 'manager' && session?.user?.role !== 'admin') {
        router.replace('/');
      } else {
        setLoading(false);
      }
    }
  }, [status, session, router]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-green-500 gap-4">
        <FaUserShield size={40} className="animate-pulse" />
        <p className="tracking-widest font-black uppercase text-sm">Validating Manager Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-green-500/30">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaUserShield className="text-green-500 text-2xl" />
            <div>
              <h1 className="font-black uppercase tracking-widest text-lg leading-none" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                MANAGER HQ
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Isolated Access Mode</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{session?.user?.name}</p>
              <p className="text-[10px] text-green-400 uppercase tracking-widest border border-green-500/30 bg-green-900/20 px-2 py-0.5 rounded-full inline-block mt-1">Authorized</p>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-red-800/30 transition-all cursor-pointer"
            >
              <FaSignOutAlt /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-10 bg-yellow-900/20 border border-yellow-700/30 rounded-2xl p-4 flex items-start gap-4">
          <FaExclamationTriangle className="text-yellow-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-1">Restricted Environment</h3>
            <p className="text-xs text-yellow-500/80 leading-relaxed">
              You are currently logged in with a strict <strong>Manager Role</strong>. Standard platform features (booking courts, browsing public pages) are disabled to protect organizational focus. If you need standard user access, please logout and use a regular User account.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* TOURNAMENT SQUADS */}
          <motion.div whileHover={{ y: -5 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/10" />
            <FaUsersCog className="text-green-500 text-3xl mb-4" />
            <h2 className="text-lg font-black uppercase tracking-widest mb-2">Squad Editing</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Manage your World Cup tournament squads, assign reserve players, and modify team colors.</p>
            <Link href="/tournament/manager" className="inline-flex items-center justify-center w-full py-3 bg-gray-800 hover:bg-green-600/20 border border-gray-700/50 hover:border-green-500/50 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer">
              Manage Squads
            </Link>
          </motion.div>

          {/* ACTIVE COMPETITIONS */}
          <motion.div whileHover={{ y: -5 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/10" />
            <FaTrophy className="text-blue-500 text-3xl mb-4" />
            <h2 className="text-lg font-black uppercase tracking-widest mb-2">Competitions</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">View active leagues and tournaments your organized teams are participating in.</p>
            <button disabled className="inline-flex items-center justify-center w-full py-3 bg-gray-800/50 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed">
              Coming Soon
            </button>
          </motion.div>

          {/* UPCOMING FIXTURES */}
          <motion.div whileHover={{ y: -5 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-orange-500/10" />
            <FaCalendarCheck className="text-orange-500 text-3xl mb-4" />
            <h2 className="text-lg font-black uppercase tracking-widest mb-2">Fixtures</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Check opponent match-ups, date schedules, and court assignments for your teams.</p>
            <button disabled className="inline-flex items-center justify-center w-full py-3 bg-gray-800/50 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed">
              Coming Soon
            </button>
          </motion.div>

          {/* REWARDS & PROFILE */}
          <motion.div whileHover={{ y: -5 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/10" />
            <FaGift className="text-purple-500 text-3xl mb-4" />
            <h2 className="text-lg font-black uppercase tracking-widest mb-2">Rewards & Profile</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">Update your manager details and claim organizational loyalty rewards.</p>
            <button disabled className="inline-flex items-center justify-center w-full py-3 bg-gray-800/50 text-gray-600 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed">
              Coming Soon
            </button>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
