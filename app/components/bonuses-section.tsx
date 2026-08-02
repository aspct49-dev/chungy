import { BONUSES, CASINO } from "../data";

export function BonusesSection() {
  return (
    <section className="homeSection" aria-label={`${CASINO.name} bonuses`}>
      <div className="centerHeading" data-reveal="heading">
        <h2>Bonuses</h2>
        <p className="underCode">
          Exclusive perks under code <strong>{CASINO.code}</strong>
        </p>
      </div>

      <div className="bonusGrid">
        {BONUSES.map((bonus) => (
          <article className="bonusCard" key={bonus.tag} data-reveal="card">
            <span className="bonusBadge">{bonus.tag}</span>

            <div className="bonusLogoWrap">
              <span className="bonusLogo">{bonus.name}</span>
            </div>

            <p className="bonusDesc">{bonus.detail}</p>

            <div className="bonusBox">
              <span className="bonusBoxLabel">Exclusive bonus</span>
              <div className="bonusAmountRow">
                <span className="bonusAmount">{bonus.headline}</span>
              </div>
              <ul className="bonusFeatures">
                {bonus.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>

            <a
              className="btn btnGold bonusCta"
              href={bonus.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Claim with {bonus.code} &#8599;
            </a>

            <p className="bonusNote">
              Wagers under this code count toward your raffle tickets.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
