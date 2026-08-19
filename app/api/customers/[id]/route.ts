import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: true,
        appointments: {
          include: { service: true, vehicle: true, assignedTo: true },
          orderBy: { date: "desc" },
        },
        quotes: {
          include: { items: true, vehicle: true },
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          include: { items: true, vehicle: true },
          orderBy: { createdAt: "desc" },
        },
        payments: { include: { invoice: true }, orderBy: { paidAt: "desc" } },
        activities: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const totalSpent = customer.invoices.filter((i) => i.status === "PAID").reduce((sum, i) => sum + i.total, 0);
    return NextResponse.json({ ...customer, totalSpent });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const customer = await prisma.customer.update({ where: { id }, data: body });
    return NextResponse.json(customer);
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
