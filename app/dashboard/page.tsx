import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AppointmentStatusBadge } from "@/lib/status";
import { StatsCard } from "@/components/ui/stats-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { DollarSign, Users, Calendar, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCustomers, newCustomers,
      invoices,
      upcomingAppts,
      recentAppts,
      completedJobs,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customer.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.invoice.findMany({ select: { total: true, status: true, amountPaid: true, createdAt: true } }),
      prisma.appointment.count({ where: { date: { gte: now }, status: { in: ["CONFIRMED", "REQUESTED"] } } }),
      prisma.appointment.findMany({
        where: { date: { gte: now } },
        orderBy: { date: "asc" },
        take: 5,
        include: { customer: true, vehicle: true, service: true },
      }),
      prisma.appointment.count({ where: { status: "COMPLETED" } }),
    ]);

    const totalRevenue = invoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.total, 0);
    const monthRevenue = invoices.filter(i => i.status === "PAID" && i.createdAt >= startOfMonth).reduce((s, i) => s + i.total, 0);
    const outstanding = invoices.filter(i => ["SENT","PARTIALLY_PAID","OVERDUE"].includes(i.status)).reduce((s, i) => s + (i.total - i.amountPaid), 0);
    const outstandingCount = invoices.filter(i => ["SENT","PARTIALLY_PAID","OVERDUE"].includes(i.status)).length;

    const revenueByMonth: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const rev   = invoices.filter(inv => inv.status === "PAID" && inv.createdAt >= start && inv.createdAt <= end).reduce((s, inv) => s + inv.total, 0);
      revenueByMonth.push({ month: start.toLocaleString("en-US", { month: "short" }), revenue: rev });
    }

    return { totalRevenue, monthRevenue, outstanding, outstandingCount, totalCustomers, newCustomers, upcomingAppts, recentAppts, completedJobs, revenueByMonth };
  } catch {
    return { totalRevenue: 0, monthRevenue: 0, outstanding: 0, outstandingCount: 0, totalCustomers: 0, newCustomers: 0, upcomingAppts: 0, recentAppts: [], completedJobs: 0, revenueByMonth: [] };
  }
}

export default async function DashboardPage() {
  const s = await getStats();

  return (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>Overview</h1>
        <p style={{ fontSize: 14, color: "var(--c-text-3)", marginTop: 4 }}>Your detailing business at a glance.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatsCard
          label="Total Revenue"
          value={formatCurrency(s.totalRevenue)}
          sub={`${formatCurrency(s.monthRevenue)} this month`}
          icon={<DollarSign size={15} />}
          accent
        />
        <StatsCard
          label="Customers"
          value={String(s.totalCustomers)}
          sub={`+${s.newCustomers} this month`}
          trend={s.newCustomers > 0 ? { value: `${s.newCustomers} new`, positive: true } : undefined}
          icon={<Users size={15} />}
        />
        <StatsCard
          label="Upcoming Jobs"
          value={String(s.upcomingAppts)}
          sub="Confirmed appointments"
          icon={<Calendar size={15} />}
        />
        <StatsCard
          label="Outstanding"
          value={formatCurrency(s.outstanding)}
          sub={`${s.outstandingCount} invoice${s.outstandingCount !== 1 ? "s" : ""} pending`}
          trend={s.outstanding > 0 ? { value: formatCurrency(s.outstanding), positive: false } : undefined}
          icon={<AlertCircle size={15} />}
        />
      </div>

      {/* Charts + Upcoming */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
        {/* Revenue chart */}
        <div style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--r-lg)",
          padding: 24,
        }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-ink)" }}>Revenue</h2>
            <p style={{ fontSize: 13, color: "var(--c-text-3)", marginTop: 2 }}>Last 6 months</p>
          </div>
          <RevenueChart data={s.revenueByMonth} />
        </div>

        {/* Upcoming appointments */}
        <div style={{
          background: "var(--c-surface)",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--r-lg)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-ink)" }}>Upcoming</h2>
            <Link href="/dashboard/appointments" style={{ fontSize: 12, color: "var(--c-gold)", fontWeight: 500 }}>View all →</Link>
          </div>

          {s.recentAppts.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--c-text-3)" }}>
              <Clock size={24} strokeWidth={1.5} />
              <span style={{ fontSize: 13 }}>No upcoming appointments</span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {s.recentAppts.map((appt: any) => (
                <Link key={appt.id} href={`/dashboard/appointments`} className="hover-row" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: "var(--r-sm)",
                  textDecoration: "none",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: appt.status === "CONFIRMED" ? "var(--c-green)" : appt.status === "REQUESTED" ? "var(--c-amber)" : "var(--c-muted)",
                    flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--c-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {appt.customer?.firstName} {appt.customer?.lastName}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--c-text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {appt.service?.name} · {appt.vehicle?.make} {appt.vehicle?.model}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--c-text-3)", flexShrink: 0 }}>
                    {formatDate(appt.date)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[
          { label: "Completed Jobs", value: String(s.completedJobs) },
          { label: "Active Customers", value: String(s.totalCustomers) },
          { label: "This Month Revenue", value: formatCurrency(s.monthRevenue) },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: "var(--c-surface)",
            border: "1px solid var(--c-border)",
            borderRadius: "var(--r-lg)",
            padding: "20px 24px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
