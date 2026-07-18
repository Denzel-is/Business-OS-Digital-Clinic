import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { classNames } from "@/lib/styles/class-names";

type ButtonSize = "compact" | "default";
type ButtonVariant = "danger" | "ghost" | "primary" | "secondary";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-control border font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45 [&_svg]:size-4 [&_svg]:shrink-0";

const sizeStyles: Record<ButtonSize, string> = {
  compact: "min-h-10 px-4 text-sm",
  default: "min-h-12 px-5 text-sm",
};

const variantStyles: Record<ButtonVariant, string> = {
  danger: "border-danger bg-danger text-canvas hover:bg-danger/90",
  ghost: "border-transparent bg-transparent text-ink-muted hover:bg-white/5 hover:text-ink",
  primary:
    "border-accent bg-accent text-accent-ink hover:border-accent-strong hover:bg-accent-strong",
  secondary: "border-line-strong bg-surface-raised text-ink hover:border-accent/60",
};

function buttonClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  return classNames(baseStyles, sizeStyles[size], variantStyles[variant], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function Button({
  children,
  className,
  icon,
  size = "default",
  type,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClassName(variant, size, className)}
      type={type ?? "button"}
      {...props}
    >
      {children}
      {icon}
    </button>
  );
}

interface ButtonLinkProps {
  children: ReactNode;
  className?: string;
  href: string;
  icon?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

export function ButtonLink({
  children,
  className,
  href,
  icon,
  size = "default",
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link className={buttonClassName(variant, size, className)} href={href}>
      {children}
      {icon}
    </Link>
  );
}
