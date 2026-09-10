import {
  PAST_DRAWS,
  count,
  drawTotals,
  maskedName,
  money,
  type PastDraw,
} from "../data";

function DrawTable({ draw }: { draw: PastDraw }) {
  const totals = drawTotals(draw);

  return (
    <div className="tableWrap" data-reveal="section">
      <table className="entrantTable pastTable">
        <caption className="tableCaption">
          {draw.period}
          <span className="captionMeta">
            {count(totals.spins)} spins &middot; {money(totals.paid)} paid out
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
              <td>{maskedName(winner.name)}</td>
              <td className="num">{money(winner.wagered)}</td>
              <td className="num">{count(winner.tickets)}</td>
              <td className="num muted">
                {totals.tickets > 0
                  ? ((winner.tickets / totals.tickets) * 100).toFixed(1)
                  : "0.0"}
                %
              </td>
              <td className="num">{count(winner.spinsWon)}</td>
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
        went in on. Names are masked, the same as the live standings.
      </p>

      {PAST_DRAWS.map((draw) => (
        <DrawTable key={draw.period} draw={draw} />
      ))}
    </section>
  );
}
