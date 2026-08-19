"use client";
import { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { AppointmentStatusBadge } from "@/lib/status";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function NewApptModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ customerId: "", vehicleId: "", serviceId: "", date: "", time: "09:00", duration: "120", notes: "" });
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/customers?limit=100").then(r => r.json()).then(d => setCustomers(d.customers || [])).catch(() => {});
    fetch("/api/services").then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.customerId) {
      fetch(`/api/vehicles?customerId=${form.customerId}`).then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : [])).catch(() => {});
    }
  }, [form.customerId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const dateTime = new Date(`${form.date}T${form.time}`);
    const r = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, date: dateTime.toISOString(), duration: parseInt(form.duration) }) });
    setLoading(false);
    if (r.ok) { onSaved(); onClose(); }
  };

  const sel = (label: string, key: string, options: { value: string; label: string }[], required = false) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>{label}{required && <span style={{ color: "var(--c-red)", marginLeft: 2 }}>*</span>}</label>
      <select required={required} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)" }}>
        <option value="">Select…</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--c-surface)", borderRadius: "var(--r-xl)", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--c-ink)" }}>New Appointment</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)", background: "transparent", cursor: "pointer", fontSize: 18, color: "var(--c-text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <form onSubmit={submit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          {sel("Customer", "customerId", customers.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` })), true)}
          {sel("Vehicle", "vehicleId", vehicles.map(v => ({ value: v.id, label: `${v.year} ${v.make} ${v.model}` })), true)}
          {sel("Service", "serviceId", services.map(s => ({ value: s.id, label: s.name })), true)}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Date <span style={{ color: "var(--c-red)" }}>*</span></label>
              <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Time</label>
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ padding: "10px 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 72 }} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={loading}>Create Appointment</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const params = useSearchParams();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(params.get("new") === "1");

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/appointments").catch(() => null);
    if (r?.ok) { const d = await r.json(); setAppointments(Array.isArray(d) ? d : []); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = appointments.filter(a =>
    search === "" || `${a.customer?.firstName} ${a.customer?.lastName} ${a.service?.name}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {showNew && <NewApptModal onClose={() => setShowNew(false)} onSaved={load} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <PageHeader
          title="Appointments"
          description="Schedule and manage service appointments."
          action={<Button variant="primary" size="sm" onClick={() => setShowNew(true)}><Plus size={14} /> New Appointment</Button>}
        />
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative", maxWidth: 360 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-text-3)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search appointments…" style={{ width: "100%", height: 38, paddingLeft: 36, paddingRight: 12, borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)" }} />
          </div>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 16, width: "70%" }} /></div>
            ) : filtered.length === 0 ? (
              <EmptyState icon={<Calendar size={20} />} title="No appointments" description="Schedule your first appointment." action={{ label: "New Appointment", onClick: () => setShowNew(true) }} />
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Date & Time", "Customer", "Vehicle", "Service", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background var(--t-fast)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--c-ink)" }}>{formatDate(a.date)}</div>
                        <div style={{ fontSize: 12, color: "var(--c-text-3)" }}>{new Date(a.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{a.customer?.firstName} {a.customer?.lastName}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{a.vehicle?.make} {a.vehicle?.model}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{a.service?.name}</td>
                      <td style={{ padding: "14px 16px" }}><AppointmentStatusBadge status={a.status} /></td>
                      <td style={{ padding: "14px 16px" }}>
                        <Link href={`/dashboard/customers/${a.customerId}`} style={{ fontSize: 12, color: "var(--c-gold)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          View <ChevronRight size={12} />
                        </Link>
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
