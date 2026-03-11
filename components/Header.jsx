import Image from "next/image";
import Link from "next/link";
import logo from '@/assets/images/myLogo.svg';
import {FaUser, FaSignOutAlt, FaSignInAlt, FaFutbol} from 'react-icons/fa';

const Header = () => {
    return (<header className="bg-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href='/'>
              <Image 
                className="h-16 w-16" 
                src={ logo } 
                alt="5's Arena Logo"
                priority={true} 
              />
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-3">
                <Link
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-large text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  Courts
                </Link>
                {/*<!-- Logged In Only -->*/}
                <Link
                  href="/bookings.html"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  Bookings
                </Link>
                <Link
                  href="/add-room.html"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  Add Court
                </Link>
              </div>
            </div>
          </div>
          {/*<!-- Right Side Menu -->*/}
          <div className="ml-auto">
            <div className="ml-4 flex items-center md:ml-6">
              {/*<!-- Logged Out Only -->*/}
              <Link
                href="login.html"
                className="mr-3 text-gray-800 hover:text-gray-600"
              >
                <FaSignInAlt className="inline mr-1" /> Login
              </Link>
              <Link
                href="register.html"
                className="mr-3 text-gray-800 hover:text-gray-600"
              >
                <FaUser className="inline mr-1" /> Register
              </Link>
              <Link href="my-rooms.html">
                <FaFutbol className="inline mr-1" /> My Courts
              </Link>
              <Link
                href="login.html"
                className="mx-3 text-gray-800 hover:text-gray-600"
              >
                <FaSignOutAlt className="inline mr-1" /> Sign Out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/*<!-- Mobile menu -->*/}
      <div className="md:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <Link
            href="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
          >
            Courts
          </Link>
          {/*<!-- Logged In Only -->*/}
          <Link
            href="/bookings.html"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
          >
            Bookings
          </Link>
          <Link
            href="/add-room.html"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
          >
            Add Court
          </Link>
        </div>
      </div>
    </header>);
};
 
export default Header;