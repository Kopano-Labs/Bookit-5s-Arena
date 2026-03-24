import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SoccerBallMenu from '@/components/SoccerBallMenu';
import NewsletterPopup from '@/components/NewsletterPopup';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import CookieBanner from '@/components/CookieBanner';
import ClientOnly from '@/components/ClientOnly';
import PageTransition from '@/components/PageTransition';
import { ThemeProvider } from '@/context/ThemeContext';
import '@/assets/styles/globals.css';

const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? (process.env.NEXTAUTH_URL || 'https://5sarena.co.za')
    : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: '5s Arena | 5-a-Side Football Cape Town', template: '%s | 5s Arena' },
  description: "Cape Town's premier 5-a-side football venue. Book floodlit courts at Hellenic Football Club, Milnerton. From R400/hour. Bar, restaurant & secure parking on site.",
  keywords: ['5-a-side football', 'Cape Town', 'Milnerton', 'court booking', 'football venue', 'Hellenic Football Club', '5s Arena'],
  authors: [{ name: '5s Arena' }],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: process.env.NEXTAUTH_URL || 'https://5sarena.co.za',
    siteName: '5s Arena',
    title: '5s Arena | 5-a-Side Football Cape Town',
    description: "Cape Town's premier 5-a-side football venue in Milnerton. Floodlit courts, bar & restaurant. Book online from R400/hour.",
    images: [{ url: '/images/logo.png', width: 512, height: 512, alt: '5s Arena Logo' }],
  },
  twitter: { card: 'summary', title: '5s Arena | Cape Town Football', description: 'Book 5-a-side courts in Milnerton, Cape Town. From R400/hour.' },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#15803d',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        {/* Plausible Analytics — Lightweight & Privacy-focused */}
        <script defer data-domain="5sarena.co.za" src="https://plausible.io/js/script.js"></script>
      </head>
      <body className="bg-gray-950 text-white antialiased selection:bg-green-500/30" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <AnalyticsTracker />
            <ClientOnly />
            <Header />
            <main>
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
            {/* Fixed floating elements */}
            <SoccerBallMenu />
            <NewsletterPopup />
            <CookieBanner />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
