'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectResistorTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'FOUR_BAND' | 'FIVE_BAND'>('FOUR_BAND');
  const [isVisible, setIsVisible] = useState(false);

  useState(() => {
    setIsVisible(true);
  });

  const handleStartPractice = () => {
    router.push(`/learn/practice/quick?type=${selectedType}`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link href="/learn/practice" className="text-orange-600 hover:text-orange-700 mb-3 sm:mb-4 inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Practice
            </Link>
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Quick Practice</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Select the resistor type you want to practice
            </p>
          </div>

          {/* Resistor Type Selection */}
          <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl">
            <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
              Choose Resistor Type
            </label>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <button
                onClick={() => setSelectedType('FOUR_BAND')}
                className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                  selectedType === 'FOUR_BAND'
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    selectedType === 'FOUR_BAND' ? 'bg-orange-600' : 'bg-gray-100'
                  }`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">4-Band Resistors</h3>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  Standard resistor color code. Perfect for beginners.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>2 digits</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>1 multiplier band</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>1 tolerance band</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('FIVE_BAND')}
                className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                  selectedType === 'FIVE_BAND'
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    selectedType === 'FIVE_BAND' ? 'bg-orange-600' : 'bg-gray-100'
                  }`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">5-Band Resistors</h3>
                </div>
                <p className="mb-4 text-sm text-gray-600">
                  Precision resistors with higher accuracy. For advanced learners.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>3 digits</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>1 multiplier band</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-700">
                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>1 tolerance band</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Start Button */}
            <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
              <button
                onClick={handleStartPractice}
                className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
              >
                Start Practice
              </button>
              <Link
                href="/learn/practice"
                className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 sm:px-8 sm:py-4 text-center text-sm sm:text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

