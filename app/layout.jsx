import AuthProvider from '@/components/AuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/assets/styles/globals.css';

export const metadata = {
  title: 'Bookit 5s Arena',
  description: 'Book 5-a-side football pitches quickly and easily.',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
