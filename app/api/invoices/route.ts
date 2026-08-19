import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/counters";
import { z } from "zod";

const itemSchema = z.object({
  serviceId: z.string().optional(),
  description: z.string().min(1),
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1),
  vehicleId: z.string().optional(),
  appointmentId: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  discount: z.number().optional(),
  taxRate: z.number().optional(),
  notes: z.string().optional(),
  terms: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        vehicle: { select: { id: true, make: true, model: true, year: true, color: true } },
        items: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = invoiceSchema.parse(body);
    const number = await generateInvoiceNumber();

    const subtotal = data.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const discount = data.discount || 0;
    const taxRate = data.taxRate || 0;
    const taxAmount = (subtotal - discount) * (taxRate / 100);
    const total = subtotal - discount + taxAmount;

    const dueDate = data.dueDate
      ? new Date(data.dueDate)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const invoice = await prisma.invoice.create({
      data: {
        number,
        customerId: data.customerId,
        vehicleId: data.vehicleId || undefined,
        appointmentId: data.appointmentId || undefined,
        status: (data.status as any) || "DRAFT",
        dueDate,
        subtotal,
        discount,
        tax: taxAmount,
        total,
        notes: data.notes,
        terms: data.terms,
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

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
