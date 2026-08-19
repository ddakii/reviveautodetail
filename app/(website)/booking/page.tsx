"use client";
import { useState, useEffect } from "react";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const FALLBACK_SERVICES = [
  { id: "", name: "Full Detail", price: 199, description: "Complete interior and exterior" },
  { id: "", name: "Interior Detail", price: 149, description: "Deep cleaning of all surfaces" },
  { id: "", name: "Exterior Detail", price: 99, description: "Hand wash, clay bar & wax" },
  { id: "", name: "Paint Correction", price: 350, description: "Remove swirls & scratches" },
  { id: "", name: "Ceramic Coating", price: 750, description: "Long-lasting paint protection" },
];

const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

type Step = 1 | 2 | 3 | 4;

export default function BookingPage() {
  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<any[]>(FALLBACK_SERVICES);
  const [serviceId, setServiceId] = useState("");
  const [vehicle, setVehicle] = useState({ year: "", make: "", model: "", color: "" });
  const [details, setDetails] = useState({ firstName: "", lastName: "", email: "", phone: "", preferredDate: "", preferredTime: "09:00", notes: "" });
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d.filter((s: any) => s.active !== false) : [];
        if (list.length) setServices(list);
      })
      .catch(() => {});
  }, []);

  const selectedService = services.find(s => s.id === serviceId);

  const submit = async () => {
    if (!serviceId || !details.phone || !details.preferredDate || !details.preferredTime) {
      setError("Please complete all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email,
          phone: details.phone,
          vehicleMake: vehicle.make,
          vehicleModel: vehicle.model,
          vehicleYear: parseInt(vehicle.year, 10),
          vehicleColor: vehicle.color || undefined,
          serviceId,
          serviceName: selectedService?.name,
          preferredDate: details.preferredDate,
          preferredTime: details.preferredTime,
          notes: details.notes || undefined,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) {
        setReference(data.reference || `RAD-${new Date().getFullYear()}-00001`);
        setStep(4);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const inp = (label: string, value: string, onChange: (v: string) => void, type = "text", required = false, placeholder = "") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 14, fontWeight: 500, color: "var(--c-text-2)" }}>{label}{required && <span style={{ color: "var(--c-red)", marginLeft: 2 }}>*</span>}</label>
      <input required={required} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ height: 48, padding: "0 16px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 15, fontFamily: "inherit", outline: "none", width: "100%", background: "var(--c-surface)" }} />
    </div>
  );

  const canSubmit = details.firstName && details.lastName && details.email && details.phone && details.preferredDate && details.preferredTime && !loading;

  return (
    <div style={{ background: "#F7F7F5", minHeight: "100vh", paddingTop: 64 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 24px" }}>

        {step < 4 && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-text-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              Step {step} of 3
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? "var(--c-gold)" : "var(--c-border-2)", transition: "background 0.3s" }} />
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em", marginBottom: 8 }}>Choose your service</h1>
            <p style={{ fontSize: 15, color: "var(--c-text-3)", marginBottom: 36 }}>Select the service that best fits your vehicle's needs.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 36 }}>
              {services.map((s: any) => (
                <button key={s.id || s.name} type="button" onClick={() => setServiceId(s.id)} disabled={!s.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "20px 20px",
                  background: serviceId === s.id ? "var(--c-ink)" : "var(--c-surface)",
                  border: `1px solid ${serviceId === s.id ? "var(--c-ink)" : "var(--c-border)"}`,
                  borderRadius: "var(--r-lg)", cursor: s.id ? "pointer" : "not-allowed", textAlign: "left",
                  opacity: s.id ? 1 : 0.6,
                }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: serviceId === s.id ? "#fff" : "var(--c-ink)" }}>{s.name}</div>
                    <div style={{ fontSize: 13, color: serviceId === s.id ? "rgba(255,255,255,0.55)" : "var(--c-text-3)", marginTop: 3 }}>{s.description || s.desc || ""}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: serviceId === s.id ? "var(--c-gold)" : "var(--c-ink)" }}>From ${s.price}</span>
                    {serviceId === s.id && <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--c-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={12} color="#fff" /></div>}
                  </div>
                </button>
              ))}
            </div>
            {!services.some((s: any) => s.id) && (
              <p style={{ fontSize: 13, color: "var(--c-red)", marginBottom: 16 }}>Services are still loading. Please wait a moment.</p>
            )}
            <button disabled={!serviceId} onClick={() => setStep(2)} style={{ width: "100%", height: 50, background: serviceId ? "var(--c-gold)" : "var(--c-border)", color: serviceId ? "#fff" : "var(--c-muted)", border: "none", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: 15, cursor: serviceId ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em", marginBottom: 8 }}>Your vehicle</h1>
            <p style={{ fontSize: 15, color: "var(--c-text-3)", marginBottom: 36 }}>Tell us about the vehicle being serviced.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {inp("Year", vehicle.year, v => setVehicle(p => ({ ...p, year: v })), "number", true, "2024")}
              {inp("Make", vehicle.make, v => setVehicle(p => ({ ...p, make: v })), "text", true, "BMW")}
              {inp("Model", vehicle.model, v => setVehicle(p => ({ ...p, model: v })), "text", true, "M4")}
              {inp("Color", vehicle.color, v => setVehicle(p => ({ ...p, color: v })), "text", false, "Black")}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, height: 50, background: "var(--c-surface)", border: "1px solid var(--c-border-2)", borderRadius: "var(--r-md)", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit", color: "var(--c-text-2)" }}>Back</button>
              <button disabled={!vehicle.year || !vehicle.make || !vehicle.model} onClick={() => setStep(3)} style={{ flex: 2, height: 50, background: vehicle.year && vehicle.make && vehicle.model ? "var(--c-gold)" : "var(--c-border)", color: vehicle.year && vehicle.make && vehicle.model ? "#fff" : "var(--c-muted)", border: "none", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: 15, cursor: vehicle.year && vehicle.make && vehicle.model ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                Continue <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em", marginBottom: 8 }}>Your information</h1>
            <p style={{ fontSize: 15, color: "var(--c-text-3)", marginBottom: 36 }}>We'll use this to confirm your appointment.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {inp("First Name", details.firstName, v => setDetails(p => ({ ...p, firstName: v })), "text", true)}
                {inp("Last Name", details.lastName, v => setDetails(p => ({ ...p, lastName: v })), "text", true)}
              </div>
              {inp("Email", details.email, v => setDetails(p => ({ ...p, email: v })), "email", true, "you@example.com")}
              {inp("Phone", details.phone, v => setDetails(p => ({ ...p, phone: v })), "tel", true, "(555) 000-0000")}
              {inp("Preferred Date", details.preferredDate, v => setDetails(p => ({ ...p, preferredDate: v })), "date", true)}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--c-text-2)" }}>Preferred Time <span style={{ color: "var(--c-red)" }}>*</span></label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TIMES.map(t => (
                    <button key={t} type="button" onClick={() => setDetails(p => ({ ...p, preferredTime: t }))} style={{
                      height: 40, padding: "0 14px",
                      borderRadius: "var(--r-md)",
                      border: `1px solid ${details.preferredTime === t ? "var(--c-ink)" : "var(--c-border-2)"}`,
                      background: details.preferredTime === t ? "var(--c-ink)" : "var(--c-surface)",
                      color: details.preferredTime === t ? "#fff" : "var(--c-ink)",
                      fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                    }}>{formatTime(t)}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 14, fontWeight: 500, color: "var(--c-text-2)" }}>Notes</label>
                <textarea value={details.notes} onChange={e => setDetails(p => ({ ...p, notes: e.target.value }))} placeholder="Any special requests…" style={{ height: 100, padding: "12px 16px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 15, fontFamily: "inherit", outline: "none", resize: "vertical", background: "var(--c-surface)" }} />
              </div>
            </div>

            <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 12 }}>Booking Summary</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                <span style={{ color: "var(--c-text-2)" }}>Service</span>
                <span style={{ fontWeight: 600, color: "var(--c-ink)" }}>{selectedService?.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--c-text-2)" }}>Vehicle</span>
                <span style={{ fontWeight: 600, color: "var(--c-ink)" }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
              </div>
            </div>

            {error && <div style={{ padding: "12px 16px", background: "var(--c-red-bg)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--c-red)", marginBottom: 16 }}>{error}</div>}

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, height: 50, background: "var(--c-surface)", border: "1px solid var(--c-border-2)", borderRadius: "var(--r-md)", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "inherit", color: "var(--c-text-2)" }}>Back</button>
              <button disabled={!canSubmit} onClick={submit} style={{ flex: 2, height: 50, background: canSubmit ? "var(--c-gold)" : "var(--c-border)", color: canSubmit ? "#fff" : "var(--c-muted)", border: "none", borderRadius: "var(--r-md)", fontWeight: 700, fontSize: 15, cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                {loading ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--c-green-bg)", border: "1px solid rgba(22,163,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Check size={28} color="var(--c-green)" />
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--c-ink)", marginBottom: 8 }}>Request Received</h1>
            <p style={{ fontSize: 15, color: "var(--c-text-3)", marginBottom: 36 }}>Your vehicle is one step closer to being revived.</p>
            <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 28, marginBottom: 36, textAlign: "left", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Reference", reference],
                ["Service", selectedService?.name],
                ["Vehicle", `${vehicle.year} ${vehicle.make} ${vehicle.model}`],
                ["Name", `${details.firstName} ${details.lastName}`],
                ["Email", details.email],
                ["Phone", details.phone],
                ["Date", details.preferredDate],
                ["Time", formatTime(details.preferredTime)],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--c-text-3)" }}>{label}</span>
                  <span style={{ fontWeight: 600, color: "var(--c-ink)" }}>{value}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, color: "var(--c-text-3)", marginBottom: 28 }}>We'll reach out within 24 hours to confirm your appointment.</p>
            <Link href="/" style={{ height: 46, padding: "0 28px", background: "var(--c-ink)", color: "#fff", borderRadius: "var(--r-md)", fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
