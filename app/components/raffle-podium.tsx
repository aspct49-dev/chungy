import { count, maskedName, money } from "../data";
import type { Entrant } from "../lib/raffle";

// Rendered 2-1-3 so first place stands in the middle, the way a podium reads
// in person. The DOM order still runs 1-2-3 for screen readers and keyboard
// order; only the visual placement is reordered.
const SLOTS = [
  { place: 2, index: 1 },
  { place: 1, index: 0 },
  { place: 3, index: 2 },
] as const;

export function RafflePodium({ entrants }: { entrants: Entrant[] }) {
  const top = entrants.slice(0, 3);
  if (top.length < 3) return null;

  return (
    <div className="podium" data-reveal="section">
      <h2 className="podiumHeading">Most tickets this month</h2>

      <ol className="podiumRow">
        {SLOTS.map(({ place, index }) => {
          const entrant = top[index];
          return (
            <li className={`podiumSlot place${place}`} key={entrant.name} value={place}>
              <div className="podiumCard">
                <span className="podiumRank" aria-hidden="true">
                  {place}
                </span>

                <span className="podiumName">{maskedName(entrant.name)}</span>

                <span className="podiumTickets">
                  <strong>{count(entrant.tickets)}</strong>
                  <span>{entrant.tickets === 1 ? "ticket" : "tickets"}</span>
                </span>

                <span className="podiumWagered">{money(entrant.wagered)} wagered</span>
                <span className="podiumOdds">{(entrant.odds * 100).toFixed(1)}% of the pot</span>
              </div>
              <div className="podiumBase" aria-hidden="true" />
            </li>
          );
        })}
      </ol>

      <p className="podiumNote">
        Standing here does not decide the draw &mdash; more tickets is better
        odds, not a reserved prize. Every ticket holder is spun for.
      </p>
    </div>
  );
}
