"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Car, Calendar, FileText, Receipt, CreditCard } from "lucide-react";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { InvoiceStatusBadge, AppointmentStatusBadge, QuoteStatusBadge } from "@/lib/status";
import { Button } from "@/components/ui/button";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    fetch(`/api/customers/${id}`).then(r => r.json()).then(d => { setCustomer(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 12 }}>
      {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 20, width: i === 1 ? "40%" : "70%" }} />)}
    </div>
  );
  if (!customer || customer.error) return (
    <div style={{ padding: 48, textAlign: "center" }}>
      <p style={{ color: "var(--c-text-3)" }}>Customer not found.</p>
      <Link href="/dashboard/customers" style={{ color: "var(--c-gold)", fontSize: 14 }}>← Back to Customers</Link>
    </div>
  );

  const tabs = [
    { id: "overview",     label: "Overview",     icon: null },
    { id: "vehicles",     label: "Vehicles",     icon: <Car size={14} /> },
    { id: "appointments", label: "Appointments", icon: <Calendar size={14} /> },
    { id: "quotes",       label: "Quotes",       icon: <FileText size={14} /> },
    { id: "invoices",     label: "Invoices",     icon: <Receipt size={14} /> },
    { id: "payments",     label: "Payments",     icon: <CreditCard size={14} /> },
  ];

  const totalSpent = (customer.invoices || []).filter((i: any) => i.status === "PAID").reduce((s: number, i: any) => s + i.total, 0);
  const outstanding = (customer.invoices || []).filter((i: any) => ["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(i.status)).reduce((s: number, i: any) => s + (i.total - i.amountPaid), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--c-border)", background: "var(--c-surface)" }}>
        <Link href="/dashboard/customers" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--c-text-3)", textDecoration: "none", marginBottom: 16 }}>
          <ArrowLeft size={14} /> Customers
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: "var(--r-md)", background: "var(--c-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
              {getInitials(`${customer.firstName} ${customer.lastName}`)}
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>{customer.firstName} {customer.lastName}</h1>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 6 }}>
                {customer.phone && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--c-text-3)" }}><Phone size={12} />{customer.phone}</span>}
                {customer.email && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--c-text-3)" }}><Mail size={12} />{customer.email}</span>}
                {customer.city && <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--c-text-3)" }}><MapPin size={12} />{customer.city}{customer.state ? `, ${customer.state}` : ""}</span>}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/dashboard/appointments?new=1&customerId=${customer.id}`}>New Appointment</Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/dashboard/quotes?new=1&customerId=${customer.id}`}>New Quote</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link href={`/dashboard/invoices?new=1&customerId=${customer.id}`}>New Invoice</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "var(--c-surface)", borderBottom: "1px solid var(--c-border)", padding: "0 32px", display: "flex", gap: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "14px 16px",
            background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
            fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? "var(--c-ink)" : "var(--c-text-3)",
            borderBottom: `2px solid ${tab === t.id ? "var(--c-gold)" : "transparent"}`,
            transition: "color 0.15s",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 32 }}>

        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Stats */}
            <div className="grid-auto">
              {[
                { label: "Total Spent",  value: formatCurrency(totalSpent) },
                { label: "Appointments", value: String((customer.appointments || []).length) },
                { label: "Vehicles",     value: String((customer.vehicles || []).length) },
                { label: "Outstanding",  value: formatCurrency(outstanding) },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: "20px 24px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)", marginBottom: 8 }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Vehicles */}
            {(customer.vehicles || []).length > 0 && (
              <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink)", marginBottom: 16 }}>Vehicles</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {customer.vehicles.map((v: any) => (
                    <div key={v.id} style={{ border: "1px solid var(--c-border)", borderRadius: "var(--r-md)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                      <Car size={15} style={{ color: "var(--c-text-3)" }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--c-ink)" }}>{v.year} {v.make} {v.model}</div>
                        {v.color && <div style={{ fontSize: 12, color: "var(--c-text-3)" }}>{v.color}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {customer.notes && (
              <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: 24 }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--c-ink)", marginBottom: 10 }}>Notes</h2>
                <p style={{ fontSize: 14, color: "var(--c-text-2)", lineHeight: 1.7 }}>{customer.notes}</p>
              </div>
            )}
          </div>
        )}

        {tab === "vehicles" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(customer.vehicles || []).length === 0 ? (
              <p style={{ color: "var(--c-text-3)", fontSize: 14 }}>No vehicles on file.</p>
            ) : customer.vehicles.map((v: any) => (
              <div key={v.id} style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", padding: "18px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--r-sm)", background: "var(--c-surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Car size={18} style={{ color: "var(--c-text-3)" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--c-ink)" }}>{v.year} {v.make} {v.model}</div>
                  <div style={{ fontSize: 13, color: "var(--c-text-3)", marginTop: 2 }}>
                    {[v.color, v.licensePlate].filter(Boolean).join(" · ")}
                  </div>
                </div>
                {v.vin && <span style={{ fontSize: 12, color: "var(--c-text-3)" }}>VIN: {v.vin.slice(-8)}</span>}
              </div>
            ))}
          </div>
        )}

        {tab === "appointments" && (
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {(customer.appointments || []).length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--c-text-3)", fontSize: 14 }}>No appointments yet.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Date", "Service", "Vehicle", "Status"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {customer.appointments.map((a: any) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--c-border)" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{formatDate(a.date)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--c-ink)", fontWeight: 500 }}>{a.service?.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{a.vehicle ? `${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model}` : "—"}</td>
                      <td style={{ padding: "12px 16px" }}><AppointmentStatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "invoices" && (
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {(customer.invoices || []).length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--c-text-3)", fontSize: 14 }}>No invoices yet.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Invoice #", "Amount", "Due", "Status"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {customer.invoices.map((inv: any) => (
                    <tr key={inv.id} style={{ borderBottom: "1px solid var(--c-border)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <Link href={`/dashboard/invoices/${inv.id}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--c-ink)", textDecoration: "none" }}>{inv.invoiceNumber}</Link>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>{formatCurrency(inv.total)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                      <td style={{ padding: "12px 16px" }}><InvoiceStatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "quotes" && (
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {(customer.quotes || []).length === 0 ? (
              <div style={{ padding: 40, textAlign: "center", color: "var(--c-text-3)", fontSize: 14 }}>No quotes yet.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Quote #", "Amount", "Expires", "Status"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {customer.quotes.map((q: any) => (
                    <tr key={q.id} style={{ borderBottom: "1px solid var(--c-border)" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "var(--c-ink)" }}>{q.quoteNumber}</td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "var(--c-ink)" }}>{formatCurrency(q.total)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{q.expiresAt ? formatDate(q.expiresAt) : "—"}</td>
                      <td style={{ padding: "12px 16px" }}><QuoteStatusBadge status={q.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "payments" && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--c-text-3)", fontSize: 14 }}>Payments are tracked at the invoice level.</div>
        )}
      </div>
    </div>
  );
}
