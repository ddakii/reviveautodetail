"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#0B0B0C] text-white hover:bg-[#1a1a1c] focus-visible:ring-[#0B0B0C]",
        gold:
          "bg-[#C9A86A] text-[#0B0B0C] hover:bg-[#b8964f] focus-visible:ring-[#C9A86A] font-semibold",
        outline:
          "border border-[#0B0B0C] bg-transparent text-[#0B0B0C] hover:bg-[#0B0B0C] hover:text-white",
        ghost: "bg-transparent text-[#0B0B0C] hover:bg-[#f0f0ee]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        secondary: "bg-[#151517] text-white hover:bg-[#2a2a2e]",
        link: "text-[#C9A86A] underline-offset-4 hover:underline p-0 h-auto",
        white: "bg-white text-[#0B0B0C] hover:bg-[#f0f0ee]",
      },
      size: {
        default: "h-10 px-5 py-2 text-sm rounded-sm",
        sm: "h-8 px-3 text-xs rounded-sm",
        lg: "h-12 px-8 text-base rounded-sm",
        xl: "h-14 px-10 text-base rounded-sm",
        icon: "h-10 w-10 rounded-sm",
        "icon-sm": "h-8 w-8 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
