/** Maps Gherkin display names to app league slugs and button labels. */
export const LEAGUE_ALIASES: Record<string, { slug: string; buttonLabel: string }> = {
  "World Cup": { slug: "fifa-world-cup", buttonLabel: "World Cup" },
  "Nations League": { slug: "uefa-nations-league", buttonLabel: "Nations League" },
  "Premier League": { slug: "premier-league", buttonLabel: "Premier League" },
  UCL: { slug: "uefa-champions-league", buttonLabel: "UCL" },
  UEL: { slug: "uefa-europa-league", buttonLabel: "UEL" },
  UECL: { slug: "uefa-conference-league", buttonLabel: "UECL" },
  "La Liga": { slug: "la-liga", buttonLabel: "La Liga" },
  "Serie A": { slug: "serie-a", buttonLabel: "Serie A" },
  Bundesliga: { slug: "bundesliga", buttonLabel: "Bundesliga" },
  "Ligue 1": { slug: "ligue-1", buttonLabel: "Ligue 1" },
  Eredivisie: { slug: "eredivisie", buttonLabel: "Eredivisie" },
  "Primeira Liga": { slug: "primeira-liga", buttonLabel: "Primeira Liga" },
  "Belgian Pro": { slug: "belgian-pro-league", buttonLabel: "Belgian Pro" },
  "Scottish Prem": { slug: "scottish-premiership", buttonLabel: "Scottish Prem" },
  "Süper Lig": { slug: "turkish-super-lig", buttonLabel: "Süper Lig" },
  MLS: { slug: "major-league-soccer", buttonLabel: "MLS" },
  Brasileirao: { slug: "brasileirao", buttonLabel: "Brasileirao" },
  Primera: { slug: "argentine-primera", buttonLabel: "Primera" },
  "Liga MX": { slug: "liga-mx", buttonLabel: "Liga MX" },
  PSL: { slug: "psl", buttonLabel: "PSL" },
  "Egypt PL": { slug: "egyptian-premier-league", buttonLabel: "Egypt PL" },
  "CAF CL": { slug: "caf-champions-league", buttonLabel: "CAF CL" },
  "CAF CC": { slug: "caf-confederation-cup", buttonLabel: "CAF CC" },
  "Saudi Pro": { slug: "saudi-pro-league", buttonLabel: "Saudi Pro" },
  J1: { slug: "j1-league", buttonLabel: "J1" },
  "K League": { slug: "k-league-1", buttonLabel: "K League" },
  "AFC CL": { slug: "afc-champions-league-elite", buttonLabel: "AFC CL" },
};

export function resolveLeague(leagueName: string) {
  return LEAGUE_ALIASES[leagueName] ?? { slug: "la-liga", buttonLabel: leagueName };
}

export const ALL_LEAGUE_SLUGS = Object.values(LEAGUE_ALIASES).map((entry) => entry.slug);
