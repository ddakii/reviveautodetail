"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Printer, Send, CheckCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { InvoiceStatusBadge } from "@/lib/status";
import { InvoicePreview } from "@/components/invoices/invoice-preview";
import { RecordPaymentDialog } from "@/components/dashboard/record-payment-dialog";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentDialog, setPaymentDialog] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/invoices/${id}`);
    const data = await res.json();
    setInvoice(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const markStatus = async (status: string) => {
    await fetch(`/api/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const printInvoice = () => window.print();

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const html2canvas = (await import("html2canvas")).default;
    const element = document.getElementById("invoice-print");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoice.number}.pdf`);
  };

  if (loading) return <div style={{ padding: 32 }}><div className="skeleton" style={{ height: 20, width: "40%" }} /></div>;
  if (!invoice || invoice.error) return <div style={{ padding: 48, textAlign: "center", color: "var(--c-text-3)" }}>Invoice not found.</div>;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard/invoices" style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)", textDecoration: "none", color: "var(--c-text-3)" }}>
            <ArrowLeft size={14} />
          </Link>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--c-ink)" }}>{invoice.invoiceNumber}</h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p style={{ fontSize: 13, color: "var(--c-text-3)", marginTop: 2 }}>{invoice.customer?.firstName} {invoice.customer?.lastName}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
            <Button variant="gold" size="sm" onClick={() => setPaymentDialog(true)}>
              <DollarSign size={13} /> Record Payment
            </Button>
          )}
          {invoice.status === "DRAFT" && (
            <Button variant="secondary" size="sm" onClick={() => markStatus("SENT")}>
              <Send size={13} /> Mark Sent
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={printInvoice}>
            <Printer size={13} /> Print
          </Button>
          <Button variant="primary" size="sm" onClick={downloadPDF}>
            <Download size={13} /> Download PDF
          </Button>
        </div>
      </div>

      <InvoicePreview invoice={invoice} />

      <RecordPaymentDialog
        open={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        invoice={invoice}
        onRecorded={() => { setPaymentDialog(false); load(); }}
      />
    </div>
  );
}
