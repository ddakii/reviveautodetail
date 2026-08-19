"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Printer, Send, CheckCircle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getInvoiceStatusBadge } from "@/lib/status";
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

  if (loading) return <div className="p-8 text-[#707070]">Loading...</div>;
  if (!invoice || invoice.error) return <div className="p-8 text-red-500">Invoice not found.</div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-[#f5f5f3] rounded-sm transition-colors">
            <ArrowLeft className="h-5 w-5 text-[#707070]" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#111111]">{invoice.number}</h1>
              {getInvoiceStatusBadge(invoice.status)}
            </div>
            <p className="text-[#707070] text-sm mt-0.5">
              {invoice.customer?.firstName} {invoice.customer?.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
            <Button variant="gold" size="sm" onClick={() => setPaymentDialog(true)}>
              <DollarSign className="h-4 w-4" /> Record Payment
            </Button>
          )}
          {invoice.status === "DRAFT" && (
            <Button variant="outline" size="sm" onClick={() => markStatus("SENT")}>
              <Send className="h-4 w-4" /> Mark as Sent
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={printInvoice}>
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button variant="default" size="sm" onClick={downloadPDF}>
            <Download className="h-4 w-4" /> Download PDF
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
