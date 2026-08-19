"use client";

import Link from "next/link";
import { ArrowRight, Shield, Star, Award, Zap, ChevronRight, Check } from "lucide-react";

const GOLD = "#C9A86A";
const BLACK = "#0B0B0C";
const WHITE = "#FFFFFF";
const SURFACE = "#F5F5F3";
const BORDER = "#e5e5e3";
const MUTED = "#707070";

const TRUST_ITEMS = [
  { Icon: Shield, label: "Paint-Safe Techniques", desc: "Industry-leading products that protect your investment." },
  { Icon: Star, label: "Expert Detailers", desc: "Certified professionals with years of experience." },
  { Icon: Award, label: "Premium Products", desc: "Professional-grade products from trusted brands." },
  { Icon: Zap, label: "Attention to Detail", desc: "Every inch of your vehicle treated with precision." },
];

const TESTIMONIALS = [
  { name: "James R.", vehicle: "2023 Porsche 911 GT3", rating: 5, text: "The paint correction on my 911 exceeded every expectation. The finish looks better than when it left the factory. Truly exceptional work." },
  { name: "Sarah M.", vehicle: "2024 BMW M4 Competition", rating: 5, text: "I've tried several detailers over the years — Revive is on another level. The ceramic coating has been flawless for 8 months now." },
  { name: "David L.", vehicle: "2022 Mercedes-AMG GT", rating: 5, text: "Professional from first contact to final delivery. My AMG has never looked this good. Highly recommend for any premium vehicle owner." },
];

const SERVICES = [
  { name: "Full Detail", slug: "full-detail", desc: "Complete interior and exterior transformation. The definitive detailing experience.", price: 199, img: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80" },
  { name: "Interior Detail", slug: "interior-detail", desc: "Deep cleaning and restoration of all interior surfaces, upholstery, and trim.", price: 149, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { name: "Exterior Detail", slug: "exterior-detail", desc: "Hand wash, clay bar, paint decontamination, and premium wax protection.", price: 99, img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80" },
  { name: "Paint Correction", slug: "paint-correction", desc: "Remove swirl marks, scratches, and oxidation to restore maximum gloss.", price: 350, img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80" },
  { name: "Ceramic Coating", slug: "ceramic-coating", desc: "Long-lasting paint protection with hydrophobic performance and deep gloss.", price: 750, img: "https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=600&q=80" },
  { name: "Paint Protection Film", slug: "ppf", desc: "Ultimate paint protection against rock chips, road debris, and environmental damage.", price: 1200, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
  { name: "Maintenance Detail", slug: "maintenance-detail", desc: "Regular maintenance wash and protection refresh to preserve your vehicle's finish.", price: 79, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80" },
];

export default function HomePage() {
  return (
    <div style={{ background: SURFACE }}>
      {/* ─── HERO ─── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        background: BLACK,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
        <img
          src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1920&q=80"
          alt="Premium detailing"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0B0B0C 40%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0B0B0C 10%, transparent 60%)" }} />
        {/* Gold left accent */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: GOLD }} />

        <div style={{ position: "relative", width: "100%", maxWidth: 1280, margin: "0 auto", padding: "160px 48px 80px" }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ height: 1, width: 32, background: GOLD }} />
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase" }}>
                Premium Automotive Detailing
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 800, color: WHITE, lineHeight: 1.0, letterSpacing: "-0.02em", marginBottom: 24 }}>
              Restore<br />
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: GOLD }}>
                the Drive.
              </span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
              Premium automotive detailing engineered to restore, protect, and elevate your vehicle.
              Every service is performed with precision and the finest professional-grade products.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <Link href="/booking" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: GOLD, color: BLACK, padding: "16px 32px",
                fontWeight: 700, fontSize: 15, letterSpacing: "0.02em",
                textDecoration: "none", transition: "background 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#b8964f")}
                onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
              >
                Book Your Detail <ArrowRight size={16} />
              </Link>
              <Link href="/services" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                border: `1px solid rgba(255,255,255,0.25)`, color: WHITE, padding: "16px 32px",
                fontWeight: 500, fontSize: 15, textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
              >
                Explore Services
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 56 }}>
              {[["500+", "Vehicles Serviced"], ["5★", "Average Rating"], ["8yr", "Experience"]].map(([val, lbl], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 32 }}>
                  {i > 0 && <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.15)" }} />}
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 700, color: WHITE }}>{val}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section style={{ background: WHITE, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
            {TRUST_ITEMS.map(({ Icon, label, desc }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 44, height: 44, background: BLACK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color={GOLD} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{label}</div>
                  <div style={{ fontSize: 13, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 48px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ height: 1, width: 24, background: GOLD }} />
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase" }}>What We Offer</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: BLACK, lineHeight: 1.1 }}>
              Premium{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}>Detailing Services</span>
            </h2>
          </div>
          <Link href="/services" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: MUTED, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = BLACK)}
            onMouseLeave={e => (e.currentTarget.style.color = MUTED)}
          >
            View All Services <ChevronRight size={14} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 0, border: `1px solid ${BORDER}` }}>
          {SERVICES.map((svc, i) => (
            <ServiceCard key={i} svc={svc} />
          ))}
        </div>
      </section>

      {/* ─── WHY REVIVE ─── */}
      <section style={{ background: BLACK, padding: "96px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ height: 1, width: 24, background: GOLD }} />
              <span style={{ color: GOLD, fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase" }}>Why Revive</span>
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: WHITE, lineHeight: 1.1, marginBottom: 24 }}>
              We treat your vehicle{" "}
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: GOLD }}>as our own.</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
              Every vehicle that comes through our facility receives the same level of meticulous care —
              whether it's a daily driver or a six-figure supercar. We don't cut corners.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Certified paint correction specialists",
                "IDA-certified detailing technicians",
                "Professional-grade Gyeon and Gtechniq products",
                "Climate-controlled detailing bay",
                "Fully insured facility",
                "Complimentary vehicle inspection with every service",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.65)", fontSize: 14 }}>
                  <div style={{ width: 22, height: 22, border: `1px solid rgba(201,168,106,0.4)`, background: "rgba(201,168,106,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={12} color={GOLD} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80" alt="Paint correction" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 40 }}>
              <img src="https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=600&q=80" alt="Ceramic coating" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" alt="Interior" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "96px 48px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ height: 1, width: 24, background: GOLD }} />
            <span style={{ color: GOLD, fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase" }}>Client Stories</span>
            <div style={{ height: 1, width: 24, background: GOLD }} />
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: BLACK }}>What Our Clients Say</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: WHITE, border: `1px solid ${BORDER}`, padding: 40 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill={GOLD} color={GOLD} />
                ))}
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: "#111", lineHeight: 1.7, marginBottom: 24 }}>
                "{t.text}"
              </p>
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{t.vehicle}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ position: "relative", background: BLACK, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80"
          alt="Luxury vehicle"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(11,11,12,0.7)" }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto", padding: "96px 48px", textAlign: "center" }}>
          <div style={{ width: 64, height: 1, background: GOLD, margin: "0 auto 32px" }} />
          <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 700, color: WHITE, lineHeight: 1.1, marginBottom: 20 }}>
            Your vehicle deserves{" "}
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, color: GOLD }}>to be revived.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
            Schedule your appointment today and experience the Revive Auto Detail difference.
          </p>
          <Link href="/booking" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: GOLD, color: BLACK, padding: "18px 40px",
            fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "#b8964f")}
            onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
          >
            Book Your Detail <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ svc }: { svc: typeof SERVICES[number] }) {
  return (
    <div
      style={{ borderRight: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, background: WHITE, cursor: "pointer", transition: "background 0.3s" }}
      onMouseEnter={e => (e.currentTarget.style.background = BLACK)}
      onMouseLeave={e => (e.currentTarget.style.background = WHITE)}
    >
      <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
        <img
          src={svc.img}
          alt={svc.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s, filter 0.3s", filter: "grayscale(30%)" }}
        />
      </div>
      <div style={{ padding: 20 }}>
        <h3 style={{ fontWeight: 600, fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: "#111", transition: "color 0.3s" }}>{svc.name}</h3>
        <p style={{ fontSize: 12, color: MUTED, marginTop: 6, lineHeight: 1.5, transition: "color 0.3s" }}>{svc.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <span style={{ color: GOLD, fontWeight: 700, fontSize: 14 }}>From ${svc.price}</span>
          <Link href={`/services/${svc.slug}`} style={{ fontSize: 12, color: MUTED, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            Details <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
