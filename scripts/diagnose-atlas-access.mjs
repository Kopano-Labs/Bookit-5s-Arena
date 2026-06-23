#!/usr/bin/env node

import dns from 'node:dns/promises';
import net from 'node:net';
import https from 'node:https';

function getMongoUri() {
  return (
    process.env.MONGODB_URI ||
    process.env.MONGODB_DIRECT_URI ||
    process.env.MONGODB_URI_DIRECT ||
    process.env.DATABASE_URL ||
    ''
  );
}

function fetchText(url, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => resolve(body.trim()));
    });

    request.on('error', reject);
    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error(`Timed out fetching ${url}`));
    });
  });
}

function testTcp(host, port, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    const startedAt = Date.now();

    const finish = (status, detail) => {
      socket.destroy();
      resolve({
        host,
        port,
        status,
        detail,
        elapsedMs: Date.now() - startedAt,
      });
    };

    socket.on('connect', () => finish('open', 'tcp connect succeeded'));
    socket.on('error', (error) => finish('blocked', error.code || error.message));
    socket.setTimeout(timeoutMs, () => finish('timeout', 'tcp connect timed out'));
  });
}

async function resolveDnsJson(name, type) {
  const payload = await fetchText(
    `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
  );
  return JSON.parse(payload);
}

function parseDnsAnswerData(data) {
  return String(data || '').replace(/\.$/, '').trim();
}

function sanitizeUri(uri) {
  const parsed = new URL(uri);
  return {
    scheme: parsed.protocol.replace(':', ''),
    host: parsed.host,
    database: parsed.pathname.replace(/^\//, '') || '(default)',
    authPresent: Boolean(parsed.username),
    queryKeys: Array.from(parsed.searchParams.keys()).sort(),
  };
}

async function resolveSrvHosts(parsed) {
  if (parsed.protocol !== 'mongodb+srv:') {
    return [{ host: parsed.hostname, port: Number(parsed.port || 27017), source: 'direct-uri' }];
  }

  const srvName = `_mongodb._tcp.${parsed.hostname}`;
  try {
    const records = await dns.resolveSrv(srvName);
    return records
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((record) => ({
        host: record.name,
        port: record.port,
        priority: record.priority,
        weight: record.weight,
        source: `${srvName} via os-dns`,
      }));
  } catch (osDnsError) {
    console.warn(`WARN OS DNS SRV lookup failed: ${osDnsError?.code || osDnsError?.message || osDnsError}`);
    const payload = await resolveDnsJson(srvName, 'SRV');
    const records = Array.isArray(payload?.Answer)
      ? payload.Answer
          .map((answer) => parseDnsAnswerData(answer?.data))
          .map((value) => {
            const [priority, weight, port, ...targetParts] = value.split(/\s+/);
            return {
              priority: Number(priority),
              weight: Number(weight),
              port: Number(port),
              host: targetParts.join(' ').replace(/\.$/, ''),
              source: `${srvName} via dns.google`,
            };
          })
          .filter((record) => record.host && Number.isFinite(record.port))
      : [];

    if (!records.length) {
      throw new Error(`No SRV records found for ${srvName} through OS DNS or dns.google.`);
    }

    return records.sort((left, right) => left.host.localeCompare(right.host));
  }
}

const uri = getMongoUri();
if (!uri) {
  console.error('FAIL MongoDB URI is not configured. Set MONGODB_URI or MONGODB_DIRECT_URI.');
  process.exit(1);
}

const parsed = new URL(uri);
const summary = sanitizeUri(uri);

console.log('MongoDB Atlas access diagnostic');
console.log(JSON.stringify(summary, null, 2));

try {
  const ip = await fetchText('https://api.ipify.org');
  console.log(JSON.stringify({ publicIp: ip }, null, 2));
} catch (error) {
  console.log(JSON.stringify({ publicIp: 'unavailable', error: error?.message || String(error) }, null, 2));
}

let hosts = [];
try {
  hosts = await resolveSrvHosts(parsed);
  console.log(JSON.stringify({ srvHosts: hosts }, null, 2));
} catch (error) {
  console.error(`FAIL SRV/direct host resolution failed: ${error?.message || error}`);
  process.exit(1);
}

const tcpResults = [];
for (const host of hosts) {
  tcpResults.push(await testTcp(host.host, host.port));
}

console.log(JSON.stringify({ tcpResults }, null, 2));

const blocked = tcpResults.filter((result) => result.status !== 'open');
if (blocked.length > 0) {
  console.error('FAIL One or more Atlas hosts are not reachable over TCP.');
  process.exit(1);
}

console.log('PASS Atlas DNS and TCP reachability are available from this machine.');

try {
  const { default: connectDB } = await import('../lib/mongodb.js');
  const mongoose = await connectDB();
  const connection = mongoose.connection || mongoose.connections?.[0];
  console.log(
    JSON.stringify(
      {
        mongoose: 'connected',
        readyState: connection?.readyState,
        dbName: connection?.name || '(unknown)',
        host: connection?.host || '(unknown)',
      },
      null,
      2,
    ),
  );
  console.log('PASS Atlas Mongoose handshake succeeded.');
  process.exit(0);
} catch (error) {
  console.error(
    JSON.stringify(
      {
        mongoose: 'failed',
        name: error?.name || '(unknown)',
        message: error?.message || String(error),
      },
      null,
      2,
    ),
  );
  console.error('FAIL Atlas DNS/TCP is reachable, but the MongoDB handshake failed.');
  console.error('NEXT Check Atlas Network Access allowlist for the public IP above and verify the database user credentials.');
  process.exit(1);
}
