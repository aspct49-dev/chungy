import {
  PAST_DRAWS,
  count,
  drawTotals,
  maskedName,
  money,
  type PastDraw,
  type PastWinner,
} from "../data";

/** Em dash rather than a zero: the figure is absent, not nil. */
const NONE = "—";

function odds(winner: PastWinner, totalTickets: number) {
  if (winner.outsideDraw || !winner.tickets || totalTickets <= 0) return NONE;
  return `${((winner.tickets / totalTickets) * 100).toFixed(1)}%`;
}

function DrawTable({ draw }: { draw: PastDraw }) {
  const totals = drawTotals(draw);

  return (
    <div className="tableWrap" data-reveal="section">
      <table className="entrantTable pastTable">
        <caption className="tableCaption">
          {draw.period}
          <span className="captionMeta">
            {count(draw.entrants)} entrants &middot; {count(totals.tickets)}{" "}
            tickets &middot; {count(totals.spins)} spins &middot;{" "}
            {money(totals.paid)} paid out
          </span>
        </caption>
        <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col" className="num">Wagered</th>
            <th scope="col" className="num">Tickets</th>
            <th scope="col" className="num">Odds</th>
            <th scope="col" className="num">Spins won</th>
            <th scope="col" className="num">Won</th>
            <th scope="col" className="statusCol">Status</th>
          </tr>
        </thead>
        <tbody>
          {draw.winners.map((winner) => (
            <tr key={winner.name}>
              <td>
                {maskedName(winner.name)}
                {winner.note && <span className="rowNote">{winner.note}</span>}
              </td>
              <td className="num">
                {winner.wagered === undefined ? NONE : money(winner.wagered)}
              </td>
              <td className="num">
                {winner.tickets === undefined ? NONE : count(winner.tickets)}
              </td>
              <td className="num muted">{odds(winner, totals.tickets)}</td>
              <td className="num">
                {winner.spinsWon === undefined ? NONE : count(winner.spinsWon)}
              </td>
              <td className="num strong">{money(winner.winnings)}</td>
              <td className="statusCol">
                <span className={`statusPill ${winner.paid ? "paid" : "pending"}`}>
                  {winner.paid ? "Paid" : "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PastWinners() {
  if (PAST_DRAWS.length === 0) return null;

  return (
    <section className="pastDraws" aria-labelledby="past-winners-title">
      <p className="clockTitle">Previous draws</p>
      <h2 id="past-winners-title" className="pastTitle">
        Winners, paid
      </h2>
      <p className="pastLead">
        Every spin from past draws, with the wager and ticket count each winner
        went in on. Odds are the share of all tickets in that draw, not just the
        ones on this list. Names are masked, the same as the live standings.
      </p>

      {PAST_DRAWS.map((draw) => (
        <DrawTable key={draw.period} draw={draw} />
      ))}

      <p className="raffleFoot">
        Rows marked with an award were paid on top of the spins, not out of
        them, and their tickets were never in the pot &mdash; which is why they
        show a wager and a ticket count but no odds, and why the draw total
        does not include them. Entrants who held tickets but won no spin are
        counted in the totals rather than listed.
      </p>
    </section>
  );
}
