// Server Component — keeps ISR data fetching; passes data to client components for animations
import HeroSection      from '@/components/home/HeroSection';
import StatsBar         from '@/components/home/StatsBar';
import CourtsSection    from '@/components/home/CourtsSection';
import AmenitiesStrip   from '@/components/home/AmenitiesStrip';
import EventsSection    from '@/components/home/EventsSection';
import FixturesPromo    from '@/components/home/FixturesPromo';
import AboutSection     from '@/components/home/AboutSection';
import SocialSection    from '@/components/home/SocialSection';
import ContactSection   from '@/components/home/ContactSection';
import FixturesPromo    from '@/components/FixturesPromo';

export const revalidate = 60; // ISR — revalidate every 60 seconds

// ─── server-side fetch ────────────────────────────────────────
const getCourts = async () => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/courts`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

// ─── page component ───────────────────────────────────────────
const HomePage = async () => {
  const courts = await getCourts();

  return (
    <div className="min-h-screen bg-white">

      {/* ══ HERO — animated entrance + particle background ══════ */}
      <HeroSection />

      {/* ══ STATS BAR — count-up animations ════════════════════ */}
      <StatsBar courtsCount={courts.length || 4} />

      {/* ══ COURTS — staggered scroll-reveal + hover glow ═══════ */}
      <CourtsSection courts={courts} />

      {/* ══ AMENITIES — spring pop-in ════════════════════════════ */}
      <AmenitiesStrip />

      {/* ══ EVENTS — staggered cards + coloured glows ════════════ */}
      <EventsSection />

      {/* ══ FIXTURES PROMO — live scores ticker + CTA ═══════════ */}
      <FixturesPromo />

      {/* ══ ABOUT — slide in from sides ══════════════════════════ */}
      <AboutSection courtsCount={courts.length || 4} />

      {/* ══ SOCIAL — staggered slide reveal ═════════════════════ */}
      <SocialSection />

      {/* ══ FIXTURES PROMO — between contact & footer ════════════ */}
      <FixturesPromo />

      {/* ══ CONTACT + FOOTER — animated cards ═══════════════════ */}
      <ContactSection />

    </div>
  );
};

export default HomePage;
