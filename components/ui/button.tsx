"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "danger" | "outline" | "link";
type Size = "sm" | "default" | "lg" | "icon" | "icon-sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "default", asChild = false, loading = false, children, className, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const sizeClass = size === "icon-sm" ? "ui-btn-icon-sm" : `ui-btn-${size}`;
    const classes = ["ui-btn", `ui-btn-${variant}`, sizeClass, className].filter(Boolean).join(" ");

    return (
      <Comp
        ref={ref}
        className={classes}
        disabled={asChild ? undefined : disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span style={{ width: 14, height: 14, border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            {children}
          </>
        ) : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
