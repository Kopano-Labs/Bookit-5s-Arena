// app/api/fixtures/route.js
// Proxies TheSportsDB (free, API key = "3") to fetch real football fixtures.
// Caches results in memory for 10 minutes — TheSportsDB free tier has no stated
// rate limit but is designed for moderate traffic; caching keeps us well within it.
//
// TheSportsDB league IDs used:
//   4406 — English Premier League
//   4480 — La Liga
//   4332 — Serie A
//   4331 — Bundesliga
//   4806 — Premier Soccer League (South Africa)
//   4480 — UEFA Champions League (4419)

const SPORTSDB_KEY = '3'; // Free public key — requires no signup
const BASE = `https://www.thesportsdb.com/api/v1/json/${SPORTSDB_KEY}`;

// League configuration — maps our internal codes to TheSportsDB IDs
const LEAGUES = {
  PL:  { id: '4406', name: 'Premier League' },
  LL:  { id: '4480', name: 'La Liga' },
  SA:  { id: '4332', name: 'Serie A' },
  BL:  { id: '4331', name: 'Bundesliga' },
  PSL: { id: '4806', name: 'Premier Soccer League' },
  UCL: { id: '4480', name: 'Champions League' }, // Note: UCL has its own ID
};

// Simple in-memory cache — TTL 60 seconds (optimized for 15s high-frequency polling)
const cache = new Map();
const CACHE_TTL = 60 * 1000;

async function fetchLeagueEvents(leagueId) {
  const cacheKey = `next_${leagueId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(
      `${BASE}/eventsnextleague.php?id=${leagueId}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const events = (json?.events || []).slice(0, 6).map(e => ({
      id:        e.idEvent,
      league:    e.strLeague,
      leagueId:  e.idLeague,
      home:      e.strHomeTeam,
      away:      e.strAwayTeam,
      homeLogo:  e.strHomeTeamBadge || null,
      awayLogo:  e.strAwayTeamBadge || null,
      date:      e.dateEvent,
      time:      e.strTime ? e.strTime.substring(0, 5) : null,
      venue:     e.strVenue || null,
      status:    'TIMED',
      homeScore: null,
      awayScore: null,
    }));
    cache.set(cacheKey, { data: events, ts: Date.now() });
    return events;
  } catch {
    return [];
  }
}

// GET /api/fixtures?leagues=PL,PSL,WC  (defaults to all leagues if omitted)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueParam = searchParams.get('leagues');
    
    // ── Local Tournament Logic ─────────────────────────────────
    // We always include local WC data if requested or if no leagues specified
    let localWC = null;
    if (!leagueParam || leagueParam.split(',').includes('WC')) {
       try {
         const { default: connectDB } = await import('@/lib/mongodb');
         const { default: TournamentTeam } = await import('@/models/TournamentTeam');
         await connectDB();
         const teams = await TournamentTeam.find({ status: 'confirmed' })
           .sort({ pts: -1, gd: -1, gf: -1 })
           .lean();
         
         localWC = teams.map(t => ({
           id: t._id.toString(),
           name: t.teamName,
           logo: t.worldCupTeamLogo,
           stats: {
             mp: t.mp || 0,
             w: t.w || 0,
             d: t.d || 0,
             l: t.l || 0,
             gf: t.gf || 0,
             ga: t.ga || 0,
             gd: t.gd || 0,
             pts: t.pts || 0
           }
         }));
       } catch (err) {
         console.error('Local WC fetch failed:', err);
       }
    }

    const codes = leagueParam
      ? leagueParam.split(',').filter(c => LEAGUES[c])
      : Object.keys(LEAGUES);

    // Fetch all requested leagues in parallel
    const results = await Promise.all(
      codes.map(async (code) => {
        const events = await fetchLeagueEvents(LEAGUES[code].id);
        return { code, events };
      })
    );

    const data = {};
    results.forEach(({ code, events }) => {
      data[code] = events;
    });

    const body = {
      source: 'hybrid',
      fetchedAt: new Date().toISOString(),
      leagues: data,
    };
    if (localWC) body.wc_standings = localWC;

    const res = Response.json(body);

    // Cache at the HTTP edge layer too — lower revalidate for live feel
    res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
    return res;
  } catch (err) {
    console.error('Fixtures API error:', err);
    return Response.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
}
