import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [
  home,
  tournamentPage,
  tournamentApi,
  manifestRaw,
  serviceWorker,
  locality,
  organismFeed,
  newsPage,
] = await Promise.all([
  read('app/page.jsx'),
  read('app/tournament/page.jsx'),
  read('app/api/tournament/route.js'),
  read('public/manifest.json'),
  read('public/sw.js'),
  read('lib/organism/southAfrica.ts'),
  read('app/api/organism/feed/route.ts'),
  read('app/news/page.tsx'),
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

assert.match(tournamentPage, /has concluded|Archived · concluded/i);
assert.doesNotMatch(tournamentPage, /Register Your Team/i);
assert.doesNotMatch(tournamentPage, /Proof of Payment/i);
assert.match(tournamentApi, /status:\s*410/);
assert.match(tournamentApi, /getTournamentLifecycle/);

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

for (const protectedPrefix of [
  '/api/auth/',
  '/api/bookings/',
  '/api/payments/',
  '/api/admin/',
]) {
  assert.match(serviceWorker, new RegExp(protectedPrefix.replaceAll('/', '\\/')));
}
assert.match(serviceWorker, /\/api\/organism\//);
assert.match(serviceWorker, /\/api\/weather\//);
assert.match(serviceWorker, /truthState:\s*'unavailable'/);

assert.match(organismFeed, /https:\/\/blog\.fivesarena\.com/);
assert.match(organismFeed, /https:\/\/news\.fivesarena\.com/);
assert.match(organismFeed, /getLeagueNews\('psl'/);
assert.match(organismFeed, /render-inside-fivesarena-shell/);
assert.match(newsPage, /LivingOrganismSurface/);

console.log('Living organism proof: PASS');
