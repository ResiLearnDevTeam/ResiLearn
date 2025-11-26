'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on all learn pages (we use LeftSidebar instead)
  const hideNavbar = pathname?.startsWith('/learn');

  if (hideNavbar) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 transition-all duration-300"
            >
              ResiLearn
            </Link>
            <div className="hidden gap-8 lg:flex">
              <Link
                href="/learn/self/learningpath"
                className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group"
              >
                หลักสูตร
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group"
              >
                เกี่ยวกับเรา
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group"
              >
                บทความ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group"
              >
                ติดต่อเรา
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-lg border-2 border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:border-orange-200 hover:text-orange-600 transition-all duration-300"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              ลงทะเบียนฟรี
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/learn/self/learningpath"
              className="block text-base font-semibold text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              หลักสูตร
            </Link>
            <Link
              href="#"
              className="block text-base font-semibold text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              เกี่ยวกับเรา
            </Link>
            <Link
              href="#"
              className="block text-base font-semibold text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              บทความ
            </Link>
            <Link
              href="#"
              className="block text-base font-semibold text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ติดต่อเรา
            </Link>
            <div className="pt-4 border-t border-orange-200/20 space-y-3">
              <Link
                href="/login"
                className="block rounded-lg border-2 border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 hover:border-orange-200 hover:text-orange-600 transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="block rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-base font-semibold text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                ลงทะเบียนฟรี
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
