"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "var(--c-black)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.4fr", gap: 48, marginBottom: 56 }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--c-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>R</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>REVIVE</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>AUTO DETAIL</div>
              </div>
            </Link>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
              Precision detailing, restoration, and protection for vehicles that deserve more.
            </p>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 16 }}>Services</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Full Detail", "Interior Detail", "Exterior Detail", "Paint Correction", "Ceramic Coating", "Paint Protection"].map(s => (
                <Link key={s} href="/services" className="footer-link">{s}</Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 16 }}>Company</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["About", "/about"], ["Gallery", "/gallery"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Book Now", "/booking"]].map(([label, href]) => (
                <Link key={href} href={href} className="footer-link">{label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 16 }}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["(555) 847-2100", "hello@reviveautodetail.com", "1420 Auto Blvd, Suite 100\nLos Angeles, CA 90001", "Mon–Fri 8am–6pm · Sat 9am–5pm"].map((item, i) => (
                <span key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 Revive Auto Detail. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service"].map(l => (
              <Link key={l} href="#" className="footer-legal">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
