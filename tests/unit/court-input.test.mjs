import assert from 'node:assert/strict';
import test from 'node:test';

import { parseCourtCreatePayload } from '../../lib/courtInput.js';

test('Add Court form payload uses the canonical snake-case hourly price and court fields', () => {
  const parsed = parseCourtCreatePayload({
    name: '  Hellenic Court 1  ',
    description: 'Indoor five-a-side court',
    address: 'Milnerton',
    capacity: 10,
    amenities: ['Floodlights', 'Parking'],
    availability: '',
    image: '',
    price_per_hour: 400,
  });

  assert.equal(parsed.error, undefined);
  assert.deepEqual(parsed.value, {
    name: 'Hellenic Court 1',
    description: 'Indoor five-a-side court',
    address: 'Milnerton',
    location: {},
    capacity: 10,
    amenities: 'Floodlights, Parking',
    availability: '10:00 AM - 10:00 PM',
    price_per_hour: 400,
    image: 'court-default.jpg',
    sortOrder: 99,
  });
});

test('Add Court keeps the previous camel-case hourly-price alias and rejects invalid prices', () => {
  assert.equal(parseCourtCreatePayload({ name: 'Court', pricePerHour: '400' }).value.price_per_hour, 400);
  assert.equal(parseCourtCreatePayload({ name: 'Court', price_per_hour: 0 }).error, 'Enter a court name and a positive hourly price');
  assert.equal(parseCourtCreatePayload({ name: ' ', price_per_hour: 400 }).error, 'Enter a court name and a positive hourly price');
});
