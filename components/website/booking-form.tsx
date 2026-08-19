"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, ArrowRight } from "lucide-react";

interface Service { id: string; name: string; price: number; }

const FALLBACK_SERVICES: Service[] = [
  { id: "full-detail", name: "Full Detail — from $199", price: 199 },
  { id: "interior-detail", name: "Interior Detail — from $149", price: 149 },
  { id: "exterior-detail", name: "Exterior Detail — from $99", price: 99 },
  { id: "paint-correction", name: "Paint Correction — from $350", price: 350 },
  { id: "ceramic-coating", name: "Ceramic Coating — from $750", price: 750 },
  { id: "ppf", name: "Paint Protection Film — from $1,200", price: 1200 },
  { id: "maintenance-detail", name: "Maintenance Detail — from $79", price: 79 },
];

const TIMES = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => String(CURRENT_YEAR - i));

export function BookingForm({ services }: { services?: any[] }) {
  const svcList = (services && services.length > 0) ? services.map((s: any) => ({ id: s.id, name: `${s.name} — from $${s.price}`, price: s.price })) : FALLBACK_SERVICES;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    vehicleMake: "", vehicleModel: "", vehicleYear: "", vehicleColor: "", licensePlate: "",
    serviceId: "", preferredDate: "", preferredTime: "", notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ reference: string } | null>(null);

  const set = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone) e.phone = "Required";
    if (!form.vehicleMake) e.vehicleMake = "Required";
    if (!form.vehicleModel) e.vehicleModel = "Required";
    if (!form.vehicleYear) e.vehicleYear = "Required";
    if (!form.serviceId) e.serviceId = "Please select a service";
    if (!form.preferredDate) e.preferredDate = "Required";
    if (!form.preferredTime) e.preferredTime = "Required";
    return e;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, vehicleYear: parseInt(form.vehicleYear) }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess({ reference: data.reference });
      } else {
        setErrors({ _general: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setErrors({ _general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-[#e5e5e3] p-12 text-center">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#0B0B0C] mb-2">Request Received</h2>
        <p className="text-[#707070] mb-6">Your booking request has been submitted. We'll confirm within 24 hours.</p>
        <div className="inline-block bg-[#0B0B0C] text-white px-6 py-3 mb-6">
          <div className="text-xs text-white/50 tracking-widest uppercase mb-1">Booking Reference</div>
          <div className="text-xl font-bold tracking-wider">{success.reference}</div>
        </div>
        <p className="text-[#707070] text-sm">Save this reference number for your records.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {errors._general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          {errors._general}
        </div>
      )}

      <div className="bg-white border border-[#e5e5e3] p-8">
        <h3 className="font-semibold text-[#0B0B0C] text-sm uppercase tracking-wider mb-6 pb-3 border-b border-[#e5e5e3]">
          Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="First Name" value={form.firstName} onChange={e => set("firstName", e.target.value)} error={errors.firstName} placeholder="Michael" />
          <Input label="Last Name" value={form.lastName} onChange={e => set("lastName", e.target.value)} error={errors.lastName} placeholder="Carter" />
          <Input label="Email Address" type="email" value={form.email} onChange={e => set("email", e.target.value)} error={errors.email} placeholder="michael@example.com" />
          <Input label="Phone Number" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} error={errors.phone} placeholder="(555) 000-0000" />
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e3] p-8">
        <h3 className="font-semibold text-[#0B0B0C] text-sm uppercase tracking-wider mb-6 pb-3 border-b border-[#e5e5e3]">
          Vehicle Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Make" value={form.vehicleMake} onChange={e => set("vehicleMake", e.target.value)} error={errors.vehicleMake} placeholder="BMW" />
          <Input label="Model" value={form.vehicleModel} onChange={e => set("vehicleModel", e.target.value)} error={errors.vehicleModel} placeholder="M4 Competition" />
          <Select value={form.vehicleYear} onValueChange={v => set("vehicleYear", v)}>
            <SelectTrigger label="Year" error={errors.vehicleYear}>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input label="Color" value={form.vehicleColor} onChange={e => set("vehicleColor", e.target.value)} placeholder="Black" />
          <Input label="License Plate (optional)" value={form.licensePlate} onChange={e => set("licensePlate", e.target.value)} placeholder="ABC-1234" />
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e3] p-8">
        <h3 className="font-semibold text-[#0B0B0C] text-sm uppercase tracking-wider mb-6 pb-3 border-b border-[#e5e5e3]">
          Service & Schedule
        </h3>
        <div className="space-y-4">
          <Select value={form.serviceId} onValueChange={v => set("serviceId", v)}>
            <SelectTrigger label="Service" error={errors.serviceId}>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {svcList.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Preferred Date"
              type="date"
              value={form.preferredDate}
              onChange={e => set("preferredDate", e.target.value)}
              error={errors.preferredDate}
              min={new Date().toISOString().split("T")[0]}
            />
            <Select value={form.preferredTime} onValueChange={v => set("preferredTime", v)}>
              <SelectTrigger label="Preferred Time" error={errors.preferredTime}>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            label="Additional Notes (optional)"
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
            placeholder="Any specific concerns or requests..."
            rows={3}
          />
        </div>
      </div>

      <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
        Submit Booking Request
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}
