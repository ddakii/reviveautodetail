import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const team = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true, phone: true } });
    return NextResponse.json(team);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, role, password } = await req.json();
    const hashed = await bcrypt.hash(password || "Revive2026!", 10);
    const user = await prisma.user.create({
      data: { name, email, phone, role, password: hashed },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
