"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FileText, Plus, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { QuoteStatusBadge } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/utils";
import { NewQuoteDialog } from "@/components/dashboard/new-quote-dialog";
import { useSearchParams } from "next/navigation";

export default function QuotesPage() {
  const params = useSearchParams();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(params.get("new") === "1");

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/quotes").catch(() => null);
    if (r?.ok) { const d = await r.json(); setQuotes(Array.isArray(d) ? d : []); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = quotes.filter(q => search === "" || `${q.quoteNumber} ${q.customer?.firstName} ${q.customer?.lastName}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {showNew && <NewQuoteDialog open={showNew} onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <PageHeader title="Quotes" description="Create and manage service quotes." action={<Button variant="primary" size="sm" onClick={() => setShowNew(true)}><Plus size={14} /> New Quote</Button>} />
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative", maxWidth: 360 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-text-3)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search quotes…" style={{ width: "100%", height: 38, paddingLeft: 36, paddingRight: 12, borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)" }} />
          </div>
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {filtered.length === 0 ? (
              <EmptyState icon={<FileText size={20} />} title="No quotes yet" description="Create your first quote for a customer." action={{ label: "New Quote", onClick: () => setShowNew(true) }} />
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Quote #", "Customer", "Vehicle", "Total", "Date", "Expires", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q: any) => (
                    <tr key={q.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background var(--t-fast)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "var(--c-ink)" }}>{q.quoteNumber}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{q.customer?.firstName} {q.customer?.lastName}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{q.vehicle ? `${q.vehicle.year} ${q.vehicle.make} ${q.vehicle.model}` : "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>{formatCurrency(q.total)}</td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--c-text-3)" }}>{formatDate(q.createdAt)}</td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--c-text-3)" }}>{q.expiresAt ? formatDate(q.expiresAt) : "—"}</td>
                      <td style={{ padding: "14px 16px" }}><QuoteStatusBadge status={q.status} /></td>
                      <td style={{ padding: "14px 16px" }}>
                        <Link href={`/dashboard/quotes/${q.id}`} style={{ fontSize: 12, color: "var(--c-gold)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>View <ChevronRight size={12} /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
