"use client";
import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { Badge } from "@/components/ui/badge";
import { getInvoiceStatusBadge } from "@/lib/status";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("month");

  useEffect(() => {
    Promise.all([
      fetch("/api/invoices").then(r => r.json()),
      fetch("/api/appointments").then(r => r.json()),
      fetch("/api/customers?limit=100").then(r => r.json()),
    ]).then(([inv, apt, cust]) => {
      setInvoices(inv || []);
      setAppointments(apt || []);
      setCustomers(cust.customers || []);
      setLoading(false);
    });
  }, []);

  const now = new Date();
  const filterDate = range === "today"
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
    : range === "week"
    ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    : range === "month"
    ? new Date(now.getFullYear(), now.getMonth(), 1)
    : range === "year"
    ? new Date(now.getFullYear(), 0, 1)
    : new Date(0);

  const filteredInvoices = invoices.filter(i => new Date(i.createdAt) >= filterDate);
  const filteredApts = appointments.filter(a => new Date(a.date) >= filterDate);

  const revenue = filteredInvoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.total, 0);
  const invoiced = filteredInvoices.reduce((s, i) => s + i.total, 0);
  const outstanding = filteredInvoices.filter(i => ["SENT","PARTIALLY_PAID","OVERDUE"].includes(i.status)).reduce((s, i) => s + (i.total - i.amountPaid), 0);

    const revenueByMonth: { month: string; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const rev = invoices.filter(inv => inv.status === "PAID" && new Date(inv.createdAt) >= start && new Date(inv.createdAt) <= end).reduce((sum, inv) => sum + inv.total, 0);
    revenueByMonth.push({ month: start.toLocaleString("en-US", { month: "short" }), revenue: rev });
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Reports</h1>
          <p className="text-[#707070] text-sm mt-0.5">Business analytics and performance</p>
        </div>
        <div className="flex items-center gap-2">
          {["today","week","month","year","all"].map(r => (
            <button
              key={r}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${range === r ? "bg-[#0B0B0C] text-white" : "bg-white border border-[#e5e5e3] text-[#707070] hover:bg-[#f5f5f3]"}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Revenue Collected", value: formatCurrency(revenue), color: "text-emerald-700" },
          { label: "Total Invoiced", value: formatCurrency(invoiced) },
          { label: "Outstanding", value: formatCurrency(outstanding), color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#e5e5e3] p-5">
            <div className="text-xs text-[#707070] uppercase tracking-wider">{s.label}</div>
            <div className={`text-2xl font-bold mt-1 ${s.color || "text-[#111111]"}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-[#e5e5e3] p-6">
          <h2 className="font-semibold text-[#111111] text-sm uppercase tracking-wider mb-4">Revenue Trend</h2>
          <RevenueChart data={revenueByMonth} />
        </div>

        <div className="bg-white border border-[#e5e5e3] p-6">
          <h2 className="font-semibold text-[#111111] text-sm uppercase tracking-wider mb-4">Invoice Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: "Paid", status: "PAID", color: "bg-emerald-500" },
              { label: "Sent", status: "SENT", color: "bg-blue-500" },
              { label: "Overdue", status: "OVERDUE", color: "bg-red-500" },
              { label: "Draft", status: "DRAFT", color: "bg-gray-400" },
            ].map(({ label, status, color }) => {
              const count = invoices.filter(i => i.status === status).length;
              const pct = invoices.length ? Math.round((count / invoices.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#707070]">{label}</span>
                    <span className="font-medium text-[#111111]">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-[#f0f0ee] rounded">
                    <div className={`h-2 ${color} rounded transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e5e5e3] p-5">
          <div className="text-xs text-[#707070] uppercase tracking-wider">Appointments</div>
          <div className="text-2xl font-bold text-[#111111] mt-1">{filteredApts.length}</div>
          <div className="text-xs text-[#707070] mt-1">{filteredApts.filter(a => a.status === "COMPLETED").length} completed</div>
        </div>
        <div className="bg-white border border-[#e5e5e3] p-5">
          <div className="text-xs text-[#707070] uppercase tracking-wider">New Customers</div>
          <div className="text-2xl font-bold text-[#111111] mt-1">
            {customers.filter(c => new Date(c.createdAt) >= filterDate).length}
          </div>
        </div>
        <div className="bg-white border border-[#e5e5e3] p-5">
          <div className="text-xs text-[#707070] uppercase tracking-wider">Avg Invoice Value</div>
          <div className="text-2xl font-bold text-[#111111] mt-1">
            {filteredInvoices.length > 0 ? formatCurrency(invoiced / filteredInvoices.length) : "$0"}
          </div>
        </div>
      </div>
    </div>
  );
}
