import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateBookingReference } from "@/lib/counters";
import { z } from "zod";

const bookingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  vehicleYear: z.number().int().min(1900).max(2030),
  vehicleColor: z.string().optional(),
  licensePlate: z.string().optional(),
  serviceId: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    // Get service name
    let serviceName: string | undefined;
    try {
      const svc = await prisma.service.findUnique({ where: { id: data.serviceId } });
      serviceName = svc?.name;
    } catch {}

    const reference = await generateBookingReference();

    const booking = await prisma.booking.create({
      data: {
        reference,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vehicleYear: data.vehicleYear,
        vehicleColor: data.vehicleColor,
        licensePlate: data.licensePlate,
        serviceId: data.serviceId,
        serviceName,
        preferredDate: new Date(data.preferredDate),
        preferredTime: data.preferredTime,
        notes: data.notes,
      },
    });

    // Create notification
    try {
      await prisma.notification.create({
        data: {
          title: "New Booking Request",
          message: `${data.firstName} ${data.lastName} requested ${serviceName || "a service"} — ${reference}`,
          type: "INFO",
          link: "/dashboard/appointments",
        },
      });
    } catch {}

    return NextResponse.json({ reference: booking.reference, id: booking.id }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid form data", details: error.errors }, { status: 400 });
    }
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to submit booking" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
