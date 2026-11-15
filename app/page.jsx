// Server Component — keeps ISR data fetching; passes data to client components for animations
// TournamentArchiveSection is intentionally not mounted on the customer landing page.
import HeroSection from '@/components/home/HeroSection';
import FixturesPromo from '@/components/home/FixturesPromo';
import StatsBar from '@/components/home/StatsBar';
import WeatherWidget from '@/components/home/WeatherWidget';
import LivingOrganismSurface from '@/components/home/LivingOrganismSurface';
import PitchStadiumScene from '@/components/3d/PitchStadiumScene';
import TacticalBoard from '@/components/tactics/TacticalBoard';
import HomeLiveFixtures from '@/components/home/HomeLiveFixtures';
import CourtsSection from '@/components/home/CourtsSection';
import CourtAvailabilityNotice from '@/components/home/CourtAvailabilityNotice';
import AmenitiesStrip from '@/components/home/AmenitiesStrip';
import EventsSection from '@/components/home/EventsSection';
import HomeMediaHighlights from '@/components/home/HomeMediaHighlights';
import AboutSection from '@/components/home/AboutSection';
import SocialSection from '@/components/home/SocialSection';
import ContactSection from '@/components/home/ContactSection';
import WelcomePopup from '@/components/home/WelcomePopup';
import BlackboxMarketMask from '@/components/marketing/BlackboxMarketMask';
import { showBlackboxMarketMaskOnHome } from '@/lib/featureFlags';
import { listPublicCourts } from '@/lib/publicCourtCatalogue';

export const revalidate = 60; // ISR — revalidate every 60 seconds

const getCourts = async () => {
  try {
    return await listPublicCourts();
  } catch {
    console.error('Failed to load the public court catalogue');
    return [];
  }
};

const HomePage = async () => {
  const courts = await getCourts();
  const courtFeedReady = courts.length > 0;
  const numericPrices = courtFeedReady
    ? courts
        .map((court) => Number(court.price_per_hour))
        .filter((price) => Number.isFinite(price) && price > 0)
    : [];
  const minPrice = numericPrices.length > 0 ? Math.min(...numericPrices) : null;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <WelcomePopup />
      {showBlackboxMarketMaskOnHome() ? <BlackboxMarketMask /> : null}

      <HeroSection />

      <HomeLiveFixtures />
      <FixturesPromo />

      <StatsBar
        courtsCount={courtFeedReady ? courts.length : null}
        minPrice={minPrice}
        courtFeedReady={courtFeedReady}
      />

      <WeatherWidget />

      <section id="pitches" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PitchStadiumScene />
      </section>

      <section id="tactics" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TacticalBoard />
      </section>

      <LivingOrganismSurface />

      {courtFeedReady ? <CourtsSection courts={courts} /> : <CourtAvailabilityNotice />}

      <AmenitiesStrip />
      <EventsSection />

      <AboutSection
        courtsCount={courtFeedReady ? courts.length : null}
        minPrice={minPrice}
        courtFeedReady={courtFeedReady}
      />

      <SocialSection />
      <HomeMediaHighlights />
      <ContactSection />
    </div>
  );
};

export default HomePage;
