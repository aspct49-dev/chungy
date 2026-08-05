import { Hero } from "./components/hero";
import { BonusesSection } from "./components/bonuses-section";
import { StreamSection } from "./components/stream-section";
import { RafflePromo } from "./components/raffle-promo";
import { SocialsSection } from "./components/socials-section";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main id="top">
      <Hero />

      <div className="band bandBase" id="bonuses">
        <BonusesSection />
      </div>

      <div className="band bandDeep" id="stream">
        <StreamSection />
      </div>

      <div className="band bandBase bandPromo">
        <RafflePromo />
      </div>

      <div className="band bandDeep bandSocials">
        <SocialsSection />
      </div>
    </main>
  );
}
