import { RAFFLE, count, maskedName, money } from "../data";
import type { Entrant } from "../lib/raffle";

/**
 * First place is not a raffle result, so it does not belong on the podium
 * with the spin entrants — it is settled by the wager board alone.
 */
export function FirstPlace({ entrant }: { entrant: Entrant | null }) {
  if (!entrant) return null;

  return (
    <section className="firstPlace" aria-labelledby="first-place-title" data-reveal="section">
      <p className="clockTitle" id="first-place-title">
        First place
      </p>

      <div className="firstPlaceCard">
        <div className="firstPlaceWho">
          <span className="firstPlaceName">{maskedName(entrant.name)}</span>
          <span className="firstPlaceMeta">
            {money(entrant.wagered)} wagered &middot; {count(entrant.tickets)}{" "}
            {entrant.tickets === 1 ? "ticket" : "tickets"}
          </span>
        </div>

        <div className="firstPlacePrize">
          <span className="firstPlacePrizeValue">
            {money(RAFFLE.firstPlacePrize)}
          </span>
          <span className="firstPlacePrizeLabel">paid outright</span>
        </div>
      </div>

      <p className="firstPlaceNote">
        Top of the wager board takes {money(RAFFLE.firstPlacePrize)} straight
        out, with no spin involved, and then sits out the draw &mdash; so the{" "}
        {money(RAFFLE.spins * RAFFLE.prizePerSpin)} below is shared among
        everyone else.
      </p>
    </section>
  );
}
