"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Mail,
  Pen,
  RefreshCw,
  Shield,
  Users,
  X,
} from "lucide-react";

import { MakeAssetImage } from "@/components/make-asset-image";
import {
  creatorChips,
  creatorFlowSteps,
  creatorProofStats,
  creatorRailCards,
  makeImageAssets,
} from "@/lib/make-site-data";
import {
  CERTIFICATE_NOTICE,
  type CreatorFormData,
  type CreatorIssuePayload,
  type CreatorIssuedToken,
  type MouIssueResponse,
  type MouResendResponse,
} from "@/lib/mou/types";

type CreatorCategory =
  | "Beauty"
  | "Lifestyle"
  | "Food"
  | "Travel"
  | "Fashion"
  | "Tech"
  | "Gaming"
  | "Music"
  | "K-Culture"
  | "Entertainment"
  | "Fitness"
  | "Education"
  | "Other";

type CollabGoal =
  | "Work with Brands"
  | "Korean Creator Collab"
  | "Expose My Content"
  | "Create Content Together"
  | "Product Review"
  | "Offline Event"
  | "Global Campaign"
  | "Long-term Partnership";

type Region =
  | "Korea"
  | "Europe"
  | "Middle East"
  | "Southeast Asia"
  | "Japan"
  | "United States"
  | "Global";

type Channel =
  | "Instagram"
  | "TikTok"
  | "YouTube"
  | "Naver Blog"
  | "X"
  | "Facebook"
  | "Offline / Event"
  | "Other";

type ModalStep = "closed" | "form" | "mou" | "token";

const cardBase = "rounded-2xl border border-white/[0.07] bg-[#0d1424]";
const inputCls =
  "w-full rounded-xl border border-white/10 bg-[#0a101e] px-4 py-3 text-sm text-white placeholder-white/25 transition-colors focus:border-purple-500/60 focus:outline-none";
const selectCls =
  "min-w-[140px] cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#0d1424] px-4 py-2.5 text-sm text-white focus:border-purple-500/50 focus:outline-none";

const CATEGORIES: CreatorCategory[] = [
  "Beauty",
  "Lifestyle",
  "Food",
  "Travel",
  "Fashion",
  "Tech",
  "Gaming",
  "Music",
  "K-Culture",
  "Entertainment",
  "Fitness",
  "Education",
  "Other",
];

const GOALS: CollabGoal[] = [
  "Work with Brands",
  "Korean Creator Collab",
  "Expose My Content",
  "Create Content Together",
  "Product Review",
  "Offline Event",
  "Global Campaign",
  "Long-term Partnership",
];

const REGIONS: Region[] = [
  "Korea",
  "Europe",
  "Middle East",
  "Southeast Asia",
  "Japan",
  "United States",
  "Global",
];

const CHANNELS: Channel[] = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Naver Blog",
  "X",
  "Facebook",
  "Offline / Event",
  "Other",
];

function generateRoute(
  category: CreatorCategory,
  goal: CollabGoal,
  region: Region,
  channel: Channel,
): string[] {
  const primaryChannel = channel === "Other" ? "Social Media" : channel;

  switch (goal) {
    case "Work with Brands":
      return [
        `Your ${category} Content`,
        "Creator Passport",
        `${region} Brand Exposure`,
        `${primaryChannel} Brand Campaign`,
        "Collaboration Proposal",
        "Creator MOU",
        "Creator Token",
      ];
    case "Korean Creator Collab":
      return [
        `Your ${category} Content`,
        "Korean Influencer Matching",
        "Joint Content Planning",
        `${primaryChannel} Co-creation`,
        "Brand Partnership Opportunity",
        "Creator MOU",
        "Creator Token",
      ];
    case "Expose My Content":
      return [
        `Your ${category} Content`,
        "Creator Portfolio",
        "Brand Discovery Pool",
        "Company Review",
        "Campaign Opportunity",
        "Creator MOU",
        "Creator Token",
      ];
    case "Create Content Together":
      return [
        `Your ${category} Content`,
        "Creator Matching",
        `${region} Co-creation`,
        `${primaryChannel} Campaign`,
        "Brand Exposure",
        "Creator MOU",
        "Creator Token",
      ];
    case "Product Review":
      return [
        `Your ${category} Content`,
        "Brand Product Matching",
        "Sample Delivery",
        `${primaryChannel} Review Content`,
        "Campaign Report",
        "Creator MOU",
        "Creator Token",
      ];
    case "Offline Event":
      return [
        `Your ${category} Content`,
        "Event Matching",
        `${region} Offline Event`,
        "On-site Content",
        "Brand Networking",
        "Creator MOU",
        "Creator Token",
      ];
    case "Global Campaign":
      return [
        `Your ${category} Content`,
        "Creator Passport",
        `${region} Campaign`,
        `${primaryChannel} Campaign Brief`,
        "Campaign Activation",
        "Creator MOU",
        "Creator Token",
      ];
    case "Long-term Partnership":
      return [
        `Your ${category} Content`,
        "Creator Passport",
        "Brand Relationship",
        "Ambassador Discussion",
        `${primaryChannel} Long-term Plan`,
        "Long-term MOU",
        "Creator Token",
      ];
    default:
      return [
        "Your Content",
        "Creator Passport",
        "Brand Exposure",
        "Collaboration Matching",
        "Campaign / Co-creation",
        "Creator MOU",
        "Creator Token",
      ];
  }
}

function CreatorHero({ onJoin, onSignMou }: { onJoin: () => void; onSignMou: () => void }) {
  return (
    <section className="relative overflow-hidden px-6 pb-10 pt-28 text-center">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 30%, rgba(139,92,246,0.11) 0%, transparent 65%)",
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

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5"
          initial={{ opacity: 0, y: 16 }}
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
          <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">
            Hitpick Creator Network
          </span>
        </motion.div>

        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 text-6xl font-black leading-[0.95] tracking-tight text-white md:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          transition={{ delay: 0.1 }}
        >
          Create Content.
          <br />
          <span className="text-purple-400">Meet Global Brands.</span>
        </motion.h1>

        <motion.p
          animate={{ opacity: 1 }}
          className="mx-auto mb-8 max-w-xl text-lg text-white/50"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.18 }}
        >
          Join brand campaigns, Korean creator collabs, product reviews, and global content projects.
        </motion.p>

        <motion.div
          animate={{ opacity: 1 }}
          className="mb-4 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.26 }}
        >
          <button
            className="group flex items-center gap-2 rounded-full bg-purple-600 px-8 py-4 text-base font-bold text-white transition-all hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_32px_rgba(139,92,246,0.5)]"
            onClick={onJoin}
            type="button"
          >
            Create Creator Passport
            <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
          </button>
          <button
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white transition-all hover:bg-white/10"
            onClick={onJoin}
            type="button"
          >
            <Users size={15} /> Join Creator Network
          </button>
        </motion.div>

        <motion.button
          animate={{ opacity: 1 }}
          className="mx-auto flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/55"
          initial={{ opacity: 0 }}
          onClick={onSignMou}
          transition={{ delay: 0.36 }}
          type="button"
        >
          <Pen size={11} /> Sign Creator MOU
        </motion.button>
      </div>
    </section>
  );
}

function ContentRail() {
  return (
    <section className="overflow-hidden pb-10">
      <div className="relative">
        <div
          className="flex gap-4 overflow-x-auto px-6"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {creatorRailCards.map((card, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 30 }}
              key={`${card.tag1}-${card.tag2}`}
              style={{ height: `${card.height}px`, width: "180px" }}
              transition={{ delay: 0.08 + index * 0.07, duration: 0.45 }}
            >
              <MakeAssetImage asset={card.asset} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div
                className="absolute inset-0 rounded-2xl ring-1 ring-inset"
                style={{ boxShadow: `inset 0 0 0 1px ${card.color}35` }}
              />

              <div className="absolute right-2.5 top-2.5">
                <div className="flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
                  <Shield className="text-green-400" size={8} />
                  <span className="text-[8px] font-bold text-green-400">Verified</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div
                  className="mb-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: card.color }}
                >
                  {card.tag1}
                </div>
                <div className="text-[9px] font-medium text-white/50">{card.tag2}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030812] to-transparent" />
      </div>
    </section>
  );
}

function CollaborationChips() {
  return (
    <section className="border-y border-white/5 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2">
        {creatorChips.map((chip) => (
          <button
            className="rounded-full border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/55 transition-all hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
            key={chip}
            type="button"
          >
            {chip}
          </button>
        ))}
      </div>
    </section>
  );
}

function ProofRow() {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 text-center md:grid-cols-4">
        {creatorProofStats.map((item) => (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            key={item.label}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div
              className="mb-1 text-4xl font-black text-white"
              style={{ fontFamily: "var(--font-barlow), sans-serif" }}
            >
              {item.value}
            </div>
            <div className="text-xs uppercase tracking-widest text-white/35">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CreatorPassportSection({
  category,
  channel,
  goal,
  onJoin,
  region,
}: {
  category: CreatorCategory | "";
  channel: Channel | "";
  goal: CollabGoal | "";
  onJoin: () => void;
  region: Region | "";
}) {
  return (
    <section className="bg-[#020710] px-6 py-20">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-purple-400">
            Creator Identity
          </p>
          <h2
            className="mb-3 text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-barlow), sans-serif" }}
          >
            Create Your
            <br />
            Creator Passport
          </h2>
          <p className="mb-6 max-w-sm text-base text-white/45">
            Build your verified creator profile and unlock brand collaboration opportunities.
          </p>
          <div className="mb-8 flex flex-wrap gap-2">
            {[
              "Brand Collaboration Ready",
              "Korean Creator Network",
              "Global Campaign Ready",
            ].map((badge) => (
              <span
                className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300"
                key={badge}
              >
                {badge}
              </span>
            ))}
          </div>
          <button
            className="group flex items-center gap-2 rounded-full bg-purple-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
            onClick={onJoin}
            type="button"
          >
            Create Creator Passport
            <ArrowRight className="transition-transform group-hover:translate-x-1" size={14} />
          </button>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border p-6"
          style={{
            background: "linear-gradient(135deg, #0a0820 0%, #0d1030 100%)",
            borderColor: "rgba(139,92,246,0.25)",
          }}
        >
          <div
            className="absolute right-0 top-0 h-40 w-40 rounded-full opacity-10 blur-3xl"
            style={{ background: "#8b5cf6" }}
          />
          <div className="relative z-10 mb-5 overflow-hidden rounded-2xl border border-white/10 bg-[#05060b] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="text-purple-400" size={15} />
                <span
                  className="text-sm font-black text-white"
                  style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                >
                  Hitpick Creator Passport
                </span>
              </div>
              <span className="rounded-full border border-amber-400/25 bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                PENDING
              </span>
            </div>
            <div className="relative h-24 overflow-hidden rounded-xl border border-white/5 bg-[#07080d]">
              <img
                alt="Hitpick creator passport reference"
                className="h-full w-full object-cover object-center opacity-80"
                src={makeImageAssets.heroBanner}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080915] via-transparent to-[#120922]" />
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-2.5">
            {[
              { label: "Creator ID", value: `HP-CREATOR-${new Date().getFullYear()}-000001` },
              { label: "Category", value: category || "Not selected" },
              { label: "Main Channel", value: channel || "Not selected" },
              { label: "Region", value: region || "Not selected" },
              {
                label: "Goal",
                value:
                  goal && goal.length > 22 ? `${goal.slice(0, 22)}...` : goal || "Not selected",
              },
              { label: "Status", value: "Pending Verification" },
            ].map((item) => (
              <div className="rounded-xl bg-white/[0.04] p-2.5" key={item.label}>
                <p className="mb-0.5 text-[9px] uppercase tracking-wide text-white/30">
                  {item.label}
                </p>
                <p className="truncate text-xs font-semibold text-white/80">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OpportunityBuilder({
  category,
  channel,
  goal,
  onContinue,
  region,
  setCategory,
  setChannel,
  setGoal,
  setRegion,
  showRoute,
}: {
  category: CreatorCategory | "";
  channel: Channel | "";
  goal: CollabGoal | "";
  onContinue: () => void;
  region: Region | "";
  setCategory: (value: CreatorCategory) => void;
  setChannel: (value: Channel) => void;
  setGoal: (value: CollabGoal) => void;
  setRegion: (value: Region) => void;
  showRoute: boolean;
}) {
  return (
    <section className="bg-[#030812] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-purple-400">
          Quick Setup
        </p>
        <h2
          className="mb-1 text-2xl font-black text-white"
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
        >
          Build Your Creator Opportunity
        </h2>
        <p className="mb-6 text-sm text-white/35">
          Select your category, goal, region, and channel.
        </p>

        <div className="mb-6 flex flex-wrap gap-3">
          <select
            className={selectCls}
            onChange={(event) => setCategory(event.target.value as CreatorCategory)}
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
            className={selectCls}
            onChange={(event) => setGoal(event.target.value as CollabGoal)}
            value={goal}
          >
            <option value="">Goal</option>
            {GOALS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className={selectCls}
            onChange={(event) => setRegion(event.target.value as Region)}
            value={region}
          >
            <option value="">Region</option>
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            className={selectCls}
            onChange={(event) => setChannel(event.target.value as Channel)}
            value={channel}
          >
            <option value="">Channel</option>
            {CHANNELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-purple-500"
            onClick={onContinue}
            type="button"
          >
            Continue to Creator Passport <ArrowRight size={13} />
          </button>
        </div>

        <AnimatePresence>
          {showRoute && category && goal && region && channel ? (
            <motion.div
              animate={{ opacity: 1, height: "auto" }}
              className={`${cardBase} overflow-hidden p-5`}
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
            >
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                Your Collaboration Route
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {generateRoute(category, goal, region, channel).map((step, index, array) => (
                  <div className="flex items-center gap-2" key={`${step}-${index}`}>
                    <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-white/70">
                      {step}
                    </span>
                    {index < array.length - 1 ? (
                      <ChevronRight className="shrink-0 text-white/20" size={11} />
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

function MouFlowSection({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="bg-[#020710] px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-cyan-400">
          How It Works
        </p>
        <h2
          className="mb-3 text-3xl font-black text-white"
          style={{ fontFamily: "var(--font-barlow), sans-serif" }}
        >
          From Profile to Verified Creator Deal
        </h2>
        <p className="mx-auto mb-12 max-w-md text-sm text-white/40">
          Register your profile, sign a simple creator MOU, and receive your Creator Passport confirmation by email.
        </p>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {creatorFlowSteps.map((step, index) => (
            <motion.div
              className={`${cardBase} relative p-6`}
              initial={{ opacity: 0, y: 20 }}
              key={step.n}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {index < creatorFlowSteps.length - 1 ? (
                <div className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-1/2 md:block">
                  <ChevronRight className="text-white/15" size={14} />
                </div>
              ) : null}
              <div
                className="mb-3 text-3xl font-black text-purple-500/20"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                {step.n}
              </div>
              <h3 className="mb-1 text-sm font-bold text-white">{step.title}</h3>
              <p className="text-xs text-white/35">{step.sub}</p>
            </motion.div>
          ))}
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-8 py-4 text-sm font-bold text-white transition-all hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]"
          onClick={onJoin}
          type="button"
        >
          Get Started - Create Passport <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
}

function CreatorModal({
  category,
  channel,
  goal,
  onClose,
  region,
  step,
}: {
  category: CreatorCategory | "";
  channel: Channel | "";
  goal: CollabGoal | "";
  onClose: () => void;
  region: Region | "";
  step: ModalStep;
}) {
  const [form, setForm] = useState<CreatorFormData>({
    country: "",
    creatorName: "",
    email: "",
    mainChannel: channel || "",
    shortBio: "",
    snsLink: "",
  });
  const [currentStep, setCurrentStep] = useState<"form" | "mou" | "token">("form");
  const [token, setToken] = useState<CreatorIssuedToken | null>(null);
  const [hasSignature, setHasSignature] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [issueWarning, setIssueWarning] = useState<string | null>(null);

  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (step !== "closed") {
      setCurrentStep(step === "mou" ? "mou" : "form");
      setHasSignature(false);
      setIssueError(null);
      setIssueWarning(null);
      setToken(null);
      setForm((previous) => ({
        ...previous,
        mainChannel: previous.mainChannel || channel || "",
      }));
    }
  }, [channel, step]);

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
    ctx.strokeStyle = "#a78bfa";
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
      const payload: CreatorIssuePayload = {
        formData: {
          ...form,
          mainChannel: form.mainChannel || channel,
        },
        route:
          category && goal && region && channel
            ? generateRoute(category, goal, region, channel)
            : [],
        selections: {
          category,
          channel,
          goal,
          region,
        },
        signatureImage,
        type: "creator",
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

      setToken(result.token as CreatorIssuedToken);
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
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-purple-500/20 bg-[#0d1424]"
          exit={{ scale: 0.95 }}
          initial={{ scale: 0.95, y: 20 }}
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
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    currentStep === item
                      ? "bg-purple-600 text-white"
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
                    ? "Creator Info"
                    : item === "mou"
                      ? "MOU Signature"
                      : "Passport Token"}
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
                Create Your Creator Passport
              </h3>
              <p className="mb-6 text-sm text-white/40">
                Enter your information to build your verified creator profile.
              </p>

              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { full: true, key: "creatorName", placeholder: "Creator Name" },
                  { key: "email", placeholder: "Email Address" },
                  { key: "country", placeholder: "Country" },
                  { key: "mainChannel", placeholder: "Main Channel" },
                  { key: "snsLink", placeholder: "SNS Link / Profile URL" },
                  { full: true, key: "shortBio", placeholder: "Short Bio (optional)" },
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
                    value={form[field.key as keyof CreatorFormData]}
                  />
                ))}
              </div>

              {category || goal || region ? (
                <div className="mb-5 rounded-xl border border-purple-500/15 bg-purple-500/8 p-4">
                  <p className="mb-2 text-xs font-bold text-purple-400">
                    Auto-filled from your selections
                  </p>
                  <div className="flex flex-wrap gap-2">
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
                    {region ? (
                      <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50">
                        Region: {region}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-30"
                disabled={!form.creatorName || !form.email}
                onClick={() => setCurrentStep("mou")}
                type="button"
              >
                Continue to Creator MOU <ArrowRight size={14} />
              </button>
            </div>
          ) : null}

          {currentStep === "mou" ? (
            <div className="p-7">
              <h3
                className="mb-1 text-2xl font-black text-white"
                style={{ fontFamily: "var(--font-barlow), sans-serif" }}
              >
                Sign Creator Network MOU
              </h3>
              <p className="mb-5 text-sm text-white/40">Creator Network Participation MOU</p>

              <div className="mb-5 space-y-3 rounded-2xl bg-white/[0.03] p-5 text-sm">
                {[
                  { label: "Agreement Type", value: "Creator Network Participation MOU" },
                  { label: "Creator Name", value: form.creatorName || "-" },
                  { label: "Email", value: form.email || "-" },
                  { label: "Category", value: category || "-" },
                  { label: "Goal", value: goal || "-" },
                  { label: "Region", value: region || "-" },
                ].map((item, index, array) => (
                  <div
                    className={`flex justify-between ${
                      index < array.length - 1 ? "border-b border-white/5 pb-3" : ""
                    }`}
                    key={item.label}
                  >
                    <span className="shrink-0 text-white/40">{item.label}</span>
                    <span className="ml-4 text-right text-xs font-semibold text-white/80">
                      {item.value}
                    </span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-3">
                  <p className="text-xs leading-relaxed text-white/35">
                    This MOU confirms the creator&apos;s interest in joining the Hitpick Creator Network and exploring brand collaborations, creator co-creation projects, campaign opportunities, and global exposure through Hitpick.
                  </p>
                </div>
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
                  className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-[#060f20]"
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
                <Award size={15} />{" "}
                {isIssuing ? "Issuing Token..." : "Issue Creator Passport Token"}
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
                    Creator Passport Token Issued
                  </h3>
                  <p className="text-xs text-white/40">
                    Your Creator Network MOU has been issued from the server and stored in Hitpick.
                  </p>
                </div>
              </div>

              <div
                className="relative mb-5 overflow-hidden rounded-2xl border p-6"
                style={{
                  background: "linear-gradient(135deg, #0a0820, #0d0f28)",
                  borderColor: "rgba(139,92,246,0.3)",
                }}
              >
                <div
                  className="absolute right-0 top-0 h-32 w-32 rounded-full opacity-10 blur-2xl"
                  style={{ background: "#8b5cf6" }}
                />
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-purple-400" size={15} />
                    <span
                      className="text-sm font-black text-white"
                      style={{ fontFamily: "var(--font-barlow), sans-serif" }}
                    >
                      Hitpick Creator Passport Token
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/15 px-2.5 py-0.5">
                    <Shield className="text-green-400" size={10} />
                    <span className="text-[10px] font-bold text-green-400">VERIFIED</span>
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                  {[
                    { highlight: true, label: "Token ID", value: token.tokenId },
                    { label: "Type", value: token.mouType },
                    { label: "Creator", value: token.creatorName },
                    { label: "Email", value: token.email },
                    { label: "Country", value: token.country || "-" },
                    { label: "Category", value: token.category || "-" },
                    { label: "Main Channel", value: token.mainChannel || "-" },
                    { label: "SNS Link", value: token.snsLink || "-" },
                    { label: "Goal", value: token.goal || "-" },
                    { label: "Region", value: token.region || "-" },
                    { accent: true, label: "Status", value: token.status },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="mb-0.5 text-white/30">{item.label}</p>
                      <p
                        className={`text-xs font-semibold ${
                          item.highlight
                            ? "text-amber-300"
                            : item.accent
                              ? "text-cyan-400"
                              : "text-white/80"
                        }`}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mb-2 border-t border-white/5 pt-3">
                  <p className="mb-0.5 text-[10px] text-white/30">Document Hash (SHA-256)</p>
                  <p className="break-all font-mono text-[10px] text-cyan-400/70">
                    {token.documentHash}
                  </p>
                </div>
                <div>
                  <p className="mb-0.5 text-[10px] text-white/30">Issued At</p>
                  <p className="text-xs text-white/60">{new Date(token.issuedAt).toLocaleString()}</p>
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
                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="text-[10px] text-white/25">{CERTIFICATE_NOTICE}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`flex flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-semibold transition-all ${
                    token.emailSent
                      ? "border-green-500/25 bg-green-500/15 text-green-400"
                      : "border-purple-500/30 bg-purple-600/80 text-white hover:bg-purple-600"
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
                  type="button"
                >
                  <BookOpen size={16} />
                  View Passport
                </button>
                <button
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white/70 transition-all hover:bg-white/10"
                  type="button"
                >
                  <ExternalLink size={16} />
                  Browse Opps
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

export function CreatorOpportunityPage() {
  const [category, setCategory] = useState<CreatorCategory | "">("");
  const [goal, setGoal] = useState<CollabGoal | "">("");
  const [region, setRegion] = useState<Region | "">("");
  const [channel, setChannel] = useState<Channel | "">("");
  const [showRoute, setShowRoute] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>("closed");

  const openPassport = () => setModalStep("form");
  const openMou = () => setModalStep("mou");

  const handleContinue = () => {
    if (category && goal && region && channel) {
      setShowRoute(true);
      setModalStep("form");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#030812] pt-16 text-white"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      <CreatorHero onJoin={openPassport} onSignMou={openMou} />
      <ContentRail />
      <CollaborationChips />
      <ProofRow />
      <CreatorPassportSection
        category={category}
        channel={channel}
        goal={goal}
        onJoin={openPassport}
        region={region}
      />
      <OpportunityBuilder
        category={category}
        channel={channel}
        goal={goal}
        onContinue={handleContinue}
        region={region}
        setCategory={setCategory}
        setChannel={setChannel}
        setGoal={setGoal}
        setRegion={setRegion}
        showRoute={showRoute}
      />
      <MouFlowSection onJoin={openPassport} />

      <CreatorModal
        category={category}
        channel={channel}
        goal={goal}
        onClose={() => setModalStep("closed")}
        region={region}
        step={modalStep}
      />
    </div>
  );
}
