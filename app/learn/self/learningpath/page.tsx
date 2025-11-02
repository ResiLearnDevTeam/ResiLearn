'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LeftSidebar from '@/components/layout/LeftSidebar';

export default function SelfPracticePage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [bestScores, setBestScores] = useState<Map<number, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLevels();
    fetchUserProgress();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/levels');
      if (response.ok) {
        const data = await response.json();
        setLevels(data);
      }
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch('/api/attempts?mode=QUIZ');
      if (response.ok) {
        const data = await response.json();
        const passed = new Set<number>();
        const scores = new Map<number, number>();
        
        data.forEach((attempt: any) => {
          const levelNum = attempt.level.number;
          if (attempt.passed && attempt.mode === 'QUIZ') {
            passed.add(levelNum);
          }
          if (attempt.percentage) {
            const currentBest = scores.get(levelNum) || 0;
            if (attempt.percentage > currentBest) {
              scores.set(levelNum, attempt.percentage);
            }
          }
        });
        
        setCompletedLevels(passed);
        setBestScores(scores);
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const isLevelUnlocked = (level: any): boolean => {
    if (!level.requiresLevel) return true; // Level 1 is always unlocked
    return completedLevels.has(level.requiresLevel);
  };

  const getLevelStatus = (level: any): string => {
    if (completedLevels.has(level.number)) return 'completed';
    if (isLevelUnlocked(level)) return 'unlocked';
    return 'locked';
  };

  const totalLevels = levels.length;
  const completedCount = completedLevels.size;
  const overallProgress = totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
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
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-12 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-extrabold text-gray-900">Learning Path</h1>
            <p className="text-xl text-gray-600">Master resistor reading through progressive levels</p>
          </div>

          {/* Progress Overview */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
                <span className="text-sm font-semibold text-orange-600">{overallProgress}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalLevels - completedCount}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalLevels}</div>
                <div className="text-sm text-gray-600">Total Levels</div>
              </div>
            </div>
          </div>

          {/* Levels Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {levels.map((level) => (
              <LevelCard 
                key={level.id} 
                level={level}
                status={getLevelStatus(level)}
                bestScore={bestScores.get(level.number)}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function LevelCard({ level, status, bestScore }: { level: any; status: string; bestScore?: number }) {
  const practicePath = `/learn/self/levels/${level.number}/practice`;
  const quizPath = `/learn/self/levels/${level.number}/quiz`;
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'unlocked':
        return 'border-orange-500 bg-orange-50';
      case 'locked':
        return 'border-gray-300 bg-gray-50 opacity-60';
      default:
        return 'border-orange-500 bg-orange-50';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = [
      'bg-green-100 text-green-700',
      'bg-blue-100 text-blue-700',
      'bg-yellow-100 text-yellow-700',
      'bg-orange-100 text-orange-700',
      'bg-red-100 text-red-700',
    ];
    return colors[difficulty - 1] || colors[0];
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${getStatusColor(status)} ${status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}`}>
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {status === 'completed' && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {status === 'unlocked' && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        )}
        {status === 'locked' && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl font-bold text-gray-900">
            {level.number}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{level.name}</h3>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-1 text-xs font-semibold ${getDifficultyColor(level.difficulty)}`}>
                Level {level.difficulty}
              </span>
              <span className="text-xs text-gray-500">{level.type.replace('_', '-')}</span>
            </div>
          </div>
        </div>

        <p className="mb-4 text-gray-600">{level.description}</p>

        {/* Stats */}
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Questions</span>
            <span className="font-semibold text-gray-900">{level.questionCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Time Limit</span>
            <span className="font-semibold text-gray-900">{level.timeLimit} min</span>
          </div>
          {status === 'completed' && bestScore && bestScore > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Best Score</span>
              <span className="font-bold text-green-700">{Math.round(bestScore)}%</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {status !== 'locked' && (
            <>
              <Link
                href={practicePath}
                className="flex-1 rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Practice
              </Link>
              <Link
                href={quizPath}
                className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-center text-sm font-semibold text-white hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                Take Quiz
              </Link>
            </>
          )}
          {status === 'locked' && (
            <div className="w-full rounded-lg bg-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-600">
              Complete Level {level.requiresLevel} to unlock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
