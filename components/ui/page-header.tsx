import * as React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}

export function PageHeader({ title, description, action, breadcrumb }: PageHeaderProps) {
  return (
    <div style={{
      padding: "32px 32px 24px",
      borderBottom: "1px solid var(--c-border)",
      background: "var(--c-surface)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 16,
      flexWrap: "wrap",
    }} className="page-header-bar">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: "var(--c-muted)", fontSize: 12 }}>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} style={{ fontSize: 12, color: "var(--c-text-3)", fontWeight: 500 }}>{crumb.label}</a>
                ) : (
                  <span style={{ fontSize: 12, color: "var(--c-text-3)", fontWeight: 500 }}>{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--c-ink)", letterSpacing: "-0.02em" }}>{title}</h1>
        {description && (
          <p style={{ fontSize: 14, color: "var(--c-text-3)", marginTop: 4 }}>{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
