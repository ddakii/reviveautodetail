import { cn } from "@/lib/utils";
import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
}

export function Logo({ variant = "dark", size = "md", className, href = "/" }: LogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-[#0B0B0C]";
  const accentColor = "text-[#C9A86A]";
  const subColor = variant === "light" ? "text-white/60" : "text-[#707070]";

  const sizes = {
    sm: { mark: "w-7 h-7", primary: "text-lg", sub: "text-[9px]" },
    md: { mark: "w-9 h-9", primary: "text-xl", sub: "text-[10px]" },
    lg: { mark: "w-12 h-12", primary: "text-2xl", sub: "text-xs" },
  };

  const s = sizes[size];

  const LogoMark = () => (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(s.mark, "flex-shrink-0")}>
      {/* Geometric R with automotive line */}
      <rect width="36" height="36" fill={variant === "light" ? "rgba(255,255,255,0.1)" : "#0B0B0C"} />
      {/* Letter R */}
      <path
        d="M10 8H10V28H14V21H20L24 28H28.5L24 20.5C26 19.5 27 17.5 27 15C27 11 24 8 20 8H10Z"
        fill={variant === "light" ? "white" : "white"}
        className={variant === "dark" ? "" : ""}
      />
      <path
        d="M14 12H19.5C21.5 12 23 13.5 23 15.5C23 17.5 21.5 19 19.5 19H14V12Z"
        fill="#C9A86A"
      />
      {/* Underline accent - automotive stripe */}
      <rect x="10" y="30" width="16" height="1.5" fill="#C9A86A" />
    </svg>
  );

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <div className="flex flex-col leading-none">
        <span className={cn("font-bold tracking-wider uppercase", s.primary, textColor, "font-['Manrope']")}>
          REVIVE
        </span>
        <span className={cn("tracking-[0.2em] uppercase font-medium", s.sub, subColor, "font-['Inter']")}>
          AUTO DETAIL
        </span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export function LogoMark({ variant = "dark", size = "md", className }: Omit<LogoProps, "href">) {
  const s = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  }[size];

  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(s, className)}>
      <rect width="36" height="36" fill={variant === "light" ? "rgba(255,255,255,0.15)" : "#0B0B0C"} />
      <path
        d="M10 8H10V28H14V21H20L24 28H28.5L24 20.5C26 19.5 27 17.5 27 15C27 11 24 8 20 8H10Z"
        fill="white"
      />
      <path
        d="M14 12H19.5C21.5 12 23 13.5 23 15.5C23 17.5 21.5 19 19.5 19H14V12Z"
        fill="#C9A86A"
      />
      <rect x="10" y="30" width="16" height="1.5" fill="#C9A86A" />
    </svg>
  );
}
