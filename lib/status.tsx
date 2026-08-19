import { Badge } from "@/components/ui/badge";

export function getAppointmentStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: any }> = {
    REQUESTED: { label: "Requested", variant: "info" },
    CONFIRMED: { label: "Confirmed", variant: "gold" },
    IN_PROGRESS: { label: "In Progress", variant: "warning" },
    COMPLETED: { label: "Completed", variant: "success" },
    CANCELLED: { label: "Cancelled", variant: "destructive" },
    NO_SHOW: { label: "No Show", variant: "secondary" },
  };
  const s = map[status] || { label: status, variant: "secondary" };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function getQuoteStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: any }> = {
    DRAFT: { label: "Draft", variant: "secondary" },
    SENT: { label: "Sent", variant: "info" },
    ACCEPTED: { label: "Accepted", variant: "success" },
    DECLINED: { label: "Declined", variant: "destructive" },
    EXPIRED: { label: "Expired", variant: "secondary" },
  };
  const s = map[status] || { label: status, variant: "secondary" };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function getInvoiceStatusBadge(status: string) {
  const map: Record<string, { label: string; variant: any }> = {
    DRAFT: { label: "Draft", variant: "secondary" },
    SENT: { label: "Sent", variant: "info" },
    PAID: { label: "Paid", variant: "success" },
    PARTIALLY_PAID: { label: "Partial", variant: "warning" },
    OVERDUE: { label: "Overdue", variant: "destructive" },
    CANCELLED: { label: "Cancelled", variant: "secondary" },
  };
  const s = map[status] || { label: status, variant: "secondary" };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
