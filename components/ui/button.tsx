import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-indigo text-indigo-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(var(--indigo)/0.35)] active:translate-y-0",
        variant === "secondary" &&
          "bg-ochre text-ochre-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(var(--ochre)/0.45)] active:translate-y-0",
        variant === "ghost" &&
          "border border-border text-foreground hover:border-foreground-muted hover:bg-surface-muted",
        className
      )}
      {...props}
    />
  );
}