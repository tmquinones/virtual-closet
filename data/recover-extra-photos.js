#!/usr/bin/env node
// recover-extra-photos.js
// Reads extra-photos-recovery.json (built from the May 11 backup) and
// patches each matched live item with its extra angle photos via the API.
//
// Usage (PowerShell, from project root):
//   node recover-extra-photos.js
//
// You'll be prompted for your TMF Closet email + password.

'use strict';

const fs   = require('fs');
const path = require('path');
const readline = require('readline');

const API_BASE     = 'https://api.tmfcloset.com';
const RECOVERY_FILE = path.join(__dirname, 'extra-photos-recovery.json');

// ── helpers ────────────────────────────────────────────────────────────────

function ask(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(prompt, ans => { rl.close(); resolve(ans.trim()); }));
}

async function askHidden(prompt) {
  // Node has no built-in hidden input; fall back to visible with a note
  process.stdout.write(prompt + ' (input visible) ');
  return ask('');
}

async function apiFetch(token, path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${opts.method || 'GET'} ${path} → ${res.status}: ${text.slice(0, 200)}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// Build a match key: name|garmentType|purchaseDate|brand (lowercased, trimmed)
function matchKey(item, withDate = true) {
  const parts = [
    (item.name        || item.name        || '').toLowerCase().trim(),
    (item.garmentType || item.garment_type || '').toLowerCase().trim(),
    withDate ? (item.purchaseDate || item.purchase_date || '').toLowerCase().trim() : '',
    (item.brand       || '').toLowerCase().trim(),
  ];
  return parts.join('|');
}

// ── main ───────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(RECOVERY_FILE)) {
    console.error('ERROR: extra-photos-recovery.json not found next to this script.');
    console.error('Expected:', RECOVERY_FILE);
    process.exit(1);
  }

  const recovery = JSON.parse(fs.readFileSync(RECOVERY_FILE, 'utf8'));
  console.log(`Recovery file loaded: ${recovery.length} items with extra photos.\n`);

  const email    = await ask('TMF Closet email: ');
  const password = await askHidden('Password:');

  console.log('\nLogging in…');
  let loginRes;
  try {
    const res = await fetch(API_BASE + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Login failed (${res.status}): ${t.slice(0, 200)}`);
    }
    loginRes = await res.json();
  } catch (err) {
    console.error('Login error:', err.message);
    process.exit(1);
  }
  const token = loginRes.accessToken || loginRes.token;
  if (!token) { console.error('No access token in login response:', loginRes); process.exit(1); }
  console.log('Logged in.\n');

  console.log('Fetching live items…');
  const liveItems = await apiFetch(token, '/api/items');
  console.log(`Found ${liveItems.length} live items.\n`);

  // Build lookup maps: try 4-field key first, then 3-field (no date), then 2-field (name+type only)
  const byFull    = new Map();
  const byNoDate  = new Map();
  const byNameType = new Map();

  for (const it of liveItems) {
    const k4 = matchKey(it, true);
    const k3 = matchKey(it, false);
    const k2 = [(it.name || '').toLowerCase().trim(), (it.garment_type || '').toLowerCase().trim()].join('|');

    if (!byFull.has(k4))    byFull.set(k4,    []);
    if (!byNoDate.has(k3))  byNoDate.set(k3,  []);
    if (!byNameType.has(k2)) byNameType.set(k2, []);

    byFull.get(k4).push(it);
    byNoDate.get(k3).push(it);
    byNameType.get(k2).push(it);
  }

  let patched = 0, skipped = 0, failed = 0;
  const skippedItems = [];

  for (let i = 0; i < recovery.length; i++) {
    const rec = recovery[i];
    const label = `[${i + 1}/${recovery.length}] "${rec.name}"`;

    // Try progressively looser matches
    const k4  = matchKey(rec, true);
    const k3  = matchKey(rec, false);
    const k2  = [(rec.name || '').toLowerCase().trim(), (rec.garmentType || '').toLowerCase().trim()].join('|');

    let candidates = byFull.get(k4) || [];
    let matchLevel = '4-field';
    if (candidates.length !== 1) {
      candidates = byNoDate.get(k3) || [];
      matchLevel = '3-field (no date)';
    }
    if (candidates.length !== 1) {
      candidates = byNameType.get(k2) || [];
      matchLevel = '2-field (name+type)';
    }

    if (candidates.length === 0) {
      console.log(`  SKIP  ${label} — no live match found`);
      skipped++;
      skippedItems.push({ name: rec.name, reason: 'no match' });
      continue;
    }
    if (candidates.length > 1) {
      console.log(`  SKIP  ${label} — ${candidates.length} ambiguous matches (${matchLevel})`);
      skipped++;
      skippedItems.push({ name: rec.name, reason: `${candidates.length} ambiguous matches` });
      continue;
    }

    const live = candidates[0];

    // Skip if the live item already has extra_photos to avoid overwriting manual additions
    if (live.extra_photos && live.extra_photos !== '[]' && live.extra_photos !== 'null') {
      console.log(`  SKIP  ${label} — already has extra_photos, skipping to avoid overwrite`);
      skipped++;
      skippedItems.push({ name: rec.name, reason: 'already has extra_photos' });
      continue;
    }

    // Patch with extra photos
    try {
      await apiFetch(token, '/api/items/' + live.id, {
        method: 'PUT',
        body: { extra_photos_data: rec.photos },
      });
      console.log(`  OK    ${label} → id ${live.id} (${rec.photos.length} extra photo(s), matched by ${matchLevel})`);
      patched++;
    } catch (err) {
      console.log(`  FAIL  ${label} → ${err.message}`);
      failed++;
    }

    // Brief pause between requests to not hammer the API
    await new Promise(r => setTimeout(r, 150));
  }

  console.log('\n─────────────────────────────');
  console.log(`Done. Patched: ${patched}  Skipped: ${skipped}  Failed: ${failed}`);
  if (skippedItems.length > 0) {
    console.log('\nSkipped items:');
    skippedItems.forEach(s => console.log(`  - "${s.name}": ${s.reason}`));
  }
}

main().catch(err => { console.error(err); process.exit(1); });
