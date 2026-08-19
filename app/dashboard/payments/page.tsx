"use client";
import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments").then(r => r.json()).then(d => setPayments(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const methodLabel: Record<string, string> = { CASH: "Cash", CARD: "Card", BANK_TRANSFER: "Bank Transfer", CHECK: "Check", OTHER: "Other" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader title="Payments" description="Track all received payments." />
      <div style={{ padding: 24 }}>
        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: 40 }}><div className="skeleton" style={{ height: 16, width: "60%" }} /></div>
          ) : payments.length === 0 ? (
            <EmptyState icon={<CreditCard size={20} />} title="No payments yet" description="Payments will appear here once recorded on invoices." />
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                  {["Reference", "Customer", "Invoice", "Amount", "Method", "Date"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background var(--t-fast)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "var(--c-ink)" }}>{p.reference || `PAY-${p.id?.slice(-6).toUpperCase()}`}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{p.invoice?.customer?.firstName} {p.invoice?.customer?.lastName}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{p.invoice?.invoiceNumber || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "var(--c-green)" }}>{formatCurrency(p.amount)}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{methodLabel[p.method] || p.method}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--c-text-3)" }}>{formatDate(p.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
