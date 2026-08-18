import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [
  home,
  about,
  tournamentPage,
  tournamentApi,
  tournamentConfig,
  manifestRaw,
  serviceWorker,
  locality,
  organismFeed,
  organismSurface,
  domainAdapterClient,
  newsPage,
  nextConfig,
  mobileSpec,
  mobileConfig,
] = await Promise.all([
  read('app/page.jsx'),
  read('app/about/page.jsx'),
  read('app/tournament/page.jsx'),
  read('app/api/tournament/route.js'),
  read('lib/tournamentConfig.js'),
  read('public/manifest.json'),
  read('public/sw.js'),
  read('lib/organism/southAfrica.ts'),
  read('app/api/organism/feed/route.ts'),
  read('components/home/LivingOrganismSurface.tsx'),
  read('lib/kpgs/domainAdapterClient.ts'),
  read('app/news/page.tsx'),
  read('next.config.ts'),
  read('tests/e2e/living-organism-mobile.spec.ts'),
  read('playwright.organism.config.ts'),
]);

const manifest = JSON.parse(manifestRaw);

assert.equal(manifest.name, "Five's Arena");
assert.ok(!/World Cup/i.test(manifest.description));
assert.ok(manifest.shortcuts.some((shortcut) => shortcut.url === '/news'));
assert.ok(manifest.shortcuts.some((shortcut) => shortcut.url === '/tournament'));

assert.match(home, /LivingOrganismSurface/);
assert.match(home, /TournamentArchiveSection/);
assert.doesNotMatch(home, /<TournamentSection\s*\/>/);
assert.doesNotMatch(home, /<TournamentShowcase\s*\/>/);
assert.doesNotMatch(about, /Join Tournament/);
assert.match(about, /World Cup Archive/);
assert.match(about, /South Africa Pulse/);

assert.match(tournamentPage, /has concluded|Archived · concluded/i);
assert.doesNotMatch(tournamentPage, /Register Your Team/i);
assert.doesNotMatch(tournamentPage, /Proof of Payment/i);
assert.match(tournamentApi, /status:\s*410/);
assert.match(tournamentApi, /getTournamentLifecycle/);
assert.match(tournamentConfig, /startISO:\s*["']2026-05-29T00:00:00\+02:00["']/);
assert.match(tournamentConfig, /endISO:\s*["']2026-05-31T23:59:59\+02:00["']/);
assert.match(tournamentConfig, /Friday 29 May – Sunday 31 May 2026/);

for (const province of [
  'western-cape',
  'eastern-cape',
  'northern-cape',
  'free-state',
  'kwazulu-natal',
  'north-west',
  'gauteng',
  'mpumalanga',
  'limpopo',
]) {
  assert.match(locality, new RegExp(`slug: ['\"]${province}['\"]`));
}
assert.match(locality, /LOCALITY_STORAGE_KEY/);
assert.match(locality, /getNearestProvince/);

for (const protectedPrefix of [
  '/api/auth/',
  '/api/bookings/',
  '/api/payments/',
  '/api/admin/',
  '/api/account/',
  '/api/profile/',
]) {
  assert.match(serviceWorker, new RegExp(protectedPrefix.replaceAll('/', '\\/')));
}
assert.match(serviceWorker, /\/api\/organism\//);
assert.match(serviceWorker, /\/api\/weather\//);
assert.match(serviceWorker, /truthState:\s*'unavailable'/);
assert.match(serviceWorker, /request\.headers\.has\('Authorization'\)/);

assert.match(organismFeed, /https:\/\/blog\.fivesarena\.com/);
assert.match(organismFeed, /https:\/\/news\.fivesarena\.com/);
assert.match(organismFeed, /getLeagueNews\('psl'/);
assert.match(organismFeed, /render-inside-fivesarena-shell/);
assert.match(organismFeed, /getKpgsDomainAdapterState/);
assert.match(organismFeed, /canonical-dotnet-boundary-ready/);
assert.match(organismFeed, /canonical-adapter-not-promoted/);

assert.match(domainAdapterClient, /KPGS_DOMAIN_ADAPTER_ORIGIN/);
assert.match(domainAdapterClient, /readJson\('\/kpgs\/health'\)/);
assert.match(domainAdapterClient, /readJson\('\/kpgs\/version'\)/);
assert.match(domainAdapterClient, /status:\s*'contract-only'/);

assert.match(organismSurface, /data-testid="living-organism"/);
assert.match(organismSurface, /data-testid="kpgs-adapter-state"/);
assert.match(organismSurface, /data-province-selector/);
assert.match(organismSurface, /Use my location/);
assert.match(newsPage, /LivingOrganismSurface/);

assert.match(nextConfig, /geolocation=\(self\)/);
assert.doesNotMatch(nextConfig, /geolocation=\(\)/);
assert.match(nextConfig, /news\.fivesarena\.com/);
assert.match(nextConfig, /blog\.fivesarena\.com/);
assert.match(nextConfig, /destination:\s*["']\/news\?organ=news["']/);
assert.match(nextConfig, /destination:\s*["']\/news\?organ=blog["']/);

for (const width of [360, 390, 430]) {
  assert.match(mobileConfig, new RegExp(`width:\s*${width}`));
}
assert.match(mobileConfig, /hasTouch:\s*true/);
assert.match(mobileConfig, /isMobile:\s*true/);
assert.match(mobileConfig, /locale:\s*'en-ZA'/);
assert.match(mobileConfig, /timezoneId:\s*'Africa\/Johannesburg'/);
assert.match(mobileSpec, /height\)\.toBeGreaterThanOrEqual\(44\)/);
assert.match(mobileSpec, /reducedMotion:\s*'reduce'/);
assert.match(mobileSpec, /data-experience-tier/);
assert.match(mobileSpec, /static/);
assert.match(mobileSpec, /Register Your Team/);

console.log('Living organism proof: PASS');
