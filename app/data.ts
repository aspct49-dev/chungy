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
  { label: "Kick", href: KICK_URL, blurb: "Watch live streams", action: "Watch" },
  {
    label: "Discord",
    href: "https://discord.gg/bigchungytv",
    blurb: "Join the community",
    action: "Join",
  },
  {
    label: "X",
    href: "https://x.com/bigchungytv",
    blurb: "Drops and announcements",
    action: "Follow",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@bigchungytv",
    blurb: "Highlights and VODs",
    action: "Subscribe",
  },
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
  /** Spins per draw. Each spin pays PRIZE_PER_SPIN to whoever it lands on. */
  spins: 35,
  prizePerSpin: 200,
  /** One player can win at most this many times in a single draw. */
  winCapPerPlayer: 13,
} as const;

/** 35 x $200. The floor, not a fixed figure — see RAFFLE_POOL_NOTE. */
export const RAFFLE_POOL = RAFFLE.spins * RAFFLE.prizePerSpin;

/** Most a single player can take home in one draw: 13 x $200. */
export const RAFFLE_PLAYER_CAP = RAFFLE.winCapPerPlayer * RAFFLE.prizePerSpin;

export const RAFFLE_POOL_NOTE =
  "The pool is bumped above the minimum in months with unusually high wagering.";

/**
 * Chance of winning at least one of the 35 spins, given a ticket share.
 * Complement of losing every spin. Ignores the per-player cap, which only
 * caps winnings, never the chance of a first win.
 */
export function chanceOfAnyWin(tickets: number, totalTickets: number) {
  if (tickets <= 0 || totalTickets <= 0) return 0;
  const perSpin = Math.min(tickets / totalTickets, 1);
  return 1 - Math.pow(1 - perSpin, RAFFLE.spins);
}

/** Expected winnings across the draw, respecting the per-player cap. */
export function expectedWinnings(tickets: number, totalTickets: number) {
  if (tickets <= 0 || totalTickets <= 0) return 0;
  const perSpin = Math.min(tickets / totalTickets, 1);
  const expectedWins = Math.min(perSpin * RAFFLE.spins, RAFFLE.winCapPerPlayer);
  return expectedWins * RAFFLE.prizePerSpin;
}

// --- bonuses ------------------------------------------------

// Modelled on Gamdom's actual rewards programme rather than invented offers.
// The welcome rakeback and the Rewards 2.0 tier ladder are the two things
// worth signing up for, so they get one card each.
export const BONUSES = [
  {
    name: "Gamdom",
    tag: "Welcome offer",
    amount: "15%",
    amountSuffix: "instant rakeback",
    headline: "Paid back on every bet, from your first one",
    detail:
      "Rakeback lands as you play rather than after a hurdle, and it is free of wagering requirements — what you earn is withdrawable.",
    code: CASINO.code,
    url: CASINO.url,
    perks: [
      "No wagering requirement",
      "Credited as you bet, not after",
      "Runs through your first 7 days",
      "Every wager also earns raffle tickets",
    ],
    note: "Apply the code at sign-up, or add it to an existing account.",
  },
  {
    name: "Gamdom",
    tag: "Ongoing rewards",
    amount: "24",
    amountSuffix: "levels, 8 tiers",
    headline: "Rewards 2.0 and the Royalty Club",
    detail:
      "Wagering earns XP, and XP climbs the ladder from Bronze to Opal. Each tier widens what you can claim — the rate improves the longer you play.",
    code: CASINO.code,
    url: CASINO.url,
    perks: [
      "Chat Rain drops scale with your claim level",
      "Free cases and reload bonuses",
      "Rakeback rate climbs with each tier",
      "Account manager at the top tiers",
    ],
    note: "Bronze → Silver → Gold → Sapphire → Ruby → Emerald → Opal.",
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
