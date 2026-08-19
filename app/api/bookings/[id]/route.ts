import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const booking = await prisma.booking.update({ where: { id }, data: body });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
