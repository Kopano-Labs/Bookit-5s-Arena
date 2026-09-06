import Link from 'next/link';
import { FaFutbol, FaHome, FaWhatsapp } from 'react-icons/fa';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-16 text-white sm:px-6">
      <div className="w-full max-w-2xl rounded-[2rem] border border-gray-800 bg-black/35 p-7 text-center shadow-2xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-green-500/25 bg-green-500/10 text-green-300">
          <FaFutbol size={26} />
        </div>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-yellow-400">404 · Out of bounds</p>
        <h1 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-6xl">That route left the pitch.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400">
          The page you asked for is not available. Head home, open the browser football playground,
          or contact the venue if you were trying to reach a current booking or service.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-600 px-5 text-xs font-black uppercase tracking-widest text-white hover:bg-green-500">
            <FaHome /> Home
          </Link>
          <Link href="/play" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-yellow-500/25 bg-yellow-500/10 px-5 text-xs font-black uppercase tracking-widest text-yellow-200">
            <FaFutbol /> Play penalty
          </Link>
          <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-5 text-xs font-black uppercase tracking-widest text-gray-300">
            <FaWhatsapp /> Contact venue
          </a>
        </div>
      </div>
    </main>
  );
}
