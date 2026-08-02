"use client";

import { useEffect, useState } from "react";

function parts(msRemaining: number) {
  const clamped = Math.max(msRemaining, 0);
  const total = Math.floor(clamped / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function DrawCountdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  // Rendered empty on the server so SSR and first client paint agree; the
  // clock only starts once mounted, which avoids a hydration mismatch.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const t = now === null ? null : parts(targetMs - now);
  const cells: Array<[string, number | null]> = [
    ["Days", t?.days ?? null],
    ["Hrs", t?.hours ?? null],
    ["Min", t?.minutes ?? null],
    ["Sec", t?.seconds ?? null],
  ];

  return (
    <div className="countdown" role="timer" aria-live="off">
      {cells.map(([label, value]) => (
        <div className="countCell" key={label}>
          <span className="countValue">
            {value === null ? "--" : String(value).padStart(2, "0")}
          </span>
          <span className="countLabel">{label}</span>
        </div>
      ))}
    </div>
  );
}
