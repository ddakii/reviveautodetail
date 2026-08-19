import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {label && (
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)" }}>
            {label}
            {props.required && <span style={{ color: "var(--c-red)", marginLeft: 2 }}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          style={{
            width: "100%",
            minHeight: 100,
            padding: "10px 12px",
            fontSize: 14,
            fontFamily: "inherit",
            color: "var(--c-text)",
            background: "var(--c-surface)",
            border: `1px solid ${error ? "var(--c-red)" : "var(--c-border-2)"}`,
            borderRadius: "var(--r-md)",
            outline: "none",
            resize: "vertical",
            lineHeight: 1.6,
            transition: "border-color var(--t-fast)",
            ...style,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = error ? "var(--c-red)" : "var(--c-gold)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? "var(--c-red)" : "var(--c-border-2)"; }}
          {...props}
        />
        {error && <span style={{ fontSize: 12, color: "var(--c-red)" }}>{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
