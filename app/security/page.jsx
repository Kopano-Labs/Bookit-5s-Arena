export default function SecurityPage() {
  const sections = [
    {
      title: 'Account Security',
      description:
        'We use secure sign-in flows, protected sessions, and limited internal access to help keep customer accounts safe. We also encourage every user to choose a strong unique password and avoid sharing login details.',
      bullets: [
        'Encrypted connections are used when you sign in, browse, or manage bookings.',
        'Access to account information is restricted to authorized systems and support staff when required.',
        'If you notice suspicious activity, contact us promptly so we can investigate.',
      ],
    },
    {
      title: 'Payment Security',
      description:
        'Payments are handled through secure processing partners designed to reduce direct exposure of sensitive card information inside our booking platform.',
      bullets: [
        'Transactions are submitted over protected connections.',
        'We do not keep full card numbers in normal customer account records.',
        'Payment reviews, refunds, and booking checks follow controlled internal processes.',
      ],
    },
    {
      title: 'Infrastructure & Monitoring',
      description:
        'We maintain practical technical and operational safeguards to support service reliability, detect unusual activity, and reduce the risk of unauthorized access.',
      bullets: [
        'Our systems are monitored for misuse, failures, and service disruption.',
        'Platforms, software, and dependencies are reviewed and updated as part of ongoing maintenance.',
        'Administrative access is limited and used only for approved operational purposes.',
      ],
    },
    {
      title: 'Responsible Disclosure',
      description:
        'If you believe you have found a security issue, please report it responsibly so we can review it quickly and take appropriate action.',
      bullets: [
        'Include the affected page or feature, a clear description, and steps to reproduce where possible.',
        'Do not access, modify, or delete information that does not belong to you.',
        'Do not interrupt bookings, payments, or service availability while testing.',
      ],
    },
    {
      title: 'Contact',
      description:
        'For security questions or vulnerability reports, please contact us directly and share enough information for our team to investigate.',
      bullets: [
        'Email: security@bookit5sarena.com',
        'For general booking support, use the Help page contact options instead of sending sensitive data.',
        'If your concern involves account access, include the affected email address and approximate time noticed.',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-16 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <section className="border border-white/10 bg-white/5 p-8 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:p-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-green-400">
            Trust & Protection
          </p>
          <h1
            className="max-w-4xl text-4xl font-black uppercase leading-tight sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Security At Bookit 5s Arena
          </h1>
          <div className="mt-6 h-1 w-24 bg-green-400" />
          <p className="mt-6 max-w-3xl text-sm uppercase leading-7 text-white/70 sm:text-base">
            We take a practical approach to security across accounts, payments,
            and infrastructure. While no internet service can guarantee absolute
            protection, we work to reduce risk, monitor our systems, and respond
            quickly when issues are reported.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className="border border-white/10 bg-black p-7 transition-colors duration-200 hover:border-green-400/50"
            >
              <h2
                className="text-2xl font-black uppercase tracking-wide text-white"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                {section.title}
              </h2>
              <div className="mt-4 h-1 w-14 bg-green-400" />
              <p className="mt-5 text-sm uppercase leading-7 text-white/70">
                {section.description}
              </p>
              <ul className="mt-6 space-y-3">
                {section.bullets.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm uppercase leading-6 text-white/80"
                  >
                    <span className="mt-2 h-2 w-2 shrink-0 bg-green-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="border border-green-400/30 bg-green-950/20 p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
            Best Practice
          </p>
          <h2
            className="mt-4 text-3xl font-black uppercase sm:text-4xl"
            style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
          >
            Help Keep Your Account Safe
          </h2>
          <ul className="mt-6 grid gap-4 text-sm uppercase leading-7 text-white/75 md:grid-cols-3">
            <li className="border border-white/10 bg-black/20 p-5">
              Use a strong password that you do not reuse on other websites.
            </li>
            <li className="border border-white/10 bg-black/20 p-5">
              Review your bookings regularly and report anything unexpected.
            </li>
            <li className="border border-white/10 bg-black/20 p-5">
              Never send passwords or payment details through public messages or
              social media.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}