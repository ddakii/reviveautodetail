"use client";
import { useState, useEffect, useCallback } from "react";
import { CreditCard, Search } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/payments");
    const data = await res.json();
    setPayments(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = payments.filter(p =>
    `${p.customer?.firstName} ${p.customer?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (p.invoice?.number || "").toLowerCase().includes(search.toLowerCase())
  );

  const total = filtered.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Payments</h1>
        <p className="text-[#707070] text-sm mt-0.5">{payments.length} payments · {formatCurrency(total)} total</p>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707070]" />
        <input
          className="w-full h-10 pl-9 pr-3 border border-[#e5e5e3] bg-white text-sm focus:outline-none focus:border-[#0B0B0C]"
          placeholder="Search payments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white border border-[#e5e5e3]">
        {loading ? (
          <div className="p-12 text-center text-[#707070]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <CreditCard className="h-12 w-12 text-[#e5e5e3] mx-auto mb-4" />
            <p className="text-[#707070]">No payments recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                  {["Date", "Customer", "Invoice", "Amount", "Method", "Reference"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-[#f0f0ee] hover:bg-[#fafaf8]">
                    <td className="px-4 py-3 text-sm text-[#111111]">{formatDate(p.paidAt)}</td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{p.customer?.firstName} {p.customer?.lastName}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">{p.invoice?.number}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-emerald-700">{formatCurrency(p.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{p.method.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{p.reference || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
