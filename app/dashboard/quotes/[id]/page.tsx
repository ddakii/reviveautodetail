"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getQuoteStatusBadge } from "@/lib/status";

export default function QuoteDetailPage() {
  const { id } = useParams();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetch(`/api/quotes/${id}`).then(r => r.json()).then(d => { setQuote(d); setLoading(false); });
  }, [id]);

  const updateStatus = async (status: string) => {
    const res = await fetch(`/api/quotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    setQuote(data);
  };

  const convertToInvoice = async () => {
    setConverting(true);
    const res = await fetch(`/api/quotes/${id}/convert`, { method: "POST" });
    if (res.ok) {
      const inv = await res.json();
      window.location.href = `/dashboard/invoices/${inv.id}`;
    }
    setConverting(false);
  };

  if (loading) return <div className="p-8 text-[#707070]">Loading...</div>;
  if (!quote || quote.error) return <div className="p-8 text-red-500">Quote not found.</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/quotes" className="p-2 hover:bg-[#f5f5f3] rounded-sm">
            <ArrowLeft className="h-5 w-5 text-[#707070]" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#111111]">{quote.number}</h1>
              {getQuoteStatusBadge(quote.status)}
            </div>
            <p className="text-[#707070] text-sm">{quote.customer?.firstName} {quote.customer?.lastName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {quote.status === "DRAFT" && (
            <Button variant="outline" size="sm" onClick={() => updateStatus("SENT")}>
              <Send className="h-4 w-4" /> Mark as Sent
            </Button>
          )}
          {!quote.invoice && quote.status !== "DECLINED" && (
            <Button variant="gold" size="sm" onClick={convertToInvoice} loading={converting}>
              <ArrowRight className="h-4 w-4" /> Convert to Invoice
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e3] max-w-3xl">
        <div className="bg-[#0B0B0C] px-10 py-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <svg viewBox="0 0 36 36" fill="none" className="w-10 h-10">
                  <rect width="36" height="36" fill="#1a1a1c" />
                  <path d="M10 8H10V28H14V21H20L24 28H28.5L24 20.5C26 19.5 27 17.5 27 15C27 11 24 8 20 8H10Z" fill="white" />
                  <path d="M14 12H19.5C21.5 12 23 13.5 23 15.5C23 17.5 21.5 19 19.5 19H14V12Z" fill="#C9A86A" />
                </svg>
                <div>
                  <div className="text-white font-bold tracking-wider uppercase">REVIVE</div>
                  <div className="text-white/40 text-[9px] tracking-[0.25em] uppercase">AUTO DETAIL</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#C9A86A] text-xs uppercase tracking-[0.2em]">Quote</div>
              <div className="text-white text-2xl font-bold">{quote.number}</div>
              <div className="text-white/40 text-xs mt-1">
                <div>Date: {formatDate(quote.createdAt)}</div>
                {quote.expiresAt && <div>Expires: {formatDate(quote.expiresAt)}</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-6 border-b border-[#e5e5e3] grid grid-cols-2 gap-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#707070] mb-2">Quote For</div>
            <div className="font-semibold text-[#111111]">{quote.customer?.firstName} {quote.customer?.lastName}</div>
            {quote.customer?.phone && <div className="text-sm text-[#707070]">{quote.customer.phone}</div>}
            {quote.customer?.email && <div className="text-sm text-[#707070]">{quote.customer.email}</div>}
          </div>
          {quote.vehicle && (
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#707070] mb-2">Vehicle</div>
              <div className="font-semibold text-[#111111]">{quote.vehicle.year} {quote.vehicle.make} {quote.vehicle.model}</div>
              {quote.vehicle.color && <div className="text-sm text-[#707070]">{quote.vehicle.color}</div>}
            </div>
          )}
        </div>

        <div className="px-10 py-6">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#0B0B0C]">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3">Description</th>
                <th className="text-center text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3 w-16">Qty</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3 w-28">Unit Price</th>
                <th className="text-right text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3 w-28">Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items?.map((item: any, i: number) => (
                <tr key={i} className="border-b border-[#f0f0ee]">
                  <td className="py-3 text-sm text-[#111111]">{item.description}</td>
                  <td className="py-3 text-sm text-[#707070] text-center">{item.quantity}</td>
                  <td className="py-3 text-sm text-[#707070] text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 text-sm font-medium text-[#111111] text-right">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-10 pb-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm text-[#707070]">
              <span>Subtotal</span><span>{formatCurrency(quote.subtotal)}</span>
            </div>
            {quote.discount > 0 && (
              <div className="flex justify-between text-sm text-[#707070]">
                <span>Discount</span><span className="text-emerald-700">-{formatCurrency(quote.discount)}</span>
              </div>
            )}
            {quote.tax > 0 && (
              <div className="flex justify-between text-sm text-[#707070]">
                <span>Tax</span><span>{formatCurrency(quote.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[#111111] border-t border-[#0B0B0C] pt-2 text-base">
              <span>Total</span><span>{formatCurrency(quote.total)}</span>
            </div>
          </div>
        </div>

        {quote.notes && (
          <div className="px-10 py-4 border-t border-[#e5e5e3]">
            <div className="text-xs uppercase tracking-wider text-[#707070] mb-1">Notes</div>
            <p className="text-sm text-[#707070]">{quote.notes}</p>
          </div>
        )}

        <div className="bg-[#fafaf8] px-10 py-4 border-t border-[#e5e5e3] text-center">
          <p className="text-sm text-[#707070] italic">
            Thank you for considering Revive Auto Detail.
          </p>
        </div>
      </div>
    </div>
  );
}
