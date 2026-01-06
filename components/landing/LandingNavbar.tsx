'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function LandingNavbar() {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            ResiLearn
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              หน้าแรก
            </Link>
            <Link 
              href="/learn/self/learningpath" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              หลักสูตร
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              บทความ
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              ติดต่อเรา
            </Link>
          </div>

          {/* CTA Button */}
          <Link
            href="/register"
            className="hidden sm:block px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
          >
            {t('createAccount')}
          </Link>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

