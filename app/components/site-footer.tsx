import { BRAND, CASINO, SOCIALS } from "../data";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div className="footerBrandBlock">
          <span className="footerBrand">{BRAND}</span>
          <p className="footerNote">
            Official {CASINO.name} partner. Play under code{" "}
            <strong>{CASINO.code}</strong>.
          </p>
        </div>

        <nav className="footerSocials" aria-label="Social links">
          {SOCIALS.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">
              {social.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="footerLegal">
        <p>
          18+ only. Gambling involves risk &mdash; never wager more than you can
          afford to lose. If it stops being fun, stop. Help is available at{" "}
          <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer">
            BeGambleAware.org
          </a>
          .
        </p>
        <p className="footerCopy">
          &copy; {new Date().getFullYear()} {BRAND}. Not affiliated with any
          regulator. Raffle terms subject to change.
        </p>
      </div>
    </footer>
  );
}
