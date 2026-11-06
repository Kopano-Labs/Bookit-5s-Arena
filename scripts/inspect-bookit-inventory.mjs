#!/usr/bin/env node

// Read-only preflight for the native Bookit database. Does not load dotenv,
// change data, or print credentials, guest records, or raw owner IDs.
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { MongoClient } from 'mongodb';

const variables = ['MONGODB_URI', 'MONGODB_DIRECT_URI', 'MONGODB_URI_DIRECT', 'DATABASE_URL'];
const selected = variables.find(name => process.env[name]);
if (!selected) {
  console.error('No MongoDB URI is configured in the current process. No connection attempted.');
  process.exit(2);
}

const uri = process.env[selected];
const args = process.argv.slice(2);
const discover = args.includes('--discover');
const positional = args.filter(arg => !arg.startsWith('--'));
if (args.some(arg => arg.startsWith('--') && arg !== '--discover') || positional.length > 1) {
  console.error('Usage: node scripts/inspect-bookit-inventory.mjs [--discover] [output.json]');
  process.exit(2);
}
const fingerprint = value => createHash('sha256').update(value).digest('hex').slice(0, 12);
let client;

try {
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000, connectTimeoutMS: 8000 });
  await client.connect();
  const db = client.db();
  const hello = await db.admin().command({ hello: 1 });
  const wantedCollections = ['courts', 'bookings', 'bookingslotclaims'];
  const collections = {};
  for (const name of wantedCollections) {
    const exists = await db.listCollections({ name }, { nameOnly: true }).hasNext();
    collections[name] = exists ? await db.collection(name).estimatedDocumentCount() : null;
  }

  const courts = await db.collection('courts').find({}, {
    projection: { name: 1, image: 1, price_per_hour: 1, availability: 1, owner: 1, sortOrder: 1 },
  }).limit(50).toArray();
  const safeCourts = courts.map(court => ({
    id: String(court._id),
    name: typeof court.name === 'string' ? court.name : null,
    image: typeof court.image === 'string' ? court.image : null,
    pricePerHour: Number.isFinite(court.price_per_hour) ? court.price_per_hour : null,
    availability: typeof court.availability === 'string' ? court.availability : null,
    hasOwner: Boolean(court.owner),
    ownerFingerprint: court.owner ? fingerprint(String(court.owner)) : null,
    sortOrder: Number.isFinite(court.sortOrder) ? court.sortOrder : null,
  }));
  const indexes = collections.courts === null ? [] : (await db.collection('courts').indexes()).map(index => ({
    name: index.name,
    keys: index.key,
    unique: Boolean(index.unique),
    partialFilterExpression: index.partialFilterExpression || null,
  }));
  const bookingIndexes = collections.bookings === null ? [] : (await db.collection('bookings').indexes()).map(index => ({
    name: index.name, keys: index.key, unique: Boolean(index.unique), sparse: Boolean(index.sparse),
    partialFilterExpression: index.partialFilterExpression || null,
  }));
  // Metadata/counts only: never initialize models, create collections, or read
  // another database's customer documents. Discovery is explicitly opt-in.
  let databaseCandidates = null;
  let discoveryState = 'not-requested';
  if (discover) {
    try {
      const result = await db.admin().listDatabases({ nameOnly: true, authorizedDatabases: true });
      const names = result.databases.map(item => item.name).filter(name => !['admin', 'config', 'local'].includes(name));
      databaseCandidates = [];
      for (const name of names.slice(0, 20)) {
        const candidate = client.db(name);
        const collectionNames = (await candidate.listCollections({}, { nameOnly: true }).toArray()).map(item => item.name);
        const counts = {};
        for (const collection of ['courts', 'bookings', 'users']) {
          counts[collection] = collectionNames.includes(collection)
            ? await candidate.collection(collection).estimatedDocumentCount() : null;
        }
        databaseCandidates.push({ database: name, selected: name === db.databaseName, collectionNames, counts });
      }
      discoveryState = names.length > 20 ? 'partial-first-20' : 'complete-for-authorized-databases';
    } catch (error) {
      discoveryState = `unavailable-${error?.name || 'Error'}`;
    }
  }
  const parsed = new URL(uri);
  const target = parsed.hostname || 'unknown-host';
  const report = {
    schemaVersion: 2,
    observedAt: new Date().toISOString(),
    readOnly: true,
    configuredVariable: selected,
    selectedDatabase: db.databaseName,
    uriHasExplicitDatabase: Boolean(parsed.pathname && parsed.pathname !== '/'),
    targetFingerprint: fingerprint(`${target}/${db.databaseName}`),
    replicaSet: hello.setName || null,
    topology: hello.msg === 'isdbgrid' ? 'mongos' : hello.setName ? 'replica-set' : 'standalone',
    collections,
    courts: safeCourts,
    courtIndexes: indexes,
    bookingIndexes,
    discoveryState,
    databaseCandidates,
    caveat: 'This report identifies data reachable through this URI; compare its target fingerprint with the intended deployment configuration before using the records.',
  };
  const outputPath = positional[0];
  if (outputPath) {
    const destination = path.resolve(outputPath);
    await writeFile(destination, `${JSON.stringify(report, null, 2)}\n`, { encoding: 'utf8', mode: 0o600, flag: 'wx' });
    console.log(`Read-only inventory report written to ${destination}`);
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
} catch (error) {
  console.error(`Read-only inventory inspection failed (${error?.name || 'Error'}). No write operation was issued.`);
  process.exitCode = 1;
} finally {
  await client?.close().catch(() => {});
}
