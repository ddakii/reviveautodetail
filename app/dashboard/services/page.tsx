"use client";
import { useState, useEffect, useCallback } from "react";
import { Plus, Wrench, Edit2, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, getDurationLabel } from "@/lib/utils";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "120", category: "EXTERIOR", active: true });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/services");
    const data = await res.json();
    setServices(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm({ name: "", description: "", price: "", duration: "120", category: "EXTERIOR", active: true }); setShowDialog(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ name: s.name, description: s.description || "", price: String(s.price), duration: String(s.duration), category: s.category, active: s.active }); setShowDialog(true); };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    const body = { name: form.name, description: form.description, price: parseFloat(form.price), duration: parseInt(form.duration), category: form.category as any, active: form.active };
    try {
      const res = await fetch(editing ? `/api/services/${editing.id}` : "/api/services", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) { setShowDialog(false); load(); }
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    load();
  };

  const CATEGORIES = ["EXTERIOR", "INTERIOR", "CORRECTION", "PROTECTION", "MAINTENANCE"];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Services</h1>
          <p className="text-[#707070] text-sm mt-0.5">{services.length} services</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Add Service</Button>
      </div>

      <div className="bg-white border border-[#e5e5e3]">
        {loading ? (
          <div className="p-12 text-center text-[#707070]">Loading...</div>
        ) : services.length === 0 ? (
          <div className="p-16 text-center">
            <Wrench className="h-12 w-12 text-[#e5e5e3] mx-auto mb-4" />
            <h3 className="font-semibold text-[#111111] mb-1">No services configured</h3>
            <Button onClick={openNew} className="mt-2">Add First Service</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                  {["Service", "Category", "Price", "Duration", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id} className="border-b border-[#f0f0ee] hover:bg-[#fafaf8] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#111111] text-sm">{s.name}</div>
                      <div className="text-[#707070] text-xs mt-0.5 line-clamp-1">{s.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-[10px]">{s.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">{formatCurrency(s.price)}</td>
                    <td className="px-4 py-3 text-sm text-[#707070] flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />{getDurationLabel(s.duration)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={s.active ? "success" : "secondary"}>{s.active ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(s)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-600" onClick={() => deleteService(s.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Input label="Service Name" value={form.name} onChange={e => set("name", e.target.value)} />
            <Textarea label="Description" value={form.description} onChange={e => set("description", e.target.value)} rows={2} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Price ($)" type="number" value={form.price} onChange={e => set("price", e.target.value)} />
              <Input label="Duration (minutes)" type="number" value={form.duration} onChange={e => set("duration", e.target.value)} />
            </div>
            <Select value={form.category} onValueChange={v => set("category", v)}>
              <SelectTrigger label="Category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={form.active} onChange={e => set("active", e.target.checked)} className="h-4 w-4" />
              <label htmlFor="active" className="text-sm text-[#111111]">Active (visible on website)</label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={save} loading={saving}>{editing ? "Save Changes" : "Add Service"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
