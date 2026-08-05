#!/usr/bin/env node
// Verifies the Gamdom leaderboard API end to end: real request, real key,
// real parse. Run it after setting GAMDOM_API_KEY in .env.
//
//   npm run check:gamdom
//
// If it fails with a certificate error, your machine is intercepting TLS
// (corporate proxy or VPN). Try `node --use-system-ca`, or run it from a
// network without interception — the deployed site is unaffected.

import { readFileSync } from "node:fs";

function loadEnv() {
  try {
    for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
    }
  } catch {
    /* no .env is fine if the var is already exported */
  }
}

loadEnv();

const key = process.env.GAMDOM_API_KEY;
if (!key) {
  console.error("GAMDOM_API_KEY is not set. Put it in .env as:\n\n  GAMDOM_API_KEY=<your key>\n");
  process.exit(1);
}

if (!/^[0-9a-f-]{30,}$/i.test(key)) {
  console.error(
    `GAMDOM_API_KEY does not look like a Gamdom key (expected a UUID).\n` +
      `Got ${key.length} chars starting "${key.slice(0, 8)}".\n` +
      `The create-api-key endpoint returns JSON — copy only the "key" value.`
  );
  process.exit(1);
}

const now = new Date();
const after = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  .toISOString()
  .slice(0, 10);
const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

const url = new URL("https://gamdom.com/api/affiliates/leaderboard");
url.searchParams.set("apikey", key);
url.searchParams.set("after", after);

console.log(`Requesting affiliates since ${after}...\n`);

let payload;
try {
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    console.error(`FAILED: HTTP ${response.status}`);
    console.error((await response.text()).slice(0, 400));
    process.exit(1);
  }
  payload = await response.json();
} catch (error) {
  console.error(`FAILED: ${error.message}`);
  if (error.cause) console.error(`  cause: ${error.cause.message}`);
  process.exit(1);
}

if (payload?.success === false) {
  console.error(`FAILED: ${payload.message ?? "API reported success:false"}`);
  console.error("Wager leaderboard access is enabled per-affiliate — ask a Gamdom");
  console.error("marketing manager to confirm it is switched on for your account.");
  process.exit(1);
}

const rows = Array.isArray(payload?.data) ? payload.data : [];
console.log(`success:       ${payload?.success}`);
console.log(`affiliates:    ${rows.length}`);

if (rows.length === 0) {
  console.log("\nNo affiliates returned. Either nobody has wagered this month, or the");
  console.log("wager leaderboard is not enabled for this account.");
  process.exit(0);
}

const WAGER_PER_TICKET = 5000;
let totalWagered = 0;
let totalTickets = 0;
let hidden = 0;
let thisMonth = 0;

for (const entry of rows) {
  const buckets = entry.wager_data ?? [];
  const wagered = buckets
    .filter((b) => !b.month || b.month === monthKey)
    .reduce((sum, b) => sum + (Number(b.total_wager_usd) || 0), 0);
  if (wagered > 0) thisMonth += 1;
  if (entry.user_id === -1 || entry.username === "Hidden User") hidden += 1;
  totalWagered += wagered;
  totalTickets += Math.floor(wagered / WAGER_PER_TICKET);
}

const money = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

console.log(`with wagers:   ${thisMonth} (month ${monthKey})`);
console.log(`hidden users:  ${hidden}`);
console.log(`total wagered: ${money(totalWagered)}`);
console.log(`tickets:       ${totalTickets}  (1 per ${money(WAGER_PER_TICKET)})`);

const sample = rows[0];
console.log(`\nfirst row shape: ${JSON.stringify(sample).slice(0, 240)}`);

if (!("wager_data" in (sample ?? {}))) {
  console.error("\nWARNING: no wager_data field. The response shape has changed;");
  console.error("app/lib/raffle.ts parseGamdom() needs updating.");
  process.exit(1);
}

console.log("\nShape matches parseGamdom(). The site will read live figures.");
