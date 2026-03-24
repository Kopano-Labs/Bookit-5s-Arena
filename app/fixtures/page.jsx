'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy, FaFutbol, FaNewspaper, FaPlayCircle, FaClock,
  FaExternalLinkAlt, FaSyncAlt, FaChevronDown, FaChevronUp,
  FaChevronLeft, FaChevronRight, FaYoutube, FaTimes,
  FaInfoCircle, FaFire, FaStar, FaCheck, FaFilter,
  FaHeart, FaTh, FaList,
} from 'react-icons/fa';
import AnimatedTitle from '@/components/AnimatedTitle';

// ═══════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════

const LEAGUE_META = {
  PL:  { name: 'Premier League',           color: 'border-purple-500', bg: 'bg-purple-700',  accent: 'purple', textColor: 'text-purple-400' },
  LL:  { name: 'La Liga',                  color: 'border-orange-500', bg: 'bg-orange-600',  accent: 'orange', textColor: 'text-orange-400' },
  SA:  { name: 'Serie A',                  color: 'border-blue-500',   bg: 'bg-blue-600',    accent: 'blue',   textColor: 'text-blue-400' },
  BL:  { name: 'Bundesliga',               color: 'border-red-500',    bg: 'bg-red-600',     accent: 'red',    textColor: 'text-red-400' },
  PSL: { name: 'Premier Soccer League',    color: 'border-yellow-500', bg: 'bg-yellow-600',  accent: 'yellow', textColor: 'text-yellow-400' },
  UCL: { name: 'Champions League',         color: 'border-blue-900',   bg: 'bg-blue-900',    accent: 'navy',   textColor: 'text-blue-300' },
  WC:  { name: 'World Cup 5s Arena',       color: 'border-green-500',  bg: 'bg-green-600',   accent: 'green',  textColor: 'text-green-400' },
};

const TEAM_COLORS = {
  'Arsenal': '#EF0107', 'Chelsea': '#034694', 'Manchester City': '#6CABDD', 'Liverpool': '#C8102E',
  'Tottenham': '#132257', 'Manchester United': '#DA291C', 'Newcastle': '#241F20', 'Aston Villa': '#670E36',
  'Brighton': '#0057B8', 'West Ham': '#7A263A', 'Everton': '#003399', 'Wolves': '#FDB913',
  'Crystal Palace': '#1B458F', 'Fulham': '#CC0000', 'Bournemouth': '#DA291C', 'Nottingham Forest': '#DD0000',
  'Barcelona': '#A50044', 'Real Madrid': '#FEBE10', 'Atletico Madrid': '#CB3524', 'Sevilla': '#D60B2C',
  'Real Sociedad': '#143C8C', 'Villarreal': '#FFE600', 'Real Betis': '#00954C', 'Athletic Bilbao': '#EE2523',
  'Inter Milan': '#009BDB', 'AC Milan': '#FB090B', 'Juventus': '#000000', 'Napoli': '#12A0D7',
  'Roma': '#8E1F2F', 'Atalanta': '#1E71B8', 'Lazio': '#87D8F7', 'Fiorentina': '#482E92',
  'Bayern Munich': '#DC052D', 'Borussia Dortmund': '#FDE100', 'RB Leipzig': '#DD0741', 'Bayer Leverkusen': '#E32221',
  'Eintracht Frankfurt': '#E1000F', 'Wolfsburg': '#65B32E', 'Stuttgart': '#E32219', 'Freiburg': '#D3080C',
  'Kaizer Chiefs': '#FDB913', 'Orlando Pirates': '#000000', 'Mamelodi Sundowns': '#FFD700',
  'SuperSport United': '#004B93', 'Cape Town City': '#00BFFF', 'Stellenbosch': '#8B0000',
  'AmaZulu': '#228B22', 'Sekhukhune United': '#800020', 'Golden Arrows': '#FFD700', 'Richards Bay': '#005B5C',
};

const getTeamColor = (team) => TEAM_COLORS[team] || '#4B5563';
const getTeamInitials = (team) => {
  const words = team.split(' ');
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
};

const mockMatches = [
  // Premier League
  { id: 1,  league: 'PL', home: 'Arsenal',          away: 'Chelsea',          homeScore: 2, awayScore: 1, status: 'IN_PLAY', minute: 67, date: '15 Mar 2026', featured: true },
  { id: 2,  league: 'PL', home: 'Manchester City',   away: 'Liverpool',        homeScore: 1, awayScore: 1, status: 'IN_PLAY', minute: 34, date: '15 Mar 2026', featured: true },
  { id: 3,  league: 'PL', home: 'Tottenham',         away: 'Manchester United',homeScore: 3, awayScore: 2, status: 'FINISHED', date: '15 Mar 2026', featured: true },
  { id: 4,  league: 'PL', home: 'Newcastle',         away: 'Aston Villa',      homeScore: 1, awayScore: 0, status: 'FINISHED', date: '15 Mar 2026' },
  { id: 5,  league: 'PL', home: 'Brighton',          away: 'West Ham',         homeScore: null, awayScore: null, status: 'TIMED', kickoff: '17:30', date: '15 Mar 2026' },
  { id: 6,  league: 'PL', home: 'Everton',           away: 'Wolves',           homeScore: null, awayScore: null, status: 'TIMED', kickoff: '20:00', date: '15 Mar 2026' },
  { id: 30, league: 'PL', home: 'Crystal Palace',    away: 'Fulham',           homeScore: 0, awayScore: 0, status: 'IN_PLAY', minute: 12, date: '15 Mar 2026' },
  // La Liga
  { id: 7,  league: 'LL', home: 'Barcelona',         away: 'Atletico Madrid',  homeScore: 3, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026', featured: true },
  { id: 8,  league: 'LL', home: 'Real Madrid',       away: 'Sevilla',          homeScore: 2, awayScore: 0, status: 'IN_PLAY', minute: 78, date: '15 Mar 2026', featured: true },
  { id: 9,  league: 'LL', home: 'Real Sociedad',     away: 'Villarreal',       homeScore: 1, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026' },
  { id: 10, league: 'LL', home: 'Real Betis',        away: 'Athletic Bilbao',  homeScore: null, awayScore: null, status: 'TIMED', kickoff: '21:00', date: '15 Mar 2026' },
  // Serie A
  { id: 11, league: 'SA', home: 'Inter Milan',       away: 'AC Milan',         homeScore: 2, awayScore: 2, status: 'IN_PLAY', minute: 88, date: '15 Mar 2026' },
  { id: 12, league: 'SA', home: 'Juventus',          away: 'Napoli',           homeScore: 1, awayScore: 0, status: 'FINISHED', date: '15 Mar 2026' },
  { id: 13, league: 'SA', home: 'Roma',              away: 'Atalanta',         homeScore: null, awayScore: null, status: 'TIMED', kickoff: '18:00', date: '15 Mar 2026' },
  { id: 14, league: 'SA', home: 'Lazio',             away: 'Fiorentina',       homeScore: 3, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026' },
  // Bundesliga
  { id: 15, league: 'BL', home: 'Bayern Munich',     away: 'Borussia Dortmund',homeScore: 4, awayScore: 2, status: 'FINISHED', date: '15 Mar 2026' },
  { id: 16, league: 'BL', home: 'RB Leipzig',        away: 'Bayer Leverkusen', homeScore: 1, awayScore: 1, status: 'IN_PLAY', minute: 55, date: '15 Mar 2026' },
  { id: 17, league: 'BL', home: 'Eintracht Frankfurt', away: 'Wolfsburg',     homeScore: null, awayScore: null, status: 'TIMED', kickoff: '17:30', date: '15 Mar 2026' },
  { id: 18, league: 'BL', home: 'Stuttgart',         away: 'Freiburg',         homeScore: 2, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026' },
  // PSL (South African Premier Soccer League)
  { id: 19, league: 'PSL', home: 'Kaizer Chiefs',    away: 'Orlando Pirates',  homeScore: 1, awayScore: 2, status: 'FINISHED', date: '15 Mar 2026' },
  { id: 20, league: 'PSL', home: 'Mamelodi Sundowns',away: 'SuperSport United',homeScore: 3, awayScore: 0, status: 'FINISHED', date: '15 Mar 2026' },
  { id: 21, league: 'PSL', home: 'Cape Town City',   away: 'Stellenbosch',     homeScore: null, awayScore: null, status: 'TIMED', kickoff: '19:30', date: '15 Mar 2026' },
  { id: 22, league: 'PSL', home: 'AmaZulu',          away: 'Sekhukhune United',homeScore: 0, awayScore: 0, status: 'IN_PLAY', minute: 22, date: '15 Mar 2026' },
  { id: 23, league: 'PSL', home: 'Golden Arrows',    away: 'Richards Bay',     homeScore: 1, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026' },
  // Champions League
  { id: 24, league: 'UCL', home: 'Real Madrid',      away: 'Manchester City',  homeScore: 2, awayScore: 1, status: 'FINISHED', date: '14 Mar 2026' },
  { id: 25, league: 'UCL', home: 'Barcelona',        away: 'Bayern Munich',    homeScore: 3, awayScore: 3, status: 'FINISHED', date: '14 Mar 2026' },
  { id: 26, league: 'UCL', home: 'Arsenal',          away: 'Inter Milan',      homeScore: null, awayScore: null, status: 'TIMED', kickoff: '21:00', date: '16 Mar 2026' },
  { id: 27, league: 'UCL', home: 'Liverpool',        away: 'Juventus',         homeScore: null, awayScore: null, status: 'TIMED', kickoff: '21:00', date: '16 Mar 2026' },
  // Local 5s Arena World Cup (Mock Data)
  { id: 101, league: 'WC', home: 'Algeria',          away: 'Belgium',          homeScore: 3, awayScore: 2, status: 'FINISHED', date: '15 Mar 2026', featured: true },
  { id: 102, league: 'WC', home: 'Cameroon',         away: 'Colombia',         homeScore: 1, awayScore: 1, status: 'IN_PLAY', minute: 15, date: '15 Mar 2026', featured: true },
];

const mockNews = [
  { id: 1,  title: 'Arsenal Close Gap on Man City After Dominant Derby Win',               source: 'Sky Sports',     timeAgo: '2 hours ago', category: 'Match Report', gradient: 'from-red-900 to-red-700',        leagues: ['PL'],        url: 'https://www.skysports.com/football' },
  { id: 2,  title: 'Barcelona Secure El Clasico Bragging Rights with 3-1 Triumph',          source: 'ESPN FC',        timeAgo: '3 hours ago', category: 'Match Report', gradient: 'from-blue-900 to-red-800',       leagues: ['LL'],        url: 'https://www.espn.com/soccer/' },
  { id: 3,  title: 'BREAKING: Kylian Mbappe Agrees Personal Terms with Man City',           source: 'Fabrizio Romano',timeAgo: '45 min ago',  category: 'Breaking',     gradient: 'from-sky-900 to-sky-700',        leagues: ['PL'],        url: 'https://x.com/FabrizioRomano' },
  { id: 4,  title: 'Liverpool Manager Addresses Champions League Knockout Strategy',        source: 'The Athletic',   timeAgo: '5 hours ago', category: 'Interview',    gradient: 'from-red-800 to-red-600',        leagues: ['PL', 'UCL'], url: 'https://theathletic.com/football/' },
  { id: 5,  title: 'La Liga Title Race: Three Teams Separated by Two Points',               source: 'Marca',          timeAgo: '6 hours ago', category: 'Analysis',     gradient: 'from-orange-900 to-yellow-800',  leagues: ['LL'],        url: 'https://www.marca.com/en/football/la-liga.html' },
  { id: 6,  title: 'VAR Controversy Overshadows Soweto Derby as Pirates Edge Chiefs',        source: 'SuperSport',     timeAgo: '1 hour ago',  category: 'Match Report', gradient: 'from-yellow-900 to-gray-800',    leagues: ['PSL'],       url: 'https://supersport.com/football/psl' },
  { id: 7,  title: 'Sundowns Set New PSL Record with 15th Consecutive Win',                 source: 'KickOff',        timeAgo: '4 hours ago', category: 'Match Report', gradient: 'from-yellow-800 to-green-900',   leagues: ['PSL'],       url: 'https://www.kickoff.com/psl/' },
  { id: 8,  title: 'EXCLUSIVE: Chelsea Table R1.2 Billion Bid for Serie A Star',            source: 'Sky Sports',     timeAgo: '30 min ago',  category: 'Transfer',     gradient: 'from-blue-800 to-blue-600',      leagues: ['PL', 'SA'],  url: 'https://www.skysports.com/transfer-centre' },
  { id: 9,  title: 'Tactical Analysis: How Arteta Outclassed Pochettino',                   source: 'The Guardian',   timeAgo: '7 hours ago', category: 'Analysis',     gradient: 'from-gray-800 to-gray-600',      leagues: ['PL'],        url: 'https://www.theguardian.com/football' },
  { id: 10, title: 'Bayern Munich Complete Signing of English Wonderkid for R850M',         source: 'BILD',           timeAgo: '2 hours ago', category: 'Transfer',     gradient: 'from-red-900 to-red-700',        leagues: ['BL'],        url: 'https://www.bild.de/sport/fussball/' },
  { id: 11, title: 'Real Madrid Injury Update: Vinicius Jr Faces Three Weeks Out',          source: 'AS',             timeAgo: '8 hours ago', category: 'Breaking',     gradient: 'from-yellow-900 to-gray-900',    leagues: ['LL', 'UCL'], url: 'https://en.as.com/soccer/' },
  { id: 12, title: 'Premier League Top Scorers: Updated Golden Boot Race After Matchday 30',source: 'BBC Sport',      timeAgo: '1 hour ago',  category: 'Analysis',     gradient: 'from-purple-900 to-indigo-800',  leagues: ['PL'],        url: 'https://www.bbc.com/sport/football/premier-league' },
];

const CATEGORY_COLORS = {
  'Transfer':     'bg-blue-600/20 text-blue-400 border-blue-700/50',
  'Match Report': 'bg-green-600/20 text-green-400 border-green-700/50',
  'Analysis':     'bg-purple-600/20 text-purple-400 border-purple-700/50',
  'Breaking':     'bg-red-600/20 text-red-400 border-red-700/50',
  'Interview':    'bg-yellow-600/20 text-yellow-400 border-yellow-700/50',
};

// Category visual config for news card headers (no broken external images)
const CATEGORY_VISUAL = {
  'Transfer':     { emoji: '💰', icon: '↔',  pattern: 'radial-gradient(circle at 30% 70%, rgba(59,130,246,0.25) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.2) 0%, transparent 50%)' },
  'Match Report': { emoji: '⚽', icon: '📋', pattern: 'radial-gradient(circle at 20% 80%, rgba(22,163,74,0.25) 0%, transparent 60%), radial-gradient(circle at 75% 25%, rgba(16,185,129,0.15) 0%, transparent 50%)' },
  'Analysis':     { emoji: '📊', icon: '🔍', pattern: 'radial-gradient(circle at 60% 60%, rgba(139,92,246,0.25) 0%, transparent 60%), radial-gradient(circle at 20% 30%, rgba(167,139,250,0.15) 0%, transparent 50%)' },
  'Breaking':     { emoji: '🚨', icon: '⚡', pattern: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(220,38,38,0.2) 0%, transparent 50%)' },
  'Interview':    { emoji: '🎙️', icon: '💬', pattern: 'radial-gradient(circle at 40% 40%, rgba(234,179,8,0.25) 0%, transparent 60%), radial-gradient(circle at 70% 75%, rgba(250,204,21,0.15) 0%, transparent 50%)' },
};

// 50 YouTube channels with relevance scoring
const TOP_15_TEAMS = ['Manchester City','Real Madrid','Barcelona','Liverpool','Arsenal','Bayern Munich','PSG','Inter Milan','Manchester United','Chelsea','Juventus','Borussia Dortmund','AC Milan','Atletico Madrid','Tottenham'];

const highlightChannels = [
  { id: 1,  name: 'Sky Sports Football',       subs: '8.2M',  category: 'Broadcast',  teams: ['Arsenal','Chelsea','Liverpool','Manchester City','Manchester United','Tottenham'] },
  { id: 2,  name: 'ESPN FC',                   subs: '6.1M',  category: 'Broadcast',  teams: ['Barcelona','Real Madrid','Liverpool','Arsenal','Manchester City','Chelsea'] },
  { id: 3,  name: 'beIN SPORTS',               subs: '11.4M', category: 'Broadcast',  teams: ['Barcelona','Real Madrid','PSG','Bayern Munich','Juventus'] },
  { id: 4,  name: 'SuperSport',                subs: '1.8M',  category: 'Broadcast',  teams: ['Manchester City','Liverpool','Arsenal','Chelsea','Manchester United'] },
  { id: 5,  name: 'DAZN',                      subs: '4.5M',  category: 'Broadcast',  teams: ['Inter Milan','AC Milan','Juventus','Bayern Munich','Borussia Dortmund'] },
  { id: 6,  name: 'BT Sport',                  subs: '5.7M',  category: 'Broadcast',  teams: ['Liverpool','Arsenal','Manchester City','Chelsea','Tottenham','Manchester United'] },
  { id: 7,  name: 'CBS Sports Golazo',         subs: '3.2M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Inter Milan','AC Milan','Napoli','Atletico Madrid'] },
  { id: 8,  name: 'Rio Ferdinand Presents',    subs: '4.8M',  category: 'Pundit',     teams: ['Manchester United','Real Madrid','Barcelona','Arsenal','Liverpool'] },
  { id: 9,  name: 'Gary Neville',              subs: '2.1M',  category: 'Pundit',     teams: ['Manchester United','Liverpool','Arsenal','Manchester City','Tottenham'] },
  { id: 10, name: 'Peter Crouch',              subs: '1.4M',  category: 'Pundit',     teams: ['Liverpool','Tottenham','Chelsea','Arsenal','Manchester City'] },
  { id: 11, name: 'Thierry Henry',             subs: '3.6M',  category: 'Pundit',     teams: ['Arsenal','Barcelona','Manchester City','Real Madrid','PSG'] },
  { id: 12, name: 'Jamie Carragher',           subs: '1.9M',  category: 'Pundit',     teams: ['Liverpool','Manchester City','Arsenal','Chelsea','Tottenham'] },
  { id: 13, name: 'Monday Night Football',     subs: '2.8M',  category: 'Analysis',   teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Manchester United','Tottenham'] },
  { id: 14, name: 'Match of the Day',          subs: '7.3M',  category: 'Broadcast',  teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Manchester United','Tottenham'] },
  { id: 15, name: 'The Overlap',               subs: '2.4M',  category: 'Pundit',     teams: ['Manchester United','Arsenal','Liverpool','Manchester City'] },
  { id: 16, name: 'AFTV',                      subs: '1.7M',  category: 'Reactor',    teams: ['Arsenal'] },
  { id: 17, name: 'The United Stand',          subs: '1.5M',  category: 'Reactor',    teams: ['Manchester United'] },
  { id: 18, name: 'Tifo Football',             subs: '2.9M',  category: 'Analysis',   teams: ['Manchester City','Barcelona','Liverpool','Bayern Munich','Real Madrid','Inter Milan'] },
  { id: 19, name: 'Football Daily',            subs: '1.3M',  category: 'Reactor',    teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Real Madrid','Barcelona'] },
  { id: 20, name: 'Copa90',                    subs: '2.2M',  category: 'Reactor',    teams: ['Barcelona','Real Madrid','Manchester City','Liverpool','Borussia Dortmund'] },
  { id: 21, name: 'Footballers React',         subs: '890K',  category: 'Reactor',    teams: ['Arsenal','Chelsea','Manchester United','Tottenham'] },
  { id: 22, name: 'Marca TV',                  subs: '3.1M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Atletico Madrid'] },
  { id: 23, name: 'Gazzetta dello Sport',      subs: '1.6M',  category: 'Broadcast',  teams: ['Inter Milan','AC Milan','Juventus'] },
  { id: 24, name: 'Sport1 Bundesliga',         subs: '2.0M',  category: 'Broadcast',  teams: ['Bayern Munich','Borussia Dortmund'] },
  { id: 25, name: 'Statman Dave',              subs: '1.1M',  category: 'Analysis',   teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Barcelona','Real Madrid'] },
  { id: 26, name: 'Tactics Board',             subs: '780K',  category: 'Analysis',   teams: ['Manchester City','Liverpool','Barcelona','Bayern Munich','Inter Milan'] },
  { id: 27, name: 'Rabona TV',                 subs: '650K',  category: 'Reactor',    teams: ['Chelsea','Arsenal','Liverpool'] },
  { id: 28, name: 'The Kick Off',              subs: '940K',  category: 'Reactor',    teams: ['Manchester United','Arsenal','Liverpool','Chelsea','Manchester City','Tottenham'] },
  { id: 29, name: 'Barca TV+',                 subs: '5.2M',  category: 'Broadcast',  teams: ['Barcelona'] },
  { id: 30, name: 'Real Madrid TV',            subs: '4.9M',  category: 'Broadcast',  teams: ['Real Madrid'] },
  { id: 31, name: 'SPORF',                     subs: '3.4M',  category: 'Reactor',    teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Manchester United','Real Madrid','Barcelona'] },
  { id: 32, name: 'Premier League',            subs: '12.1M', category: 'Broadcast',  teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Manchester United','Tottenham'] },
  { id: 33, name: 'UEFA Champions League',     subs: '9.8M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Bayern Munich','Manchester City','Liverpool','Inter Milan','PSG'] },
  { id: 34, name: 'LaLiga',                    subs: '8.7M',  category: 'Broadcast',  teams: ['Barcelona','Real Madrid','Atletico Madrid'] },
  { id: 35, name: 'Bundesliga',                subs: '6.3M',  category: 'Broadcast',  teams: ['Bayern Munich','Borussia Dortmund'] },
  { id: 36, name: 'Serie A',                   subs: '5.8M',  category: 'Broadcast',  teams: ['Inter Milan','AC Milan','Juventus'] },
  { id: 37, name: 'Micah Richards',            subs: '1.2M',  category: 'Pundit',     teams: ['Manchester City','Arsenal','Liverpool'] },
  { id: 38, name: 'Carragher & Neville Pod',   subs: '980K',  category: 'Pundit',     teams: ['Liverpool','Manchester United','Arsenal','Manchester City'] },
  { id: 39, name: 'That Football Show SA',     subs: '320K',  category: 'Analysis',   teams: ['Manchester City','Liverpool','Arsenal','Chelsea'] },
  { id: 40, name: 'OneFootball',               subs: '2.6M',  category: 'Broadcast',  teams: ['Bayern Munich','Borussia Dortmund','Real Madrid','Barcelona','Manchester City'] },
  { id: 41, name: 'Goal',                      subs: '4.1M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Manchester City','Liverpool','Arsenal','PSG','Bayern Munich'] },
  { id: 42, name: 'Football Terrace',          subs: '870K',  category: 'Reactor',    teams: ['Manchester United','Liverpool','Arsenal'] },
  { id: 43, name: 'Expressions Oozing',        subs: '520K',  category: 'Reactor',    teams: ['Arsenal'] },
  { id: 44, name: 'Mark Goldbridge',           subs: '1.8M',  category: 'Reactor',    teams: ['Manchester United'] },
  { id: 45, name: 'B/R Football',              subs: '7.4M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Liverpool','Manchester City','PSG','Bayern Munich'] },
  { id: 46, name: 'Planet FPL',                subs: '410K',  category: 'Analysis',   teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Tottenham','Manchester United'] },
  { id: 47, name: 'The Byline',                subs: '290K',  category: 'Analysis',   teams: ['Barcelona','Real Madrid','Atletico Madrid','Inter Milan'] },
  { id: 48, name: 'iDiski TV',                 subs: '580K',  category: 'Broadcast',  teams: ['Manchester City','Chelsea','Liverpool'] },
  { id: 49, name: 'FC Motivated',              subs: '1.0M',  category: 'Reactor',    teams: ['Chelsea','Arsenal','Manchester United'] },
  { id: 50, name: 'Footy Prime Asia',          subs: '730K',  category: 'Broadcast',  teams: ['Manchester City','Liverpool','Arsenal','Chelsea','Manchester United','Real Madrid','Barcelona'] },
];

// Calculate relevance score for each channel
const channelsWithRelevance = highlightChannels.map(ch => {
  const matchCount = ch.teams.filter(t => TOP_15_TEAMS.includes(t)).length;
  const relevance = Math.min(100, Math.round((matchCount / TOP_15_TEAMS.length) * 100 * 2.5));
  return { ...ch, relevance };
}).sort((a, b) => b.relevance - a.relevance);

// ═══════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════

// Team logo mapping — uses public football crest images where available
const TEAM_LOGOS = {
  'Arsenal': 'https://crests.football-data.org/57.png',
  'Chelsea': 'https://crests.football-data.org/61.png',
  'Manchester City': 'https://crests.football-data.org/65.png',
  'Liverpool': 'https://crests.football-data.org/64.png',
  'Tottenham': 'https://crests.football-data.org/73.png',
  'Manchester United': 'https://crests.football-data.org/66.png',
  'Newcastle': 'https://crests.football-data.org/67.png',
  'Aston Villa': 'https://crests.football-data.org/58.png',
  'Brighton': 'https://crests.football-data.org/397.png',
  'West Ham': 'https://crests.football-data.org/563.png',
  'Everton': 'https://crests.football-data.org/62.png',
  'Wolves': 'https://crests.football-data.org/76.png',
  'Crystal Palace': 'https://crests.football-data.org/354.png',
  'Fulham': 'https://crests.football-data.org/63.png',
  'Bournemouth': 'https://crests.football-data.org/1044.png',
  'Nottingham Forest': 'https://crests.football-data.org/351.png',
  'Barcelona': 'https://crests.football-data.org/81.png',
  'Real Madrid': 'https://crests.football-data.org/86.png',
  'Atletico Madrid': 'https://crests.football-data.org/78.png',
  'Sevilla': 'https://crests.football-data.org/559.png',
  'Real Sociedad': 'https://crests.football-data.org/92.png',
  'Villarreal': 'https://crests.football-data.org/94.png',
  'Real Betis': 'https://crests.football-data.org/90.png',
  'Athletic Bilbao': 'https://crests.football-data.org/77.png',
  'Inter Milan': 'https://crests.football-data.org/108.png',
  'AC Milan': 'https://crests.football-data.org/98.png',
  'Juventus': 'https://crests.football-data.org/109.png',
  'Napoli': 'https://crests.football-data.org/113.png',
  'Roma': 'https://crests.football-data.org/100.png',
  'Atalanta': 'https://crests.football-data.org/102.png',
  'Lazio': 'https://crests.football-data.org/110.png',
  'Fiorentina': 'https://crests.football-data.org/99.png',
  'Bayern Munich': 'https://crests.football-data.org/5.png',
  'Borussia Dortmund': 'https://crests.football-data.org/4.png',
  'RB Leipzig': 'https://crests.football-data.org/721.png',
  'Bayer Leverkusen': 'https://crests.football-data.org/3.png',
  'Eintracht Frankfurt': 'https://crests.football-data.org/19.png',
  'Wolfsburg': 'https://crests.football-data.org/11.png',
  'Stuttgart': 'https://crests.football-data.org/10.png',
  'Freiburg': 'https://crests.football-data.org/17.png',
  // PSL (South African Premier Soccer League)
  'Kaizer Chiefs': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Kaizer_Chiefs_logo.svg/200px-Kaizer_Chiefs_logo.svg.png',
  'Orlando Pirates': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/11/Orlando_Pirates_logo.svg/200px-Orlando_Pirates_logo.svg.png',
  'Mamelodi Sundowns': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Mamelodi_Sundowns_logo.svg/200px-Mamelodi_Sundowns_logo.svg.png',
  'SuperSport United': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/SuperSport_United_FC_logo.svg/200px-SuperSport_United_FC_logo.svg.png',
  'Cape Town City': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7d/Cape_Town_City_FC_logo.svg/200px-Cape_Town_City_FC_logo.svg.png',
  'Stellenbosch': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d0/Stellenbosch_FC_logo.svg/200px-Stellenbosch_FC_logo.svg.png',
  'AmaZulu': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/AmaZulu_F.C._logo.svg/200px-AmaZulu_F.C._logo.svg.png',
  'Sekhukhune United': 'https://upload.wikimedia.org/wikipedia/en/3/3b/Sekhukhune_United_F.C._logo.png',
  'Golden Arrows': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Lamontville_Golden_Arrows_logo.svg/200px-Lamontville_Golden_Arrows_logo.svg.png',
  'Richards Bay': 'https://upload.wikimedia.org/wikipedia/en/7/72/Richards_Bay_FC_logo.png',
};

const TeamBadge = ({ team, size = 'md', liveLogoUrl = null }) => {
  const [imgError, setImgError] = useState(false);
  const color = getTeamColor(team);
  const initials = getTeamInitials(team);
  // Prefer: live logo from TheSportsDB → our static logo map → colour initial
  const logo = liveLogoUrl || TEAM_LOGOS[team];
  const dims = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-12 h-12';
  const textSize = size === 'lg' ? 'text-sm' : size === 'sm' ? 'text-[9px]' : 'text-xs';

  if (logo && !imgError) {
    return (
      <div className={`${dims} rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 border border-white/20 shadow-md overflow-hidden p-1`}>
        <img
          src={logo}
          alt={team}
          className="w-full h-full object-contain"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${dims} ${textSize} rounded-full flex items-center justify-center font-black text-white flex-shrink-0 border border-white/20 shadow-lg relative overflow-hidden`}
      style={{ backgroundColor: color }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      <span className="relative z-10 drop-shadow-md">{initials}</span>
    </div>
  );
};

const LeagueBadge = ({ code }) => {
  const meta = LEAGUE_META[code];
  return (
    <div className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center flex-shrink-0 border border-white/10`}>
      <FaTrophy size={12} className="text-white/80" />
    </div>
  );
};

const StatusBadge = ({ match }) => {
  if (match.status === 'IN_PLAY') {
    return (
      <motion.div
        className="flex items-center gap-1.5"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
        <span className="text-[10px] font-black text-red-400 uppercase tracking-wider">
          LIVE {match.minute}&apos;
        </span>
      </motion.div>
    );
  }
  if (match.status === 'FINISHED') {
    return (
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-800 px-2.5 py-0.5 rounded">
        FT
      </span>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <FaClock size={9} className="text-gray-500" />
      <span className="text-[10px] font-bold text-gray-400 tracking-wider">{match.kickoff}</span>
    </div>
  );
};

const MatchCard = ({ match, i, expanded, onToggle }) => {
  // Mock match events for inline detail view
  const mockEvents = match.status !== 'TIMED' ? [
    { min: 12, type: 'goal', team: 'home', player: 'Player A', detail: 'Right foot shot' },
    { min: 34, type: 'yellow', team: 'away', player: 'Player B', detail: 'Tactical foul' },
    { min: 56, type: 'goal', team: 'away', player: 'Player C', detail: 'Header from corner' },
    { min: 78, type: 'sub', team: 'home', player: 'Player D on for Player E', detail: '' },
  ] : [];

  return (
    <motion.div
      custom={i}
      variants={cardVariants}
      className={`bg-gray-900 border rounded-2xl shadow-lg transition-colors overflow-hidden ${
        match.status === 'IN_PLAY'
          ? 'border-red-800/50 bg-gray-900/80 shadow-red-900/20'
          : expanded ? 'border-green-800/50' : 'border-gray-800 hover:border-gray-700'
      }`}
    >
      {/* Main match row — clickable */}
      <div
        className="p-4 md:p-5 cursor-pointer"
        onClick={() => onToggle?.(match.id)}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <LeagueBadge code={match.league} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 flex items-center justify-end gap-2">
                <p className="text-sm md:text-base font-bold text-white truncate text-right">{match.home}</p>
                <TeamBadge team={match.home} size="sm" liveLogoUrl={match.homeLogo || null} />
              </div>
              <div className="flex-shrink-0 mx-2 md:mx-4">
                {match.status === 'TIMED' ? (
                  <motion.span className="text-sm font-bold text-gray-500" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>vs</motion.span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl md:text-2xl font-black text-green-400 tabular-nums">{match.homeScore}</span>
                    <span className="text-lg text-gray-600 font-bold">-</span>
                    <span className="text-xl md:text-2xl font-black text-green-400 tabular-nums">{match.awayScore}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex items-center gap-2">
                <TeamBadge team={match.away} size="sm" liveLogoUrl={match.awayLogo || null} />
                <p className="text-sm md:text-base font-bold text-white truncate">{match.away}</p>
              </div>
            </div>
            <div className="text-center mt-1.5 flex items-center justify-center gap-3">
              <StatusBadge match={match} />
              {match.date && <span className="text-[9px] text-gray-600 uppercase tracking-wider hidden md:inline">{match.date}</span>}
              <span className="text-[9px] text-gray-600 hidden md:inline">Click for details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline expanded match detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-800 px-5 py-4 space-y-4">
              {/* Match timeline */}
              <div>
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Match Events</h4>
                <div className="space-y-2">
                  {mockEvents.map((ev, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span className="text-green-400 font-bold w-8">{ev.min}'</span>
                      <span className={`w-5 text-center ${
                        ev.type === 'goal' ? 'text-green-400' :
                        ev.type === 'yellow' ? 'text-yellow-400' :
                        ev.type === 'red' ? 'text-red-400' : 'text-blue-400'
                      }`}>
                        {ev.type === 'goal' ? '\u26BD' : ev.type === 'yellow' ? '\uD83D\uDFE8' : ev.type === 'red' ? '\uD83D\uDFE5' : '\uD83D\uDD04'}
                      </span>
                      <span className="text-white font-semibold">{ev.player}</span>
                      {ev.detail && <span className="text-gray-500">— {ev.detail}</span>}
                      <span className={`ml-auto text-[9px] uppercase tracking-wide ${ev.team === 'home' ? 'text-blue-400' : 'text-purple-400'}`}>
                        {ev.team === 'home' ? match.home : match.away}
                      </span>
                    </div>
                  ))}
                  {mockEvents.length === 0 && (
                    <p className="text-gray-600 text-xs">Match has not started yet. Events will appear here during play.</p>
                  )}
                </div>
              </div>

              {/* Referee decisions */}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Referee:</span>
                <span>TBC</span>
                <span className="text-gray-700">|</span>
                <span>VAR decisions: 0</span>
              </div>

              {/* Highlights link */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2 text-xs text-green-400 hover:text-green-300 bg-green-900/20 border border-green-800/40 rounded-lg px-3 py-1.5 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaPlayCircle size={11} /> Watch Highlights
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaExternalLinkAlt size={9} /> Full Match Report
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// JOKE WIDGET — via JokeAPI (free, no auth)
// ═══════════════════════════════════════════════════════════════

const JOKE_API = 'https://v2.jokeapi.dev/joke/Pun,Misc?blacklistFlags=nsfw,racist,sexist,explicit,religious,political&type=twopart';

const JokeWidget = () => {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [fetchCount, setFetchCount] = useState(0);

  const fetchJoke = useCallback(() => {
    setLoading(true);
    setRevealed(false);
    fetch(JOKE_API)
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setJoke(data);
          setFetchCount(c => c + 1);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Fetch on first render
  useEffect(() => { fetchJoke(); }, [fetchJoke]);

  if (!joke && !loading) return null;

  return (
    <motion.div
      className="mt-10 bg-gradient-to-br from-gray-900 via-gray-900 to-green-950/30 border border-gray-800 rounded-2xl p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">😄</span>
          <div>
            <p className="text-green-400 font-black text-xs uppercase tracking-widest leading-none">
              Joke of the Match
            </p>
            <p className="text-[9px] text-gray-700 uppercase tracking-wider">Powered by JokeAPI · family-friendly mode</p>
          </div>
          <motion.button
            onClick={fetchJoke}
            disabled={loading}
            className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-green-400 transition-colors uppercase tracking-wider font-bold disabled:opacity-40 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="New joke"
          >
            <motion.span animate={loading ? { rotate: 360 } : {}} transition={{ duration: 0.8, ease: 'linear' }}>
              <FaSyncAlt size={9} />
            </motion.span>
            New Joke
          </motion.button>
        </div>

        {/* Joke content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="jloading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <div className="h-4 bg-gray-800 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2" />
            </motion.div>
          ) : joke ? (
            <motion.div
              key={`joke-${fetchCount}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.35 }}
            >
              {/* Setup */}
              <p className="text-white font-semibold text-sm leading-relaxed mb-3">
                {joke.setup}
              </p>

              {/* Punchline — reveal on click */}
              <AnimatePresence>
                {!revealed ? (
                  <motion.button
                    key="reveal-btn"
                    onClick={() => setRevealed(true)}
                    className="flex items-center gap-2 text-[10px] text-green-500 hover:text-green-400 border border-green-800/50 hover:border-green-700/70 bg-green-900/20 hover:bg-green-900/30 rounded-lg px-4 py-2 transition-all uppercase tracking-wider font-bold cursor-pointer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaChevronDown size={9} /> Reveal punchline
                  </motion.button>
                ) : (
                  <motion.p
                    key="punchline"
                    className="text-green-400 font-black text-base leading-relaxed"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    🥁 {joke.delivery}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const FixturesPage = () => {
  const [tab, setTab] = useState('scores');
  const [expandedLeagues, setExpandedLeagues] = useState({ PL: true, LL: true, SA: true, BL: true, PSL: true, UCL: true });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState(null);

  const toggleMatchDetail = (matchId) => {
    setExpandedMatch((prev) => (prev === matchId ? null : matchId));
  };

  // News modal state
  const [newsModal, setNewsModal] = useState(null);

  // ── My Leagues / News / Highlights preferences ──
  const [myLeaguesOpen, setMyLeaguesOpen] = useState(false);
  const [myNewsOpen, setMyNewsOpen] = useState(false);
  const [myHighlightsOpen, setMyHighlightsOpen] = useState(false);

  // Selected leagues (all selected by default)
  const [selectedLeagues, setSelectedLeagues] = useState(() => new Set(Object.keys(LEAGUE_META)));
  const toggleSelectedLeague = (code) => {
    setSelectedLeagues(prev => {
      const next = new Set(prev);
      if (next.has(code)) { if (next.size > 1) next.delete(code); } else { next.add(code); }
      return next;
    });
  };

  // Prioritised leagues (pushed to top)
  const [priorityLeagues, setPriorityLeagues] = useState(() => new Set());
  const togglePriorityLeague = (code) => {
    setPriorityLeagues(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  // News league filter
  const [newsLeagueFilter, setNewsLeagueFilter] = useState('ALL');

  // News source filters
  const allNewsSources = [...new Set(mockNews.map(n => n.source))];
  const [selectedNewsSources, setSelectedNewsSources] = useState(() => new Set(allNewsSources));
  const toggleNewsSource = (src) => {
    setSelectedNewsSources(prev => {
      const next = new Set(prev);
      if (next.has(src)) { if (next.size > 1) next.delete(src); } else { next.add(src); }
      return next;
    });
  };
  const [priorityNewsSources, setPriorityNewsSources] = useState(() => new Set());
  const togglePriorityNews = (src) => {
    setPriorityNewsSources(prev => {
      const next = new Set(prev);
      next.has(src) ? next.delete(src) : next.add(src);
      return next;
    });
  };

  // Highlights view mode (carousel vs grid)
  const [highlightsView, setHighlightsView] = useState('grid');

  // Highlights channel category filters
  const allChannelCategories = [...new Set(highlightChannels.map(c => c.category))];
  const [selectedChannelCats, setSelectedChannelCats] = useState(() => new Set(allChannelCategories));
  const toggleChannelCat = (cat) => {
    setSelectedChannelCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size > 1) next.delete(cat); } else { next.add(cat); }
      return next;
    });
  };
  const [priorityChannelCats, setPriorityChannelCats] = useState(() => new Set());
  const togglePriorityChannel = (cat) => {
    setPriorityChannelCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  // ── GeoJS auto-location detection ──────────────────────────
  const [userCity, setUserCity] = useState(null);
  const [geoBannerVisible, setGeoBannerVisible] = useState(false);

  useEffect(() => {
    fetch('https://get.geojs.io/v1/ip/geo.json')
      .then(r => r.json())
      .then(data => {
        if (data.country_code === 'ZA') {
          // Auto-prioritise PSL for South African users
          setUserCity(data.city || data.region || null);
          setPriorityLeagues(prev => new Set([...prev, 'PSL']));
          setGeoBannerVisible(true);
        }
      })
      .catch(() => {}); // Fail silently
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlights carousel state
  const [carouselPage, setCarouselPage] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const carouselRef = useRef(null);
  const channelsPerPage = 5;
  // totalPages computed as filteredTotalPages after filter state

  // ── TheSportsDB real fixture data ──────────────────────────
  const [liveData, setLiveData] = useState(null);   // { PL: [...], PSL: [...], ... }
  const [liveLoading, setLiveLoading] = useState(false);
  const [useLiveData, setUseLiveData] = useState(false);

  const fetchLiveData = useCallback(async (force = false) => {
    if (liveData && !force) return; // Prevent unnecessary fetches if data exists and not forced
    
    // Only show loading spinner on initial fetch or manual refresh
    if (!liveData) setLiveLoading(true);
    
    try {
      const res = await fetch('/api/fixtures');
      if (res.ok) {
        const json = await res.json();
        setLiveData(json.leagues || null);
        
        // Map WC standings if they exist in the hybrid feed
        if (json.wc_standings) {
           const wcTable = json.wc_standings.map((t, i) => ({
             rank: i + 1,
             team: t.name,
             logo: t.logo,
             played: t.stats.mp,
             won: t.stats.w,
             drawn: t.stats.d,
             lost: t.stats.l,
             gf: t.stats.gf,
             ga: t.stats.ga,
             gd: t.stats.gd,
             points: t.stats.pts,
           }));
           setStandingsData(prev => ({ ...prev, WC: wcTable }));
        }

        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch live fixtures:', err);
    }
    setLiveLoading(false);
  }, [liveData]);

  // Silent background refresh every 15 seconds
  useEffect(() => {
    if (!useLiveData) return;
    
    const interval = setInterval(() => {
      fetchLiveData(true); // Forced background fetch
    }, 15000); // 15 seconds as requested
    
    return () => clearInterval(interval);
  }, [useLiveData, fetchLiveData]);

  // Merge real upcoming matches into mock data when live toggle is on
  const buildLiveMatches = useCallback(() => {
    if (!liveData) return {};
    const merged = {};
    const baseLeagueCodes = ['PL', 'LL', 'SA', 'BL', 'PSL', 'UCL', 'WC'];
    baseLeagueCodes.forEach(code => {
      const upcoming = (liveData[code] || []).map((e, idx) => ({
        id:        `live_${code}_${idx}`,
        league:    code,
        home:      e.home,
        away:      e.away,
        homeScore: e.homeScore,
        awayScore: e.awayScore,
        status:    e.status || 'TIMED',
        kickoff:   e.time || 'TBC',
        date:      e.date,
        homeLogo:  e.homeLogo,
        awayLogo:  e.awayLogo,
      }));
      merged[code] = upcoming.length ? upcoming : mockMatches.filter(m => m.league === code);
    });
    return merged;
  }, [liveData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    if (useLiveData) {
      // Force re-fetch live data
      setLiveData(null);
      fetchLiveData().then(() => {
        setLastUpdated(new Date());
        setRefreshing(false);
      });
    } else {
      setTimeout(() => {
        setLastUpdated(new Date());
        setRefreshing(false);
      }, 800);
    }
  }, [useLiveData, fetchLiveData]);

  const handleToggleLiveData = () => {
    if (!useLiveData && !liveData) {
      fetchLiveData();
    }
    setUseLiveData(v => !v);
  };

  const toggleLeague = (code) => {
    setExpandedLeagues(prev => ({ ...prev, [code]: !prev[code] }));
  };

  // Group matches by competition — respect selected & priority
  const baseLeagueOrder = ['WC', 'PL', 'LL', 'SA', 'BL', 'PSL', 'UCL'];
  const leagueOrder = [
    ...baseLeagueOrder.filter(c => priorityLeagues.has(c) && selectedLeagues.has(c)),
    ...baseLeagueOrder.filter(c => !priorityLeagues.has(c) && selectedLeagues.has(c)),
  ];

  const liveMatchesByLeague = useLiveData ? buildLiveMatches() : null;
  const matchesByLeague = baseLeagueOrder.reduce((acc, code) => {
    acc[code] = (liveMatchesByLeague && liveMatchesByLeague[code])
      ? liveMatchesByLeague[code]
      : mockMatches.filter(m => m.league === code);
    return acc;
  }, {});

  // Featured matches (top 5)
  const featuredMatches = mockMatches.filter(m => m.featured).slice(0, 5);

  // ── Standings state ─────────────────────────────────────────
  const [standingsLeague, setStandingsLeague] = useState('WC');
  const [standingsData, setStandingsData] = useState({});
  const [standingsLoading, setStandingsLoading] = useState(false);

  const STANDINGS_LEAGUES = [
    { code: 'WC',  name: 'World Cup 5s',         id: 'local', color: 'text-green-400',  border: 'border-green-600/50',  bg: 'bg-green-900/20' },
    { code: 'PSL', name: 'Premier Soccer League', id: '4806', color: 'text-yellow-400', border: 'border-yellow-600/50', bg: 'bg-yellow-900/20' },
    { code: 'PL',  name: 'Premier League',         id: '4406', color: 'text-purple-400', border: 'border-purple-600/50', bg: 'bg-purple-900/20' },
    { code: 'LL',  name: 'La Liga',                id: '4480', color: 'text-orange-400', border: 'border-orange-600/50', bg: 'bg-orange-900/20' },
    { code: 'SA',  name: 'Serie A',                id: '4332', color: 'text-blue-400',   border: 'border-blue-600/50',   bg: 'bg-blue-900/20' },
    { code: 'BL',  name: 'Bundesliga',             id: '4331', color: 'text-red-400',    border: 'border-red-600/50',    bg: 'bg-red-900/20' },
  ];

  const fetchStandings = useCallback(async (code) => {
    if (standingsData[code] && code !== 'WC') return; // Already cached for international
    
    // Handle Local World Cup standings fetching
    if (code === 'WC') {
      if (!liveData) await fetchLiveData();
      return; // Handled by fetchLiveData callback setting standingsData['WC']
    }

    const league = STANDINGS_LEAGUES.find(l => l.code === code);
    if (!league) return;
    setStandingsLoading(true);
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=${league.id}&s=2024-2025`
      );
      if (res.ok) {
        const json = await res.json();
        const table = (json?.table || []).map(t => ({
          rank:   parseInt(t.intRank) || 0,
          team:   t.strTeam,
          logo:   t.strTeamBadge || null,
          played: parseInt(t.intPlayed) || 0,
          won:    parseInt(t.intWin) || 0,
          drawn:  parseInt(t.intDraw) || 0,
          lost:   parseInt(t.intLoss) || 0,
          gf:     parseInt(t.intGoalsFor) || 0,
          ga:     parseInt(t.intGoalsAgainst) || 0,
          gd:     parseInt(t.intGoalDifference) || 0,
          points: parseInt(t.intPoints) || 0,
          form:   t.strForm || '',
        }));
        setStandingsData(prev => ({ ...prev, [code]: table }));
      }
    } catch {}
    setStandingsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standingsData]);

  const handleStandingsLeague = (code) => {
    setStandingsLeague(code);
    fetchStandings(code);
  };

  // Fetch PSL standings when standings tab is first opened
  useEffect(() => {
    if (tab === 'standings' && !standingsData[standingsLeague]) {
      fetchStandings(standingsLeague);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const tabs = [
    { key: 'scores',     label: 'LIVE FIXTURES', icon: <FaFutbol size={13} /> },
    { key: 'standings',  label: 'STANDINGS',     icon: <FaTrophy size={13} /> },
    { key: 'news',       label: 'NEWS',          icon: <FaNewspaper size={13} /> },
    { key: 'highlights', label: 'HIGHLIGHTS',    icon: <FaPlayCircle size={13} /> },
  ];

  // Filter channels by selected categories and priority
  const filteredChannels = channelsWithRelevance
    .filter(c => selectedChannelCats.has(c.category))
    .sort((a, b) => {
      const aPri = priorityChannelCats.has(a.category) ? 1 : 0;
      const bPri = priorityChannelCats.has(b.category) ? 1 : 0;
      if (aPri !== bPri) return bPri - aPri;
      return b.relevance - a.relevance;
    });
  const filteredTotalPages = Math.ceil(filteredChannels.length / channelsPerPage) || 1;
  const safeCarouselPage = carouselPage >= filteredTotalPages ? 0 : carouselPage;

  // Auto-cycle carousel
  useEffect(() => {
    if (tab !== 'highlights' || carouselPaused) return;
    const interval = setInterval(() => {
      setCarouselPage(p => (p + 1) % (filteredTotalPages || 1));
    }, 30000);
    return () => clearInterval(interval);
  }, [tab, carouselPaused, filteredTotalPages]);
  const currentChannels = filteredChannels.slice(
    safeCarouselPage * channelsPerPage,
    safeCarouselPage * channelsPerPage + channelsPerPage
  );

  // Filter and sort news (by source + league)
  const filteredNews = mockNews
    .filter(n => selectedNewsSources.has(n.source))
    .filter(n => newsLeagueFilter === 'ALL' || (n.leagues && n.leagues.includes(newsLeagueFilter)))
    .sort((a, b) => {
      const aPri = priorityNewsSources.has(a.source) ? 1 : 0;
      const bPri = priorityNewsSources.has(b.source) ? 1 : 0;
      return bPri - aPri;
    });

  const CATEGORY_BADGE = {
    Broadcast: 'bg-red-600/20 text-red-400 border border-red-800/40',
    Pundit:    'bg-blue-600/20 text-blue-400 border border-blue-800/40',
    Reactor:   'bg-yellow-600/20 text-yellow-400 border border-yellow-800/40',
    Analysis:  'bg-purple-600/20 text-purple-400 border border-purple-800/40',
  };

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Hero ────────────────────────────────────────── */}
        <motion.div
          className="text-center mb-10 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-36 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.12), transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative z-10">
            <AnimatedTitle
              text={[{ text: 'Live ', highlight: false }, { text: 'Fixtures', highlight: true }]}
              subtitle="Follow every goal, card and result across the world's biggest leagues — all in one place."
              icon={<FaTrophy />}
              size="xl"
              align="center"
            />

            {/* Compact updated timer + auto-update note stacked */}
            <motion.div
              className="mt-2 flex flex-col items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 bg-green-900/30 border border-green-800/50 rounded-full px-4 py-1.5">
                <FaClock size={9} className="text-green-400" />
                <span className="text-[11px] text-green-300 font-bold uppercase tracking-wider">
                  Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <motion.button
                  onClick={handleRefresh}
                  className="text-green-400 hover:text-green-300 transition-colors p-0.5"
                  animate={refreshing ? { rotate: 360 } : {}}
                  transition={{ duration: 0.8, ease: 'linear' }}
                  title="Refresh fixtures"
                >
                  <FaSyncAlt size={10} />
                </motion.button>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-gray-600 uppercase tracking-wider">
                <FaInfoCircle size={8} className="text-gray-600" />
                Fixtures update automatically during match days
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* TheSportsDB Live Data Toggle */}
        <motion.div
          className="mb-4 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleToggleLiveData}
            disabled={liveLoading}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 cursor-pointer disabled:opacity-50 ${
              useLiveData
                ? 'bg-green-900/40 border-green-600 text-green-300 shadow-[0_0_12px_rgba(34,197,94,0.2)]'
                : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400'
            }`}
          >
            {liveLoading ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                <FaSyncAlt size={8} />
              </motion.span>
            ) : (
              <span className={`w-2 h-2 rounded-full ${useLiveData ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]' : 'bg-gray-600'}`} />
            )}
            {useLiveData ? '🟢 Live Data — TheSportsDB' : 'Enable Live Fixtures'}
          </button>
          {!useLiveData && (
            <span className="text-[9px] text-gray-700 uppercase tracking-wider">
              Preview mode &mdash; click to load real upcoming fixtures
            </span>
          )}
          {useLiveData && liveData && (
            <span className="text-[9px] text-green-700 uppercase tracking-wider">
              Real upcoming fixtures via TheSportsDB
            </span>
          )}
        </motion.div>

        {/* GeoJS Location Detection Banner */}
        <AnimatePresence>
          {geoBannerVisible && (
            <motion.div
              className="mb-6 relative overflow-hidden bg-gradient-to-r from-green-900/40 via-yellow-900/20 to-green-900/40 border border-green-700/50 rounded-2xl px-5 py-3"
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Subtle shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">🇿🇦</span>
                  <div>
                    <p className="text-green-300 font-black text-sm uppercase tracking-wider leading-none mb-0.5">
                      South Africa Detected{userCity ? ` — ${userCity}` : ''}
                    </p>
                    <p className="text-green-500/70 text-[10px] tracking-wide">
                      PSL automatically pinned to the top of your fixtures · powered by GeoJS
                    </p>
                  </div>
                </div>
                <motion.button
                  className="text-green-600 hover:text-green-400 transition-colors flex-shrink-0 p-1"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setGeoBannerVisible(false)}
                  title="Dismiss"
                >
                  <FaTimes size={12} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tabs ────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {tabs.map((t) => (
            <motion.button
              key={t.key}
              onClick={() => setTab(t.key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                tab === t.key
                  ? 'bg-green-900/40 text-green-400 border border-green-700 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              {t.icon} {t.label}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Tab Content ─────────────────────────────────── */}
        <AnimatePresence mode="wait">

          {/* ══ TAB 1: LIVE FIXTURES ═════════════════════════ */}
          {tab === 'scores' && (
            <motion.div
              key="scores"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
            >
              {/* ── My Leagues Dropdown ── */}
              <div className="mb-6 relative">
                <motion.button
                  onClick={() => setMyLeaguesOpen(v => !v)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest bg-gray-900 border border-gray-800 hover:border-green-800 text-gray-400 hover:text-green-400 transition-colors cursor-pointer"
                >
                  <FaHeart size={10} className="text-green-500" />
                  My Competitions
                  {priorityLeagues.size > 0 && (
                    <span className="bg-green-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{priorityLeagues.size}</span>
                  )}
                  <FaChevronDown size={8} className={`transition-transform ${myLeaguesOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {myLeaguesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 bg-gray-900 border border-gray-800 rounded-xl p-3 overflow-hidden"
                    >
                      <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-3">
                        <FaFilter size={7} className="inline mr-1" />
                        Tick to show &middot; Star to prioritise (push to top)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(LEAGUE_META).map(([code, meta]) => (
                          <div
                            key={code}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                              selectedLeagues.has(code)
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-gray-950 border-gray-900 text-gray-600'
                            }`}
                          >
                            <button
                              onClick={() => toggleSelectedLeague(code)}
                              className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                                selectedLeagues.has(code)
                                  ? 'bg-green-600 border-green-500'
                                  : 'bg-gray-800 border-gray-700'
                              }`}
                            >
                              {selectedLeagues.has(code) && <FaCheck size={8} className="text-white" />}
                            </button>
                            <span className={`text-[10px] font-bold uppercase tracking-wider flex-1 ${meta.textColor}`}>
                              {meta.name}
                            </span>
                            <button
                              onClick={() => togglePriorityLeague(code)}
                              className={`transition-colors ${
                                priorityLeagues.has(code) ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'
                              }`}
                              title="Prioritise this league"
                            >
                              <FaStar size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Featured Matches */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FaFire className="text-orange-400" size={14} />
                  <h2
                    className="text-sm font-black text-white uppercase tracking-widest"
                    style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                  >
                    Featured Matches
                  </h2>
                  <FaStar className="text-yellow-500" size={10} />
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {featuredMatches.map((match, i) => (
                    <MatchCard key={`feat-${match.id}`} match={match} i={i} expanded={expandedMatch === match.id} onToggle={toggleMatchDetail} />
                  ))}
                </motion.div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800 my-8" />

              {/* League Sections */}
              {leagueOrder.map((code) => {
                const meta = LEAGUE_META[code];
                const matches = matchesByLeague[code];
                if (!matches.length) return null;
                const isExpanded = expandedLeagues[code];

                return (
                  <motion.div
                    key={code}
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* League Header */}
                    <button
                      onClick={() => toggleLeague(code)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gray-900 border-l-4 ${meta.color} hover:bg-gray-800 transition-colors mb-3 cursor-pointer`}
                    >
                      <LeagueBadge code={code} />
                      <h3
                        className={`text-sm font-black uppercase tracking-widest ${meta.textColor} flex-1 text-left`}
                        style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                      >
                        {meta.name}
                      </h3>
                      {code === 'WC' && <span className="text-[9px] bg-green-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">LIVE FROM ARENA</span>}
                      <span className="text-[10px] text-gray-500 font-bold mr-2">
                        {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                      </span>
                      {isExpanded ? (
                        <FaChevronUp size={10} className="text-gray-500" />
                      ) : (
                        <FaChevronDown size={10} className="text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="space-y-2 pl-2"
                          >
                            {matches.slice(0, 5).map((match, i) => (
                              <MatchCard key={match.id} match={match} i={i} expanded={expandedMatch === match.id} onToggle={toggleMatchDetail} />
                            ))}
                            {matches.length > 5 && (
                              <p className="text-center text-[10px] text-gray-600 py-2 uppercase tracking-widest">
                                + {matches.length - 5} more matches
                              </p>
                            )}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* ── Joke of the Match — JokeAPI ───────────────── */}
              <JokeWidget />

            </motion.div>
          )}

          {/* ══ TAB 2: STANDINGS ════════════════════════════ */}
          {tab === 'standings' && (
            <motion.div
              key="standings"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
            >
              {/* Competition selector */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {STANDINGS_LEAGUES.map(lg => (
                  <motion.button
                    key={lg.code}
                    onClick={() => handleStandingsLeague(lg.code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                      standingsLeague === lg.code
                        ? `${lg.bg} ${lg.color} ${lg.border} shadow-lg`
                        : 'bg-gray-900 text-gray-500 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <FaTrophy size={10} className={standingsLeague === lg.code ? lg.color : 'text-gray-600'} />
                    {lg.name}
                  </motion.button>
                ))}
              </div>

              {/* Attribution */}
              <div className="text-center mb-4">
                <p className="text-[9px] text-gray-700 uppercase tracking-widest">
                  Data via TheSportsDB · Season 2024-2025
                </p>
              </div>

              {/* Table */}
              <AnimatePresence mode="wait">
                {standingsLoading ? (
                  <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-12 bg-gray-900 rounded-xl animate-pulse" />
                    ))}
                  </motion.div>
                ) : standingsData[standingsLeague] ? (
                  <motion.div
                    key={`table-${standingsLeague}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                  >
                    {/* Table header */}
                    <div className="grid grid-cols-[2rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem_3rem] gap-1 px-4 py-2.5 bg-gray-800/50 text-[9px] text-gray-500 uppercase tracking-widest font-bold border-b border-gray-800">
                      <span>#</span>
                      <span>Team</span>
                      <span className="text-center">P</span>
                      <span className="text-center">W</span>
                      <span className="text-center">D</span>
                      <span className="text-center">L</span>
                      <span className="text-center">GF</span>
                      <span className="text-center">GD</span>
                      <span className="text-center font-black text-white">PTS</span>
                    </div>

                    {/* Table rows */}
                    <motion.div
                      variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                      initial="hidden"
                      animate="visible"
                    >
                      {standingsData[standingsLeague].map((row, i) => {
                        const league = STANDINGS_LEAGUES.find(l => l.code === standingsLeague);
                        const isTop4 = i < 4;
                        const isBottom3 = i >= standingsData[standingsLeague].length - 3;
                        return (
                          <motion.div
                            key={row.team}
                            variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } }}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                            className={`grid grid-cols-[2rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem_3rem] gap-1 px-4 py-2.5 border-b border-gray-800/50 last:border-0 items-center cursor-default transition-colors ${
                              isTop4 ? 'border-l-2 border-l-green-600/60' :
                              isBottom3 ? 'border-l-2 border-l-red-600/60' : ''
                            }`}
                          >
                            {/* Rank */}
                            <span className={`text-xs font-black tabular-nums ${
                              isTop4 ? 'text-green-400' : isBottom3 ? 'text-red-400' : 'text-gray-500'
                            }`}>
                              {row.rank}
                            </span>

                            {/* Team */}
                            <div className="flex items-center gap-2 min-w-0">
                              <TeamBadge team={row.team} liveLogoUrl={row.logo} size="sm" />
                              <span className="text-xs text-white font-semibold truncate">{row.team}</span>
                            </div>

                            {/* Stats */}
                            <span className="text-[11px] text-gray-400 text-center tabular-nums">{row.played}</span>
                            <span className="text-[11px] text-green-400 text-center tabular-nums font-bold">{row.won}</span>
                            <span className="text-[11px] text-gray-400 text-center tabular-nums">{row.drawn}</span>
                            <span className="text-[11px] text-red-400 text-center tabular-nums">{row.lost}</span>
                            <span className="text-[11px] text-gray-400 text-center tabular-nums">{row.gf}</span>
                            <span className={`text-[11px] text-center tabular-nums font-semibold ${row.gd > 0 ? 'text-green-400' : row.gd < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                              {row.gd > 0 ? `+${row.gd}` : row.gd}
                            </span>
                            <span className={`text-sm font-black text-center tabular-nums ${league?.color || 'text-white'}`}>
                              {row.points}
                            </span>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Legend */}
                    <div className="px-4 py-3 border-t border-gray-800 flex flex-wrap gap-4 text-[9px] text-gray-600 uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-green-600/60" /> Champions / UCL Qualification</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-600/60" /> Relegation Zone</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <FaTrophy size={32} className="text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Standings unavailable for this league</p>
                    <p className="text-gray-700 text-[10px] mt-1 uppercase tracking-wider">Try selecting a different league above</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ══ TAB 3: NEWS ══════════════════════════════════ */}
          {tab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
            >
              {/* Powered by note */}
              <div className="text-center mb-4">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Powered by live football news feeds &mdash; Full API integration in development
                </p>
              </div>

              {/* ── My News Dropdown ── */}
              <div className="mb-6 relative">
                <motion.button
                  onClick={() => setMyNewsOpen(v => !v)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest bg-gray-900 border border-gray-800 hover:border-green-800 text-gray-400 hover:text-green-400 transition-colors cursor-pointer"
                >
                  <FaHeart size={10} className="text-green-500" />
                  My News Sources
                  {priorityNewsSources.size > 0 && (
                    <span className="bg-green-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{priorityNewsSources.size}</span>
                  )}
                  <FaChevronDown size={8} className={`transition-transform ${myNewsOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {myNewsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 bg-gray-900 border border-gray-800 rounded-xl p-3 overflow-hidden"
                    >
                      <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-3">
                        <FaFilter size={7} className="inline mr-1" />
                        Tick to show &middot; Star to prioritise (push to top)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {allNewsSources.map((src) => (
                          <div
                            key={src}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                              selectedNewsSources.has(src)
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-gray-950 border-gray-900 text-gray-600'
                            }`}
                          >
                            <button
                              onClick={() => toggleNewsSource(src)}
                              className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                                selectedNewsSources.has(src)
                                  ? 'bg-green-600 border-green-500'
                                  : 'bg-gray-800 border-gray-700'
                              }`}
                            >
                              {selectedNewsSources.has(src) && <FaCheck size={8} className="text-white" />}
                            </button>
                            <span className="text-[10px] font-bold tracking-wider flex-1 truncate">
                              {src}
                            </span>
                            <button
                              onClick={() => togglePriorityNews(src)}
                              className={`transition-colors flex-shrink-0 ${
                                priorityNewsSources.has(src) ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'
                              }`}
                              title="Prioritise this source"
                            >
                              <FaStar size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Competition filter chips */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">By Competition:</span>
                {[{ code: 'ALL', name: 'All Leagues' }, ...Object.entries(LEAGUE_META).map(([code, meta]) => ({ code, name: meta.name }))].map(({ code, name }) => (
                  <motion.button
                    key={code}
                    onClick={() => setNewsLeagueFilter(code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                      newsLeagueFilter === code
                        ? 'bg-green-900/40 text-green-400 border border-green-700'
                        : 'bg-gray-900 text-gray-500 border border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {name === 'All Leagues' ? 'All Competitions' : name}
                  </motion.button>
                ))}
              </div>

              {/* Breaking Ticker */}
              <div className="mb-6 bg-gray-900 border-y border-gray-800 py-2 overflow-hidden relative group">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
                <motion.div
                  className="whitespace-nowrap flex items-center gap-12"
                  animate={{ x: [0, -1000] }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                  {mockNews.slice(0, 5).map(n => (
                    <div key={`ticker-${n.id}`} className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">BREAKING:</span>
                      <span className="text-[11px] text-white font-bold">{n.title}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {/* 5s Arena Featured News Item */}
                <motion.div
                   variants={staggerItem}
                   className="relative col-span-full bg-gradient-to-r from-green-900/40 via-gray-900 to-green-900/40 border border-green-500/30 rounded-3xl p-6 overflow-hidden group mb-4"
                >
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(34,197,94,0.3)]">🏆</div>
                      <div className="flex-1 text-center md:text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-green-600 text-white text-[10px] font-black uppercase tracking-tighter mb-2">Platform Exclusive</span>
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-tight mb-2">World Cup 5s Arena: Tournament Registration is Open!</h2>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-xl">Grab your squad and register for the ultimate 5-a-side challenge. Live fixtures, player stats, and massive prizes await the champions.</p>
                      </div>
                      <Link href="/tournament" className="px-8 py-3 rounded-full bg-green-600 hover:bg-green-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 whitespace-nowrap">Register Now</Link>
                   </div>
                   {/* Background Shimmer */}
                   <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%]"
                    animate={{ translateX: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                   />
                </motion.div>

                {filteredNews.map((article, i) => (
                  <motion.a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={staggerItem}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer hover:border-green-500/50 transition-all block relative"
                  >
                    {/* Scanner Effect */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-[2px] bg-green-500/50 z-20 pointer-events-none opacity-0 group-hover:opacity-100"
                      initial={{ top: '0%' }}
                      whileHover={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* News Image/Gradient Area */}
                    <div className="h-48 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-80`} />
                      <div className="absolute inset-0 backdrop-blur-[2px]" style={{ background: CATEGORY_VISUAL[article.category]?.pattern || 'none' }} />
                      
                      {/* Decorative elements */}
                      <div className="absolute -right-6 -bottom-6 text-9xl text-white/5 group-hover:text-white/10 transition-colors duration-500 select-none pointer-events-none rotate-12">
                        {CATEGORY_VISUAL[article.category]?.emoji}
                      </div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <motion.div 
                          className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl mb-2 backdrop-blur-md shadow-2xl"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                        >
                          {article.source.charAt(0)}
                        </motion.div>
                        <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">{article.source}</span>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                         <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[article.category]}`}>
                           {article.category}
                         </span>
                      </div>
                    </div>

                    <div className="p-5 border-t border-gray-800/50">
                      <div className="flex items-center gap-2 mb-3">
                        {article.leagues?.map(l => (
                          <span key={l} className="text-[8px] font-bold text-gray-500 uppercase tracking-widest border border-gray-800 px-1.5 py-0.5 rounded">{LEAGUE_META[l]?.name || l}</span>
                        ))}
                        <span className="text-[8px] text-gray-600 ml-auto font-bold uppercase tracking-widest">{article.timeAgo}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mb-4 leading-relaxed line-clamp-2 group-hover:text-green-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-[10px] font-black text-green-500 group-hover:underline">
                            VIEW ARTICLE <FaExternalLinkAlt size={8} />
                         </div>
                         <div className="w-1 h-1 rounded-full bg-gray-800" />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ══ TAB 4: HIGHLIGHTS ════════════════════════════ */}
          {tab === 'highlights' && (
            <motion.div
              key="highlights"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
            >
              {/* ── Embedded YouTube Players ─────────────────── */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <FaYoutube size={16} className="text-red-500" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                    Watch Now
                  </h3>
                  <span className="text-[9px] text-gray-600 uppercase tracking-wider ml-1">Official channel embeds</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Premier League',        playlistId: 'PLBcMpvmPEMTgG7x9kSXatnpCFSs9mBEcS', thumb: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
                    { name: 'UEFA Champions League', playlistId: 'PLDKVJFAQWzBxe_sn2o2rdVHBjAOz7B6wH', thumb: '⭐' },
                    { name: 'LaLiga',                playlistId: 'PLyEm8dv1C4Bt_hQkoxkBVbE3tJiCFuuWC', thumb: '🇪🇸' },
                    { name: 'Bundesliga',             playlistId: 'PLrPOBVxJYZrGhV4N2aLj_jDBbLjIgHn5X', thumb: '🇩🇪' },
                    { name: 'Serie A',                playlistId: 'PLrPOBVxJYZrEnP7HB_mq_sLGQz3MpX9mL', thumb: '🇮🇹' },
                    { name: 'PSL Goals & Highlights', playlistId: 'PLRw_7nUMLOT82B2bJFHYDl6W3kZeHLUSr', thumb: '🇿🇦' },
                  ].map((ch, i) => (
                    <motion.div
                      key={ch.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-red-800/50 transition-colors"
                    >
                      {/* YouTube iframe */}
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={`https://www.youtube.com/embed/videoseries?list=${ch.playlistId}&autoplay=0&rel=0&modestbranding=1`}
                          title={`${ch.name} Highlights`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          loading="lazy"
                          className="absolute inset-0 w-full h-full border-0"
                        />
                      </div>
                      <div className="p-3 flex items-center gap-2">
                        <span className="text-lg leading-none">{ch.thumb}</span>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-wider leading-none">{ch.name}</p>
                          <p className="text-[9px] text-gray-600 mt-0.5 uppercase tracking-wider">Latest playlist · YouTube</p>
                        </div>
                        <a
                          href={`https://www.youtube.com/playlist?list=${ch.playlistId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-bold uppercase tracking-wider"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaYoutube size={10} /> Open
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Instagram note */}
                <motion.div
                  className="mt-4 bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-3 flex items-start gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-xl mt-0.5">📱</span>
                  <div>
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">Instagram Reels</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                      Instagram prohibits third-party embedding of Reels without Meta Business API approval.
                      Follow football creators directly on Instagram:{' '}
                      {[
                        { handle: '@skysportsfootball', url: 'https://www.instagram.com/skysportsfootball' },
                        { handle: '@espnfc',            url: 'https://www.instagram.com/espnfc' },
                        { handle: '@psl_soccer',        url: 'https://www.instagram.com/psl_soccer' },
                        { handle: '@premierleague',     url: 'https://www.instagram.com/premierleague' },
                      ].map((a, i) => (
                        <span key={a.handle}>
                          <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 font-semibold">{a.handle}</a>
                          {i < 3 ? ' · ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="border-t border-gray-800 mb-6" />

              {/* Channel header + view toggle */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-sm font-black text-white uppercase tracking-widest"
                    style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                  >
                   Live scores, breaking news, video highlights & match analysis —
            all your competitions, all in one place.
                  </h2>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider">
                    {filteredChannels.length} channels &mdash; ranked by global team relevance
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* View toggle */}
                  <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg p-0.5">
                    <button
                      onClick={() => setHighlightsView('grid')}
                      className={`p-1.5 rounded transition-all ${highlightsView === 'grid' ? 'bg-red-900/40 text-red-400' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                      <FaTh size={12} />
                    </button>
                    <button
                      onClick={() => setHighlightsView('carousel')}
                      className={`p-1.5 rounded transition-all ${highlightsView === 'carousel' ? 'bg-red-900/40 text-red-400' : 'text-gray-600 hover:text-gray-400'}`}
                    >
                      <FaList size={12} />
                    </button>
                  </div>
                  {/* Navigation arrows (carousel only) */}
                  {highlightsView === 'carousel' && (
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCarouselPage(p => (p - 1 + filteredTotalPages) % filteredTotalPages)}
                    className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <FaChevronLeft size={12} />
                  </motion.button>
                  <span className="text-[10px] text-gray-500 font-bold tabular-nums min-w-[40px] text-center">
                    {safeCarouselPage + 1}/{filteredTotalPages}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCarouselPage(p => (p + 1) % filteredTotalPages)}
                    className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <FaChevronRight size={12} />
                  </motion.button>
                </div>
                  )}
                </div>
              </div>

              {/* ── My Highlights Dropdown ── */}
              <div className="mb-6 relative">
                <motion.button
                  onClick={() => setMyHighlightsOpen(v => !v)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest bg-gray-900 border border-gray-800 hover:border-red-800 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <FaHeart size={10} className="text-red-500" />
                  My Highlights
                  {priorityChannelCats.size > 0 && (
                    <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{priorityChannelCats.size}</span>
                  )}
                  <FaChevronDown size={8} className={`transition-transform ${myHighlightsOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {myHighlightsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -8, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 bg-gray-900 border border-gray-800 rounded-xl p-3 overflow-hidden"
                    >
                      <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-3">
                        <FaFilter size={7} className="inline mr-1" />
                        Filter by channel type &middot; Star to prioritise
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {allChannelCategories.map((cat) => (
                          <div
                            key={cat}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer ${
                              selectedChannelCats.has(cat)
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-gray-950 border-gray-900 text-gray-600'
                            }`}
                          >
                            <button
                              onClick={() => toggleChannelCat(cat)}
                              className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${
                                selectedChannelCats.has(cat)
                                  ? 'bg-red-600 border-red-500'
                                  : 'bg-gray-800 border-gray-700'
                              }`}
                            >
                              {selectedChannelCats.has(cat) && <FaCheck size={8} className="text-white" />}
                            </button>
                            <span className={`text-[10px] font-bold uppercase tracking-wider flex-1 ${CATEGORY_BADGE[cat]?.split(' ')[1] || ''}`}>
                              {cat}
                            </span>
                            <button
                              onClick={() => togglePriorityChannel(cat)}
                              className={`transition-colors ${
                                priorityChannelCats.has(cat) ? 'text-yellow-400' : 'text-gray-700 hover:text-gray-500'
                              }`}
                              title="Prioritise this category"
                            >
                              <FaStar size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ═══ CAROUSEL VIEW ═══ */}
              {highlightsView === 'carousel' && (
                <>
                  {/* Auto-cycle indicator */}
                  <div className="flex items-center gap-2 mb-4 text-[10px] text-gray-600 uppercase tracking-wider">
                    <div className={`w-2 h-2 rounded-full ${carouselPaused ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    {carouselPaused ? 'Paused' : 'Auto-cycling every 30s'} &mdash; hover to pause
                  </div>

                  {/* Channel Cards */}
                  <div
                    ref={carouselRef}
                    onMouseEnter={() => setCarouselPaused(true)}
                    onMouseLeave={() => setCarouselPaused(false)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={safeCarouselPage}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                      >
                        {currentChannels.map((channel) => (
                          <motion.div
                            key={channel.id}
                            variants={staggerItem}
                            whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg group hover:border-red-800/40 transition-colors"
                          >
                            <div className="h-20 bg-gradient-to-br from-red-900/40 to-gray-900 relative flex items-center justify-center border-b border-red-900/20">
                              <FaYoutube size={28} className="text-red-500 opacity-30 group-hover:opacity-60 transition-opacity" />
                              <div className="absolute top-2 right-2">
                                <div className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                                  channel.relevance >= 80 ? 'bg-green-900/40 text-green-400 border-green-700/50' :
                                  channel.relevance >= 50 ? 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50' :
                                  'bg-gray-800 text-gray-500 border-gray-700'
                                }`}>
                                  {channel.relevance}% match
                                </div>
                              </div>
                              <div className="absolute bottom-2 left-2">
                                <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_BADGE[channel.category]}`}>
                                  {channel.category}
                                </span>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="text-xs font-bold text-white mb-1 leading-snug group-hover:text-red-400 transition-colors truncate">{channel.name}</h3>
                              <p className="text-[10px] text-gray-500 mb-3">{channel.subs} subscribers</p>
                              <div className="mb-3">
                                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                  <motion.div className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400" initial={{ width: 0 }} animate={{ width: `${channel.relevance}%` }} transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }} />
                                </div>
                              </div>
                              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors cursor-pointer">
                                <FaYoutube size={11} /> Watch on YouTube &rarr;
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Dot indicators */}
                  <div className="flex items-center justify-center gap-1.5 mt-6">
                    {Array.from({ length: filteredTotalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCarouselPage(i)}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          i === safeCarouselPage ? 'bg-red-500 w-6' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ═══ 4x4 GRID VIEW ═══ */}
              {highlightsView === 'grid' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Category sections */}
                  {['Broadcast', 'Pundit', 'Reactor', 'Analysis'].filter(cat => selectedChannelCats.has(cat)).map((cat) => {
                    const catChannels = filteredChannels.filter(c => c.category === cat);
                    if (!catChannels.length) return null;
                    return (
                      <div key={cat} className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${CATEGORY_BADGE[cat]}`}>
                            {cat}
                          </span>
                          <span className="text-[10px] text-gray-600">{catChannels.length} channels</span>
                          <div className="flex-1 h-px bg-gray-800" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {catChannels.map((channel, i) => (
                            <motion.div
                              key={channel.id}
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              whileHover={{
                                y: -8,
                                scale: 1.04,
                                boxShadow: '0 20px 40px -12px rgba(239,68,68,0.3)',
                                transition: { duration: 0.25 }
                              }}
                              className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group hover:border-red-600/60 transition-all cursor-pointer"
                            >
                              {/* Video thumbnail area with hover preview */}
                              <div className="aspect-video bg-gradient-to-br from-red-950/60 to-gray-900 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                                {/* Animated background shimmer on hover */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: '100%' }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                {/* Play button — pulses on hover */}
                                <motion.div
                                  className="relative z-10 w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] transition-shadow"
                                  whileHover={{ scale: 1.15 }}
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                  <FaPlayCircle size={24} className="text-white" />
                                </motion.div>
                                {/* Duration tag */}
                                <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                                  {Math.floor(Math.random() * 15) + 5}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                                </div>
                                {/* Channel initials watermark */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-[0.08] transition-opacity">
                                  <span className="text-6xl font-black text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                                    {channel.name.split(' ').map(w => w[0]).join('').substring(0, 2)}
                                  </span>
                                </div>
                                {/* Relevance badge */}
                                <div className="absolute top-1.5 right-1.5">
                                  <div className={`text-[7px] font-black px-1.5 py-0.5 rounded-full border backdrop-blur-sm ${
                                    channel.relevance >= 80 ? 'bg-green-900/60 text-green-400 border-green-700/50' :
                                    channel.relevance >= 50 ? 'bg-yellow-900/60 text-yellow-400 border-yellow-700/50' :
                                    'bg-gray-800/80 text-gray-500 border-gray-700'
                                  }`}>
                                    {channel.relevance}% match
                                  </div>
                                </div>
                              </div>
                              {/* Channel info */}
                              <div className="p-3">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <div className="w-7 h-7 rounded-full bg-red-900/40 border border-red-800/30 flex items-center justify-center flex-shrink-0">
                                    <FaYoutube size={12} className="text-red-500" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h3 className="text-[11px] font-bold text-white leading-tight truncate group-hover:text-red-400 transition-colors">{channel.name}</h3>
                                    <p className="text-[9px] text-gray-500">{channel.subs} subscribers</p>
                                  </div>
                                </div>
                                {/* Relevance bar */}
                                <div className="mt-2">
                                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${channel.relevance}%` }}
                                      transition={{ delay: 0.3 + i * 0.03, duration: 0.6, ease: 'easeOut' }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ NEWS MODAL ═══════════════════════════════════════ */}
      <AnimatePresence>
        {newsModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setNewsModal(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setNewsModal(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <FaTimes size={14} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <FaExternalLinkAlt size={12} className="text-yellow-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">External Link</h3>
              </div>

              <p className="text-sm text-gray-300 mb-2 leading-relaxed">
                You are about to leave <span className="text-green-400 font-bold">5s Arena</span> to visit:
              </p>
              <p className="text-sm text-white font-bold mb-5 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
                {newsModal.source}
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setNewsModal(null)}
                  className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors cursor-pointer"
                >
                  Stay
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    window.open(newsModal.url, '_blank', 'noopener,noreferrer');
                    setNewsModal(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-green-600 hover:bg-green-500 rounded-xl transition-colors cursor-pointer shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                >
                  Continue &rarr;
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FixturesPage;
