import Image from "next/image";
import Link from "next/link";
import mascot from "../../public/new.png";
import { CASINO, KICK_URL, RAFFLE, RAFFLE_POOL, WAGER_PER_TICKET, money } from "../data";

// Deterministic ember field, the way Frizzy seeds its bubbles: a fixed array
// keeps server and client markup identical (no hydration mismatch) while still
// looking scattered. [left %, size px, rise s, delay s, opacity]
type Ember = [number, number, number, number, number];

const EMBERS_BACK: Ember[] = [
  [6, 3, 24, 0, 0.45],
  [17, 2, 28, 6, 0.34],
  [29, 3, 21, 12, 0.5],
  [43, 2, 26, 3, 0.38],
  [57, 3, 23, 9, 0.44],
  [71, 2, 29, 15, 0.32],
  [84, 3, 20, 4, 0.5],
  [94, 2, 25, 10, 0.36],
];

const EMBERS_FRONT: Ember[] = [
  [12, 5, 15, 2, 0.62],
  [34, 6, 13, 7, 0.7],
  [52, 4, 17, 4, 0.55],
  [68, 5, 14, 10, 0.66],
  [88, 4, 16, 6, 0.58],
];

function EmberField({ embers, layer }: { embers: Ember[]; layer: string }) {
  return (
    <div className={`emberLayer ${layer}`} aria-hidden="true">
      {embers.map(([left, size, rise, delay, alpha], index) => (
        <span
          className="ember"
          key={index}
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: alpha,
            animationDuration: `${rise}s`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* The room render lights from the upper left and leaves that wall empty,
          so the copy sits in the light and the door anchors the right. Every
          layer below is pinned to that geometry. */}
      <div className="heroRoom" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="roomImg" src="/vault_backdrop_new.png" alt="" />
        <div className="lightShaft" />
        <div className="roomVignette" />
      </div>

      <EmberField embers={EMBERS_BACK} layer="embersBack" />

      <div className="heroGrid">
        <div className="heroCopy">
          <span className="heroKicker">Official {CASINO.name} Partner</span>

          <h1 id="hero-title" className="wordmark">
            BigChungyTV
          </h1>

          <p className="heroTagline">
            {money(WAGER_PER_TICKET)} wagered. One ticket. {RAFFLE.spins} spins at{" "}
            {money(RAFFLE.prizePerSpin)} each.
          </p>

          <p className="heroSummary">
            Play under code <strong>{CASINO.code}</strong> and every{" "}
            {money(WAGER_PER_TICKET)}{" "}
            you wager drops another ticket in the vault.
            Every game counts the same &mdash; no weighting, no top-ten cutoff.
          </p>

          <div className="heroActions">
            <Link className="btn btnGold" href="/raffle">
              Enter the raffle
            </Link>
            <a className="btn" href={KICK_URL} target="_blank" rel="noopener noreferrer">
              Watch live
            </a>
          </div>

          <dl className="heroStats">
            <div>
              <dt>Monthly pool</dt>
              <dd>{money(RAFFLE_POOL)}+</dd>
            </div>
            <div>
              <dt>Spins per draw</dt>
              <dd>{RAFFLE.spins}</dd>
            </div>
            <div>
              <dt>Per spin</dt>
              <dd>{money(RAFFLE.prizePerSpin)}</dd>
            </div>
          </dl>
        </div>

      </div>

      <EmberField embers={EMBERS_FRONT} layer="embersFront" />

      {/* The mascot is deliberately layered *under* the frieze so the strip
          cuts across his legs — he reads as standing behind it rather than
          pasted on top of the section boundary. */}
      <div className="heroMascot" aria-hidden="true">
        <Image src={mascot} alt="" priority sizes="(max-width: 900px) 78vw, 620px" />
      </div>

      <div className="heroStrip" aria-hidden="true" />
    </section>
  );
}
