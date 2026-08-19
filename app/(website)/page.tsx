"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronRight, Check, Star } from "lucide-react";

const SERVICES = [
  { num: "01", name: "Full Detail",          tag: "Interior + Exterior",  price: 199,  slug: "full-detail",    img: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80" },
  { num: "02", name: "Paint Correction",     tag: "Defect Removal",       price: 350,  slug: "paint-correction",img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80" },
  { num: "03", name: "Ceramic Coating",      tag: "Long-term Protection", price: 750,  slug: "ceramic-coating", img: "https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=800&q=80" },
  { num: "04", name: "Interior Detail",      tag: "Deep Cleaning",        price: 149,  slug: "interior-detail", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
  { num: "05", name: "Paint Protection Film",tag: "Physical Shield",      price: 1200, slug: "ppf",             img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" },
  { num: "06", name: "Exterior Detail",      tag: "Surface Refinement",   price: 99,   slug: "exterior-detail", img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80" },
];

const TESTIMONIALS = [
  { name: "James R.", vehicle: "2023 Porsche 911 GT3",      rating: 5, text: "The paint correction on my 911 exceeded every expectation. The finish looks better than when it left the factory." },
  { name: "Sarah M.", vehicle: "2024 BMW M4 Competition",   rating: 5, text: "Revive is on another level. The ceramic coating has been flawless for 8 months. Will not go anywhere else." },
  { name: "David L.", vehicle: "2022 Mercedes-AMG GT",      rating: 5, text: "Professional from first contact to delivery. My AMG has never looked this good." },
];

const PROCESS = [
  { step: "01", title: "Inspection",    desc: "We assess your vehicle's condition and discuss your goals in detail." },
  { step: "02", title: "Preparation",  desc: "Thorough decontamination and pre-treatment before any detailing work." },
  { step: "03", title: "Detailing",    desc: "Meticulous service execution using only professional-grade products." },
  { step: "04", title: "Quality Check",desc: "Final inspection under controlled lighting to verify perfection." },
];

function ServiceCard({ svc }: { svc: typeof SERVICES[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative", overflow: "hidden", background: "#090909", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <img src={svc.img} alt={svc.name} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", opacity: hovered ? 0.32 : 0.55, transition: "opacity 0.35s, transform 0.5s", transform: hovered ? "scale(1.04)" : "scale(1)", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, padding: 28, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--c-gold)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>{svc.num}</div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{svc.name}</h3>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>{svc.tag}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--c-gold)" }}>From ${svc.price}</span>
          <Link href={`/services/${svc.slug}`} style={{ height: 30, padding: "0 12px", background: hovered ? "var(--c-gold)" : "rgba(255,255,255,0.1)", color: "#fff", borderRadius: 6, fontSize: 12, fontWeight: 500, display: "inline-flex", alignItems: "center", textDecoration: "none", transition: "background 0.2s" }}>
            View Service
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: "#F7F7F5" }}>

      {/* ── 01 HERO ──────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", background: "#090909", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1920&q=85" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(9,9,9,0.05) 0%, rgba(9,9,9,0.25) 40%, rgba(9,9,9,0.92) 100%)" }} />
        <div style={{ position: "absolute", top: 96, left: 48, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 1, height: 24, background: "var(--c-gold)", opacity: 0.5 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Premium Automotive Detailing</span>
        </div>
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 48px 88px", width: "100%" }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>— 01</div>
            <h1 style={{ fontSize: "clamp(44px, 6.5vw, 76px)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24 }}>
              Revive<br />
              <span style={{ color: "var(--c-gold)", fontWeight: 400, fontStyle: "italic" }}>Your Drive.</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.48)", lineHeight: 1.75, maxWidth: 520, marginBottom: 40 }}>
              Precision detailing, restoration, and protection for vehicles that deserve more.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <Link href="/booking" className="cta-gold" style={{ height: 48, padding: "0 28px", borderRadius: 10, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
                Book Your Detail <ArrowRight size={15} />
              </Link>
              <Link href="/services" className="cta-ghost" style={{ height: 48, padding: "0 28px", borderRadius: 10, fontWeight: 500, fontSize: 14, display: "inline-flex", alignItems: "center" }}>
                Explore Services
              </Link>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0, marginTop: 56, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 32 }}>
            {[["500+", "Vehicles Serviced"], ["5.0 ★", "Average Rating"], ["8 Years", "In Business"], ["100%", "Satisfaction"]].map(([val, lbl], i) => (
              <div key={i} style={{ paddingRight: 40, marginRight: 40, borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: "0.04em" }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 STATEMENT ──────────────────────────────────── */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E4E4E1" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "64px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>02 — Our Standard</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em", lineHeight: 1.25 }}>
              Every vehicle treated with the same obsessive care.
            </h2>
          </div>
          <p style={{ fontSize: 16, color: "var(--c-text-2)", lineHeight: 1.8 }}>
            Whether it's a daily driver or a six-figure supercar, every vehicle that enters our facility receives the highest level of attention. We use only professional-grade products and proven techniques — no shortcuts, no compromises.
          </p>
        </div>
      </section>

      {/* ── 03 SERVICES ───────────────────────────────────── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>03 — Services</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>Signature Services</h2>
          </div>
          <Link href="/services" style={{ fontSize: 13, color: "var(--c-gold)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--c-border)" }}>
          {SERVICES.map(svc => <ServiceCard key={svc.slug} svc={svc} />)}
        </div>
      </section>

      {/* ── 04 WHY REVIVE ─────────────────────────────────── */}
      <section style={{ background: "var(--c-ink)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>04 — Why Revive</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 20 }}>
              The standard of care your vehicle deserves.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.42)", lineHeight: 1.8, marginBottom: 36 }}>
              We combine advanced techniques with genuine passion for automotive excellence. Every decision is guided by one question: is this good enough for our own vehicles?
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {["Certified paint correction & IDA-certified technicians", "Professional-grade Gyeon, Gtechniq & CARPRO products", "Climate-controlled detailing facility", "Fully insured — every vehicle is protected", "Complimentary inspection with every service", "100% satisfaction guarantee"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: "rgba(184,155,99,0.12)", border: "1px solid rgba(184,155,99,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <Check size={11} color="var(--c-gold)" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80" alt="" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", borderRadius: 12 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 48 }}>
              <img src="https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=600&q=80" alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12 }} />
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 PROCESS ────────────────────────────────────── */}
      <section style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>05 — Process</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>How it works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--c-border)" }}>
            {PROCESS.map(({ step, title, desc }) => (
              <div key={step} style={{ background: "#fff", padding: "40px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--c-gold)", letterSpacing: "0.12em", marginBottom: 20 }}>{step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--c-ink)", marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "var(--c-text-2)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 TESTIMONIALS ───────────────────────────────── */}
      <section style={{ background: "#F7F7F5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>06 — Reviews</div>
            <h2 style={{ fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>Client Stories</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid var(--c-border)", borderRadius: 14, padding: 32 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="var(--c-gold)" color="var(--c-gold)" />)}
                </div>
                <p style={{ fontSize: 15, color: "var(--c-ink)", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ borderTop: "1px solid var(--c-border)", paddingTop: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 2 }}>{t.vehicle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 CTA ────────────────────────────────────────── */}
      <section style={{ background: "var(--c-ink)", position: "relative", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.1 }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto", padding: "96px 48px", textAlign: "center" }}>
          <div style={{ width: 1, height: 48, background: "var(--c-gold)", margin: "0 auto 32px", opacity: 0.4 }} />
          <h2 style={{ fontSize: "clamp(26px, 4vw, 50px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 20 }}>
            Your vehicle is ready to be revived.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", marginBottom: 36 }}>Schedule your appointment and experience the difference.</p>
          <Link href="/booking" className="cta-gold" style={{ height: 50, padding: "0 32px", borderRadius: 10, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
            Book Your Detail <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
