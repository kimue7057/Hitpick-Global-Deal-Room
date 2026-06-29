import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe2, Zap, Users, ShoppingBag, Store, FileText, Lock, Award,
  ArrowRight, CheckCircle2, ChevronRight, X, Pen, RefreshCw,
  Download, Mail, ExternalLink, Shield, Building2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Market = "Korea" | "Japan" | "Southeast Asia" | "Europe" | "Middle East" | "United States" | "Global";
type Category = "Beauty" | "Food & Beverage" | "Fashion" | "Lifestyle" | "Tech" | "Gaming" | "Entertainment" | "Health" | "Travel" | "Other";
type Goal = "Market Test" | "Creator Campaign" | "Distribution Entry" | "Full Global Expansion" | "Partnership MOU";
type ModalStep = "closed" | "form" | "mou" | "token";

interface FormData {
  companyName: string; contactName: string; email: string; country: string; website: string;
}
interface TokenData extends FormData {
  market: Market; category: Category; goal: Goal;
  route: string[]; tokenId: string; hash: string; issuedAt: string;
}

// ─── Route generation ────────────────────────────────────────────────────────
const categoryLabel: Record<Category, string> = {
  "Beauty": "K-Beauty", "Food & Beverage": "Korean Food", "Fashion": "K-Fashion",
  "Lifestyle": "Lifestyle", "Tech": "Tech", "Gaming": "Gaming",
  "Entertainment": "Entertainment", "Health": "Health & Wellness", "Travel": "Travel", "Other": "Niche",
};

function generateRoute(market: Market, category: Category, goal: Goal): string[] {
  const cat = categoryLabel[category];
  switch (goal) {
    case "Market Test":
      return [`${market} Market Test`, `${cat} Creator Content`, "Local Audience Reaction Check", "Product Sampling Campaign", "Online Commerce Landing", "Partnership Follow-up"];
    case "Creator Campaign":
      return [`${market} Creator Campaign`, `${cat} Creator Matching`, "Short-form / Review Content", "Audience Activation", "Campaign Performance Review", "Brand Partnership Follow-up"];
    case "Distribution Entry":
      return [`${market} Distribution Entry`, `${cat} Market Positioning`, "Creator Awareness Campaign", "Online Commerce Route", "Offline Pop-up / Retail Route", "Distribution Partner Matching", "Partnership MOU"];
    case "Full Global Expansion":
      return [`${market} Full Global Expansion`, `${cat} Creator Campaign`, "Short-form Review Content", "Audience Reaction Data", "Online Commerce Activation", "Offline Pop-up / Retail Partner", "Distribution Partner Matching", "Global Partnership MOU"];
    case "Partnership MOU":
      return [`${market} Partnership Route`, "Brand Expansion Discussion", "Creator / Commerce / Distribution Review", "Partnership Interest Confirmation", "Global Partnership MOU", "Deal Room Creation"];
    default:
      return [`${market} Market Entry`, `${cat} Creator Network`, "Creator-led Campaign", "Audience Activation", "Commerce Route", "Distribution Partner Matching", "Global Partnership MOU"];
  }
}

// ─── SHA-256 (WebCrypto) ──────────────────────────────────────────────────────
async function sha256(msg: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function genTokenId() {
  const seq = String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0");
  return `HP-DEAL-${new Date().getFullYear()}-${seq}`;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const MARKETS: Market[] = ["Korea", "Japan", "Southeast Asia", "Europe", "Middle East", "United States", "Global"];
const CATEGORIES: Category[] = ["Beauty", "Food & Beverage", "Fashion", "Lifestyle", "Tech", "Gaming", "Entertainment", "Health", "Travel", "Other"];
const GOALS: Goal[] = ["Market Test", "Creator Campaign", "Distribution Entry", "Full Global Expansion", "Partnership MOU"];

const FLOW_NODES = [
  { label: "Your Brand", icon: Building2, color: "#3b82f6" },
  { label: "Korean & Global Creators", icon: Users, color: "#8b5cf6" },
  { label: "Audience Activation", icon: Zap, color: "#06b6d4" },
  { label: "Online Commerce", icon: ShoppingBag, color: "#10b981" },
  { label: "Offline Pop-up", icon: Store, color: "#f59e0b" },
  { label: "Distribution Partner", icon: Globe2, color: "#3b82f6" },
  { label: "Partnership MOU", icon: FileText, color: "#8b5cf6" },
  { label: "Global Deal Token", icon: Award, color: "#fbbf24" },
];

const VALUE_CARDS = [
  { icon: Users, color: "#3b82f6", title: "Creator Matching", desc: "Connect with Korean and global creators based on category, audience, language, and market fit." },
  { icon: Zap, color: "#8b5cf6", title: "Campaign Planning", desc: "Design creator-led campaigns for awareness, market testing, product reviews, and launch activation." },
  { icon: Globe2, color: "#06b6d4", title: "Audience Activation", desc: "Turn creator content into audience attention, interest, and market response." },
  { icon: ShoppingBag, color: "#10b981", title: "Online Commerce Route", desc: "Connect campaign traffic to online sales channels, landing pages, and commerce partners." },
  { icon: Store, color: "#f59e0b", title: "Offline Distribution Route", desc: "Explore pop-up stores, retail partners, local distributors, and offline sales opportunities." },
  { icon: FileText, color: "#3b82f6", title: "Partnership MOU", desc: "Move from meeting to partnership interest through simplified tablet-based MOU signing." },
  { icon: Lock, color: "#8b5cf6", title: "Private Deal Room", desc: "Create a private space to manage brand information, proposals, documents, and follow-up actions." },
  { icon: Award, color: "#fbbf24", title: "Verified Deal Token", desc: "Receive a digital proof certificate linked to the signed MOU and document verification hash." },
];

// ─── Shared styles ─────────────────────────────────────────────────────────
const cardBase = "bg-[#0d1424] border border-white/[0.07] rounded-2xl";
const inputCls = "w-full bg-[#0a101e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/60 transition-colors";

// ─── Creator Wall Hero ─────────────────────────────────────────────────────────
const CREATOR_CARDS = [
  {
    img: "photo-1557002665-c552e1832483",
    name: "Jiyeon K.",
    category: "Beauty Creator",
    tags: ["Instagram · TikTok", "Global Audience"],
    color: "#ec4899",
    height: "h-64",
  },
  {
    img: "photo-1695753640148-0c7b3bcd3b2b",
    name: "Minjun L.",
    category: "Lifestyle Creator",
    tags: ["Brand Collab", "Co-creation Ready"],
    color: "#8b5cf6",
    height: "h-56",
  },
  {
    img: "photo-1548809685-e3831a2aaa5f",
    name: "Soyeon P.",
    category: "Food Creator",
    tags: ["Korea · Europe", "Short-form"],
    color: "#f59e0b",
    height: "h-72",
  },
  {
    img: "photo-1609375358560-3781c23ca756",
    name: "Daehyun C.",
    category: "Short-form Creator",
    tags: ["TikTok · Reels", "Product Review"],
    color: "#06b6d4",
    height: "h-60",
  },
  {
    img: "photo-1542062700-9b61ccbc1696",
    name: "Yuna S.",
    category: "Fashion Creator",
    tags: ["Instagram · YouTube", "Creator Campaign"],
    color: "#3b82f6",
    height: "h-68",
  },
  {
    img: "photo-1651659802541-774e231b05ed",
    name: "Hyelin J.",
    category: "Travel Creator",
    tags: ["Global Content", "Partnership Ready"],
    color: "#10b981",
    height: "h-56",
  },
];

const TRUST_STATS = [
  { value: "100+", label: "Verified Creators" },
  { value: "30+", label: "Global Partners" },
  { value: "6+", label: "Content Categories" },
  { value: "MOU", label: "in Minutes" },
];

function CreatorWallHero({
  market, setMarket, category, setCategory, goal, setGoal,
  onCreateRoom, onMOU, onPreview,
}: {
  market: Market | ""; setMarket: (v: Market) => void;
  category: Category | ""; setCategory: (v: Category) => void;
  goal: Goal | ""; setGoal: (v: Goal) => void;
  onCreateRoom: () => void; onMOU: () => void; onPreview: () => void;
}) {
  const ready = market && category && goal;

  return (
    <section className="relative pt-20 pb-0 overflow-hidden bg-[#030812]">
      {/* BG */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 30% 40%, rgba(37,99,235,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 50%, rgba(124,58,237,0.08) 0%, transparent 60%)" }} />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 pt-16 pb-10 items-start">

          {/* ── Left copy ── */}
          <div className="flex flex-col justify-center lg:pt-8">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Verified Korean Creator Network</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-[60px] font-black text-white leading-[0.97] tracking-tight mb-5"
              style={{ fontFamily: "Barlow, sans-serif" }}>
              Korean Creators.
              <br />
              <span className="text-blue-400">Global Deals.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-white/50 text-base leading-relaxed mb-8 max-w-sm">
              Connect your brand with verified Korean creators, global audiences, and commerce routes.
            </motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="flex flex-wrap gap-3 mb-10">
              <button onClick={onCreateRoom} className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(59,130,246,0.45)]">
                Build Global Deal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={onMOU} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all">
                <Pen size={13} /> Sign MOU Now
              </button>
            </motion.div>

            {/* Trust stats */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="grid grid-cols-4 gap-3">
              {TRUST_STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>{s.value}</div>
                  <div className="text-[10px] text-white/35 mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Creator Wall ── */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-3 items-end">
              {CREATOR_CARDS.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                  className={`relative rounded-2xl overflow-hidden ${c.height} group cursor-pointer`}
                  style={{ marginTop: i % 3 === 1 ? "24px" : "0" }}
                >
                  <img
                    src={`https://images.unsplash.com/${c.img}?w=400&h=600&fit=crop&auto=format`}
                    alt={c.category}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Color rim */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset" style={{ boxShadow: `inset 0 0 0 1px ${c.color}30` }} />

                  {/* Card info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: c.color }}>
                      {c.category}
                    </div>
                    <div className="text-xs font-semibold text-white/90 mb-1.5">{c.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map(t => (
                        <span key={t} className="text-[9px] font-semibold bg-white/10 text-white/60 px-1.5 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Verified badge */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                    <Shield size={8} className="text-green-400" />
                    <span className="text-[8px] font-bold text-green-400">Verified</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating deal count badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] whitespace-nowrap"
            >
              100+ creators · 6 categories · MOU ready
            </motion.div>
          </div>
        </div>

        {/* ── Compact Deal Builder bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 mb-0 border-t border-white/5 pt-6 pb-8"
        >
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-4">Build Your Global Deal</p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={market}
              onChange={e => setMarket(e.target.value as Market)}
              className="bg-[#0d1424] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer min-w-[140px]"
            >
              <option value="">Target Market</option>
              {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="bg-[#0d1424] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="">Category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value as Goal)}
              className="bg-[#0d1424] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer min-w-[180px]"
            >
              <option value="">Launch Goal</option>
              {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <button
              onClick={ready ? onPreview : undefined}
              disabled={!ready}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-35 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
            >
              Create Deal Room <ArrowRight size={13} />
            </button>
            <button
              onClick={onMOU}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              <Pen size={12} /> Sign MOU Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SelectorPanel({ label, options, value, onChange, color }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; color: string;
}) {
  return (
    <div className={`${cardBase} p-5`}>
      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color }}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
              value === opt
                ? "text-white border-transparent"
                : "text-white/45 border-white/[0.08] hover:text-white hover:border-white/20"
            }`}
            style={value === opt ? { background: color, borderColor: color } : {}}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Launch Route Preview ─────────────────────────────────────────────────────
function LaunchRoutePreview({ market, category, goal, onCreateRoom }: {
  market: Market; category: Category; goal: Goal; onCreateRoom: () => void;
}) {
  const route = generateRoute(market, category, goal);
  return (
    <section id="route-preview" className="py-24 px-6 bg-[#020710]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Route Generated</p>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>Your Launch Route is Ready</h2>
        </div>

        <div className={`${cardBase} p-8 mb-5`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Target Market", value: market, color: "#3b82f6" },
              { label: "Category", value: category, color: "#8b5cf6" },
              { label: "Launch Goal", value: goal, color: "#06b6d4" },
            ].map(item => (
              <div key={item.label} className="bg-white/[0.04] rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: item.color }}>{item.label}</p>
                <p className="text-white font-bold text-base">{item.value}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-4">Recommended Route</p>
          <div className="flex flex-wrap items-center gap-2">
            {route.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-3.5 py-2">
                  <span className="text-xs font-bold text-blue-300 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-semibold text-white">{step}</span>
                </div>
                {i < route.length - 1 && <ChevronRight size={13} className="text-white/20 shrink-0" />}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-white/40">Hitpick Support included: Creator Matching, MOU, Deal Room, Token Certificate</p>
            </div>
            <button onClick={onCreateRoom} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-full text-sm transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]">
              Create My Deal Room <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Hitpick Value Layer ──────────────────────────────────────────────────────
function ValueLayer() {
  return (
    <section className="py-24 px-6 bg-[#030812]">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Platform Value</p>
        <h2 className="text-4xl font-black text-white mb-12" style={{ fontFamily: "Barlow, sans-serif" }}>What Hitpick Provides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`${cardBase} p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${card.color}18` }}>
                  <Icon size={18} style={{ color: card.color }} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{card.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Creator & Distribution Network ─────────────────────────────────────────
function NetworkSection() {
  const creators = ["K-Beauty Creators", "K-Food Creators", "Lifestyle Creators", "Short-form Creators", "Live Commerce Hosts", "Global Audience Creators"];
  const distribution = ["Online Commerce", "Live Commerce", "Offline Pop-up", "Retail Partner", "Distribution Partner", "Market Testing"];

  return (
    <section className="py-24 px-6 bg-[#020710]">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Ecosystem</p>
        <h2 className="text-4xl font-black text-white mb-3" style={{ fontFamily: "Barlow, sans-serif" }}>Creator Network Meets Distribution Route</h2>
        <p className="text-white/45 text-base mb-12">Hitpick connects creator-driven attention with online and offline commerce routes.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Creator side */}
          <div className={`${cardBase} p-7`}>
            <div className="flex items-center gap-2 mb-5">
              <Users size={16} className="text-purple-400" />
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Creator Network</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {creators.map((c, i) => (
                <motion.div key={c} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-2 bg-purple-500/8 border border-purple-500/15 rounded-xl px-3.5 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                  <span className="text-xs font-semibold text-white/75">{c}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Distribution side */}
          <div className={`${cardBase} p-7`}>
            <div className="flex items-center gap-2 mb-5">
              <Globe2 size={16} className="text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Distribution Route</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {distribution.map((d, i) => (
                <motion.div key={d} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-2 bg-cyan-500/8 border border-cyan-500/15 rounded-xl px-3.5 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span className="text-xs font-semibold text-white/75">{d}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow indicator */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 py-5 border border-white/5 rounded-2xl bg-white/[0.02]">
          {["Korean Creators", "Global Audience", "Content Campaign", "Online Commerce", "Live Commerce", "Offline Pop-up", "Distribution Partner"].map((node, i) => (
            <div key={node} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white/55">{node}</span>
              {i < 6 && <ChevronRight size={11} className="text-white/15" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Deal Room Preview ────────────────────────────────────────────────────────
function DealRoomPreview({ market, category, goal, onCreateRoom }: {
  market: Market | ""; category: Category | ""; goal: Goal | ""; onCreateRoom: () => void;
}) {
  const route = market && category && goal ? generateRoute(market as Market, category as Category, goal as Goal) : null;

  return (
    <section className="py-24 px-6 bg-[#030812]">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Deal Infrastructure</p>
        <h2 className="text-4xl font-black text-white mb-3" style={{ fontFamily: "Barlow, sans-serif" }}>Your Private Deal Room</h2>
        <p className="text-white/45 text-base mb-10">After signing the MOU, your brand receives a private deal room for follow-up proposals, documents, campaign routes, and token proof.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Preview card */}
          <div className={`${cardBase} p-7 lg:col-span-2 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: "#3b82f6" }} />
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Private Deal Room</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/25 px-2.5 py-1 rounded-full">MOU PENDING</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Brand", value: "Your Company" },
                { label: "Market", value: market || "Not selected" },
                { label: "Category", value: category || "Not selected" },
                { label: "Goal", value: goal || "Not selected" },
              ].map(item => (
                <div key={item.label} className="bg-white/[0.04] rounded-xl p-3">
                  <p className="text-[10px] text-white/35 mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {route && (
              <div className="mb-5">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Recommended Route</p>
                <p className="text-xs text-white/50 leading-relaxed">{route.join(" → ")}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {["Brand expansion summary", "Creator campaign route", "Distribution route", "MOU document", "Verified token proof"].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-[11px] text-white/45 bg-white/[0.04] px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={10} className="text-green-400" /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className={`${cardBase} p-7 flex flex-col justify-between`}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-4">
                <Lock size={22} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: "Barlow, sans-serif" }}>Create Your Deal Room</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">Fill in your company info, sign the MOU, and receive your verified Global Deal Token.</p>
              <div className="space-y-2 text-xs text-white/40">
                {["Private company profile", "Verified MOU document", "Deal token certificate", "Admin follow-up dashboard"].map(f => (
                  <div key={f} className="flex items-center gap-2"><CheckCircle2 size={11} className="text-green-400" /> {f}</div>
                ))}
              </div>
            </div>
            <button onClick={onCreateRoom} className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all hover:shadow-[0_0_25px_rgba(59,130,246,0.35)]">
              Create My Deal Room <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Multi-step Modal ─────────────────────────────────────────────────────────
function DealModal({
  step, onClose, market, category, goal,
}: {
  step: ModalStep; onClose: () => void;
  market: Market | ""; category: Category | ""; goal: Goal | "";
}) {
  const [form, setForm] = useState<FormData>({ companyName: "", contactName: "", email: "", country: "", website: "" });
  const [currentStep, setCurrentStep] = useState<"form" | "mou" | "token">("form");
  const [token, setToken] = useState<TokenData | null>(null);
  const [hasSig, setHasSig] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Reset on open
  useEffect(() => {
    if (step !== "closed") {
      setCurrentStep(step === "mou" ? "mou" : "form");
      setHasSig(false);
      setEmailSent(false);
      setToken(null);
    }
  }, [step]);

  // Signature pad
  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
    setHasSig(true);
  };

  const stopDraw = () => { isDrawing.current = false; };

  const clearSig = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const issueToken = async () => {
    const id = genTokenId();
    const now = new Date().toISOString();
    const hash = await sha256(`${form.companyName}${form.email}${id}${now}`);
    const route = market && category && goal ? generateRoute(market as Market, category as Category, goal as Goal) : [];
    setToken({ ...form, market: market as Market, category: category as Category, goal: goal as Goal, route, tokenId: id, hash, issuedAt: now });
    setCurrentStep("token");
  };

  if (step === "closed") return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(2,7,16,0.92)", backdropFilter: "blur(12px)" }}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className={`${cardBase} w-full max-w-2xl max-h-[90vh] overflow-y-auto relative`} style={{ border: "1px solid rgba(59,130,246,0.2)" }}>
          {/* Close */}
          <button onClick={onClose} className="absolute top-5 right-5 text-white/30 hover:text-white/70 transition-colors z-10"><X size={18} /></button>

          {/* Step indicator */}
          <div className="flex items-center gap-3 px-7 pt-7 pb-5 border-b border-white/5">
            {(["form", "mou", "token"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${currentStep === s ? "bg-blue-600 text-white" : (["form", "mou", "token"].indexOf(currentStep) > i) ? "bg-green-500 text-white" : "bg-white/10 text-white/30"}`}>
                  {["form", "mou", "token"].indexOf(currentStep) > i ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${currentStep === s ? "text-white" : "text-white/30"}`}>
                  {s === "form" ? "Company Info" : s === "mou" ? "MOU Signature" : "Deal Token"}
                </span>
                {i < 2 && <ChevronRight size={12} className="text-white/15" />}
              </div>
            ))}
          </div>

          {/* Step: Form */}
          {currentStep === "form" && (
            <div className="p-7">
              <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>Create Your Global Deal Room</h3>
              <p className="text-white/40 text-sm mb-6">Enter your contact information to create your deal room and continue to the partnership MOU.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {[
                  { key: "companyName", placeholder: "Company Name", full: true },
                  { key: "contactName", placeholder: "Contact Name" },
                  { key: "email", placeholder: "Email Address" },
                  { key: "country", placeholder: "Country" },
                  { key: "website", placeholder: "Website (optional)" },
                ].map(f => (
                  <input
                    key={f.key}
                    className={`${inputCls} ${f.full ? "sm:col-span-2" : ""}`}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof FormData]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  />
                ))}
              </div>

              {/* Auto-filled selections */}
              {(market || category || goal) && (
                <div className="bg-blue-500/8 border border-blue-500/15 rounded-xl p-4 mb-5">
                  <p className="text-xs font-bold text-blue-400 mb-2">Auto-filled from your selections</p>
                  <div className="flex flex-wrap gap-2">
                    {market && <span className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-full">Market: {market}</span>}
                    {category && <span className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-full">Category: {category}</span>}
                    {goal && <span className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-full">Goal: {goal}</span>}
                  </div>
                </div>
              )}

              <button
                disabled={!form.companyName || !form.contactName || !form.email}
                onClick={() => setCurrentStep("mou")}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all"
              >
                Continue to MOU <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Step: MOU Signature */}
          {currentStep === "mou" && (
            <div className="p-7">
              <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>Sign Global Partnership MOU</h3>
              <p className="text-white/40 text-sm mb-6">Global Partnership Interest MOU</p>

              {/* MOU fields */}
              <div className="bg-white/[0.03] rounded-2xl p-5 mb-6 space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/40">Agreement Type</span><span className="text-white font-semibold">Global Partnership Interest MOU</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/40">Company</span><span className="text-white font-semibold">{form.companyName || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/40">Contact</span><span className="text-white font-semibold">{form.contactName || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/40">Email</span><span className="text-white/70">{form.email || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Purpose</span>
                  <span className="text-white/70 text-right max-w-xs">
                    {market && category && goal ? `${market} Market Entry + ${category} Creator Campaign + ${goal}` : "To be determined"}
                  </span>
                </div>
              </div>

              {/* Signature pad */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Signature Pad</p>
                  <button onClick={clearSig} className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"><RefreshCw size={11} /> Clear</button>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-[#060f20]" style={{ touchAction: "none" }}>
                  <canvas
                    ref={sigCanvasRef}
                    width={560} height={160}
                    className="w-full"
                    style={{ cursor: "crosshair", display: "block" }}
                    onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                    onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                  />
                  {!hasSig && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex items-center gap-2 text-white/15">
                        <Pen size={16} />
                        <span className="text-sm">Please sign here</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                disabled={!hasSig}
                onClick={issueToken}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all"
              >
                <Award size={15} /> Issue Global Deal Token
              </button>
            </div>
          )}

          {/* Step: Token Issued */}
          {currentStep === "token" && token && (
            <div className="p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>Global Deal Token Issued</h3>
                  <p className="text-white/40 text-xs">Your partnership MOU has been signed and verified.</p>
                </div>
              </div>

              {/* Certificate */}
              <div className="relative rounded-2xl overflow-hidden border p-6 mb-5" style={{ background: "linear-gradient(135deg, #060f20 0%, #0a0f28 100%)", borderColor: "rgba(251,191,36,0.3)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: "#fbbf24" }} />
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-amber-400" />
                    <span className="text-sm font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>Hitpick Global Deal Token</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/25 px-3 py-1 rounded-full">
                    <Shield size={11} className="text-green-400" />
                    <span className="text-[11px] font-bold text-green-400">VERIFIED</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  {[
                    { label: "Token ID", value: token.tokenId, highlight: true },
                    { label: "Type", value: "Global Partnership Interest MOU" },
                    { label: "Company", value: token.companyName },
                    { label: "Contact", value: token.contactName },
                    { label: "Email", value: token.email },
                    { label: "Country", value: token.country || "—" },
                    { label: "Target Market", value: token.market || "—" },
                    { label: "Category", value: token.category || "—" },
                    { label: "Launch Goal", value: token.goal || "—" },
                    { label: "Status", value: "Verified", green: true },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-white/30 mb-0.5">{f.label}</p>
                      <p className={`font-semibold ${f.highlight ? "text-amber-300" : f.green ? "text-green-400" : "text-white/80"}`}>{f.value}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-3">
                  <p className="text-white/30 text-[10px] mb-0.5">Document Hash (SHA-256)</p>
                  <p className="text-[10px] font-mono text-cyan-400/70 break-all">{token.hash}</p>
                </div>
                <div className="mt-2">
                  <p className="text-white/30 text-[10px] mb-0.5">Issued At</p>
                  <p className="text-white/60 text-xs">{new Date(token.issuedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setEmailSent(true)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all border ${emailSent ? "bg-green-500/15 border-green-500/25 text-green-400" : "bg-blue-600/80 hover:bg-blue-600 border-blue-500/30 text-white"}`}
                >
                  {emailSent ? <CheckCircle2 size={16} /> : <Mail size={16} />}
                  {emailSent ? "Sent!" : "Send to Email"}
                </button>
                <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all">
                  <Download size={16} />Download
                </button>
                <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all">
                  <ExternalLink size={16} />Deal Room
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Page root ─────────────────────────────────────────────────────────────────
export function GlobalDealPage() {
  const [market, setMarket] = useState<Market | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [showPreview, setShowPreview] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("closed");

  const openForm = () => setModalStep("form");
  const openMOU = () => setModalStep("mou");
  const handlePreview = () => { setShowPreview(true); setTimeout(() => document.getElementById("route-preview")?.scrollIntoView({ behavior: "smooth" }), 50); };

  return (
    <div className="bg-[#030812] text-white min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>
      <CreatorWallHero
        market={market} setMarket={setMarket}
        category={category} setCategory={setCategory}
        goal={goal} setGoal={setGoal}
        onCreateRoom={openForm} onMOU={openMOU} onPreview={handlePreview}
      />

      <AnimatePresence>
        {showPreview && market && category && goal && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <LaunchRoutePreview market={market as Market} category={category as Category} goal={goal as Goal} onCreateRoom={openForm} />
          </motion.div>
        )}
      </AnimatePresence>

      <ValueLayer />
      <NetworkSection />
      <DealRoomPreview market={market} category={category} goal={goal} onCreateRoom={openForm} />

      <DealModal step={modalStep} onClose={() => setModalStep("closed")} market={market} category={category} goal={goal} />
    </div>
  );
}
