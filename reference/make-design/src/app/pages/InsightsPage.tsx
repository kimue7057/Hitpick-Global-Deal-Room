import { motion } from "motion/react";
import { useState } from "react";
import { BarChart3, TrendingUp, Lightbulb, Globe, ArrowRight, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const ENGAGEMENT_DATA = [
  { platform: "TikTok", value: 95, color: "#fe2c55" },
  { platform: "Instagram", value: 58, color: "#444" },
  { platform: "YouTube", value: 47, color: "#333" },
  { platform: "Facebook", value: 31, color: "#2a2a2a" },
  { platform: "Twitter/X", value: 24, color: "#222" },
];

const ROAS_DATA = [
  { month: "Jan", roas: 2.1 }, { month: "Feb", roas: 2.6 }, { month: "Mar", roas: 3.1 },
  { month: "Apr", roas: 2.9 }, { month: "May", roas: 3.5 }, { month: "Jun", roas: 3.8 },
  { month: "Jul", roas: 4.1 }, { month: "Aug", roas: 4.3 }, { month: "Sep", roas: 4.0 },
  { month: "Oct", roas: 4.6 }, { month: "Nov", roas: 5.2 }, { month: "Dec", roas: 5.8 },
];

const REPORTS = [
  {
    tag: "Trend Report",
    title: "What Gen Z Actually Buys After Watching TikTok",
    date: "June 2025",
    read: "8 min read",
    color: "#fe2c55",
    img: "photo-1607082348824-0a96f2a4b9da",
  },
  {
    tag: "Industry Insight",
    title: "Beauty & Personal Care on TikTok: The Full-Funnel Playbook",
    date: "May 2025",
    read: "12 min read",
    color: "#25f4ee",
    img: "photo-1596462502278-27bfdc403348",
  },
  {
    tag: "Platform Data",
    title: "Sound-On Advertising: Why Audio Strategy Defines TikTok ROI",
    date: "April 2025",
    read: "6 min read",
    color: "#7c3aed",
    img: "photo-1558618666-fcd25c85cd64",
  },
  {
    tag: "Commerce Report",
    title: "The Rise of TikTok Shop: From Discovery to $1,000 AOV",
    date: "March 2025",
    read: "10 min read",
    color: "#ff6b35",
    img: "photo-1607082348824-0a96f2a4b9da",
  },
];

const STATS_STRIP = [
  { val: "67%", desc: "of users discover new brands on TikTok" },
  { val: "73%", desc: "feel more connected to brands they interact with on TikTok" },
  { val: "4×", desc: "more likely to buy after seeing a TikTok ad" },
  { val: "89%", desc: "sound-on viewing rate" },
];

export function InsightsPage() {
  const [activeBar, setActiveBar] = useState<string | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10"
          style={{ background: "radial-gradient(circle, #25f4ee 0%, transparent 65%)", filter: "blur(80px)" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#25f4ee]/10 border border-[#25f4ee]/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Lightbulb size={12} className="text-[#25f4ee]" />
            <span className="text-xs font-semibold text-[#25f4ee] uppercase tracking-widest">Insights & Research</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.93] mb-6"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            Data that drives
            <br />
            <span className="text-white/25">decisions.</span>
          </motion.h1>
        </div>
      </section>

      {/* Stats strip */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS_STRIP.map((s, i) => (
            <motion.div
              key={s.val}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#13131a] border border-white/5 rounded-2xl p-6"
            >
              <div className="text-4xl font-black text-[#fe2c55] mb-2" style={{ fontFamily: "Barlow, sans-serif" }}>
                {s.val}
              </div>
              <div className="text-white/45 text-sm leading-relaxed">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement comparison */}
          <div className="bg-[#13131a] border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-[#fe2c55]" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Platform Comparison</span>
            </div>
            <h3 className="text-xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>
              Daily Time In-App (minutes)
            </h3>
            <p className="text-white/35 text-xs mb-8">Global average, Q1 2025</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart id="engagement-chart" data={ENGAGEMENT_DATA} barSize={32}>
                <XAxis dataKey="platform" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{ background: "#1c1c26", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "white", fontSize: 12 }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {ENGAGEMENT_DATA.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ROAS over time */}
          <div className="bg-[#13131a] border border-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-[#25f4ee]" />
              <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Performance Trend</span>
            </div>
            <h3 className="text-xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>
              Average ROAS — 2024
            </h3>
            <p className="text-white/35 text-xs mb-8">Across Smart+ campaigns, all verticals</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart id="roas-chart" data={ROAS_DATA} barSize={18}>
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 7]} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  contentStyle={{ background: "#1c1c26", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "white", fontSize: 12 }}
                  formatter={(val: number) => [`${val}×`, "ROAS"]}
                />
                <Bar dataKey="roas" fill="#25f4ee" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Reports */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Latest Research</p>
              <h2 className="text-3xl font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>Reports & Guides</h2>
            </div>
            <a href="#" className="flex items-center gap-1.5 text-[#25f4ee] text-sm font-semibold hover:gap-2.5 transition-all">
              View all <ArrowRight size={13} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REPORTS.map((r, i) => (
              <motion.a
                key={r.title}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative bg-[#13131a] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden flex gap-0 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative w-28 shrink-0 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${r.img}?w=200&h=200&fit=crop&auto=format`}
                    alt={r.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent, #13131a)` }} />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: r.color }}>{r.tag}</span>
                    <h3 className="text-base font-bold text-white mt-1 leading-snug group-hover:text-white/80 transition-colors">
                      {r.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-white/30">{r.date} · {r.read}</span>
                    <ArrowUpRight size={14} className="text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
