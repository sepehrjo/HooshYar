import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { HTMLMotionProps } from "framer-motion";
import { MagneticLink } from "@/components/effects";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-beam text-bg-void shadow-magenta-glow hover:shadow-cyan-glow focus-visible:ring-cyan-primary",
  secondary:
    "border border-glass-border bg-glass-bg text-text-primary shadow-glass-lift hover:border-cyan-primary/60 hover:bg-white/[0.07] focus-visible:ring-violet-core",
  ghost:
    "text-text-primary hover:bg-white/[0.06] focus-visible:ring-cyan-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-void disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}

export type ButtonLinkProps = HTMLMotionProps<"a"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <MagneticLink
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
