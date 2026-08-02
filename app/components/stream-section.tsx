import { BRAND, KICK_EMBED, KICK_URL } from "../data";

export function StreamSection() {
  return (
    <section className="homeSection" aria-label={`${BRAND} live stream`}>
      <div className="centerHeading" data-reveal="heading">
        <h2>Live</h2>
        <p className="underCode">Bonus hunts, big-multi chases, and the monthly draw</p>
      </div>

      <div className="streamFrame" data-reveal="section">
        {/* Kick's player renders its own offline state, so no fallback branch. */}
        <iframe
          className="streamEmbed"
          src={KICK_EMBED}
          title={`${BRAND} live on Kick`}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="streamActions">
        <a className="btn btnGold" href={KICK_URL} target="_blank" rel="noopener noreferrer">
          <span className="liveDot" aria-hidden="true" />
          Open on Kick
        </a>
      </div>
    </section>
  );
}
