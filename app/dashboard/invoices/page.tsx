"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Receipt, Plus, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { InvoiceStatusBadge } from "@/lib/status";
import { formatCurrency, formatDate } from "@/lib/utils";
import { NewInvoiceDialog } from "@/components/dashboard/new-invoice-dialog";
import { useSearchParams } from "next/navigation";

export default function InvoicesPage() {
  const params = useSearchParams();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(params.get("new") === "1");

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch(`/api/invoices?search=${encodeURIComponent(search)}`).catch(() => null);
    if (r?.ok) { const d = await r.json(); setInvoices(Array.isArray(d) ? d : []); }
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      {showNew && <NewInvoiceDialog open={showNew} onClose={() => setShowNew(false)} onCreated={() => { setShowNew(false); load(); }} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <PageHeader
          title="Invoices"
          description="Manage billing and track payments."
          action={<Button variant="primary" size="sm" onClick={() => setShowNew(true)}><Plus size={14} /> New Invoice</Button>}
        />
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative", maxWidth: 360 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-text-3)", pointerEvents: "none" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices…" style={{ width: "100%", height: 38, paddingLeft: 36, paddingRight: 12, borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)" }} />
          </div>

          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 16, width: "60%", marginBottom: 12 }} /><div className="skeleton" style={{ height: 16, width: "80%" }} /></div>
            ) : invoices.length === 0 ? (
              <EmptyState icon={<Receipt size={20} />} title="No invoices yet" description="Create your first invoice to start billing." action={{ label: "New Invoice", onClick: () => setShowNew(true) }} />
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Invoice", "Customer", "Amount", "Due Date", "Status", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv: any) => (
                    <tr key={inv.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background var(--t-fast)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--c-ink)" }}>{inv.invoiceNumber}</div>
                        <div style={{ fontSize: 12, color: "var(--c-text-3)" }}>{formatDate(inv.createdAt)}</div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>
                        {inv.customer?.firstName} {inv.customer?.lastName}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>{formatCurrency(inv.total)}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                      <td style={{ padding: "14px 16px" }}><InvoiceStatusBadge status={inv.status} /></td>
                      <td style={{ padding: "14px 16px" }}>
                        <Link href={`/dashboard/invoices/${inv.id}`} style={{ fontSize: 12, color: "var(--c-gold)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                          View <ChevronRight size={12} />
                        </Link>
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
