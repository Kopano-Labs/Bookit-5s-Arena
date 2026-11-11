import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveMongoConnectOptions } from '../../lib/mongodb.js';

test('resolveMongoConnectOptions defaults to bookit dbName when URI omits database path', () => {
  const opts = resolveMongoConnectOptions(
    'mongodb+srv://user:pass@bookit-5s-arena.reqjuuf.mongodb.net/?appName=bookit-5s-arena',
    {},
  );
  assert.equal(opts.dbName, 'bookit');
  assert.equal(opts.bufferCommands, false);
});

test('resolveMongoConnectOptions preserves explicit URI database path when MONGODB_DB_NAME is unset', () => {
  const opts = resolveMongoConnectOptions(
    'mongodb+srv://user:pass@bookit-5s-arena.reqjuuf.mongodb.net/bookit_staging?appName=bookit-5s-arena',
    {},
  );
  assert.equal(opts.dbName, undefined);
});

test('resolveMongoConnectOptions honors explicit MONGODB_DB_NAME override', () => {
  const opts = resolveMongoConnectOptions(
    'mongodb+srv://user:pass@bookit-5s-arena.reqjuuf.mongodb.net/?appName=bookit-5s-arena',
    { MONGODB_DB_NAME: 'bookit_custom' },
  );
  assert.equal(opts.dbName, 'bookit_custom');
});
