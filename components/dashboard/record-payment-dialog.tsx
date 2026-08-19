"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  invoice: any;
  onRecorded: () => void;
}

export function RecordPaymentDialog({ open, onClose, invoice, onRecorded }: Props) {
  const balance = invoice.total - invoice.amountPaid;
  const [amount, setAmount] = useState(balance.toFixed(2));
  const [method, setMethod] = useState("CASH");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [paidAt, setPaidAt] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!parseFloat(amount)) { setError("Enter a valid amount"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          customerId: invoice.customerId,
          amount: parseFloat(amount),
          method,
          reference,
          notes,
          paidAt,
        }),
      });
      if (res.ok) {
        onRecorded();
      } else {
        const d = await res.json();
        setError(d.error || "Failed to record payment");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="bg-[#fafaf8] border border-[#e5e5e3] p-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#707070]">Invoice</span>
              <span className="font-medium">{invoice.number}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[#707070]">Total</span>
              <span className="font-medium">{formatCurrency(invoice.total)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-[#707070]">Balance Due</span>
              <span className="font-bold text-[#111111]">{formatCurrency(balance)}</span>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />

          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger label="Payment Method">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          <Input label="Payment Date" type="date" value={paidAt} onChange={e => setPaidAt(e.target.value)} />
          <Input label="Reference (optional)" value={reference} onChange={e => setReference(e.target.value)} placeholder="Check #, transaction ID..." />
          <Textarea label="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={save} loading={saving} variant="gold">Record Payment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
