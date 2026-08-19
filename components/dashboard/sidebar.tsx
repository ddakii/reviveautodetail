"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Car, Calendar, Wrench, FileText,
  Receipt, CreditCard, BarChart3, Users2, Settings, BookOpen,
  ExternalLink,
} from "lucide-react";

interface SidebarProps { collapsed?: boolean }

const NAV = [
  {
    section: "Overview",
    items: [
      { label: "Overview",      href: "/dashboard",              icon: LayoutDashboard, exact: true },
    ],
  },
  {
    section: "Customers",
    items: [
      { label: "Customers",     href: "/dashboard/customers",    icon: Users },
      { label: "Vehicles",      href: "/dashboard/vehicles",     icon: Car },
      { label: "Appointments",  href: "/dashboard/appointments", icon: Calendar },
      { label: "Bookings",      href: "/dashboard/bookings",     icon: BookOpen },
    ],
  },
  {
    section: "Business",
    items: [
      { label: "Services",      href: "/dashboard/services",     icon: Wrench },
      { label: "Quotes",        href: "/dashboard/quotes",       icon: FileText },
      { label: "Invoices",      href: "/dashboard/invoices",     icon: Receipt },
      { label: "Payments",      href: "/dashboard/payments",     icon: CreditCard },
    ],
  },
  {
    section: "Insights",
    items: [
      { label: "Reports",       href: "/dashboard/reports",      icon: BarChart3 },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Team",          href: "/dashboard/team",         icon: Users2 },
      { label: "Settings",      href: "/dashboard/settings",     icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const w = collapsed ? 64 : 240;

  return (
    <aside style={{
      width: w,
      minWidth: w,
      height: "100vh",
      background: "var(--c-ink)",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transition: "width 0.2s ease, min-width 0.2s ease",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        height: 60,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        padding: collapsed ? "0 16px" : "0 20px",
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 30,
          height: 30,
          background: "var(--c-gold)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: 13,
          color: "#fff",
          flexShrink: 0,
          letterSpacing: "-0.02em",
        }}>R</div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.05em", lineHeight: 1.1 }}>REVIVE</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>AUTO DETAIL</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "16px 0", overflowX: "hidden" }}>
        {NAV.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{
                padding: "8px 20px 4px",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.2)",
              }}>{section}</div>
            )}
            {items.map(({ label, href, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link key={href} href={href} className={`sidebar-link${active ? " sidebar-link-active" : ""}`}>
                  {active && (
                    <div style={{
                      position: "absolute",
                      left: -8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: 16,
                      background: "var(--c-gold)",
                      borderRadius: "0 2px 2px 0",
                    }} />
                  )}
                  <Icon size={15} style={{ flexShrink: 0, color: active ? "var(--c-gold)" : "inherit" }} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* View Website */}
      {!collapsed && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" target="_blank" className="sidebar-external">
            <ExternalLink size={12} />
            View Website
          </Link>
        </div>
      )}
    </aside>
  );
}
