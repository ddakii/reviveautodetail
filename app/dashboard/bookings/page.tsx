"use client";
import { useState, useEffect } from "react";
import { BookOpen, Check, X, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings").then(r => r.json()).then(d => { setBookings(d || []); setLoading(false); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings(b => b.map(x => x.id === id ? { ...x, status } : x));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Booking Requests</h1>
        <p className="text-[#707070] text-sm mt-0.5">
          {bookings.filter(b => b.status === "PENDING").length} pending · {bookings.length} total
        </p>
      </div>

      <div className="bg-white border border-[#e5e5e3]">
        {loading ? (
          <div className="p-12 text-center text-[#707070]">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center">
            <BookOpen className="h-12 w-12 text-[#e5e5e3] mx-auto mb-4" />
            <p className="text-[#707070]">No booking requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#f0f0ee]">
            {bookings.map(b => (
              <div key={b.id} className="p-5 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#111111]">{b.firstName} {b.lastName}</span>
                    <Badge variant={b.status === "PENDING" ? "warning" : b.status === "CONFIRMED" ? "success" : "secondary"}>
                      {b.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-[#707070] space-y-0.5">
                    <div>{b.email} · {b.phone}</div>
                    <div>{b.vehicleYear} {b.vehicleMake} {b.vehicleModel} {b.vehicleColor ? `· ${b.vehicleColor}` : ""}</div>
                    <div>Service: {b.serviceName || b.serviceId} · {formatDate(b.preferredDate)} at {b.preferredTime}</div>
                    {b.notes && <div className="italic">"{b.notes}"</div>}
                  </div>
                  <div className="text-xs text-[#707070] mt-1">Ref: {b.reference}</div>
                </div>
                {b.status === "PENDING" && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => updateStatus(b.id, "CANCELLED")}>
                      <X className="h-4 w-4" /> Decline
                    </Button>
                    <Button variant="default" size="sm" onClick={() => updateStatus(b.id, "CONFIRMED")}>
                      <Check className="h-4 w-4" /> Confirm
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
