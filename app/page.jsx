// Server Component — keeps ISR data fetching; passes data to client components for animations
import HeroSection      from '@/components/home/HeroSection';
import FixturesPromo    from '@/components/home/FixturesPromo';
import StatsBar         from '@/components/home/StatsBar';
import LivingOrganismSurface from '@/components/home/LivingOrganismSurface';
import TournamentArchiveSection from '@/components/home/TournamentArchiveSection';
import HomeLiveFixtures from '@/components/home/HomeLiveFixtures';
import CourtsSection    from '@/components/home/CourtsSection';
import AmenitiesStrip   from '@/components/home/AmenitiesStrip';
import EventsSection    from '@/components/home/EventsSection';
import HomeMediaHighlights from '@/components/home/HomeMediaHighlights';
import AboutSection     from '@/components/home/AboutSection';
import SocialSection    from '@/components/home/SocialSection';
import ContactSection   from '@/components/home/ContactSection';
import WelcomePopup     from '@/components/home/WelcomePopup';
import BlackboxMarketMask from '@/components/marketing/BlackboxMarketMask';
import { showBlackboxMarketMaskOnHome } from '@/lib/featureFlags';
import connectDB        from '@/lib/mongodb';
import { getFallbackCourts } from '@/lib/localData/courts';
import { normalizeCourtImageFilename } from '@/lib/courtImage';
import Court            from '@/models/Court';

export const revalidate = 60; // ISR — revalidate every 60 seconds

const getCourts = async () => {
  try {
    await connectDB();
    const data = await Court.find().sort({ sortOrder: 1 }).lean();
    if (data.length === 0) {
      return getFallbackCourts();
    }
    return data.map((doc) => ({
      ...doc,
      image: normalizeCourtImageFilename(doc.image),
      _id: doc._id?.toString?.() ?? String(doc._id),
      owner:
        doc.owner != null ? String(doc.owner) : '000000000000000000000001',
      createdAt: doc.createdAt?.toISOString?.(),
      updatedAt: doc.updatedAt?.toISOString?.(),
    }));
  } catch (err) {
    console.error('Failed to get courts:', err);
    return getFallbackCourts();
  }
};

const HomePage = async () => {
  const courts = await getCourts();
  const ecosystemRoutes = [
    {
      label: "KRRababalela",
      href: "https://krrababalela.com",
      note: "Chief portfolio",
      status: "LIVE",
    },
    {
      label: "Kopano Labs",
      href: "https://kopanolabs.com",
      note: "Studio lane",
      status: "LIVE",
    },
    {
      label: "KasiLink",
      href: "https://kasilink.com",
      note: "Township network",
      status: "LIVE",
    },
    {
      label: "5s Arena News",
      href: "/news",
      note: "Blog + news organs rendered in the arena shell",
      status: "LIVE",
      internal: true,
    },
    {
      label: "Starfall Salvage",
      href: "https://starfallsalvage.kopanolabs.com",
      note: "Game lane",
      status: "LIVE",
    },
    {
      label: "Kopano Context",
      href: "https://context.kopanolabs.com",
      note: "Reserved domain",
      status: "RESERVED",
    },
  ];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <WelcomePopup />
      {showBlackboxMarketMaskOnHome() ? <BlackboxMarketMask /> : null}

      <HeroSection />

      <HomeLiveFixtures />
      <FixturesPromo />

      <StatsBar courtsCount={courts.length || 4} />

      {/* One province context now drives weather, editorial relevance and adaptive Three.js. */}
      <LivingOrganismSurface />

      {/* World Cup 2026 is historical evidence, not an active registration surface. */}
      <TournamentArchiveSection />

      <CourtsSection courts={courts} />
      <AmenitiesStrip />
      <EventsSection />
      <AboutSection courtsCount={courts.length || 4} />
      <SocialSection />

      {/* Existing global match feed remains a secondary layer beneath South Africa locality. */}
      <HomeMediaHighlights />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-gray-800/80 bg-gray-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-yellow-500">
              Kopano-Phu ecosystem
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.04em] text-white">
              Five&apos;s Arena is one lane in a wider public graph
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-400">
              The arena stays the sovereign user surface. Editorial and news organs now resolve
              back into this shell while the wider ecosystem remains explicitly linked.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ecosystemRoutes.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.internal ? undefined : "_blank"}
                rel={item.internal ? undefined : "noopener noreferrer"}
                className="rounded-2xl border border-gray-800/80 bg-black/20 p-4 no-underline transition-all hover:border-yellow-600/35 hover:bg-yellow-600/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-white">
                    {item.label}
                  </p>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${
                      item.status === "RESERVED"
                        ? "bg-amber-500/15 text-amber-300"
                        : "bg-yellow-600/15 text-green-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  {item.note}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </div>
  );
};

export default HomePage;
