'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Resistor3DModel from '@/components/features/Resistor3DModel';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* 3D Resistor Model */}
      <Resistor3DModel />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-20 pt-32">
        <div 
          className={`mx-auto max-w-6xl w-full text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Main Heading */}
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl lg:text-8xl">
            <span className="block bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 bg-clip-text text-transparent">
              Master the Art
            </span>
            <span className="block text-gray-900 mt-2">of Reading Resistors</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-12 max-w-3xl text-xl text-gray-600 md:text-2xl leading-relaxed">
            Progressive learning system designed to help you master resistor color codes 
            through interactive exercises and real-world practice.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/learn"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-2xl shadow-orange-500/50 hover:shadow-orange-600/60 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Learning
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 rounded-xl border-2 border-orange-300 bg-white hover:bg-orange-50 hover:border-orange-400 shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Create Account
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 mb-16">
            <div className="group relative p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Progressive Learning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Start with the basics and gradually advance to complex resistor reading scenarios.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your improvement with detailed analytics and performance metrics.
                </p>
              </div>
            </div>

            <div className="group relative p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 hover:border-orange-300 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Interactive Practice</h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn through hands-on exercises and real-world resistor reading challenges.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="relative mt-24 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 shadow-2xl shadow-orange-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">1000+</div>
                <div className="text-orange-100 font-semibold">Students Enrolled</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">50+</div>
                <div className="text-orange-100 font-semibold">Practice Exercises</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">95%</div>
                <div className="text-orange-100 font-semibold">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" opacity="0.1"/>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f97316"/>
              <stop offset="1" stopColor="#ea580c"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
