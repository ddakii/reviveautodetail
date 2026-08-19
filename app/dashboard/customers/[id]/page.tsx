"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, MapPin, Car, Calendar, FileText, Receipt, CreditCard, Activity, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { getInvoiceStatusBadge, getAppointmentStatusBadge, getQuoteStatusBadge } from "@/lib/status";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((d) => { setCustomer(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-[#707070]">Loading...</div>;
  if (!customer || customer.error) return <div className="p-8 text-red-500">Customer not found.</div>;

  return (
    <div className="p-6 lg:p-8">
      {/* Back */}
      <Link href="/dashboard/customers" className="inline-flex items-center gap-2 text-[#707070] hover:text-[#111111] text-sm mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Customers
      </Link>

      {/* Header */}
      <div className="bg-white border border-[#e5e5e3] p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-[#0B0B0C] flex items-center justify-center text-white text-lg font-bold">
              {getInitials(`${customer.firstName} ${customer.lastName}`)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111111]">{customer.firstName} {customer.lastName}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#707070]">
                {customer.phone && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>}
                {customer.email && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{customer.email}</span>}
                {customer.city && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{customer.city}, {customer.state}</span>}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/appointments?customerId=${id}`}><Calendar className="h-4 w-4" /> New Appointment</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/quotes?customerId=${id}`}><FileText className="h-4 w-4" /> New Quote</Link>
            </Button>
            <Button variant="gold" size="sm" asChild>
              <Link href={`/dashboard/invoices?customerId=${id}`}><Receipt className="h-4 w-4" /> New Invoice</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#e5e5e3]">
          {[
            { label: "Lifetime Value", value: formatCurrency(customer.totalSpent || 0) },
            { label: "Appointments", value: customer.appointments?.length || 0 },
            { label: "Invoices", value: customer.invoices?.length || 0 },
            { label: "Vehicles", value: customer.vehicles?.length || 0 },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xs text-[#707070] uppercase tracking-wider">{s.label}</div>
              <div className="text-xl font-bold text-[#111111] mt-0.5">{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles ({customer.vehicles?.length || 0})</TabsTrigger>
          <TabsTrigger value="appointments">Appointments ({customer.appointments?.length || 0})</TabsTrigger>
          <TabsTrigger value="quotes">Quotes ({customer.quotes?.length || 0})</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({customer.invoices?.length || 0})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({customer.payments?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles">
          <div className="bg-white border border-[#e5e5e3]">
            {customer.vehicles?.length === 0 ? (
              <div className="p-10 text-center text-[#707070]">
                <Car className="h-10 w-10 mx-auto mb-3 text-[#e5e5e3]" />
                <p>No vehicles on file.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0f0ee]">
                {customer.vehicles.map((v: any) => (
                  <div key={v.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-[#C9A86A]" />
                      <div>
                        <div className="font-medium text-[#111111]">{v.year} {v.make} {v.model}</div>
                        <div className="text-sm text-[#707070]">{v.color} {v.licensePlate && `· ${v.licensePlate}`}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <div className="bg-white border border-[#e5e5e3]">
            {customer.appointments?.length === 0 ? (
              <div className="p-10 text-center text-[#707070]">No appointments.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Vehicle</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.appointments.map((a: any) => (
                      <tr key={a.id} className="border-b border-[#f0f0ee]">
                        <td className="px-4 py-3 text-sm text-[#111111]">{formatDate(a.date)}</td>
                        <td className="px-4 py-3 text-sm text-[#707070]">{a.service?.name || "—"}</td>
                        <td className="px-4 py-3 text-sm text-[#707070]">{a.vehicle ? `${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model}` : "—"}</td>
                        <td className="px-4 py-3">{getAppointmentStatusBadge(a.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="quotes">
          <div className="bg-white border border-[#e5e5e3]">
            {customer.quotes?.length === 0 ? (
              <div className="p-10 text-center text-[#707070]">No quotes.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Quote #</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.quotes.map((q: any) => (
                      <tr key={q.id} className="border-b border-[#f0f0ee]">
                        <td className="px-4 py-3 text-sm font-medium text-[#111111]">
                          <Link href={`/dashboard/quotes/${q.id}`} className="hover:text-[#C9A86A]">{q.number}</Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#111111] font-medium">{formatCurrency(q.total)}</td>
                        <td className="px-4 py-3">{getQuoteStatusBadge(q.status)}</td>
                        <td className="px-4 py-3 text-sm text-[#707070]">{formatDate(q.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <div className="bg-white border border-[#e5e5e3]">
            {customer.invoices?.length === 0 ? (
              <div className="p-10 text-center text-[#707070]">No invoices.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Invoice #</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.invoices.map((inv: any) => (
                      <tr key={inv.id} className="border-b border-[#f0f0ee]">
                        <td className="px-4 py-3 text-sm font-medium text-[#111111]">
                          <Link href={`/dashboard/invoices/${inv.id}`} className="hover:text-[#C9A86A]">{inv.number}</Link>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#111111]">{formatCurrency(inv.total)}</td>
                        <td className="px-4 py-3">{getInvoiceStatusBadge(inv.status)}</td>
                        <td className="px-4 py-3 text-sm text-[#707070]">{formatDate(inv.dueDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="bg-white border border-[#e5e5e3]">
            {customer.payments?.length === 0 ? (
              <div className="p-10 text-center text-[#707070]">No payments recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e5e5e3] bg-[#fafaf8]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#707070] uppercase tracking-wider">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.payments.map((p: any) => (
                      <tr key={p.id} className="border-b border-[#f0f0ee]">
                        <td className="px-4 py-3 text-sm text-[#111111]">{formatDate(p.paidAt)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-emerald-700">{formatCurrency(p.amount)}</td>
                        <td className="px-4 py-3 text-sm text-[#707070]">{p.method}</td>
                        <td className="px-4 py-3 text-sm text-[#707070]">{p.invoice?.number || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
