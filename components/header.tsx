"use client";

import Link from "next/link";
import { Orbit } from "lucide-react";
import { usePathname } from "next/navigation";

import { Container } from "@/components/container";
import { GlowButton } from "@/components/glow-button";
import { cn } from "@/lib/utils";
import { headerActions, primaryNavigation } from "@/lib/site-content";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-50 py-4">
      <Container>
        <div className="rounded-[1.75rem] border border-white/10 bg-[#080A12]/78 px-4 py-4 shadow-[0_20px_80px_rgba(5,6,10,0.55)] backdrop-blur-2xl sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-8">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_26px_rgba(124,92,255,0.12)]">
                  <Orbit className="h-5 w-5 text-[#4AD6FF]" />
                </span>
                <span>
                  <span className="block text-[0.68rem] uppercase tracking-[0.32em] text-white/45">
                    Hitpick
                  </span>
                  <span className="block font-heading text-sm font-medium text-white">
                    Global Deal Room
                  </span>
                </span>
              </Link>

              <nav aria-label="Primary">
                <ul className="flex flex-wrap items-center gap-2">
                  {primaryNavigation.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "inline-flex rounded-full px-4 py-2.5 text-sm transition-all duration-300",
                            isActive
                              ? "border border-white/10 bg-[linear-gradient(135deg,rgba(124,92,255,0.22),rgba(74,214,255,0.14))] text-white shadow-[0_0_30px_rgba(124,92,255,0.24)]"
                              : "text-white/68 hover:bg-white/[0.05] hover:text-white",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <GlowButton
                href={headerActions[0].href}
                variant="secondary"
              >
                {headerActions[0].label}
              </GlowButton>
              <GlowButton
                href={headerActions[1].href}
              >
                {headerActions[1].label}
              </GlowButton>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
