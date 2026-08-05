import type { Metadata } from "next";
import {
  CASINO,
  RAFFLE,
  RAFFLE_PLAYER_CAP,
  RAFFLE_POOL,
  WAGER_PER_TICKET,
  count,
  maskedName,
  money,
} from "../data";
import { getRaffleData, nextDrawIso } from "../lib/raffle";
import { DrawCountdown } from "../components/draw-countdown";
import { RafflePodium } from "../components/raffle-podium";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Raffle",
  description: `Every ${money(WAGER_PER_TICKET)} wagered on ${CASINO.name} under code ${CASINO.code} earns a ticket in the monthly ${money(RAFFLE_POOL)} raffle.`,
  alternates: { canonical: "/raffle" },
};

export default async function RafflePage() {
  const data = await getRaffleData();

  return (
    <main className="rafflePage">
      <section className="raffleHead" aria-labelledby="raffle-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="casinoLogo"
          src="/gamdom-logo.png"
          alt={CASINO.name}
          width={272}
          height={64}
        />

        <h1 id="raffle-title" className="raffleTitle">
          <span className="raffleTitleAmount">{money(RAFFLE_POOL)}</span> Monthly
          <br />
          Raffle
        </h1>

        <p className="raffleSub">
          Every {money(WAGER_PER_TICKET)} wagered under code {CASINO.code} earns
          one ticket. {RAFFLE.spins} spins, {money(RAFFLE.prizePerSpin)} each.
        </p>

        <div className="raffleCta">
          <span className="codeChip">
            Code <strong>{CASINO.code}</strong>
          </span>
          <a
            className="btn btnGold"
            href={CASINO.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit {CASINO.name} &#8599;
          </a>
        </div>
      </section>

      <RafflePodium entrants={data.entrants} />

      <section className="raffleClock" aria-label="Time remaining">
        <p className="clockTitle">Raffle ends in</p>
        <DrawCountdown target={nextDrawIso()} />
      </section>

      <div className="tableWrap">
        <table className="entrantTable">
          <thead>
            <tr>
              <th scope="col" className="rankCol">Rank</th>
              <th scope="col">User</th>
              <th scope="col" className="num">Wagered</th>
              <th scope="col" className="num">Tickets</th>
              <th scope="col" className="num">Odds</th>
            </tr>
          </thead>
          <tbody>
            {data.entrants.map((entrant, index) => {
              const rank = index + 1;
              const medal =
                rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "";
              return (
                <tr key={entrant.name}>
                  <td className="rankCol">
                    <span className={`rankPill ${medal}`}>{rank}</span>
                  </td>
                  <td>{maskedName(entrant.name)}</td>
                  <td className="num">{money(entrant.wagered)}</td>
                  <td className="num strong">{count(entrant.tickets)}</td>
                  <td className="num muted">{(entrant.odds * 100).toFixed(1)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="raffleFoot">
        Usernames are masked for privacy. Standings update as wagers are
        processed. Every ticket holder is entered &mdash; more tickets is better
        odds, not a reserved prize. One player can win up to{" "}
        {RAFFLE.winCapPerPlayer} times ({money(RAFFLE_PLAYER_CAP)}).
        {data.placeholder && " Showing sample entrants until the feed is connected."}
      </p>
    </main>
  );
}
