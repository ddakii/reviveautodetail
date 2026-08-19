import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const vehicleSchema = z.object({
  customerId: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2030),
  color: z.string().optional(),
  licensePlate: z.string().optional(),
  vin: z.string().optional(),
  mileage: z.number().optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const search = searchParams.get("search") || "";

    const where: any = customerId ? { customerId } : {};
    if (search) {
      where.OR = [
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
        { licensePlate: { contains: search, mode: "insensitive" } },
      ];
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(vehicles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = vehicleSchema.parse(body);
    const vehicle = await prisma.vehicle.create({ data });
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}
