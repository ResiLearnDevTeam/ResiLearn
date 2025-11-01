'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';

// Mock data for levels
const levels = [
  {
    id: 1,
    number: 1,
    name: 'Basic Colors',
    description: 'Introduction to resistor colors and basic color recognition',
    difficulty: 1,
    questionCount: 10,
    timeLimit: 10,
    passScore: 80,
    type: 'FOUR_BAND',
    status: 'completed', // 'locked' | 'unlocked' | 'completed'
    bestScore: 95,
    attempts: 3,
  },
  {
    id: 2,
    number: 2,
    name: '4-Band Basics',
    description: 'Understanding 4-band structure and basic calculations',
    difficulty: 1,
    questionCount: 10,
    timeLimit: 10,
    passScore: 80,
    type: 'FOUR_BAND',
    status: 'completed',
    bestScore: 88,
    attempts: 2,
  },
  {
    id: 3,
    number: 3,
    name: '4-Band Practice',
    description: 'Practice with common values and random combinations',
    difficulty: 2,
    questionCount: 15,
    timeLimit: 15,
    passScore: 80,
    type: 'FOUR_BAND',
    status: 'in_progress',
    bestScore: 0,
    attempts: 1,
  },
  {
    id: 4,
    number: 4,
    name: '5-Band Basics',
    description: 'Understanding 5-band structure and differences',
    difficulty: 2,
    questionCount: 15,
    timeLimit: 15,
    passScore: 80,
    type: 'FIVE_BAND',
    status: 'locked',
    bestScore: 0,
    attempts: 0,
  },
  {
    id: 5,
    number: 5,
    name: '5-Band Practice',
    description: 'Practice with 5-band resistors',
    difficulty: 3,
    questionCount: 15,
    timeLimit: 20,
    passScore: 80,
    type: 'FIVE_BAND',
    status: 'locked',
    bestScore: 0,
    attempts: 0,
  },
  {
    id: 6,
    number: 6,
    name: 'Mixed Practice',
    description: 'Random 4-band or 5-band challenges',
    difficulty: 3,
    questionCount: 20,
    timeLimit: 25,
    passScore: 80,
    type: 'MIXED',
    status: 'locked',
    bestScore: 0,
    attempts: 0,
  },
  {
    id: 7,
    number: 7,
    name: 'Expert Mode',
    description: 'All possible combinations with time pressure',
    difficulty: 5,
    questionCount: 25,
    timeLimit: 30,
    passScore: 80,
    type: 'MIXED',
    status: 'locked',
    bestScore: 0,
    attempts: 0,
  },
];

export default function SelfPracticePage() {
  const totalLevels = 7;
  const completedLevels = levels.filter(level => level.status === 'completed').length;
  const overallProgress = Math.round((completedLevels / totalLevels) * 100);

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
                <div className="text-2xl font-bold text-gray-900">{completedLevels}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalLevels - completedLevels}</div>
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
              <LevelCard key={level.id} level={level} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function LevelCard({ level }: { level: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'in_progress':
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
    <div className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${getStatusColor(level.status)} ${level.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'}`}>
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {level.status === 'completed' && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        {level.status === 'in_progress' && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        )}
        {level.status === 'locked' && (
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
          {level.status === 'completed' && level.bestScore > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Best Score</span>
              <span className="font-bold text-green-700">{level.bestScore}%</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {level.status !== 'locked' && (
            <>
              <button className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                Practice
              </button>
              <button className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white hover:from-orange-600 hover:to-orange-700 transition-all">
                Take Quiz
              </button>
            </>
          )}
          {level.status === 'locked' && (
            <div className="w-full rounded-lg bg-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-600">
              Complete Level {level.number - 1} to unlock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
