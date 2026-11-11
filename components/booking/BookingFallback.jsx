export default function BookingFallback() {
  return (
    <details className="mx-auto mt-6 max-w-xl text-center text-xs text-gray-400">
      <summary className="cursor-pointer underline underline-offset-4 hover:text-white">Booking help</summary>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <a href="https://fivesarena.setmore.com/book" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-700 px-3 py-2 underline underline-offset-4 hover:text-white">Book with Setmore</a>
        <a href="https://wa.me/27637820245" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-700 px-3 py-2 underline underline-offset-4 hover:text-white">WhatsApp the arena</a>
      </div>
    </details>
  );
}
