import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuoteNumber } from "@/lib/counters";
import { z } from "zod";

const itemSchema = z.object({
  serviceId: z.string().optional(),
  description: z.string().min(1),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
});

const quoteSchema = z.object({
  customerId: z.string().min(1),
  vehicleId: z.string().optional(),
  status: z.string().optional(),
  discount: z.number().optional(),
  tax: z.number().optional(),
  notes: z.string().optional(),
  expiresAt: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const where: any = customerId ? { customerId } : {};

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, email: true } },
        vehicle: { select: { id: true, make: true, model: true, year: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(quotes);
  } catch {
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = quoteSchema.parse(body);
    const number = await generateQuoteNumber();

    const subtotal = data.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const discount = data.discount || 0;
    const taxRate = data.tax || 0;
    const taxAmount = (subtotal - discount) * (taxRate / 100);
    const total = subtotal - discount + taxAmount;

    const quote = await prisma.quote.create({
      data: {
        number,
        customerId: data.customerId,
        vehicleId: data.vehicleId || undefined,
        status: (data.status as any) || "DRAFT",
        subtotal,
        discount,
        tax: taxAmount,
        total,
        notes: data.notes,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        items: {
          create: data.items.map((item) => ({
            serviceId: item.serviceId || undefined,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: { items: true, customer: true, vehicle: true },
    });
    return NextResponse.json(quote, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}
