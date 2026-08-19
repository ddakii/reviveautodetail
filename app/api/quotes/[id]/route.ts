import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        items: { include: { service: true } },
        invoice: true,
      },
    });
    if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { items, ...rest } = body;
    const updateData: any = { ...rest };
    if (rest.expiresAt) updateData.expiresAt = new Date(rest.expiresAt);
    if (items) {
      const subtotal = items.reduce((sum: number, i: any) => sum + i.quantity * i.unitPrice, 0);
      const discount = rest.discount || 0;
      const taxRate = rest.taxRate || 0;
      const taxAmount = (subtotal - discount) * (taxRate / 100);
      updateData.subtotal = subtotal;
      updateData.tax = taxAmount;
      updateData.total = subtotal - discount + taxAmount;
      await prisma.quoteItem.deleteMany({ where: { quoteId: id } });
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
    const quote = await prisma.quote.update({
      where: { id },
      data: updateData,
      include: { items: true, customer: true, vehicle: true },
    });
    return NextResponse.json(quote);
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.quote.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
