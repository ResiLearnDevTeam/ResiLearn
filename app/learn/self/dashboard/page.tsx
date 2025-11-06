'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    levelsCompleted: 0,
    totalLevels: 0,
    overallProgress: 0,
    totalPracticeTime: 0,
    recentAttempts: [] as any[]
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch levels
      const levelsResponse = await fetch('/api/levels');
      const levels = levelsResponse.ok ? await levelsResponse.json() : [];
      
      // Fetch quiz attempts
      const attemptsResponse = await fetch('/api/attempts?mode=QUIZ');
      const attempts = attemptsResponse.ok ? await attemptsResponse.json() : [];
      
      // Fetch practice sessions
      const sessionsResponse = await fetch('/api/practice-sessions?limit=5');
      const sessions = sessionsResponse.ok ? await sessionsResponse.json() : [];

      // Calculate stats
      const completedLevels = new Set(
        attempts.filter((a: any) => a.passed && a.mode === 'QUIZ')
          .map((a: any) => a.level.number)
      );
      
      const totalTime = attempts.reduce((sum: number, a: any) => sum + (a.timeTaken || 0), 0);
      
      setStats({
        levelsCompleted: completedLevels.size,
        totalLevels: levels.length,
        overallProgress: levels.length > 0 ? Math.round((completedLevels.size / levels.length) * 100) : 0,
        totalPracticeTime: Math.floor(totalTime / 3600), // Convert to hours
        recentAttempts: attempts.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar />
      
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Track your learning progress and performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mb-6 sm:mb-8 grid gap-4 sm:gap-6 md:grid-cols-3">
            {/* Levels Completed */}
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border-2 border-green-100">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-700">Levels Completed</h2>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-green-700">
                {stats.levelsCompleted}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                of {stats.totalLevels} levels
              </p>
            </div>

            {/* Overall Progress */}
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border-2 border-orange-100">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-700">Overall Progress</h2>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-orange-600">
                {stats.overallProgress}%
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${stats.overallProgress}%` }}
                />
              </div>
            </div>

            {/* Total Practice Time */}
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border-2 border-blue-100">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-700">Practice Time</h2>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                {stats.totalPracticeTime}h
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Total time spent
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Recent Quiz Attempts</h2>
            {stats.recentAttempts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAttempts.map((attempt: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-lg border-2 p-4 ${
                      attempt.passed
                        ? 'border-green-100 bg-green-50'
                        : 'border-red-100 bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        attempt.passed ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {attempt.passed ? (
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {attempt.level.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(attempt.completedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        attempt.passed ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {Math.round(attempt.percentage)}%
                      </p>
                      <p className="text-xs text-gray-600">
                        {attempt.score} / {attempt.level.questionCount} correct
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <svg className="mx-auto mb-4 h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600">No quiz attempts yet</p>
                <p className="text-sm text-gray-500 mt-1">Complete your first quiz to see your progress here!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

