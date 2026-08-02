// ============================================================
// Every value the site needs that isn't code lives here.
//
// PLACEHOLDERS — confirm these before the site goes public:
//   REFERRAL_CODE   invented; replace with the real Gamdom code
//   KICK_CHANNEL    assumed from the brand name
//   RAFFLE.prizes   invented structure
//   socials         guessed handles
// ============================================================

export const BRAND = "BigChungyTV";

export const CASINO = {
  name: "Gamdom",
  code: "CHUNGY",
  url: "https://gamdom.com/r/CHUNGY",
} as const;

export const KICK_CHANNEL = "bigchungytv";
export const KICK_URL = `https://kick.com/${KICK_CHANNEL}`;
export const KICK_EMBED = `https://player.kick.com/${KICK_CHANNEL}`;

export const SOCIALS = [
  { label: "Kick", href: KICK_URL },
  { label: "X", href: "https://x.com/bigchungytv" },
  { label: "Discord", href: "https://discord.gg/bigchungytv" },
  { label: "YouTube", href: "https://youtube.com/@bigchungytv" },
] as const;

export const NAV = [
  { label: "Bonuses", href: "/#bonuses" },
  { label: "Raffle", href: "/raffle" },
  { label: "Stream", href: "/#stream" },
] as const;

// --- raffle -------------------------------------------------

/** Wager required to earn one ticket. The whole mechanic hangs off this. */
export const WAGER_PER_TICKET = 5000;

export const RAFFLE = {
  /** Drawn on the 1st of each month, so the countdown targets month end. */
  period: "month",
  prizes: [
    { place: "1st", amount: 2500 },
    { place: "2nd", amount: 1000 },
    { place: "3rd", amount: 500 },
  ],
} as const;

export const RAFFLE_POOL = RAFFLE.prizes.reduce((sum, p) => sum + p.amount, 0);

// --- bonuses ------------------------------------------------

export const BONUSES = [
  {
    name: "Gamdom",
    tag: "Deposit bonus",
    headline: "Up to $1,000 matched",
    detail:
      "Sign up under code CHUNGY and your first deposit is matched. Instant crypto withdrawals, no KYC on small cashouts.",
    code: CASINO.code,
    url: CASINO.url,
    perks: ["Matched first deposit", "Rakeback on every wager", "Counts toward raffle tickets"],
  },
  {
    name: "Gamdom",
    tag: "Rain + rewards",
    headline: "Daily rain and free cases",
    detail:
      "Playing under the code unlocks the community rain pool, daily free cases, and a rakeback tier that climbs the more you play.",
    code: CASINO.code,
    url: CASINO.url,
    perks: ["Community rain pool", "Daily free cases", "Climbing rakeback tiers"],
  },
] as const;

// --- helpers ------------------------------------------------

export function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function count(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Usernames are masked the way the casino exports them. */
export function maskedName(name: string) {
  const head = name.slice(0, 2);
  return `${head}${"*".repeat(Math.max(name.length - 2, 3))}`;
}

export function ticketsFor(wagered: number) {
  return Math.floor(wagered / WAGER_PER_TICKET);
}

/** Progress toward the next ticket, 0-1. Drives the conversion meter. */
export function ticketProgress(wagered: number) {
  return (wagered % WAGER_PER_TICKET) / WAGER_PER_TICKET;
}
