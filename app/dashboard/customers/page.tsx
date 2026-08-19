"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Plus, Users, Mail, Phone, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers?search=${encodeURIComponent(search)}&page=${page}&limit=20`);
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const save = async () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowNew(false);
        setForm({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "", notes: "" });
        load();
      } else {
        const d = await res.json();
        setErrors({ _: d.error });
      }
    } finally {
      setSaving(false);
    }
  };

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Customers</h1>
          <p className="text-[#707070] text-sm mt-0.5">{total} total customers</p>
        </div>
        <Button variant="default" onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707070]" />
        <input
          className="w-full h-10 pl-9 pr-3 border border-[#e5e5e3] bg-white text-sm focus:outline-none focus:border-[#0B0B0C]"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e5e3] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#707070]">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="h-12 w-12 text-[#e5e5e3] mx-auto mb-4" />
            <h3 className="font-semibold text-[#111111] mb-1">No customers yet</h3>
            <p className="text-[#707070] text-sm mb-4">Start building your customer database.</p>
            <Button onClick={() => setShowNew(true)}>Add First Customer</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                  {["Customer", "Phone", "Email", "Vehicles", "Total Spent", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-b border-[#f0f0ee] hover:bg-[#fafaf8] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0B0B0C] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {getInitials(`${c.firstName} ${c.lastName}`)}
                        </div>
                        <div>
                          <div className="font-medium text-[#111111] text-sm">{c.firstName} {c.lastName}</div>
                          <div className="text-[#707070] text-xs">{formatDate(c.createdAt)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#707070]">{c.phone || "—"}</td>
                    <td className="px-4 py-4 text-sm text-[#707070]">{c.email || "—"}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-[#707070]">
                        <Car className="h-3.5 w-3.5" />
                        {c.vehicles?.length || 0}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-[#111111]">
                      {formatCurrency(c.totalSpent || 0)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={c.status === "ACTIVE" ? "success" : "secondary"}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/dashboard/customers/${c.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Customer Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {errors._ && <p className="text-red-600 text-sm">{errors._}</p>}
            <div className="grid grid-cols-2 gap-3">
              <Input label="First Name" value={form.firstName} onChange={e => set("firstName", e.target.value)} error={errors.firstName} />
              <Input label="Last Name" value={form.lastName} onChange={e => set("lastName", e.target.value)} error={errors.lastName} />
            </div>
            <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
            <Input label="Phone" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} />
            <Input label="Address" value={form.address} onChange={e => set("address", e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
              <Input label="City" value={form.city} onChange={e => set("city", e.target.value)} />
              <Input label="State" value={form.state} onChange={e => set("state", e.target.value)} />
              <Input label="ZIP" value={form.zip} onChange={e => set("zip", e.target.value)} />
            </div>
            <Textarea label="Notes" value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={save} loading={saving}>Create Customer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
