'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import {
  FaTrophy, FaFutbol, FaNewspaper, FaPlayCircle, FaClock,
  FaExternalLinkAlt, FaSyncAlt, FaChevronDown, FaChevronUp,
  FaChevronLeft, FaChevronRight, FaYoutube, FaTimes,
  FaInfoCircle, FaFire, FaStar, FaBell, FaBellSlash,
  FaGlobeAfrica, FaBookmark, FaRegBookmark,
} from 'react-icons/fa';
import { GiSoccerBall, GiTrophyCup, GiWhistle } from 'react-icons/gi';

// ═══════════════════════════════════════════════════════════════
// TEAM LOGO URLS (from public football APIs / CDNs)
// Using logo.clearbit.com and img.chelseafc.com style URLs
// In production these come from the football API
// ═══════════════════════════════════════════════════════════════

const TEAM_LOGOS = {
  'Arsenal': 'https://resources.premierleague.com/premierleague/badges/50/t3.png',
  'Chelsea': 'https://resources.premierleague.com/premierleague/badges/50/t8.png',
  'Manchester City': 'https://resources.premierleague.com/premierleague/badges/50/t43.png',
  'Liverpool': 'https://resources.premierleague.com/premierleague/badges/50/t14.png',
  'Tottenham': 'https://resources.premierleague.com/premierleague/badges/50/t6.png',
  'Manchester United': 'https://resources.premierleague.com/premierleague/badges/50/t1.png',
  'Newcastle': 'https://resources.premierleague.com/premierleague/badges/50/t4.png',
  'Aston Villa': 'https://resources.premierleague.com/premierleague/badges/50/t7.png',
  'Brighton': 'https://resources.premierleague.com/premierleague/badges/50/t36.png',
  'West Ham': 'https://resources.premierleague.com/premierleague/badges/50/t21.png',
  'Everton': 'https://resources.premierleague.com/premierleague/badges/50/t11.png',
  'Wolves': 'https://resources.premierleague.com/premierleague/badges/50/t39.png',
  'Crystal Palace': 'https://resources.premierleague.com/premierleague/badges/50/t31.png',
  'Fulham': 'https://resources.premierleague.com/premierleague/badges/50/t54.png',
  'Bournemouth': 'https://resources.premierleague.com/premierleague/badges/50/t91.png',
  'Nottingham Forest': 'https://resources.premierleague.com/premierleague/badges/50/t17.png',
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
  'Kaizer Chiefs': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Kaizer_Chiefs_logo.svg/200px-Kaizer_Chiefs_logo.svg.png',
  'Orlando Pirates': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/11/Orlando_Pirates_logo.svg/200px-Orlando_Pirates_logo.svg.png',
  'Mamelodi Sundowns': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Mamelodi_Sundowns_logo.svg/200px-Mamelodi_Sundowns_logo.svg.png',
  'SuperSport United': 'https://upload.wikimedia.org/wikipedia/en/3/3e/SuperSport_United_FC_logo.svg',
  'Cape Town City': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Cape_Town_City_FC_logo.svg/200px-Cape_Town_City_FC_logo.svg.png',
  'Stellenbosch': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Stellenbosch_FC_logo.svg/200px-Stellenbosch_FC_logo.svg.png',
  'AmaZulu': 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/AmaZulu_FC_logo.svg/200px-AmaZulu_FC_logo.svg.png',
  'Sekhukhune United': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/17/Sekhukhune_United_F.C._logo.png/200px-Sekhukhune_United_F.C._logo.png',
  'Golden Arrows': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/Lamontville_Golden_Arrows_logo.svg/200px-Lamontville_Golden_Arrows_logo.svg.png',
  'Richards Bay': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Richards_Bay_FC_logo.svg/200px-Richards_Bay_FC_logo.svg.png',
  // World Cup teams
  'Brazil': 'https://crests.football-data.org/764.png',
  'Argentina': 'https://crests.football-data.org/762.png',
  'France': 'https://crests.football-data.org/773.png',
  'Germany': 'https://crests.football-data.org/759.png',
  'England': 'https://crests.football-data.org/770.png',
  'Spain': 'https://crests.football-data.org/760.png',
  'South Africa': 'https://crests.football-data.org/780.png',
  'Portugal': 'https://crests.football-data.org/765.png',
};

// ═══════════════════════════════════════════════════════════════
// LEAGUE DATA
// ═══════════════════════════════════════════════════════════════

const LEAGUE_META = {
  PL:  { name: 'Premier League',      color: 'border-purple-500', bg: 'from-purple-600 to-purple-900', accent: '#a855f7', textColor: 'text-purple-400', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  LL:  { name: 'La Liga',             color: 'border-orange-500', bg: 'from-orange-500 to-orange-800', accent: '#f97316', textColor: 'text-orange-400', logo: '🇪🇸' },
  SA:  { name: 'Serie A',             color: 'border-blue-500',   bg: 'from-blue-500 to-blue-800',     accent: '#3b82f6', textColor: 'text-blue-400',   logo: '🇮🇹' },
  BL:  { name: 'Bundesliga',          color: 'border-red-500',    bg: 'from-red-500 to-red-800',       accent: '#ef4444', textColor: 'text-red-400',    logo: '🇩🇪' },
  PSL: { name: 'PSL',                 color: 'border-yellow-500', bg: 'from-yellow-500 to-yellow-800', accent: '#eab308', textColor: 'text-yellow-400', logo: '🇿🇦' },
  UCL: { name: 'Champions League',    color: 'border-indigo-400', bg: 'from-indigo-500 to-blue-900',   accent: '#818cf8', textColor: 'text-indigo-300', logo: '🏆' },
  WC:  { name: 'FIFA World Cup 2026', color: 'border-emerald-400',bg: 'from-emerald-500 to-teal-900',  accent: '#34d399', textColor: 'text-emerald-300',logo: '🌍' },
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
  'Brazil': '#009739', 'Argentina': '#75AADB', 'France': '#002395', 'Germany': '#000000',
  'England': '#CF081F', 'Spain': '#AA151B', 'South Africa': '#007749', 'Portugal': '#006600',
};

// ═══════════════════════════════════════════════════════════════
// MOCK MATCH DATA (with match events for live detail)
// ═══════════════════════════════════════════════════════════════

const mockMatches = [
  // Premier League
  { id: 1,  league: 'PL', home: 'Arsenal', away: 'Chelsea', homeScore: 2, awayScore: 1, status: 'IN_PLAY', minute: 67, date: '15 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Saka', assist: 'Odegaard', minute: 23 },
      { type: 'goal', team: 'away', player: 'Palmer', assist: 'Jackson', minute: 35 },
      { type: 'yellow', team: 'away', player: 'Caicedo', minute: 41 },
      { type: 'goal', team: 'home', player: 'Havertz', assist: 'Saka', minute: 58 },
    ]},
  { id: 2,  league: 'PL', home: 'Manchester City', away: 'Liverpool', homeScore: 1, awayScore: 1, status: 'IN_PLAY', minute: 34, date: '15 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Haaland', assist: 'De Bruyne', minute: 12 },
      { type: 'goal', team: 'away', player: 'Salah', assist: 'Alexander-Arnold', minute: 28 },
      { type: 'yellow', team: 'home', player: 'Rodri', minute: 31 },
    ]},
  { id: 3,  league: 'PL', home: 'Tottenham', away: 'Manchester United', homeScore: 3, awayScore: 2, status: 'FINISHED', date: '15 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Son', minute: 5 },
      { type: 'goal', team: 'away', player: 'Rashford', assist: 'Fernandes', minute: 18 },
      { type: 'red', team: 'away', player: 'Casemiro', minute: 33 },
      { type: 'goal', team: 'home', player: 'Maddison', assist: 'Son', minute: 45 },
      { type: 'goal', team: 'away', player: 'Fernandes', minute: 62 },
      { type: 'goal', team: 'home', player: 'Johnson', assist: 'Maddison', minute: 78 },
    ]},
  { id: 4,  league: 'PL', home: 'Newcastle', away: 'Aston Villa', homeScore: 1, awayScore: 0, status: 'FINISHED', date: '15 Mar 2026', events: [{ type: 'goal', team: 'home', player: 'Isak', minute: 71 }] },
  { id: 5,  league: 'PL', home: 'Brighton', away: 'West Ham', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '17:30', date: '15 Mar 2026', events: [] },
  { id: 6,  league: 'PL', home: 'Everton', away: 'Wolves', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '20:00', date: '15 Mar 2026', events: [] },
  { id: 30, league: 'PL', home: 'Crystal Palace', away: 'Fulham', homeScore: 0, awayScore: 0, status: 'IN_PLAY', minute: 12, date: '15 Mar 2026', events: [] },
  // La Liga
  { id: 7,  league: 'LL', home: 'Barcelona', away: 'Atletico Madrid', homeScore: 3, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Yamal', assist: 'Pedri', minute: 14 },
      { type: 'goal', team: 'home', player: 'Lewandowski', minute: 33 },
      { type: 'goal', team: 'away', player: 'Griezmann', minute: 55 },
      { type: 'yellow', team: 'away', player: 'Koke', minute: 60 },
      { type: 'goal', team: 'home', player: 'Raphinha', assist: 'Yamal', minute: 82 },
    ]},
  { id: 8,  league: 'LL', home: 'Real Madrid', away: 'Sevilla', homeScore: 2, awayScore: 0, status: 'IN_PLAY', minute: 78, date: '15 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Bellingham', assist: 'Vinicius Jr', minute: 22 },
      { type: 'goal', team: 'home', player: 'Vinicius Jr', minute: 65 },
    ]},
  { id: 9,  league: 'LL', home: 'Real Sociedad', away: 'Villarreal', homeScore: 1, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026', events: [] },
  { id: 10, league: 'LL', home: 'Real Betis', away: 'Athletic Bilbao', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '21:00', date: '15 Mar 2026', events: [] },
  // Serie A
  { id: 11, league: 'SA', home: 'Inter Milan', away: 'AC Milan', homeScore: 2, awayScore: 2, status: 'IN_PLAY', minute: 88, date: '15 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Lautaro', minute: 15 },
      { type: 'goal', team: 'away', player: 'Leao', assist: 'Pulisic', minute: 29 },
      { type: 'red', team: 'home', player: 'Barella', minute: 44 },
      { type: 'goal', team: 'home', player: 'Thuram', minute: 67 },
      { type: 'goal', team: 'away', player: 'Pulisic', minute: 79 },
    ]},
  { id: 12, league: 'SA', home: 'Juventus', away: 'Napoli', homeScore: 1, awayScore: 0, status: 'FINISHED', date: '15 Mar 2026', events: [{ type: 'goal', team: 'home', player: 'Vlahovic', minute: 56 }] },
  { id: 13, league: 'SA', home: 'Roma', away: 'Atalanta', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '18:00', date: '15 Mar 2026', events: [] },
  { id: 14, league: 'SA', home: 'Lazio', away: 'Fiorentina', homeScore: 3, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026', events: [] },
  // Bundesliga
  { id: 15, league: 'BL', home: 'Bayern Munich', away: 'Borussia Dortmund', homeScore: 4, awayScore: 2, status: 'FINISHED', date: '15 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Kane', assist: 'Musiala', minute: 8 },
      { type: 'goal', team: 'away', player: 'Adeyemi', minute: 21 },
      { type: 'goal', team: 'home', player: 'Kane', minute: 34 },
      { type: 'goal', team: 'home', player: 'Sane', assist: 'Kimmich', minute: 52 },
      { type: 'goal', team: 'away', player: 'Brandt', minute: 68 },
      { type: 'goal', team: 'home', player: 'Musiala', minute: 85 },
    ]},
  { id: 16, league: 'BL', home: 'RB Leipzig', away: 'Bayer Leverkusen', homeScore: 1, awayScore: 1, status: 'IN_PLAY', minute: 55, date: '15 Mar 2026', events: [] },
  { id: 17, league: 'BL', home: 'Eintracht Frankfurt', away: 'Wolfsburg', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '17:30', date: '15 Mar 2026', events: [] },
  { id: 18, league: 'BL', home: 'Stuttgart', away: 'Freiburg', homeScore: 2, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026', events: [] },
  // PSL
  { id: 19, league: 'PSL', home: 'Kaizer Chiefs', away: 'Orlando Pirates', homeScore: 1, awayScore: 2, status: 'FINISHED', date: '15 Mar 2026',
    events: [
      { type: 'goal', team: 'away', player: 'Mofokeng', minute: 12 },
      { type: 'goal', team: 'home', player: 'Shabalala', assist: 'Du Preez', minute: 45 },
      { type: 'red', team: 'home', player: 'Ngcobo', minute: 67 },
      { type: 'goal', team: 'away', player: 'Hotto', minute: 78 },
    ]},
  { id: 20, league: 'PSL', home: 'Mamelodi Sundowns', away: 'SuperSport United', homeScore: 3, awayScore: 0, status: 'FINISHED', date: '15 Mar 2026', events: [] },
  { id: 21, league: 'PSL', home: 'Cape Town City', away: 'Stellenbosch', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '19:30', date: '15 Mar 2026', events: [] },
  { id: 22, league: 'PSL', home: 'AmaZulu', away: 'Sekhukhune United', homeScore: 0, awayScore: 0, status: 'IN_PLAY', minute: 22, date: '15 Mar 2026', events: [] },
  { id: 23, league: 'PSL', home: 'Golden Arrows', away: 'Richards Bay', homeScore: 1, awayScore: 1, status: 'FINISHED', date: '15 Mar 2026', events: [] },
  // Champions League
  { id: 24, league: 'UCL', home: 'Real Madrid', away: 'Manchester City', homeScore: 2, awayScore: 1, status: 'FINISHED', date: '14 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Vinicius Jr', minute: 18 },
      { type: 'goal', team: 'away', player: 'Haaland', assist: 'De Bruyne', minute: 44 },
      { type: 'yellow', team: 'away', player: 'Walker', minute: 56 },
      { type: 'goal', team: 'home', player: 'Bellingham', assist: 'Modric', minute: 89 },
    ]},
  { id: 25, league: 'UCL', home: 'Barcelona', away: 'Bayern Munich', homeScore: 3, awayScore: 3, status: 'FINISHED', date: '14 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Yamal', minute: 7 },
      { type: 'goal', team: 'away', player: 'Kane', minute: 22 },
      { type: 'goal', team: 'home', player: 'Lewandowski', minute: 38 },
      { type: 'goal', team: 'away', player: 'Sane', minute: 51 },
      { type: 'goal', team: 'home', player: 'Raphinha', minute: 72 },
      { type: 'goal', team: 'away', player: 'Musiala', minute: 88 },
    ]},
  { id: 26, league: 'UCL', home: 'Arsenal', away: 'Inter Milan', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '21:00', date: '16 Mar 2026', events: [] },
  { id: 27, league: 'UCL', home: 'Liverpool', away: 'Juventus', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '21:00', date: '16 Mar 2026', events: [] },
  // World Cup 2026 Qualifiers
  { id: 28, league: 'WC', home: 'Brazil', away: 'Argentina', homeScore: 2, awayScore: 2, status: 'FINISHED', date: '13 Mar 2026',
    events: [
      { type: 'goal', team: 'home', player: 'Vinicius Jr', minute: 15 },
      { type: 'goal', team: 'away', player: 'Messi', minute: 34 },
      { type: 'goal', team: 'home', player: 'Endrick', minute: 67 },
      { type: 'goal', team: 'away', player: 'Alvarez', minute: 82 },
    ]},
  { id: 29, league: 'WC', home: 'France', away: 'Germany', homeScore: 1, awayScore: 0, status: 'FINISHED', date: '13 Mar 2026',
    events: [{ type: 'goal', team: 'home', player: 'Mbappe', minute: 72 }]},
  { id: 31, league: 'WC', home: 'England', away: 'Spain', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '20:00', date: '16 Mar 2026', events: [] },
  { id: 32, league: 'WC', home: 'South Africa', away: 'Portugal', homeScore: null, awayScore: null, status: 'TIMED', kickoff: '18:00', date: '16 Mar 2026', events: [] },
];

// ═══════════════════════════════════════════════════════════════
// NEWS MOCK DATA (arranged by league)
// ═══════════════════════════════════════════════════════════════

const mockNews = [
  { id: 1,  title: 'Arsenal Close Gap on Man City After Dominant Derby Win', source: 'Sky Sports', timeAgo: '2 hours ago', category: 'Match Report', league: 'PL', gradient: 'from-red-900 to-red-700' },
  { id: 2,  title: 'Barcelona Secure El Clasico Bragging Rights with 3-1 Triumph', source: 'ESPN FC', timeAgo: '3 hours ago', category: 'Match Report', league: 'LL', gradient: 'from-blue-900 to-red-800' },
  { id: 3,  title: 'BREAKING: Kylian Mbappe Agrees Personal Terms with Man City', source: 'Fabrizio Romano', timeAgo: '45 min ago', category: 'Breaking', league: 'PL', gradient: 'from-sky-900 to-sky-700' },
  { id: 4,  title: 'Liverpool Manager Addresses Champions League Knockout Strategy', source: 'The Athletic', timeAgo: '5 hours ago', category: 'Interview', league: 'UCL', gradient: 'from-red-800 to-red-600' },
  { id: 5,  title: 'La Liga Title Race: Three Teams Separated by Two Points', source: 'Marca', timeAgo: '6 hours ago', category: 'Analysis', league: 'LL', gradient: 'from-orange-900 to-yellow-800' },
  { id: 6,  title: 'VAR Controversy Overshadows Soweto Derby as Pirates Edge Chiefs', source: 'SuperSport', timeAgo: '1 hour ago', category: 'Match Report', league: 'PSL', gradient: 'from-yellow-900 to-gray-800' },
  { id: 7,  title: 'Sundowns Set New PSL Record with 15th Consecutive Win', source: 'KickOff', timeAgo: '4 hours ago', category: 'Match Report', league: 'PSL', gradient: 'from-yellow-800 to-green-900' },
  { id: 8,  title: 'EXCLUSIVE: Chelsea Table R1.2 Billion Bid for Serie A Star', source: 'Sky Sports', timeAgo: '30 min ago', category: 'Transfer', league: 'SA', gradient: 'from-blue-800 to-blue-600' },
  { id: 9,  title: 'Tactical Analysis: How Arteta Outclassed Pochettino', source: 'The Guardian', timeAgo: '7 hours ago', category: 'Analysis', league: 'PL', gradient: 'from-gray-800 to-gray-600' },
  { id: 10, title: 'Bayern Complete Signing of English Wonderkid for R850M', source: 'BILD', timeAgo: '2 hours ago', category: 'Transfer', league: 'BL', gradient: 'from-red-900 to-red-700' },
  { id: 11, title: 'Real Madrid Injury Update: Vinicius Jr Faces Three Weeks Out', source: 'AS', timeAgo: '8 hours ago', category: 'Breaking', league: 'LL', gradient: 'from-yellow-900 to-white/10' },
  { id: 12, title: 'World Cup 2026 Qualifying: Five Teams On The Brink', source: 'BBC Sport', timeAgo: '1 hour ago', category: 'Analysis', league: 'WC', gradient: 'from-emerald-900 to-teal-800' },
];

const CATEGORY_COLORS = {
  'Transfer': 'bg-blue-600/20 text-blue-400 border-blue-700/50',
  'Match Report': 'bg-green-600/20 text-green-400 border-green-700/50',
  'Analysis': 'bg-purple-600/20 text-purple-400 border-purple-700/50',
  'Breaking': 'bg-red-600/20 text-red-400 border-red-700/50',
  'Interview': 'bg-yellow-600/20 text-yellow-400 border-yellow-700/50',
};

// ═══════════════════════════════════════════════════════════════
// HIGHLIGHTS CHANNELS DATA
// ═══════════════════════════════════════════════════════════════

const TOP_15_TEAMS = ['Manchester City','Real Madrid','Barcelona','Liverpool','Arsenal','Bayern Munich','PSG','Inter Milan','Manchester United','Chelsea','Juventus','Borussia Dortmund','AC Milan','Atletico Madrid','Tottenham'];

const highlightChannels = [
  { id: 1,  name: 'Sky Sports Football',    subs: '8.2M',  category: 'Broadcast',  teams: ['Arsenal','Chelsea','Liverpool','Manchester City','Manchester United','Tottenham'] },
  { id: 2,  name: 'ESPN FC',                subs: '6.1M',  category: 'Broadcast',  teams: ['Barcelona','Real Madrid','Liverpool','Arsenal','Manchester City','Chelsea'] },
  { id: 3,  name: 'beIN SPORTS',            subs: '11.4M', category: 'Broadcast',  teams: ['Barcelona','Real Madrid','PSG','Bayern Munich','Juventus'] },
  { id: 4,  name: 'SuperSport',             subs: '1.8M',  category: 'Broadcast',  teams: ['Manchester City','Liverpool','Arsenal','Chelsea','Manchester United'] },
  { id: 5,  name: 'DAZN',                   subs: '4.5M',  category: 'Broadcast',  teams: ['Inter Milan','AC Milan','Juventus','Bayern Munich','Borussia Dortmund'] },
  { id: 6,  name: 'BT Sport',               subs: '5.7M',  category: 'Broadcast',  teams: ['Liverpool','Arsenal','Manchester City','Chelsea','Tottenham','Manchester United'] },
  { id: 7,  name: 'CBS Sports Golazo',      subs: '3.2M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Inter Milan','AC Milan','Napoli','Atletico Madrid'] },
  { id: 8,  name: 'Rio Ferdinand Presents', subs: '4.8M',  category: 'Pundit',     teams: ['Manchester United','Real Madrid','Barcelona','Arsenal','Liverpool'] },
  { id: 9,  name: 'Gary Neville',           subs: '2.1M',  category: 'Pundit',     teams: ['Manchester United','Liverpool','Arsenal','Manchester City','Tottenham'] },
  { id: 10, name: 'Peter Crouch',           subs: '1.4M',  category: 'Pundit',     teams: ['Liverpool','Tottenham','Chelsea','Arsenal','Manchester City'] },
  { id: 11, name: 'Thierry Henry',          subs: '3.6M',  category: 'Pundit',     teams: ['Arsenal','Barcelona','Manchester City','Real Madrid','PSG'] },
  { id: 12, name: 'Jamie Carragher',        subs: '1.9M',  category: 'Pundit',     teams: ['Liverpool','Manchester City','Arsenal','Chelsea','Tottenham'] },
  { id: 13, name: 'Monday Night Football',  subs: '2.8M',  category: 'Analysis',   teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Manchester United','Tottenham'] },
  { id: 14, name: 'Match of the Day',       subs: '7.3M',  category: 'Broadcast',  teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Manchester United','Tottenham'] },
  { id: 15, name: 'The Overlap',            subs: '2.4M',  category: 'Pundit',     teams: ['Manchester United','Arsenal','Liverpool','Manchester City'] },
  { id: 16, name: 'AFTV',                   subs: '1.7M',  category: 'Reactor',    teams: ['Arsenal'] },
  { id: 17, name: 'The United Stand',       subs: '1.5M',  category: 'Reactor',    teams: ['Manchester United'] },
  { id: 18, name: 'Tifo Football',          subs: '2.9M',  category: 'Analysis',   teams: ['Manchester City','Barcelona','Liverpool','Bayern Munich','Real Madrid','Inter Milan'] },
  { id: 19, name: 'Football Daily',         subs: '1.3M',  category: 'Reactor',    teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Real Madrid','Barcelona'] },
  { id: 20, name: 'Copa90',                 subs: '2.2M',  category: 'Reactor',    teams: ['Barcelona','Real Madrid','Manchester City','Liverpool','Borussia Dortmund'] },
  { id: 21, name: 'Footballers React',      subs: '890K',  category: 'Reactor',    teams: ['Arsenal','Chelsea','Manchester United','Tottenham'] },
  { id: 22, name: 'Marca TV',               subs: '3.1M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Atletico Madrid'] },
  { id: 23, name: 'Gazzetta dello Sport',   subs: '1.6M',  category: 'Broadcast',  teams: ['Inter Milan','AC Milan','Juventus'] },
  { id: 24, name: 'Sport1 Bundesliga',      subs: '2.0M',  category: 'Broadcast',  teams: ['Bayern Munich','Borussia Dortmund'] },
  { id: 25, name: 'Statman Dave',           subs: '1.1M',  category: 'Analysis',   teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Barcelona','Real Madrid'] },
  { id: 26, name: 'Tactics Board',          subs: '780K',  category: 'Analysis',   teams: ['Manchester City','Liverpool','Barcelona','Bayern Munich','Inter Milan'] },
  { id: 27, name: 'Rabona TV',              subs: '650K',  category: 'Reactor',    teams: ['Chelsea','Arsenal','Liverpool'] },
  { id: 28, name: 'The Kick Off',           subs: '940K',  category: 'Reactor',    teams: ['Manchester United','Arsenal','Liverpool','Chelsea','Manchester City','Tottenham'] },
  { id: 29, name: 'Barca TV+',              subs: '5.2M',  category: 'Broadcast',  teams: ['Barcelona'] },
  { id: 30, name: 'Real Madrid TV',         subs: '4.9M',  category: 'Broadcast',  teams: ['Real Madrid'] },
  { id: 31, name: 'SPORF',                  subs: '3.4M',  category: 'Reactor',    teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Manchester United','Real Madrid','Barcelona'] },
  { id: 32, name: 'Premier League',         subs: '12.1M', category: 'Broadcast',  teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Manchester United','Tottenham'] },
  { id: 33, name: 'UEFA Champions League',  subs: '9.8M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Bayern Munich','Manchester City','Liverpool','Inter Milan','PSG'] },
  { id: 34, name: 'LaLiga',                 subs: '8.7M',  category: 'Broadcast',  teams: ['Barcelona','Real Madrid','Atletico Madrid'] },
  { id: 35, name: 'Bundesliga',             subs: '6.3M',  category: 'Broadcast',  teams: ['Bayern Munich','Borussia Dortmund'] },
  { id: 36, name: 'Serie A',                subs: '5.8M',  category: 'Broadcast',  teams: ['Inter Milan','AC Milan','Juventus'] },
  { id: 37, name: 'Micah Richards',         subs: '1.2M',  category: 'Pundit',     teams: ['Manchester City','Arsenal','Liverpool'] },
  { id: 38, name: 'Carragher & Neville Pod',subs: '980K',  category: 'Pundit',     teams: ['Liverpool','Manchester United','Arsenal','Manchester City'] },
  { id: 39, name: 'That Football Show SA',  subs: '320K',  category: 'Analysis',   teams: ['Manchester City','Liverpool','Arsenal','Chelsea'] },
  { id: 40, name: 'OneFootball',            subs: '2.6M',  category: 'Broadcast',  teams: ['Bayern Munich','Borussia Dortmund','Real Madrid','Barcelona','Manchester City'] },
  { id: 41, name: 'Goal',                   subs: '4.1M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Manchester City','Liverpool','Arsenal','PSG','Bayern Munich'] },
  { id: 42, name: 'Football Terrace',       subs: '870K',  category: 'Reactor',    teams: ['Manchester United','Liverpool','Arsenal'] },
  { id: 43, name: 'Expressions Oozing',     subs: '520K',  category: 'Reactor',    teams: ['Arsenal'] },
  { id: 44, name: 'Mark Goldbridge',        subs: '1.8M',  category: 'Reactor',    teams: ['Manchester United'] },
  { id: 45, name: 'B/R Football',           subs: '7.4M',  category: 'Broadcast',  teams: ['Real Madrid','Barcelona','Liverpool','Manchester City','PSG','Bayern Munich'] },
  { id: 46, name: 'Planet FPL',             subs: '410K',  category: 'Analysis',   teams: ['Arsenal','Liverpool','Manchester City','Chelsea','Tottenham','Manchester United'] },
  { id: 47, name: 'The Byline',             subs: '290K',  category: 'Analysis',   teams: ['Barcelona','Real Madrid','Atletico Madrid','Inter Milan'] },
  { id: 48, name: 'iDiski TV',              subs: '580K',  category: 'Broadcast',  teams: ['Manchester City','Chelsea','Liverpool'] },
];

const channelsWithRelevance = highlightChannels.map(ch => {
  const matchCount = ch.teams.filter(t => TOP_15_TEAMS.includes(t)).length;
  const relevance = Math.min(100, Math.round((matchCount / TOP_15_TEAMS.length) * 100 * 2.5));
  return { ...ch, relevance };
}).sort((a, b) => b.relevance - a.relevance);

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════

const TeamLogo = ({ team, size = 40 }) => {
  const logo = TEAM_LOGOS[team];
  const color = TEAM_COLORS[team] || '#4B5563';
  const initials = team.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {logo ? (
        <img
          src={logo}
          alt={team}
          className="w-full h-full object-contain drop-shadow-lg"
          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div
        className={`w-full h-full rounded-full items-center justify-center font-black text-white text-[9px] border-2 border-white/20 shadow-lg ${logo ? 'hidden' : 'flex'}`}
        style={{ backgroundColor: color, display: logo ? 'none' : 'flex' }}
      >
        {initials}
      </div>
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
    return <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-800 px-2.5 py-0.5 rounded">FT</span>;
  }
  return (
    <div className="flex items-center gap-1">
      <FaClock size={9} className="text-gray-500" />
      <span className="text-[10px] font-bold text-gray-400 tracking-wider">{match.kickoff}</span>
    </div>
  );
};

// Match detail modal event icon
const EventIcon = ({ type }) => {
  if (type === 'goal') return <span className="text-green-400">⚽</span>;
  if (type === 'yellow') return <span className="text-yellow-400">🟨</span>;
  if (type === 'red') return <span className="text-red-500">🟥</span>;
  return null;
};

// ═══════════════════════════════════════════════════════════════
// MATCH CARD (clickable)
// ═══════════════════════════════════════════════════════════════

const MatchCard = ({ match, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
    onClick={() => onClick(match)}
    className={`bg-gray-900/80 backdrop-blur-sm border rounded-2xl p-4 md:p-5 shadow-lg transition-all cursor-pointer ${
      match.status === 'IN_PLAY'
        ? 'border-red-800/50 shadow-red-900/20 hover:border-red-600/60'
        : 'border-gray-800 hover:border-gray-600'
    }`}
  >
    <div className="flex items-center gap-3 md:gap-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          {/* Home team */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <p className="text-sm md:text-base font-bold text-white truncate text-right">{match.home}</p>
            <TeamLogo team={match.home} size={36} />
          </div>
          {/* Score */}
          <div className="flex-shrink-0 mx-3 md:mx-5">
            {match.status === 'TIMED' ? (
              <motion.span className="text-sm font-bold text-gray-500" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>vs</motion.span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-black text-white tabular-nums">{match.homeScore}</span>
                <span className="text-lg text-gray-600 font-bold">-</span>
                <span className="text-2xl md:text-3xl font-black text-white tabular-nums">{match.awayScore}</span>
              </div>
            )}
          </div>
          {/* Away team */}
          <div className="flex-1 flex items-center gap-3">
            <TeamLogo team={match.away} size={36} />
            <p className="text-sm md:text-base font-bold text-white truncate">{match.away}</p>
          </div>
        </div>
        <div className="text-center mt-2 flex items-center justify-center gap-3">
          <StatusBadge match={match} />
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
  const [expandedLeagues, setExpandedLeagues] = useState({ PL: true, LL: true, SA: true, BL: true, PSL: true, UCL: true, WC: true });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [subscribedLeagues, setSubscribedLeagues] = useState(['PL', 'UCL', 'PSL']);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [newsFilter, setNewsFilter] = useState('ALL');
  const [highlightCategory, setHighlightCategory] = useState('All');
  const [newsModal, setNewsModal] = useState(null);

  // Highlights carousel
  const [carouselPage, setCarouselPage] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const carouselRef = useRef(null);

  const filteredChannels = useMemo(() => {
    if (highlightCategory === 'All') return channelsWithRelevance;
    return channelsWithRelevance.filter(ch => ch.category === highlightCategory);
  }, [highlightCategory]);

  const channelsPerPage = 8; // 4x2 grid
  const totalPages = Math.ceil(filteredChannels.length / channelsPerPage);

  useEffect(() => {
    if (tab !== 'highlights' || carouselPaused) return;
    const interval = setInterval(() => {
      setCarouselPage(p => (p + 1) % Math.max(1, totalPages));
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

  const toggleLeague = (code) => setExpandedLeagues(prev => ({ ...prev, [code]: !prev[code] }));
  const toggleSubscribe = (code) => setSubscribedLeagues(prev => prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]);

  // Group matches
  const leagueOrder = ['UCL', 'PL', 'LL', 'SA', 'BL', 'PSL', 'WC'];
  // Sort: subscribed first
  const sortedLeagues = [...leagueOrder].sort((a, b) => {
    const aS = subscribedLeagues.includes(a) ? 0 : 1;
    const bS = subscribedLeagues.includes(b) ? 0 : 1;
    return aS - bS;
  });

  const matchesByLeague = leagueOrder.reduce((acc, code) => {
    acc[code] = mockMatches.filter(m => m.league === code);
    return acc;
  }, {});

  // Featured = Champions League matches
  const featuredMatches = mockMatches.filter(m => m.league === 'UCL');

  // News filtered by league
  const filteredNews = newsFilter === 'ALL' ? mockNews : mockNews.filter(n => n.league === newsFilter);

  const currentChannels = filteredChannels.slice(carouselPage * channelsPerPage, carouselPage * channelsPerPage + channelsPerPage);

  const tabs = [
    { key: 'scores', label: 'LIVE FIXTURES', icon: <FaFutbol size={13} /> },
    { key: 'news', label: 'NEWS', icon: <FaNewspaper size={13} /> },
    { key: 'highlights', label: 'HIGHLIGHTS', icon: <FaPlayCircle size={13} /> },
  ];

  const CATEGORY_BADGE = {
    Broadcast: 'bg-red-600/20 text-red-400 border border-red-800/40',
    Pundit: 'bg-blue-600/20 text-blue-400 border border-blue-800/40',
    Reactor: 'bg-yellow-600/20 text-yellow-400 border border-yellow-800/40',
    Analysis: 'bg-purple-600/20 text-purple-400 border border-purple-800/40',
  };

  const highlightCategories = ['All', 'Broadcast', 'Pundit', 'Reactor', 'Analysis'];

  return (
    <div className="min-h-screen bg-gray-950 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Hero ── */}
        <motion.div
          className="text-center mb-10 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated background orbs */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.12), transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-0 right-1/4 w-40 h-40 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.1), transparent 70%)' }}
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-900/30 border border-green-700/50 mb-5"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FaTrophy className="text-3xl text-green-400" />
            </motion.div>
            <h1
              className="text-4xl md:text-6xl font-black uppercase tracking-widest text-white mb-3"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Live Fixtures
            </h1>
            <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
              Follow every goal, card and result across the world&apos;s biggest leagues — all in one place.
            </p>

            {/* ── UPDATED BUTTON (big, vibrant, animated) ── */}
            <motion.button
              onClick={handleRefresh}
              className="mt-6 relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white overflow-hidden cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 30%, #34d399 60%, #059669 100%)',
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                boxShadow: [
                  '0 0 20px rgba(16,185,129,0.4), 0 0 60px rgba(16,185,129,0.1)',
                  '0 0 40px rgba(16,185,129,0.6), 0 0 80px rgba(16,185,129,0.2), 0 0 120px rgba(52,211,153,0.1)',
                  '0 0 20px rgba(16,185,129,0.4), 0 0 60px rgba(16,185,129,0.1)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.08, boxShadow: '0 0 50px rgba(16,185,129,0.7), 0 0 100px rgba(16,185,129,0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%)', backgroundSize: '200% 100%' }}
                animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-green-400/30"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <FaClock size={16} />
              <span className="relative z-10">
                Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <motion.div
                animate={refreshing ? { rotate: 360 } : { rotate: [0, 360] }}
                transition={refreshing ? { duration: 0.8, ease: 'linear' } : { duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <FaSyncAlt size={14} />
              </motion.div>
            </motion.button>

            {/* Info note */}
            <motion.div
              className="mt-4 inline-flex items-center gap-2 text-[10px] text-gray-600 bg-gray-900 border border-gray-800 rounded-full px-4 py-1.5"
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
          className="mb-6 bg-gradient-to-r from-green-900/30 via-emerald-900/20 to-green-900/30 border border-green-800/30 rounded-xl px-4 py-3 text-center text-xs text-green-400 font-bold uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
            ⚡ API integration coming soon — data shown is for preview purposes
          </motion.span>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div className="flex flex-wrap justify-center gap-2 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {tabs.map((t) => (
            <motion.button
              key={t.key}
              onClick={() => { setTab(t.key); setCarouselPage(0); }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                tab === t.key
                  ? 'bg-green-900/40 text-green-400 border border-green-700 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                  : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-700 hover:text-gray-300'
              }`}
            >
              {t.icon} {t.label}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">

          {/* ══ LIVE FIXTURES ══ */}
          {tab === 'scores' && (
            <motion.div key="scores" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>

              {/* League Subscription Bar */}
              <div className="mb-6 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mr-2">
                  <FaBell size={10} className="inline mr-1" /> My Leagues:
                </span>
                {leagueOrder.map(code => {
                  const meta = LEAGUE_META[code];
                  const isSub = subscribedLeagues.includes(code);
                  return (
                    <motion.button
                      key={code}
                      onClick={() => toggleSubscribe(code)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                        isSub ? `bg-gradient-to-r ${meta.bg} text-white border-transparent shadow-lg` : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <span>{meta.logo}</span>
                      <span className="hidden sm:inline">{meta.name}</span>
                      <span className="sm:hidden">{code}</span>
                      {isSub ? <FaBell size={8} /> : <FaBellSlash size={8} />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Featured: Champions League */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <FaTrophy className="text-indigo-400" size={16} />
                  </motion.span>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                    Champions League
                  </h2>
                  <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <FaStar className="text-yellow-500" size={12} />
                  </motion.span>
                </div>
                <div className="space-y-3">
                  {featuredMatches.map((match) => (
                    <MatchCard key={`feat-${match.id}`} match={match} onClick={setSelectedMatch} />
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 my-8" />

              {/* League Sections - 4x4 Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {sortedLeagues.filter(c => c !== 'UCL').map((code) => {
                  const meta = LEAGUE_META[code];
                  const matches = matchesByLeague[code];
                  if (!matches || !matches.length) return null;
                  const isExpanded = expandedLeagues[code];
                  const isSub = subscribedLeagues.includes(code);

                  return (
                    <motion.div
                      key={code}
                      className={`bg-gray-900/50 rounded-2xl border overflow-hidden transition-all ${isSub ? `${meta.color} border-opacity-50` : 'border-gray-800'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      layout
                    >
                      <button
                        onClick={() => toggleLeague(code)}
                        className="w-full flex items-center gap-2 p-3 hover:bg-gray-800/50 transition-colors cursor-pointer"
                      >
                        <span className="text-lg">{meta.logo}</span>
                        <h3 className={`text-xs font-black uppercase tracking-widest ${meta.textColor} flex-1 text-left`} style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                          {meta.name}
                        </h3>
                        <span className="text-[9px] text-gray-600 font-bold">{matches.length}</span>
                        {isExpanded ? <FaChevronUp size={8} className="text-gray-500" /> : <FaChevronDown size={8} className="text-gray-500" />}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-2 space-y-2">
                              {matches.map((match) => (
                                <motion.div
                                  key={match.id}
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => setSelectedMatch(match)}
                                  className={`bg-gray-950/60 rounded-xl p-3 cursor-pointer border transition-colors ${
                                    match.status === 'IN_PLAY' ? 'border-red-900/40' : 'border-transparent hover:border-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <TeamLogo team={match.home} size={24} />
                                    <span className="flex-1 text-[11px] text-white font-bold truncate text-right">{match.home}</span>
                                    <div className="mx-1">
                                      {match.status === 'TIMED' ? (
                                        <span className="text-[10px] text-gray-500 font-bold">{match.kickoff}</span>
                                      ) : (
                                        <span className="text-[13px] font-black text-green-400 tabular-nums">{match.homeScore} - {match.awayScore}</span>
                                      )}
                                    </div>
                                    <span className="flex-1 text-[11px] text-white font-bold truncate">{match.away}</span>
                                    <TeamLogo team={match.away} size={24} />
                                  </div>
                                  <div className="text-center mt-1">
                                    <StatusBadge match={match} />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══ NEWS (arranged by leagues) ══ */}
          {tab === 'news' && (
            <motion.div key="news" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <div className="text-center mb-4">
                <p className="text-[10px] text-green-400/70 uppercase tracking-widest font-bold">
                  ⚡ Powered by live football news feeds &mdash; Full API integration in development
                </p>
              </div>

              {/* League filter pills */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                <motion.button
                  onClick={() => setNewsFilter('ALL')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer border transition-all ${
                    newsFilter === 'ALL' ? 'bg-green-600 text-white border-green-500' : 'bg-gray-900 text-gray-400 border-gray-700'
                  }`}
                >
                  All Leagues
                </motion.button>
                {leagueOrder.map(code => (
                  <motion.button
                    key={code}
                    onClick={() => setNewsFilter(code)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer border transition-all flex items-center gap-1 ${
                      newsFilter === code ? `bg-gradient-to-r ${LEAGUE_META[code].bg} text-white border-transparent` : 'bg-gray-900 text-gray-400 border-gray-700'
                    }`}
                  >
                    {LEAGUE_META[code].logo} <span className="hidden sm:inline">{LEAGUE_META[code].name}</span><span className="sm:hidden">{code}</span>
                  </motion.button>
                ))}
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredNews.map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:border-gray-700 transition-colors"
                    onClick={() => setNewsModal(article)}
                  >
                    <div className={`h-36 bg-gradient-to-br ${article.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[article.category] || 'bg-gray-700 text-gray-300'}`}>
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full bg-black/40 ${LEAGUE_META[article.league]?.textColor || 'text-gray-300'}`}>
                          {LEAGUE_META[article.league]?.logo} {article.league}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-2 py-1 rounded">{article.source}</span>
                        <span className="text-[9px] text-white/50">{article.timeAgo}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-white mb-3 leading-snug line-clamp-2 group-hover:text-green-400 transition-colors">{article.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 hover:text-green-400 transition-colors">Read More &rarr;</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ══ HIGHLIGHTS (4x4 grid, category filters) ══ */}
          {tab === 'highlights' && (
            <motion.div key="highlights" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>

              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {highlightCategories.map(cat => (
                  <motion.button
                    key={cat}
                    onClick={() => { setHighlightCategory(cat); setCarouselPage(0); }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest cursor-pointer border transition-all ${
                      highlightCategory === cat
                        ? cat === 'All' ? 'bg-green-600 text-white border-green-500' : `${CATEGORY_BADGE[cat]} font-black`
                        : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Channel header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                    Football Highlights Channels
                  </h2>
                  <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-wider">
                    {filteredChannels.length} channels &mdash; {highlightCategory === 'All' ? 'ranked by global team relevance' : highlightCategory}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setCarouselPage(p => (p - 1 + Math.max(1, totalPages)) % Math.max(1, totalPages))}
                    className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors cursor-pointer">
                    <FaChevronLeft size={12} />
                  </motion.button>
                  <span className="text-[10px] text-gray-500 font-bold tabular-nums min-w-[40px] text-center">{carouselPage + 1}/{Math.max(1, totalPages)}</span>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setCarouselPage(p => (p + 1) % Math.max(1, totalPages))}
                    className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-colors cursor-pointer">
                    <FaChevronRight size={12} />
                  </motion.button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 text-[10px] text-gray-600 uppercase tracking-wider">
                <div className={`w-2 h-2 rounded-full ${carouselPaused ? 'bg-yellow-500' : 'bg-green-500'}`} />
                {carouselPaused ? 'Paused' : 'Auto-cycling every 8s'} &mdash; hover to pause
              </div>

              {/* 4x2 Channel Grid */}
              <div ref={carouselRef} onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${carouselPage}-${highlightCategory}`}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    {currentChannels.map((channel) => (
                      <motion.div
                        key={channel.id}
                        whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
                        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg group hover:border-red-800/40 transition-colors"
                      >
                        <div className="h-24 bg-gradient-to-br from-red-900/40 to-gray-900 relative flex items-center justify-center border-b border-red-900/20">
                          <FaYoutube size={32} className="text-red-500 opacity-30 group-hover:opacity-60 transition-opacity" />
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
                          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors cursor-pointer">
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
                {Array.from({ length: Math.max(1, totalPages) }, (_, i) => (
                  <button key={i} onClick={() => setCarouselPage(i)} className={`w-2 h-2 rounded-full transition-all cursor-pointer ${i === carouselPage ? 'bg-red-500 w-6' : 'bg-gray-700 hover:bg-gray-600'}`} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ MATCH DETAIL MODAL ══ */}
      <AnimatePresence>
        {selectedMatch && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedMatch(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              className="relative bg-gray-900 border border-gray-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.85, y: 30, rotateX: 10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <button onClick={() => setSelectedMatch(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer z-10">
                <FaTimes size={16} />
              </button>

              {/* Match header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1 mb-3">
                  <span className="text-lg">{LEAGUE_META[selectedMatch.league]?.logo}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest ${LEAGUE_META[selectedMatch.league]?.textColor}`}>
                    {LEAGUE_META[selectedMatch.league]?.name}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-6 mb-3">
                  <div className="text-center">
                    <TeamLogo team={selectedMatch.home} size={56} />
                    <p className="text-white font-bold text-sm mt-2">{selectedMatch.home}</p>
                  </div>
                  <div>
                    {selectedMatch.status === 'TIMED' ? (
                      <div className="text-center">
                        <p className="text-2xl font-black text-gray-500">vs</p>
                        <p className="text-xs text-gray-500 mt-1">{selectedMatch.kickoff}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-black text-white tabular-nums">{selectedMatch.homeScore}</span>
                        <span className="text-2xl text-gray-600">-</span>
                        <span className="text-4xl font-black text-white tabular-nums">{selectedMatch.awayScore}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <TeamLogo team={selectedMatch.away} size={56} />
                    <p className="text-white font-bold text-sm mt-2">{selectedMatch.away}</p>
                  </div>
                </div>
                <StatusBadge match={selectedMatch} />
                <p className="text-[10px] text-gray-600 mt-2">{selectedMatch.date}</p>
              </div>

              {/* Match events timeline */}
              {selectedMatch.events && selectedMatch.events.length > 0 ? (
                <div className="border-t border-gray-800 pt-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Match Events</h4>
                  <div className="space-y-2">
                    {selectedMatch.events.map((evt, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: evt.team === 'home' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                          evt.team === 'home' ? 'bg-gray-800/50' : 'bg-gray-800/30'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-gray-500 w-8 text-right tabular-nums">{evt.minute}&apos;</span>
                        <EventIcon type={evt.type} />
                        <div className="flex-1">
                          <span className="text-sm font-bold text-white">{evt.player}</span>
                          {evt.assist && <span className="text-xs text-gray-500 ml-1">(assist: {evt.assist})</span>}
                        </div>
                        <span className="text-[10px] text-gray-600 uppercase">{evt.team === 'home' ? selectedMatch.home : selectedMatch.away}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-800 pt-4 text-center">
                  <p className="text-gray-600 text-sm">No events yet</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ NEWS MODAL ══ */}
      <AnimatePresence>
        {newsModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setNewsModal(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="relative bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-2xl" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
              <button onClick={() => setNewsModal(null)} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors cursor-pointer"><FaTimes size={14} /></button>
              <div className="flex items-center gap-2 mb-4">
                <FaExternalLinkAlt size={12} className="text-yellow-500" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">External Link</h3>
              </div>
              <p className="text-sm text-gray-300 mb-2 leading-relaxed">You are about to leave <span className="text-green-400 font-bold">5s Arena</span> to visit:</p>
              <p className="text-sm text-white font-bold mb-5 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">{newsModal.source}</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setNewsModal(null)}
                  className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-400 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors cursor-pointer">Stay</motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setNewsModal(null)}
                  className="flex-1 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-green-600 hover:bg-green-500 rounded-xl transition-colors cursor-pointer shadow-[0_0_12px_rgba(34,197,94,0.3)]">Continue &rarr;</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FixturesPage;
