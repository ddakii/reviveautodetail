import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#F5F5F3]">
      <div className="bg-[#0B0B0C] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#C9A86A]" />
            <span className="text-[#C9A86A] text-xs font-medium tracking-[0.3em] uppercase">Our Story</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">About Revive</h1>
          <p className="text-white/50 text-base max-w-xl">
            We started with a single mission: to bring professional-grade automotive detailing to discerning vehicle owners.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-4xl font-bold text-[#0B0B0C] mb-6">
              Built on<br />
              <span className="font-['Playfair_Display'] italic font-normal text-[#C9A86A]">precision.</span>
            </h2>
            <p className="text-[#707070] leading-relaxed mb-6">
              Revive Auto Detail was founded by a team of automotive enthusiasts who were tired of mediocre detailing services. We believe every vehicle deserves the same level of care — whether it's a daily commuter or a weekend supercar.
            </p>
            <p className="text-[#707070] leading-relaxed mb-8">
              Our certified technicians use only professional-grade products and proven techniques to ensure your vehicle receives the best possible treatment.
            </p>
            <Button variant="gold" asChild>
              <Link href="/booking" className="flex items-center gap-2">
                Book an Appointment <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80" alt="Our facility" className="w-full h-[500px] object-cover" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { number: "500+", label: "Vehicles Serviced" },
            { number: "8yr", label: "In Business" },
            { number: "5★", label: "Average Rating" },
            { number: "100%", label: "Satisfaction Guaranteed" },
          ].map(s => (
            <div key={s.label} className="bg-[#0B0B0C] p-8 text-center">
              <div className="text-3xl font-bold text-[#C9A86A]">{s.number}</div>
              <div className="text-white/50 text-sm mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
