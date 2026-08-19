"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const field: React.CSSProperties = {
  height: 40,
  padding: "0 12px",
  borderRadius: "var(--r-md)",
  border: "1px solid var(--c-border-2)",
  fontSize: 14,
  fontFamily: "inherit",
  outline: "none",
  background: "var(--c-surface)",
  width: "100%",
};

export function NewQuoteDialog({ open, onClose, onCreated }: Props) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState("0");
  const [taxRate, setTaxRate] = useState("0");
  const [items, setItems] = useState([{ serviceId: "", description: "", quantity: 1, unitPrice: 0 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    Promise.all([
      fetch("/api/customers?limit=100").then(r => r.json()),
      fetch("/api/services").then(r => r.json()),
    ]).then(([cData, sData]) => {
      setCustomers(Array.isArray(cData?.customers) ? cData.customers : []);
      setServices(Array.isArray(sData) ? sData : []);
    }).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!customerId) { setVehicles([]); setVehicleId(""); return; }
    fetch(`/api/vehicles?customerId=${customerId}`)
      .then(r => r.json())
      .then(d => setVehicles(Array.isArray(d) ? d : []))
      .catch(() => setVehicles([]));
  }, [customerId]);

  if (!open) return null;

  const addItem = () => setItems(i => [...i, { serviceId: "", description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (idx: number) => setItems(i => i.filter((_, j) => j !== idx));
  const updateItem = (idx: number, fieldName: string, value: any) => {
    setItems(i => i.map((item, j) => {
      if (j !== idx) return item;
      const updated = { ...item, [fieldName]: value };
      if (fieldName === "serviceId") {
        const svc = services.find(s => s.id === value);
        if (svc) { updated.description = svc.name; updated.unitPrice = svc.price; }
      }
      return updated;
    }));
  };

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const disc = parseFloat(discount) || 0;
  const tax = (subtotal - disc) * ((parseFloat(taxRate) || 0) / 100);
  const total = subtotal - disc + tax;

  const save = async () => {
    if (!customerId) { setError("Please select a customer."); return; }
    if (!items.some(i => i.description && i.unitPrice > 0)) { setError("Add at least one line item."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          vehicleId: vehicleId || undefined,
          expiresAt,
          notes,
          discount: disc,
          tax: parseFloat(taxRate) || 0,
          items: items.filter(i => i.description).map(i => ({
            serviceId: i.serviceId || undefined,
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        }),
      });
      if (res.ok) {
        onCreated();
        setItems([{ serviceId: "", description: "", quantity: 1, unitPrice: 0 }]);
        setCustomerId("");
        setVehicleId("");
        setNotes("");
        onClose();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Failed to create quote.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--c-surface)", borderRadius: "var(--r-xl)", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--c-ink)" }}>New Quote</h2>
            <p style={{ fontSize: 13, color: "var(--c-text-3)", marginTop: 2 }}>Create a quote for a customer</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)", background: "transparent", cursor: "pointer", fontSize: 18, color: "var(--c-text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {error && <div style={{ padding: "10px 12px", background: "var(--c-red-bg)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "var(--r-md)", fontSize: 13, color: "var(--c-red)" }}>{error}</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Customer <span style={{ color: "var(--c-red)" }}>*</span></label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)} style={field}>
                <option value="">Select customer…</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Vehicle</label>
              <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} disabled={!vehicles.length} style={field}>
                <option value="">Optional</option>
                {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Expiry Date</label>
            <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} style={field} />
          </div>

          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)", marginBottom: 8 }}>Line Items</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.4fr 70px 90px 32px", gap: 8, alignItems: "center" }}>
                  <select value={item.serviceId} onChange={e => updateItem(idx, "serviceId", e.target.value)} style={field}>
                    <option value="">Service…</option>
                    {services.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <input placeholder="Description" value={item.description} onChange={e => updateItem(idx, "description", e.target.value)} style={field} />
                  <input type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} style={{ ...field, textAlign: "center" }} />
                  <input type="number" min="0" step="0.01" placeholder="Price" value={item.unitPrice || ""} onChange={e => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)} style={field} />
                  {items.length > 1 ? (
                    <button type="button" onClick={() => removeItem(idx)} style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer", color: "var(--c-text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={14} />
                    </button>
                  ) : <div />}
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem} style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--c-gold)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 500, padding: 0 }}>
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Discount ($)</label>
              <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} style={field} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Tax Rate (%)</label>
              <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} style={field} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700, color: "var(--c-ink)", paddingTop: 4 }}>
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ ...field, height: 80, padding: "10px 12px", resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="button" loading={saving} onClick={save}>Create Quote</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
