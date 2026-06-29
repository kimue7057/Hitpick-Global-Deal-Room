export type NavItem = {
  href: "/" | "/global-deal" | "/creator" | "/about";
  label: string;
};

export type VisualCardAsset = {
  alt: string;
  backgroundClassName?: string;
  fit?: "contain" | "cover";
  imageClassName?: string;
  objectPosition?: string;
  src: string;
};

export type GlobalDealVisualCard = {
  asset: VisualCardAsset;
  category: string;
  color: string;
  heightClassName: string;
  name: string;
  offsetClassName?: string;
  tags: string[];
};

export type CreatorRailCard = {
  asset: VisualCardAsset;
  color: string;
  height: number;
  tag1: string;
  tag2: string;
};

export type StatItem = {
  label: string;
  value: string;
};

export type SimpleCard = {
  desc: string;
  icon:
    | "award"
    | "bar-chart-3"
    | "building-2"
    | "cpu"
    | "file-text"
    | "globe-2"
    | "layers"
    | "lock"
    | "network"
    | "shield"
    | "shopping-bag"
    | "store"
    | "users"
    | "zap";
  title: string;
  color: string;
};

export type MarketPoint = {
  color: string;
  label: string;
  x: string;
  y: string;
};

export const makeImageAssets = {
  heroBanner: "/images/make/launch-your-brand-banner.png",
  logoMark: "/images/make/hit-logo-mark.png",
  logoWordmark: "/images/make/hit-deal-room-logo.png",
} as const;

export const navigationItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/global-deal", label: "Global Deal" },
  { href: "/creator", label: "Creator" },
  { href: "/about", label: "About" },
];

export const footerColumns = [
  {
    items: ["Creator-led campaigns", "Verified deal workflows", "Market-entry routing"],
    title: "Platform",
  },
  {
    items: ["Global Deal", "Creator Passport", "Partnership MOU"],
    title: "Flows",
  },
  {
    items: ["About Hitpick", "Built by ERUTY", "Korea to global markets"],
    title: "Company",
  },
];

export const globalDealCreatorCards: GlobalDealVisualCard[] = [
  {
    asset: {
      alt: "Launch Your Brand Creator-Led Commerce banner",
      backgroundClassName: "bg-[#06070d]",
      fit: "contain",
      src: makeImageAssets.heroBanner,
    },
    category: "Beauty Creator",
    color: "#ec4899",
    heightClassName: "h-64",
    name: "Jiyeon K.",
    tags: ["Instagram / TikTok", "Global Audience"],
  },
  {
    asset: {
      alt: "Hit logo mark",
      backgroundClassName: "bg-[#120922]",
      fit: "contain",
      src: makeImageAssets.logoMark,
    },
    category: "Lifestyle Creator",
    color: "#8b5cf6",
    heightClassName: "h-56",
    name: "Minjun L.",
    offsetClassName: "mt-6",
    tags: ["Brand Collab", "Co-creation Ready"],
  },
  {
    asset: {
      alt: "Launch Your Brand Creator-Led Commerce banner",
      backgroundClassName: "bg-[#06070d]",
      fit: "contain",
      src: makeImageAssets.heroBanner,
    },
    category: "Food Creator",
    color: "#f59e0b",
    heightClassName: "h-72",
    name: "Soyeon P.",
    tags: ["Korea / Europe", "Short-form"],
  },
  {
    asset: {
      alt: "Hit Deal Room wordmark",
      backgroundClassName: "bg-[#05060b]",
      fit: "contain",
      src: makeImageAssets.logoWordmark,
    },
    category: "Short-form Creator",
    color: "#06b6d4",
    heightClassName: "h-60",
    tags: ["TikTok / Reels", "Product Review"],
    name: "Daehyun C.",
  },
  {
    asset: {
      alt: "Launch Your Brand Creator-Led Commerce banner",
      backgroundClassName: "bg-[#06070d]",
      fit: "contain",
      src: makeImageAssets.heroBanner,
    },
    category: "Fashion Creator",
    color: "#3b82f6",
    heightClassName: "h-68",
    offsetClassName: "mt-6",
    name: "Yuna S.",
    tags: ["Instagram / YouTube", "Creator Campaign"],
  },
  {
    asset: {
      alt: "Hit logo mark",
      backgroundClassName: "bg-[#0b0716]",
      fit: "contain",
      src: makeImageAssets.logoMark,
    },
    category: "Travel Creator",
    color: "#10b981",
    heightClassName: "h-56",
    name: "Hyelin J.",
    tags: ["Global Content", "Partnership Ready"],
  },
];

export const globalDealTrustStats: StatItem[] = [
  { value: "100+", label: "Verified Creators" },
  { value: "30+", label: "Global Partners" },
  { value: "6+", label: "Content Categories" },
  { value: "MOU", label: "in Minutes" },
];

export const globalDealValueCards: SimpleCard[] = [
  {
    color: "#3b82f6",
    desc: "Connect with Korean and global creators based on category, audience, language, and market fit.",
    icon: "users",
    title: "Creator Matching",
  },
  {
    color: "#8b5cf6",
    desc: "Design creator-led campaigns for awareness, market testing, product reviews, and launch activation.",
    icon: "zap",
    title: "Campaign Planning",
  },
  {
    color: "#06b6d4",
    desc: "Turn creator content into audience attention, interest, and market response.",
    icon: "globe-2",
    title: "Audience Activation",
  },
  {
    color: "#10b981",
    desc: "Connect campaign traffic to online sales channels, landing pages, and commerce partners.",
    icon: "shopping-bag",
    title: "Online Commerce Route",
  },
  {
    color: "#f59e0b",
    desc: "Explore pop-up stores, retail partners, local distributors, and offline sales opportunities.",
    icon: "store",
    title: "Offline Distribution Route",
  },
  {
    color: "#3b82f6",
    desc: "Move from meeting to partnership interest through simplified tablet-based MOU signing.",
    icon: "file-text",
    title: "Partnership MOU",
  },
  {
    color: "#8b5cf6",
    desc: "Create a private space to manage brand information, proposals, documents, and follow-up actions.",
    icon: "lock",
    title: "Private Deal Room",
  },
  {
    color: "#fbbf24",
    desc: "Receive a digital proof certificate linked to the signed MOU and document verification hash.",
    icon: "award",
    title: "Verified Deal Token",
  },
];

export const networkCreatorTags = [
  "K-Beauty Creators",
  "K-Food Creators",
  "Lifestyle Creators",
  "Short-form Creators",
  "Live Commerce Hosts",
  "Global Audience Creators",
];

export const networkDistributionTags = [
  "Online Commerce",
  "Live Commerce",
  "Offline Pop-up",
  "Retail Partner",
  "Distribution Partner",
  "Market Testing",
];

export const creatorRailCards: CreatorRailCard[] = [
  {
    asset: {
      alt: "Launch Your Brand Creator-Led Commerce banner",
      backgroundClassName: "bg-[#06070d]",
      fit: "contain",
      src: makeImageAssets.heroBanner,
    },
    color: "#ec4899",
    height: 340,
    tag1: "Beauty Review",
    tag2: "Instagram / TikTok",
  },
  {
    asset: {
      alt: "Hit Deal Room wordmark",
      backgroundClassName: "bg-[#07080d]",
      fit: "contain",
      src: makeImageAssets.logoWordmark,
    },
    color: "#3b82f6",
    height: 300,
    tag1: "Brand Campaign",
    tag2: "Global Opportunity",
  },
  {
    asset: {
      alt: "Hit logo mark on dark background",
      backgroundClassName: "bg-[#120922]",
      fit: "contain",
      src: makeImageAssets.logoMark,
    },
    color: "#8b5cf6",
    height: 360,
    tag1: "Korean Creator Collab",
    tag2: "Co-creation Ready",
  },
  {
    asset: {
      alt: "Launch Your Brand Creator-Led Commerce banner",
      backgroundClassName: "bg-[#06070d]",
      fit: "contain",
      src: makeImageAssets.heroBanner,
    },
    color: "#f59e0b",
    height: 310,
    tag1: "Food Content",
    tag2: "Short-form Review",
  },
  {
    asset: {
      alt: "Launch Your Brand Creator-Led Commerce banner",
      backgroundClassName: "bg-[#06070d]",
      fit: "contain",
      src: makeImageAssets.heroBanner,
    },
    color: "#10b981",
    height: 340,
    tag1: "Travel Vlog",
    tag2: "Global Audience",
  },
  {
    asset: {
      alt: "Hit Deal Room wordmark",
      backgroundClassName: "bg-[#05060b]",
      fit: "contain",
      src: makeImageAssets.logoWordmark,
    },
    color: "#06b6d4",
    height: 300,
    tag1: "Fashion Creator",
    tag2: "Brand Collaboration",
  },
  {
    asset: {
      alt: "Hit logo mark",
      backgroundClassName: "bg-[#120922]",
      fit: "contain",
      src: makeImageAssets.logoMark,
    },
    color: "#a855f7",
    height: 350,
    tag1: "Product Review",
    tag2: "UGC Content",
  },
  {
    asset: {
      alt: "Launch Your Brand Creator-Led Commerce banner",
      backgroundClassName: "bg-[#06070d]",
      fit: "contain",
      src: makeImageAssets.heroBanner,
    },
    color: "#f97316",
    height: 320,
    tag1: "Offline Event",
    tag2: "Creator Network",
  },
];

export const creatorChips = [
  "Brand Deals",
  "Product Reviews",
  "Korean Creator Collab",
  "Co-Creation",
  "TikTok Videos",
  "Instagram Reels",
  "YouTube Shorts",
  "UGC Content",
  "Offline Events",
  "Creator Passport",
  "Global Campaigns",
  "Fashion",
  "Beauty",
  "Food",
  "Travel",
  "Lifestyle",
];

export const creatorProofStats: StatItem[] = [
  { value: "100+", label: "Creator Pool" },
  { value: "30+", label: "Global Partners" },
  { value: "8+", label: "Collab Types" },
  { value: "MOU", label: "in Minutes" },
];

export const creatorFlowSteps = [
  { n: "01", sub: "Fill in your creator profile in minutes", title: "Create Creator Passport" },
  { n: "02", sub: "Simple digital signature on any device", title: "Sign Creator Network MOU" },
  { n: "03", sub: "Email confirmation + certificate issued", title: "Receive Creator Passport Token" },
];

export const aboutBadges = [
  "Creator Network",
  "Global Brands",
  "Commerce Routes",
  "Verified Deals",
];

export const aboutWhyCards: SimpleCard[] = [
  {
    color: "#3b82f6",
    desc: "Global companies struggle to connect authentically with local audiences. Korean creators bridge that gap.",
    icon: "building-2",
    title: "Brands need local influence.",
  },
  {
    color: "#8b5cf6",
    desc: "Content creators have influence but lack direct access to brand deals, campaigns, and global exposure.",
    icon: "users",
    title: "Creators need real opportunities.",
  },
  {
    color: "#06b6d4",
    desc: "Through content, commerce, and verified deal workflows, Hitpick turns introductions into global partnerships.",
    icon: "globe-2",
    title: "Hitpick connects both sides.",
  },
];

export const aboutWhatCards: SimpleCard[] = [
  {
    color: "#8b5cf6",
    desc: "Korean and global creators across beauty, lifestyle, food, travel, fashion, and culture.",
    icon: "users",
    title: "Creators",
  },
  {
    color: "#3b82f6",
    desc: "Companies looking to enter new markets through creator-led campaigns and partnerships.",
    icon: "building-2",
    title: "Brands",
  },
  {
    color: "#10b981",
    desc: "Online and offline routes including product reviews, live commerce, pop-ups, and distribution partners.",
    icon: "shopping-bag",
    title: "Commerce",
  },
  {
    color: "#f59e0b",
    desc: "Simplified MOU and agreement flows with digital certificates and token-based proof.",
    icon: "award",
    title: "Verified Deals",
  },
];

export const aboutNetworkStats = [
  { val: "100+", label: "Domestic Creator Pool" },
  { val: "30+", label: "Global Partners" },
  { val: "11+", label: "Global MOUs" },
  { val: "4+", label: "Domestic Partnerships" },
  { val: "6+", label: "Content Categories" },
];

export const aboutInfraCards: SimpleCard[] = [
  {
    color: "#3b82f6",
    desc: "Sign partnership intent quickly at events or online.",
    icon: "file-text",
    title: "Tablet MOU",
  },
  {
    color: "#10b981",
    desc: "Receive a verified confirmation by email.",
    icon: "award",
    title: "Digital Certificate",
  },
  {
    color: "#8b5cf6",
    desc: "Generate document hash and verification data.",
    icon: "shield",
    title: "Document Proof",
  },
  {
    color: "#06b6d4",
    desc: "Manage follow-up, proposals, and partnership opportunities.",
    icon: "lock",
    title: "Deal Room",
  },
];

export const aboutMarkets: MarketPoint[] = [
  { label: "Korea", x: "68%", y: "30%", color: "#8b5cf6" },
  { label: "Japan", x: "76%", y: "29%", color: "#06b6d4" },
  { label: "Southeast Asia", x: "73%", y: "45%", color: "#10b981" },
  { label: "Middle East", x: "57%", y: "37%", color: "#f59e0b" },
  { label: "Europe", x: "47%", y: "22%", color: "#3b82f6" },
  { label: "United States", x: "20%", y: "28%", color: "#ec4899" },
];

export const erutyTags = [
  "Korea-based technology company",
  "Content / IP infrastructure",
  "Creator partnership workflows",
  "AI and blockchain-powered systems",
  "Global partnership network",
];

export const erutyFeatureCards: SimpleCard[] = [
  {
    color: "#8b5cf6",
    desc: "Creator / Brand / Campaign",
    icon: "cpu",
    title: "AI-powered matching",
  },
  {
    color: "#06b6d4",
    desc: "Document hash & token",
    icon: "shield",
    title: "Blockchain proof",
  },
  {
    color: "#3b82f6",
    desc: "MOU / Certificate / Deal",
    icon: "network",
    title: "Partnership workflows",
  },
  {
    color: "#10b981",
    desc: "Korea-based global stack",
    icon: "layers",
    title: "Content IP infrastructure",
  },
];
