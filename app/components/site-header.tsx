import { BRAND, CASINO, NAV } from "../data";

export function SiteHeader() {
  return (
    <header className="siteHeader">
      <div className="headerInner">
        <a className="headerBrand" href="#top">
          {BRAND}
        </a>

        <nav className="headerNav" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="btn btnGold btnSm" href={CASINO.url} target="_blank" rel="noopener noreferrer">
          Play on {CASINO.name}
        </a>
      </div>
    </header>
  );
}
