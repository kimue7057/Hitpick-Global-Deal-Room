"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";

import { makeImageAssets, navigationItems } from "@/lib/make-site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link className="flex shrink-0 items-center" href="/" onClick={() => setOpen(false)}>
          <img
            alt="Hit Deal Room"
            className="h-11 w-auto"
            src={makeImageAssets.logoWordmark}
            style={{ mixBlendMode: "screen" }}
          />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navigationItems.map((link) => (
            <Link
              className={`rounded-lg px-4 py-2 text-sm transition-all duration-200 ${
                pathname === link.href
                  ? "bg-white/[0.08] font-semibold text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
              href={link.href}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            className="flex items-center gap-2 rounded-full bg-[#7700ff] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#6600ee]"
            href="/global-deal"
            onClick={() => setOpen(false)}
          >
            Build Global Deal <ArrowRight size={13} />
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          className="text-white/60 hover:text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-white/5 bg-[#0a0a0f]/95 px-6 pb-6 backdrop-blur-xl md:hidden"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: -8 }}
          >
            {navigationItems.map((link) => (
              <Link
                className={`block border-b border-white/5 py-3 text-sm ${
                  pathname === link.href ? "font-semibold text-white" : "text-white/60"
                }`}
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#7700ff] px-5 py-3 text-sm font-bold text-white"
              href="/global-deal"
              onClick={() => setOpen(false)}
            >
              Build Global Deal <ArrowRight size={13} />
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
