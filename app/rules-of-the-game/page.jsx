import Link from 'next/link';
import {
  FaArchive,
  FaArrowLeft,
  FaBan,
  FaBookOpen,
  FaFileContract,
  FaFutbol,
  FaHandshake,
  FaShieldAlt,
  FaTools,
  FaTrophy,
} from 'react-icons/fa';
import { TOURNAMENT_DATES, TOURNAMENT_FORMAT } from '@/lib/tournamentConfig';

export const metadata = {
  title: 'Rules of the Game | Five’s Arena',
  description:
    'Current Five’s Arena play and venue rules, with the completed World Cup 2026 competition rules preserved separately as historical policy.',
};

const CURRENT_RULES = [
  {
    title: '5-a-side play',
    icon: FaFutbol,
    items: [
      'Each match is 20 minutes: two 10-minute halves with a 2-minute break.',
      'Teams play with 5 players: 4 outfield players and 1 goalkeeper.',
      'Rolling substitutions are allowed during play.',
      'No slide tackles. A violation may be sanctioned by the referee.',
      'Kick-ins replace throw-ins and the ball must be stationary on the sideline.',
      'No offside rule applies.',
      'The goalkeeper may not cross the halfway line.',
      'Direct free kicks are awarded for fouls; the defending wall must be 3 metres away.',
      'Shin guards are mandatory and suitable football or astro-turf footwear is required.',
      'The referee’s decision is final during a match.',
    ],
  },
  {
    title: 'Conduct & safety',
    icon: FaHandshake,
    items: [
      'Respect staff, referees, players, spectators and the Hellenic Football Club premises.',
      'Fighting, intimidation, threatening, abusive or disorderly behaviour is not accepted.',
      'Team managers remain responsible for their players, spectators and support staff.',
      'Children must be supervised by a responsible adult.',
      'Arrive on time for a confirmed booking or fixture.',
      'Keep pitches, changing areas and shared facilities clean.',
    ],
  },
  {
    title: 'Illegal substances',
    icon: FaBan,
    items: [
      'The use, possession or distribution of illegal substances is prohibited on the premises.',
      'Unsafe or illegal conduct may result in removal from the venue and escalation to the appropriate authorities.',
      'Report suspicious or dangerous activity to venue staff.',
    ],
  },
  {
    title: 'Equipment & facilities',
    icon: FaTools,
    items: [
      'Goals, nets, barriers, balls and venue equipment must be treated with care.',
      'Do not move fixed equipment without staff permission.',
      'Report damaged or unsafe equipment immediately.',
      'Equipment issued for a booking or match must be returned after use.',
      'Intentional damage may create liability for repair or replacement.',
    ],
  },
];

const WORLD_CUP_ARCHIVE = [
  `${TOURNAMENT_FORMAT.groupCount} groups × ${TOURNAMENT_FORMAT.teamsPerGroup} teams were defined in the 2026 competition format.`,
  `The format advanced the top ${TOURNAMENT_FORMAT.advancePerGroup} teams per group into a ${TOURNAMENT_FORMAT.knockoutTeams}-team knockout phase.`,
  `The planned knockout sequence was ${TOURNAMENT_FORMAT.bracket.join(' → ')}.`,
  `Registration closed ${TOURNAMENT_DATES.signupDeadline} at 23:59 SAST.`,
  `The event window was ${TOURNAMENT_DATES.rangeLong}.`,
  'Teams represented World Cup nations and nation selection was first-come during the registration period.',
  'Registered teams were structured around 5 players plus a team manager, with optional reserve/support roles defined by the tournament registration flow.',
  'Standard win/draw/loss scoring was 3/1/0 points, with goal difference and additional competition tiebreak rules applied as defined for the event.',
];

export default function RulesOfTheGamePage() {
  return (
    <main className="min-h-screen bg-[#040609] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-gray-300 transition hover:text-white"
        >
          <FaArrowLeft /> Back to arena
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-green-300/15 bg-black/35 p-6 sm:p-8 lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-300/20 bg-green-300/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-green-200">
            <FaBookOpen /> Current venue governance
          </div>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
            Rules of the <span className="text-green-300">game</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-300 sm:text-base">
            Current Five’s Arena play, conduct and facility rules are separated from the completed World Cup 2026 competition policy. Historical tournament instructions no longer behave like active sign-up guidance.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {CURRENT_RULES.map((section) => {
            const Icon = section.icon;
            return (
              <article
                key={section.title}
                className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-300/15 bg-green-300/8 text-green-200">
                  <Icon />
                </div>
                <h2 className="mt-5 text-xl font-black uppercase text-white">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-400">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-[2.25rem] border border-amber-300/15 bg-amber-300/[0.03] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
                <FaArchive /> World Cup 2026 policy archive
              </p>
              <h2 className="mt-3 text-3xl font-black uppercase text-white">
                Completed competition rules
              </h2>
            </div>
            <Link
              href="/tournament"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber-300/20 bg-amber-300/8 px-4 text-[10px] font-black uppercase tracking-[0.16em] text-amber-100"
            >
              <FaTrophy /> Open archive
            </Link>
          </div>

          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {WORLD_CUP_ARCHIVE.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-gray-400"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-[2rem] border border-blue-300/10 bg-blue-300/[0.025] p-6">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-blue-200">
            <FaShieldAlt /> Policy boundary
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Booking terms, payment terms and event-specific rules can change independently. Current transactional terms should be presented at the point of booking; the World Cup section above is historical and cannot reopen registration.
          </p>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/8 bg-white/[0.025] p-6">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">
            <FaFileContract /> Need venue clarification?
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-400">
            Contact Five’s Arena before play when a current booking, event or venue instruction conflicts with an archived competition rule.
          </p>
        </section>
      </div>
    </main>
  );
}
