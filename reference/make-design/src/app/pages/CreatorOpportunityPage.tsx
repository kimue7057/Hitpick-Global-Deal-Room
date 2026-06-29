import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, Pen, Shield, CheckCircle2, ChevronRight,
  X, RefreshCw, Award, Mail, ExternalLink, BookOpen, Users,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
type CreatorCategory = "Beauty" | "Lifestyle" | "Food" | "Travel" | "Fashion" | "Tech" | "Gaming" | "Music" | "K-Culture" | "Entertainment" | "Fitness" | "Education" | "Other";
type CollabGoal = "Work with Brands" | "Korean Creator Collab" | "Expose My Content" | "Create Content Together" | "Product Review" | "Offline Event" | "Global Campaign" | "Long-term Partnership";
type Region = "Korea" | "Europe" | "Middle East" | "Southeast Asia" | "Japan" | "United States" | "Global";
type Channel = "Instagram" | "TikTok" | "YouTube" | "Naver Blog" | "X" | "Facebook" | "Offline / Event" | "Other";
type ModalStep = "closed" | "form" | "mou" | "token";

interface CreatorForm {
  creatorName: string; email: string; country: string;
  mainChannel: string; snsLink: string; shortBio: string;
}
interface TokenData extends CreatorForm {
  category: CreatorCategory; goal: CollabGoal; region: Region; channel: Channel;
  route: string[]; tokenId: string; hash: string; issuedAt: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function generateRoute(cat: CreatorCategory, goal: CollabGoal, region: Region, channel: Channel): string[] {
  const ch = channel === "Other" ? "Social Media" : channel;
  switch (goal) {
    case "Work with Brands":       return [`Your ${cat} Content`, "Creator Passport", `${region} Brand Exposure`, `${ch} Brand Campaign`, "Collaboration Proposal", "Creator MOU", "Creator Token"];
    case "Korean Creator Collab":  return [`Your ${cat} Content`, "Korean Influencer Matching", "Joint Content Planning", `${ch} Co-creation`, "Brand Partnership Opportunity", "Creator MOU", "Creator Token"];
    case "Expose My Content":      return [`Your ${cat} Content`, "Creator Portfolio", "Brand Discovery Pool", "Company Review", "Campaign Opportunity", "Creator MOU", "Creator Token"];
    case "Create Content Together":return [`Your ${cat} Content`, "Creator Matching", `${region} Co-creation`, `${ch} Campaign`, "Brand Exposure", "Creator MOU", "Creator Token"];
    case "Product Review":         return [`Your ${cat} Content`, "Brand Product Matching", "Sample Delivery", `${ch} Review Content`, "Campaign Report", "Creator MOU", "Creator Token"];
    case "Offline Event":          return [`Your ${cat} Content`, "Event Matching", `${region} Offline Event`, "On-site Content", "Brand Networking", "Creator MOU", "Creator Token"];
    case "Global Campaign":        return [`Your ${cat} Content`, "Creator Passport", `${region} Campaign`, `${ch} Campaign Brief`, "Campaign Activation", "Creator MOU", "Creator Token"];
    case "Long-term Partnership":  return [`Your ${cat} Content`, "Creator Passport", "Brand Relationship", "Ambassador Discussion", `${ch} Long-term Plan`, "Long-term MOU", "Creator Token"];
    default:                       return ["Your Content", "Creator Passport", "Brand Exposure", "Collaboration Matching", "Campaign / Co-creation", "Creator MOU", "Creator Token"];
  }
}

async function sha256(msg: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
const genTokenId = () => `HP-CREATOR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`;

// ─── Data ───────────────────────────────────────────────────────────────────
const CARDS = [
  { img: "photo-1779398261284-95f329a7ce96", tag1: "Beauty Review",          tag2: "Instagram · TikTok",    color: "#ec4899", h: 340 },
  { img: "photo-1628453099013-8c016c682af6", tag1: "Brand Campaign",          tag2: "Global Opportunity",    color: "#3b82f6", h: 300 },
  { img: "photo-1695753640148-0c7b3bcd3b2b", tag1: "Korean Creator Collab",   tag2: "Co-creation Ready",     color: "#8b5cf6", h: 360 },
  { img: "photo-1694813646506-135688fc24e4", tag1: "Food Content",             tag2: "Short-form Review",     color: "#f59e0b", h: 310 },
  { img: "photo-1708384761254-32964bd16c49", tag1: "Travel Vlog",              tag2: "Global Audience",       color: "#10b981", h: 340 },
  { img: "photo-1542062700-9b61ccbc1696",   tag1: "Fashion Creator",           tag2: "Brand Collaboration",   color: "#06b6d4", h: 300 },
  { img: "photo-1617221081121-931fde66048c", tag1: "Product Review",           tag2: "UGC Content",           color: "#a855f7", h: 350 },
  { img: "photo-1651659802541-774e231b05ed", tag1: "Offline Event",            tag2: "Creator Network",       color: "#f97316", h: 320 },
];

const CHIPS = ["Brand Deals", "Product Reviews", "Korean Creator Collab", "Co-Creation", "TikTok Videos", "Instagram Reels", "YouTube Shorts", "UGC Content", "Offline Events", "Creator Passport", "Global Campaigns", "Fashion", "Beauty", "Food", "Travel", "Lifestyle"];

const PROOF = [
  { val: "100+", label: "Creator Pool" },
  { val: "30+",  label: "Global Partners" },
  { val: "8+",   label: "Collab Types" },
  { val: "MOU",  label: "in Minutes" },
];

const CATEGORIES: CreatorCategory[] = ["Beauty", "Lifestyle", "Food", "Travel", "Fashion", "Tech", "Gaming", "Music", "K-Culture", "Entertainment", "Fitness", "Education", "Other"];
const GOALS: CollabGoal[] = ["Work with Brands", "Korean Creator Collab", "Expose My Content", "Create Content Together", "Product Review", "Offline Event", "Global Campaign", "Long-term Partnership"];
const REGIONS: Region[] = ["Korea", "Europe", "Middle East", "Southeast Asia", "Japan", "United States", "Global"];
const CHANNELS: Channel[] = ["Instagram", "TikTok", "YouTube", "Naver Blog", "X", "Facebook", "Offline / Event", "Other"];

const FLOW_STEPS = [
  { n: "01", title: "Create Creator Passport", sub: "Fill in your creator profile in minutes" },
  { n: "02", title: "Sign Creator Network MOU", sub: "Simple digital signature on any device" },
  { n: "03", title: "Receive Creator Passport Token", sub: "Email confirmation + certificate issued" },
];

// ─── Shared ─────────────────────────────────────────────────────────────────
const card = "bg-[#0d1424] border border-white/[0.07] rounded-2xl";
const inp  = "w-full bg-[#0a101e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-purple-500/60 transition-colors";
const sel  = "bg-[#0d1424] border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-purple-500/50 appearance-none cursor-pointer";

// ─── Page ────────────────────────────────────────────────────────────────────
export function CreatorOpportunityPage() {
  const [category, setCategory] = useState<CreatorCategory | "">("");
  const [goal,     setGoal]     = useState<CollabGoal | "">("");
  const [region,   setRegion]   = useState<Region | "">("");
  const [channel,  setChannel]  = useState<Channel | "">("");
  const [showRoute, setShowRoute] = useState(false);
  const [modal, setModal] = useState<ModalStep>("closed");

  const openPassport = () => setModal("form");
  const openMOU      = () => setModal("mou");

  return (
    <div className="bg-[#030812] text-white min-h-screen" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── 1. Centre Hero ── */}
      <section className="relative pt-28 pb-10 px-6 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(139,92,246,0.11) 0%, transparent 65%)" }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Hitpick Creator Network</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-5 relative z-10"
          style={{ fontFamily: "Barlow, sans-serif" }}>
          Create Content.
          <br />
          <span className="text-purple-400">Meet Global Brands.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
          className="text-white/50 text-lg mb-8 relative z-10 max-w-xl mx-auto">
          Join brand campaigns, Korean creator collabs, product reviews, and global content projects.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.26 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-4 relative z-10">
          <button onClick={openPassport}
            className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-4 rounded-full text-base transition-all hover:scale-105 hover:shadow-[0_0_32px_rgba(139,92,246,0.5)]">
            Create Creator Passport <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={openPassport}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold px-7 py-4 rounded-full text-base transition-all">
            <Users size={15} /> Join Creator Network
          </button>
        </motion.div>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}
          onClick={openMOU}
          className="text-xs text-white/30 hover:text-white/55 transition-colors flex items-center gap-1.5 mx-auto relative z-10">
          <Pen size={11} /> Sign Creator MOU
        </motion.button>
      </section>

      {/* ── 2. Content card rail ── */}
      <section className="pb-10 overflow-hidden">
        <div className="relative">
          <div
            className="flex gap-4 overflow-x-auto px-6"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {CARDS.map((c, i) => (
              <motion.div
                key={c.img}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.07, duration: 0.45 }}
                className="relative shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ width: "180px", height: `${c.h}px` }}
              >
                <img
                  src={`https://images.unsplash.com/${c.img}?w=360&h=540&fit=crop&auto=format`}
                  alt={c.tag1}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset" style={{ boxShadow: `inset 0 0 0 1px ${c.color}35` }} />

                <div className="absolute top-2.5 right-2.5">
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                    <Shield size={8} className="text-green-400" />
                    <span className="text-[8px] font-bold text-green-400">Verified</span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wide mb-0.5" style={{ color: c.color }}>{c.tag1}</div>
                  <div className="text-[9px] text-white/50 font-medium">{c.tag2}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030812] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── 3. Category chips ── */}
      <section className="py-8 px-6 border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2">
          {CHIPS.map(chip => (
            <button key={chip}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.05] border border-white/[0.08] text-white/55 hover:text-white hover:border-purple-500/40 hover:bg-purple-500/10 transition-all">
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. Proof row ── */}
      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {PROOF.map(p => (
            <motion.div key={p.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="text-4xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>{p.val}</div>
              <div className="text-xs text-white/35 uppercase tracking-widest">{p.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. Creator Passport CTA ── */}
      <section className="py-20 px-6 bg-[#020710]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Creator Identity</p>
            <h2 className="text-4xl font-black text-white mb-3" style={{ fontFamily: "Barlow, sans-serif" }}>
              Create Your<br />Creator Passport
            </h2>
            <p className="text-white/45 text-base mb-6 max-w-sm">
              Build your verified creator profile and unlock brand collaboration opportunities.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["Brand Collaboration Ready", "Korean Creator Network", "Global Campaign Ready"].map(b => (
                <span key={b} className="text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full">{b}</span>
              ))}
            </div>
            <button onClick={openPassport}
              className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:scale-105">
              Create Creator Passport <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Passport preview card */}
          <div className="relative rounded-2xl overflow-hidden border p-6" style={{ background: "linear-gradient(135deg, #0a0820 0%, #0d1030 100%)", borderColor: "rgba(139,92,246,0.25)" }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl" style={{ background: "#8b5cf6" }} />
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-purple-400" />
                <span className="text-sm font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>Hitpick Creator Passport</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-400/15 text-amber-400 border border-amber-400/25 px-2 py-0.5 rounded-full">PENDING</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 relative z-10">
              {[
                { label: "Creator ID",   value: `HP-CREATOR-${new Date().getFullYear()}-000001` },
                { label: "Category",     value: category || "Not selected" },
                { label: "Main Channel", value: channel  || "Not selected" },
                { label: "Region",       value: region   || "Not selected" },
                { label: "Goal",         value: goal ? goal.slice(0, 22) + (goal.length > 22 ? "…" : "") : "Not selected" },
                { label: "Status",       value: "Pending Verification" },
              ].map(f => (
                <div key={f.label} className="bg-white/[0.04] rounded-xl p-2.5">
                  <p className="text-[9px] text-white/30 mb-0.5 uppercase tracking-wide">{f.label}</p>
                  <p className="text-xs font-semibold text-white/80 truncate">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Compact builder ── */}
      <section className="py-16 px-6 bg-[#030812]">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2">Quick Setup</p>
          <h2 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>Build Your Creator Opportunity</h2>
          <p className="text-white/35 text-sm mb-6">Select your category, goal, region, and channel.</p>

          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { label: "Category", value: category, opts: CATEGORIES, set: setCategory as any },
              { label: "Goal",     value: goal,     opts: GOALS,      set: setGoal as any },
              { label: "Region",   value: region,   opts: REGIONS,    set: setRegion as any },
              { label: "Channel",  value: channel,  opts: CHANNELS,   set: setChannel as any },
            ].map(f => (
              <select key={f.label} value={f.value} onChange={e => f.set(e.target.value)}
                className={sel + " min-w-[140px]"}>
                <option value="">{f.label}</option>
                {f.opts.map((o: string) => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}
            <button onClick={() => { if (category && goal && region && channel) setShowRoute(true); openPassport(); }}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all">
              Continue to Creator Passport <ArrowRight size={13} />
            </button>
          </div>

          {/* Route preview */}
          <AnimatePresence>
            {showRoute && category && goal && region && channel && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className={`${card} p-5 overflow-hidden`}>
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-3">Your Collaboration Route</p>
                <div className="flex flex-wrap items-center gap-2">
                  {generateRoute(category as CreatorCategory, goal as CollabGoal, region as Region, channel as Channel).map((step, i, arr) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/70 bg-white/[0.05] px-2.5 py-1 rounded-lg">{step}</span>
                      {i < arr.length - 1 && <ChevronRight size={11} className="text-white/20 shrink-0" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── 7. MOU flow preview ── */}
      <section className="py-20 px-6 bg-[#020710]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl font-black text-white mb-3" style={{ fontFamily: "Barlow, sans-serif" }}>
            From Profile to Verified Creator Deal
          </h2>
          <p className="text-white/40 text-sm mb-12 max-w-md mx-auto">
            Register your profile, sign a simple creator MOU, and receive your Creator Passport confirmation by email.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {FLOW_STEPS.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`${card} p-6 relative`}>
                {i < 2 && <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"><ChevronRight size={14} className="text-white/15" /></div>}
                <div className="text-3xl font-black text-purple-500/20 mb-3" style={{ fontFamily: "Barlow, sans-serif" }}>{s.n}</div>
                <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
                <p className="text-white/35 text-xs">{s.sub}</p>
              </motion.div>
            ))}
          </div>
          <button onClick={openPassport}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-4 rounded-full text-sm transition-all hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:scale-105">
            Get Started — Create Passport <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* ── Modal ── */}
      <CreatorModal step={modal} onClose={() => setModal("closed")} category={category} goal={goal} region={region} channel={channel} />
    </div>
  );
}

// ─── 3-step Modal ──────────────────────────────────────────────────────────
function CreatorModal({ step, onClose, category, goal, region, channel }: {
  step: ModalStep; onClose: () => void;
  category: CreatorCategory | ""; goal: CollabGoal | ""; region: Region | ""; channel: Channel | "";
}) {
  const [form, setForm]           = useState<CreatorForm>({ creatorName: "", email: "", country: "", mainChannel: channel || "", snsLink: "", shortBio: "" });
  const [cur, setCur]             = useState<"form" | "mou" | "token">("form");
  const [token, setToken]         = useState<TokenData | null>(null);
  const [hasSig, setHasSig]       = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const sigRef  = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last    = useRef({ x: 0, y: 0 });

  useEffect(() => { if (step !== "closed") { setCur(step === "mou" ? "mou" : "form"); setHasSig(false); setEmailSent(false); setToken(null); } }, [step]);

  const pos = (e: React.MouseEvent | React.TouchEvent, c: HTMLCanvasElement) => {
    const r = c.getBoundingClientRect();
    return "touches" in e ? { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top } : { x: (e as React.MouseEvent).clientX - r.left, y: (e as React.MouseEvent).clientY - r.top };
  };
  const startD = (e: React.MouseEvent | React.TouchEvent) => { const c = sigRef.current; if (!c) return; drawing.current = true; last.current = pos(e, c); };
  const drawD  = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const c = sigRef.current; if (!c) return;
    const ctx = c.getContext("2d")!; const p = pos(e, c);
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.stroke();
    last.current = p; setHasSig(true);
  };
  const stopD  = () => { drawing.current = false; };
  const clearD = () => { sigRef.current?.getContext("2d")!.clearRect(0, 0, 9999, 9999); setHasSig(false); };

  const issue = async () => {
    const id = genTokenId(); const now = new Date().toISOString();
    const hash = await sha256(`${form.creatorName}${form.email}${id}${now}`);
    const route = category && goal && region && channel ? generateRoute(category as CreatorCategory, goal as CollabGoal, region as Region, channel as Channel) : [];
    setToken({ ...form, category: category as CreatorCategory, goal: goal as CollabGoal, region: region as Region, channel: channel as Channel, route, tokenId: id, hash, issuedAt: now });
    setCur("token");
  };

  if (step === "closed") return null;
  const steps = ["form", "mou", "token"] as const;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(2,7,16,0.92)", backdropFilter: "blur(12px)" }}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
          className="bg-[#0d1424] border border-purple-500/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-5 right-5 text-white/30 hover:text-white/70 z-10"><X size={18} /></button>

          {/* Step bar */}
          <div className="flex items-center gap-3 px-7 pt-7 pb-5 border-b border-white/5">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${cur === s ? "bg-purple-600 text-white" : steps.indexOf(cur) > i ? "bg-green-500 text-white" : "bg-white/10 text-white/30"}`}>
                  {steps.indexOf(cur) > i ? <CheckCircle2 size={12} /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${cur === s ? "text-white" : "text-white/30"}`}>
                  {s === "form" ? "Creator Info" : s === "mou" ? "MOU Signature" : "Passport Token"}
                </span>
                {i < 2 && <ChevronRight size={12} className="text-white/15" />}
              </div>
            ))}
          </div>

          {/* Form */}
          {cur === "form" && (
            <div className="p-7">
              <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>Create Your Creator Passport</h3>
              <p className="text-white/40 text-sm mb-6">Enter your information to build your verified creator profile.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {[{ k: "creatorName", ph: "Creator Name", full: true }, { k: "email", ph: "Email Address" }, { k: "country", ph: "Country" }, { k: "mainChannel", ph: "Main Channel" }, { k: "snsLink", ph: "SNS Link / Profile URL" }, { k: "shortBio", ph: "Short Bio (optional)", full: true }].map(f => (
                  <input key={f.k} className={`${inp} ${f.full ? "sm:col-span-2" : ""}`} placeholder={f.ph}
                    value={form[f.k as keyof CreatorForm]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} />
                ))}
              </div>
              {(category || goal || region) && (
                <div className="bg-purple-500/8 border border-purple-500/15 rounded-xl p-4 mb-5">
                  <p className="text-xs font-bold text-purple-400 mb-2">Auto-filled from your selections</p>
                  <div className="flex flex-wrap gap-2">
                    {category && <span className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-full">Category: {category}</span>}
                    {goal     && <span className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-full">Goal: {goal}</span>}
                    {region   && <span className="text-xs bg-white/5 text-white/50 px-2.5 py-1 rounded-full">Region: {region}</span>}
                  </div>
                </div>
              )}
              <button disabled={!form.creatorName || !form.email} onClick={() => setCur("mou")}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all">
                Continue to Creator MOU <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* MOU */}
          {cur === "mou" && (
            <div className="p-7">
              <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "Barlow, sans-serif" }}>Sign Creator Network MOU</h3>
              <p className="text-white/40 text-sm mb-5">Creator Network Participation MOU</p>
              <div className="bg-white/[0.03] rounded-2xl p-5 mb-5 space-y-3 text-sm">
                {[
                  { l: "Agreement Type", v: "Creator Network Participation MOU" },
                  { l: "Creator Name",   v: form.creatorName || "—" },
                  { l: "Email",          v: form.email || "—" },
                  { l: "Category",       v: category || "—" },
                  { l: "Goal",           v: goal || "—" },
                  { l: "Region",         v: region || "—" },
                ].map((f, i, arr) => (
                  <div key={f.l} className={`flex justify-between ${i < arr.length - 1 ? "border-b border-white/5 pb-3" : ""}`}>
                    <span className="text-white/40 shrink-0">{f.l}</span>
                    <span className="text-white/80 font-semibold text-right ml-4 text-xs">{f.v}</span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-3">
                  <p className="text-white/35 text-xs leading-relaxed">
                    This MOU confirms the creator's interest in joining the Hitpick Creator Network and exploring brand collaborations, creator co-creation projects, campaign opportunities, and global exposure through Hitpick.
                  </p>
                </div>
              </div>
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Signature Pad</p>
                  <button onClick={clearD} className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60"><RefreshCw size={11} /> Clear</button>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-purple-500/20 bg-[#060f20]" style={{ touchAction: "none" }}>
                  <canvas ref={sigRef} width={560} height={160} className="w-full" style={{ cursor: "crosshair", display: "block" }}
                    onMouseDown={startD} onMouseMove={drawD} onMouseUp={stopD} onMouseLeave={stopD}
                    onTouchStart={startD} onTouchMove={drawD} onTouchEnd={stopD} />
                  {!hasSig && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="flex items-center gap-2 text-white/15"><Pen size={16} /><span className="text-sm">Please sign here</span></div>
                    </div>
                  )}
                </div>
              </div>
              <button disabled={!hasSig} onClick={issue}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition-all">
                <Award size={15} /> Issue Creator Passport Token
              </button>
            </div>
          )}

          {/* Token */}
          {cur === "token" && token && (
            <div className="p-7">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><CheckCircle2 size={16} className="text-green-400" /></div>
                <div>
                  <h3 className="text-xl font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>Creator Passport Token Issued</h3>
                  <p className="text-white/40 text-xs">Your Creator Network MOU has been signed.</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border p-6 mb-5" style={{ background: "linear-gradient(135deg,#0a0820,#0d0f28)", borderColor: "rgba(139,92,246,0.3)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: "#8b5cf6" }} />
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2"><BookOpen size={15} className="text-purple-400" /><span className="text-sm font-black text-white" style={{ fontFamily: "Barlow, sans-serif" }}>Hitpick Creator Passport Token</span></div>
                  <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/25 px-2.5 py-0.5 rounded-full"><Shield size={10} className="text-green-400" /><span className="text-[10px] font-bold text-green-400">VERIFIED</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  {[
                    { l: "Token ID",   v: token.tokenId,     hl: true },
                    { l: "Type",       v: "Creator Network Participation MOU" },
                    { l: "Creator",    v: token.creatorName },
                    { l: "Email",      v: token.email },
                    { l: "Country",    v: token.country || "—" },
                    { l: "Category",   v: token.category || "—" },
                    { l: "Channel",    v: token.mainChannel || "—" },
                    { l: "Goal",       v: token.goal || "—" },
                    { l: "Region",     v: token.region || "—" },
                    { l: "Status",     v: "Pending Verification", cy: true },
                  ].map(f => (
                    <div key={f.l}>
                      <p className="text-white/30 mb-0.5">{f.l}</p>
                      <p className={`font-semibold text-xs ${(f as any).hl ? "text-amber-300" : (f as any).cy ? "text-cyan-400" : "text-white/80"}`}>{f.v}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-3 mb-2">
                  <p className="text-white/30 text-[10px] mb-0.5">Document Hash (SHA-256)</p>
                  <p className="text-[10px] font-mono text-cyan-400/70 break-all">{token.hash}</p>
                </div>
                <div><p className="text-white/30 text-[10px] mb-0.5">Issued At</p><p className="text-white/60 text-xs">{new Date(token.issuedAt).toLocaleString()}</p></div>
                <div className="mt-4 pt-3 border-t border-white/5">
                  <p className="text-white/25 text-[10px]">This certificate verifies that the creator has signed a Creator Network Participation MOU and registered a Creator Passport in the Hitpick Creator Network.</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => setEmailSent(true)} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all border ${emailSent ? "bg-green-500/15 border-green-500/25 text-green-400" : "bg-purple-600/80 hover:bg-purple-600 border-purple-500/30 text-white"}`}>
                  {emailSent ? <CheckCircle2 size={16} /> : <Mail size={16} />}{emailSent ? "Sent!" : "Send to Email"}
                </button>
                <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white/70"><BookOpen size={16} />View Passport</button>
                <button className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-white/70"><ExternalLink size={16} />Browse Opps</button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
