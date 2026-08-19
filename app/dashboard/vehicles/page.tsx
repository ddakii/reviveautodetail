"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Car, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const YEARS = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [form, setForm] = useState({ customerId: "", make: "", model: "", year: "", color: "", licensePlate: "", vin: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const q = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/vehicles${q}`);
    const data = await res.json();
    setVehicles(data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  useEffect(() => {
    if (showNew) {
      fetch("/api/customers?limit=100").then(r => r.json()).then(d => setCustomers(d.customers || []));
    }
  }, [showNew]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.customerId || !form.make || !form.model || !form.year) return;
    setSaving(true);
    try {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, year: parseInt(form.year) }),
      });
      if (res.ok) { setShowNew(false); load(); }
    } finally {
      setSaving(false);
    }
  };

  const filtered = vehicles.filter(v =>
    `${v.make} ${v.model}`.toLowerCase().includes(search.toLowerCase()) ||
    (v.licensePlate || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Vehicles</h1>
          <p className="text-[#707070] text-sm mt-0.5">{vehicles.length} vehicles</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4" /> Add Vehicle</Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707070]" />
        <input
          className="w-full h-10 pl-9 pr-3 border border-[#e5e5e3] bg-white text-sm focus:outline-none focus:border-[#0B0B0C]"
          placeholder="Search vehicles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full p-12 text-center text-[#707070]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full p-16 text-center bg-white border border-[#e5e5e3]">
            <Car className="h-12 w-12 text-[#e5e5e3] mx-auto mb-4" />
            <h3 className="font-semibold text-[#111111] mb-1">No vehicles</h3>
            <Button onClick={() => setShowNew(true)} className="mt-2">Add First Vehicle</Button>
          </div>
        ) : (
          filtered.map(v => (
            <div key={v.id} className="bg-white border border-[#e5e5e3] p-5 hover:border-[#C9A86A] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#0B0B0C] flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 text-[#C9A86A]" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-[#111111] text-sm">{v.year} {v.make} {v.model}</div>
                  <div className="text-[#707070] text-xs mt-0.5">{v.color || ""} {v.licensePlate ? `· ${v.licensePlate}` : ""}</div>
                </div>
              </div>
              {v.customer && (
                <Link href={`/dashboard/customers/${v.customer.id}`} className="mt-3 block text-xs text-[#707070] hover:text-[#C9A86A]">
                  {v.customer.firstName} {v.customer.lastName}
                </Link>
              )}
              <div className="mt-3 pt-3 border-t border-[#f0f0ee] text-xs text-[#707070]">
                {v._count?.appointments || 0} appointments
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Vehicle</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <Select value={form.customerId} onValueChange={v => set("customerId", v)}>
              <SelectTrigger label="Customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}</SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Make" value={form.make} onChange={e => set("make", e.target.value)} placeholder="BMW" />
              <Input label="Model" value={form.model} onChange={e => set("model", e.target.value)} placeholder="M4" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Select value={form.year} onValueChange={v => set("year", v)}>
                <SelectTrigger label="Year"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
              <Input label="Color" value={form.color} onChange={e => set("color", e.target.value)} />
              <Input label="License Plate" value={form.licensePlate} onChange={e => set("licensePlate", e.target.value)} />
            </div>
            <Input label="VIN (optional)" value={form.vin} onChange={e => set("vin", e.target.value)} />
            <Textarea label="Notes" value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={save} loading={saving}>Add Vehicle</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
