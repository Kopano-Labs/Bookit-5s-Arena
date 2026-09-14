import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [home, footer, bookingFallback] = await Promise.all([
  read('app/page.jsx'),
  read('components/TruthFooter.jsx'),
  read('components/home/CourtAvailabilityNotice.jsx'),
]);

const publicSurface = `${home}\n${footer}\n${bookingFallback}`;

for (const forbidden of [
  /<TournamentArchiveSection\s*\/>/,
  /Kopano-Phu ecosystem/i,
  /wider public graph/i,
  /Booking truth gate/i,
  /temporarily unverified/i,
  /LINKED records a configured relationship/i,
  /runtime-health claim/i,
  /historical evidence instead of presenting expired actions as live/i,
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

console.log('Public surface validation audience gate: PASS');
