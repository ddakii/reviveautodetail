"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="bg-[#F5F5F3]">
      <div className="bg-[#0B0B0C] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-white/50">We'd love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-[#0B0B0C] mb-6">Get in Touch</h2>
            {sent ? (
              <div className="bg-white border border-[#e5e5e3] p-8 text-center">
                <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="font-bold text-[#111111] text-lg">Message Sent</h3>
                <p className="text-[#707070] mt-2">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div className="bg-white border border-[#e5e5e3] p-8 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Full Name" value={form.name} onChange={e => set("name", e.target.value)} />
                  <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
                <Input label="Phone" value={form.phone} onChange={e => set("phone", e.target.value)} />
                <Textarea label="Message" value={form.message} onChange={e => set("message", e.target.value)} rows={5} />
                <Button onClick={() => setSent(true)} className="w-full">Send Message</Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0B0B0C]">Contact Information</h2>
            {[
              { icon: Phone, label: "Phone", value: "(555) 847-2100" },
              { icon: Mail, label: "Email", value: "hello@reviveautodetail.com" },
              { icon: MapPin, label: "Address", value: "1420 Auto Blvd, Suite 100\nLos Angeles, CA 90001" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0B0B0C] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-[#C9A86A]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#707070] uppercase tracking-wider">{label}</div>
                  <div className="text-[#111111] text-sm mt-0.5 whitespace-pre-line">{value}</div>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#0B0B0C] flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-[#C9A86A]" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#707070] uppercase tracking-wider mb-1">Hours</div>
                {[
                  { day: "Mon – Fri", hours: "8:00 AM – 6:00 PM" },
                  { day: "Saturday", hours: "9:00 AM – 5:00 PM" },
                  { day: "Sunday", hours: "Closed" },
                ].map(h => (
                  <div key={h.day} className="flex items-center justify-between text-sm text-[#111111] border-b border-[#f0f0ee] py-1.5">
                    <span className="text-[#707070]">{h.day}</span>
                    <span className="font-medium">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
