import { count, maskedName, money } from "../data";
import type { Entrant } from "../lib/raffle";

const META = {
  1: { cls: "first", label: "1st" },
  2: { cls: "second", label: "2nd" },
  3: { cls: "third", label: "3rd" },
} as const;

type Rank = keyof typeof META;

function initials(name: string) {
  return name.charAt(0).toUpperCase() || "?";
}

function Card({ entrant, rank }: { entrant: Entrant; rank: Rank }) {
  const meta = META[rank];
  return (
    <div className={`podiumCol ${meta.cls}`}>
      <div className="podiumCard">
        <div className="avatarWrap">
          <div className="avatar">{initials(entrant.name)}</div>
          <span className="rankBadge">{meta.label}</span>
        </div>

        <div className="podiumName">{maskedName(entrant.name)}</div>

        <div className="podiumLabel">Tickets</div>
        <div className="ticketPill">{count(entrant.tickets)}</div>

        <div className="podiumWagered">{money(entrant.wagered)} wagered</div>

        <div className="podiumOdds">{(entrant.odds * 100).toFixed(1)}% of the pot</div>
      </div>
    </div>
  );
}

export function RafflePodium({ entrants }: { entrants: Entrant[] }) {
  const [first, second, third] = entrants;
  if (!first) return null;

  // Rendered 2-1-3 so first place sits raised in the centre. DOM order is the
  // visual order here because the cards carry explicit rank labels — nothing
  // relies on source order to convey standing.
  return (
    <div className="podium" data-reveal="section">
      {second && <Card entrant={second} rank={2} />}
      <Card entrant={first} rank={1} />
      {third && <Card entrant={third} rank={3} />}
    </div>
  );
}
