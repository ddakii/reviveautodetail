"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    name: "Revive Auto Detail",
    email: "hello@reviveautodetail.com",
    phone: "(555) 847-2100",
    address: "1420 Auto Blvd, Suite 100",
    city: "Los Angeles",
    state: "CA",
    zip: "90001",
    website: "https://reviveautodetail.com",
    taxRate: 0,
    currency: "USD",
    invoicePrefix: "INV",
    quotePrefix: "QUO",
    aptPrefix: "APT",
    invoiceTerms: "Payment due within 30 days.",
    footerMessage: "Thank you for trusting Revive Auto Detail with your vehicle.",
    mondayHours: "8:00 AM – 6:00 PM",
    tuesdayHours: "8:00 AM – 6:00 PM",
    wednesdayHours: "8:00 AM – 6:00 PM",
    thursdayHours: "8:00 AM – 6:00 PM",
    fridayHours: "8:00 AM – 6:00 PM",
    saturdayHours: "9:00 AM – 5:00 PM",
    sundayHours: "Closed",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: any) => setSettings((s: any) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Settings</h1>
          <p className="text-[#707070] text-sm mt-0.5">Manage your business settings</p>
        </div>
        <Button onClick={save} loading={saving} variant={saved ? "ghost" : "default"}>
          {saved ? <><CheckCircle className="h-4 w-4 text-emerald-600" /> Saved</> : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6">
        <section className="bg-white border border-[#e5e5e3] p-6">
          <h2 className="font-semibold text-[#111111] text-sm uppercase tracking-wider mb-4 pb-3 border-b border-[#e5e5e3]">Business Information</h2>
          <div className="space-y-4">
            <Input label="Business Name" value={settings.name} onChange={e => set("name", e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Email" type="email" value={settings.email} onChange={e => set("email", e.target.value)} />
              <Input label="Phone" value={settings.phone} onChange={e => set("phone", e.target.value)} />
            </div>
            <Input label="Address" value={settings.address} onChange={e => set("address", e.target.value)} />
            <div className="grid grid-cols-3 gap-3">
              <Input label="City" value={settings.city} onChange={e => set("city", e.target.value)} />
              <Input label="State" value={settings.state} onChange={e => set("state", e.target.value)} />
              <Input label="ZIP" value={settings.zip} onChange={e => set("zip", e.target.value)} />
            </div>
            <Input label="Website" value={settings.website} onChange={e => set("website", e.target.value)} />
          </div>
        </section>

        <section className="bg-white border border-[#e5e5e3] p-6">
          <h2 className="font-semibold text-[#111111] text-sm uppercase tracking-wider mb-4 pb-3 border-b border-[#e5e5e3]">Invoice & Quote Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Input label="Invoice Prefix" value={settings.invoicePrefix} onChange={e => set("invoicePrefix", e.target.value)} />
              <Input label="Quote Prefix" value={settings.quotePrefix} onChange={e => set("quotePrefix", e.target.value)} />
              <Input label="Apt. Prefix" value={settings.aptPrefix} onChange={e => set("aptPrefix", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Tax Rate (%)" type="number" value={settings.taxRate} onChange={e => set("taxRate", parseFloat(e.target.value) || 0)} />
              <Input label="Currency" value={settings.currency} onChange={e => set("currency", e.target.value)} />
            </div>
            <Textarea label="Invoice Terms" value={settings.invoiceTerms} onChange={e => set("invoiceTerms", e.target.value)} rows={2} />
            <Textarea label="Invoice Footer Message" value={settings.footerMessage} onChange={e => set("footerMessage", e.target.value)} rows={2} />
          </div>
        </section>

        <section className="bg-white border border-[#e5e5e3] p-6">
          <h2 className="font-semibold text-[#111111] text-sm uppercase tracking-wider mb-4 pb-3 border-b border-[#e5e5e3]">Business Hours</h2>
          <div className="space-y-3">
            {[
              { day: "Monday", key: "mondayHours" },
              { day: "Tuesday", key: "tuesdayHours" },
              { day: "Wednesday", key: "wednesdayHours" },
              { day: "Thursday", key: "thursdayHours" },
              { day: "Friday", key: "fridayHours" },
              { day: "Saturday", key: "saturdayHours" },
              { day: "Sunday", key: "sundayHours" },
            ].map(({ day, key }) => (
              <div key={key} className="grid grid-cols-3 gap-3 items-center">
                <label className="text-sm font-medium text-[#111111]">{day}</label>
                <div className="col-span-2">
                  <Input value={(settings as any)[key]} onChange={e => set(key, e.target.value)} placeholder="Closed" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
