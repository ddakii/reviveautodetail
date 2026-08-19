import { BookingForm } from "@/components/website/booking-form";
import { prisma } from "@/lib/prisma";

async function getServices() {
  try {
    return await prisma.service.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export default async function BookingPage() {
  const services = await getServices();

  return (
    <div className="bg-[#F5F5F3] min-h-screen">
      <div className="bg-[#0B0B0C] pt-40 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#C9A86A]" />
            <span className="text-[#C9A86A] text-xs font-medium tracking-[0.3em] uppercase">Schedule Service</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Book Your Detail</h1>
          <p className="text-white/50">
            Fill out the form below and our team will confirm your appointment within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <BookingForm services={services} />
      </div>
    </div>
  );
}
