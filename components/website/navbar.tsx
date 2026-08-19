"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const GOLD = "#C9A86A";
const BLACK = "#0B0B0C";
const WHITE = "#FFFFFF";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled ? "rgba(11,11,12,0.97)" : "transparent";
  const navBorder = scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent";

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg, borderBottom: navBorder,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{
              width: 32, height: 32, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: 14, color: BLACK, fontFamily: "serif",
            }}>R</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, letterSpacing: "0.12em", lineHeight: 1.1 }}>REVIVE</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: "0.25em", textTransform: "uppercase" }}>AUTO DETAIL</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} style={{
                color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 500,
                letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
                padding: "8px 14px", transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = WHITE)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/booking" style={{
              background: GOLD, color: BLACK, padding: "10px 24px",
              fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase",
              textDecoration: "none", transition: "background 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#b8964f")}
              onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
            >
              Book Now
            </Link>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: WHITE, display: "none" }}
              className="mobile-menu-btn"
              aria-label="Menu"
            >
              <div style={{ width: 22, height: 1.5, background: WHITE, marginBottom: 5, transition: "transform 0.2s", transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
              <div style={{ width: 22, height: 1.5, background: WHITE, opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
              <div style={{ width: 22, height: 1.5, background: WHITE, marginTop: 5, transition: "transform 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 68, left: 0, right: 0, bottom: 0,
          background: "rgba(11,11,12,0.98)", zIndex: 99, padding: "32px 40px",
          display: "flex", flexDirection: "column", gap: 8,
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} style={{
              color: WHITE, fontSize: 24, fontWeight: 600, textDecoration: "none",
              padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              {label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setMobileOpen(false)} style={{
            display: "inline-block", background: GOLD, color: BLACK,
            padding: "16px 32px", fontWeight: 700, fontSize: 14, textDecoration: "none",
            marginTop: 24, textAlign: "center",
          }}>
            Book Now
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
        }
        @media (max-width: 768px) {
          nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
