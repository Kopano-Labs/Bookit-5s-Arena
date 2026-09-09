import EpochRelaunchPage from "@/components/home/EpochRelaunchPage";

export const revalidate = 3600;

export const metadata = {
  title: "FivesArena is evolving | Experiment 001 — KPGSTHREE",
  description:
    "FivesArena is evolving. The venue proved the need. The platform is becoming something bigger. Experiment 001 — KPGSTHREE. Preserved SEO equity on fivesarena.com.",
  alternates: {
    canonical: "https://fivesarena.com/",
  },
  openGraph: {
    title: "FivesArena is evolving",
    description:
      "The venue proved the need. The platform is becoming something bigger. Experiment 001 — KPGSTHREE.",
    url: "https://fivesarena.com/",
    siteName: "FivesArena",
    type: "website",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "FivesArena is evolving",
    description:
      "The venue proved the need. The platform is becoming something bigger. Experiment 001 — KPGSTHREE.",
  },
  robots: { index: true, follow: true },
};

/**
 * Epoch parked relaunch surface (Issue #158).
 * Product/backend/history preserved; venue-specific booking presentation removed from root.
 */
export default function HomePage() {
  return <EpochRelaunchPage />;
}
