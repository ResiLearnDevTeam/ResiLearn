'use client';

import { useState } from 'react';
import Link from 'next/link';
import ImagePlaceholder from './ImagePlaceholder';
import { useTranslation } from '@/lib/i18n';
import { BookOpen, Users } from 'lucide-react';

export default function HeroSection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    if (email) {
      // Redirect to register or handle subscription
      window.location.href = '/register';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-300/20 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t('heroTitle1')}{' '}
                <span className="text-orange-600">{t('heroTitle2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                {t('heroSubtitle')}
              </p>
            </div>

            {/* Email Input & CTA */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('enterEmail')}
                className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                {t('getStarted')}
              </button>
            </form>
          </div>

          {/* Right Image */}
          <div className="relative">
            {/* Main Hero Image Placeholder */}
            <div className="relative">
              <ImagePlaceholder
                aspectRatio="aspect-[4/5]"
                description="Hero Image"
                className="rounded-2xl shadow-2xl"
              />
              
              {/* Overlay Stat Card - Top Left */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">200+</p>
                    <p className="text-sm text-gray-600">หลักสูตร</p>
                  </div>
                </div>
              </div>

              {/* Overlay Badge - Top Right */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg hidden md:block">
                <div className="text-center">
                  <p className="text-xs font-semibold text-white">Online</p>
                  <p className="text-xs font-semibold text-white">Education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

