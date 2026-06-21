/**
 * Blackbox Market Mask — protocol bundle (ST-8 → ST-38 elevation).
 * Static research snapshot; UI layer timestamps "live client" clock only.
 * Re-validate figures before investor-facing decks (third-party demos vary).
 */

export const BLACKBOX_PROTOCOL_ID = "ST-38-BBM";
export const BLACKBOX_PROTOCOL_LABEL =
  "Blackbox Market Mask · Microsoft gaming realignment";

/** Strategic signals (Microsoft / Xbox public narrative + filings summaries). */
export const MICROSOFT_GAMING_REALIGNMENT = {
  headline:
    "Platform-first: content, services, and daily engagement over pure hardware attach.",
  pillars: [
    {
      id: "dau",
      title: "Engagement north star",
      body: "Leadership messaging emphasizes reach across console, PC, mobile, and cloud — daily active use and ecosystem depth over boxed-console volume alone.",
    },
    {
      id: "content",
      title: "First-party + catalog depth",
      body: "Game Pass and owned IP remain the gravity well; hardware cycles are managed while services carry recurring value.",
    },
    {
      id: "price",
      title: "Accessible entry + flexible tiers",
      body: "Public reporting notes pricing moves on subscriptions; pair arena SKUs with clear seasonal ladders and trial hooks.",
    },
    {
      id: "global",
      title: "Global & creator adjacency",
      body: "Emerging markets and creator tooling are explicit growth vectors — good fit for social leagues, UGC highlights, and cross-platform clips.",
    },
  ],
};

/**
 * Audience masks — blend Roblox / Minecraft / Fortnite age gravity for positioning.
 * Numbers: industry roundups; treat as directional, not legal claims.
 */
export const UGC_AGE_MARKET_MASKS = [
  {
    id: "roblox",
    name: "Roblox gravity",
    accent: "from-violet-500/20 to-fuchsia-500/10",
    bullets: [
      "Younger skew with meaningful 17–24 and 25+ share — “aging up” creates spenders for cosmetics, passes, and live events.",
      "Social graph + session snacks: optimize for short loops, party invites, and shareable wins.",
    ],
  },
  {
    id: "minecraft",
    name: "Minecraft gravity",
    accent: "from-emerald-500/20 to-lime-500/10",
    bullets: [
      "Broader age spread; creative persistence and mods — great parallel for seasonal arena builds and community maps.",
      "Java/Bedrock split implies dual client expectations (performance + accessibility).",
    ],
  },
  {
    id: "fortnite",
    name: "Fortnite gravity",
    accent: "from-sky-500/20 to-amber-500/10",
    bullets: [
      "Battle royale + IP events concentrate 10–25 energy; competitive ladders and limited-time cups mirror tournament arcs.",
      "Cross-media hype cycles — pair arena drops with stream-safe moments and highlight reels.",
    ],
  },
];

/** Product hooks for Bookit / live sports venue context. */
export const EXECUTION_MASK = [
  "Ship sub-90s paths: browse → book → pay confirmation (mobile-first).",
  "Tournament as live-service: rolling ladders, clear patch notes, visible clocks.",
  "Creator-adjacent: clip exports, squad tags, and manager dashboards as “UGC-lite”.",
  "Trust layer: age-aware copy on junior leagues; parental clarity on WhatsApp/SMS flows.",
];

export const BLACKBOX_SOURCES = [
  {
    label: "Microsoft — More Personal Computing (gaming metrics)",
    url: "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/more-personal-computing-performance",
  },
  {
    label: "Xbox Wire — platform direction",
    url: "https://news.xbox.com/en-us/2026/04/23/we-are-xbox/",
  },
  {
    label: "Roblox age distribution (Statista chart)",
    url: "https://www.statista.com/statistics/1190869/roblox-games-users-global-distribution-age/",
  },
  {
    label: "Fortnite statistics roundup (third-party)",
    url: "https://financesonline.com/fortnite-statistics/",
  },
];
