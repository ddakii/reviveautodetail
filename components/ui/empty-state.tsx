import * as React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "64px 32px",
      gap: 12,
    }}>
      {icon && (
        <div style={{
          width: 48,
          height: 48,
          borderRadius: "var(--r-lg)",
          background: "var(--c-surface-2)",
          border: "1px solid var(--c-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--c-muted)",
          marginBottom: 4,
        }}>
          {icon}
        </div>
      )}
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--c-ink)" }}>{title}</div>
      {description && <p style={{ fontSize: 13, color: "var(--c-text-3)", maxWidth: 360 }}>{description}</p>}
      {action && (
        <Button variant="secondary" size="sm" style={{ marginTop: 8 }} onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
