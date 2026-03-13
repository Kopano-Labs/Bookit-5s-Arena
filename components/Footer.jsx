import { FaTiktok, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Social icons row */}
        <div className="flex justify-center gap-5 mb-4">
          <a
            href="https://www.tiktok.com/@fivesarena"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="text-gray-500 hover:text-black transition-colors"
          >
            <FaTiktok className="text-xl" />
          </a>
          <a
            href="https://www.instagram.com/fivesarena"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-500 hover:text-pink-600 transition-colors"
          >
            <FaInstagram className="text-xl" />
          </a>
          <a
            href="https://www.facebook.com/fivesarena"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-gray-500 hover:text-blue-600 transition-colors"
          >
            <FaFacebook className="text-xl" />
          </a>
          <a
            href="https://wa.me/27637820245"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-gray-500 hover:text-green-500 transition-colors"
          >
            <FaWhatsapp className="text-xl" />
          </a>
        </div>

        <p className="text-center text-sm text-gray-600">
          &copy; {currentYear} Bookit 5s Arena. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;