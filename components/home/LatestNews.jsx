'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaNewspaper, FaClock, FaArrowRight, FaBullhorn } from 'react-icons/fa';

export default function LatestNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        setNews(data.news || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {[1, 2, 3].map(i => (
          <div key={i} className="min-w-[300px] h-48 bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
        ))}
      </div>
    );
  }

  if (!news.length) {
    return (
      <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 text-center">
        <FaBullhorn className="text-gray-700 text-3xl mx-auto mb-4 opacity-50" />
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No Active Broadcasts</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-4 px-4">
      {news.map((item, i) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="min-w-[320px] bg-gray-900/40 border border-gray-800 rounded-[32px] p-6 hover:border-green-500/30 transition-all group backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 bg-green-900/20 text-green-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-green-500/10">
              {item.type}
            </span>
            <div className="flex items-center gap-1.5 text-gray-600 text-[9px] font-bold">
              <FaClock size={8} />
              {new Date(item.date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }).toUpperCase()}
            </div>
          </div>
          <h3 className="text-white font-black text-lg uppercase tracking-tighter mb-2 line-clamp-1 group-hover:text-green-400 transition-colors" style={{ fontFamily: 'Impact, sans-serif' }}>
            {item.subject}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 mb-6 font-medium leading-relaxed">
            {item.title} — Official broadcast from the 5S Arena command center.
          </p>
          <button className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-[0.2em] group-hover:gap-3 transition-all">
            Read Intel <FaArrowRight size={10} />
          </button>
        </motion.div>
      ))}
    </div>
  );
}
