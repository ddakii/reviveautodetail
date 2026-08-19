import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAppointmentReference } from "@/lib/counters";
import { z } from "zod";

const appointmentSchema = z.object({
  customerId: z.string().min(1),
  vehicleId: z.string().optional(),
  serviceId: z.string().optional(),
  assignedToId: z.string().optional(),
  date: z.string().min(1),
  duration: z.number().optional(),
  price: z.number().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: any = {};
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
        vehicle: { select: { id: true, make: true, model: true, year: true, color: true } },
        service: { select: { id: true, name: true, price: true, duration: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(appointments);
  } catch {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = appointmentSchema.parse(body);
    const reference = await generateAppointmentReference();

    const appointment = await prisma.appointment.create({
      data: {
        reference,
        customerId: data.customerId,
        vehicleId: data.vehicleId || undefined,
        serviceId: data.serviceId || undefined,
        assignedToId: data.assignedToId || undefined,
        date: new Date(data.date),
        duration: data.duration || 120,
        price: data.price,
        status: (data.status as any) || "CONFIRMED",
        notes: data.notes,
      },
      include: {
        customer: true,
        vehicle: true,
        service: true,
      },
    });

    await prisma.notification.create({
      data: {
        title: "Appointment Scheduled",
        message: `Appointment ${reference} scheduled for ${appointment.customer.firstName} ${appointment.customer.lastName}`,
        type: "SUCCESS",
        link: `/dashboard/appointments`,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
