import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.businessSettings.findFirst();
    if (!settings) {
      settings = await prisma.businessSettings.create({
        data: { id: "default", name: "Revive Auto Detail" },
      });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = await prisma.businessSettings.findFirst();
    let settings;
    if (existing) {
      settings = await prisma.businessSettings.update({ where: { id: existing.id }, data: body });
    } else {
      settings = await prisma.businessSettings.create({ data: { id: "default", ...body } });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
