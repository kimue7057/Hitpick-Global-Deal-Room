import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, Target, TrendingUp, Zap, BarChart3, Eye, ShoppingBag, Smartphone, Users } from "lucide-react";

const CATEGORIES = ["All", "Brand", "Performance", "Commerce", "Awareness"];

const FORMATS = [
  {
    name: "TopView",
    category: "Brand",
    tag: "Premium",
    icon: Eye,
    color: "#fe2c55",
    bg: "from-[#fe2c55]/20 to-[#fe2c55]/5",
    desc: "Own the first screen-open moment. Full-screen, sound-on, unskippable — maximum brand impact on day one.",
    metric1: "2.4×", metric1Label: "Brand recall lift",
    metric2: "89%", metric2Label: "Completion rate",
  },
  {
    name: "Branded Hashtag Challenge",
    category: "Awareness",
    tag: "Community",
    icon: Users,
    color: "#25f4ee",
    bg: "from-[#25f4ee]/20 to-[#25f4ee]/5",
    desc: "Turn your campaign into a cultural moment. Invite millions to participate and create — your brand as the spark.",
    metric1: "8.5B", metric1Label: "Avg. challenge views",
    metric2: "17.5%", metric2Label: "Engagement rate",
  },
  {
    name: "Smart+ Campaigns",
    category: "Performance",
    tag: "AI-Powered",
    icon: Zap,
    color: "#7c3aed",
    bg: "from-[#7c3aed]/20 to-[#7c3aed]/5",
    desc: "AI-automated targeting, creative rotation, and bidding — optimized in real time to your conversion goals.",
    metric1: "38%", metric1Label: "Lower CPA",
    metric2: "3.8×", metric2Label: "Average ROAS",
  },
  {
    name: "In-Feed Ads",
    category: "Performance",
    tag: "Scalable",
    icon: BarChart3,
    color: "#ff6b35",
    bg: "from-[#ff6b35]/20 to-[#ff6b35]/5",
    desc: "Native video ads that flow naturally in the For You feed. Skippable, clickable, and built for conversion at scale.",
    metric1: "91%", metric1Label: "Video view-through",
    metric2: "4.2×", metric2Label: "CTR vs. industry avg.",
  },
  {
    name: "Shopping Ads",
    category: "Commerce",
    tag: "Shoppable",
    icon: ShoppingBag,
    color: "#10b981",
    bg: "from-[#10b981]/20 to-[#10b981]/5",
    desc: "Direct-to-checkout video ads with product cards. Discovery and purchase in a single scroll — zero friction.",
    metric1: "2.9×", metric1Label: "Purchase rate lift",
    metric2: "61%", metric2Label: "Shoppers act same day",
  },
  {
    name: "App Campaigns",
    category: "Performance",
    tag: "Mobile",
    icon: Smartphone,
    color: "#f59e0b",
    bg: "from-[#f59e0b]/20 to-[#f59e0b]/5",
    desc: "Drive app installs and in-app events with ML-optimized creatives across TikTok's full ad inventory.",
    metric1: "52%", metric1Label: "Lower CPI",
    metric2: "3.1×", metric2Label: "D7 ROAS",
  },
  {
    name: "Branded Effects",
    category: "Brand",
    tag: "Interactive",
    icon: Target,
    color: "#ec4899",
    bg: "from-[#ec4899]/20 to-[#ec4899]/5",
    desc: "Custom AR filters and effects that users apply in their own videos — your brand woven into organic creation.",
    metric1: "12×", metric1Label: "Organic amplification",
    metric2: "73%", metric2Label: "Brand association lift",
  },
  {
    name: "Reach & Frequency",
    category: "Awareness",
    tag: "Guaranteed",
    icon: TrendingUp,
    color: "#6366f1",
    bg: "from-[#6366f1]/20 to-[#6366f1]/5",
    desc: "Predictable delivery for brand campaigns. Reserve your audience and lock in the reach you need before launch.",
    metric1: "98%", metric1Label: "Delivery guarantee",
    metric2: "31%", metric2Label: "Awareness lift",
  },
];

export function SolutionsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = FORMATS.filter((f) =>
    activeCategory === "All" ? true : f.category === activeCategory
  );

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #fe2c55 0%, transparent 65%)", filter: "blur(100px)" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#fe2c55]/10 border border-[#fe2c55]/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Target size={12} className="text-[#fe2c55]" />
            <span className="text-xs font-semibold text-[#fe2c55] uppercase tracking-widest">Ad Solutions</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.93] tracking-tight mb-6"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            Every format.
            <br />
            <span className="text-white/25">Every objective.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl leading-relaxed"
          >
            From full-funnel brand campaigns to precision performance — TikTok One gives you
            the right format for every marketing goal.
          </motion.p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#fe2c55] text-white"
                    : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group relative bg-gradient-to-br ${f.bg} border border-white/5 hover:border-white/10 rounded-2xl p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `${f.color}22` }}
                    >
                      <Icon size={18} style={{ color: f.color }} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: f.color, borderColor: `${f.color}40` }}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: "Barlow, sans-serif" }}>{f.name}</h3>
                  <p className="text-white/45 text-sm leading-relaxed mb-6">{f.desc}</p>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-xl font-black" style={{ color: f.color, fontFamily: "Barlow, sans-serif" }}>{f.metric1}</div>
                      <div className="text-[11px] text-white/35">{f.metric1Label}</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-xl font-black" style={{ color: f.color, fontFamily: "Barlow, sans-serif" }}>{f.metric2}</div>
                      <div className="text-[11px] text-white/35">{f.metric2Label}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all" style={{ color: f.color }}>
                    Learn more <ArrowRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
