"use client";
import { useState, useEffect, useCallback } from "react";
import { Wrench, Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, getDurationLabel } from "@/lib/utils";

const CATEGORIES = ["EXTERIOR", "INTERIOR", "CORRECTION", "PROTECTION", "MAINTENANCE"];

function ServiceModal({ service, onClose, onSaved }: { service: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(service ? { ...service } : { name: "", description: "", category: "MAINTENANCE", price: 0, duration: 60, active: true });
  const [loading, setLoading] = useState(false);
  const isEdit = !!service;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const url = isEdit ? `/api/services/${service.id}` : "/api/services";
    const method = isEdit ? "PATCH" : "POST";
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, price: Number(form.price), duration: Number(form.duration) }) });
    setLoading(false);
    if (r.ok) { onSaved(); onClose(); }
  };

  const f = (key: string, val: any) => setForm((p: any) => ({ ...p, [key]: val }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--c-surface)", borderRadius: "var(--r-xl)", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--c-ink)" }}>{isEdit ? "Edit Service" : "New Service"}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)", background: "transparent", cursor: "pointer", fontSize: 18, color: "var(--c-text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <form onSubmit={submit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Name <span style={{ color: "var(--c-red)" }}>*</span></label>
            <input required value={form.name} onChange={e => f("name", e.target.value)} placeholder="Full Detail" style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Description</label>
            <textarea value={form.description || ""} onChange={e => f("description", e.target.value)} style={{ padding: "10px 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 72 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Category</label>
              <select value={form.category} onChange={e => f("category", e.target.value)} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)" }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Price ($) <span style={{ color: "var(--c-red)" }}>*</span></label>
              <input required type="number" min="0" value={form.price} onChange={e => f("price", e.target.value)} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Duration (min)</label>
              <input type="number" min="0" value={form.duration} onChange={e => f("duration", e.target.value)} style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--c-text-2)" }}>
            <input type="checkbox" checked={form.active} onChange={e => f("active", e.target.checked)} style={{ width: 16, height: 16 }} />
            Active (visible on website)
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={loading}>{isEdit ? "Save Changes" : "Create Service"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ open: boolean; service: any }>({ open: false, service: null });

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/services").catch(() => null);
    if (r?.ok) { const d = await r.json(); setServices(Array.isArray(d) ? d : []); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      {modal.open && <ServiceModal service={modal.service} onClose={() => setModal({ open: false, service: null })} onSaved={load} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <PageHeader title="Services" description="Manage your detailing service offerings." action={<Button variant="primary" size="sm" onClick={() => setModal({ open: true, service: null })}><Plus size={14} /> New Service</Button>} />
        <div style={{ padding: 24 }}>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {services.length === 0 && !loading ? (
              <EmptyState icon={<Wrench size={20} />} title="No services yet" description="Create your first service to offer on your website." action={{ label: "Create Service", onClick: () => setModal({ open: true, service: null }) }} />
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Service", "Category", "Duration", "Price", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map((s: any) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background var(--t-fast)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--c-ink)" }}>{s.name}</div>
                        {s.description && <div style={{ fontSize: 12, color: "var(--c-text-3)", marginTop: 2, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description}</div>}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge variant="default" style={{ fontSize: 10 }}>{s.category}</Badge>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{getDurationLabel(s.duration)}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>{formatCurrency(s.price)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <Badge variant={s.active ? "success" : "default"}>{s.active ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button onClick={() => setModal({ open: true, service: s })} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--c-text-3)", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 4 }}>
                          <Pencil size={12} /> Edit
                        </button>
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
