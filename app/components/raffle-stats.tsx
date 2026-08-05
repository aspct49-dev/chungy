import { CASINO, RAFFLE_POOL, count, money } from "../data";
import type { RaffleData } from "../lib/raffle";

// Wager totals run into the millions, so the strip needs a compact form or the
// tiles wrap. Small values stay exact — rounding $8,400 to "$8.4k" reads as
// less precise than it is.
function compact(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 10_000) return `$${(value / 1_000).toFixed(1)}k`;
  return money(value);
}

export function RaffleStats({ data }: { data: RaffleData }) {
  const topTickets = data.entrants.length ? data.entrants[0].tickets : 0;

  const tiles = [
    { label: "Entrants", value: count(data.entrantCount) },
    { label: "Tickets in the vault", value: count(data.totalTickets), gold: true },
    { label: "Total wagered", value: compact(data.totalWagered) },
    { label: "Most tickets held", value: count(topTickets) },
    { label: "Prize pool", value: `${money(RAFFLE_POOL)}+`, gold: true },
  ];

  return (
    <div className="lbStats" data-reveal="section">
      <div className="lbStatsHead">
        <div>
          <p className="lbStatsEyebrow">Live raffle stats</p>
          <h3>{CASINO.name} this month</h3>
        </div>
        {data.placeholder && <span className="lbStatsFlag">Sample data</span>}
      </div>

      <div className="lbStatsGrid">
        {tiles.map((tile) => (
          <div className="lbStat" key={tile.label}>
            <div className="lbStatLabel">{tile.label}</div>
            <div className={`lbStatValue${tile.gold ? " gold" : ""}`}>{tile.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
