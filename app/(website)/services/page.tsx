import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  { num: "01", name: "Full Detail", tag: "Interior + Exterior", price: 199, duration: "4 hrs", slug: "full-detail", img: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80", desc: "Complete interior and exterior transformation. The definitive detailing experience for your vehicle." },
  { num: "02", name: "Interior Detail", tag: "Deep Cleaning", price: 149, duration: "3 hrs", slug: "interior-detail", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", desc: "Deep cleaning and restoration of all interior surfaces, upholstery, carpets, and trim." },
  { num: "03", name: "Exterior Detail", tag: "Surface Refinement", price: 99, duration: "2 hrs", slug: "exterior-detail", img: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80", desc: "Hand wash, clay bar decontamination, paint decontamination, and premium wax protection." },
  { num: "04", name: "Paint Correction", tag: "Defect Removal", price: 350, duration: "8 hrs", slug: "paint-correction", img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80", desc: "Remove swirl marks, light scratches, and oxidation to restore maximum gloss and clarity." },
  { num: "05", name: "Ceramic Coating", tag: "Long-term Protection", price: 750, duration: "10 hrs", slug: "ceramic-coating", img: "https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=800&q=80", desc: "Professional-grade ceramic coating for long-lasting hydrophobic protection and deep gloss." },
  { num: "06", name: "Paint Protection Film", tag: "Physical Shield", price: 1200, duration: "12 hrs", slug: "ppf", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", desc: "Self-healing PPF installation to protect against rock chips, road debris, and environmental damage." },
  { num: "07", name: "Maintenance Detail", tag: "Regular Upkeep", price: 79, duration: "1.5 hrs", slug: "maintenance-detail", img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80", desc: "Scheduled maintenance wash and protection refresh to preserve your vehicle's finish." },
];

export default function ServicesPage() {
  return (
    <div style={{ background: "#F7F7F5", paddingTop: 64 }}>
      {/* Header */}
      <section className="hero-banner" style={{ background: "#090909" }}>
        <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Our Services</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: 600 }}>
            Every service.<br />Executed perfectly.
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginTop: 20, maxWidth: 480, lineHeight: 1.7 }}>
            From a quick maintenance wash to a full ceramic coating installation, every service is delivered with the same obsessive attention to detail.
          </p>
        </div>
      </section>

      {/* Services */}
      <div className="wrap section-y-sm" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {SERVICES.map((svc, i) => (
          <div key={svc.slug} className="svc-block" style={{
            borderBottom: "1px solid var(--c-border)",
            background: i % 2 === 0 ? "#fff" : "#F7F7F5",
          }}>
            {i % 2 !== 0 && (
              <div className="svc-media" style={{ overflow: "hidden" }}>
                <img src={svc.img} alt={svc.name} style={{ width: "100%", height: "100%", minHeight: 280, objectFit: "cover" }} />
              </div>
            )}
            <div className="svc-copy">
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--c-gold)", letterSpacing: "0.12em", marginBottom: 12 }}>{svc.num}</div>
              <h2 style={{ fontSize: "clamp(20px, 2.5vw, 30px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em", marginBottom: 8 }}>{svc.name}</h2>
              <div style={{ fontSize: 12, color: "var(--c-text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>{svc.tag}</div>
              <p style={{ fontSize: 15, color: "var(--c-text-2)", lineHeight: 1.7, marginBottom: 28 }}>{svc.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--c-ink)" }}>From ${svc.price}</div>
                  <div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 2 }}>Approx. {svc.duration}</div>
                </div>
                <Link href="/booking" style={{ height: 40, padding: "0 20px", background: "var(--c-gold)", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
                  Book This Service <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            {i % 2 === 0 && (
              <div className="svc-media" style={{ overflow: "hidden" }}>
                <img src={svc.img} alt={svc.name} style={{ width: "100%", height: "100%", minHeight: 280, objectFit: "cover" }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
