import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, style, className, ...props }, ref) => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
        {label && (
          <label style={{ fontSize: 13, fontWeight: 500, color: "var(--c-text-2)", display: "block" }}>
            {label}
            {props.required && <span style={{ color: "var(--c-red)", marginLeft: 2 }}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          style={{
            width: "100%",
            height: 40,
            padding: "0 12px",
            fontSize: 14,
            fontFamily: "inherit",
            color: "var(--c-text)",
            background: "var(--c-surface)",
            border: `1px solid ${error ? "var(--c-red)" : "var(--c-border-2)"}`,
            borderRadius: "var(--r-md)",
            outline: "none",
            transition: "border-color var(--t-fast)",
            ...style,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = error ? "var(--c-red)" : "var(--c-gold)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? "var(--c-red)" : "var(--c-border-2)"; }}
          {...props}
        />
        {error && <span style={{ fontSize: 12, color: "var(--c-red)" }}>{error}</span>}
        {hint && !error && <span style={{ fontSize: 12, color: "var(--c-text-3)" }}>{hint}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
