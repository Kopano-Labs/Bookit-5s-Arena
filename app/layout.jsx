import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookNowFloat from '@/components/BookNowFloat';
import ChatWidget from '@/components/ChatWidget';
import '@/assets/styles/globals.css';

export const metadata = {
  title: 'Bookit 5s Arena',
  description: 'Book 5-a-side football pitches quickly and easily.',
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
          <Header />
          <main>
            {children}
          </main>
          <Footer />
          {/* Fixed floating elements — outside main so they overlay everything */}
          <BookNowFloat />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
