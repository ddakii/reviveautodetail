import { Badge } from "@/components/ui/badge";

export function AppointmentStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: any; label: string }> = {
    REQUESTED:  { variant: "info",    label: "Requested" },
    CONFIRMED:  { variant: "success", label: "Confirmed" },
    IN_PROGRESS:{ variant: "warning", label: "In Progress" },
    COMPLETED:  { variant: "default", label: "Completed" },
    CANCELLED:  { variant: "danger",  label: "Cancelled" },
    NO_SHOW:    { variant: "danger",  label: "No Show" },
  };
  const cfg = map[status] ?? { variant: "default", label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function QuoteStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: any; label: string }> = {
    DRAFT:     { variant: "default", label: "Draft" },
    SENT:      { variant: "info",    label: "Sent" },
    ACCEPTED:  { variant: "success", label: "Accepted" },
    REJECTED:  { variant: "danger",  label: "Rejected" },
    EXPIRED:   { variant: "warning", label: "Expired" },
    CONVERTED: { variant: "gold",    label: "Converted" },
  };
  const cfg = map[status] ?? { variant: "default", label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: any; label: string }> = {
    DRAFT:          { variant: "default", label: "Draft" },
    SENT:           { variant: "info",    label: "Sent" },
    PAID:           { variant: "success", label: "Paid" },
    PARTIALLY_PAID: { variant: "warning", label: "Partial" },
    OVERDUE:        { variant: "danger",  label: "Overdue" },
    CANCELLED:      { variant: "danger",  label: "Cancelled" },
    REFUNDED:       { variant: "outline", label: "Refunded" },
  };
  const cfg = map[status] ?? { variant: "default", label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
