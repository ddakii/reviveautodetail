"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Props {
  data: { month: string; revenue: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--c-ink)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "var(--r-sm)",
      padding: "8px 12px",
    }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>
        ${payload[0].value.toLocaleString()}
      </div>
    </div>
  );
}

export function RevenueChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-text-3)", fontSize: 13 }}>
        No revenue data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barSize={28}>
        <CartesianGrid vertical={false} stroke="var(--c-border)" strokeDasharray="0" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--c-text-3)", fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--c-text-3)", fontSize: 12 }}
          tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--c-surface-2)" }} />
        <Bar dataKey="revenue" fill="var(--c-gold)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
