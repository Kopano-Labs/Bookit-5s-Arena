import Link from 'next/link';
import {
  FaFutbol, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaWhatsapp, FaInstagram, FaFacebook, FaTiktok, FaArrowRight,
} from 'react-icons/fa';

// ─── static data ─────────────────────────────────────────────
  const EVENTS = [
      {
        image: '/images/events/Birthday%20Parties.png',
        title: 'Birthday Parties',
        desc: 'Private court hire with full access to our bar & clubhouse. Catering options available. Perfect for groups of all sizes — book the pitch, celebrate in style.',
        border: 'border-t-green-500',
      },
      {
        image: '/images/events/Tournaments.png',
        title: 'Tournaments',
        desc: 'Organise your own 5v5 tournament on our floodlit courts. We provide the venue, sound system and bar — you bring the teams and the competitive spirit.',
        border: 'border-t-yellow-500',
      },
      {
        image: '/images/events/Corporate%20Events.png',
        title: 'Corporate Events',
        desc: 'The ultimate team-building day out. Use our courts, clubhouse bar and restaurant to host a full corporate event your team will never forget.',
        border: 'border-t-blue-500',
      },
      {
        image: '/images/events/Holiday%20Clinics.png',
        title: 'Holiday Clinics',
        desc: 'Coached football clinics for all ages and skill levels during school holidays. Great way to keep the kids active, improving and having fun.',
        border: 'border-t-purple-500',
      },
  ];

const AMENITIES = [
  { emoji: '💡', label: 'Floodlit Courts' },
  { emoji: '🔊', label: 'Sound System' },
  { emoji: '🍺', label: 'Bar & Restaurant' },
  { emoji: '🚗', label: 'Secure Parking' },
  { emoji: '🌦️', label: 'All-Weather Turf' },
  { emoji: '⚽', label: 'Synthetic Grass' },
];

// ─── server-side fetch ────────────────────────────────────────
const getCourts = async () => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/courts`, {
      cache: 'no-store',
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

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end pb-24 overflow-hidden">
        {/* Animated background — Ken Burns loop */}
        <div
          className="absolute inset-0 hero-bg"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80)',
            backgroundSize: '120%',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.2) 100%)',
          }}
        />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
          <p className="text-green-400 font-bold uppercase tracking-widest text-sm mb-4">
            Milnerton · Cape Town · Hellenic Football Club
          </p>
          <h1
            className="hero-title text-white font-black uppercase leading-none mb-6"
            style={{
              fontSize: 'clamp(3rem, 9vw, 7.5rem)',
              fontFamily: 'Impact, Arial Black, sans-serif',
              textShadow: '0 4px 32px rgba(0,0,0,0.6)',
            }}
          >
            WELCOME TO
            <br />
            <span className="text-green-400">FIVES ARENA</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-xl mb-10 leading-relaxed">
            Cape Town&apos;s premier 5-a-side football experience.
            Book a court, gather your squad, and play the beautiful game.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#courts"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold text-lg px-8 py-4 uppercase tracking-wide transition-colors"
            >
              <FaFutbol /> Book A Court
            </Link>
            <a
              href="https://wa.me/27637820245"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-white hover:border-green-400 hover:text-green-400 text-white font-bold text-lg px-8 py-4 uppercase tracking-wide transition-colors"
            >
              <FaWhatsapp /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ════════════════════════════════════════ */}
      <div className="bg-black text-white py-7">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { emoji: '⚽', label: 'Courts', value: `${courts.length || 4}` },
              { emoji: '💰', label: 'From', value: 'R400 / hr' },
              { emoji: '🕙', label: 'Open', value: '10AM – 10PM' },
              { emoji: '📍', label: 'Location', value: 'Milnerton, CPT' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-2xl leading-none mb-1">{s.emoji}</span>
                <span
                  className="font-black text-2xl text-white leading-none"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  {s.value}
                </span>
                <span className="text-gray-400 text-xs uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ COURTS ═══════════════════════════════════════════ */}
      <section id="courts" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-green-600 font-bold tracking-widest uppercase text-sm mb-2">
                Ready to play?
              </p>
              <h2
                className="font-black uppercase text-gray-900"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontFamily: 'Impact, Arial Black, sans-serif',
                }}
              >
                BOOK A COURT
              </h2>
            </div>
            <p className="text-gray-500 md:text-right md:max-w-xs text-sm leading-relaxed">
              All courts are floodlit, all-weather synthetic turf pitches
              at Hellenic Football Club, Milnerton.
            </p>
          </div>

          {courts.length === 0 ? (
            <p className="text-center text-gray-400 py-16 text-lg">
              No courts available right now. Check back soon.
            </p>
          ) : (
            <>
              {/* Mobile: horizontal swipe carousel */}
              <div className="flex md:hidden gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {courts.map((court) => (
                  <Link
                    key={court._id}
                    href={`/courts/${court._id}`}
                    className="group bg-white overflow-hidden shadow-sm flex-shrink-0 snap-start block w-72 hover:ring-2 hover:ring-green-400 rounded-2xl"
                    style={{ minWidth: '72vw', maxWidth: '300px' }}
                  >
                    {court.image ? (
                      <div className="relative h-48 overflow-hidden">
                        <img src={`/images/courts/${court.image}`} alt={court.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />
                        <div className="absolute bottom-4 left-4">
                          <span className="text-white font-black text-lg uppercase" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>{court.name}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-900 flex items-center justify-center">
                        <FaFutbol className="text-green-400 text-4xl" />
                      </div>
                    )}
                    <div className="p-4">
                      {!court.image && <h3 className="font-black text-lg uppercase mb-2">{court.name}</h3>}
                      {court.description && <p className="text-gray-500 text-sm mb-3 line-clamp-2">{court.description}</p>}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-black text-gray-900">R{court.price_per_hour}</span>
                          <span className="text-gray-400 text-sm"> /hr</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-white font-black px-4 py-2 rounded-full text-xs uppercase tracking-widest"
                          style={{
                            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                            boxShadow: '0 0 14px rgba(34,197,94,0.4)',
                          }}>
                          Book <FaArrowRight size={8} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {/* Swipe hint — mobile only */}
              <p className="md:hidden text-center text-gray-400 text-xs mt-1 mb-2">← Swipe to see all courts →</p>

              {/* Tablet/Desktop: normal grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courts.map((court) => (
                  <Link
                    key={court._id}
                    href={`/courts/${court._id}`}
                    className="group bg-white overflow-hidden shadow-sm hover:-translate-y-1 transition-all duration-300 block hover:ring-2 hover:ring-green-400 hover:shadow-[0_0_0_2px_#4ade80,0_0_22px_rgba(74,222,128,0.45),0_10px_30px_rgba(0,0,0,0.12)] rounded-2xl"
                  >
                    {court.image ? (
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={`/images/courts/${court.image}`}
                          alt={court.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div
                          className="absolute inset-0"
                          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}
                        />
                        <div className="absolute bottom-4 left-4">
                          <span className="text-white font-black text-xl uppercase" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                            {court.name}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-52 bg-gray-900 flex items-center justify-center">
                        <FaFutbol className="text-green-400 text-5xl" />
                      </div>
                    )}
                    <div className="p-5">
                      {!court.image && <h3 className="font-black text-xl uppercase mb-2">{court.name}</h3>}
                      {court.description && <p className="text-gray-500 text-sm mb-4 line-clamp-2">{court.description}</p>}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-gray-900">R{court.price_per_hour}</span>
                          <span className="text-gray-400 text-sm"> /hour</span>
                        </div>
                        <span className="inline-flex items-center gap-2 text-white font-black px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 group-hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                            boxShadow: '0 0 18px rgba(34,197,94,0.45)',
                          }}>
                          BOOK NOW <FaArrowRight size={9} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ══ AMENITIES STRIP ══════════════════════════════════ */}
      <div className="bg-green-600 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {AMENITIES.map((a, i) => (
              <div key={i} className="amenity-badge text-white">
                <span className="amenity-icon text-3xl leading-none">{a.emoji}</span>
                <span className="font-bold uppercase tracking-wide text-sm">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ EVENTS ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-green-600 font-bold tracking-widest uppercase text-sm mb-2">
              More than just football
            </p>
            <h2
              className="font-black uppercase text-gray-900"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'Impact, Arial Black, sans-serif',
              }}
            >
              EVENTS &amp; SERVICES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVENTS.map((e, i) => (
              <div
                key={i}
                className={`group bg-white overflow-hidden transition-all duration-300 border-t-4 ${e.border} flex flex-col shadow-sm hover:-translate-y-1 hover:shadow-xl rounded-2xl`}
              >
                <div className="p-6">
                  <h3
                    className="font-black uppercase text-xl mb-3 text-gray-900"
                    style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                  >
                    {e.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {e.desc}
                  </p>
                </div>
                <div className="h-48 overflow-hidden mt-auto rounded-b-2xl">
                  <img
                    src={e.image}
                    alt={e.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://wa.me/27637820245"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-gray-900 hover:bg-gray-900 hover:text-white text-gray-900 font-bold px-8 py-4 uppercase tracking-wide transition-all"
            >
              <FaWhatsapp /> Contact Us for More Info
            </a>
          </div>
        </div>
      </section>

      {/* ══ ABOUT ════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            <div>
              <p className="text-green-400 font-bold tracking-widest uppercase text-sm mb-4">
                About Us
              </p>
              <h2
                className="font-black uppercase leading-tight mb-6"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontFamily: 'Impact, Arial Black, sans-serif',
                }}
              >
                WHAT IS
                <br />
                <span className="text-green-400">5S ARENA?</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                5s Arena is played on state-of-the-art, all-weather, floodlit,
                synthetic grass facilities in the heart of Milnerton, Cape Town.
                We have a bar &amp; restaurant, sound system and secure parking on site.
              </p>
              <p className="text-gray-400 leading-relaxed mb-10">
                Small pitches, urban locations, short game times and manageable
                team sizes make 5-a-side the most accessible and exciting format
                of the beautiful game. Whether you&apos;re booking a casual
                kick-about, a competitive tournament, or a corporate team day
                — 5s Arena has you covered.
              </p>
              <div className="flex gap-10">
                {[
                  { val: `${courts.length || 4}+`, label: 'Courts' },
                  { val: '12h', label: 'Daily' },
                  { val: 'R400', label: 'From / hr' },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="font-black text-3xl text-green-400"
                      style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                    >
                      {s.val}
                    </div>
                    <div className="text-gray-500 text-xs uppercase tracking-widest mt-1">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps card */}
            <div className="border border-green-900 overflow-hidden flex flex-col">
              {/* Live map — click anywhere to open Google Maps */}
              <div className="relative h-72">
                <iframe
                  title="Hellenic Football Club Location"
                  src="https://maps.google.com/maps?q=Hellenic+Football+Club,+Pringle+Rd,+Milnerton,+Cape+Town,+South+Africa&output=embed&z=16"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Transparent overlay — clicking opens Google Maps */}
                <a
                  href="https://maps.google.com/?q=Hellenic+Football+Club,+Pringle+Rd,+Milnerton,+Cape+Town"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label="Open in Google Maps"
                />
              </div>
              {/* Address bar */}
              <div className="bg-green-950/40 border-t border-green-900 px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-bold text-sm uppercase tracking-widest mb-0.5">
                    Hellenic Football Club
                  </p>
                  <p className="text-gray-400 text-sm">Pringle Rd, Milnerton · Cape Town 7441</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Hellenic+Football+Club,+Pringle+Rd,+Milnerton,+Cape+Town"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-bold uppercase text-xs tracking-wide transition-colors flex-shrink-0 ml-4"
                >
                  <FaMapMarkerAlt /> Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SOCIAL FEED ══════════════════════════════════════ */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-green-400 font-bold tracking-widest uppercase text-sm mb-2">
              Stay connected
            </p>
            <h2
              className="events-title font-black uppercase text-white"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: "'Rubik Dirt', Impact, Arial Black, sans-serif",
              }}
            >
              FOLLOW OUR JOURNEY
            </h2>
            <p className="text-gray-400 mt-3 text-sm">See what&apos;s happening at 5s Arena — follow us for latest updates, goals &amp; events</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

            {/* ── Facebook Page Card ── */}
            <a
              href="https://www.facebook.com/profile.php?id=61588019843126"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-gray-700 hover:border-blue-500 bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 overflow-hidden"
            >
              {/* Cover strip */}
              <div
                className="h-28 w-full flex-shrink-0"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 30%',
                }}
              />
              {/* Content */}
              <div className="px-6 pb-6 pt-4 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-4 -mt-10">
                  <img
                    src="/images/logo.jpg"
                    alt="Fives Arena"
                    className="w-16 h-16 rounded-full border-4 border-gray-800 object-cover flex-shrink-0"
                  />
                  <div className="pt-8">
                    <p className="text-white font-black text-lg leading-none" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Fives Arena</p>
                    <p className="text-blue-400 text-xs mt-0.5 uppercase tracking-wide">Sports Club · Cape Town</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  5-a-side football at its finest. Follow our page for match highlights, booking updates, events &amp; behind-the-scenes content from Milnerton&apos;s top football venue.
                </p>
                <div className="mt-auto pt-3 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 group-hover:bg-blue-500 text-white font-bold text-sm rounded-lg transition-colors uppercase tracking-wide">
                    <FaFacebook size={15} /> View Page
                  </span>
                  <span className="text-gray-500 text-xs">↗ Opens Facebook</span>
                </div>
              </div>
            </a>

            {/* ── Social Links ── */}
            <div className="flex flex-col gap-4">
              <p className="text-gray-400 uppercase tracking-widest text-xs mb-1">Find us on</p>
              {[
                { icon: <FaFacebook size={22} />, label: 'Facebook', sub: 'Fives Arena — latest updates & events', href: 'https://www.facebook.com/profile.php?id=61588019843126', color: '#1877F2', bg: 'rgba(24,119,242,0.1)' },
                { icon: <FaInstagram size={22} />, label: 'Instagram', sub: 'Goals, match highlights & more', href: 'https://www.instagram.com/fivesarena', color: '#E1306C', bg: 'rgba(225,48,108,0.1)' },
                { icon: <FaTiktok size={22} />, label: 'TikTok', sub: 'Short clips from the pitch', href: 'https://www.tiktok.com/@fivesarena', color: '#ffffff', bg: 'rgba(255,255,255,0.06)' },
                { icon: <FaWhatsapp size={22} />, label: 'WhatsApp', sub: '063 782 0245 — instant reply', href: 'https://wa.me/27637820245', color: '#25D366', bg: 'rgba(37,211,102,0.1)' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-gray-700 hover:border-opacity-80 hover:bg-gray-800 transition-all rounded-xl group"
                  style={{ borderColor: 'rgba(75,85,99,1)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: s.bg }}>
                    <span style={{ color: s.color }}>{s.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm leading-none mb-0.5">{s.label}</p>
                    <p className="text-gray-500 text-xs truncate">{s.sub}</p>
                  </div>
                  <FaArrowRight className="text-gray-600 group-hover:text-green-400 transition-colors flex-shrink-0" size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══════════════════════════════════════════ */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-green-400 font-bold tracking-widest uppercase text-sm mb-2">
              We&apos;d love to hear from you
            </p>
            <h2
              className="font-black uppercase"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'Impact, Arial Black, sans-serif',
              }}
            >
              GET IN TOUCH
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <a
              href="tel:+27637820245"
              className="flex flex-col items-center gap-3 p-8 border border-gray-800 hover:border-green-500 transition-colors"
            >
              <FaPhone className="text-green-400 text-3xl" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">Phone</span>
              <span className="font-black text-lg hover:text-green-400 transition-colors">
                063 782 0245
              </span>
              <span className="text-gray-500 text-sm">Mashoto</span>
            </a>
            <a
              href="mailto:fivearena@mail.com"
              className="flex flex-col items-center gap-3 p-8 border border-gray-800 hover:border-green-500 transition-colors"
            >
              <FaEnvelope className="text-green-400 text-3xl" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">Email</span>
              <span className="font-black text-lg">fivearena@mail.com</span>
              <span className="text-gray-500 text-sm">We reply within 24hrs</span>
            </a>
            <a
              href="https://wa.me/27637820245"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-8 border border-green-900 bg-green-950/20 hover:border-green-500 transition-colors"
            >
              <FaWhatsapp className="text-green-400 text-3xl" />
              <span className="text-gray-400 text-xs uppercase tracking-widest">WhatsApp</span>
              <span className="font-black text-lg">063 782 0245</span>
              <span className="text-gray-500 text-sm">Instant response</span>
            </a>
          </div>

          {/* Footer brand + socials */}
          <div className="text-center border-t border-gray-800 pt-10">
            {/* Logo */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <img
                src="/images/logo.jpg"
                alt="5s Arena"
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500 shadow-lg shadow-green-900/40"
              />
              <p
                className="font-black uppercase text-white text-2xl tracking-wide"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                5S ARENA
              </p>
              <p className="text-gray-500 text-sm">Cape Town&apos;s Premier 5-a-Side Venue · Milnerton</p>
            </div>

            <p className="text-gray-600 uppercase tracking-widest text-xs mb-4">Follow Us</p>
            <div className="flex justify-center gap-4">
              {[
                { icon: <FaFacebook size={20} />, href: 'https://www.facebook.com/profile.php?id=61588019843126', label: 'Facebook' },
                { icon: <FaInstagram size={20} />, href: 'https://www.instagram.com/fivesarena', label: 'Instagram' },
                { icon: <FaTiktok size={20} />, href: 'https://www.tiktok.com/@fivesarena', label: 'TikTok' },
                { icon: <FaWhatsapp size={20} />, href: 'https://wa.me/27637820245', label: 'WhatsApp' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center w-11 h-11 border border-gray-800 hover:border-green-500 text-gray-500 hover:text-green-400 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
