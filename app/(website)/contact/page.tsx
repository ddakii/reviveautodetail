"use client";
import { useState } from "react";
import { Check } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: "#F7F7F5", paddingTop: 64, minHeight: "100vh" }}>
      <div className="wrap section-y-sm">
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-gold)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Contact</div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.025em" }}>Get in touch</h1>
        </div>

        <div className="grid-2-contact">
          {/* Info */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
              {[
                { label: "Phone", value: "(555) 847-2100" },
                { label: "Email", value: "hello@reviveautodetail.com" },
                { label: "Address", value: "1420 Auto Blvd, Suite 100\nLos Angeles, CA 90001" },
                { label: "Hours", value: "Mon–Fri  8:00am – 6:00pm\nSaturday  9:00am – 5:00pm\nSunday  Closed" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 8 }}>{label}</div>
                  <p style={{ fontSize: 15, color: "var(--c-ink)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="contact-card">
            {sent ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--c-green-bg)", border: "1px solid rgba(22,163,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <Check size={24} color="var(--c-green)" />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--c-ink)", marginBottom: 8 }}>Message sent</h2>
                <p style={{ fontSize: 14, color: "var(--c-text-3)" }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-ink)", marginBottom: 4 }}>Send us a message</h2>
                {[
                  { label: "Your Name", key: "name", required: true, placeholder: "John Carter" },
                  { label: "Email", key: "email", type: "email", required: true, placeholder: "you@example.com" },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "(555) 000-0000" },
                ].map(({ label, key, type = "text", required = false, placeholder }) => (
                  <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>{label}{required && <span style={{ color: "var(--c-red)", marginLeft: 2 }}>*</span>}</label>
                    <input required={required} type={type} value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} style={{ height: 44, padding: "0 14px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%" }} />
                  </div>
                ))}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Message <span style={{ color: "var(--c-red)" }}>*</span></label>
                  <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="How can we help you?" style={{ padding: "12px 14px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 120, width: "100%" }} />
                </div>
                <button type="submit" style={{ height: 48, background: "var(--c-gold)", color: "#fff", border: "none", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
