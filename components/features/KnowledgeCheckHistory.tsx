'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, Printer, Check } from 'lucide-react';

interface ModuleResult {
  id: string;
  name: string;
  score: number;
  achievementLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastered';
}

interface KnowledgeCheckHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KnowledgeCheckHistory({ isOpen, onClose }: KnowledgeCheckHistoryProps) {
  const { data: session } = useSession();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchKnowledgeCheckData();
    }
  }, [isOpen]);

  const fetchKnowledgeCheckData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/attempts?mode=QUIZ');
      if (response.ok) {
        const data = await response.json();
        setAttempts(data || []);
      }
    } catch (error) {
      console.error('Error fetching knowledge check data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const userName = session?.user?.name || 'User';

  // Calculate module results from attempts
  const moduleResults: ModuleResult[] = attempts.reduce((acc: ModuleResult[], attempt: any) => {
    const moduleName = attempt.level?.name || `Level ${attempt.level?.number || ''}`;
    const existing = acc.find(m => m.name === moduleName);
    
    if (existing) {
      // Keep the best score
      if (attempt.percentage > existing.score) {
        existing.score = Math.round(attempt.percentage);
        existing.achievementLevel = getAchievementLevel(attempt.percentage);
      }
    } else {
      acc.push({
        id: attempt.level?.id || attempt.id,
        name: moduleName,
        score: Math.round(attempt.percentage),
        achievementLevel: getAchievementLevel(attempt.percentage),
      });
    }
    
    return acc;
  }, []);

  const getAchievementLevel = (score: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastered' => {
    if (score >= 90) return 'Mastered';
    if (score >= 80) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    return 'Beginner';
  };

  const getAchievementColor = (level: string) => {
    switch (level) {
      case 'Mastered':
        return 'bg-green-500';
      case 'Advanced':
        return 'bg-cyan-500';
      case 'Intermediate':
        return 'bg-yellow-500';
      case 'Beginner':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAchievementTextColor = (level: string) => {
    switch (level) {
      case 'Mastered':
        return 'text-green-700';
      case 'Advanced':
        return 'text-cyan-700';
      case 'Intermediate':
        return 'text-yellow-700';
      case 'Beginner':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  // Calculate total score (average of all module scores)
  const totalScore = moduleResults.length > 0
    ? Math.round(moduleResults.reduce((sum, m) => sum + m.score, 0) / moduleResults.length)
    : 0;

  const overallAchievementLevel = getAchievementLevel(totalScore);

  // Get latest completion date
  const latestCompletionDate = attempts.length > 0
    ? new Date(attempts[0].completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

  // Filter modules
  const filteredModules = selectedModule === 'all'
    ? moduleResults
    : moduleResults.filter(m => m.achievementLevel === selectedModule);

  // Calculate progress percentage for circular indicator
  const progressPercentage = totalScore;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">My Knowledge Check History</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              title="Print"
            >
              <Printer className="h-4 w-4" />
              <span className="text-sm font-medium">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Summary and Module Breakdown */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Learner Name:</span>
                    <span className="text-sm font-semibold text-gray-900">{userName || 'User'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Total Score:</span>
                    <span className="text-lg font-bold text-orange-600">{totalScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Completed On:</span>
                    <span className="text-sm font-semibold text-gray-900">{latestCompletionDate}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-gray-600">Filter Modules:</span>
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="all">All Modules</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Mastered">Mastered</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Module Details Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">MODULE</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SCORE</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ACHIEVEMENT LEVEL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-orange-600 border-r-transparent"></div>
                          </td>
                        </tr>
                      ) : filteredModules.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                            No knowledge check results found
                          </td>
                        </tr>
                      ) : (
                        filteredModules.map((module) => (
                          <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-900">{module.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
                                  <div
                                    className={`h-full ${getAchievementColor(module.achievementLevel)} rounded-full transition-all duration-500`}
                                    style={{ width: `${module.score}%` }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-gray-900 min-w-[2.5rem] text-right">
                                  {module.score}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-semibold ${getAchievementTextColor(module.achievementLevel)}`}>
                                {module.achievementLevel}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Panel - Knowledge Check Result Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-300 p-6 shadow-lg">
                <div className="text-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">My Knowledge Check Result</h3>
                  <p className="text-xs text-gray-600">For Resistor Learning</p>
                  <p className="text-xs text-gray-600">{latestCompletionDate}</p>
                </div>

                {/* Circular Progress Indicator */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                      className={`transition-all duration-500 ${getAchievementColor(overallAchievementLevel)}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-gray-900">{totalScore}</div>
                    <div className="text-sm text-gray-600 mt-1 font-medium">Total Score</div>
                  </div>
                </div>

                {/* Achievement Level */}
                <div className="text-center mb-6">
                  <div className={`inline-block px-4 py-2 rounded-lg ${getAchievementColor(overallAchievementLevel)} text-white font-bold text-base`}>
                    {overallAchievementLevel.toUpperCase()} LEARNER
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">Achievement Levels:</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded bg-red-500 flex-shrink-0"></div>
                    <span className="text-gray-700">Beginner (&lt;60)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded bg-yellow-500 flex-shrink-0"></div>
                    <span className="text-gray-700">Intermediate (≥60)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded bg-cyan-500 flex-shrink-0"></div>
                    <span className="text-gray-700">Advanced (≥80)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded bg-green-500 flex-shrink-0"></div>
                    <span className="text-gray-700">Mastered (≥90)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

