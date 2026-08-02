import Image from "next/image";
import Link from "next/link";
import chungyHero from "../../public/chungy-hero.png";
import { CASINO, KICK_URL, WAGER_PER_TICKET, money } from "../data";

// The seam geometry was measured off vault-backdrop.png rather than eyeballed:
// fitting a circle to the render's own gold pixels gives centre (1298, 467)
// and radius 441 in its native 1672x941 space. The <svg> shares that viewBox
// and the same object-fit/preserveAspectRatio behaviour as the <img> beneath,
// so the stroke stays welded to the painted glow at every viewport size.
const SEAM_PATH = "M 1025 120 A 441 441 0 0 0 1063 840";

// Deterministic ember field, the way Frizzy seeds its bubbles: a fixed array
// keeps server and client markup identical (no hydration mismatch) while still
// looking scattered. [left %, size px, rise s, delay s, sway s, opacity]
type Ember = [number, number, number, number, number, number];

const EMBERS_BACK: Ember[] = [
  [4, 3, 22, 0, 7.5, 0.5],
  [13, 2, 26, 5, 6.2, 0.38],
  [21, 4, 19, 11, 8.1, 0.55],
  [34, 2, 24, 3, 6.8, 0.42],
  [46, 3, 21, 8, 7.2, 0.5],
  [58, 2, 27, 14, 5.9, 0.35],
  [69, 4, 18, 2, 8.4, 0.58],
  [81, 3, 23, 9, 6.5, 0.45],
  [92, 2, 25, 6, 7.8, 0.4],
];

const EMBERS_FRONT: Ember[] = [
  [9, 6, 14, 1, 4.6, 0.7],
  [27, 5, 17, 6, 5.2, 0.62],
  [41, 7, 12, 3, 4.1, 0.78],
  [55, 5, 16, 9, 5.5, 0.6],
  [73, 6, 13, 4, 4.4, 0.72],
  [88, 5, 15, 7, 5.0, 0.65],
];

function EmberField({ embers, layer }: { embers: Ember[]; layer: string }) {
  return (
    <div className={`emberLayer ${layer}`} aria-hidden="true">
      {embers.map(([left, size, rise, delay, sway, alpha], index) => (
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
            // the inner span sways independently so drift never syncs up
            ["--sway" as string]: `${sway}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="heroBokeh" aria-hidden="true" />

      <div className="vaultStage" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="vaultImg" src="/vault-backdrop.png" alt="" />
        <svg className="vaultSeam" viewBox="0 0 1672 941" fill="none" aria-hidden="true">
          <path d={SEAM_PATH} />
        </svg>
        {/* slow-turning ring, pinned to the door's measured centre */}
        <div className="vaultHalo" />
      </div>

      <EmberField embers={EMBERS_BACK} layer="embersBack" />

      <div className="heroBloom" aria-hidden="true" />

      <EmberField embers={EMBERS_FRONT} layer="embersFront" />

      <div className="heroContent">
        <span className="heroKicker">Official {CASINO.name} Partner</span>

        <h1 id="hero-title" className="wordmark">
          BigChungyTV
        </h1>

        <p className="heroTagline">
          Every {money(WAGER_PER_TICKET)} wagered is one ticket in the vault.
        </p>

        <p className="heroSummary">
          Play on {CASINO.name} under code <strong>{CASINO.code}</strong> and every{" "}
          {money(WAGER_PER_TICKET)}{" "}
          you wager earns another ticket in the monthly raffle. No leaderboard,
          no top-ten cutoff &mdash; one ticket is all it takes to win.
        </p>

        <div className="heroActions">
          <Link className="btn btnGold" href="/raffle">
            Enter the raffle
          </Link>
          <a className="btn" href={KICK_URL} target="_blank" rel="noopener noreferrer">
            Watch live
          </a>
        </div>
      </div>

      {/* Decorative corner art, the way Frizzy anchors its mascot — the centred
          copy column stays the focal point rather than competing with it. */}
      <div className="heroMascot" aria-hidden="true">
        <Image src={chungyHero} alt="" priority sizes="(max-width: 900px) 42vw, 380px" />
        <div className="cardFlare" aria-hidden="true" />
      </div>

      <a className="heroScroll" href="#bonuses">
        <span aria-hidden="true" />
        Explore bonuses
      </a>
    </section>
  );
}
