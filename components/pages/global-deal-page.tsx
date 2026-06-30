"use client";

import { useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Download,
  ExternalLink,
  Globe2,
  Lock,
  Mail,
  Pen,
  RefreshCw,
  Shield,
  X,
} from "lucide-react";

import { MakeAssetImage } from "@/components/make-asset-image";
import { MakeIcon } from "@/components/make-icon";
import { MouBlockchainSummary } from "@/components/mou-blockchain-summary";
import {
  globalDealCreatorCards,
  globalDealTrustStats,
  globalDealValueCards,
  networkCreatorTags,
  networkDistributionTags,
} from "@/lib/make-site-data";
import {
  CERTIFICATE_NOTICE,
  type GlobalDealFormData,
  type GlobalDealIssuePayload,
  type GlobalDealIssuedToken,
  type MouIssueResponse,
  type MouResendResponse,
} from "@/lib/mou/types";

type Market =
  | "Korea"
  | "Japan"
  | "Southeast Asia"
  | "Europe"
  | "Middle East"
  | "United States"
  | "Global";
type Category =
  | "Beauty"
  | "Food & Beverage"
  | "Fashion"
  | "Lifestyle"
  | "Tech"
  | "Gaming"
  | "Entertainment"
  | "Health"
  | "Travel"
  | "Other";
type Goal =
  | "Market Test"
  | "Creator Campaign"
  | "Distribution Entry"
  | "Full Global Expansion"
  | "Partnership MOU";
type ModalStep = "closed" | "form" | "mou" | "token";

const categoryLabel: Record<Category, string> = {
  Beauty: "K-Beauty",
  Entertainment: "Entertainment",
  Fashion: "K-Fashion",
  "Food & Beverage": "Korean Food",
  Gaming: "Gaming",
  Health: "Health & Wellness",
  Lifestyle: "Lifestyle",
  Other: "Niche",
  Tech: "Tech",
  Travel: "Travel",
};

const MARKETS: Market[] = [
  "Korea",
  "Japan",
  "Southeast Asia",
  "Europe",
  "Middle East",
  "United States",
  "Global",
];

const CATEGORIES: Category[] = [
  "Beauty",
  "Food & Beverage",
  "Fashion",
  "Lifestyle",
  "Tech",
  "Gaming",
  "Entertainment",
  "Health",
  "Travel",
  "Other",
];

const GOALS: Goal[] = [
  "Market Test",
  "Creator Campaign",
  "Distribution Entry",
  "Full Global Expansion",
  "Partnership MOU",
];

const cardBase = "bg-[#0d1424] border border-white/[0.07] rounded-2xl";
const inputCls =
  "w-full rounded-xl border border-white/10 bg-[#0a101e] px-4 py-3 text-sm text-white placeholder-white/25 transition-colors focus:border-blue-500/60 focus:outline-none";

function generateRoute(market: Market, category: Category, goal: Goal): string[] {
  const cat = categoryLabel[category];

  switch (goal) {
    case "Market Test":
      return [
        `${market} Market Test`,
        `${cat} Creator Content`,
        "Local Audience Reaction Check",
        "Product Sampling Campaign",
        "Online Commerce Landing",
        "Partnership Follow-up",
      ];
    case "Creator Campaign":
      return [
        `${market} Creator Campaign`,
        `${cat} Creator Matching`,
        "Short-form / Review Content",
        "Audience Activation",
        "Campaign Performance Review",
        "Brand Partnership Follow-up",
      ];
    case "Distribution Entry":
      return [
        `${market} Distribution Entry`,
        `${cat} Market Positioning`,
        "Creator Awareness Campaign",
        "Online Commerce Route",
        "Offline Pop-up / Retail Route",
        "Distribution Partner Matching",
        "Partnership MOU",
      ];
    case "Full Global Expansion":
      return [
        `${market} Full Global Expansion`,
        `${cat} Creator Campaign`,
        "Short-form Review Content",
        "Audience Reaction Data",
        "Online Commerce Activation",
        "Offline Pop-up / Retail Partner",
        "Distribution Partner Matching",
        "Global Partnership MOU",
      ];
    case "Partnership MOU":
      return [
        `${market} Partnership Route`,
        "Brand Expansion Discussion",
        "Creator / Commerce / Distribution Review",
        "Partnership Interest Confirmation",
        "Global Partnership MOU",
        "Deal Room Creation",
      ];
    default:
      return [
        `${market} Market Entry`,
        `${cat} Creator Network`,
        "Creator-led Campaign",
        "Audience Activation",
        "Commerce Route",
        "Distribution Partner Matching",
        "Global Partnership MOU",
      ];
  }
}

function CreatorWallHero({
  category,
  goal,
  market,
  onCreateRoom,
  onMOU,
  onPreview,
  setCategory,
  setGoal,
  setMarket,
}: {
  category: Category | "";
  goal: Goal | "";
  market: Market | "";
  onCreateRoom: () => void;
  onMOU: () => void;
  onPreview: () => void;
  setCategory: (value: Category) => void;
  setGoal: (value: Goal) => void;
  setMarket: (value: Market) => void;
}) {
  const ready = market && category && goal;

  return (
    <section className="relative overflow-hidden bg-[#030812] pb-0 pt-20">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 40%, rgba(37,99,235,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 50%, rgba(124,58,237,0.08) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-start gap-10 pb-10 pt-16 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-center lg:pt-8">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5"
              initial={{ opacity: 0, y: 16 }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                Verified Korean Creator Network
              </span>
            </motion.div>

            <motion.h1
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-5xl font-black leading-[0.97] tracking-tight text-white md:text-[60px]"
              initial={{ opacity: 0, y: 24 }}
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              transition={{ delay: 0.1 }}
            >
              Korean Creators.
              <br />
              <span className="text-blue-400">Global Deals.</span>
            </motion.h1>

            <motion.p
              animate={{ opacity: 1 }}
              className="mb-8 max-w-sm text-base leading-relaxed text-white/50"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              Connect your brand with verified Korean creators, global audiences, and commerce routes.
            </motion.p>

            <motion.div
              animate={{ opacity: 1 }}
              className="mb-10 flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.28 }}
            >
              <button
                className="group flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_28px_rgba(59,130,246,0.45)]"
                onClick={onCreateRoom}
                type="button"
              >
                Build Global Deal{" "}
                <ArrowRight className="transition-transform group-hover:translate-x-1" size={14} />
              </button>
              <button
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                onClick={onMOU}
                type="button"
              >
                <Pen size={13} /> Sign MOU Now
              </button>
            </motion.div>

            <motion.div
              animate={{ opacity: 1 }}
              className="grid grid-cols-4 gap-3"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              {globalDealTrustStats.map((item) => (
                <div className="text-center" key={item.label}>
                  <div
                    className="text-2xl font-black text-white"
                    style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                  >
                    {item.value}
                  </div>
                  <div className="mt-0.5 text-[10px] leading-tight text-white/35">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-3 items-end gap-3">
              {globalDealCreatorCards.map((card, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative overflow-hidden rounded-2xl ${card.heightClassName} cursor-pointer ${card.offsetClassName ?? ""}`}
                  initial={{ opacity: 0, y: 30 }}
                  key={`${card.name}-${card.category}`}
                  transition={{ delay: 0.15 + index * 0.08, duration: 0.5 }}
                >
                  <MakeAssetImage asset={card.asset} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div
                    className="absolute inset-0 rounded-2xl ring-1 ring-inset"
                    style={{ boxShadow: `inset 0 0 0 1px ${card.color}30` }}
                  />

                  <div className="absolute left-0 right-0 bottom-0 p-3">
                    <div
                      className="mb-0.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: card.color }}
                    >
                      {card.category}
                    </div>
                    <div className="mb-1.5 text-xs font-semibold text-white/90">{card.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {card.tags.map((tag) => (
                        <span
                          className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-semibold text-white/60"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
                    <Shield className="text-green-400" size={8} />
                    <span className="text-[8px] font-bold text-green-400">Verified</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-[-1rem] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              initial={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.7 }}
            >
              100+ creators / 6 categories / MOU ready
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-0 mt-10 border-t border-white/5 pb-8 pt-6"
          initial={{ opacity: 0, y: 16 }}
          transition={{ delay: 0.5 }}
        >
          <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white/30">
            Build Your Global Deal
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              className="min-w-[140px] cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#0d1424] px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none"
              onChange={(event) => setMarket(event.target.value as Market)}
              value={market}
            >
              <option value="">Target Market</option>
              {MARKETS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="min-w-[160px] cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#0d1424] px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none"
              onChange={(event) => setCategory(event.target.value as Category)}
              value={category}
            >
              <option value="">Category</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="min-w-[180px] cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#0d1424] px-4 py-2.5 text-sm text-white focus:border-blue-500/50 focus:outline-none"
              onChange={(event) => setGoal(event.target.value as Goal)}
              value={goal}
            >
              <option value="">Launch Goal</option>
              {GOALS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] disabled:cursor-not-allowed disabled:opacity-35"
              disabled={!ready}
              onClick={ready ? onPreview : undefined}
              type="button"
            >
              Create Deal Room <ArrowRight size={13} />
            </button>
            <button
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 transition-all hover:bg-white/10"
              onClick={onMOU}
              type="button"
            >
              <Pen size={12} /> Sign MOU Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LaunchRoutePreview({
  category,
  goal,
  market,
  onCreateRoom,
}: {
  category: Category;
  goal: Goal;
  market: Market;
  onCreateRoom: () => void;
}) {
  const route = generateRoute(market, category, goal);

  return (
    <section className="bg-[#020710] px-6 py-24" id="route-preview">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Route Generated
          </p>
          <h2
            className="text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Your Launch Route is Ready
          </h2>
        </div>

        <div className={`${cardBase} mb-5 p-8`}>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { color: "#3b82f6", label: "Target Market", value: market },
              { color: "#8b5cf6", label: "Category", value: category },
              { color: "#06b6d4", label: "Launch Goal", value: goal },
            ].map((item) => (
              <div className="rounded-xl bg-white/[0.04] p-4" key={item.label}>
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: item.color }}
                >
                  {item.label}
                </p>
                <p className="text-base font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/35">
            Recommended Route
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {route.map((step, index) => (
              <div className="flex items-center gap-2" key={`${step}-${index}`}>
                <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3.5 py-2">
                  <span className="text-xs font-bold text-blue-300 opacity-50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold text-white">{step}</span>
                </div>
                {index < route.length - 1 ? (
                  <ChevronRight className="shrink-0 text-white/20" size={13} />
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
            <p className="text-sm text-white/40">
              Hitpick Support included: Creator Matching, MOU, Deal Room, Token Certificate
            </p>
            <button
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:bg-blue-500"
              onClick={onCreateRoom}
              type="button"
            >
              Create My Deal Room <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueLayer() {
  return (
    <section className="bg-[#030812] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-400">
          Platform Value
        </p>
        <h2
          className="mb-12 text-4xl font-black text-white"
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
        >
          What Hitpick Provides
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {globalDealValueCards.map((item, index) => (
            <motion.div
              className={`${cardBase} p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15`}
              initial={{ opacity: 0, y: 20 }}
              key={item.title}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: `${item.color}18` }}
              >
                <MakeIcon color={item.color} icon={item.icon} />
              </div>
              <h3 className="mb-2 text-sm font-bold text-white">{item.title}</h3>
              <p className="text-xs leading-relaxed text-white/40">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NetworkSection() {
  return (
    <section className="bg-[#020710] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          Ecosystem
        </p>
        <h2
          className="mb-3 text-4xl font-black text-white"
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
        >
          Creator Network Meets Distribution Route
        </h2>
        <p className="mb-12 text-base text-white/45">
          Hitpick connects creator-driven attention with online and offline commerce routes.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`${cardBase} p-7`}>
            <div className="mb-5 flex items-center gap-2">
              <UsersBadge color="text-purple-400" label="Creator Network" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {networkCreatorTags.map((item, index) => (
                <motion.div
                  className="flex items-center gap-2 rounded-xl border border-purple-500/15 bg-purple-500/8 px-3.5 py-2.5"
                  initial={{ opacity: 0 }}
                  key={item}
                  transition={{ delay: index * 0.07 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1 }}
                >
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                  <span className="text-xs font-semibold text-white/75">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className={`${cardBase} p-7`}>
            <div className="mb-5 flex items-center gap-2">
              <UsersBadge color="text-cyan-400" icon={<Globe2 size={16} />} label="Distribution Route" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {networkDistributionTags.map((item, index) => (
                <motion.div
                  className="flex items-center gap-2 rounded-xl border border-cyan-500/15 bg-cyan-500/8 px-3.5 py-2.5"
                  initial={{ opacity: 0 }}
                  key={item}
                  transition={{ delay: index * 0.07 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1 }}
                >
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span className="text-xs font-semibold text-white/75">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] py-5">
          {[
            "Korean Creators",
            "Global Audience",
            "Content Campaign",
            "Online Commerce",
            "Live Commerce",
            "Offline Pop-up",
            "Distribution Partner",
          ].map((item, index, array) => (
            <div className="flex items-center gap-2" key={item}>
              <span className="text-xs font-semibold text-white/55">{item}</span>
              {index < array.length - 1 ? <ChevronRight className="text-white/15" size={11} /> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UsersBadge({
  color,
  icon,
  label,
}: {
  color: string;
  icon?: React.ReactNode;
  label: string;
}) {
  return (
    <>
      {icon ?? <MakeIcon color={color === "text-purple-400" ? "#c084fc" : "#22d3ee"} icon="users" size={16} />}
      <span className={`text-xs font-bold uppercase tracking-widest ${color}`}>{label}</span>
    </>
  );
}

function DealRoomPreview({
  category,
  goal,
  market,
  onCreateRoom,
}: {
  category: Category | "";
  goal: Goal | "";
  market: Market | "";
  onCreateRoom: () => void;
}) {
  const route = market && category && goal ? generateRoute(market, category, goal) : null;

  return (
    <section className="bg-[#030812] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
          Deal Infrastructure
        </p>
        <h2
          className="mb-3 text-4xl font-black text-white"
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
        >
          Your Private Deal Room
        </h2>
        <p className="mb-10 text-base text-white/45">
          After signing the MOU, your brand receives a private deal room for follow-up proposals, documents, campaign routes, and token proof.
        </p>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className={`${cardBase} relative overflow-hidden p-7 lg:col-span-2`}>
            <div
              className="absolute right-0 top-0 h-48 w-48 rounded-full opacity-10 blur-3xl"
              style={{ background: "#3b82f6" }}
            />
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="text-blue-400" size={14} />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  Private Deal Room
                </span>
              </div>
              <span className="rounded-full border border-amber-400/25 bg-amber-400/15 px-2.5 py-1 text-[10px] font-bold text-amber-400">
                MOU PENDING
              </span>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              {[
                { label: "Brand", value: "Your Company" },
                { label: "Market", value: market || "Not selected" },
                { label: "Category", value: category || "Not selected" },
                { label: "Goal", value: goal || "Not selected" },
              ].map((item) => (
                <div className="rounded-xl bg-white/[0.04] p-3" key={item.label}>
                  <p className="mb-0.5 text-[10px] text-white/35">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {route ? (
              <div className="mb-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Recommended Route
                </p>
                <p className="text-xs leading-relaxed text-white/50">{route.join(" → ")}</p>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {[
                "Brand expansion summary",
                "Creator campaign route",
                "Distribution route",
                "MOU document",
                "Verified token proof",
              ].map((item) => (
                <div
                  className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/45"
                  key={item}
                >
                  <CheckCircle2 className="text-green-400" size={10} /> {item}
                </div>
              ))}
            </div>
          </div>

          <div className={`${cardBase} flex flex-col justify-between p-7`}>
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20">
                <Lock className="text-blue-400" size={22} />
              </div>
              <h3
                className="mb-2 text-xl font-black text-white"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Create Your Deal Room
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-white/40">
                Fill in your company info, sign the MOU, and receive your verified Global Deal Token.
              </p>
              <div className="space-y-2 text-xs text-white/40">
                {[
                  "Private company profile",
                  "Verified MOU document",
                  "Deal token certificate",
                  "Admin follow-up dashboard",
                ].map((item) => (
                  <div className="flex items-center gap-2" key={item}>
                    <CheckCircle2 className="text-green-400" size={11} /> {item}
                  </div>
                ))}
              </div>
            </div>
            <button
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:bg-blue-500"
              onClick={onCreateRoom}
              type="button"
            >
              Create My Deal Room <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function DealModal({
  category,
  goal,
  market,
  onClose,
  step,
}: {
  category: Category | "";
  goal: Goal | "";
  market: Market | "";
  onClose: () => void;
  step: ModalStep;
}) {
  const [form, setForm] = useState<GlobalDealFormData>({
    companyName: "",
    contactName: "",
    country: "",
    email: "",
    website: "",
  });
  const [currentStep, setCurrentStep] = useState<"form" | "mou" | "token">(
    step === "mou" ? "mou" : "form",
  );
  const [token, setToken] = useState<GlobalDealIssuedToken | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [issueWarning, setIssueWarning] = useState<string | null>(null);

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const getPosition = (event: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();

    if ("touches" in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDraw = (event: React.MouseEvent | React.TouchEvent) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    isDrawing.current = true;
    lastPosition.current = getPosition(event, canvas);
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;

    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const position = getPosition(event, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPosition.current.x, lastPosition.current.y);
    ctx.lineTo(position.x, position.y);
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPosition.current = position;
    setHasSignature(true);
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const getSignatureImage = () => {
    const canvas = signatureCanvasRef.current;

    if (!canvas || !hasSignature) {
      return null;
    }

    return canvas.toDataURL("image/png");
  };

  const issueToken = async () => {
    const signatureImage = getSignatureImage();

    if (!signatureImage) {
      setIssueError("Please add your signature before issuing the token.");
      return;
    }

    setIsIssuing(true);
    setIssueError(null);
    setIssueWarning(null);

    try {
      const payload: GlobalDealIssuePayload = {
        formData: form,
        route: market && category && goal ? generateRoute(market, category, goal) : [],
        selections: {
          category,
          goal,
          market,
        },
        signatureImage,
        type: "global_deal",
      };
      const response = await fetch("/api/mou/issue", {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as MouIssueResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "Unable to issue the token." : result.error);
      }

      setToken(result.token as GlobalDealIssuedToken);
      setIssueWarning(result.warning ?? null);
      setCurrentStep("token");
    } catch (error) {
      setIssueError(
        error instanceof Error ? error.message : "Unable to issue the token right now.",
      );
    } finally {
      setIsIssuing(false);
    }
  };

  const resendEmail = async () => {
    if (!token) {
      return;
    }

    setIsResending(true);
    setIssueError(null);

    try {
      const response = await fetch("/api/mou/resend", {
        body: JSON.stringify({ submissionId: token.submissionId }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = (await response.json()) as MouResendResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "Unable to resend the email." : result.error);
      }

      setToken((previous) =>
        previous
          ? {
              ...previous,
              adminEmailSent: result.adminEmailSent,
              emailSent: result.emailSent,
            }
          : previous,
      );
    } catch (error) {
      setIssueError(
        error instanceof Error ? error.message : "Unable to resend the email right now.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const downloadCertificate = () => {
    if (!token) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = `/api/mou/certificate/${token.submissionId}`;
    anchor.rel = "noreferrer";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  };

  const openDealRoom = () => {
    if (!token) {
      return;
    }

    window.open(`/deal-room/${token.submissionId}`, "_blank", "noopener,noreferrer");
  };

  const emailUnavailable = issueWarning?.includes("Email delivery is skipped") ?? false;

  if (step === "closed") {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        style={{ background: "rgba(2,7,16,0.92)", backdropFilter: "blur(12px)" }}
      >
        <motion.div
          animate={{ scale: 1, y: 0 }}
          className={`${cardBase} relative max-h-[90vh] w-full max-w-2xl overflow-y-auto`}
          exit={{ scale: 0.95 }}
          initial={{ scale: 0.95, y: 20 }}
          style={{ border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <button
            className="absolute right-5 top-5 z-10 text-white/30 transition-colors hover:text-white/70"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 border-b border-white/5 px-7 pb-5 pt-7">
            {(["form", "mou", "token"] as const).map((item, index) => (
              <div className="flex items-center gap-2" key={item}>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    currentStep === item
                      ? "bg-blue-600 text-white"
                      : ["form", "mou", "token"].indexOf(currentStep) > index
                        ? "bg-green-500 text-white"
                        : "bg-white/10 text-white/30"
                  }`}
                >
                  {["form", "mou", "token"].indexOf(currentStep) > index ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    currentStep === item ? "text-white" : "text-white/30"
                  }`}
                >
                  {item === "form"
                    ? "Company Info"
                    : item === "mou"
                      ? "MOU Signature"
                      : "Deal Token"}
                </span>
                {index < 2 ? <ChevronRight className="text-white/15" size={12} /> : null}
              </div>
            ))}
          </div>

          {currentStep === "form" ? (
            <div className="p-7">
              <h3
                className="mb-1 text-2xl font-black text-white"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Create Your Global Deal Room
              </h3>
              <p className="mb-6 text-sm text-white/40">
                Enter your contact information to create your deal room and continue to the partnership MOU.
              </p>

              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { full: true, key: "companyName", placeholder: "Company Name" },
                  { key: "contactName", placeholder: "Contact Name" },
                  { key: "email", placeholder: "Email Address" },
                  { key: "country", placeholder: "Country" },
                  { key: "website", placeholder: "Website (optional)" },
                ].map((field) => (
                  <input
                    className={`${inputCls} ${field.full ? "sm:col-span-2" : ""}`}
                    key={field.key}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        [field.key]: event.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    value={form[field.key as keyof GlobalDealFormData]}
                  />
                ))}
              </div>

              {market || category || goal ? (
                <div className="mb-5 rounded-xl border border-blue-500/15 bg-blue-500/8 p-4">
                  <p className="mb-2 text-xs font-bold text-blue-400">Auto-filled from your selections</p>
                  <div className="flex flex-wrap gap-2">
                    {market ? (
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50">
                        Market: {market}
                      </span>
                    ) : null}
                    {category ? (
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50">
                        Category: {category}
                      </span>
                    ) : null}
                    {goal ? (
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50">
                        Goal: {goal}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-30"
                disabled={!form.companyName || !form.contactName || !form.email}
                onClick={() => setCurrentStep("mou")}
                type="button"
              >
                Continue to MOU <ArrowRight size={14} />
              </button>
            </div>
          ) : null}

          {currentStep === "mou" ? (
            <div className="p-7">
              <h3
                className="mb-1 text-2xl font-black text-white"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Sign Global Partnership MOU
              </h3>
              <p className="mb-6 text-sm text-white/40">Global Partnership Interest MOU</p>

              <div className="mb-6 space-y-3 rounded-2xl bg-white/[0.03] p-5 text-sm">
                {[
                  { label: "Agreement Type", value: "Global Partnership Interest MOU" },
                  { label: "Company", value: form.companyName || "-" },
                  { label: "Contact", value: form.contactName || "-" },
                  { label: "Email", value: form.email || "-" },
                  {
                    label: "Purpose",
                    value:
                      market && category && goal
                        ? `${market} Market Entry + ${category} Creator Campaign + ${goal}`
                        : "To be determined",
                  },
                ].map((item, index, array) => (
                  <div
                    className={`flex justify-between ${
                      index < array.length - 1 ? "border-b border-white/5 pb-3" : ""
                    }`}
                    key={item.label}
                  >
                    <span className="text-white/40">{item.label}</span>
                    <span className="ml-4 max-w-xs text-right font-semibold text-white/70">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                    Signature Pad
                  </p>
                  <button
                    className="flex items-center gap-1 text-xs text-white/30 transition-colors hover:text-white/60"
                    onClick={clearSignature}
                    type="button"
                  >
                    <RefreshCw size={11} /> Clear
                  </button>
                </div>
                <div
                  className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[#060f20]"
                  style={{ touchAction: "none" }}
                >
                  <canvas
                    className="block w-full cursor-crosshair"
                    height={160}
                    onMouseDown={startDraw}
                    onMouseLeave={stopDraw}
                    onMouseMove={draw}
                    onMouseUp={stopDraw}
                    onTouchEnd={stopDraw}
                    onTouchMove={draw}
                    onTouchStart={startDraw}
                    ref={signatureCanvasRef}
                    width={560}
                  />
                  {!hasSignature ? (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 text-white/15">
                        <Pen size={16} />
                        <span className="text-sm">Please sign here</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-30"
                disabled={!hasSignature || isIssuing}
                onClick={issueToken}
                type="button"
              >
                <Award size={15} /> {isIssuing ? "Issuing Token..." : "Issue Global Deal Token"}
              </button>
              {issueError ? <p className="mt-3 text-sm text-rose-300">{issueError}</p> : null}
            </div>
          ) : null}

          {currentStep === "token" && token ? (
            <div className="p-7">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                  <CheckCircle2 className="text-green-400" size={16} />
                </div>
                <div>
                  <h3
                    className="text-xl font-black text-white"
                    style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                  >
                    Global Deal Token Issued
                  </h3>
                  <p className="text-xs text-white/40">
                    Your partnership MOU has been issued from the server and stored in Hitpick.
                  </p>
                </div>
              </div>

              <div
                className="relative mb-5 overflow-hidden rounded-2xl border p-6"
                style={{
                  background: "linear-gradient(135deg, #060f20 0%, #0a0f28 100%)",
                  borderColor: "rgba(251,191,36,0.3)",
                }}
              >
                <div
                  className="absolute right-0 top-0 h-32 w-32 rounded-full opacity-10 blur-2xl"
                  style={{ background: "#fbbf24" }}
                />
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="text-amber-400" size={18} />
                    <span
                      className="text-sm font-black text-white"
                      style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                    >
                      Hitpick Global Deal Token
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/15 px-3 py-1">
                    <Shield className="text-green-400" size={11} />
                    <span className="text-[11px] font-bold text-green-400">VERIFIED</span>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                  {[
                    { highlight: true, label: "Token ID", value: token.tokenId },
                    { label: "Type", value: token.mouType },
                    { label: "Company", value: token.companyName },
                    { label: "Contact", value: token.contactName },
                    { label: "Email", value: token.email },
                    { label: "Country", value: token.country || "-" },
                    { label: "Website", value: token.website || "-" },
                    { label: "Target Market", value: token.market || "-" },
                    { label: "Category", value: token.category || "-" },
                    { label: "Launch Goal", value: token.goal || "-" },
                    { green: true, label: "Status", value: token.status },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="mb-0.5 text-white/30">{item.label}</p>
                      <p
                        className={`font-semibold ${
                          item.highlight
                            ? "text-amber-300"
                            : item.green
                              ? "text-green-400"
                              : "text-white/80"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-3">
                  <p className="mb-0.5 text-[10px] text-white/30">Document Hash (SHA-256)</p>
                  <p className="break-all font-mono text-[10px] text-cyan-400/70">
                    {token.documentHash}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="mb-0.5 text-[10px] text-white/30">Issued At</p>
                  <p className="text-xs text-white/60">
                    {new Date(token.issuedAt).toLocaleString()}
                  </p>
                </div>
                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="mb-2 text-[10px] text-white/30">Route Summary</p>
                  <div className="flex flex-wrap gap-2">
                    {token.route.map((stepItem) => (
                      <span
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/65"
                        key={stepItem}
                      >
                        {stepItem}
                      </span>
                    ))}
                  </div>
                </div>
                <MouBlockchainSummary blockchain={token.blockchain} tone="amber" />
                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="text-[10px] leading-relaxed text-white/25">{CERTIFICATE_NOTICE}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-semibold transition-all ${
                    token.emailSent
                      ? "border-green-500/25 bg-green-500/15 text-green-400"
                      : "border-blue-500/30 bg-blue-600/80 text-white hover:bg-blue-600"
                  }`}
                  disabled={token.emailSent || isResending || emailUnavailable}
                  onClick={token.emailSent || emailUnavailable ? undefined : resendEmail}
                  type="button"
                >
                  {token.emailSent ? <CheckCircle2 size={16} /> : <Mail size={16} />}
                  {token.emailSent
                    ? "Email Sent"
                    : emailUnavailable
                      ? "Email Not Configured"
                      : isResending
                        ? "Resending..."
                        : "Resend Email"}
                </button>
                <button
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white/70 transition-all hover:bg-white/10"
                  onClick={downloadCertificate}
                  type="button"
                >
                  <Download size={16} />
                  Download
                </button>
                <button
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white/70 transition-all hover:bg-white/10"
                  onClick={openDealRoom}
                  type="button"
                >
                  <ExternalLink size={16} />
                  Deal Room
                </button>
              </div>
              {issueWarning ? <p className="mt-3 text-sm text-amber-300">{issueWarning}</p> : null}
              <p className="mt-2 text-xs text-white/35">
                User email: {token.emailSent ? "sent" : "pending"} / Admin email:{" "}
                {token.adminEmailSent ? "sent" : "pending"}
              </p>
              {issueError ? <p className="mt-2 text-sm text-rose-300">{issueError}</p> : null}
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function GlobalDealPage() {
  const [market, setMarket] = useState<Market | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [showPreview, setShowPreview] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("closed");

  const openForm = () => setModalStep("form");
  const openMOU = () => setModalStep("mou");
  const handlePreview = () => {
    setShowPreview(true);
    window.setTimeout(() => {
      document.getElementById("route-preview")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#030812] pt-16 text-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <CreatorWallHero
        category={category}
        goal={goal}
        market={market}
        onCreateRoom={openForm}
        onMOU={openMOU}
        onPreview={handlePreview}
        setCategory={setCategory}
        setGoal={setGoal}
        setMarket={setMarket}
      />

      <AnimatePresence>
        {showPreview && market && category && goal ? (
          <motion.div animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} initial={{ opacity: 0, y: -10 }}>
            <LaunchRoutePreview
              category={category}
              goal={goal}
              market={market}
              onCreateRoom={openForm}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ValueLayer />
      <NetworkSection />
      <DealRoomPreview category={category} goal={goal} market={market} onCreateRoom={openForm} />

      <DealModal
        category={category}
        goal={goal}
        key={modalStep}
        market={market}
        onClose={() => setModalStep("closed")}
        step={modalStep}
      />
    </div>
  );
}
