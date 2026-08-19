import * as React from "react";

type BadgeVariant = "default" | "gold" | "success" | "warning" | "danger" | "info" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, React.CSSProperties> = {
  default: { background: "var(--c-surface-2)", color: "var(--c-text-2)", borderColor: "var(--c-border)" },
  gold:    { background: "rgba(184,155,99,0.12)", color: "var(--c-gold)", borderColor: "rgba(184,155,99,0.25)" },
  success: { background: "var(--c-green-bg)", color: "var(--c-green)", borderColor: "rgba(22,163,74,0.2)" },
  warning: { background: "var(--c-amber-bg)", color: "var(--c-amber)", borderColor: "rgba(217,119,6,0.2)" },
  danger:  { background: "var(--c-red-bg)", color: "var(--c-red)", borderColor: "rgba(220,38,38,0.2)" },
  info:    { background: "var(--c-blue-bg)", color: "var(--c-blue)", borderColor: "rgba(37,99,235,0.2)" },
  outline: { background: "transparent", color: "var(--c-text-2)", borderColor: "var(--c-border-2)" },
};

export function Badge({ variant = "default", style, ...props }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: 22,
        paddingLeft: 8,
        paddingRight: 8,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        borderRadius: 6,
        border: "1px solid",
        whiteSpace: "nowrap",
        ...styles[variant],
        ...style,
      }}
      {...props}
    />
  );
}
