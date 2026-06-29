import { motion } from "motion/react";
import { NavLink } from "react-router";
import {
  Users, Building2, ShoppingBag, Award, Globe2,
  FileText, Lock, BarChart3, ArrowRight, Shield,
  Cpu, Network, Layers, MapPin,
} from "lucide-react";

// ─── Shared ───────────────────────────────────────────────────────────────
const card = "bg-[#0d1424] border border-white/[0.07] rounded-2xl";

// ─── Data ──────────────────────────────────────────────────────────────────
const BADGES = ["Creator Network", "Global Brands", "Commerce Routes", "Verified Deals"];

const WHY_CARDS = [
  { icon: Building2, color: "#3b82f6", title: "Brands need local influence.", desc: "Global companies struggle to connect authentically with local audiences. Korean creators bridge that gap." },
  { icon: Users,     color: "#8b5cf6", title: "Creators need real opportunities.", desc: "Content creators have influence but lack direct access to brand deals, campaigns, and global exposure." },
  { icon: Globe2,    color: "#06b6d4", title: "Hitpick connects both sides.", desc: "Through content, commerce, and verified deal workflows — Hitpick turns introductions into global partnerships." },
];

const WHAT_CARDS = [
  { icon: Users,     color: "#8b5cf6", title: "Creators", desc: "Korean and global creators across beauty, lifestyle, food, travel, fashion, and culture." },
  { icon: Building2, color: "#3b82f6", title: "Brands",   desc: "Companies looking to enter new markets through creator-led campaigns and partnerships." },
  { icon: ShoppingBag, color: "#10b981", title: "Commerce", desc: "Online and offline routes including product reviews, live commerce, pop-ups, and distribution partners." },
  { icon: Award,     color: "#f59e0b", title: "Verified Deals", desc: "Simplified MOU and agreement flows with digital certificates and token-based proof." },
];

const NETWORK_STATS = [
  { val: "100+", label: "Domestic Creator Pool" },
  { val: "30+",  label: "Global Partners" },
  { val: "11+",  label: "Global MOUs" },
  { val: "4+",   label: "Domestic Partnerships" },
  { val: "6+",   label: "Content Categories" },
];

const INFRA_CARDS = [
  { icon: FileText,  color: "#3b82f6", title: "Tablet MOU",          desc: "Sign partnership intent quickly at events or online." },
  { icon: Award,     color: "#10b981", title: "Digital Certificate",  desc: "Receive a verified confirmation by email." },
  { icon: Shield,    color: "#8b5cf6", title: "Document Proof",       desc: "Generate document hash and verification data." },
  { icon: Lock,      color: "#06b6d4", title: "Deal Room",            desc: "Manage follow-up, proposals, and partnership opportunities." },
];

const MARKETS = [
  { label: "Korea",          x: "68%",  y: "30%", color: "#8b5cf6" },
  { label: "Japan",          x: "76%",  y: "29%", color: "#06b6d4" },
  { label: "Southeast Asia", x: "73%",  y: "45%", color: "#10b981" },
  { label: "Middle East",    x: "57%",  y: "37%", color: "#f59e0b" },
  { label: "Europe",         x: "47%",  y: "22%", color: "#3b82f6" },
  { label: "United States",  x: "20%",  y: "28%", color: "#ec4899" },
];

const ERUTY_TAGS = [
  "Korea-based technology company",
  "Content / IP infrastructure",
  "Creator partnership workflows",
  "AI and blockchain-powered systems",
  "Global partnership network",
];

// ─── Component ─────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div className="bg-[#030812] text-white min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── 1. Hero ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(59,130,246,0.10) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 80% 60%, rgba(139,92,246,0.08) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">About Hitpick</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6"
            style={{ fontFamily: "Barlow, sans-serif" }}>
            We connect creators,
            <br />
            <span className="text-blue-400">brands, and global deals.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/50 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Hitpick is a creator-led global deal platform connecting Korean creators, global brands, commerce routes, and verified partnership workflows.
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3">
            {BADGES.map(b => (
              <span key={b} className="text-xs font-semibold bg-white/[0.06] border border-white/[0.10] text-white/60 px-4 py-1.5 rounded-full">
                {b}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. Why We Exist ── */}
      <section className="py-20 px-6 bg-[#020710]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Purpose</p>
          <h2 className="text-4xl font-black text-white mb-12" style={{ fontFamily: "Barlow, sans-serif" }}>Why We Exist</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {WHY_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`${card} p-7`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: `${c.color}18` }}>
                    <Icon size={18} style={{ color: c.color }} />
                  </div>
                  <h3 className="text-base font-black text-white mb-2" style={{ fontFamily: "Barlow, sans-serif" }}>{c.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. What We Connect ── */}
      <section className="py-20 px-6 bg-[#030812]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Platform</p>
          <h2 className="text-4xl font-black text-white mb-12" style={{ fontFamily: "Barlow, sans-serif" }}>What We Connect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHAT_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className={`${card} p-7 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5`}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${c.color}18` }}>
                    <Icon size={22} style={{ color: c.color }} />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: "Barlow, sans-serif" }}>{c.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Network / Traction ── */}
      <section className="py-20 px-6 bg-[#020710]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">Traction</p>
          <h2 className="text-4xl font-black text-white mb-12" style={{ fontFamily: "Barlow, sans-serif" }}>Our Network</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {NETWORK_STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`${card} p-6 text-center`}>
                <div className="text-4xl font-black text-white mb-2" style={{ fontFamily: "Barlow, sans-serif" }}>{s.val}</div>
                <div className="text-xs text-white/40 leading-snug">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Verified Deal Infrastructure ── */}
      <section className="py-20 px-6 bg-[#030812]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Technology</p>
          <h2 className="text-4xl font-black text-white mb-3" style={{ fontFamily: "Barlow, sans-serif" }}>Verified Deal Infrastructure</h2>
          <p className="text-white/45 text-base mb-12 max-w-2xl">
            Hitpick simplifies partnership workflows through tablet-based MOU signing, digital certificates, document verification, and deal room management.
          </p>

          {/* Flow strip */}
          <div className="flex flex-wrap items-center gap-2 mb-10 p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
            {INFRA_CARDS.map((c, i) => (
              <div key={c.title} className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                  <span className="text-sm font-semibold text-white/70">{c.title}</span>
                </div>
                {i < INFRA_CARDS.length - 1 && <span className="text-white/15 text-lg">→</span>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INFRA_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className={`${card} p-6`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${c.color}18` }}>
                    <Icon size={18} style={{ color: c.color }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-white/40 text-sm">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. From Korea to Global Markets ── */}
      <section className="py-20 px-6 bg-[#020710]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">Expansion</p>
          <h2 className="text-4xl font-black text-white mb-3" style={{ fontFamily: "Barlow, sans-serif" }}>From Korea to Global Markets</h2>
          <p className="text-white/45 text-base mb-10 max-w-2xl">
            Hitpick is expanding creator-led partnership networks across Korea, Europe, Southeast Asia, the Middle East, and global markets.
          </p>

          {/* Map container */}
          <div className={`${card} relative overflow-hidden`} style={{ minHeight: "360px" }}>
            {/* SVG world map outline — simplified regions */}
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />

            {/* Grid lines mimicking lat/lng */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "10% 25%" }} />

            {/* Connection lines between Korea and other markets */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {MARKETS.filter(m => m.label !== "Korea").map((m, i) => {
                const koreaX = 68, koreaY = 30;
                const mx = parseFloat(m.x), my = parseFloat(m.y);
                const cpx = (koreaX + mx) / 2, cpy = Math.min(koreaY, my) - 12;
                return (
                  <motion.path
                    key={m.label}
                    d={`M ${koreaX}% ${koreaY}% Q ${cpx}% ${cpy}% ${mx}% ${my}%`}
                    fill="none"
                    stroke={m.color}
                    strokeWidth="0.8"
                    strokeOpacity="0.35"
                    strokeDasharray="4 5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.3 + i * 0.2 }}
                  />
                );
              })}
            </svg>

            {/* Market dots */}
            {MARKETS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                className="absolute flex flex-col items-center gap-1"
                style={{ left: m.x, top: m.y, transform: "translate(-50%, -50%)" }}
              >
                <div className="relative">
                  {m.label === "Korea" && (
                    <motion.div
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: m.color }}
                    />
                  )}
                  <div className="w-3 h-3 rounded-full border-2 border-white/30" style={{ background: m.color }} />
                </div>
                <div className="text-[9px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm" style={{ color: m.color }}>
                  {m.label}
                </div>
              </motion.div>
            ))}

            {/* Bottom label */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-xs text-white/25">Active and expanding markets</span>
            </div>
          </div>

          {/* Market chips */}
          <div className="flex flex-wrap gap-3 mt-6">
            {MARKETS.map(m => (
              <div key={m.label} className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] px-3.5 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                <span className="text-xs font-semibold text-white/60">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Built by ERUTY ── */}
      <section className="py-20 px-6 bg-[#030812]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Company</p>
            <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: "Barlow, sans-serif" }}>Built by ERUTY</h2>
            <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
              Hitpick is operated by ERUTY, a Korea-based technology company building AI and blockchain-powered infrastructure for content, IP, creator partnerships, and global deal workflows.
            </p>
            <div className="flex flex-wrap gap-2">
              {ERUTY_TAGS.map(tag => (
                <span key={tag} className="text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Cpu,      color: "#8b5cf6", label: "AI-powered matching",      sub: "Creator × Brand × Campaign" },
              { icon: Shield,   color: "#06b6d4", label: "Blockchain proof",         sub: "Document hash & token" },
              { icon: Network,  color: "#3b82f6", label: "Partnership workflows",    sub: "MOU → Certificate → Deal" },
              { icon: Layers,   color: "#10b981", label: "Content IP infrastructure",sub: "Korea-based global stack" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`${card} p-5`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}18` }}>
                    <Icon size={16} style={{ color: item.color }} />
                  </div>
                  <div className="text-sm font-bold text-white mb-0.5">{item.label}</div>
                  <div className="text-xs text-white/35">{item.sub}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA ── */}
      <section className="py-24 px-6 bg-[#020710]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-14"
            style={{ background: "linear-gradient(135deg, #0d0020 0%, #0a0f2e 50%, #020810 100%)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.15) 0%, transparent 55%), radial-gradient(ellipse at 75% 50%, rgba(59,130,246,0.12) 0%, transparent 55%)" }} />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "Barlow, sans-serif" }}>
                Ready to build your
                <br />next global deal?
              </h2>
              <p className="text-white/45 text-base mb-10">
                Join the creator-led global deal platform connecting Korean creators, brands, and partners worldwide.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <NavLink to="/global-deal"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                  Build Global Deal <ArrowRight size={14} />
                </NavLink>
                <NavLink to="/creator"
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]">
                  Join Creator Network <ArrowRight size={14} />
                </NavLink>
                <a href="mailto:hello@hitpick.io"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-all">
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
