export default function BookingFallback() {
  return (
    <aside className="mt-6 flex flex-wrap items-center justify-center gap-3 text-center text-xs text-gray-400" aria-label="Alternative booking help">
      <span>Need another way to book?</span>
      <a href="https://fivesarena.setmore.com/book" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-700 px-3 py-2 underline underline-offset-4 hover:text-white">Backup booking calendar</a>
      <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-700 px-3 py-2 underline underline-offset-4 hover:text-white">Contact the arena</a>
    </aside>
  );
}
