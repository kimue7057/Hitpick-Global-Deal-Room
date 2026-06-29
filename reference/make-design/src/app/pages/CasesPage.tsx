import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowRight, Star, TrendingUp, ArrowUpRight, Filter } from "lucide-react";

const INDUSTRIES = ["All", "Retail", "Beauty", "Tech", "Food & Bev", "Finance"];

const CASES = [
  {
    brand: "Nike",
    industry: "Retail",
    campaign: "Branded Hashtag Challenge",
    headline: "+312% brand recall in 7 days",
    result1: "6.2M UGC videos created",
    result2: "312% brand recall lift",
    result3: "1.4B total video views",
    desc: "Nike's #MoveWithNike challenge turned a product launch into a global movement. By putting creators at the center, the campaign generated organic content at a scale no media buy could replicate.",
    img: "photo-1542291026-7eec264c27ff",
    color: "#fe2c55",
    quote: "TikTok's community participation model gave us scale we couldn't buy through traditional media.",
    quotePerson: "Jordan Mills, VP Brand Marketing",
  },
  {
    brand: "Samsung",
    industry: "Tech",
    campaign: "TopView + Smart+",
    headline: "4.1× ROAS in a single launch week",
    result1: "28M reach in 7 days",
    result2: "4.1× return on ad spend",
    result3: "61% lower CPA vs. benchmark",
    desc: "Samsung combined TopView ownership on launch day with Smart+ campaigns for sustained performance. The full-funnel approach drove awareness and conversion simultaneously.",
    img: "photo-1610945415295-d9bbf067e59c",
    color: "#25f4ee",
    quote: "The combination of guaranteed reach and AI-optimized performance was the difference between a good launch and a record one.",
    quotePerson: "Alex Kim, Head of Digital, Samsung APAC",
  },
  {
    brand: "L'Oréal",
    industry: "Beauty",
    campaign: "Branded Effects + In-Feed",
    headline: "2.4B hashtag challenge views",
    result1: "+89% purchase intent",
    result2: "2.4B challenge views",
    result3: "38% new customer acquisition",
    desc: "L'Oréal's AR filter challenge let users virtually try on the new product line — generating 2.4B views and a measurable lift in purchase intent across all key demographics.",
    img: "photo-1596462502278-27bfdc403348",
    color: "#ec4899",
    quote: "The AR experience drove trial intent better than any in-store demo we've run.",
    quotePerson: "Isabelle Fontaine, Global Media Director",
  },
  {
    brand: "Chipotle",
    industry: "Food & Bev",
    campaign: "In-Feed + TikTok Shop",
    headline: "#GuacDance: 800M views, record sales day",
    result1: "800M+ video views",
    result2: "Largest digital sales day in history",
    result3: "99% positive sentiment",
    desc: "The #GuacDance challenge launched on National Avocado Day and generated 800M views — turning a fun social moment into Chipotle's highest online sales day on record.",
    img: "photo-1565299585323-38d6b0865b47",
    color: "#10b981",
    quote: "We didn't expect 800 million views. TikTok showed us what organic momentum really looks like.",
    quotePerson: "Tressie Lieberman, VP Digital & Off-Premise",
  },
  {
    brand: "Fenty Beauty",
    industry: "Beauty",
    campaign: "Creator Partnerships + In-Feed",
    headline: "Sold out in 72 hours via TikTok Shop",
    result1: "Product sold out in 72hrs",
    result2: "$4M+ in direct revenue",
    result3: "220% new brand awareness lift",
    desc: "Fenty's creator-led drop strategy, with 50 TikTok creators given early access, drove a complete sellout through TikTok Shop within 72 hours of launch.",
    img: "photo-1596462502278-27bfdc403348",
    color: "#f59e0b",
    quote: "TikTok Shop turned our creators into a distribution channel. The speed and scale were unlike anything before.",
    quotePerson: "Maya Adesanya, VP eCommerce",
  },
  {
    brand: "Revolut",
    industry: "Finance",
    campaign: "Smart+ App Campaigns",
    headline: "52% reduction in cost per install",
    result1: "52% lower CPI",
    result2: "3.2× D30 ROAS",
    result3: "1.8M new app installs",
    desc: "Revolut used Smart+ App Campaigns to reach high-intent fintech users, combining automated creative and bid optimization to hit aggressive CPI targets across 12 markets.",
    img: "photo-1563986768609-322da13575f3",
    color: "#6366f1",
    quote: "Smart+ found users we couldn't have targeted manually. The optimization speed was remarkable.",
    quotePerson: "Dmitri Volkov, Head of Growth Marketing",
  },
];

export function CasesPage() {
  const [activeIndustry, setActiveIndustry] = useState("All");
  const [activeCase, setActiveCase] = useState(CASES[0]);

  const filtered = CASES.filter((c) => activeIndustry === "All" || c.industry === activeIndustry);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-10"
          style={{ background: "radial-gradient(ellipse, #ff6b35 0%, transparent 65%)", filter: "blur(80px)" }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#ff6b35]/10 border border-[#ff6b35]/20 rounded-full px-4 py-1.5 mb-6"
          >
            <Star size={12} className="text-[#ff6b35]" />
            <span className="text-xs font-semibold text-[#ff6b35] uppercase tracking-widest">Case Studies</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-white leading-[0.93] mb-6"
            style={{ fontFamily: "Barlow, sans-serif" }}
          >
            Results that speak
            <br />
            <span className="text-white/25">for themselves.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-white/45 text-lg max-w-xl"
          >
            Real campaigns. Real brands. Real ROI — across every industry and objective.
          </motion.p>
        </div>
      </section>

      {/* Featured case */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCase.brand}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4"
            >
              {/* Image */}
              <div className="lg:col-span-3 relative rounded-2xl overflow-hidden min-h-72">
                <img
                  src={`https://images.unsplash.com/${activeCase.img}?w=900&h=500&fit=crop&auto=format`}
                  alt={activeCase.brand}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div
                  className="absolute inset-0 opacity-20"
                  style={{ background: `radial-gradient(ellipse at 20% 80%, ${activeCase.color} 0%, transparent 50%)` }}
                />
                <div className="absolute bottom-6 left-6">
                  <div className="text-xs text-white/50 uppercase tracking-widest mb-1">{activeCase.industry} · {activeCase.campaign}</div>
                  <div className="text-4xl font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>{activeCase.brand}</div>
                </div>
              </div>

              {/* Detail */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-[#13131a] border border-white/5 rounded-2xl p-7 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} style={{ color: activeCase.color }} />
                    <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Key Results</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    {[activeCase.result1, activeCase.result2, activeCase.result3].map((r) => (
                      <div key={r} className="flex items-center gap-2 text-sm text-white/80">
                        <Star size={11} fill={activeCase.color} style={{ color: activeCase.color }} className="shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                  <p className="text-white/45 text-sm leading-relaxed mb-4">{activeCase.desc}</p>
                  <blockquote className="border-l-2 pl-4 mb-4" style={{ borderColor: activeCase.color }}>
                    <p className="text-white/60 text-sm italic mb-1">"{activeCase.quote}"</p>
                    <cite className="text-white/30 text-xs not-italic">{activeCase.quotePerson}</cite>
                  </blockquote>
                  <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all" style={{ color: activeCase.color }}>
                    Read full case study <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Filter size={13} className="text-white/30" />
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setActiveIndustry(ind)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeIndustry === ind ? "bg-[#fe2c55] text-white" : "bg-white/5 text-white/45 hover:text-white hover:bg-white/10"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((c, i) => (
              <motion.button
                key={c.brand}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveCase(c)}
                className={`text-left group relative bg-[#13131a] border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                  activeCase.brand === c.brand ? "border-white/20" : "border-white/5 hover:border-white/10"
                }`}
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${c.img}?w=600&h=300&fit=crop&auto=format`}
                    alt={c.brand}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] to-transparent" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-white/35">{c.industry}</div>
                      <div className="text-lg font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>{c.brand}</div>
                    </div>
                    <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors mt-1" />
                  </div>
                  <div className="text-sm font-semibold" style={{ color: c.color }}>{c.headline}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
