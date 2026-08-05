import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ticketArt from "../../public/ticket.png";
import {
  CASINO,
  RAFFLE,
  RAFFLE_PLAYER_CAP,
  RAFFLE_POOL,
  RAFFLE_POOL_NOTE,
  WAGER_PER_TICKET,
  count,
  maskedName,
  money,
} from "../data";
import { getRaffleData, nextDrawIso } from "../lib/raffle";
import { DrawCountdown } from "../components/draw-countdown";
import { TicketCalculator } from "../components/ticket-calculator";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Raffle",
  description: `Every ${money(WAGER_PER_TICKET)} wagered on ${CASINO.name} under code ${CASINO.code} earns a ticket in the monthly ${money(RAFFLE_POOL)} raffle.`,
  alternates: { canonical: "/raffle" },
};

export default async function RafflePage() {
  const data = await getRaffleData();

  return (
    <main>
      <section className="pageHero" aria-labelledby="raffle-title">
        <div className="pageHeroInner">
          <span className="heroKicker">The vault</span>
          <h1 id="raffle-title" className="pageTitle">
            {money(RAFFLE_POOL)}+ drawn every month
          </h1>
          <p className="pageLead">
            Every {money(WAGER_PER_TICKET)} wagered on {CASINO.name} under code{" "}
            <strong>{CASINO.code}</strong> puts one more ticket in the vault. No
            leaderboard, no top-ten cutoff &mdash; one ticket is enough to win.
          </p>
          <p className="pageNote">
            The wheel is spun {RAFFLE.spins} times and each spin pays{" "}
            {money(RAFFLE.prizePerSpin)}. One player can win more than once, up
            to {RAFFLE.winCapPerPlayer} times ({money(RAFFLE_PLAYER_CAP)}).
            Every game counts the same &mdash; wagering is unweighted.{" "}
            {RAFFLE_POOL_NOTE}
          </p>
        </div>
      </section>

      <div className="band bandBase">
        <section className="raffleSection">
          {data.placeholder && (
            <p className="notice">
              Showing sample entrants. Live figures appear once the {CASINO.name}{" "}
              feed is connected.
            </p>
          )}

          <div className="raffleTop" data-reveal="section">
            <div className="potCard">
              <Image className="potTicket" src={ticketArt} alt="" sizes="220px" />
              <span className="potValue">{count(data.totalTickets)}</span>
              <span className="potLabel">tickets in the vault</span>
              <span className="potSub">
                {count(data.entrantCount)} entrants &middot; {money(data.totalWagered)} wagered
              </span>
            </div>

            <div className="raffleSide">
              <div className="drawBlock">
                <p className="blockTitle">Draw closes in</p>
                <DrawCountdown target={nextDrawIso()} />
              </div>

              <ul className="prizeList">
                <li>
                  <span className="prizePlace">Spins per draw</span>
                  <span className="prizeAmount">{RAFFLE.spins}</span>
                </li>
                <li>
                  <span className="prizePlace">Each spin pays</span>
                  <span className="prizeAmount">{money(RAFFLE.prizePerSpin)}</span>
                </li>
                <li>
                  <span className="prizePlace">Max per player</span>
                  <span className="prizeAmount">{money(RAFFLE_PLAYER_CAP)}</span>
                </li>
              </ul>
            </div>
          </div>

          <TicketCalculator />

          <div className="tableWrap" data-reveal="section">
            <table className="entrantTable">
              <caption className="tableCaption">
                Current ticket holders &mdash; every entrant is in the draw
              </caption>
              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col" className="num">Wagered</th>
                  <th scope="col" className="num">Tickets</th>
                  <th scope="col" className="num">Odds</th>
                </tr>
              </thead>
              <tbody>
                {data.entrants.map((entrant) => (
                  <tr key={entrant.name}>
                    <td>{maskedName(entrant.name)}</td>
                    <td className="num">{money(entrant.wagered)}</td>
                    <td className="num strong">{count(entrant.tickets)}</td>
                    <td className="num muted">{(entrant.odds * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="raffleRules" data-reveal="section">
            <h2>How it works</h2>
            <ol>
              <li>
                Sign up to {CASINO.name} under code <strong>{CASINO.code}</strong>,
                or apply it to an existing account.
              </li>
              <li>
                Wager normally. Every {money(WAGER_PER_TICKET)} of wager earns one
                ticket, counted from the 1st of the month.
              </li>
              <li>
                Tickets reset when the month closes. The draw is made at random
                from every ticket in the vault.
              </li>
            </ol>
            <p className="rulesNote">
              Partial progress does not carry over between months. Ticket counts
              update roughly every minute from the {CASINO.name} feed.
            </p>
          </div>

          <p className="backLink">
            <Link href="/">&larr; Back to home</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
