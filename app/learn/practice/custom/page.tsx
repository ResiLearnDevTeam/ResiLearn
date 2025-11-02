'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CustomPracticePage() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    resistorType: 'FOUR_BAND' as 'FOUR_BAND' | 'FIVE_BAND',
    optionCount: 4,
    countdownTime: null as number | null,
    hasCountdown: false,
    totalQuestions: null as number | null,
    hasQuestionLimit: true,
    questionLimit: 10,
    hasTimeLimit: false,
    timeLimit: null as number | null,
  });

  const handleStartPractice = () => {
    const queryParams = new URLSearchParams({
      type: settings.resistorType,
      options: settings.optionCount.toString(),
      questions: settings.hasQuestionLimit ? settings.questionLimit!.toString() : 'unlimited',
      ...(settings.hasCountdown && settings.countdownTime && { countdown: settings.countdownTime.toString() }),
      ...(settings.hasTimeLimit && settings.timeLimit && { limit: settings.timeLimit.toString() }),
    });
    
    router.push(`/learn/practice/custom/start?${queryParams.toString()}`);
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
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Custom Practice</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Configure your practice session to match your learning goals
            </p>
          </div>

          {/* Configuration Form */}
          <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl">
            {/* Resistor Type */}
            <div className="mb-6 sm:mb-8">
              <label className="mb-3 block text-base sm:text-lg font-semibold text-gray-900">
                1. Resistor Type
              </label>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <button
                  onClick={() => setSettings({ ...settings, resistorType: 'FOUR_BAND' })}
                  className={`rounded-lg sm:rounded-xl border-2 p-4 sm:p-6 text-left transition-all ${
                    settings.resistorType === 'FOUR_BAND'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.resistorType === 'FOUR_BAND' ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">4-Band Resistors</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Standard resistor color code (2 digits + multiplier + tolerance)
                  </p>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, resistorType: 'FIVE_BAND' })}
                  className={`rounded-lg sm:rounded-xl border-2 p-4 sm:p-6 text-left transition-all ${
                    settings.resistorType === 'FIVE_BAND'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.resistorType === 'FIVE_BAND' ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">5-Band Resistors</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Precision resistors (3 digits + multiplier + tolerance)
                  </p>
                </button>
              </div>
            </div>

            {/* Option Count */}
            <div className="mb-6 sm:mb-8">
              <label className="mb-3 block text-base sm:text-lg font-semibold text-gray-900">
                2. Multiple Choice Options
              </label>
              <div className="grid gap-3 sm:gap-4 grid-cols-3">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setSettings({ ...settings, optionCount: count })}
                    className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 text-center text-sm sm:text-base transition-all ${
                      settings.optionCount === count
                        ? 'border-orange-500 bg-orange-50 font-bold text-orange-700'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    {count} Options
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                More options = harder difficulty
              </p>
            </div>

            {/* Question Limit */}
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  3. Number of Questions
                </label>
                <button
                  onClick={() => setSettings({ ...settings, hasQuestionLimit: !settings.hasQuestionLimit })}
                  className={`relative h-8 w-16 rounded-full transition-colors ${
                    settings.hasQuestionLimit ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.hasQuestionLimit ? 'translate-x-8' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              {settings.hasQuestionLimit && (
                <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-4">
                    {[5, 10, 20, 50].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSettings({ ...settings, questionLimit: count })}
                        className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 text-center text-sm sm:text-base transition-all ${
                          settings.questionLimit === count
                            ? 'border-orange-500 bg-orange-50 font-bold text-orange-700'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {!settings.hasQuestionLimit && (
                <div className="rounded-lg sm:rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-3 sm:p-4 text-center">
                  <p className="text-sm sm:text-base font-semibold text-orange-700">Unlimited Practice Mode</p>
                  <p className="text-xs sm:text-sm text-orange-600">Practice as long as you want!</p>
                </div>
              )}
            </div>

            {/* Countdown Timer */}
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  4. Countdown Timer (Optional)
                </label>
                <button
                  onClick={() => {
                    if (settings.hasTimeLimit) {
                      setSettings({ ...settings, hasTimeLimit: false, timeLimit: null, hasCountdown: true, countdownTime: 30 });
                    } else {
                      setSettings({ ...settings, hasCountdown: !settings.hasCountdown, countdownTime: settings.hasCountdown ? null : 30 });
                    }
                  }}
                  className={`relative h-8 w-16 rounded-full transition-colors ${
                    settings.hasCountdown ? 'bg-orange-600' : 'bg-gray-300'
                  } ${settings.hasTimeLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={settings.hasTimeLimit}
                >
                  <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.hasCountdown ? 'translate-x-8' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              {settings.hasTimeLimit && (
                <div className="mb-2 rounded-lg bg-yellow-50 border border-yellow-200 p-2">
                  <p className="text-xs sm:text-sm text-yellow-700">⚠️ Cannot use both countdown timer and total time limit</p>
                </div>
              )}
              
              {settings.hasCountdown && (
                <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <div className="mb-3">
                    <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
                      Seconds per question
                    </label>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={settings.countdownTime || 30}
                        onChange={(e) => setSettings({ ...settings, countdownTime: parseInt(e.target.value) })}
                        className="flex-1"
                      />
                      <div className="w-14 sm:w-16 rounded-lg bg-orange-100 px-2 py-2 sm:px-3 text-center text-base sm:text-lg font-bold text-orange-700">
                        {settings.countdownTime}s
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Time Limit */}
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  5. Total Time Limit (Optional)
                </label>
                <button
                  onClick={() => {
                    if (settings.hasCountdown) {
                      setSettings({ ...settings, hasCountdown: false, countdownTime: null, hasTimeLimit: true, timeLimit: 600 });
                    } else {
                      setSettings({ ...settings, hasTimeLimit: !settings.hasTimeLimit, timeLimit: settings.hasTimeLimit ? null : 600 });
                    }
                  }}
                  className={`relative h-8 w-16 rounded-full transition-colors ${
                    settings.hasTimeLimit ? 'bg-orange-600' : 'bg-gray-300'
                  } ${settings.hasCountdown ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={settings.hasCountdown}
                >
                  <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.hasTimeLimit ? 'translate-x-8' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              {settings.hasCountdown && (
                <div className="mb-2 rounded-lg bg-yellow-50 border border-yellow-200 p-2">
                  <p className="text-xs sm:text-sm text-yellow-700">⚠️ Cannot use both countdown timer and total time limit</p>
                </div>
              )}
              
              {settings.hasTimeLimit && (
                <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-4">
                    {[
                      { minutes: 5, seconds: 300 },
                      { minutes: 10, seconds: 600 },
                      { minutes: 20, seconds: 1200 },
                      { minutes: 30, seconds: 1800 }
                    ].map((time) => (
                      <button
                        key={time.seconds}
                        onClick={() => setSettings({ ...settings, timeLimit: time.seconds })}
                        className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 text-center text-sm sm:text-base transition-all ${
                          settings.timeLimit === time.seconds
                            ? 'border-orange-500 bg-orange-50 font-bold text-orange-700'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        {time.minutes} Min
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6">
              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-gray-900">Practice Summary</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Type:</strong> {settings.resistorType === 'FOUR_BAND' ? '4-Band' : '5-Band'} Resistors</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Options:</strong> {settings.optionCount} multiple choice answers</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Countdown:</strong> {settings.hasCountdown ? `${settings.countdownTime} seconds per question` : 'None'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Questions:</strong> {settings.hasQuestionLimit ? settings.questionLimit : 'Unlimited'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>Time Limit:</strong> {settings.hasTimeLimit && settings.timeLimit ? `${settings.timeLimit / 60} minutes total` : 'None'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleStartPractice}
                className="flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
              >
                Start Custom Practice
              </button>
              <Link
                href="/learn/practice"
                className="rounded-lg sm:rounded-xl border-2 border-gray-300 bg-white px-6 py-3 sm:px-8 sm:py-4 text-center text-sm sm:text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
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

