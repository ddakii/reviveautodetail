"use client";

import Link from "next/link";

const GOLD = "#C9A86A";
const BLACK = "#0B0B0C";
const BORDER = "rgba(255,255,255,0.08)";
const MUTED = "rgba(255,255,255,0.35)";
const TEXT = "rgba(255,255,255,0.65)";

const SERVICES_LINKS = [
  { href: "/services/full-detail", label: "Full Detail" },
  { href: "/services/interior-detail", label: "Interior Detail" },
  { href: "/services/exterior-detail", label: "Exterior Detail" },
  { href: "/services/paint-correction", label: "Paint Correction" },
  { href: "/services/ceramic-coating", label: "Ceramic Coating" },
  { href: "/services/ppf", label: "Paint Protection" },
  { href: "/services/maintenance-detail", label: "Maintenance Detail" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Book Now" },
];

export function Footer() {
  return (
    <footer style={{ background: "#080809", borderTop: `1px solid ${BORDER}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 48px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr", gap: 48, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: BLACK, fontFamily: "serif" }}>R</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.12em" }}>REVIVE</div>
                <div style={{ fontSize: 8, color: MUTED, letterSpacing: "0.25em", textTransform: "uppercase" }}>AUTO DETAIL</div>
              </div>
            </Link>
            <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.7, maxWidth: 280, marginBottom: 24 }}>
              Premium automotive detailing engineered to restore, protect, and elevate your vehicle.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["IG", "FB"].map((s) => (
                <a key={s} href="#" style={{
                  width: 36, height: 36, border: `1px solid ${BORDER}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: MUTED, fontSize: 11, fontWeight: 600, textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Services</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {SERVICES_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: MUTED, fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Company</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: MUTED, fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>Contact</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                "(555) 847-2100",
                "hello@reviveautodetail.com",
                "1420 Auto Blvd, Suite 100\nLos Angeles, CA 90001",
                "Mon–Fri: 8am – 6pm\nSat: 9am – 5pm\nSun: Closed",
              ].map((item, i) => (
                <li key={i} style={{ color: MUTED, fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ color: MUTED, fontSize: 12 }}>© 2026 Revive Auto Detail. All rights reserved.</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service"].map((label) => (
              <Link key={label} href="#" style={{ color: MUTED, fontSize: 12, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = TEXT)}
                onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
