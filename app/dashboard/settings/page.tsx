"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function Field({ label, value, onChange, type = "text", placeholder = "" }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>{label}</label>
      <input type={type} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)", width: "100%" }} />
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({ businessName: "Revive Auto Detail", email: "", phone: "", address: "", city: "", state: "", zip: "", website: "", businessHours: {} });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => { if (d && !d.error) setSettings(d); }).catch(() => {});
  }, []);

  const f = (key: string, val: any) => setSettings((p: any) => ({ ...p, [key]: val }));

  const save = async () => {
    setLoading(true);
    const r = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setLoading(false);
    if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader title="Settings" description="Manage your business information." />
      <div style={{ padding: 24, maxWidth: 720, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Business Info */}
        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--c-border)" }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-ink)" }}>Business Information</h2>
            <p style={{ fontSize: 13, color: "var(--c-text-3)", marginTop: 2 }}>Your business name, contact, and location details.</p>
          </div>
          <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Business Name" value={settings.businessName} onChange={(v: string) => f("businessName", v)} placeholder="Revive Auto Detail" />
            </div>
            <Field label="Email" value={settings.email} onChange={(v: string) => f("email", v)} placeholder="hello@reviveautodetail.com" />
            <Field label="Phone" value={settings.phone} onChange={(v: string) => f("phone", v)} placeholder="(555) 847-2100" />
            <Field label="Website" value={settings.website} onChange={(v: string) => f("website", v)} placeholder="https://reviveautodetail.com" />
            <div />
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Street Address" value={settings.address} onChange={(v: string) => f("address", v)} placeholder="1420 Auto Blvd, Suite 100" />
            </div>
            <Field label="City" value={settings.city} onChange={(v: string) => f("city", v)} placeholder="Los Angeles" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="State" value={settings.state} onChange={(v: string) => f("state", v)} placeholder="CA" />
              <Field label="ZIP" value={settings.zip} onChange={(v: string) => f("zip", v)} placeholder="90001" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button variant="primary" onClick={save} loading={loading}>Save Changes</Button>
          {saved && <span style={{ fontSize: 13, color: "var(--c-green)", fontWeight: 500 }}>✓ Saved successfully</span>}
        </div>
      </div>
    </div>
  );
}
