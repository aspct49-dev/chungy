import { BONUSES, CASINO } from "../data";

export function BonusesSection() {
  return (
    <section className="homeSection" aria-label={`${CASINO.name} rewards`}>
      <div className="centerHeading" data-reveal="heading">
        <h2>Rewards</h2>
        <p className="underCode">
          Unlocked under code <strong>{CASINO.code}</strong>
        </p>
      </div>

      <div className="bonusGrid">
        {BONUSES.map((bonus) => (
          <article className="bonusCard" key={bonus.tag} data-reveal="card">
            <div className="bonusTop">
              <span className="bonusBadge">{bonus.tag}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="bonusLogo" src="/gamdom-logo.png" alt={bonus.name} width={272} height={64} />
            </div>

            <div className="bonusAmountRow">
              <span className="bonusAmount">{bonus.amount}</span>
              <span className="bonusAmountSuffix">{bonus.amountSuffix}</span>
            </div>

            <h3 className="bonusHeadline">{bonus.headline}</h3>
            <p className="bonusDesc">{bonus.detail}</p>

            <div className="bonusBox">
              <span className="bonusBoxLabel">What you get</span>
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

            <p className="bonusNote">{bonus.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
