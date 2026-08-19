"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/about",    label: "About" },
  { href: "/gallery",  label: "Gallery" },
  { href: "/faq",      label: "FAQ" },
  { href: "/contact",  label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: scrolled || menuOpen ? "rgba(9,9,9,0.94)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(16px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        <div className="nav-inner">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--c-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff", letterSpacing: "-0.01em" }}>R</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>REVIVE</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", marginTop: -1 }}>AUTO DETAIL</div>
            </div>
          </Link>

          <nav className="nav-desktop">
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={`nav-link${pathname === href ? " nav-link-active" : ""}`}>{label}</Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <Link href="/booking" className="cta-gold nav-cta">
              Book a Detail
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-hamburger"
            >
              <span style={{ width: 16, height: 1.5, background: "#fff", display: "block", transition: "transform 0.2s", transform: menuOpen ? "rotate(45deg) translate(2px, 4px)" : "none" }} />
              <span style={{ width: 16, height: 1.5, background: "#fff", display: "block", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
              <span style={{ width: 16, height: 1.5, background: "#fff", display: "block", transition: "transform 0.2s", transform: menuOpen ? "rotate(-45deg) translate(2px, -4px)" : "none" }} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(9,9,9,0.98)", paddingTop: 80, padding: "80px 24px 32px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ fontSize: "clamp(22px, 7vw, 28px)", fontWeight: 600, color: "#fff", textDecoration: "none", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setMenuOpen(false)} style={{ marginTop: 24, height: 50, background: "var(--c-gold)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            Book a Detail
          </Link>
        </div>
      )}
    </>
  );
}
