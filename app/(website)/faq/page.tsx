"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FAQS = [
  { q: "How long does a full detail take?", a: "A standard Full Detail typically takes 3–5 hours depending on the vehicle size and condition. Paint correction and ceramic coating services require additional time." },
  { q: "Do I need to make an appointment?", a: "Yes, we operate by appointment only to ensure every vehicle receives our full attention. Book online or call us directly." },
  { q: "How often should I detail my vehicle?", a: "We recommend a maintenance detail every 3–4 months to preserve your vehicle's finish. Vehicles with ceramic coatings benefit from annual maintenance services." },
  { q: "What products do you use?", a: "We use professional-grade products from industry-leading brands including Gyeon, Gtechniq, CarPro, and Koch Chemie. Only pH-safe, paint-safe products." },
  { q: "Do you offer ceramic coating warranties?", a: "Yes. Our ceramic coatings come with manufacturer warranties ranging from 2–5 years depending on the coating selected." },
  { q: "Can you remove scratches?", a: "Light to moderate scratches and swirl marks can be addressed through paint correction. Deep scratches that penetrate the primer may require professional paint repair." },
  { q: "Do you work on all vehicle types?", a: "We specialize in passenger vehicles including sedans, SUVs, trucks, and exotic/luxury vehicles. Please contact us for specialty vehicles." },
  { q: "What payment methods do you accept?", a: "We accept cash, all major credit/debit cards, and bank transfers. Payment is due upon completion of service." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-[#F5F5F3]">
      <div className="bg-[#0B0B0C] pt-40 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-4">FAQ</h1>
          <p className="text-white/50">Frequently asked questions about our services.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20">
        <div className="space-y-0 border border-[#e5e5e3] bg-white">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-[#e5e5e3] last:border-b-0">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#fafaf8] transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-[#111111] text-sm pr-4">{faq.q}</span>
                {open === i ? <Minus className="h-4 w-4 text-[#C9A86A] flex-shrink-0" /> : <Plus className="h-4 w-4 text-[#707070] flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-[#707070] text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#0B0B0C] p-8 text-center">
          <h3 className="text-white font-bold text-lg mb-2">Still have questions?</h3>
          <p className="text-white/50 text-sm mb-4">We're happy to help. Reach out directly.</p>
          <Button variant="gold" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
