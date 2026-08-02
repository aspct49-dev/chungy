"use client";

import { useState } from "react";
import { WAGER_PER_TICKET, count, money } from "../data";

// Entrant names are masked in the table, so a "look up my row" search can't
// work without unmasking everyone. A calculator gives the same answer without
// putting anyone's handle on the page.
export function TicketCalculator() {
  const [raw, setRaw] = useState("");

  const wagered = Number(raw.replace(/[^0-9.]/g, ""));
  const valid = Number.isFinite(wagered) && wagered > 0;
  const tickets = valid ? Math.floor(wagered / WAGER_PER_TICKET) : 0;
  const remainder = valid ? wagered % WAGER_PER_TICKET : 0;
  const toNext = valid ? WAGER_PER_TICKET - remainder : WAGER_PER_TICKET;
  const progress = valid ? remainder / WAGER_PER_TICKET : 0;

  return (
    <div className="calc">
      <label className="calcLabel" htmlFor="wagerInput">
        How much have you wagered this month?
      </label>

      <div className="calcRow">
        <span className="calcPrefix">$</span>
        <input
          id="wagerInput"
          className="calcInput"
          inputMode="decimal"
          placeholder="12,400"
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
        />
      </div>

      <div className="calcResult" aria-live="polite">
        <div className="calcTickets">
          <span className="calcBig">{count(tickets)}</span>
          <span className="calcUnit">{tickets === 1 ? "ticket" : "tickets"}</span>
        </div>

        <div className="calcMeter" aria-hidden="true">
          <div className="calcMeterFill" style={{ width: `${progress * 100}%` }} />
        </div>

        <p className="calcHint">
          {valid ? (
            <>
              {money(toNext)} more wagered earns ticket{" "}
              <strong>#{count(tickets + 1)}</strong>.
            </>
          ) : (
            <>Every {money(WAGER_PER_TICKET)} wagered earns one ticket.</>
          )}
        </p>
      </div>
    </div>
  );
}
