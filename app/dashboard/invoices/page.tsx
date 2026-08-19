"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Receipt, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getInvoiceStatusBadge } from "@/lib/status";
import { NewInvoiceDialog } from "@/components/dashboard/new-invoice-dialog";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = invoices.filter((inv) =>
    inv.number.toLowerCase().includes(search.toLowerCase()) ||
    `${inv.customer?.firstName} ${inv.customer?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: invoices.reduce((s, i) => s + i.total, 0),
    paid: invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.total, 0),
    outstanding: invoices.filter((i) => ["SENT", "PARTIALLY_PAID"].includes(i.status)).reduce((s, i) => s + (i.total - i.amountPaid), 0),
    overdue: invoices.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + (i.total - i.amountPaid), 0),
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Invoices</h1>
          <p className="text-[#707070] text-sm mt-0.5">{invoices.length} invoices</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="h-4 w-4" /> New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Invoiced", value: formatCurrency(stats.total) },
          { label: "Collected", value: formatCurrency(stats.paid), color: "text-emerald-700" },
          { label: "Outstanding", value: formatCurrency(stats.outstanding), color: "text-amber-600" },
          { label: "Overdue", value: formatCurrency(stats.overdue), color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e5e5e3] p-4">
            <div className="text-xs text-[#707070] uppercase tracking-wider">{s.label}</div>
            <div className={`text-xl font-bold mt-1 ${s.color || "text-[#111111]"}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707070]" />
        <input
          className="w-full h-10 pl-9 pr-3 border border-[#e5e5e3] bg-white text-sm focus:outline-none focus:border-[#0B0B0C]"
          placeholder="Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e5e3]">
        {loading ? (
          <div className="p-12 text-center text-[#707070]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Receipt className="h-12 w-12 text-[#e5e5e3] mx-auto mb-4" />
            <h3 className="font-semibold text-[#111111] mb-1">No invoices yet</h3>
            <Button onClick={() => setShowNew(true)} className="mt-2">Create First Invoice</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                  {["Invoice", "Customer", "Vehicle", "Date", "Due", "Total", "Paid", "Status", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.id} className="border-b border-[#f0f0ee] hover:bg-[#fafaf8] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">
                      <Link href={`/dashboard/invoices/${inv.id}`} className="hover:text-[#C9A86A]">{inv.number}</Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{inv.customer?.firstName} {inv.customer?.lastName}</td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{inv.vehicle ? `${inv.vehicle.year} ${inv.vehicle.make} ${inv.vehicle.model}` : "—"}</td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{formatDate(inv.issueDate)}</td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">{formatCurrency(inv.total)}</td>
                    <td className="px-4 py-3 text-sm text-emerald-700 font-medium">{formatCurrency(inv.amountPaid)}</td>
                    <td className="px-4 py-3">{getInvoiceStatusBadge(inv.status)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/invoices/${inv.id}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewInvoiceDialog open={showNew} onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }} />
    </div>
  );
}
