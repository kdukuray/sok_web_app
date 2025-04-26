"use client";
import Link from "next/link";
import Image from "next/image";

type NavbarClientProps = {
  isLoggedIn: boolean;
};

export default function NavbarClient({ isLoggedIn }: NavbarClientProps) {
  return (
    <nav className="h-24 border-b border-gray-200 px-4 md:px-32 flex items-center justify-between bg-white shadow-sm">
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center space-x-3">
          <Image src="/images/soklogo.png" alt="sok logo" width={40} height={40} className="sm:w-[50px] sm:h-[50px]" />
          <span className="text-lg sm:text-xl font-semibold text-blue-900">
            Seekers of Knowledge
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 items-center justify-center text-center">
        <Link href="/" className="text-blue-900 text-base md:text-lg font-medium hover:text-blue-700 transition-colors">
          Home
        </Link>
        <Link href="/about/" className="text-blue-900 text-base md:text-lg font-medium hover:text-blue-700 transition-colors">
          About
        </Link>
        <Link href="/lessons/1" className="text-blue-900 text-base md:text-lg font-medium hover:text-blue-700 transition-colors">
          Lessons
        </Link>
        <Link href="/announcements/1" className="text-blue-900 text-base md:text-lg font-medium hover:text-blue-700 transition-colors">
          Announcements
        </Link>
        <Link href="/donations/" className="text-blue-900 text-base md:text-lg font-medium hover:text-blue-700 transition-colors">
          Donations
        </Link>
        {isLoggedIn && (
          <Link href="/admin/lessons/1" className="text-yellow-600 text-base md:text-lg font-medium hover:text-blue-700 transition-colors">
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
