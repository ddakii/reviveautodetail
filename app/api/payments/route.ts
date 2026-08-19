import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  customerId: z.string().min(1),
  amount: z.number().min(0.01),
  method: z.enum(["CASH", "CARD", "BANK_TRANSFER", "OTHER"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
  paidAt: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId");
    const customerId = searchParams.get("customerId");
    const where: any = {};
    if (invoiceId) where.invoiceId = invoiceId;
    if (customerId) where.customerId = customerId;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        invoice: { select: { id: true, number: true, total: true, status: true } },
        customer: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { paidAt: "desc" },
    });
    return NextResponse.json(payments);
  } catch {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = paymentSchema.parse(body);

    const payment = await prisma.payment.create({
      data: {
        invoiceId: data.invoiceId,
        customerId: data.customerId,
        amount: data.amount,
        method: data.method,
        reference: data.reference,
        notes: data.notes,
        paidAt: data.paidAt ? new Date(data.paidAt) : new Date(),
      },
    });

    // Update invoice amountPaid and status
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { payments: true },
    });

    if (invoice) {
      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + data.amount;
      let newStatus: string = invoice.status;

      if (totalPaid >= invoice.total) {
        newStatus = "PAID";
      } else if (totalPaid > 0) {
        newStatus = "PARTIALLY_PAID";
      }

      await prisma.invoice.update({
        where: { id: data.invoiceId },
        data: { amountPaid: totalPaid, status: newStatus as any },
      });

      if (newStatus === "PAID") {
        await prisma.notification.create({
          data: {
            title: "Invoice Paid",
            message: `Invoice ${invoice.number} has been paid in full`,
            type: "SUCCESS",
            link: `/dashboard/invoices/${invoice.id}`,
          },
        });
      }
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
