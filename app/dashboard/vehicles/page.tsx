"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Car, Plus, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

function NewVehicleModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ customerId: "", make: "", model: "", year: new Date().getFullYear(), color: "", licensePlate: "", vin: "", notes: "" });
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/customers?limit=100").then(r => r.json()).then(d => setCustomers(d.customers || [])).catch(() => {});
  }, []);

  const f = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));
  const inp = (label: string, key: string, type = "text", required = false, placeholder = "") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>{label}{required && <span style={{ color: "var(--c-red)", marginLeft: 2 }}>*</span>}</label>
      <input required={required} type={type} value={(form as any)[key]} onChange={e => f(key, type === "number" ? Number(e.target.value) : e.target.value)} placeholder={placeholder} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
    </div>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("/api/vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (r.ok) { onSaved(); onClose(); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--c-surface)", borderRadius: "var(--r-xl)", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--c-ink)" }}>New Vehicle</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)", background: "transparent", cursor: "pointer", fontSize: 18, color: "var(--c-text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <form onSubmit={submit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Customer <span style={{ color: "var(--c-red)" }}>*</span></label>
            <select required value={form.customerId} onChange={e => f("customerId", e.target.value)} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)" }}>
              <option value="">Select customer…</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {inp("Make", "make", "text", true, "BMW")}
            {inp("Model", "model", "text", true, "M4")}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {inp("Year", "year", "number", true)}
            {inp("Color", "color", "text", false, "Black")}
            {inp("License Plate", "licensePlate")}
          </div>
          {inp("VIN", "vin", "text", false, "Optional")}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={loading}>Add Vehicle</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const params = useSearchParams();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(params.get("new") === "1");

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/vehicles").catch(() => null);
    if (r?.ok) { const d = await r.json(); setVehicles(Array.isArray(d) ? d : []); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = vehicles.filter(v => search === "" || `${v.make} ${v.model} ${v.year} ${v.customer?.firstName} ${v.customer?.lastName}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {showNew && <NewVehicleModal onClose={() => setShowNew(false)} onSaved={load} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <PageHeader title="Vehicles" description="Manage customer vehicles and service history." action={<Button variant="primary" size="sm" onClick={() => setShowNew(true)}><Plus size={14} /> Add Vehicle</Button>} />
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative", maxWidth: 360 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-text-3)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vehicles…" style={{ width: "100%", height: 38, paddingLeft: 36, paddingRight: 12, borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)" }} />
          </div>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {filtered.length === 0 ? (
              <EmptyState icon={<Car size={20} />} title="No vehicles yet" description="Add a vehicle to start tracking service history." action={{ label: "Add Vehicle", onClick: () => setShowNew(true) }} />
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Vehicle", "Customer", "Color", "License Plate", "Added", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v: any) => (
                    <tr key={v.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background var(--t-fast)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--c-ink)" }}>{v.year} {v.make} {v.model}</div>
                        {v.vin && <div style={{ fontSize: 12, color: "var(--c-text-3)" }}>VIN: {v.vin.slice(-8)}</div>}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{v.customer?.firstName} {v.customer?.lastName}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{v.color || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{v.licensePlate || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--c-text-3)" }}>{v.createdAt ? formatDate(v.createdAt) : "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {v.customerId && <Link href={`/dashboard/customers/${v.customerId}`} style={{ fontSize: 12, color: "var(--c-gold)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>View <ChevronRight size={12} /></Link>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
