import Image from "next/image";
import Link from "next/link";
import ticketArt from "../../public/ticket.png";
import { RAFFLE_POOL, WAGER_PER_TICKET, count, money } from "../data";
import { getRaffleData, nextDrawIso } from "../lib/raffle";
import { DrawCountdown } from "./draw-countdown";

export async function RafflePromo() {
  const data = await getRaffleData();

  return (
    <section className="promoBanner" aria-label="Monthly raffle preview" data-reveal="section">
      <div className="promoCopy">
        <h2>
          <span>{money(RAFFLE_POOL)}</span> Raffle
        </h2>
        <p>
          Every {money(WAGER_PER_TICKET)} wagered is one more ticket in the vault.
          One ticket is all it takes.
        </p>
        <Link className="btn btnGold" href="/raffle">
          View the raffle
        </Link>
      </div>

      <div className="promoStats">
        <Image className="promoTicket" src={ticketArt} alt="" sizes="260px" />

        <div className="promoStat">
          <span className="promoStatValue">{count(data.totalTickets)}</span>
          <span className="promoStatLabel">tickets in the vault</span>
        </div>

        <div className="promoStatRow">
          <div className="promoStatSm">
            <span>{count(data.entrantCount)}</span>
            <small>entrants</small>
          </div>
          <div className="promoStatSm">
            <span>{money(data.totalWagered)}</span>
            <small>wagered</small>
          </div>
        </div>

        <div className="promoDraw">
          <p className="blockTitle">Draw closes in</p>
          <DrawCountdown target={nextDrawIso()} />
        </div>
      </div>
    </section>
  );
}
