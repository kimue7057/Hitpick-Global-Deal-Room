import type { ReactNode } from "react";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

type GlowButtonVariant = "primary" | "secondary";

type GlowButtonProps = {
  children: ReactNode;
  className?: string;
  href: string;
  showArrow?: boolean;
  variant?: GlowButtonVariant;
};

const variantStyles: Record<GlowButtonVariant, string> = {
  primary:
    "border-transparent bg-[linear-gradient(135deg,#7C5CFF_0%,#7F72FF_42%,#4AD6FF_100%)] text-[#05060A] shadow-[0_0_40px_rgba(103,139,255,0.34)] hover:shadow-[0_0_48px_rgba(103,139,255,0.42)]",
  secondary:
    "border-white/12 bg-white/[0.04] text-white hover:border-[#7C5CFF]/30 hover:bg-white/[0.08] hover:shadow-[0_0_28px_rgba(124,92,255,0.16)]",
};

export function GlowButton({
  children,
  className,
  href,
  showArrow = true,
  variant = "primary",
}: GlowButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5",
        variantStyles[variant],
        className,
      )}
    >
      <span>{children}</span>
      {showArrow ? <ArrowUpRight className="h-4 w-4" /> : null}
    </Link>
  );
}
