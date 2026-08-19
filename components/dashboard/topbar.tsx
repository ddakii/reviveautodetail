"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Bell, Menu, Plus, Settings, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const name = session?.user?.name || "Admin";

  useEffect(() => {
    fetch("/api/notifications")
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setNotifications(list);
        setUnread(list.filter((n: any) => !n.read).length);
      })
      .catch(() => {});
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    }).catch(() => {});
    setNotifications(n => n.map(x => ({ ...x, read: true })));
    setUnread(0);
  };

  return (
    <header style={{
      height: 60,
      background: "var(--c-surface)",
      borderBottom: "1px solid var(--c-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      flexShrink: 0,
      gap: 12,
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          onClick={onToggleSidebar}
          style={{
            width: 32, height: 32, borderRadius: "var(--r-sm)",
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--c-text-3)", transition: "background var(--t-fast)",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <Menu size={16} />
        </button>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* Quick Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="gold" size="sm" style={{ gap: 6 }}>
              <Plus size={14} />
              New
              <ChevronDown size={12} style={{ opacity: 0.7 }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ minWidth: 180 }}>
            <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/dashboard/customers?new=1">New Customer</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/vehicles?new=1">New Vehicle</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/appointments?new=1">New Appointment</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/quotes?new=1">New Quote</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/invoices?new=1">New Invoice</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button style={{
              position: "relative", width: 36, height: 36,
              borderRadius: "var(--r-sm)", background: "transparent",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--c-text-3)", transition: "background var(--t-fast)",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <Bell size={16} />
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: 7, right: 7,
                  width: 7, height: 7, borderRadius: "50%",
                  background: "var(--c-gold)",
                  border: "1.5px solid var(--c-surface)",
                }} />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ width: 320 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px 4px" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--c-ink)" }}>Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} style={{ fontSize: 12, color: "var(--c-gold)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div style={{ padding: "24px 12px", textAlign: "center", fontSize: 13, color: "var(--c-text-3)" }}>
                No notifications
              </div>
            ) : notifications.slice(0, 6).map(n => (
              <DropdownMenuItem key={n.id} asChild>
                <Link href={n.link || "/dashboard"} style={{ display: "flex", flexDirection: "column", gap: 2, padding: "8px 12px" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: n.read ? "var(--c-text-2)" : "var(--c-ink)" }}>{n.title}</span>
                  <span style={{ fontSize: 12, color: "var(--c-text-3)" }}>{n.message}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "var(--c-border)", margin: "0 4px" }} />

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "4px 8px 4px 4px",
              borderRadius: "var(--r-md)",
              background: "transparent", border: "none", cursor: "pointer",
              transition: "background var(--t-fast)",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--c-surface-2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: 28, height: 28,
                borderRadius: "var(--r-sm)",
                background: "var(--c-ink)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#fff",
                letterSpacing: "0.02em",
              }}>
                {getInitials(name)}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--c-ink)" }}>{name}</span>
              <ChevronDown size={12} style={{ color: "var(--c-text-3)" }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ minWidth: 160 }}>
            <DropdownMenuLabel>{name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Settings size={13} /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              style={{ color: "var(--c-red)", display: "flex", alignItems: "center", gap: 8 }}
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              <LogOut size={13} /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
