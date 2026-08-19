import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/counters";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: { items: true, invoice: true },
    });
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    if (quote.invoice) return NextResponse.json({ error: "Invoice already exists for this quote" }, { status: 409 });

    const number = await generateInvoiceNumber();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const invoice = await prisma.invoice.create({
      data: {
        number,
        customerId: quote.customerId,
        vehicleId: quote.vehicleId || undefined,
        quoteId: quote.id,
        status: "SENT",
        dueDate,
        subtotal: quote.subtotal,
        discount: quote.discount,
        tax: quote.tax,
        total: quote.total,
        notes: quote.notes,
        items: {
          create: quote.items.map((item) => ({
            serviceId: item.serviceId || undefined,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
          })),
        },
      },
      include: { items: true, customer: true },
    });

    await prisma.quote.update({ where: { id }, data: { status: "ACCEPTED" } });

    await prisma.notification.create({
      data: {
        title: "Invoice Created from Quote",
        message: `Invoice ${number} created from quote ${quote.number}`,
        type: "SUCCESS",
        link: `/dashboard/invoices/${invoice.id}`,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to convert quote to invoice" }, { status: 500 });
  }
}
