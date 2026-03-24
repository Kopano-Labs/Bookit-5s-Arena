'use client';

import { motion } from 'framer-motion';
import { FaCode, FaRocket, FaMobileAlt, FaBolt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function HowWeBuiltThisPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blog" className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors mb-4">
            <FaArrowLeft /> Back to Blog
          </Link>
          <motion.div 
            className="w-16 h-16 bg-blue-900/40 border-2 border-blue-500/50 rounded-xl flex items-center justify-center mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <FaCode className="text-blue-400 text-2xl" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            HOW WE BUILT THE <span className="text-blue-400">5S ARENA</span> PLATFORM
          </h1>
          <div className="flex gap-4 items-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              By Engineering Team
            </p>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              14 April 2026
            </p>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-h2:font-black prose-h2:uppercase prose-h2:tracking-widest prose-h2:text-white prose-p:text-gray-400 prose-a:text-blue-400 prose-strong:text-white">
          <p className="lead text-xl text-gray-300 font-bold mb-8">
            When we set out to build the digital home for the largest 5-a-side World Cup tournament in Cape Town, we knew a standard WordPress site wouldn't cut it. We needed an architecture capable of handling live score updates, heavy animation, and a massive influx of team registrations.
          </p>

          <h2 className="flex items-center gap-3 mt-12 mb-6 border-b border-gray-800 pb-2">
            <FaRocket className="text-green-500" /> The Tech Stack
          </h2>
          <p>
            Our core mission was performance and stability. We selected <strong>Next.js 15</strong> utilizing the App Router to build a fully robust, Server-Side Rendered (SSR) infrastructure combined with aggressive Static Site Generation (SSG). 
          </p>
          <ul>
            <li><strong>Frontend Framework:</strong> React 19 + Next.js</li>
            <li><strong>Styling:</strong> Tailwind CSS V4 for blazing fast utility-first styling.</li>
            <li><strong>Motion & Animation:</strong> Framer Motion 12. We extensively used tween-based transitions to prevent browser layout thrashing during heavy DOM manipulations.</li>
            <li><strong>Database:</strong> MongoDB via Mongoose for rapid prototyping and flexible document storage of Tournament Teams.</li>
          </ul>

          <h2 className="flex items-center gap-3 mt-12 mb-6 border-b border-gray-800 pb-2">
            <FaBolt className="text-yellow-500" /> Overcoming the Framer Motion "BoxShadow" Crash
          </h2>
          <p>
            Early in development, we hit a critical wall. The application would completely white-screen crash when navigating between pages with heavy animations. The culprit? Applying <code>spring</code> physics transitions to multi-keyframe <code>boxShadow</code> pulses. 
          </p>
          <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5 my-6">
            <code className="text-sm text-red-400 block mb-2">// The bad way (causes crash):</code>
            <code className="text-sm text-gray-300 block">
              transition: &#123; type: "spring", stiffness: 300 &#125;
            </code>
            <div className="w-full h-px bg-gray-800 my-4" />
            <code className="text-sm text-green-400 block mb-2">// The safe way:</code>
            <code className="text-sm text-gray-300 block">
              transition: &#123; duration: 2, ease: "easeInOut", repeat: Infinity &#125;
            </code>
          </div>
          <p>
            By switching exclusively to duration-based tweens for complex properties, we instantly solved the hydration crashes and smoothed out the UX.
          </p>

          <h2 className="flex items-center gap-3 mt-12 mb-6 border-b border-gray-800 pb-2">
            <FaMobileAlt className="text-purple-500" /> Mobile-First Real-time Architecture
          </h2>
          <p>
            The tournament dashboard had to look stunning on mobile while delivering real-time stats. We implemented a lightweight polling mechanism leveraging Next.js Route Handlers (<code>/api/tournament/stats</code>) and edge execution to deliver lightning-fast JSON payloads. This guarantees that when a team locks in their World Cup spot, the capacity meters update globally within seconds.
          </p>

          <div className="mt-16 pt-8 border-t border-gray-800 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Share this article</p>
              <div className="flex gap-3">
                <button className="text-blue-400 hover:text-white transition font-bold text-sm">Twitter</button>
                <button className="text-blue-500 hover:text-white transition font-bold text-sm">LinkedIn</button>
              </div>
            </div>
            <Link href="/blog" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-sm font-bold text-white uppercase tracking-widest transition-all shadow-lg">
              Read More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
