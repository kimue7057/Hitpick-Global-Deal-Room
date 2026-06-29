import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, Layers, Cpu, BarChart2, Shield, ShoppingCart, Globe2, CheckCircle2, ChevronRight } from "lucide-react";

const PRODUCTS = [
  {
    id: "ads-manager",
    icon: Layers,
    color: "#fe2c55",
    name: "TikTok Ads Manager",
    tagline: "Your campaign command center.",
    desc: "Build, launch, and optimize campaigns across every TikTok ad format — all from one unified dashboard. Real-time reporting, audience builder, budget controls, and creative preview in a single workspace.",
    features: ["Unified campaign creation", "Real-time performance dashboard", "Cross-format audience builder", "Automated budget pacing", "A/B testing suite"],
    img: "photo-1551288049-bebda4e38f71",
  },
  {
    id: "smart-plus",
    icon: Cpu,
    color: "#7c3aed",
    name: "Smart+ Campaigns",
    tagline: "AI that works while you sleep.",
    desc: "Machine-learning campaigns that automatically optimize creative rotation, audience expansion, and bid strategies to your conversion objectives — without manual input.",
    features: ["Automated creative testing", "Dynamic audience optimization", "Smart bid strategies", "Conversion-goal alignment", "Real-time CPA management"],
    img: "photo-1620712943543-bcc4688e7485",
  },
  {
    id: "creative-studio",
    icon: BarChart2,
    color: "#25f4ee",
    name: "Creative Studio",
    tagline: "Content built for performance.",
    desc: "AI-assisted video editing tools built inside TikTok — script generation, auto-captions, trend templates, and creative scoring so your ads look native and perform like organic content.",
    features: ["AI script generator", "Trend-based templates", "Auto-caption engine", "Creative health score", "Sound-match recommendations"],
    img: "photo-1611162617474-5b21e879e113",
  },
  {
    id: "pixel",
    icon: Shield,
    color: "#10b981",
    name: "TikTok Pixel & Events API",
    tagline: "Precision measurement, full funnel.",
    desc: "Server-side and client-side event tracking that survives cookie deprecation. Capture every conversion signal across your website, app, and CRM — and feed it back into campaign optimization.",
    features: ["Server-to-server Events API", "Cross-device attribution", "View-through & click attribution", "Offline conversion import", "Custom conversion windows"],
    img: "photo-1551288049-bebda4e38f71",
  },
  {
    id: "commerce",
    icon: ShoppingCart,
    color: "#ff6b35",
    name: "TikTok Shop for Business",
    tagline: "Discovery-to-checkout in one tap.",
    desc: "Shoppable video, LIVE commerce, and product collections woven directly into TikTok content — so your customer never needs to leave the app to complete a purchase.",
    features: ["In-video product tags", "LIVE shopping events", "Affiliate creator marketplace", "Inventory & order management", "Shop Ads integration"],
    img: "photo-1607082348824-0a96f2a4b9da",
  },
  {
    id: "audiences",
    icon: Globe2,
    color: "#6366f1",
    name: "Audience Insights",
    tagline: "Know your customer like TikTok does.",
    desc: "Behavioral, demographic, and interest-level audience data drawn from 1B+ users — surfaced as actionable segments for planning, targeting, and post-campaign analysis.",
    features: ["Interest & behavior segments", "Lookalike audience builder", "Competitor audience overlap", "Demographic heat maps", "Content affinity analysis"],
    img: "photo-1460925895917-afdab827c52f",
  },
];

export function ProductsPage() {
  const [active, setActive] = useState(PRODUCTS[0].id);
  const product = PRODUCTS.find((p) => p.id === active)!;
  const Icon = product.icon;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-15"
          style={{ background: "radial-gradient(ellipse, #7c3aed 0%, transparent 65%)", filter: "blur(80px)" }}
        />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Cpu size={12} className="text-[#7c3aed]" />
            <span className="text-xs font-semibold text-[#7c3aed] uppercase tracking-widest">Platform Products</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.93] tracking-tight mb-6"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            Built for modern
            <br />
            <span className="text-white/25">performance.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-white/45 text-lg max-w-xl mx-auto"
          >
            Six integrated products covering creation, distribution, measurement, and commerce
            — engineered around TikTok's unique platform advantages.
          </motion.p>
        </div>
      </section>

      {/* Product explorer */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-2">
            {PRODUCTS.map((p) => {
              const PIcon = p.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p.id)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    active === p.id
                      ? "bg-[#13131a] border border-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                    style={{ background: active === p.id ? `${p.color}25` : "rgba(255,255,255,0.05)" }}
                  >
                    <PIcon size={15} style={{ color: active === p.id ? p.color : "currentColor" }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    {active === p.id && <div className="text-xs mt-0.5" style={{ color: p.color }}>{p.tagline}</div>}
                  </div>
                  {active === p.id && <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: p.color }} />}
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2 bg-[#13131a] border border-white/5 rounded-2xl overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
              <img
                src={`https://images.unsplash.com/${product.img}?w=900&h=400&fit=crop&auto=format`}
                alt={product.name}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#13131a]" />
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: `radial-gradient(ellipse at 30% 50%, ${product.color} 0%, transparent 60%)` }}
              />
            </div>

            <div className="p-8 -mt-6 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${product.color}20` }}
                >
                  <Icon size={22} style={{ color: product.color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>
                    {product.name}
                  </h2>
                  <div className="text-sm font-medium" style={{ color: product.color }}>{product.tagline}</div>
                </div>
              </div>

              <p className="text-white/55 text-base leading-relaxed mb-8">{product.desc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                {product.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle2 size={14} style={{ color: product.color }} className="shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <a
                href="#"
                className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-full transition-all hover:opacity-90"
                style={{ background: product.color, color: "#fff" }}
              >
                Explore {product.name} <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
