"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Bell, Search, Menu, Plus, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export function Topbar({ onToggleSidebar, title }: TopbarProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => {
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
    });
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
    setUnread(0);
  };

  const name = session?.user?.name || "Admin";

  return (
    <header className="h-16 bg-white border-b border-[#e5e5e3] flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-[#707070] hover:text-[#111111] hover:bg-[#f5f5f3] rounded-sm transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <h1 className="text-[#111111] font-semibold text-base hidden sm:block">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Add */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="gold" size="sm" className="hidden sm:flex gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/dashboard/customers?new=1">New Customer</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/vehicles?new=1">New Vehicle</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/appointments?new=1">New Appointment</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/quotes?new=1">New Quote</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/dashboard/invoices?new=1">New Invoice</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-[#707070] hover:text-[#111111] hover:bg-[#f5f5f3] rounded-sm transition-colors">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C9A86A] rounded-full" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-[#C9A86A] hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-[#707070]">No notifications</div>
            ) : (
              notifications.slice(0, 8).map((n) => (
                <DropdownMenuItem key={n.id} asChild>
                  <Link href={n.link || "/dashboard"} className={cn("flex flex-col gap-0.5 py-2", !n.read && "bg-[#fafaf8]")}>
                    <span className={cn("text-sm font-medium", !n.read ? "text-[#111111]" : "text-[#707070]")}>
                      {n.title}
                    </span>
                    <span className="text-xs text-[#707070] whitespace-normal">{n.message}</span>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 hover:bg-[#f5f5f3] rounded-sm transition-colors">
              <div className="w-8 h-8 bg-[#0B0B0C] flex items-center justify-center text-white text-xs font-semibold">
                {getInitials(name)}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>{name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
