'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PracticePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch('/api/practice-sessions?limit=5');
      if (response.ok) {
        const data = await response.json();
        setRecentSessions(data || []);
      }
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Practice Mode</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Choose your practice style - Basic for quick practice or Custom for personalized training
            </p>
          </div>

          {/* Practice Options */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Quick Practice */}
            <div
              className={`transform rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Practice</h2>
                  <p className="text-sm sm:text-base text-gray-600">Get started immediately</p>
                </div>
              </div>

              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700">
                Jump into practice with default settings. Perfect for quick drills and warm-ups.
              </p>

              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>4-band resistors</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>4 multiple choice options</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No time limits</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited questions</span>
                </div>
              </div>

              <Link
                href="/learn/self/practice/quick/select"
                className="block w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
              >
                Start Quick Practice
              </Link>
            </div>

            {/* Custom Practice */}
            <div
              className={`transform rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Custom Practice</h2>
                  <p className="text-sm sm:text-base text-gray-600">Configure your training</p>
                </div>
              </div>

              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700">
                Customize every aspect of your practice session for targeted learning.
              </p>

              <div className="mb-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Choose 4-band or 5-band resistors</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>2, 3, or 4 multiple choice options</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Set countdown timer per question</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Fixed or unlimited questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save your favorite presets</span>
                </div>
              </div>

              <Link
                href="/learn/self/practice/custom"
                className="block w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
              >
                Configure Custom Practice
              </Link>
            </div>
          </div>

          {/* Recent Practice Sessions */}
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Recent Practice Sessions</h2>
            
            {isLoadingSessions ? (
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
                </div>
              </div>
            ) : recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.map((session) => {
                  const settings = session.settings as any || {};
                  const resistorType = session.preset?.resistorType || settings.resistorType || 'FOUR_BAND';
                  const answerType = settings.answerType || 'multiple_choice';
                  const difficulty = settings.difficulty || 'medium';
                  
                  return (
                    <Link
                      key={session.id}
                      href={`/learn/self/practice/sessions/${session.id}`}
                      className="block rounded-xl bg-white p-4 sm:p-6 shadow-lg transition-all hover:shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">{session.presetName || 'Quick Practice'}</h3>
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                              {resistorType === 'FOUR_BAND' ? '4-Band' : '5-Band'}
                            </span>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              {answerType === 'multiple_choice' ? 'Multiple Choice' : 'Fill in'}
                            </span>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              difficulty === 'medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(session.completedAt)}</p>
                        </div>
                        
                        <div className="flex gap-4 sm:gap-6">
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-600">{session.correctAnswers}/{session.totalQuestions}</div>
                            <div className="text-xs text-gray-600">Correct</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{Math.round(session.accuracy)}%</div>
                            <div className="text-xs text-gray-600">Accuracy</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg sm:text-2xl font-bold text-purple-600">{formatTime(session.totalTime)}</div>
                            <div className="text-xs text-gray-600">Time</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <p className="text-center text-gray-600">No practice sessions yet. Start your first practice!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

