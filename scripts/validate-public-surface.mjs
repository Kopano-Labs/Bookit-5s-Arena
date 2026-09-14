import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [
  home,
  footer,
  bookingFallback,
  livingArena,
  login,
  searchModal,
  fixturesHub,
  heroSection,
  heroScene,
] = await Promise.all([
  read('app/page.jsx'),
  read('components/TruthFooter.jsx'),
  read('components/home/CourtAvailabilityNotice.jsx'),
  read('components/home/LivingOrganismSurface.tsx'),
  read('app/login/page.jsx'),
  read('components/SearchModal.jsx'),
  read('components/fixtures/FootballFixturesHub.jsx'),
  read('components/home/HeroSection.jsx'),
  read('components/home/Hero3DScene.jsx'),
]);

const publicSurface = `${home}\n${footer}\n${bookingFallback}\n${livingArena}\n${login}\n${searchModal}\n${fixturesHub}\n${heroSection}`;

for (const forbidden of [
  /<TournamentArchiveSection\s*\/>/,
  /Kopano-Phu ecosystem/i,
  /wider public graph/i,
  /Booking truth gate/i,
  /temporarily unverified/i,
  /LINKED records a configured relationship/i,
  /runtime-health claim/i,
  /historical evidence instead of presenting expired actions as live/i,
  /\.NET boundary (contract|ready|degraded)/i,
  /Local editorial membrane/i,
  /full governed feed/i,
  /without forcing WebGL/i,
  /Sign in to the arena, not an expired campaign/i,
  /Register for Tournament/i,
  /Live Hub Active/i,
  /Active Match Window/i,
]) {
  assert.doesNotMatch(
    publicSurface,
    forbidden,
    `public customer surface leaked internal governance or unverified archive framing: ${forbidden}`,
  );
}

assert.match(home, /<CourtAvailabilityNotice\s*\/>/);
assert.match(bookingFallback, /Book a court/i);
assert.match(bookingFallback, /WhatsApp 5s Arena/i);
assert.match(bookingFallback, /tel:\+27637820245/);
assert.match(footer, /Book courts, arrange matches/);
assert.doesNotMatch(footer, /World Cup 2026 Archive/i);
assert.match(livingArena, /South Africa pulse/i);
assert.match(livingArena, /football pulse/i);
assert.match(livingArena, /data-testid="kpgs-adapter-state"/);
assert.match(login, /Sign in to 5s Arena/i);
assert.match(login, /Account access/i);
assert.match(searchModal, /World Cup 2026 Archive/i);
assert.match(fixturesHub, /Window Empty/i);
assert.match(fixturesHub, /Match Window/i);
assert.match(heroSection, /HERO_BACKDROPS/);
assert.match(heroSection, /useTheme/);
assert.match(heroScene, /SCENE_PALETTES/);
assert.match(heroScene, /useRenderProfile/);
assert.match(heroScene, /powerPreference/);

console.log('Public surface validation audience gate: PASS');
