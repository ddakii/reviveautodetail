"use client";
import { useState, useEffect } from "react";
import { BookOpen, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/bookings").catch(() => null);
    if (r?.ok) { const d = await r.json(); setBookings(Array.isArray(d) ? d : []); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };

  const statusVariant: Record<string, any> = { PENDING: "warning", CONFIRMED: "success", CANCELLED: "danger", COMPLETED: "default" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader title="Bookings" description="Incoming booking requests from your website." />
      <div style={{ padding: 24 }}>
        <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
          {bookings.length === 0 && !loading ? (
            <EmptyState icon={<BookOpen size={20} />} title="No bookings yet" description="Booking requests from your website will appear here." />
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                  {["Reference", "Customer", "Contact", "Service", "Preferred Date", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b: any) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background var(--t-fast)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "var(--c-ink)" }}>{b.reference}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--c-ink)" }}>{b.firstName} {b.lastName}</div>
                      <div style={{ fontSize: 12, color: "var(--c-text-3)" }}>{b.vehicleInfo || "—"}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontSize: 12, color: "var(--c-text-2)" }}>{b.email}</div>
                      <div style={{ fontSize: 12, color: "var(--c-text-3)" }}>{b.phone}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{b.serviceName || b.service?.name || "—"}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--c-text-3)" }}>{b.preferredDate ? formatDate(b.preferredDate) : "—"}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <Badge variant={statusVariant[b.status] || "default"}>{b.status}</Badge>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {b.status === "PENDING" && (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => updateStatus(b.id, "CONFIRMED")} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid var(--c-green)", background: "var(--c-green-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-green)" }}>
                            <Check size={13} />
                          </button>
                          <button onClick={() => updateStatus(b.id, "CANCELLED")} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid var(--c-red)", background: "var(--c-red-bg)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-red)" }}>
                            <X size={13} />
                          </button>
                        </div>
                      )}
                    </td>
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
