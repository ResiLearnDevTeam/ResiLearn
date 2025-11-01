'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLanguageStore } from '@/store/languageStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const language = useLanguageStore((state) => state.language);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-orange-200/20 bg-white/80 backdrop-blur-md shadow-sm">
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
                href="/learn"
                className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group"
              >
                Learning Path
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300 relative group"
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex gap-1 mr-2">
              <button
                onClick={() => useLanguageStore.getState().setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  language === 'en'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => useLanguageStore.getState().setLanguage('th')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  language === 'th'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                }`}
              >
                TH
              </button>
            </div>
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Sign Up
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
        <div className="lg:hidden border-t border-orange-200/20 bg-white/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/learn"
              className="block text-base font-semibold text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Learning Path
            </Link>
            <Link
              href="/dashboard"
              className="block text-base font-semibold text-gray-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <div className="pt-4 border-t border-orange-200/20 space-y-3">
              {/* Language Switcher */}
              <div className="flex gap-2 pb-2">
                <button
                  onClick={() => {
                    useLanguageStore.getState().setLanguage('en');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => {
                    useLanguageStore.getState().setLanguage('th');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    language === 'th'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  TH
                </button>
              </div>
              <Link
                href="/login"
                className="block text-base font-semibold text-gray-700 hover:text-orange-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-base font-semibold text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
