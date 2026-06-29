"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { MakeIcon } from "@/components/make-icon";
import {
  aboutBadges,
  aboutInfraCards,
  aboutMarkets,
  aboutNetworkStats,
  aboutWhatCards,
  aboutWhyCards,
  erutyFeatureCards,
  erutyTags,
} from "@/lib/make-site-data";

const card = "rounded-2xl border border-white/[0.07] bg-[#0d1424]";

export function AboutPage() {
  return (
    <div
      className="min-h-screen bg-[#030812] pt-16 text-white"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <section className="relative overflow-hidden px-6 pb-20 pt-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(59,130,246,0.10) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 60%, rgba(139,92,246,0.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5"
            initial={{ opacity: 0, y: 16 }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
              About Hitpick
            </span>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            transition={{ delay: 0.1 }}
          >
            We connect creators,
            <br />
            <span className="text-blue-400">brands, and global deals.</span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1 }}
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/50"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            Hitpick is a creator-led global deal platform connecting Korean creators, global brands, commerce routes, and verified partnership workflows.
          </motion.p>

          <motion.div
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            {aboutBadges.map((badge) => (
              <span
                className="rounded-full border border-white/[0.10] bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-white/60"
                key={badge}
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#020710] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Purpose
          </p>
          <h2
            className="mb-12 text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Why We Exist
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {aboutWhyCards.map((item, index) => (
              <motion.div
                className={`${card} p-7`}
                initial={{ opacity: 0, y: 20 }}
                key={item.title}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div
                  className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${item.color}18` }}
                >
                  <MakeIcon color={item.color} icon={item.icon} />
                </div>
                <h3
                  className="mb-2 text-base font-black text-white"
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/45">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030812] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-400">
            Platform
          </p>
          <h2
            className="mb-12 text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            What We Connect
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutWhatCards.map((item, index) => (
              <motion.div
                className={`${card} p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15`}
                initial={{ opacity: 0, y: 20 }}
                key={item.title}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: `${item.color}18` }}
                >
                  <MakeIcon color={item.color} icon={item.icon} size={22} />
                </div>
                <h3
                  className="mb-2 text-xl font-black text-white"
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/45">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#020710] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Traction
          </p>
          <h2
            className="mb-12 text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Our Network
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {aboutNetworkStats.map((item, index) => (
              <motion.div
                className={`${card} p-6 text-center`}
                initial={{ opacity: 0, y: 20 }}
                key={item.label}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div
                  className="mb-2 text-4xl font-black text-white"
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  {item.val}
                </div>
                <div className="text-xs leading-snug text-white/40">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030812] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Technology
          </p>
          <h2
            className="mb-3 text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Verified Deal Infrastructure
          </h2>
          <p className="mb-12 max-w-2xl text-base text-white/45">
            Hitpick simplifies partnership workflows through tablet-based MOU signing, digital certificates, document verification, and deal room management.
          </p>

          <div className="mb-10 flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
            {aboutInfraCards.map((item, index) => (
              <div className="flex items-center gap-2" key={item.title}>
                <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-2">
                  <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-sm font-semibold text-white/70">{item.title}</span>
                </div>
                {index < aboutInfraCards.length - 1 ? (
                  <span className="text-lg text-white/15">-&gt;</span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aboutInfraCards.map((item, index) => (
              <motion.div
                className={`${card} p-6`}
                initial={{ opacity: 0, y: 20 }}
                key={item.title}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${item.color}18` }}
                >
                  <MakeIcon color={item.color} icon={item.icon} />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{item.title}</h3>
                <p className="text-sm text-white/40">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#020710] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-green-400">
            Expansion
          </p>
          <h2
            className="mb-3 text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            From Korea to Global Markets
          </h2>
          <p className="mb-10 max-w-2xl text-base text-white/45">
            Hitpick is expanding creator-led partnership networks across Korea, Europe, Southeast Asia, the Middle East, and global markets.
          </p>

          <div className={`${card} relative overflow-hidden`} style={{ minHeight: "360px" }}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "10% 25%",
              }}
            />

            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              {aboutMarkets
                .filter((item) => item.label !== "Korea")
                .map((item, index) => {
                  const koreaX = 68;
                  const koreaY = 30;
                  const marketX = Number.parseFloat(item.x);
                  const marketY = Number.parseFloat(item.y);
                  const controlPointX = (koreaX + marketX) / 2;
                  const controlPointY = Math.min(koreaY, marketY) - 12;

                  return (
                    <motion.path
                      animate={{ opacity: 1, pathLength: 1 }}
                      d={`M ${koreaX}% ${koreaY}% Q ${controlPointX}% ${controlPointY}% ${marketX}% ${marketY}%`}
                      fill="none"
                      initial={{ opacity: 0, pathLength: 0 }}
                      key={item.label}
                      stroke={item.color}
                      strokeDasharray="4 5"
                      strokeOpacity="0.35"
                      strokeWidth="0.8"
                      transition={{ delay: 0.3 + index * 0.2, duration: 1.5 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, pathLength: 1 }}
                    />
                  );
                })}
            </svg>

            {aboutMarkets.map((item, index) => (
              <motion.div
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
                initial={{ opacity: 0, scale: 0 }}
                key={item.label}
                style={{ left: item.x, top: item.y }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                <div className="relative">
                  {item.label === "Korea" ? (
                    <motion.div
                      animate={{ opacity: [0.5, 0, 0.5], scale: [1, 2, 1] }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: item.color }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  ) : null}
                  <div
                    className="h-3 w-3 rounded-full border-2 border-white/30"
                    style={{ background: item.color }}
                  />
                </div>
                <div
                  className="whitespace-nowrap rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold backdrop-blur-sm"
                  style={{ color: item.color }}
                >
                  {item.label}
                </div>
              </motion.div>
            ))}

            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-xs text-white/25">Active and expanding markets</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {aboutMarkets.map((item) => (
              <div
                className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.04] px-3.5 py-1.5"
                key={item.label}
              >
                <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                <span className="text-xs font-semibold text-white/60">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#030812] px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-400">
              Company
            </p>
            <h2
              className="mb-4 text-4xl font-black text-white"
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            >
              Built by ERUTY
            </h2>
            <p className="mb-8 max-w-md text-base leading-relaxed text-white/50">
              Hitpick is operated by ERUTY, a Korea-based technology company building AI and blockchain-powered infrastructure for content, IP, creator partnerships, and global deal workflows.
            </p>
            <div className="flex flex-wrap gap-2">
              {erutyTags.map((tag) => (
                <span
                  className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {erutyFeatureCards.map((item, index) => (
              <motion.div
                className={`${card} p-5`}
                initial={{ opacity: 0, y: 16 }}
                key={item.title}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${item.color}18` }}
                >
                  <MakeIcon color={item.color} icon={item.icon} size={16} />
                </div>
                <div className="mb-0.5 text-sm font-bold text-white">{item.title}</div>
                <div className="text-xs text-white/35">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#020710] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            className="relative overflow-hidden rounded-3xl p-14"
            initial={{ opacity: 0, y: 20 }}
            style={{
              background: "linear-gradient(135deg, #0d0020 0%, #0a0f2e 50%, #020810 100%)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.15) 0%, transparent 55%), radial-gradient(ellipse at 75% 50%, rgba(59,130,246,0.12) 0%, transparent 55%)",
              }}
            />
            <div className="relative z-10">
              <h2
                className="mb-4 text-4xl font-black text-white md:text-5xl"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Ready to build your
                <br />
                next global deal?
              </h2>
              <p className="mb-10 text-base text-white/45">
                Join the creator-led global deal platform connecting Korean creators, brands, and partners worldwide.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  className="flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
                  href="/global-deal"
                >
                  Build Global Deal <ArrowRight size={14} />
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-full bg-purple-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
                  href="/creator"
                >
                  Join Creator Network <ArrowRight size={14} />
                </Link>
                <a
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                  href="mailto:hello@hitpick.io"
                >
                  Contact Hitpick
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
