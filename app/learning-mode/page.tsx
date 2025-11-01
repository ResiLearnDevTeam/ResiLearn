'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LearningModePage() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/learning-mode')}`);
    } else if (status === 'authenticated') {
      setIsVisible(true);
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Choose Your Learning Path
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Select how you want to learn resistor color codes
          </p>
        </div>

        {/* Learning Mode Options */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Self Practice Mode */}
            <Link
              href="/learn/self"
              className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="absolute inset-[2px] rounded-3xl bg-white"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 transition-transform duration-300 group-hover:scale-110">
                  <svg className="h-10 w-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="mb-3 text-2xl font-bold text-gray-900">Self Practice</h2>

                {/* Description */}
                <p className="mb-6 text-gray-600 leading-relaxed">
                  Learn at your own pace with guided exercises and unlimited practice. Perfect for mastering resistor reading independently.
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="mr-2 h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Learn at your own pace
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="mr-2 h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited practice exercises
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="mr-2 h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Track your progress
                  </li>
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <span className="inline-flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Start Practicing
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>

            {/* Classroom Mode */}
            <Link
              href="/learn/classroom"
              className={`group relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="absolute inset-[2px] rounded-3xl bg-white"></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 transition-transform duration-300 group-hover:scale-110">
                  <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="mb-3 text-2xl font-bold text-gray-900">Classroom Learning</h2>

                {/* Description */}
                <p className="mb-6 text-gray-600 leading-relaxed">
                  Join a structured course with assignments, quizzes, and teacher guidance. Integrates with Google Classroom.
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Structured curriculum
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Teacher guidance and feedback
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Google Classroom integration
                  </li>
                </ul>

                {/* CTA */}
                <div className="mt-8">
                  <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Join Classroom
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 transition-colors duration-300"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

