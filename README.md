# BigChungyTV

Gamdom affiliate site — monthly raffle, bonuses, and Kick stream.

Next.js 16 (App Router) + React 19. No CSS framework beyond a Tailwind reset;
the visual system lives in `app/globals.css`.

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
```

```bash
npm run build
npx next start -p 3000 -H 0.0.0.0    # production build, reachable on the LAN
```

Turbopack's CSS hot reload has dropped edits during development. If a change to
`globals.css` appears to do nothing, restart the server rather than trusting HMR.

## Placeholders to replace before launch

All of these live in **`app/data.ts`**, flagged at the top of the file.

| Value | Current | Notes |
| --- | --- | --- |
| `CASINO.code` | `CHUNGY` | Invented. Also appears in `CASINO.url`. |
| `KICK_CHANNEL` | `bigchungytv` | Assumed from the brand name. `kick.com/api/v2/channels/bigchungytv` returns 403, so the stream embed renders blank until this is confirmed. |
| `RAFFLE.prizes` | 2500 / 1000 / 500 | Invented split. `RAFFLE_POOL` is derived, so the headline updates automatically. |
| `SOCIALS` | guessed handles | X, Discord, YouTube URLs are not verified. |
| `BONUSES` | placeholder copy | Offer amounts and terms are invented. |

## Raffle data

`app/lib/raffle.ts` reads from whichever source is configured, in order:

1. `GAMDOM_CSV_URL` — a published CSV with `username,wagered` columns
   (a Google Sheet "publish to web" link works).
2. `GAMDOM_API_URL`, optionally with `GAMDOM_API_KEY` as a bearer token. The
   current month's start/end are appended as `startDate` / `endDate` unless the
   URL already sets them.
3. Neither set — sample entrants render and the page shows a placeholder notice.

Put these in `.env.local` (gitignored). Results cache for 60s and serve stale on
a fetch failure, so an outage degrades rather than blanking the page.

Tickets are `floor(wagered / WAGER_PER_TICKET)`. The **full** entrant list is
kept rather than truncated to a top ten — a raffle needs every ticket holder to
compute an honest pot size and odds percentage.

## Assets

`public/` holds the generated art. `vault-backdrop.png` is load-bearing: the
hero's animated seam is an SVG arc fitted to that render's own gold pixels
(centre `1298,467`, radius `441` in its native `1672x941` space). Replacing the
image means re-fitting `SEAM_PATH` and `--seam-length` in `app/components/hero.tsx`
and `app/globals.css`.

## Motion

The intro sequence runs once per session (`sessionStorage`), then every reload
lands on the resting state so the CTA is immediately reachable. Clear
`sessionStorage` or open a new tab to replay it. Ambient loops — ember field,
wordmark sheen, idle float, vault halo — run continuously and are all disabled
under `prefers-reduced-motion`.
