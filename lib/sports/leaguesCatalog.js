/** Shared league catalog for fixtures UI, onboarding, and deep links. */
export const LEAGUES_CATALOG = [
  { slug: "fifa-world-cup", name: "FIFA World Cup", shortName: "World Cup", country: "INT", emoji: "🏆" },
  { slug: "uefa-nations-league", name: "UEFA Nations League", shortName: "Nations League", country: "EUR", emoji: "🌍" },
  { slug: "premier-league", name: "Premier League", shortName: "Premier League", country: "EN", emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { slug: "uefa-champions-league", name: "Champions League", shortName: "UCL", country: "EU", emoji: "⭐" },
  { slug: "uefa-europa-league", name: "Europa League", shortName: "UEL", country: "EU", emoji: "🟠" },
  { slug: "uefa-conference-league", name: "Conference League", shortName: "UECL", country: "EU", emoji: "🟢" },
  { slug: "la-liga", name: "La Liga", shortName: "La Liga", country: "ES", emoji: "🇪🇸" },
  { slug: "serie-a", name: "Serie A", shortName: "Serie A", country: "IT", emoji: "🇮🇹" },
  { slug: "bundesliga", name: "Bundesliga", shortName: "Bundesliga", country: "DE", emoji: "🇩🇪" },
  { slug: "ligue-1", name: "Ligue 1", shortName: "Ligue 1", country: "FR", emoji: "🇫🇷" },
  { slug: "eredivisie", name: "Eredivisie", shortName: "Eredivisie", country: "NL", emoji: "🇳🇱" },
  { slug: "primeira-liga", name: "Primeira Liga", shortName: "Primeira Liga", country: "PT", emoji: "🇵🇹" },
  { slug: "belgian-pro-league", name: "Belgian Pro League", shortName: "Belgian Pro", country: "BE", emoji: "🇧🇪" },
  { slug: "scottish-premiership", name: "Scottish Premiership", shortName: "Scottish Prem", country: "SCO", emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { slug: "turkish-super-lig", name: "Turkish Süper Lig", shortName: "Süper Lig", country: "TR", emoji: "🇹🇷" },
  { slug: "major-league-soccer", name: "MLS", shortName: "MLS", country: "US", emoji: "🇺🇸" },
  { slug: "brasileirao", name: "Brasileirao", shortName: "Brasileirao", country: "BR", emoji: "🇧🇷" },
  { slug: "argentine-primera", name: "Argentine Primera", shortName: "Primera", country: "AR", emoji: "🇦🇷" },
  { slug: "liga-mx", name: "Liga MX", shortName: "Liga MX", country: "MX", emoji: "🇲🇽" },
  { slug: "psl", name: "PSL (South Africa)", shortName: "PSL", country: "ZA", emoji: "🇿🇦" },
  { slug: "egyptian-premier-league", name: "Egyptian Premier League", shortName: "Egypt PL", country: "EG", emoji: "🇪🇬" },
  { slug: "caf-champions-league", name: "CAF Champions League", shortName: "CAF CL", country: "CAF", emoji: "🌍" },
  { slug: "caf-confederation-cup", name: "CAF Confederation Cup", shortName: "CAF CC", country: "CAF", emoji: "🌍" },
  { slug: "saudi-pro-league", name: "Saudi Pro League", shortName: "Saudi Pro", country: "SA", emoji: "🇸🇦" },
  { slug: "j1-league", name: "J1 League", shortName: "J1", country: "JP", emoji: "🇯🇵" },
  { slug: "k-league-1", name: "K League 1", shortName: "K League", country: "KR", emoji: "🇰🇷" },
  { slug: "afc-champions-league-elite", name: "AFC Champions League Elite", shortName: "AFC CL", country: "AFC", emoji: "🌏" },
];

export function getLeagueBySlug(slug) {
  return LEAGUES_CATALOG.find((league) => league.slug === slug) || null;
}
