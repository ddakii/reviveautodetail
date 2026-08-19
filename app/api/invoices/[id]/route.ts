import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        items: { include: { service: true } },
        payments: true,
        appointment: true,
        quote: true,
      },
    });
    if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(invoice);
  } catch {
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { items, taxRate, ...rest } = body;
    const updateData: any = { ...rest };
    if (rest.dueDate) updateData.dueDate = new Date(rest.dueDate);
    if (rest.issueDate) updateData.issueDate = new Date(rest.issueDate);
    if (items) {
      const subtotal = items.reduce((sum: number, i: any) => sum + i.quantity * i.unitPrice, 0);
      const discount = rest.discount || 0;
      const rate = taxRate || 0;
      const taxAmount = (subtotal - discount) * (rate / 100);
      updateData.subtotal = subtotal;
      updateData.tax = taxAmount;
      updateData.total = subtotal - discount + taxAmount;
      await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
      updateData.items = {
        create: items.map((item: any) => ({
          serviceId: item.serviceId || undefined,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
        })),
      };
    }
    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: { items: true, customer: true, vehicle: true, payments: true },
    });
    return NextResponse.json(invoice);
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
