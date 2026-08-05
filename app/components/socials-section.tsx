import type { ComponentType } from "react";
import { FaDiscord, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiKick } from "react-icons/si";
import { BRAND, SOCIALS } from "../data";

const ICONS: Record<string, ComponentType> = {
  Kick: SiKick,
  Discord: FaDiscord,
  X: FaXTwitter,
  YouTube: FaYoutube,
};

export function SocialsSection() {
  return (
    <section className="homeSection" id="socials" aria-labelledby="socials-title">
      <div className="centerHeading" data-reveal="heading">
        <h2 id="socials-title">Keep up with {BRAND}</h2>
        <p className="underCode">Streams, drops, and draw nights</p>
      </div>

      <div className="socialCards">
        {SOCIALS.map((social) => {
          const Icon = ICONS[social.label];
          return (
            <article className="socialCard" data-reveal="card" key={social.label}>
              <span className="socialCardIcon" aria-hidden="true">
                {Icon ? <Icon /> : null}
              </span>

              <h3>{social.label}</h3>
              <p>{social.blurb}</p>

              <a
                className="btn socialCardAction"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.action} ${BRAND} on ${social.label}`}
              >
                {social.action}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
