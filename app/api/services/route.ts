import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const serviceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  duration: z.number().int().min(1),
  category: z.enum(["EXTERIOR", "INTERIOR", "CORRECTION", "PROTECTION", "MAINTENANCE"]),
  image: z.string().optional(),
  active: z.boolean().optional(),
});

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { price: "asc" } });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);
    const slug = slugify(data.name);
    const service = await prisma.service.create({
      data: { ...data, slug },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A service with this name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
