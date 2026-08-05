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

        <div className="podiumLabel">Wagered</div>
        <div className="wagerPill">{money(entrant.wagered)}</div>
      </div>

      {/* The plinth carries the ticket count. Its height encodes rank, so the
          number and the standing are legible in one glance. */}
      <div className="podiumPlinth">
        <span className="plinthValue">{count(entrant.tickets)}</span>
        <span className="plinthLabel">
          {entrant.tickets === 1 ? "ticket" : "tickets"}
        </span>
      </div>
    </div>
  );
}

export function RafflePodium({ entrants }: { entrants: Entrant[] }) {
  const [first, second, third] = entrants;
  if (!first) return null;

  // 2-1-3 so first place stands raised in the centre.
  return (
    <div className="podium" data-reveal="section">
      {second && <Card entrant={second} rank={2} />}
      <Card entrant={first} rank={1} />
      {third && <Card entrant={third} rank={3} />}
    </div>
  );
}
