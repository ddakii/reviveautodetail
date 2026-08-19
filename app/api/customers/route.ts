import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const customerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: {
          vehicles: { select: { id: true, make: true, model: true, year: true } },
          _count: { select: { appointments: true, invoices: true } },
          invoices: { select: { total: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    const enriched = customers.map((c) => ({
      ...c,
      totalSpent: c.invoices
        .filter((i) => i.status === "PAID")
        .reduce((sum, i) => sum + i.total, 0),
    }));

    return NextResponse.json({ customers: enriched, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = customerSchema.parse(body);
    const customer = await prisma.customer.create({
      data: { ...data, email: data.email || undefined },
    });

    await prisma.activity.create({
      data: {
        customerId: customer.id,
        type: "CUSTOMER_CREATED",
        title: "Customer created",
        description: `${customer.firstName} ${customer.lastName} added to CRM`,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A customer with this email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
