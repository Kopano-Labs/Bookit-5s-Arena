'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLayerGroup, FaTags, FaTrophy, FaTools } from 'react-icons/fa';
import Link from 'next/link';

const SERIES = [
  { id: 'all', name: 'All Posts', icon: FaLayerGroup },
  { id: 'tournament', name: 'World Cup Updates', icon: FaTrophy },
  { id: 'tech', name: 'Engineering & Tech', icon: FaTools },
  { id: 'news', name: 'Venue News', icon: FaTags },
];

const POSTS = [
  {
    id: 1,
    title: 'How We Built the 5s Arena Platform',
    series: 'tech',
    date: '14 April 2026',
    author: 'Engineering',
    excerpt: 'Deep dive into our Next.js 15, Framer Motion, and Tailwind CSS tech stack for the ultimate football booking experience.',
    link: '/blog/how-we-built-this'
  },
  {
    id: 2,
    title: 'World Cup Group Stage Draw Results',
    series: 'tournament',
    date: '20 May 2026',
    author: 'Admin',
    excerpt: 'The pots have been emptied and the groups are set. Check out the 8 high-stakes groups for the upcoming World Cup.',
    link: '#'
  },
  {
    id: 3,
    title: 'New LED Lighting Installation Complete',
    series: 'news',
    date: '1 March 2026',
    author: 'Management',
    excerpt: 'We’ve just upgraded all 4 courts with ultra-bright 800W LED floodlights for perfect evening condition play.',
    link: '#'
  },
];

export default function BlogIndexPage() {
  const [activeSeries, setActiveSeries] = useState('all');

  const filteredPosts = activeSeries === 'all' 
    ? POSTS 
    : POSTS.filter(p => p.series === activeSeries);

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div 
            className="w-16 h-16 mx-auto bg-green-900/40 border-2 border-green-500/50 rounded-xl flex items-center justify-center mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            <FaLayerGroup className="text-green-400 text-2xl" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
            5S ARENA <span className="text-green-400">BLOG</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Updates, tech deep dives, tournament news, and venue announcements.
          </p>
        </div>

        {/* Series Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {SERIES.map(series => {
            const Icon = series.icon;
            const isActive = activeSeries === series.id;
            return (
              <button
                key={series.id}
                onClick={() => setActiveSeries(series.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700'
                } border`}
              >
                <Icon size={12} /> {series.name}
              </button>
            )
          })}
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center text-gray-500 text-sm py-12"
              >
                No posts in this series yet.
              </motion.p>
            ) : (
              filteredPosts.map((post, i) => (
                <motion.div
                  layout
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 hover:border-gray-700 group transition-colors shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-gray-700">
                      {SERIES.find(s => s.id === post.series)?.name}
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{post.date}</span>
                  </div>
                  
                  <Link href={post.link}>
                    <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-3 group-hover:text-green-400 transition-colors" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                  
                  <Link href={post.link} className="inline-block text-xs font-bold uppercase tracking-widest text-green-400 hover:text-green-300 transition-colors">
                    Read Article &rarr;
                  </Link>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
