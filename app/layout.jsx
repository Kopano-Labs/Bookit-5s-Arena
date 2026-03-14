import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookNowFloat from '@/components/BookNowFloat';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import CookieBanner from '@/components/CookieBanner';
import ClientOnly from '@/components/ClientOnly';
import '@/assets/styles/globals.css';

export const metadata = {
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
    images: [{ url: '/images/logo.jpg', width: 512, height: 512, alt: '5s Arena Logo' }],
  },
  twitter: { card: 'summary', title: '5s Arena | Cape Town Football', description: 'Book 5-a-side courts in Milnerton, Cape Town. From R400/hour.' },
  robots: { index: true, follow: true },
  viewport: { width: 'device-width', initialScale: 1, themeColor: '#15803d' },
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <AnalyticsTracker />
          <ClientOnly />
          <Header />
          <main className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
          {/* Fixed floating elements — outside main so they overlay everything */}
          <BookNowFloat />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
