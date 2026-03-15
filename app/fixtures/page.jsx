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
  { id: 1,  title: 'Arsenal Close Gap on Man City After Dominant Derby Win',              source: 'Sky Sports',     timeAgo: '2 hours ago', category: 'Match Report', gradient: 'from-red-900 to-red-700',        leagues: ['PL'],       url: 'https://www.skysports.com/football', thumb: 'https://e0.365dm.com/24/01/768x432/skysports-arsenal-premier-league_6424001.jpg' },
  { id: 2,  title: 'Barcelona Secure El Clasico Bragging Rights with 3-1 Triumph',         source: 'ESPN FC',        timeAgo: '3 hours ago', category: 'Match Report', gradient: 'from-blue-900 to-red-800',       leagues: ['LL'],       url: 'https://www.espn.com/soccer/', thumb: 'https://a.espncdn.com/photo/2024/0428/r1329567_1296x729_16-9.jpg' },
  { id: 3,  title: 'BREAKING: Kylian Mbappe Agrees Personal Terms with Man City',          source: 'Fabrizio Romano',timeAgo: '45 min ago',  category: 'Breaking',     gradient: 'from-sky-900 to-sky-700',        leagues: ['PL'],       url: 'https://x.com/FabrizioRomano', thumb: 'https://pbs.twimg.com/profile_images/1459853898254688257/RxBRdXNP_400x400.jpg' },
  { id: 4,  title: 'Liverpool Manager Addresses Champions League Knockout Strategy',       source: 'The Athletic',   timeAgo: '5 hours ago', category: 'Interview',    gradient: 'from-red-800 to-red-600',        leagues: ['PL', 'UCL'],url: 'https://theathletic.com/football/', thumb: 'https://cdn.theathletic.com/app/uploads/2024/03/06170859/GettyImages-2035846506-scaled.jpg' },
  { id: 5,  title: 'La Liga Title Race: Three Teams Separated by Two Points',              source: 'Marca',          timeAgo: '6 hours ago', category: 'Analysis',     gradient: 'from-orange-900 to-yellow-800',  leagues: ['LL'],       url: 'https://www.marca.com/en/football/la-liga.html', thumb: 'https://phantom-marca.unidadeditorial.es/e86c6ab2c7c7d8c5b7e0e9e9e9e9e9e9/resize/1320/f/webp/assets/multimedia/imagenes/2024/01/08/17047553654891.jpg' },
  { id: 6,  title: 'VAR Controversy Overshadows Soweto Derby as Pirates Edge Chiefs',       source: 'SuperSport',     timeAgo: '1 hour ago',  category: 'Match Report', gradient: 'from-yellow-900 to-gray-800',    leagues: ['PSL'],      url: 'https://supersport.com/football/psl', thumb: 'https://supersport.com/api/images/landscape/934223' },
  { id: 7,  title: 'Sundowns Set New PSL Record with 15th Consecutive Win',                source: 'KickOff',        timeAgo: '4 hours ago', category: 'Match Report', gradient: 'from-yellow-800 to-green-900',   leagues: ['PSL'],      url: 'https://www.kickoff.com/psl/', thumb: 'https://www.kickoff.com/images/2024/mamelodi-sundowns-celebrate.jpg' },
  { id: 8,  title: 'EXCLUSIVE: Chelsea Table R1.2 Billion Bid for Serie A Star',           source: 'Sky Sports',     timeAgo: '30 min ago',  category: 'Transfer',     gradient: 'from-blue-800 to-blue-600',      leagues: ['PL', 'SA'], url: 'https://www.skysports.com/transfer-centre', thumb: 'https://e0.365dm.com/24/02/768x432/skysports-chelsea-transfer_6453001.jpg' },
  { id: 9,  title: 'Tactical Analysis: How Arteta Outclassed Pochettino',                  source: 'The Guardian',   timeAgo: '7 hours ago', category: 'Analysis',     gradient: 'from-gray-800 to-gray-600',      leagues: ['PL'],       url: 'https://www.theguardian.com/football', thumb: 'https://i.guim.co.uk/img/media/7d95c7beff8d82a8e9f9e9e9e9e9e9e9/0_0_5568_3712/master/5568.jpg' },
  { id: 10, title: 'Bayern Munich Complete Signing of English Wonderkid for R850M',        source: 'BILD',           timeAgo: '2 hours ago', category: 'Transfer',     gradient: 'from-red-900 to-red-700',        leagues: ['BL'],       url: 'https://www.bild.de/sport/fussball/', thumb: 'https://images.bild.de/64e98d2897b4ba0001e60d89/0684e2f9d8e9e9e9e9e9/3/original.jpg' },
  { id: 11, title: 'Real Madrid Injury Update: Vinicius Jr Faces Three Weeks Out',         source: 'AS',             timeAgo: '8 hours ago', category: 'Breaking',     gradient: 'from-yellow-900 to-white/10',    leagues: ['LL', 'UCL'],url: 'https://en.as.com/soccer/', thumb: 'https://as01.epimg.net/en/imagenes/2024/01/15/soccer/1705288454_544851_1705288559_noticia_normal.jpg' },
  { id: 12, title: 'Premier League Top Scorers: Updated Golden Boot Race After Matchday 30',source: 'BBC Sport',     timeAgo: '1 hour ago',  category: 'Analysis',     gradient: 'from-purple-900 to-indigo-800',  leagues: ['PL'],       url: 'https://www.bbc.com/sport/football/premier-league', thumb: 'https://ichef.bbci.co.uk/onesport/cps/800/cpsprodpb/7E7C/production/_132441234_gettyimages-1905284752.jpg' },
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

const TeamBadge = ({ team, size = 'md' }) => {
  const color = getTeamColor(team);
  const logo = TEAM_LOGOS[team];
  const dims = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-12 h-12';
  const textSize = size === 'lg' ? 'text-sm' : size === 'sm' ? 'text-[9px]' : 'text-xs';

  if (logo) {
    return (
      <div className={`${dims} rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 border border-white/20 shadow-md overflow-hidden p-1`}>
        <img src={logo} alt={team} className="w-full h-full object-contain" loading="lazy" />
      </div>
    );
  }

  return (
    <div
      className={`${dims} ${textSize} rounded-full flex items-center justify-center font-black text-white flex-shrink-0 border border-white/20 shadow-md`}
      style={{ backgroundColor: color }}
    >
      {team.charAt(0)}
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

  // Highlights carousel state
  const [carouselPage, setCarouselPage] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const carouselRef = useRef(null);
  const channelsPerPage = 5;
  // totalPages computed as filteredTotalPages after filter state

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

  // Group matches by league — respect selected & priority
  const baseLeagueOrder = ['PL', 'LL', 'SA', 'BL', 'PSL', 'UCL'];
  const leagueOrder = [
    ...baseLeagueOrder.filter(c => priorityLeagues.has(c) && selectedLeagues.has(c)),
    ...baseLeagueOrder.filter(c => !priorityLeagues.has(c) && selectedLeagues.has(c)),
  ];
  const matchesByLeague = baseLeagueOrder.reduce((acc, code) => {
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

        {/* API banner — subtle */}
        <motion.div
          className="mb-6 bg-green-900/10 border border-green-900/30 rounded-xl px-4 py-2 text-center text-[9px] text-green-600/60 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.3 }}
        >
          Live data API integration in progress &mdash; preview mode active
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
              {/* ── My Leagues Dropdown ── */}
              <div className="mb-6 relative">
                <motion.button
                  onClick={() => setMyLeaguesOpen(v => !v)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest bg-gray-900 border border-gray-800 hover:border-green-800 text-gray-400 hover:text-green-400 transition-colors cursor-pointer"
                >
                  <FaHeart size={10} className="text-green-500" />
                  My Leagues
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

              {/* League filter chips */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">By League:</span>
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
                    {name}
                  </motion.button>
                ))}
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredNews.map((article, i) => (
                  <motion.a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={staggerItem}
                    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:border-green-700/50 transition-all block"
                  >
                    {/* Thumbnail image */}
                    <div className="h-44 relative overflow-hidden">
                      <img
                        src={article.thumb}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                      <div className={`h-full bg-gradient-to-br ${article.gradient} items-center justify-center hidden`}>
                        <FaNewspaper size={32} className="text-white/30" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      {/* Category + league badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-sm ${CATEGORY_COLORS[article.category] || 'bg-gray-700 text-gray-300'}`}>
                          {article.category}
                        </span>
                        {article.leagues?.map((lc) => (
                          <span key={lc} className={`text-[8px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur border border-white/10 ${LEAGUE_META[lc]?.textColor || 'text-gray-400'}`}>
                            {LEAGUE_META[lc]?.name || lc}
                          </span>
                        ))}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                          {article.source}
                        </span>
                        <span className="text-[9px] text-white/70 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                          {article.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-green-400 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-500 group-hover:text-green-400 transition-colors">
                        <FaExternalLinkAlt size={9} />
                        Read Full Article
                      </div>
                    </div>
                  </motion.a>
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
              {/* Channel header + view toggle */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-sm font-black text-white uppercase tracking-widest"
                    style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                  >
                    Football Highlights Channels
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
