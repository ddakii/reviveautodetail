"use client";
import { useState, useEffect } from "react";
import { DollarSign, Users, Calendar, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { PageHeader } from "@/components/ui/page-header";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const s = stats || { totalRevenue: 0, monthlyRevenue: 0, totalCustomers: 0, upcomingAppointments: 0, outstanding: 0, outstandingCount: 0, completedJobs: 0, revenueByMonth: [] };
  const avgInvoice = s.completedJobs > 0 ? s.totalRevenue / s.completedJobs : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader title="Reports" description="Business performance and analytics." />
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <StatsCard label="Total Revenue" value={formatCurrency(s.totalRevenue)} sub={`${formatCurrency(s.monthlyRevenue)} this month`} icon={<DollarSign size={15} />} accent />
          <StatsCard label="Total Customers" value={String(s.totalCustomers)} icon={<Users size={15} />} />
          <StatsCard label="Completed Jobs" value={String(s.completedJobs)} icon={<Calendar size={15} />} />
          <StatsCard label="Outstanding" value={formatCurrency(s.outstanding)} sub={`${s.outstandingCount} invoices`} icon={<AlertCircle size={15} />} />
        </div>

        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--c-ink)", marginBottom: 6 }}>Revenue by Month</h2>
          <p style={{ fontSize: 13, color: "var(--c-text-3)", marginBottom: 20 }}>Last 6 months</p>
          <RevenueChart data={s.revenueByMonth} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Average Invoice Value", value: formatCurrency(avgInvoice) },
            { label: "This Month Revenue", value: formatCurrency(s.monthlyRevenue) },
            { label: "Upcoming Appointments", value: String(s.upcomingAppointments || 0) },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: "20px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
