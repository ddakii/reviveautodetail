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

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 64,
        background: scrolled ? "rgba(9,9,9,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", height: "100%", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--c-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff", letterSpacing: "-0.01em" }}>R</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>REVIVE</div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", marginTop: -1 }}>AUTO DETAIL</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={`nav-link${pathname === href ? " nav-link-active" : ""}`}>{label}</Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/booking" className="cta-gold" style={{
              height: 36, padding: "0 18px",
              borderRadius: 8,
              fontWeight: 600, fontSize: 13,
              display: "inline-flex", alignItems: "center",
            }}>
              Book a Detail
            </Link>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", width: 36, height: 36, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, cursor: "pointer", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }} className="nav-hamburger">
              <span style={{ width: 16, height: 1.5, background: "#fff", display: "block", transition: "transform 0.2s", transform: menuOpen ? "rotate(45deg) translate(2px, 4px)" : "none" }} />
              <span style={{ width: 16, height: 1.5, background: "#fff", display: "block", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
              <span style={{ width: 16, height: 1.5, background: "#fff", display: "block", transition: "transform 0.2s", transform: menuOpen ? "rotate(-45deg) translate(2px, -4px)" : "none" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(9,9,9,0.98)", paddingTop: 80, padding: "80px 32px 32px", display: "flex", flexDirection: "column", gap: 4 }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{ fontSize: 28, fontWeight: 600, color: "#fff", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {label}
            </Link>
          ))}
          <Link href="/booking" onClick={() => setMenuOpen(false)} style={{ marginTop: 24, height: 50, background: "var(--c-gold)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            Book a Detail
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-hamburger { display: flex !important; }
          nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
