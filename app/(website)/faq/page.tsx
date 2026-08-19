"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FAQS = [
  { q: "How long does a full detail take?", a: "A full detail typically takes 4–6 hours depending on the vehicle size and condition. We'll give you a more specific time estimate when you book." },
  { q: "Do I need to be present during the service?", a: "No, you can drop off your vehicle and we'll contact you when it's ready. We offer complimentary loaner arrangements for longer services." },
  { q: "How long does a ceramic coating last?", a: "A professionally applied ceramic coating typically lasts 2–5 years depending on the product used, maintenance, and environmental conditions." },
  { q: "What's the difference between wax and ceramic coating?", a: "Wax provides temporary protection lasting 1–3 months. Ceramic coating is a semi-permanent chemical bond that lasts years and provides superior protection and hydrophobic properties." },
  { q: "Can paint correction remove all scratches?", a: "Paint correction can remove swirl marks and light scratches that haven't penetrated through the clear coat. Deep scratches that reach the base coat or primer cannot be removed by polishing alone." },
  { q: "How should I maintain my vehicle after a ceramic coating?", a: "Avoid washing for 7 days after application. Use pH-neutral soap for washing, avoid automatic car washes with brushes, and schedule maintenance details every 6–12 months." },
  { q: "Do you offer mobile detailing?", a: "We currently service vehicles at our climate-controlled facility only. This ensures the best possible results and consistent quality." },
  { q: "How do I book an appointment?", a: "You can book online through our booking form, or call us directly at (555) 847-2100. We recommend booking at least a week in advance for larger services." },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--c-border)" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16, fontFamily: "inherit" }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: "var(--c-ink)", lineHeight: 1.4 }}>{question}</span>
        <div style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid var(--c-border-2)", background: open ? "var(--c-ink)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
          {open ? <Minus size={13} color="#fff" /> : <Plus size={13} color="var(--c-text-3)" />}
        </div>
      </button>
      {open && (
        <div style={{ paddingBottom: 20 }}>
          <p style={{ fontSize: 15, color: "var(--c-text-2)", lineHeight: 1.8 }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div style={{ background: "#F7F7F5", paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 48px" }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>FAQ</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.025em" }}>Common questions</h1>
          <p style={{ fontSize: 15, color: "var(--c-text-3)", marginTop: 12 }}>Can't find your answer? Contact us directly.</p>
        </div>

        <div style={{ marginBottom: 64 }}>
          {FAQS.map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
        </div>

        <div style={{ background: "var(--c-ink)", borderRadius: 16, padding: "40px 40px", textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Still have questions?</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>We're happy to help. Get in touch with our team.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" style={{ height: 42, padding: "0 24px", background: "var(--c-gold)", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
              Contact Us <ArrowRight size={14} />
            </Link>
            <Link href="/booking" style={{ height: 42, padding: "0 24px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, fontWeight: 500, fontSize: 14, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
