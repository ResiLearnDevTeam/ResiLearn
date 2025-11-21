'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect } from 'react';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ActivityChart from '@/components/dashboard/ActivityChart';
import RecentActivityList from '@/components/dashboard/RecentActivityList';

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
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
    <div className="flex min-h-screen bg-gray-50">
      <LeftSidebar />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-8 lg:px-8">
          <WelcomeHeader />

          <div className="space-y-8">
            <StatsOverview stats={stats} />

            <div className="grid gap-8 lg:grid-cols-2">
              <ActivityChart data={stats.recentAttempts} />
              <RecentActivityList attempts={stats.recentAttempts} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

