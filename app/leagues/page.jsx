import Link from "next/link";
import { FaArchive, FaFutbol, FaWhatsapp } from "react-icons/fa";

const WHATSAPP_HREF =
  "https://wa.me/27637820245?text=Hi%205s%20Arena%2C%20please%20confirm%20the%20current%20competition%20or%20league%20registration%20options.";

export const metadata = {
  title: "Competitions | Bookit 5s Arena",
  description:
    "Current competition enquiry and historical tournament routes for Bookit 5s Arena in Milnerton, Cape Town.",
};

export default function LeaguesPage() {
  return (
    <main className="min-h-screen bg-gray-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="overflow-hidden rounded-[2rem] border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-7 shadow-2xl sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
              Registration status: confirm directly
            </span>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-500">
              5s Arena competitions
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
              Competition interest is open. A live registration window is not assumed.
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-400 sm:text-lg">
              This page no longer presents an expired tournament, entry fee, nation slot, fixture
              promise, or payment step as current. Ask the 5s Arena team to confirm which leagues,
              social competitions, or tournaments are currently accepting teams before submitting
              personal details or making any payment.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-green-500/20 bg-green-500/5 p-6 sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10 text-green-300">
              <FaFutbol />
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-green-300">
              Current competitions
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-wide">
              Confirm the active lane
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Current dates, capacity, format, entry fees, prize information and registration
              availability require direct confirmation from the team. This surface deliberately
              does not invent an OPEN badge when that state is not backed by a runtime receipt.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-green-500"
              >
                <FaWhatsapp /> Ask on WhatsApp
              </a>
              <Link
                href="/contact"
                className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-gray-200 transition hover:border-gray-600"
              >
                Contact team
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-6 sm:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-300">
              <FaArchive />
            </div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
              Historical competition
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-wide">
              World Cup 5s 2026 archive
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              The World Cup 5s public event window ran 29–31 May 2026. Registration closed
              22 May 2026. Its former ZAR 3,000 entry prompt and registration journey are historical
              material, not a current payment or signup instruction.
            </p>
            <Link
              href="/tournament"
              className="mt-6 inline-flex rounded-xl border border-yellow-500/25 bg-yellow-500/10 px-5 py-3 text-xs font-black uppercase tracking-widest text-yellow-300 transition hover:bg-yellow-500/15"
            >
              Open 2026 archive
            </Link>
          </div>
        </section>

        <p className="mt-8 text-center text-xs leading-6 text-gray-600">
          Governance rule: a configured competition concept is not the same thing as a currently
          open registration window.
        </p>
      </div>
    </main>
  );
}
