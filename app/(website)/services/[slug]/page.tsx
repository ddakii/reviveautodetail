import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Check } from "lucide-react";
import { formatCurrency, getDurationLabel } from "@/lib/utils";

const SERVICE_IMAGES: Record<string, string> = {
  "maintenance-detail": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
  "exterior-detail": "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1200&q=80",
  "interior-detail": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  "full-detail": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80",
  "paint-correction": "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=1200&q=80",
  "ceramic-coating": "https://images.unsplash.com/photo-1635773054018-571e8f5d5a93?w=1200&q=80",
  "ppf": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  "engine-bay": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1200&q=80",
};

async function getService(slug: string) {
  try {
    return await prisma.service.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const img = service.image || SERVICE_IMAGES[slug] || SERVICE_IMAGES["full-detail"];

  return (
    <div className="bg-[#F5F5F3]">
      <div className="relative bg-[#0B0B0C] pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={img} alt={service.name} className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-[#0B0B0C]/70" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <span className="text-[#C9A86A] text-xs tracking-[0.3em] uppercase">{service.category}</span>
          <h1 className="text-5xl font-bold text-white mt-2 mb-4">{service.name}</h1>
          <div className="flex items-center gap-6 text-white/50">
            <span className="text-2xl font-bold text-[#C9A86A]">From {formatCurrency(service.price)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{getDurationLabel(service.duration)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#0B0B0C] mb-4">About This Service</h2>
            <p className="text-[#707070] leading-relaxed text-base">{service.description}</p>
          </div>
          <div className="bg-[#0B0B0C] p-6">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-2">Starting From</div>
            <div className="text-3xl font-bold text-[#C9A86A] mb-4">{formatCurrency(service.price)}</div>
            <div className="text-white/50 text-sm mb-6">Duration: {getDurationLabel(service.duration)}</div>
            <Button variant="gold" className="w-full" asChild>
              <Link href="/booking">Book This Service</Link>
            </Button>
            <Link href="/services" className="block text-center text-white/40 text-xs mt-3 hover:text-white/60">← All Services</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
