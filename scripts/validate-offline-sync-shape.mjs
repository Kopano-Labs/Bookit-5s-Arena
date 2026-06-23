#!/usr/bin/env node

process.env.BOOKIT_SYNC_ALLOW_STORE_UNAVAILABLE = 'true';

await import('./validate-offline-sync-contract.mjs');
