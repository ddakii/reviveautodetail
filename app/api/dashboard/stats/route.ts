import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalCustomers, newCustomersThisMonth,
      invoices, thisMonthInvoices,
      appointments, upcomingAppointments,
      notifications,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.invoice.findMany({ select: { total: true, status: true, amountPaid: true, createdAt: true } }),
      prisma.invoice.findMany({
        where: { createdAt: { gte: startOfMonth } },
        select: { total: true, status: true },
      }),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: { date: { gte: now }, status: { in: ["CONFIRMED", "REQUESTED"] } },
      }),
      prisma.notification.count({ where: { read: false } }),
    ]);

    const totalRevenue = invoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + i.total, 0);

    const monthlyRevenue = thisMonthInvoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + i.total, 0);

    const outstanding = invoices
      .filter((i) => ["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(i.status))
      .reduce((sum, i) => sum + (i.total - i.amountPaid), 0);

    const outstandingCount = invoices.filter((i) =>
      ["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(i.status)
    ).length;

    const completedJobs = await prisma.appointment.count({ where: { status: "COMPLETED" } });

    // Revenue by month (last 6 months)
    const revenueByMonth: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthInvoices = invoices.filter(
        (inv) =>
          inv.status === "PAID" &&
          inv.createdAt >= start &&
          inv.createdAt <= end
      );
      revenueByMonth.push({
        month: start.toLocaleString("en-US", { month: "short" }),
        revenue: monthInvoices.reduce((sum, inv) => sum + inv.total, 0),
      });
    }

    return NextResponse.json({
      totalRevenue,
      monthlyRevenue,
      outstanding,
      outstandingCount,
      totalCustomers,
      newCustomersThisMonth,
      appointments,
      upcomingAppointments,
      completedJobs,
      unreadNotifications: notifications,
      revenueByMonth,
    });
  } catch {
    return NextResponse.json({
      totalRevenue: 0, monthlyRevenue: 0, outstanding: 0, outstandingCount: 0,
      totalCustomers: 0, newCustomersThisMonth: 0, appointments: 0,
      upcomingAppointments: 0, completedJobs: 0, unreadNotifications: 0,
      revenueByMonth: [],
    });
  }
}
