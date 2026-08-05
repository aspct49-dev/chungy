"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CASINO, NAV } from "../data";

/**
 * Burger menu for viewports below the 900px breakpoint, where .headerNav is
 * hidden and the header would otherwise carry no navigation at all.
 *
 * Only this piece is a client component — the header itself stays server
 * rendered, since nothing else in it needs state.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  // The panel hangs off the bottom of the header, so it needs the header's
  // real height. Measured rather than hard-coded: the header's height comes
  // from padding plus a font-size that changes at the 900px breakpoint, so any
  // constant here would silently drift the moment either is edited.
  useEffect(() => {
    const header = buttonRef.current?.closest(".siteHeader") as HTMLElement | null;
    if (!header) return;

    const publish = () =>
      document.documentElement.style.setProperty(
        "--header-h",
        `${Math.round(header.getBoundingClientRect().height)}px`
      );

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Send focus back to the control that opened the panel, rather than
      // dropping it at the top of the document.
      buttonRef.current?.focus();
    };

    // A tap outside the panel should dismiss it, but the toggle handles its
    // own state — closing here too would immediately reopen it.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };

    // The panel covers the viewport, so the page behind it must not scroll.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Every link either jumps to an anchor on this page or leaves for another
  // route; in both cases the panel has done its job.
  const close = () => setOpen(false);

  /**
   * Portalled to <body> rather than left inside the header. The header sets
   * `backdrop-filter`, and an element with a backdrop-filter becomes the
   * containing block for its fixed-position descendants — so nested here, the
   * panel's `top: <header height>; bottom: 0` resolved against the 60px header
   * instead of the viewport and collapsed to its content height. The portal
   * makes the viewport the containing block again, and keeps it that way if
   * anyone changes the header's filters later.
   */
  const panel = (
    <div
      id="mobile-nav"
      ref={panelRef}
      className="mobileNav"
      data-open={open}
      // Hidden from assistive tech and taken out of the tab order when
      // closed, so the links are not reachable behind a collapsed panel.
      inert={!open}
    >
      <nav aria-label="Mobile">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} onClick={close}>
            {item.label}
          </a>
        ))}
      </nav>

      <a
        className="btn btnGold"
        href={CASINO.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={close}
      >
        Play on {CASINO.name}
      </a>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="navToggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="navToggleBars" data-open={open} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
}
