"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaPlay, FaArrowRight, FaYoutube, FaBroadcastTower } from "react-icons/fa";

export default function HomeMediaHighlights() {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHighlights() {
      try {
        const res = await fetch("/api/football/league/premier-league/news");
        const data = await res.json();
        if (res.ok) setNews(data);
      } catch (err) {
        console.error("Failed to fetch highlights", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHighlights();
  }, []);

  if (loading) return null;
  if (!news?.videos?.length) return null;

  const featuredVideo = news.videos[0];
  const sideVideos = news.videos.slice(1, 4);

  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-green-500/20 blur-[160px] rounded-full" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
               <FaYoutube className="text-rose-500" size={24} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Live Global Feed</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-[0.9]" style={{ fontFamily: 'Impact, sans-serif' }}>
              MATCH <span className="text-green-500">REACTIONS</span>
            </h2>
          </div>
          <Link href="/fixtures" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all group">
            Watch More <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Featured Video */}
          <motion.div 
            className="lg:col-span-8 group relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <a href={featuredVideo.url} target="_blank" rel="noreferrer" className="block relative aspect-video rounded-[40px] overflow-hidden bg-zinc-900 border border-zinc-800 ring-1 ring-white/5 group-hover:ring-green-500/30 transition-all">
              <Image src={featuredVideo.thumbnail} alt={featuredVideo.title} fill className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" unoptimized />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <FaPlay className="text-zinc-950 ml-1" size={24} />
                </div>
              </div>

              <div className="absolute bottom-10 left-10 right-10">
                <span className="inline-block px-3 py-1 rounded-full bg-green-500 text-black text-[9px] font-black uppercase tracking-widest mb-4">
                  Featured Reaction
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-white leading-tight">
                  {featuredVideo.title}
                </h3>
                <p className="text-zinc-400 text-sm mt-2 font-bold uppercase tracking-widest">
                  {featuredVideo.reactor?.name || featuredVideo.channelName}
                </p>
              </div>
            </a>
          </motion.div>

          {/* Side List */}
          <div className="lg:col-span-4 space-y-6">
            {sideVideos.map((video, idx) => (
              <motion.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 group"
              >
                <div className="relative w-32 shrink-0 aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                  <Image src={video.thumbnail} alt="" fill className="object-cover opacity-70 group-hover:scale-110 transition-transform" unoptimized />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FaPlay className="text-white ml-0.5" size={10} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-green-400 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">
                    {video.reactor?.name || video.channelName}
                  </p>
                </div>
              </motion.a>
            ))}

            <div className="pt-6 border-t border-zinc-800">
                <div className="bg-zinc-900/50 rounded-3xl p-6 border border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                        <FaBroadcastTower className="text-green-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Latest Intelligence</span>
                    </div>
                    <ul className="space-y-4">
                        {news.articles.slice(0, 3).map(article => (
                            <li key={article.url}>
                                <a href={article.url} target="_blank" rel="noreferrer" className="block text-xs text-zinc-400 hover:text-white transition-colors line-clamp-2 leading-relaxed">
                                    • {article.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
