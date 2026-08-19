import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, getDurationLabel } from "@/lib/utils";

async function getServices() {
  try {
    return await prisma.service.findMany({ where: { active: true }, orderBy: { price: "asc" } });
  } catch {
    return [];
  }
}

const FALLBACK_SERVICES = [
  { id: "1", name: "Maintenance Detail", slug: "maintenance-detail", description: "Regular maintenance wash and protection refresh to preserve your vehicle's finish.", price: 79, duration: 90, category: "MAINTENANCE", features: ["Hand wash & dry", "Tire & wheel cleaning", "Glass cleaning", "Interior wipe down", "Air freshener"] },
  { id: "2", name: "Exterior Detail", slug: "exterior-detail", description: "A thorough exterior treatment including hand wash, clay bar, and premium wax protection.", price: 99, duration: 120, category: "EXTERIOR", features: ["Hand wash & clay bar", "Iron decontamination", "Paint sealant", "Tire dressing", "Glass treatment"] },
  { id: "3", name: "Interior Detail", slug: "interior-detail", description: "Deep cleaning and restoration of all interior surfaces, upholstery, and trim.", price: 149, duration: 180, category: "INTERIOR", features: ["Deep vacuum & shampoo", "Leather conditioning", "Dashboard & trim detail", "Odor elimination", "Glass & mirror cleaning"] },
  { id: "4", name: "Full Detail", slug: "full-detail", description: "Complete interior and exterior transformation. The definitive detailing experience.", price: 199, duration: 240, category: "MAINTENANCE", features: ["Complete exterior detail", "Complete interior detail", "Engine bay cleaning", "Paint sealant", "Ceramic spray coating"] },
  { id: "5", name: "Paint Correction", slug: "paint-correction", description: "Remove swirl marks, light scratches, water spots, and oxidation to restore factory gloss.", price: 350, duration: 480, category: "CORRECTION", features: ["Multi-stage machine polish", "Swirl mark removal", "Scratch elimination", "Gloss enhancement", "Paint protection included"] },
  { id: "6", name: "Ceramic Coating", slug: "ceramic-coating", description: "Long-lasting paint protection with hydrophobic performance, deep gloss, and UV resistance.", price: 750, duration: 600, category: "PROTECTION", features: ["Paint correction prep", "Professional coating application", "2-year protection", "Hydrophobic protection", "UV resistance"] },
  { id: "7", name: "Paint Protection Film", slug: "ppf", description: "Ultimate clear bra protection against rock chips, road debris, and environmental damage.", price: 1200, duration: 720, category: "PROTECTION", features: ["Self-healing film", "Rock chip protection", "5-year warranty", "Invisible protection", "UV & stain resistance"] },
];

const SERVICE_IMAGES: Record<string, string> = {
  "maintenance-detail": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
  "exterior-detail": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&q=80",
  "interior-detail": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "full-detail": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80",
  "paint-correction": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80",
  "ceramic-coating": "https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=800&q=80",
  "ppf": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
};

export default async function ServicesPage() {
  const dbServices = await getServices();
  const services = dbServices.length > 0 ? dbServices : FALLBACK_SERVICES;

  return (
    <div className="bg-[#F5F5F3]">
      {/* Header */}
      <div className="bg-[#0B0B0C] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#C9A86A]" />
            <span className="text-[#C9A86A] text-xs font-medium tracking-[0.3em] uppercase">What We Offer</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-white/50 text-base max-w-xl">
            Every service is performed by certified professionals using premium products. 
            Your vehicle deserves nothing less.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="space-y-6">
          {services.map((service, i) => {
            const img = (service as any).image || SERVICE_IMAGES[(service as any).slug] || SERVICE_IMAGES["full-detail"];
            const features = (service as any).features || [];
            return (
              <div key={service.id} className="bg-white border border-[#e5e5e3] overflow-hidden">
                <div className="grid lg:grid-cols-5">
                  <div className="lg:col-span-2">
                    <img src={img} alt={service.name} className="w-full h-full object-cover min-h-[240px]" />
                  </div>
                  <div className="lg:col-span-3 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className="text-[#C9A86A] text-xs tracking-[0.2em] uppercase font-medium">{service.category}</span>
                          <h2 className="text-2xl font-bold text-[#0B0B0C] mt-1">{service.name}</h2>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#0B0B0C]">
                            {formatCurrency(service.price)}
                          </div>
                          <div className="text-[#707070] text-xs flex items-center gap-1 justify-end mt-0.5">
                            <Clock className="h-3 w-3" />
                            {getDurationLabel(service.duration)}
                          </div>
                        </div>
                      </div>
                      <p className="text-[#707070] text-sm leading-relaxed mb-6">{service.description}</p>

                      {features.length > 0 && (
                        <ul className="grid grid-cols-2 gap-2">
                          {features.map((f: string, j: number) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-[#111111]">
                              <div className="w-1.5 h-1.5 bg-[#C9A86A] flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#e5e5e3]">
                      <Button variant="default" asChild>
                        <Link href="/booking">Book This Service</Link>
                      </Button>
                      <Button variant="ghost" asChild>
                        <Link href={`/services/${(service as any).slug}`} className="flex items-center gap-1">
                          Learn More <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
