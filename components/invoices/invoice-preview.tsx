import { formatCurrency, formatDate } from "@/lib/utils";

interface InvoicePreviewProps {
  invoice: any;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const customer = invoice.customer;
  const vehicle = invoice.vehicle;

  return (
    <div id="invoice-print" className="bg-white border border-[#e5e5e3] max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-[#0B0B0C] px-10 py-8">
        <div className="flex items-start justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-2">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <rect width="36" height="36" fill="#1a1a1c" />
                <path d="M10 8H10V28H14V21H20L24 28H28.5L24 20.5C26 19.5 27 17.5 27 15C27 11 24 8 20 8H10Z" fill="white" />
                <path d="M14 12H19.5C21.5 12 23 13.5 23 15.5C23 17.5 21.5 19 19.5 19H14V12Z" fill="#C9A86A" />
              </svg>
              <div>
                <div className="text-white font-bold text-lg tracking-wider uppercase">REVIVE</div>
                <div className="text-white/40 text-[9px] tracking-[0.25em] uppercase">AUTO DETAIL</div>
              </div>
            </div>
            <div className="text-white/40 text-xs mt-3">
              <div>1420 Auto Blvd, Suite 100</div>
              <div>Los Angeles, CA 90001</div>
              <div>(555) 847-2100</div>
              <div>hello@reviveautodetail.com</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[#C9A86A] text-xs uppercase tracking-[0.2em] mb-1">Invoice</div>
            <div className="text-white text-2xl font-bold">{invoice.number}</div>
            <div className="text-white/40 text-xs mt-2">
              <div>Date: {formatDate(invoice.issueDate)}</div>
              <div>Due: {formatDate(invoice.dueDate)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To / Vehicle */}
      <div className="px-10 py-6 border-b border-[#e5e5e3] grid grid-cols-2 gap-6">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#707070] mb-2">Bill To</div>
          <div className="font-semibold text-[#111111]">{customer?.firstName} {customer?.lastName}</div>
          {customer?.phone && <div className="text-sm text-[#707070]">{customer.phone}</div>}
          {customer?.email && <div className="text-sm text-[#707070]">{customer.email}</div>}
          {customer?.address && <div className="text-sm text-[#707070]">{customer.address}</div>}
          {customer?.city && <div className="text-sm text-[#707070]">{customer.city}, {customer.state} {customer.zip}</div>}
        </div>

        {vehicle && (
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#707070] mb-2">Vehicle</div>
            <div className="font-semibold text-[#111111]">{vehicle.year} {vehicle.make} {vehicle.model}</div>
            {vehicle.color && <div className="text-sm text-[#707070]">{vehicle.color}</div>}
            {vehicle.licensePlate && <div className="text-sm text-[#707070]">Plate: {vehicle.licensePlate}</div>}
            {vehicle.vin && <div className="text-sm text-[#707070]">VIN: {vehicle.vin}</div>}
          </div>
        )}
      </div>

      {/* Line Items */}
      <div className="px-10 py-6">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#0B0B0C]">
              <th className="text-left text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3">Service / Description</th>
              <th className="text-center text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3 w-16">Qty</th>
              <th className="text-right text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3 w-28">Unit Price</th>
              <th className="text-right text-xs font-semibold uppercase tracking-wider text-[#111111] pb-3 w-28">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item: any, i: number) => (
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

      {/* Totals */}
      <div className="px-10 pb-6 flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm text-[#707070]">
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-sm text-[#707070]">
              <span>Discount</span>
              <span className="text-emerald-700">-{formatCurrency(invoice.discount)}</span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div className="flex justify-between text-sm text-[#707070]">
              <span>Tax</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-[#111111] border-t border-[#0B0B0C] pt-2 text-base">
            <span>Total</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
          {invoice.amountPaid > 0 && (
            <div className="flex justify-between text-sm text-emerald-700">
              <span>Paid</span>
              <span>{formatCurrency(invoice.amountPaid)}</span>
            </div>
          )}
          {invoice.total - invoice.amountPaid > 0 && (
            <div className="flex justify-between font-semibold text-[#111111]">
              <span>Balance Due</span>
              <span>{formatCurrency(invoice.total - invoice.amountPaid)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Status */}
      <div className="px-10 py-4 border-t border-[#e5e5e3] flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
          invoice.status === "PAID"
            ? "bg-emerald-100 text-emerald-700"
            : invoice.status === "OVERDUE"
            ? "bg-red-100 text-red-700"
            : "bg-amber-100 text-amber-700"
        }`}>
          {invoice.status.replace("_", " ")}
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="px-10 py-4 border-t border-[#e5e5e3]">
          <div className="text-xs uppercase tracking-wider text-[#707070] mb-1">Notes</div>
          <p className="text-sm text-[#707070]">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="bg-[#fafaf8] px-10 py-6 border-t border-[#e5e5e3] text-center">
        <p className="text-sm text-[#707070] italic">
          Thank you for trusting Revive Auto Detail with your vehicle.
        </p>
        <p className="text-xs text-[#aaa] mt-1">
          reviveautodetail.com · (555) 847-2100 · hello@reviveautodetail.com
        </p>
      </div>
    </div>
  );
}
