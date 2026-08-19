"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Users, Search, Plus, ChevronRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";

function AddCustomerModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false);
    if (r.ok) { onSaved(); onClose(); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "var(--c-surface)", borderRadius: "var(--r-xl)", width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--shadow-lg)" }}>
        <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid var(--c-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--c-ink)" }}>New Customer</h2>
            <p style={{ fontSize: 13, color: "var(--c-text-3)", marginTop: 2 }}>Add a new customer to your CRM</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "var(--r-sm)", border: "1px solid var(--c-border)", background: "transparent", cursor: "pointer", fontSize: 18, color: "var(--c-text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <form onSubmit={submit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>First Name <span style={{ color: "var(--c-red)" }}>*</span></label>
              <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="John" style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Last Name <span style={{ color: "var(--c-red)" }}>*</span></label>
              <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Carter" style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" style={{ height: 40, padding: "0 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional notes..." style={{ padding: "10px 12px", borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "vertical", minHeight: 80 }} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 8, borderTop: "1px solid var(--c-border)" }}>
            <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" loading={loading}>Add Customer</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(params.get("new") === "1");
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch(`/api/customers?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`).catch(() => null);
    if (r?.ok) {
      const data = await r.json();
      setCustomers(Array.isArray(data.customers) ? data.customers : []);
      setTotal(data.total ?? 0);
    }
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      {showAdd && <AddCustomerModal onClose={() => setShowAdd(false)} onSaved={load} />}
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <PageHeader
          title="Customers"
          description="Manage your customers and relationships."
          action={
            <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
              <Plus size={14} /> Add Customer
            </Button>
          }
        />
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          {/* Search */}
          <div style={{ position: "relative", maxWidth: 360 }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-text-3)", pointerEvents: "none" }} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search customers…"
              style={{ width: "100%", height: 38, paddingLeft: 36, paddingRight: 12, borderRadius: "var(--r-md)", border: "1px solid var(--c-border-2)", fontSize: 14, fontFamily: "inherit", outline: "none", background: "var(--c-surface)" }}
            />
          </div>

          {/* Table */}
          <div style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", borderRadius: "var(--r-lg)", overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 12 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ height: 20, borderRadius: 4, background: "var(--c-surface-2)", width: i % 2 === 0 ? "70%" : "85%" }} className="skeleton" />
                ))}
              </div>
            ) : customers.length === 0 ? (
              <EmptyState icon={<Users size={20} />} title="No customers yet" description="Add your first customer to get started." action={{ label: "Add Customer", onClick: () => setShowAdd(true) }} />
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--c-border)" }}>
                    {["Customer", "Phone", "Email", "Vehicles", "Total Spent", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--c-text-3)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c: any) => (
                    <tr key={c.id} style={{ borderBottom: "1px solid var(--c-border)", transition: "background var(--t-fast)" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: "var(--r-sm)", background: "var(--c-ink)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                            {getInitials(`${c.firstName} ${c.lastName}`)}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--c-ink)" }}>{c.firstName} {c.lastName}</div>
                            <div style={{ fontSize: 12, color: "var(--c-text-3)" }}>Since {formatDate(c.createdAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{c.phone || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{c.email || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--c-text-2)" }}>{c._count?.vehicles ?? 0}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, color: "var(--c-ink)" }}>{formatCurrency(c._sum?.invoices ?? 0)}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <Link href={`/dashboard/customers/${c.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--c-gold)", fontWeight: 500 }}>
                          View <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--c-text-3)" }}>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <Button variant="secondary" size="sm" disabled={page * limit >= total} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
