import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ background: "#F7F7F5", paddingTop: 64 }}>
      {/* Hero */}
      <section style={{ background: "#090909", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>About Us</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: 600 }}>
            Built on passion.<br />Defined by precision.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Our Story</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 20 }}>Started by a car enthusiast, built for car enthusiasts.</h2>
            <p style={{ fontSize: 15, color: "var(--c-text-2)", lineHeight: 1.8, marginBottom: 16 }}>
              Revive Auto Detail was founded in 2016 by Alex Rivera, a lifelong automotive enthusiast who was frustrated by the lack of truly professional detailing options in the market. What started as a one-man operation out of a garage quickly grew into one of the region's most trusted detailing facilities.
            </p>
            <p style={{ fontSize: 15, color: "var(--c-text-2)", lineHeight: 1.8 }}>
              Today, we serve hundreds of clients annually — from daily drivers to collector vehicles — applying the same meticulous standards to every job regardless of the vehicle's value or complexity.
            </p>
          </div>
          <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80" alt="Detailing at work" style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: 14 }} />
        </div>
      </section>

      {/* Values */}
      <section style={{ background: "var(--c-ink)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Our Values</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>What we stand for</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
            {[
              { num: "01", title: "Precision", desc: "Every detail matters. We take the time to do things right, not fast." },
              { num: "02", title: "Integrity", desc: "We're honest about what your vehicle needs and what it doesn't." },
              { num: "03", title: "Excellence", desc: "We use only professional-grade products and proven techniques." },
              { num: "04", title: "Passion", desc: "We genuinely care about cars. That passion shows in every result." },
            ].map(({ num, title, desc }) => (
              <div key={num} style={{ background: "var(--c-ink)", padding: "40px 28px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--c-gold)", letterSpacing: "0.12em", marginBottom: 20 }}>{num}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#F7F7F5" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "96px 48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em", marginBottom: 16 }}>Ready to experience the Revive difference?</h2>
          <p style={{ fontSize: 15, color: "var(--c-text-3)", marginBottom: 32 }}>Book your appointment and see why clients keep coming back.</p>
          <Link href="/booking" style={{ height: 48, padding: "0 28px", background: "var(--c-gold)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            Book Your Detail <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
