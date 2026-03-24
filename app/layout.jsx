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
  title: { default: 'Bookit 5s Arena | Elite 5-a-Side Football Cape Town', template: '%s | Bookit 5s Arena' },
  description: "Cape Town's most advanced 5-a-side football venue. Experience the World Cup 5s, real-time competition standings, and pro-tier floodlit courts at Milnerton. Book online from R400/hour.",
  keywords: ['World Cup 5s', '5-a-side football', 'Cape Town', 'Milnerton', 'court booking', 'football tournament', 'Hellenic Football Club', 'Bookit 5s Arena', 'Competition Hub'],
  authors: [{ name: 'Bookit 5s Arena Engineering' }],
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: process.env.NEXTAUTH_URL || 'https://5sarena.co.za',
    siteName: 'Bookit 5s Arena',
    title: 'Bookit 5s Arena | The Future of 5-a-Side Football',
    description: "Elite 5-a-side football in Milnerton, Cape Town. Live competition standings, floodlit courts, and integrated fan experiences. Join the World Cup 5s today.",
    images: [{ url: '/images/logo.png', width: 512, height: 512, alt: 'Bookit 5s Arena Elite Football' }],
  },
  twitter: { card: 'summary_large_image', title: 'Bookit 5s Arena | Elite Cape Town Football', description: 'Experience the World Cup 5s and real-time competition stats in Milnerton, Cape Town.' },
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
