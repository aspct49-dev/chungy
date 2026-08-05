import { ticketsFor } from "../data";

export type Entrant = {
  name: string;
  wagered: number;
  tickets: number;
  /** Share of the ticket pot, 0-1. Honest only because the full list is kept. */
  odds: number;
};

export type RaffleData = {
  entrants: Entrant[];
  totalTickets: number;
  totalWagered: number;
  entrantCount: number;
  /** True when no live source is configured and sample data is showing. */
  placeholder: boolean;
  /** Set when a live source was configured but the fetch failed. */
  error: string | null;
};

const CACHE_TTL_MS = 60_000;
const REQUEST_TIMEOUT_MS = 15_000;
const GAMDOM_ENDPOINT = "https://gamdom.com/api/affiliates/leaderboard";

let cache: { at: number; data: RaffleData } | null = null;

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

/** YYYY-MM-DD for the first of the current UTC month. */
export function monthStartIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
}

/** YYYY-MM for the current UTC month, matching Gamdom's wager_data keys. */
function currentMonthKey() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** First instant of next month, UTC — what the countdown targets. */
export function nextDrawIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString();
}

const SAMPLE: Array<{ name: string; wagered: number }> = [
  { name: "VaultRunner", wagered: 412384.22 },
  { name: "GoldTooth", wagered: 298541.1 },
  { name: "MidnightAce", wagered: 244098.75 },
  { name: "TumblerKing", wagered: 187420.0 },
  { name: "CardShark88", wagered: 154206.9 },
  { name: "BrassKnuckle", wagered: 121889.35 },
  { name: "SilentPartner", wagered: 98454.6 },
  { name: "NightShift", wagered: 76210.42 },
  { name: "ChipStack", wagered: 54008.18 },
  { name: "LuckyStrike", wagered: 39754.99 },
  { name: "HouseEdge", wagered: 31200.5 },
  { name: "ColdDeck", wagered: 24880.13 },
  { name: "PitBoss", wagered: 18400.77 },
  { name: "HighRoller99", wagered: 12050.4 },
  { name: "SmallBlind", wagered: 7320.66 },
  { name: "FreshMeat", wagered: 5120.09 },
];

// A raffle is not a leaderboard: every ticket holder is in the draw, so the
// full list has to be kept. Truncating to a top ten would make the pot size
// and every odds figure on the page wrong.
export function toRaffleData(
  rows: Array<{ name: string; wagered: number }>,
  meta: { placeholder?: boolean; error?: string | null } = {}
): RaffleData {
  const withTickets = rows
    .filter((row) => Number.isFinite(row.wagered) && row.wagered > 0)
    .map((row) => ({ ...row, tickets: ticketsFor(row.wagered) }))
    .filter((row) => row.tickets > 0)
    .sort((a, b) => b.tickets - a.tickets || b.wagered - a.wagered);

  const totalTickets = withTickets.reduce((sum, row) => sum + row.tickets, 0);
  const totalWagered = withTickets.reduce((sum, row) => sum + row.wagered, 0);

  return {
    entrants: withTickets.map((row) => ({
      ...row,
      odds: totalTickets > 0 ? row.tickets / totalTickets : 0,
    })),
    totalTickets,
    totalWagered,
    entrantCount: withTickets.length,
    placeholder: meta.placeholder ?? false,
    error: meta.error ?? null,
  };
}

type GamdomEntry = {
  user_id?: number;
  username?: string;
  wager_data?: Array<{ month?: string; total_wager_usd?: number | string }>;
};

/**
 * Flattens Gamdom's response into name/wagered rows for the current month.
 *
 * The API groups each affiliate's wagers by month, so a single user can carry
 * several buckets even with `after` set — the filter is what keeps a player's
 * previous months out of this month's ticket count.
 *
 * Players who hide themselves come back as user_id -1 / "Hidden User", and
 * there can be many of them. They still wagered, so their tickets belong in
 * the pot; collapsing them into one row would understate the total and inflate
 * everyone else's odds. Each is kept as a distinct entrant.
 */
export function parseGamdom(payload: unknown, monthKey = currentMonthKey()) {
  const data = (payload as { data?: unknown })?.data;
  if (!Array.isArray(data)) return [];

  let hidden = 0;
  return data
    .map((raw) => {
      const entry = raw as GamdomEntry;
      const wagered = (entry.wager_data ?? [])
        .filter((bucket) => !bucket.month || bucket.month === monthKey)
        .reduce((sum, bucket) => sum + (Number(bucket.total_wager_usd) || 0), 0);

      const isHidden = entry.user_id === -1 || entry.username === "Hidden User";
      const name = isHidden ? `Hidden User ${++hidden}` : (entry.username ?? "player");

      return { name, wagered };
    })
    .filter((row) => row.wagered > 0);
}

async function fetchGamdom(apiKey: string): Promise<RaffleData> {
  const url = new URL(GAMDOM_ENDPOINT);
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("after", monthStartIso());

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Gamdom API returned ${response.status}`);

    const payload = await response.json();
    if (payload?.success === false) {
      throw new Error(payload.message || "Gamdom API reported failure");
    }
    return toRaffleData(parseGamdom(payload));
  } finally {
    clearTimeout(timeout);
  }
}

/** Published CSV with username,wagered columns — a manual fallback source. */
function parseCsv(text: string): Array<{ name: string; wagered: number }> {
  return text
    .split(/\r?\n/)
    .map((line) => line.split(","))
    .filter((cols) => cols.length >= 2)
    .map((cols) => ({
      name: cols[0].trim().replace(/^"|"$/g, ""),
      wagered: Number(cols[1].replace(/[^0-9.]/g, "")),
    }))
    .filter((row) => row.name && row.name.toLowerCase() !== "username");
}

async function load(): Promise<RaffleData> {
  const apiKey = env("GAMDOM_API_KEY");
  if (apiKey) return fetchGamdom(apiKey);

  const csvUrl = env("GAMDOM_CSV_URL");
  if (csvUrl) {
    const response = await fetch(csvUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Gamdom CSV ${response.status}`);
    return toRaffleData(parseCsv(await response.text()));
  }

  return toRaffleData(SAMPLE, { placeholder: true });
}

export async function getRaffleData(): Promise<RaffleData> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
  try {
    const data = await load();
    cache = { at: Date.now(), data };
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("raffle fetch failed:", message);
    // Serve stale rather than an empty page; an outage should degrade, not break.
    if (cache) return { ...cache.data, error: message };
    return toRaffleData(SAMPLE, { placeholder: true, error: message });
  }
}
