'use client';

import Link from 'next/link';

export default function ClassroomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
              Classroom Learning Mode
            </h1>
            <p className="text-xl text-gray-600">
              Join structured courses with teacher guidance
            </p>
          </div>

          {/* Content Placeholder */}
          <div className="rounded-2xl bg-white p-12 shadow-xl text-center">
            <div className="mb-6">
              <svg className="mx-auto h-24 w-24 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Classroom Mode
            </h2>
            <p className="mb-8 text-gray-600">
              This page is coming soon. You will be able to join structured courses, complete assignments, and receive feedback from teachers with Google Classroom integration.
            </p>
            
            <Link
              href="/learning-mode"
              className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
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

