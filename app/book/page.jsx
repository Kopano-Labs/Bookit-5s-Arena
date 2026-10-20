export const metadata = {
  title: "Book a Court | Five's Arena",
  description:
    "Choose a Five's Arena court and book directly in the Setmore calendar embedded on this page.",
};

const SETMORE_BOOKING_URL = 'https://fivesarena.setmore.com/';

export default function BookPage() {
  return (
    <main className="min-h-[70vh] bg-gray-950 px-3 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-500">
              Five&apos;s Arena · Milnerton
            </p>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-tight sm:text-4xl">
              Choose your court and time
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Select a court below. The Setmore booking calendar stays right here on this page.
            </p>
          </div>
          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-700 px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-200 transition hover:border-gray-500"
          >
            Need help?
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-white shadow-2xl">
          <iframe
            title="Five's Arena court booking calendar"
            src={SETMORE_BOOKING_URL}
            scrolling="yes"
            allow="web-share; payment"
            className="block h-[82vh] min-h-[760px] w-full border-0 bg-white sm:min-h-[820px]"
          />
        </div>

        <p className="mt-3 text-center text-xs leading-5 text-gray-400">
          Your booking is handled by Setmore. Use its confirmation for your reservation details.
        </p>
      </section>
    </main>
  );
}
