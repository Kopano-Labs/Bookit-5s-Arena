import Link from 'next/link';
import {
  FaFutbol, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaWhatsapp, FaInstagram, FaFacebook, FaTiktok,
  FaArrowRight, FaCheckCircle,
} from 'react-icons/fa';

// ─── static data ─────────────────────────────────────────────
const EVENTS = [
  {
    emoji: '🎂',
    title: 'Birthday Parties',
    desc: 'Private court booking with catering options and clubhouse access for the whole squad.',
    border: 'border-t-green-500',
  },
  {
    emoji: '🏆',
    title: 'Tournaments',
    desc: "Organise your own 5v5 event. We provide the facilities — you bring the teams.",
    border: 'border-t-yellow-500',
  },
  {
    emoji: '💼',
    title: 'Corporate Events',
    desc: '5-a-side is the perfect team-building activity for businesses of all sizes and industries.',
    border: 'border-t-blue-500',
  },
  {
    emoji: '⚽',
    title: 'Holiday Clinics',
    desc: 'Keep the kids active during school holidays with coached football clinics for all skill levels.',
    border: 'border-t-purple-500',
  },
];

const AMENITIES = [
  'Floodlit Courts', 'Sound System', 'Clubhouse Restaurant',
  'Secure Parking', 'All-Weather Turf', 'Synthetic Grass',
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
      <section
        className="relative min-h-screen flex items-end pb-24 overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
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
            className="text-white font-black uppercase leading-none mb-6"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((court) => (
                <Link
                  key={court._id}
                  href={`/courts/${court._id}`}
                  className="group bg-white overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 block"
                >
                  {court.image_url ? (
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={court.image_url}
                        alt={court.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
                        }}
                      />
                      <div className="absolute bottom-4 left-4">
                        <span
                          className="text-white font-black text-xl uppercase"
                          style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                        >
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
                    {!court.image_url && (
                      <h3 className="font-black text-xl uppercase mb-2">{court.name}</h3>
                    )}
                    {court.description && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {court.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-gray-900">
                          R{court.price_per_hour}
                        </span>
                        <span className="text-gray-400 text-sm"> /hour</span>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 text-sm uppercase tracking-wide transition-colors">
                        Book Now <FaArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ AMENITIES STRIP ══════════════════════════════════ */}
      <div className="bg-green-600 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {AMENITIES.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <FaCheckCircle className="text-green-200" />
                <span className="font-bold uppercase tracking-wide text-sm">{a}</span>
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
                className={`group bg-gray-50 hover:bg-gray-900 p-8 transition-all duration-300 border-t-4 ${e.border}`}
              >
                <div className="text-4xl mb-5 leading-none">{e.emoji}</div>
                <h3
                  className="font-black uppercase text-lg mb-3 text-gray-900 group-hover:text-white transition-colors"
                  style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
                >
                  {e.title}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed transition-colors">
                  {e.desc}
                </p>
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
                More action. More goals. More football.
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

            {/* venue card */}
            <div className="border border-green-900 bg-green-950/30 p-10 text-center">
              <FaFutbol className="text-green-400 text-8xl mx-auto mb-6" />
              <p className="text-green-400 font-bold text-xl uppercase tracking-widest mb-2">
                Hellenic Football Club
              </p>
              <p className="text-gray-300 mb-1">Pringle Rd, Milnerton</p>
              <p className="text-gray-300 mb-6">Cape Town, 7441</p>
              <div className="border-t border-green-900 pt-6">
                <a
                  href="https://maps.google.com/?q=Pringle+Rd+Milnerton+Cape+Town"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-bold uppercase text-sm tracking-wide transition-colors"
                >
                  <FaMapMarkerAlt /> Get Directions
                </a>
              </div>
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

          <div className="text-center">
            <p className="text-gray-600 uppercase tracking-widest text-xs mb-6">Follow Us</p>
            <div className="flex justify-center gap-4">
              {[
                { icon: <FaFacebook size={20} />, href: 'https://www.facebook.com/fivesarena', label: 'Facebook' },
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
