import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, Car, Calendar, DollarSign, Receipt, Clock } from "lucide-react";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import Link from "next/link";

async function getStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCustomers, newCustomers,
      invoices, upcomingAppointments,
      completedJobs, recentAppointments,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.invoice.findMany({ select: { total: true, status: true, amountPaid: true, createdAt: true, number: true, id: true, customer: { select: { firstName: true, lastName: true } } } }),
      prisma.appointment.count({ where: { date: { gte: now }, status: { in: ["CONFIRMED", "REQUESTED"] } } }),
      prisma.appointment.count({ where: { status: "COMPLETED" } }),
      prisma.appointment.findMany({
        where: { date: { gte: now } },
        include: { customer: true, service: true, vehicle: true },
        orderBy: { date: "asc" },
        take: 5,
      }),
    ]);

    const totalRevenue = invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0);
    const monthRevenue = invoices.filter((i) => i.status === "PAID" && i.createdAt >= startOfMonth).reduce((s, i) => s + i.total, 0);
    const outstanding = invoices.filter((i) => ["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(i.status)).reduce((s, i) => s + (i.total - i.amountPaid), 0);
    const outstandingCount = invoices.filter((i) => ["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(i.status)).length;

    const revenueByMonth: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const rev = invoices.filter((inv) => inv.status === "PAID" && inv.createdAt >= start && inv.createdAt <= end).reduce((sum, inv) => sum + inv.total, 0);
      revenueByMonth.push({ month: start.toLocaleString("en-US", { month: "short" }), revenue: rev });
    }

    return { totalRevenue, monthRevenue, outstanding, outstandingCount, totalCustomers, newCustomers, upcomingAppointments, completedJobs, revenueByMonth, recentAppointments };
  } catch {
    return { totalRevenue: 0, monthRevenue: 0, outstanding: 0, outstandingCount: 0, totalCustomers: 0, newCustomers: 0, upcomingAppointments: 0, completedJobs: 0, revenueByMonth: [], recentAppointments: [] };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  const metricCards = [
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      sub: `${formatCurrency(stats.monthRevenue)} this month`,
      icon: DollarSign,
      trend: "up",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers.toString(),
      sub: `+${stats.newCustomers} this month`,
      icon: Users,
      trend: "up",
    },
    {
      label: "Upcoming Jobs",
      value: stats.upcomingAppointments.toString(),
      sub: "Confirmed appointments",
      icon: Calendar,
      trend: "neutral",
    },
    {
      label: "Outstanding",
      value: formatCurrency(stats.outstanding),
      sub: `${stats.outstandingCount} invoices pending`,
      icon: Receipt,
      trend: stats.outstanding > 0 ? "down" : "up",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111111]">Overview</h1>
        <p className="text-[#707070] text-sm mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricCards.map((card, i) => (
          <div key={i} className="bg-white border border-[#e5e5e3] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#707070] text-xs font-medium uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-bold text-[#111111] mt-1">{card.value}</p>
                <p className="text-[#707070] text-xs mt-1">{card.sub}</p>
              </div>
              <div className="w-10 h-10 bg-[#f5f5f3] flex items-center justify-center">
                <card.icon className="h-5 w-5 text-[#C9A86A]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#e5e5e3] p-6">
          <h2 className="font-semibold text-[#111111] text-sm uppercase tracking-wider mb-6">Revenue (6 Months)</h2>
          <RevenueChart data={stats.revenueByMonth} />
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white border border-[#e5e5e3] p-6">
          <h2 className="font-semibold text-[#111111] text-sm uppercase tracking-wider mb-4">Upcoming</h2>
          {stats.recentAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-[#e5e5e3] mx-auto mb-2" />
              <p className="text-[#707070] text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentAppointments.map((apt: any) => (
                <Link key={apt.id} href={`/dashboard/appointments`} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 bg-[#f5f5f3] flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-[#0B0B0C] transition-colors">
                    <span className="text-xs font-bold text-[#111111] group-hover:text-white leading-none">
                      {new Date(apt.date).getDate()}
                    </span>
                    <span className="text-[10px] text-[#707070] group-hover:text-white/60 uppercase">
                      {new Date(apt.date).toLocaleString("en-US", { month: "short" })}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111111] truncate">
                      {apt.customer.firstName} {apt.customer.lastName}
                    </p>
                    <p className="text-xs text-[#707070] truncate">
                      {apt.service?.name || "Service TBD"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/dashboard/appointments" className="block mt-4 pt-4 border-t border-[#e5e5e3] text-xs text-[#C9A86A] hover:underline">
            View all appointments →
          </Link>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-[#0B0B0C] p-6">
          <Clock className="h-5 w-5 text-[#C9A86A] mb-3" />
          <p className="text-3xl font-bold text-white">{stats.completedJobs}</p>
          <p className="text-white/50 text-sm mt-1">Completed Jobs</p>
        </div>
        <div className="bg-white border border-[#e5e5e3] p-6">
          <Car className="h-5 w-5 text-[#C9A86A] mb-3" />
          <p className="text-3xl font-bold text-[#111111]">{stats.completedJobs}</p>
          <p className="text-[#707070] text-sm mt-1">Vehicles Serviced</p>
        </div>
        <div className="bg-white border border-[#e5e5e3] p-6">
          <TrendingUp className="h-5 w-5 text-[#C9A86A] mb-3" />
          <p className="text-3xl font-bold text-[#111111]">{formatCurrency(stats.monthRevenue)}</p>
          <p className="text-[#707070] text-sm mt-1">This Month's Revenue</p>
        </div>
      </div>
    </div>
  );
}
