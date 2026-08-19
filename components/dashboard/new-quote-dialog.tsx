"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewQuoteDialog({ open, onClose, onCreated }: Props) {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [expiresAt, setExpiresAt] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0];
  });
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState("0");
  const [taxRate, setTaxRate] = useState("0");
  const [items, setItems] = useState([{ serviceId: "", description: "", quantity: 1, unitPrice: 0 }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    Promise.all([
      fetch("/api/customers?limit=100").then(r => r.json()),
      fetch("/api/services").then(r => r.json()),
    ]).then(([cData, sData]) => {
      setCustomers(cData.customers || []);
      setServices(sData || []);
    });
  }, [open]);

  useEffect(() => {
    if (customerId) fetch(`/api/vehicles?customerId=${customerId}`).then(r => r.json()).then(setVehicles);
  }, [customerId]);

  const addItem = () => setItems(i => [...i, { serviceId: "", description: "", quantity: 1, unitPrice: 0 }]);
  const removeItem = (idx: number) => setItems(i => i.filter((_, j) => j !== idx));
  const updateItem = (idx: number, field: string, value: any) => {
    setItems(i => i.map((item, j) => {
      if (j !== idx) return item;
      const updated = { ...item, [field]: value };
      if (field === "serviceId") {
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
    if (!customerId || !items.some(i => i.description && i.unitPrice > 0)) return;
    setSaving(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId, vehicleId: vehicleId || undefined, expiresAt, notes,
          discount: disc, tax: parseFloat(taxRate) || 0,
          items: items.filter(i => i.description).map(i => ({ ...i, serviceId: i.serviceId || undefined })),
        }),
      });
      if (res.ok) { onCreated(); setItems([{ serviceId: "", description: "", quantity: 1, unitPrice: 0 }]); setCustomerId(""); setVehicleId(""); }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Create New Quote</DialogTitle></DialogHeader>
        <div className="space-y-5 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger label="Customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={vehicleId} onValueChange={setVehicleId} disabled={!vehicles.length}>
              <SelectTrigger label="Vehicle"><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.year} {v.make} {v.model}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Input label="Expiry Date" type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
          <div>
            <div className="text-xs font-medium text-[#707070] uppercase tracking-wider mb-2">Line Items</div>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <Select value={item.serviceId} onValueChange={v => updateItem(idx, "serviceId", v)}>
                      <SelectTrigger><SelectValue placeholder="Service" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom</SelectItem>
                        {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4">
                    <input className="w-full h-10 px-3 border border-[#e5e5e3] bg-white text-sm focus:outline-none" placeholder="Description" value={item.description} onChange={e => updateItem(idx, "description", e.target.value)} />
                  </div>
                  <div className="col-span-1">
                    <input className="w-full h-10 px-2 border border-[#e5e5e3] bg-white text-sm focus:outline-none text-center" type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="col-span-2">
                    <input className="w-full h-10 px-2 border border-[#e5e5e3] bg-white text-sm focus:outline-none" type="number" min="0" step="0.01" placeholder="$" value={item.unitPrice || ""} onChange={e => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {items.length > 1 && <button onClick={() => removeItem(idx)} className="text-[#707070] hover:text-red-500"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="mt-2 flex items-center gap-1 text-sm text-[#C9A86A] hover:underline"><Plus className="h-4 w-4" /> Add Item</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Discount ($)" type="number" value={discount} onChange={e => setDiscount(e.target.value)} />
            <Input label="Tax Rate (%)" type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
          </div>
          <div className="flex justify-between font-semibold text-[#111111]">
            <span>Total</span><span>{formatCurrency(total)}</span>
          </div>
          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={save} loading={saving}>Create Quote</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
