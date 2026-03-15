'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy, FaFutbol, FaNewspaper, FaPlayCircle, FaClock,
  FaExternalLinkAlt, FaSyncAlt, FaChevronDown, FaChevronUp,
  FaChevronLeft, FaChevronRight, FaYoutube, FaTimes,
  FaInfoCircle, FaFire, FaStar,
} from 'react-icons/fa';

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
];

const mockNews = [
  { id: 1,  title: 'Arsenal Close Gap on Man City After Dominant Derby Win',              source: 'Sky Sports',     timeAgo: '2 hours ago', category: 'Match Report', gradient: 'from-red-900 to-red-700' },
  { id: 2,  title: 'Barcelona Secure El Clasico Bragging Rights with 3-1 Triumph',         source: 'ESPN FC',        timeAgo: '3 hours ago', category: 'Match Report', gradient: 'from-blue-900 to-red-800' },
  { id: 3,  title: 'BREAKING: Kylian Mbappe Agrees Personal Terms with Man City',          source: 'Fabrizio Romano',timeAgo: '45 min ago',  category: 'Breaking',     gradient: 'from-sky-900 to-sky-700' },
  { id: 4,  title: 'Liverpool Manager Addresses Champions League Knockout Strategy',       source: 'The Athletic',   timeAgo: '5 hours ago', category: 'Interview',    gradient: 'from-red-800 to-red-600' },
  { id: 5,  title: 'La Liga Title Race: Three Teams Separated by Two Points',              source: 'Marca',          timeAgo: '6 hours ago', category: 'Analysis',     gradient: 'from-orange-900 to-yellow-800' },
  { id: 6,  title: 'VAR Controversy Overshadows Soweto Derby as Pirates Edge Chiefs',       source: 'SuperSport',     timeAgo: '1 hour ago',  category: 'Match Report', gradient: 'from-yellow-900 to-gray-800' },
  { id: 7,  title: 'Sundowns Set New PSL Record with 15th Consecutive Win',                source: 'KickOff',        timeAgo: '4 hours ago', category: 'Match Report', gradient: 'from-yellow-800 to-green-900' },
  { id: 8,  title: 'EXCLUSIVE: Chelsea Table R1.2 Billion Bid for Serie A Star',           source: 'Sky Sports',     timeAgo: '30 min ago',  category: 'Transfer',     gradient: 'from-blue-800 to-blue-600' },
  { id: 9,  title: 'Tactical Analysis: How Arteta Outclassed Pochettino',                  source: 'The Guardian',   timeAgo: '7 hours ago', category: 'Analysis',     gradient: 'from-gray-800 to-gray-600' },
  { id: 10, title: 'Bayern Munich Complete Signing of English Wonderkid for R850M',        source: 'BILD',           timeAgo: '2 hours ago', category: 'Transfer',     gradient: 'from-red-900 to-red-700' },
  { id: 11, title: 'Real Madrid Injury Update: Vinicius Jr Faces Three Weeks Out',         source: 'AS',             timeAgo: '8 hours ago', category: 'Breaking',     gradient: 'from-yellow-900 to-white/10' },
  { id: 12, title: 'Premier League Top Scorers: Updated Golden Boot Race After Matchday 30',source: 'BBC Sport',     timeAgo: '1 hour ago',  category: 'Analysis',     gradient: 'from-purple-900 to-indigo-800' },
];

const CATEGORY_COLORS = {
  'Transfer':     'bg-blue-600/20 text-blue-400 border-blue-700/50',
  'Match Report': 'bg-green-600/20 text-green-400 border-green-700/50',
  'Analysis':     'bg-purple-600/20 text-purple-400 border-purple-700/50',
  'Breaking':     'bg-red-600/20 text-red-400 border-red-700/50',
  'Interview':    'bg-yellow-600/20 text-yellow-400 border-yellow-700/50',
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

const TeamBadge = ({ team, size = 'md' }) => {
  const color = getTeamColor(team);
  const initials = getTeamInitials(team);
  const s = size === 'lg' ? 'w-10 h-10 text-xs' : size === 'sm' ? 'w-6 h-6 text-[7px]' : 'w-8 h-8 text-[9px]';
  return (
    <div
      className={`${s} rounded-full flex items-center justify-center font-black text-white flex-shrink-0 border border-white/20 shadow-md`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
};

const LeagueBadge = ({ code }) => {
  const meta = LEAGUE_META[code];
  return (
    <div className={`w-8 h-8 rounded-full ${meta.bg} flex items-center justify-center text-[8px] font-black text-white tracking-tight flex-shrink-0 border border-white/10`}>
      {code}
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

const MatchCard = ({ match, i }) => (
  <motion.div
    custom={i}
    variants={cardVariants}
    whileHover={{ scale: 1.012, transition: { duration: 0.2 } }}
    className={`bg-gray-900 border rounded-2xl p-4 md:p-5 shadow-lg transition-colors ${
      match.status === 'IN_PLAY'
        ? 'border-red-800/50 bg-gray-900/80 shadow-red-900/20'
        : 'border-gray-800 hover:border-gray-700'
    }`}
  >
    <div className="flex items-center gap-3 md:gap-4">
      <LeagueBadge code={match.league} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 flex items-center justify-end gap-2">
            <p className="text-sm md:text-base font-bold text-white truncate text-right">{match.home}</p>
            <TeamBadge team={match.home} size="sm" />
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
            <TeamBadge team={match.away} size="sm" />
            <p className="text-sm md:text-base font-bold text-white truncate">{match.away}</p>
          </div>
        </div>
        <div className="text-center mt-1.5 flex items-center justify-center gap-3">
          <StatusBadge match={match} />
          {match.date && <span className="text-[9px] text-gray-600 uppercase tracking-wider hidden md:inline">{match.date}</span>}
        </div>
      </div>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

const FixturesPage = () => {
  const [tab, setTab] = useState('scores');
  const [expandedLeagues, setExpandedLeagues] = useState({ PL: true, LL: true, SA: true, BL: true, PSL: true, UCL: true });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // News modal state
  const [newsModal, setNewsModal] = useState(null);

  // Highlights carousel state
  const [carouselPage, setCarouselPage] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const carouselRef = useRef(null);
  const channelsPerPage = 5;
  const totalPages = Math.ceil(channelsWithRelevance.length / channelsPerPage);

  // Auto-cycle carousel
  useEffect(() => {
    if (tab !== 'highlights' || carouselPaused) return;
    const interval = setInterval(() => {
      setCarouselPage(p => (p + 1) % totalPages);
    }, 8000);
    return () => clearInterval(interval);
  }, [tab, carouselPaused, totalPages]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 800);
  }, []);

  const toggleLeague = (code) => {
    setExpandedLeagues(prev => ({ ...prev, [code]: !prev[code] }));
  };

  // Group matches by league
  const leagueOrder = ['PL', 'LL', 'SA', 'BL', 'PSL', 'UCL'];
  const matchesByLeague = leagueOrder.reduce((acc, code) => {
    acc[code] = mockMatches.filter(m => m.league === code);
    return acc;
  }, {});

  // Featured matches (top 5)
  const featuredMatches = mockMatches.filter(m => m.featured).slice(0, 5);

  const tabs = [
    { key: 'scores',     label: 'LIVE FIXTURES', icon: <FaFutbol size={13} /> },
    { key: 'news',       label: 'NEWS',          icon: <FaNewspaper size={13} /> },
    { key: 'highlights', label: 'HIGHLIGHTS',    icon: <FaPlayCircle size={13} /> },
  ];

  const currentChannels = channelsWithRelevance.slice(
    carouselPage * channelsPerPage,
    carouselPage * channelsPerPage + channelsPerPage
  );

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
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 border border-green-800/50 mb-5"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaTrophy className="text-2xl text-green-400" />
            </motion.div>
            <h1
              className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Live Fixtures
            </h1>
            <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
              Premier League, La Liga, Serie A, Bundesliga, PSL &amp; Champions League
            </p>

            {/* Last updated + refresh */}
            <motion.div
              className="mt-4 flex items-center justify-center gap-3 text-[10px] text-gray-600 uppercase tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FaClock size={9} />
              <span>Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              <motion.button
                onClick={handleRefresh}
                className="text-green-500 hover:text-green-400 transition-colors p-1"
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 0.8, ease: 'linear' }}
                title="Refresh fixtures"
              >
                <FaSyncAlt size={11} />
              </motion.button>
            </motion.div>

            {/* Info note */}
            <motion.div
              className="mt-3 inline-flex items-center gap-2 text-[10px] text-gray-600 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <FaInfoCircle size={9} className="text-gray-500" />
              Fixtures update automatically during match days
            </motion.div>
          </div>
        </motion.div>

        {/* API banner */}
        <motion.div
          className="mb-6 bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2.5 text-center text-[10px] text-gray-500 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          API integration coming soon &mdash; data shown is for preview purposes
        </motion.div>

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
                    <MatchCard key={`feat-${match.id}`} match={match} i={i} />
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
                            {matches.map((match, i) => (
                              <MatchCard key={match.id} match={match} i={i} />
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ══ TAB 2: NEWS ══════════════════════════════════ */}
          {tab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
            >
              {/* Powered by note */}
              <div className="text-center mb-6">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Powered by live football news feeds &mdash; Full API integration in development
                </p>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {mockNews.map((article, i) => (
                  <motion.div
                    key={article.id}
                    variants={staggerItem}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:border-gray-700 transition-colors"
                  >
                    {/* Gradient thumbnail */}
                    <div className={`h-36 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[article.category] || 'bg-gray-700 text-gray-300'}`}>
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-2 py-1 rounded">
                          {article.source}
                        </span>
                        <span className="text-[9px] text-white/50">
                          {article.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white mb-3 leading-snug line-clamp-2 group-hover:text-green-400 transition-colors">
                        {article.title}
                      </h3>
                      <button
                        onClick={() => setNewsModal(article)}
                        className="text-[10px] font-bold uppercase tracking-widest text-green-500 hover:text-green-400 transition-colors cursor-pointer"
                      >
                        Read More &rarr;
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ══ TAB 3: HIGHLIGHTS ════════════════════════════ */}
          {tab === 'highlights' && (
            <motion.div
              key="highlights"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
            >
              {/* Channel carousel header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-sm font-black text-white uppercase tracking-widest"
                    style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                  >
                    Football Highlights Channels
                  </h2>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider">
                    {channelsWithRelevance.length} channels &mdash; ranked by global team relevance
                  </p>
                </div>
                {/* Navigation arrows */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCarouselPage(p => (p - 1 + totalPages) % totalPages)}
                    className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <FaChevronLeft size={12} />
                  </motion.button>
                  <span className="text-[10px] text-gray-500 font-bold tabular-nums min-w-[40px] text-center">
                    {carouselPage + 1}/{totalPages}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCarouselPage(p => (p + 1) % totalPages)}
                    className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <FaChevronRight size={12} />
                  </motion.button>
                </div>
              </div>

              {/* Auto-cycle indicator */}
              <div className="flex items-center gap-2 mb-4 text-[10px] text-gray-600 uppercase tracking-wider">
                <div className={`w-2 h-2 rounded-full ${carouselPaused ? 'bg-yellow-500' : 'bg-green-500'}`} />
                {carouselPaused ? 'Paused' : 'Auto-cycling every 8s'} &mdash; hover to pause
              </div>

              {/* Channel Cards */}
              <div
                ref={carouselRef}
                onMouseEnter={() => setCarouselPaused(true)}
                onMouseLeave={() => setCarouselPaused(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={carouselPage}
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
                        {/* Channel header with YouTube red accent */}
                        <div className="h-20 bg-gradient-to-br from-red-900/40 to-gray-900 relative flex items-center justify-center border-b border-red-900/20">
                          <FaYoutube size={28} className="text-red-500 opacity-30 group-hover:opacity-60 transition-opacity" />
                          {/* Relevance badge */}
                          <div className="absolute top-2 right-2">
                            <div className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                              channel.relevance >= 80 ? 'bg-green-900/40 text-green-400 border-green-700/50' :
                              channel.relevance >= 50 ? 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50' :
                              'bg-gray-800 text-gray-500 border-gray-700'
                            }`}>
                              {channel.relevance}% match
                            </div>
                          </div>
                          {/* Category badge */}
                          <div className="absolute bottom-2 left-2">
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${CATEGORY_BADGE[channel.category]}`}>
                              {channel.category}
                            </span>
                          </div>
                        </div>

                        {/* Channel info */}
                        <div className="p-3">
                          <h3 className="text-xs font-bold text-white mb-1 leading-snug group-hover:text-red-400 transition-colors truncate">
                            {channel.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 mb-3">
                            {channel.subs} subscribers
                          </p>

                          {/* Relevance bar */}
                          <div className="mb-3">
                            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${channel.relevance}%` }}
                                transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
                              />
                            </div>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
                          >
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
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselPage(i)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      i === carouselPage ? 'bg-red-500 w-6' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
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
                    setNewsModal(null);
                    // In production, this would link to the actual article
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
