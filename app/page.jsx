// Server Component — keeps ISR data fetching; passes data to client components for animations
import HeroSection      from '@/components/home/HeroSection';
import FixturesPromo    from '@/components/home/FixturesPromo';
import StatsBar         from '@/components/home/StatsBar';
import WeatherWidget    from '@/components/home/WeatherWidget';
import HomeLiveFixtures from '@/components/home/HomeLiveFixtures';
import CourtsSection    from '@/components/home/CourtsSection';
import AmenitiesStrip   from '@/components/home/AmenitiesStrip';
import EventsSection    from '@/components/home/EventsSection';
import HomeMediaHighlights from '@/components/home/HomeMediaHighlights';
import AboutSection     from '@/components/home/AboutSection';
import SocialSection    from '@/components/home/SocialSection';
import TournamentSection from '@/components/home/TournamentSection';
import TournamentShowcase from '@/components/home/TournamentShowcase';
import ContactSection   from '@/components/home/ContactSection';
import WelcomePopup     from '@/components/home/WelcomePopup';
import BlackboxMarketMask from '@/components/marketing/BlackboxMarketMask';
import { showBlackboxMarketMaskOnHome } from '@/lib/featureFlags';
import connectDB        from '@/lib/mongodb';
import { getFallbackCourts } from '@/lib/localData/courts';
import { normalizeCourtImageFilename } from '@/lib/courtImage';
import Court            from '@/models/Court';

export const revalidate = 60; // ISR — revalidate every 60 seconds

// ─── server-side fetch ────────────────────────────────────────
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

// ─── page component ───────────────────────────────────────────
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
      label: "5s Arena Blog",
      href: "https://blog.fivesarena.com",
      note: "Editorial surface",
      status: "LIVE",
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

      {/* ══ HERO — animated entrance + particle background ══════ */}
      <HeroSection />

      <HomeLiveFixtures />
      <FixturesPromo />

      {/* ══ STATS BAR — live counts from courts (no misleading zero flash) ══ */}
      <StatsBar courtsCount={courts.length || 4} />

      {/* ══ WEATHER — live Cape Town weather via Open-Meteo ═════ */}
      <WeatherWidget />

      {/* ══ TOURNAMENT — showstopper World Cup section ══════════ */}
      <TournamentSection />

      {/* ══ COURTS — staggered scroll-reveal + hover glow ═══════ */}
      <CourtsSection courts={courts} />

      {/* ══ AMENITIES — spring pop-in ════════════════════════════ */}
      <AmenitiesStrip />

      {/* ══ EVENTS — staggered cards + coloured glows ════════════ */}
      <EventsSection />

      {/* ══ ABOUT — slide in from sides ══════════════════════════ */}
      <AboutSection courtsCount={courts.length || 4} />

      {/* ══ SOCIAL — staggered slide reveal ═════════════════════ */}
      <SocialSection />

      {/* ══ TOURNAMENT SHOWCASE — live standings + SSE ══════════ */}
      <TournamentShowcase />

      {/* ══ MEDIA HIGHLIGHTS — cinematic global news feed ════════ */}
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
              The arena should route cleanly to the chief portfolio, studio, township work
              network, editorial lane, and game layer. Kopano Context stays visible, but honestly
              marked as reserved until the public runtime is owner-proven.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {ecosystemRoutes.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
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

      {/* ══ CONTACT + FOOTER — animated cards ═══════════════════ */}
      <ContactSection />

    </div>
  );
};

export default HomePage;

