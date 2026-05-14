const STORAGE_KEY = "5s_favorite_leagues_v1";
const REQUIRED_COUNT = 3;

export const FAVORITE_LEAGUE_COUNT = REQUIRED_COUNT;

export function readFavoriteLeagues() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, REQUIRED_COUNT) : [];
  } catch {
    return [];
  }
}

export function writeFavoriteLeagues(slugs) {
  if (typeof window === "undefined") return [];
  const normalized = [...new Set(slugs.filter(Boolean))].slice(0, REQUIRED_COUNT);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function hasCompletedLeagueOnboarding() {
  return readFavoriteLeagues().length >= REQUIRED_COUNT;
}

export function clearFavoriteLeagues() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
