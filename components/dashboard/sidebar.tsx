"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/website/logo";
import {
  LayoutDashboard, Users, Car, Calendar, Wrench, FileText,
  Receipt, CreditCard, BarChart3, Users2, Settings, ChevronRight,
  BookOpen,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Vehicles", href: "/dashboard/vehicles", icon: Car },
  { label: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { label: "Services", href: "/dashboard/services", icon: Wrench },
  { label: "Quotes", href: "/dashboard/quotes", icon: FileText },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Team", href: "/dashboard/team", icon: Users2 },
  { label: "Bookings", href: "/dashboard/bookings", icon: BookOpen },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className={cn(
      "h-full bg-[#0D0D0F] flex flex-col border-r border-white/5 transition-all duration-200",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className={cn(
        "h-16 border-b border-white/5 flex items-center",
        collapsed ? "justify-center px-3" : "px-5"
      )}>
        {collapsed ? (
          <div className="w-8 h-8">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect width="36" height="36" fill="#1a1a1c" />
              <path d="M10 8H10V28H14V21H20L24 28H28.5L24 20.5C26 19.5 27 17.5 27 15C27 11 24 8 20 8H10Z" fill="white" />
              <path d="M14 12H19.5C21.5 12 23 13.5 23 15.5C23 17.5 21.5 19 19.5 19H14V12Z" fill="#C9A86A" />
            </svg>
          </div>
        ) : (
          <Logo variant="light" size="sm" href="/dashboard" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto dashboard-scroll">
        <div className={cn("mb-2", collapsed ? "px-2" : "px-3")}>
          {!collapsed && (
            <div className="text-[#404048] text-[10px] font-semibold tracking-[0.2em] uppercase px-2 mb-2">
              Main
            </div>
          )}
          {navItems.slice(0, 8).map((item) => (
            <NavItem key={item.href} item={item} active={isActive(item.href, item.exact)} collapsed={collapsed} />
          ))}
        </div>

        <div className={cn("mb-2 mt-4", collapsed ? "px-2" : "px-3")}>
          {!collapsed && (
            <div className="text-[#404048] text-[10px] font-semibold tracking-[0.2em] uppercase px-2 mb-2">
              Manage
            </div>
          )}
          {navItems.slice(8).map((item) => (
            <NavItem key={item.href} item={item} active={isActive(item.href, item.exact)} collapsed={collapsed} />
          ))}
        </div>
      </nav>

      {/* Bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors">
            <ChevronRight className="h-3.5 w-3.5 rotate-180" />
            View Website
          </Link>
        </div>
      )}
    </aside>
  );
}

function NavItem({ item, active, collapsed }: { item: any; active: boolean; collapsed?: boolean }) {
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 px-2 py-2 mb-0.5 text-sm transition-colors group",
        collapsed ? "justify-center" : "",
        active
          ? "bg-white/8 text-white"
          : "text-white/40 hover:text-white/70 hover:bg-white/5"
      )}
    >
      <item.icon className={cn("flex-shrink-0", collapsed ? "h-5 w-5" : "h-4 w-4", active ? "text-[#C9A86A]" : "")} />
      {!collapsed && (
        <span className="font-medium">{item.label}</span>
      )}
      {!collapsed && active && (
        <div className="ml-auto w-1 h-1 rounded-full bg-[#C9A86A]" />
      )}
    </Link>
  );
}
