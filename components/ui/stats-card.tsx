import * as React from "react";

interface StatsCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; positive: boolean };
  icon?: React.ReactNode;
  accent?: boolean;
}

export function StatsCard({ label, value, sub, trend, icon, accent }: StatsCardProps) {
  return (
    <div style={{
      background: accent ? "var(--c-ink)" : "var(--c-surface)",
      border: `1px solid ${accent ? "var(--c-ink-2)" : "var(--c-border)"}`,
      borderRadius: "var(--r-lg)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: accent ? "rgba(255,255,255,0.45)" : "var(--c-text-3)" }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 34,
            height: 34,
            borderRadius: "var(--r-sm)",
            background: accent ? "rgba(255,255,255,0.08)" : "var(--c-surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent ? "var(--c-gold)" : "var(--c-text-3)",
          }}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", color: accent ? "#fff" : "var(--c-ink)", lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
          {trend && (
            <span style={{
              fontSize: 12,
              fontWeight: 600,
              color: trend.positive ? "var(--c-green)" : "var(--c-red)",
              background: trend.positive ? "var(--c-green-bg)" : "var(--c-red-bg)",
              padding: "2px 6px",
              borderRadius: 4,
            }}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </span>
          )}
          {sub && (
            <span style={{ fontSize: 12, color: accent ? "rgba(255,255,255,0.4)" : "var(--c-text-3)" }}>
              {sub}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
