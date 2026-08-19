"use client";
import { useState } from "react";

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80", label: "Full Detail" },
  { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", label: "Interior Restoration" },
  { src: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80", label: "Paint Correction" },
  { src: "https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=800&q=80", label: "Ceramic Coating" },
  { src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", label: "PPF Installation" },
  { src: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80", label: "Exterior Detail" },
  { src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80", label: "Maintenance Detail" },
  { src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80", label: "Supercar Detail" },
  { src: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80", label: "Wheel Detailing" },
  { src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80", label: "Engine Bay" },
  { src: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80", label: "Classic Restoration" },
  { src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80", label: "Showroom Finish" },
];

function PhotoCard({ src, label }: { src: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: 10, cursor: "pointer", breakInside: "avoid", marginBottom: 16 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <img src={src} alt={label} style={{ width: "100%", display: "block", transition: "transform 0.4s", transform: hovered ? "scale(1.04)" : "scale(1)" }} />
      <div style={{ position: "absolute", inset: 0, background: `rgba(9,9,9,${hovered ? 0.55 : 0})`, transition: "background 0.3s", display: "flex", alignItems: "flex-end", padding: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }}>{label}</span>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <div style={{ background: "#F7F7F5", paddingTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 48px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Our Work</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.025em" }}>The results speak for themselves.</h1>
          <p style={{ fontSize: 15, color: "var(--c-text-3)", marginTop: 12, maxWidth: 440 }}>A selection of completed work across our full range of services.</p>
        </div>
        <div style={{ columns: 3, columnGap: 16 }}>
          {PHOTOS.map((photo, i) => <PhotoCard key={i} {...photo} />)}
        </div>
      </div>
    </div>
  );
}
