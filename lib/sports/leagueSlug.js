/** Client-safe league slug resolution (no iSports / server imports). */

export const DEFAULT_LEAGUE_SLUG = "premier-league";

const KNOWN_SLUGS = new Set([
  "premier-league",
  "la-liga",
  "serie-a",
  "bundesliga",
  "ligue-1",
  "uefa-champions-league",
  "uefa-europa-league",
  "uefa-conference-league",
  "eredivisie",
  "primeira-liga",
  "belgian-pro-league",
  "scottish-premiership",
  "turkish-super-lig",
  "major-league-soccer",
  "brasileirao",
  "argentine-primera",
  "liga-mx",
  "psl",
  "egyptian-premier-league",
  "caf-champions-league",
  "caf-confederation-cup",
  "saudi-pro-league",
  "j1-league",
  "k-league-1",
  "afc-champions-league-elite",
  "fifa-world-cup",
  "uefa-nations-league",
]);

const SLUG_BY_ID = {
  "1639": "premier-league",
  "1134": "la-liga",
  "1437": "serie-a",
  "188": "bundesliga",
  "1112": "ligue-1",
  "13014": "uefa-champions-league",
  "13115": "uefa-europa-league",
  "14216": "uefa-conference-league",
  "1617": "eredivisie",
  "1325": "primeira-liga",
  "155": "belgian-pro-league",
  "1921": "scottish-premiership",
  "1033": "turkish-super-lig",
  "1123": "major-league-soccer",
  "144": "brasileirao",
  "122": "argentine-primera",
  "10415": "liga-mx",
  "18031": "psl",
  "13036": "egyptian-premier-league",
  "19324": "caf-champions-league",
  "12620": "caf-confederation-cup",
  "12923": "saudi-pro-league",
  "1527": "j1-league",
  "1516": "k-league-1",
  "12912": "afc-champions-league-elite",
  "1572": "fifa-world-cup",
  "10197": "uefa-nations-league",
};

export function resolveLeagueSlug(param) {
  if (!param) return DEFAULT_LEAGUE_SLUG;
  if (KNOWN_SLUGS.has(param)) return param;
  return SLUG_BY_ID[String(param)] || DEFAULT_LEAGUE_SLUG;
}
