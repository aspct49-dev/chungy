import { ticketsFor } from "../data";

export type Entrant = {
  name: string;
  wagered: number;
  tickets: number;
  /** Share of the pot, 0-1. Only meaningful because the full list is kept. */
  odds: number;
};

export type RaffleData = {
  entrants: Entrant[];
  totalTickets: number;
  totalWagered: number;
  entrantCount: number;
  /** True when no live source is configured and dummy data is showing. */
  placeholder: boolean;
};

const CACHE_TTL_MS = 60_000;
let cache: { at: number; data: RaffleData } | null = null;

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function monthRange() {
  const now = new Date();
  return {
    start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString(),
    end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString(),
  };
}

const DUMMY: Array<{ name: string; wagered: number }> = [
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
// and every odds figure on the page a lie.
function toEntrants(rows: Array<{ name: string; wagered: number }>): RaffleData {
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
    placeholder: false,
  };
}

/** Parses a published CSV (e.g. a Google Sheet) with username,wagered columns. */
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
  const csvUrl = env("GAMDOM_CSV_URL");
  const apiUrl = env("GAMDOM_API_URL");

  if (csvUrl) {
    const response = await fetch(csvUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Gamdom CSV ${response.status}`);
    return toEntrants(parseCsv(await response.text()));
  }

  if (apiUrl) {
    const { start, end } = monthRange();
    const url = new URL(apiUrl);
    if (!url.searchParams.has("startDate")) url.searchParams.set("startDate", start);
    if (!url.searchParams.has("endDate")) url.searchParams.set("endDate", end);

    const headers: Record<string, string> = { accept: "application/json" };
    const token = env("GAMDOM_API_KEY");
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, { headers, cache: "no-store" });
    if (!response.ok) throw new Error(`Gamdom API ${response.status}`);

    const payload: unknown = await response.json();
    const list = Array.isArray(payload)
      ? payload
      : ((payload as { data?: unknown[] })?.data ??
        (payload as { results?: unknown[] })?.results ??
        []);
    if (!Array.isArray(list)) return toEntrants([]);

    return toEntrants(
      list.map((entry) => {
        const item = entry as { username?: string; name?: string; wagered?: number | string };
        return {
          name: item.username ?? item.name ?? "player",
          wagered: Number(item.wagered ?? 0),
        };
      })
    );
  }

  return { ...toEntrants(DUMMY), placeholder: true };
}

export async function getRaffleData(): Promise<RaffleData> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.data;
  try {
    const data = await load();
    cache = { at: Date.now(), data };
    return data;
  } catch (error) {
    console.error("raffle fetch failed:", error);
    // Serve stale rather than an empty page; an outage should degrade, not break.
    return cache?.data ?? { ...toEntrants(DUMMY), placeholder: true };
  }
}

/** Milliseconds until the draw (first instant of next month, UTC). */
export function nextDrawIso() {
  return monthRange().end;
}
