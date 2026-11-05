import Link from 'next/link';
import { FaArrowLeft, FaNewspaper, FaSatelliteDish } from 'react-icons/fa';
import LivingOrganismSurface from '@/components/home/LivingOrganismSurface';

export const metadata = {
  title: 'South Africa Pulse | Five’s Arena',
  description:
    'Province-aware football intelligence and weather rendered inside the Five’s Arena adaptive PWA shell.',
};

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-[#040706] text-white">
      <section className="px-4 pb-8 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-[10px] font-black uppercase tracking-[0.16em] text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            <FaArrowLeft /> Back to arena
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-green-300">
                <FaNewspaper /> Five&apos;s Arena local intelligence
              </p>
              <h1 className="mt-4 max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-7xl">
                The feed follows <span className="text-yellow-300">your province.</span>
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                This is the canonical user-facing news surface. Blog and news subdomains act as bounded editorial organs behind the membrane; users remain inside Five&apos;s Arena while province context governs weather and article relevance.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-gray-500">
                <FaSatelliteDish /> Organ contract
              </p>
              <p className="mt-2 text-xs font-bold leading-5 text-gray-300">
                blog.fivesarena.com → editorial source<br />
                news.fivesarena.com → presentation alias<br />
                fivesarena.com → sovereign shell
              </p>
            </div>
          </div>
        </div>
      </section>

      <LivingOrganismSurface />
    </main>
  );
}
