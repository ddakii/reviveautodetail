"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/lib/utils";
import { getAppointmentStatusBadge } from "@/lib/status";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({ customerId: "", vehicleId: "", serviceId: "", date: "", time: "09:00", notes: "", price: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/appointments");
    const data = await res.json();
    setAppointments(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (showNew) {
      Promise.all([
        fetch("/api/customers?limit=100").then(r => r.json()),
        fetch("/api/services").then(r => r.json()),
      ]).then(([cData, sData]) => {
        setCustomers(cData.customers || []);
        setServices(sData || []);
      });
    }
  }, [showNew]);

  useEffect(() => {
    if (form.customerId) {
      fetch(`/api/vehicles?customerId=${form.customerId}`).then(r => r.json()).then(setVehicles);
    }
  }, [form.customerId]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.customerId || !form.date) return;
    setSaving(true);
    try {
      const datetime = new Date(`${form.date}T${form.time}:00`);
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: form.customerId,
          vehicleId: form.vehicleId || undefined,
          serviceId: form.serviceId || undefined,
          date: datetime.toISOString(),
          price: form.price ? parseFloat(form.price) : undefined,
          notes: form.notes,
          status: "CONFIRMED",
        }),
      });
      if (res.ok) { setShowNew(false); load(); }
    } finally {
      setSaving(false);
    }
  };

  const filtered = appointments.filter(a =>
    `${a.customer?.firstName} ${a.customer?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    a.reference.toLowerCase().includes(search.toLowerCase())
  );

  const statusCounts = {
    all: appointments.length,
    upcoming: appointments.filter(a => new Date(a.date) >= new Date() && ["CONFIRMED","REQUESTED"].includes(a.status)).length,
    completed: appointments.filter(a => a.status === "COMPLETED").length,
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Appointments</h1>
          <p className="text-[#707070] text-sm mt-0.5">{statusCounts.upcoming} upcoming · {statusCounts.completed} completed</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4" /> New Appointment
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707070]" />
        <input
          className="w-full h-10 pl-9 pr-3 border border-[#e5e5e3] bg-white text-sm focus:outline-none focus:border-[#0B0B0C]"
          placeholder="Search appointments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white border border-[#e5e5e3]">
        {loading ? (
          <div className="p-12 text-center text-[#707070]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Calendar className="h-12 w-12 text-[#e5e5e3] mx-auto mb-4" />
            <h3 className="font-semibold text-[#111111] mb-1">No appointments</h3>
            <Button onClick={() => setShowNew(true)} className="mt-2">Schedule First Appointment</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                  {["Reference", "Customer", "Vehicle", "Service", "Date & Time", "Price", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-[#f0f0ee] hover:bg-[#fafaf8] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">{a.reference}</td>
                    <td className="px-4 py-3 text-sm text-[#111111]">
                      <Link href={`/dashboard/customers/${a.customerId}`} className="hover:text-[#C9A86A]">
                        {a.customer?.firstName} {a.customer?.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#707070]">
                      {a.vehicle ? `${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{a.service?.name || "—"}</td>
                    <td className="px-4 py-3 text-sm text-[#111111]">{formatDate(a.date)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">{a.price ? formatCurrency(a.price) : "—"}</td>
                    <td className="px-4 py-3">{getAppointmentStatusBadge(a.status)}</td>
                    <td className="px-4 py-3">
                      <select
                        className="text-xs border border-[#e5e5e3] px-2 py-1 bg-white focus:outline-none"
                        value={a.status}
                        onChange={async (e) => {
                          await fetch(`/api/appointments/${a.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: e.target.value }),
                          });
                          load();
                        }}
                      >
                        {["REQUESTED","CONFIRMED","IN_PROGRESS","COMPLETED","CANCELLED","NO_SHOW"].map(s => (
                          <option key={s} value={s}>{s.replace("_"," ")}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <Select value={form.customerId} onValueChange={v => set("customerId", v)}>
              <SelectTrigger label="Customer"><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>
                {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={form.vehicleId} onValueChange={v => set("vehicleId", v)} disabled={!vehicles.length}>
              <SelectTrigger label="Vehicle"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
              <SelectContent>
                {vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.year} {v.make} {v.model}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={form.serviceId} onValueChange={v => set("serviceId", v)}>
              <SelectTrigger label="Service"><SelectValue placeholder="Select service" /></SelectTrigger>
              <SelectContent>
                {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Date" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
              <Input label="Time" type="time" value={form.time} onChange={e => set("time", e.target.value)} />
            </div>
            <Input label="Price (optional)" type="number" value={form.price} onChange={e => set("price", e.target.value)} />
            <Textarea label="Notes" value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button onClick={save} loading={saving}>Create Appointment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
