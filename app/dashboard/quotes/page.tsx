"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, FileText, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getQuoteStatusBadge } from "@/lib/status";
import { NewQuoteDialog } from "@/components/dashboard/new-quote-dialog";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/quotes");
    const data = await res.json();
    setQuotes(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = quotes.filter(q =>
    q.number.toLowerCase().includes(search.toLowerCase()) ||
    `${q.customer?.firstName} ${q.customer?.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const convertToInvoice = async (quoteId: string) => {
    const res = await fetch(`/api/quotes/${quoteId}/convert`, { method: "POST" });
    if (res.ok) {
      const inv = await res.json();
      window.location.href = `/dashboard/invoices/${inv.id}`;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Quotes</h1>
          <p className="text-[#707070] text-sm mt-0.5">{quotes.length} quotes</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4" /> New Quote</Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707070]" />
        <input
          className="w-full h-10 pl-9 pr-3 border border-[#e5e5e3] bg-white text-sm focus:outline-none focus:border-[#0B0B0C]"
          placeholder="Search quotes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white border border-[#e5e5e3]">
        {loading ? (
          <div className="p-12 text-center text-[#707070]">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="h-12 w-12 text-[#e5e5e3] mx-auto mb-4" />
            <h3 className="font-semibold text-[#111111] mb-1">No quotes yet</h3>
            <Button onClick={() => setShowNew(true)} className="mt-2">Create First Quote</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                  {["Quote #", "Customer", "Vehicle", "Total", "Status", "Expires", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(q => (
                  <tr key={q.id} className="border-b border-[#f0f0ee] hover:bg-[#fafaf8] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">
                      <Link href={`/dashboard/quotes/${q.id}`} className="hover:text-[#C9A86A]">{q.number}</Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{q.customer?.firstName} {q.customer?.lastName}</td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{q.vehicle ? `${q.vehicle.year} ${q.vehicle.make} ${q.vehicle.model}` : "—"}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">{formatCurrency(q.total)}</td>
                    <td className="px-4 py-3">{getQuoteStatusBadge(q.status)}</td>
                    <td className="px-4 py-3 text-sm text-[#707070]">{q.expiresAt ? formatDate(q.expiresAt) : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/quotes/${q.id}`}>
                          <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        {q.status !== "ACCEPTED" && !q.invoice && (
                          <Button variant="gold" size="sm" onClick={() => convertToInvoice(q.id)}>
                            <ArrowRight className="h-3.5 w-3.5" /> Invoice
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewQuoteDialog open={showNew} onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }} />
    </div>
  );
}
