import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const apt = await prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        service: true,
        assignedTo: true,
        invoice: { include: { items: true } },
      },
    });
    if (!apt) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(apt);
  } catch {
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data: any = { ...body };
    if (data.date) data.date = new Date(data.date);
    const apt = await prisma.appointment.update({
      where: { id },
      data,
      include: { customer: true, vehicle: true, service: true },
    });
    return NextResponse.json(apt);
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
}
