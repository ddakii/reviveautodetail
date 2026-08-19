import { prisma } from "./prisma";

export async function getNextCounter(name: string): Promise<number> {
  const counter = await prisma.counter.upsert({
    where: { name },
    update: { value: { increment: 1 } },
    create: { name, value: 1 },
  });
  return counter.value;
}

export async function generateInvoiceNumber(): Promise<string> {
  const settings = await prisma.businessSettings.findFirst();
  const prefix = settings?.invoicePrefix ?? "INV";
  const year = new Date().getFullYear();
  const n = await getNextCounter(`invoice_${year}`);
  return `${prefix}-${year}-${String(n).padStart(4, "0")}`;
}

export async function generateQuoteNumber(): Promise<string> {
  const settings = await prisma.businessSettings.findFirst();
  const prefix = settings?.quotePrefix ?? "QUO";
  const year = new Date().getFullYear();
  const n = await getNextCounter(`quote_${year}`);
  return `${prefix}-${year}-${String(n).padStart(4, "0")}`;
}

export async function generateAppointmentReference(): Promise<string> {
  const settings = await prisma.businessSettings.findFirst();
  const prefix = settings?.aptPrefix ?? "APT";
  const year = new Date().getFullYear();
  const n = await getNextCounter(`appointment_${year}`);
  return `${prefix}-${year}-${String(n).padStart(4, "0")}`;
}

export async function generateBookingReference(): Promise<string> {
  const year = new Date().getFullYear();
  const n = await getNextCounter(`booking_${year}`);
  return `RAD-${year}-${String(n).padStart(5, "0")}`;
}
