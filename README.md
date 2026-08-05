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
| `BONUSES` | placeholder copy | Offer amounts and terms are invented. |

Everything else is confirmed and verified live.

`CASINO.url` is `https://gamdom.com/r/chungy` — **lowercase, as issued**. Both
casings return 200, but they resolve to different affiliate params
(`?aff=chungy` vs `?aff=CHUNGY`), so this is not cosmetic if Gamdom's
attribution is case-sensitive. The displayed `CASINO.code` stays uppercase
purely as type treatment; don't "tidy" the URL to match it.

The Discord entry is an invite code, not a vanity URL. Discord serves an
HTML page with a 200 for dead invites, so status codes prove nothing —
check with `https://discord.com/api/v10/invites/<code>`, which returns guild
JSON for a live invite and `Unknown Invite` for a dead one.

### Known broken: the Kick stream embed

The channel is real and live — `kick.com/api/v2/channels/bigchungytv` returns
`id: 31289`, `is_banned: false`, with a working playback URL. The **embed** is
the problem: the browser reports

```
Refused to display 'https://player.kick.com/' in a frame
because it set 'X-Frame-Options' to 'sameorigin'
```

Note the URL in that error is the player **root**, not the channel path. Fetched
directly, `player.kick.com/bigchungytv` returns 200 with no such header and no
redirect — the bounce to root happens client-side, inside the iframe. Verified
blocked on the deployed domain as well as localhost, so it is not an origin
allowlist issue with `localhost`.

`curl` cannot reproduce this. Any fix has to be checked in a real browser
against the deployed site.

## Raffle mechanics

Confirmed rules, encoded in `app/data.ts`:

- **1 ticket per $5,000 wagered** (`WAGER_PER_TICKET`) under the code.
- The wheel is spun **35 times** per monthly draw (`RAFFLE.spins`), each spin
  paying **$200** (`RAFFLE.prizePerSpin`) — a **$7,000** pool.
- A player can win **more than once**, capped at **13 wins / $2,600**
  (`RAFFLE.winCapPerPlayer`, `RAFFLE_PLAYER_CAP`).
- Wagering is **unweighted** — every game and every dollar counts the same.
- $7,000 is the **floor**, not a fixed figure. The pool is raised in months with
  unusually high wagering, which is why the site says "$7,000+".

Rules are subject to change if Gamdom changes the programme.

`chanceOfAnyWin()` and `expectedWinnings()` in `app/data.ts` derive a player's
odds across all 35 spins from their ticket share. The first is the complement of
losing every spin; the second respects the per-player cap.

## Raffle data

`app/lib/raffle.ts` reads from whichever source is configured, in order:

1. **`GAMDOM_API_KEY`** — the live affiliate feed. Calls
   `GET https://gamdom.com/api/affiliates/leaderboard?apikey=…&after=<1st of month>`.
2. `GAMDOM_CSV_URL` — a published CSV with `username,wagered` columns, as a
   manual fallback (a Google Sheet "publish to web" link works).
3. Neither set — sample entrants render and the page shows a notice.

Put these in `.env` (gitignored). Results cache for 60s and serve stale on a
fetch failure, so an outage degrades rather than blanking the page.

### Getting an API key

Log in to Gamdom with the affiliate account, then visit
`https://gamdom.com/api/create-api-key`. It returns
`{"success":true,"data":{"key":"…"}}` — **copy only the `key` value** into
`.env` as `GAMDOM_API_KEY=`. You can only generate a key once; losing it needs a
manual revoke by Gamdom support. Revoke your own with
`https://gamdom.com/api/revoke-api-key?apikey=…`.

The wager leaderboard is enabled **per affiliate**. A key alone is not enough —
a Gamdom marketing manager has to switch the leaderboard on for the account.

### Verifying it

```bash
npm run check:gamdom
```

Makes a real request with the configured key and reports affiliate count, total
wagered, ticket count, and whether the response shape still matches
`parseGamdom()`.

Known snag: on a machine that intercepts TLS (corporate proxy or VPN) Node fails
with `unable to verify the first certificate`. That is local, not a code fault —
try `node --use-system-ca` or a different network. Deployments are unaffected.

### Response shape

Gamdom groups each affiliate's wagers **by month**, so one user can carry
several buckets even with `after` set:

```json
{ "success": true,
  "data": [ { "user_id": 123, "username": "someone",
              "wager_data": [ { "month": "2026-08", "total_wager_usd": 12400 } ] } ] }
```

`parseGamdom()` sums only buckets matching the current `YYYY-MM`. Players who
hide themselves return as `user_id: -1` / `"Hidden User"`; there can be many.
They still wagered, so each is kept as a **distinct** entrant — collapsing them
into one row would understate the pot and inflate everyone else's odds.

Tickets are `floor(wagered / WAGER_PER_TICKET)`. The **full** entrant list is
kept rather than truncated to a top ten — a raffle needs every ticket holder to
compute an honest pot size and odds percentage.

## Assets

`public/` holds the generated art. The hero is built on `vault_backdrop_new.png`
— a full vault room that lights from the upper left and leaves that wall empty,
which is why the copy sits left and the door anchors right. `.roomImg` uses
`object-position: 62% 50%` to keep the door in frame as the viewport narrows.

`hero_seperation.png` (art-deco brass frieze) and `ticket_new.png` are available
but not yet wired in. `vault-backdrop.png` and `bokeh.png` are from the previous
hero and are now unused.

## Motion

The signature is the room **lighting up**: it opens at `brightness(0.18)` and
`scale(1.08)`, a warm shaft grows along the render's own key light, then the
copy staggers in and the figure steps forward. Nothing is bolted on that the art
does not already imply.

The intro runs once per session (`sessionStorage`), then every reload lands on
the resting state so the CTA is immediately reachable. Clear `sessionStorage` or
open a new tab to replay it. Ambient loops — slow room drift, shaft breathe,
ember field, wordmark sheen — run continuously and are all disabled under
`prefers-reduced-motion`.
