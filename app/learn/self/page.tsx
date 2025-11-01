'use client';

import Link from 'next/link';

export default function SelfPracticePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
              Self Practice Mode
            </h1>
            <p className="text-xl text-gray-600">
              Master resistor color codes at your own pace
            </p>
          </div>

          {/* Content Placeholder */}
          <div className="rounded-2xl bg-white p-12 shadow-xl text-center">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Self Practice Mode
            </h2>
            <p className="mb-8 text-gray-600">
              This page is coming soon. You will be able to practice resistor reading with unlimited exercises and track your progress.
            </p>
            
            <Link
              href="/learning-mode"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Learning Modes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

