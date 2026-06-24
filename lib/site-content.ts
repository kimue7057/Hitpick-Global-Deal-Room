export type RoutePath =
  | "/"
  | "/creators"
  | "/brands"
  | "/campaigns"
  | "/contact";

export type NavigationItem = {
  href: RoutePath;
  label: string;
};

export type SignalContent = {
  body: string;
  items: string[];
  title: string;
};

export type StatContent = {
  description: string;
  label: string;
  tone: "violet" | "cyan";
  value: string;
};

export type PageContent = {
  label: string;
  signal: SignalContent;
  stats: StatContent[];
  title: string;
  subtitle: string;
};

export const primaryNavigation: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/creators", label: "Creators" },
  { href: "/brands", label: "Brands" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/contact", label: "Contact" },
];

export const headerActions: NavigationItem[] = [
  { href: "/creators", label: "Join Creator Pool" },
  { href: "/contact", label: "Request Access" },
];

export const pageContentByPath: Record<RoutePath, PageContent> = {
  "/": {
    label: "Hitpick One",
    signal: {
      title: "Unified Platform Surface",
      body: "One premium workflow for verified creator discovery, inbound demand, and trusted early-stage collaboration flow.",
      items: [
        "Verified creator discovery with premium context",
        "Global brand request intake inside one interface",
        "MOU-based PoC pathways for structured execution",
      ],
    },
    stats: [
      {
        label: "Creator Network",
        value: "Verified Inputs",
        description:
          "Discovery starts with clearer creator identity, category, and readiness signals.",
        tone: "violet",
      },
      {
        label: "AI Matching",
        value: "Qualified Fit",
        description:
          "Requests can be translated into sharper matching criteria before outreach begins.",
        tone: "cyan",
      },
      {
        label: "Trust Layer",
        value: "Shared Confidence",
        description:
          "A transparent collaboration layer sets both sides up for cleaner next-step decisions.",
        tone: "violet",
      },
    ],
    title: "The Global Deal Room for Korean Creators",
    subtitle:
      "Discover verified creators, request global collaborations, and start MOU-based PoC deals through Hitpick.",
  },
  "/creators": {
    label: "Creator Pool",
    signal: {
      title: "Creator Pool Readiness",
      body: "Profiles, audience context, and collaboration intent are framed to support premium global partner discovery.",
      items: [
        "Category and platform visibility for discovery",
        "Audience-fit signals for faster screening",
        "Collaboration scope aligned for cross-border needs",
      ],
    },
    stats: [
      {
        label: "Category View",
        value: "Vertical Mapping",
        description:
          "Creators can be understood by niche, platform, and collaboration posture at a glance.",
        tone: "violet",
      },
      {
        label: "Audience Signals",
        value: "Partner Context",
        description:
          "Audience alignment is presented in a way that supports faster brand-side qualification.",
        tone: "cyan",
      },
      {
        label: "Deal Readiness",
        value: "Clear Intent",
        description:
          "The pool is designed to surface who is ready for pilot conversations and structured deals.",
        tone: "violet",
      },
    ],
    title: "Meet Verified Korean Creators",
    subtitle:
      "Explore creator profiles by category, audience, platform, and collaboration type.",
  },
  "/brands": {
    label: "Brands & Partners",
    signal: {
      title: "Global Partner Workflow",
      body: "Brand and partner discovery starts with cleaner intake, clearer scope, and faster access to Korean creator opportunities.",
      items: [
        "Structured brief intake for premium collaboration",
        "Cross-border creator search with clearer fit signals",
        "Campaign PoC planning inside one aligned interface",
      ],
    },
    stats: [
      {
        label: "Brief Intake",
        value: "Demand Clarity",
        description:
          "Brand needs can be framed with the precision needed for creator-side evaluation.",
        tone: "cyan",
      },
      {
        label: "Creator Discovery",
        value: "Partner Match",
        description:
          "The system is built to reduce noise and improve the quality of first shortlist decisions.",
        tone: "violet",
      },
      {
        label: "Campaign Scope",
        value: "Global Reach",
        description:
          "From PPL to branded content, opportunity framing stays consistent across routes.",
        tone: "cyan",
      },
    ],
    title: "Find Creators for Global Brand Collaborations",
    subtitle:
      "Connect with Korean creators for PPL, branded content, campaign PoC, and global marketing.",
  },
  "/campaigns": {
    label: "MOU & PoC",
    signal: {
      title: "Execution Layer",
      body: "From shortlisting to PoC, the workflow keeps matching, intent, and execution aligned around real deal progress.",
      items: [
        "MOU-first engagement flow for low-friction starts",
        "PoC campaign coordination with clearer checkpoints",
        "Transparent conversion toward longer-term global deals",
      ],
    },
    stats: [
      {
        label: "MOU Flow",
        value: "Fast Alignment",
        description:
          "Early collaboration can begin with enough structure to move quickly without losing trust.",
        tone: "violet",
      },
      {
        label: "PoC Tracking",
        value: "Live Signals",
        description:
          "Campaign pilots can surface the signals needed to decide whether the deal should deepen.",
        tone: "cyan",
      },
      {
        label: "Deal Conversion",
        value: "Clear Next Step",
        description:
          "Verified opportunities are positioned to move from testing into repeatable global execution.",
        tone: "violet",
      },
    ],
    title: "Turn Creator Matching into Real Deals",
    subtitle:
      "Start with MOU-based collaboration, run PoC campaigns, and convert verified opportunities into global deals.",
  },
  "/contact": {
    label: "Request Access",
    signal: {
      title: "Access Routing",
      body: "Share your role and collaboration intent so the platform can route you into the right premium workflow.",
      items: [
        "Creator onboarding conversations",
        "Brand and partner access requests",
        "Strategic collaboration and expansion inquiries",
      ],
    },
    stats: [
      {
        label: "Request Review",
        value: "Intent First",
        description:
          "Access starts with understanding whether you are entering as a creator, brand, or partner.",
        tone: "cyan",
      },
      {
        label: "Partner Routing",
        value: "Right Workflow",
        description:
          "Requests are designed to connect with the part of the platform that fits the collaboration goal.",
        tone: "violet",
      },
      {
        label: "Secure Entry",
        value: "Premium Access",
        description:
          "The experience aims to feel controlled, trusted, and collaboration-ready from the first touchpoint.",
        tone: "cyan",
      },
    ],
    title: "Start Your Hitpick Deal Room Access",
    subtitle:
      "Tell us who you are and what type of collaboration you want to explore.",
  },
};
