'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { X, Printer, Check, TrendingUp, Clock, Target, AlertCircle } from 'lucide-react';

interface ModuleResult {
  id: string;
  name: string;
  score: number;
  achievementLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastered';
  quizProgress?: {
    answered: number;
    total: number;
  };
  readingProgress?: {
    read: number;
    total: number;
  };
  lessons?: any[];
}

interface KnowledgeCheckHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KnowledgeCheckHistory({ isOpen, onClose }: KnowledgeCheckHistoryProps) {
  const { data: session } = useSession();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [practiceSessions, setPracticeSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'lessons' | 'practice'>('practice');

  useEffect(() => {
    if (isOpen) {
      fetchKnowledgeCheckData();
      fetchPracticeSessions();
    }
  }, [isOpen]);

  const fetchKnowledgeCheckData = async () => {
    try {
      setIsLoading(true);
      // Fetch modules with lessons and progress
      const modulesResponse = await fetch('/api/modules');
      if (modulesResponse.ok) {
        const modules = await modulesResponse.json();
        
        // Fetch lesson details with quiz questions for each lesson
        const lessonsWithProgress = await Promise.all(
          modules.flatMap((module: any) => 
            module.lessons.map(async (lesson: any) => {
              try {
                const lessonResponse = await fetch(`/api/lessons/${lesson.id}`);
                if (lessonResponse.ok) {
                  const lessonData = await lessonResponse.json();
                  return {
                    ...lesson,
                    ...lessonData,
                    moduleTitle: module.title,
                    completed: lesson.completed || false,
                  };
                }
                return { ...lesson, moduleTitle: module.title, completed: lesson.completed || false };
              } catch (error) {
                return { ...lesson, moduleTitle: module.title, completed: lesson.completed || false };
              }
            })
          )
        );
        
        setAttempts(lessonsWithProgress);
      }
    } catch (error) {
      console.error('Error fetching knowledge check data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPracticeSessions = async () => {
    try {
      const response = await fetch('/api/practice-sessions?limit=20');
      if (response.ok) {
        const data = await response.json();
        setPracticeSessions(data || []);
      }
    } catch (error) {
      console.error('Error fetching practice sessions:', error);
    }
  };

  const userName = session?.user?.name || 'ผู้เรียน';

  // Helper functions
  const getAchievementLevel = (score: number): 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastered' => {
    if (score >= 90) return 'Mastered';
    if (score >= 80) return 'Advanced';
    if (score >= 60) return 'Intermediate';
    return 'Beginner';
  };

  const getAchievementLevelThai = (level: string): string => {
    switch (level) {
      case 'Mastered':
        return 'เชี่ยวชาญ';
      case 'Advanced':
        return 'ระดับสูง';
      case 'Intermediate':
        return 'ระดับกลาง';
      case 'Beginner':
        return 'ระดับเริ่มต้น';
      default:
        return 'ระดับเริ่มต้น';
    }
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

  // Calculate lesson results from lesson progress
  const moduleResults: ModuleResult[] = attempts.reduce((acc: ModuleResult[], lesson: any) => {
    if (!lesson.quiz || !lesson.quiz.questions || lesson.quiz.questions.length === 0) {
      return acc;
    }
    
    const moduleName = lesson.moduleTitle || lesson.module?.title || 'บทเรียน';
    const existing = acc.find(m => m.name === moduleName);
    
    // Calculate quiz progress
    // For now, we'll use completion status, but ideally we'd track actual quiz answers
    const quizTotal = lesson.quiz.questions.length;
    const quizAnswered = lesson.completed ? quizTotal : 0; // Assume all answered if completed
    const quizScore = lesson.completed ? 100 : Math.round((quizAnswered / quizTotal) * 100);
    
    // Calculate reading progress
    const sectionsTotal = lesson.sections?.length || 0;
    const sectionsRead = lesson.completed ? sectionsTotal : 0; // Assume all read if completed
    
    if (existing) {
      // Add lesson to existing module
      if (!existing.lessons) {
        existing.lessons = [];
      }
      existing.lessons.push(lesson);
      
      // Update quiz and reading progress
      if (!existing.quizProgress) {
        existing.quizProgress = { answered: 0, total: 0 };
      }
      existing.quizProgress.answered += quizAnswered;
      existing.quizProgress.total += quizTotal;
      
      if (!existing.readingProgress) {
        existing.readingProgress = { read: 0, total: 0 };
      }
      existing.readingProgress.read += sectionsRead;
      existing.readingProgress.total += sectionsTotal;
      
      // Recalculate average score
      const avgScore = existing.lessons.length > 0
        ? Math.round(existing.lessons.reduce((sum: number, l: any) => {
            const lQuizTotal = l.quiz?.questions?.length || 0;
            const lQuizAnswered = l.completed ? lQuizTotal : 0;
            return sum + (lQuizTotal > 0 ? Math.round((lQuizAnswered / lQuizTotal) * 100) : 0);
          }, 0) / existing.lessons.length)
        : quizScore;
      
      existing.score = avgScore;
      existing.achievementLevel = getAchievementLevel(avgScore);
    } else {
      acc.push({
        id: lesson.moduleId || lesson.id,
        name: moduleName,
        score: quizScore,
        achievementLevel: getAchievementLevel(quizScore),
        quizProgress: {
          answered: quizAnswered,
          total: quizTotal,
        },
        readingProgress: {
          read: sectionsRead,
          total: sectionsTotal,
        },
        lessons: [lesson],
      });
    }
    
    return acc;
  }, []);

  // Calculate total score (average of all module scores)
  const totalScore = moduleResults.length > 0
    ? Math.round(moduleResults.reduce((sum, m) => sum + m.score, 0) / moduleResults.length)
    : 0;

  const overallAchievementLevel = getAchievementLevel(totalScore);

  // Get latest completion date
  const latestCompletionDate = attempts.length > 0 && attempts[0].completedAt
    ? new Date(attempts[0].completedAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
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
          <h2 className="text-2xl font-bold text-gray-900">ประวัติการตรวจสอบความรู้</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              title="พิมพ์"
            >
              <Printer className="h-4 w-4" />
              <span className="text-sm font-medium">พิมพ์</span>
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'practice'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            การฝึกฝน (Self Training)
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'lessons'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            บทเรียน
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'practice' ? (
            <PracticeSessionsView sessions={practiceSessions} userName={userName} />
          ) : (
            <LessonsView 
              attempts={attempts}
              moduleResults={moduleResults}
              totalScore={totalScore}
              overallAchievementLevel={overallAchievementLevel}
              latestCompletionDate={latestCompletionDate}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              isLoading={isLoading}
              filteredModules={filteredModules}
              progressPercentage={progressPercentage}
              getAchievementColor={getAchievementColor}
              getAchievementTextColor={getAchievementTextColor}
              getAchievementLevelThai={getAchievementLevelThai}
              userName={userName}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Practice Sessions View Component
function PracticeSessionsView({ sessions, userName }: { sessions: any[], userName: string }) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ยังไม่มีข้อมูลการฝึกฝน</p>
      </div>
    );
  }

  // Aggregate analytics from all sessions
  const aggregateAnalytics = sessions.reduce((acc: any, session: any) => {
    const analytics = session.settings?.analytics || {};
    if (!analytics) return acc;

    // Aggregate per type
    if (analytics.perType) {
      Object.keys(analytics.perType).forEach((key: string) => {
        if (!acc.perType[key]) {
          acc.perType[key] = { correct: 0, total: 0, totalTime: 0, count: 0 };
        }
        acc.perType[key].correct += analytics.perType[key].correct || 0;
        acc.perType[key].total += analytics.perType[key].total || 0;
        acc.perType[key].totalTime += analytics.perType[key].totalTime || 0;
        acc.perType[key].count += 1;
      });
    }

    // Aggregate streaks
    if (analytics.streaks) {
      acc.longestStreak = Math.max(acc.longestStreak || 0, analytics.streaks.longest || 0);
    }

    // Collect all confusion patterns
    if (analytics.confusion) {
      analytics.confusion.forEach((conf: any) => {
        const key = `${conf.expected}_${conf.chosen}`;
        acc.confusion[key] = (acc.confusion[key] || 0) + conf.times;
      });
    }

    return acc;
  }, { perType: {}, longestStreak: 0, confusion: {} });

  // Calculate averages for per type
  Object.keys(aggregateAnalytics.perType).forEach((key: string) => {
    const stats = aggregateAnalytics.perType[key];
    stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    stats.averageTime = stats.count > 0 ? stats.totalTime / stats.count : 0;
  });

  // Get latest session
  const latestSession = sessions[0];
  const latestAnalytics = latestSession?.settings?.analytics || {};

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">คะแนนเฉลี่ย</span>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {sessions.length > 0
              ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
              : 0}%
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Streak สูงสุด</span>
            <Target className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {aggregateAnalytics.longestStreak || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">คำถามทั้งหมด</span>
            <Check className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {sessions.reduce((sum, s) => sum + s.totalQuestions, 0)}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">เวลารวม</span>
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(sessions.reduce((sum, s) => sum + s.totalTime, 0) / 60)} นาที
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Per Type Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">ประสิทธิภาพตามประเภท</h3>
          <div className="space-y-4">
            {Object.keys(aggregateAnalytics.perType).length > 0 ? (
              Object.entries(aggregateAnalytics.perType).map(([key, stats]: [string, any]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {key.replace('_', ' - ').replace('FOUR_BAND', '4 แถบ').replace('FIVE_BAND', '5 แถบ').replace('multiple_choice', 'เลือกคำตอบ').replace('fill_in', 'เติมคำ').replace('color_selection', 'เลือกสี')}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{Math.round(stats.accuracy)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${stats.accuracy}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>ถูก {stats.correct}/{stats.total} ข้อ</span>
                    <span>เวลาเฉลี่ย {Math.round(stats.averageTime)}s</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </div>

        {/* Predictions & Mastery */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">การทำนายและความเชี่ยวชาญ</h3>
          {latestAnalytics.predictions ? (
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">คะแนนที่คาดการณ์</span>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {latestAnalytics.predictions.predictedNextScore || 0}%
                </div>
              </div>

              {latestAnalytics.predictions.mastery && latestAnalytics.predictions.mastery.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">ความน่าจะเป็นเชี่ยวชาญ:</h4>
                  {latestAnalytics.predictions.mastery.map((m: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {m.topic.replace('_', ' - ').replace('FOUR_BAND', '4 แถบ').replace('FIVE_BAND', '5 แถบ')}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {Math.round(m.prob * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            m.prob >= 0.9 ? 'bg-green-500' : m.prob >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${m.prob * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {latestAnalytics.predictions.estimatedQuestionsToMaster && 
               latestAnalytics.predictions.estimatedQuestionsToMaster.some((e: any) => e.needed > 0) && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">คำถามที่ต้องทำเพิ่ม:</h4>
                  {latestAnalytics.predictions.estimatedQuestionsToMaster
                    .filter((e: any) => e.needed > 0)
                    .map((e: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {e.topic.replace('_', ' - ').replace('FOUR_BAND', '4 แถบ').replace('FIVE_BAND', '5 แถบ')}
                        </span>
                        <span className="font-semibold text-orange-600">{e.needed} ข้อ</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">ยังไม่มีข้อมูลการทำนาย</p>
          )}
        </div>

        {/* Timing Analysis */}
        {latestAnalytics.timing && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">การวิเคราะห์เวลา</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">เวลาเฉลี่ย</span>
                <span className="text-sm font-bold text-gray-900">{Math.round(latestAnalytics.timing.avg || 0)}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">เวลามัธยฐาน</span>
                <span className="text-sm font-bold text-gray-900">{Math.round(latestAnalytics.timing.median || 0)}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">เวลา p95</span>
                <span className="text-sm font-bold text-gray-900">{Math.round(latestAnalytics.timing.p95 || 0)}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">เร็วสุด</span>
                <span className="text-sm font-bold text-green-600">{Math.round(latestAnalytics.timing.fastest || 0)}s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ช้าสุด</span>
                <span className="text-sm font-bold text-red-600">{Math.round(latestAnalytics.timing.slowest || 0)}s</span>
              </div>
            </div>
          </div>
        )}

        {/* Confusion Matrix */}
        {Object.keys(aggregateAnalytics.confusion).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confusion Matrix</h3>
            <div className="space-y-2">
              {Object.entries(aggregateAnalytics.confusion)
                .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                .slice(0, 5)
                .map(([key, count]: [string, any]) => {
                  const [expected, chosen] = key.split('_');
                  return (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        คาด <span className="font-semibold">{expected}</span> → เลือก <span className="font-semibold">{chosen}</span>
                      </span>
                      <span className="font-bold text-red-600">{count} ครั้ง</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Repeated Mistakes */}
        {latestAnalytics.repeatedMisses && latestAnalytics.repeatedMisses.length > 0 && (
          <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm bg-red-50">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-bold text-gray-900">ข้อผิดพลาดที่ซ้ำ</h3>
            </div>
            <div className="space-y-2">
              {latestAnalytics.repeatedMisses.map((mistake: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {mistake.topic.replace('_', ' - ').replace('FOUR_BAND', '4 แถบ').replace('FIVE_BAND', '5 แถบ')}
                  </span>
                  <span className="font-bold text-red-600">{mistake.count} ครั้ง</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pace Analysis */}
        {latestAnalytics.pace && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">การวิเคราะห์ Pace</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">คำถามต่อนาที</span>
                <span className="text-sm font-bold text-gray-900">
                  {latestAnalytics.pace.questionsPerMinute?.toFixed(1) || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time Drift</span>
                <span className={`text-sm font-bold ${
                  latestAnalytics.pace.timeDrift > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {latestAnalytics.pace.timeDrift > 0 ? '+' : ''}{latestAnalytics.pace.timeDrift || 0}%
                </span>
              </div>
              {latestAnalytics.pace.timeDrift > 20 && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  ⚠️ เวลาต่อข้อเพิ่มขึ้นมาก อาจเกิดจากความเหนื่อยล้า
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Sessions List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">เซสชันล่าสุด</h3>
        <div className="space-y-3">
          {sessions.slice(0, 5).map((session: any) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(session.completedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({session.settings?.resistorType?.replace('_', ' ') || 'N/A'})
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>ถูก {session.correctAnswers}/{session.totalQuestions}</span>
                  <span>ความแม่นยำ {Math.round(session.accuracy)}%</span>
                  <span>เวลา {Math.round(session.totalTime / 60)} นาที</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  session.accuracy >= 90 ? 'text-green-600' :
                  session.accuracy >= 80 ? 'text-cyan-600' :
                  session.accuracy >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Math.round(session.accuracy)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Lessons View Component (existing content)
function LessonsView({
  attempts,
  moduleResults,
  totalScore,
  overallAchievementLevel,
  latestCompletionDate,
  selectedModule,
  setSelectedModule,
  isLoading,
  filteredModules,
  progressPercentage,
  getAchievementColor,
  getAchievementTextColor,
  getAchievementLevelThai,
  userName
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Summary and Module Breakdown */}
      <div className="lg:col-span-2 space-y-6">
              {/* Summary Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">สรุป</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">ชื่อผู้เรียน:</span>
                    <span className="text-sm font-semibold text-gray-900">{userName || 'ผู้เรียน'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">คะแนนรวม:</span>
                    <span className="text-lg font-bold text-orange-600">{totalScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">วันที่เสร็จสิ้น:</span>
                    <span className="text-sm font-semibold text-gray-900">{latestCompletionDate}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-gray-600">กรองตามระดับ:</span>
                    <select
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="all">ทั้งหมด</option>
                      <option value="Beginner">ระดับเริ่มต้น</option>
                      <option value="Intermediate">ระดับกลาง</option>
                      <option value="Advanced">ระดับสูง</option>
                      <option value="Mastered">เชี่ยวชาญ</option>
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
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">บทเรียน</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ความคืบหน้า</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">คะแนน</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ระดับความสำเร็จ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {isLoading ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-orange-600 border-r-transparent"></div>
                          </td>
                        </tr>
                      ) : filteredModules.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            ไม่พบผลการตรวจสอบความรู้
                          </td>
                        </tr>
                      ) : (
                        filteredModules.map((module: ModuleResult) => (
                          <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-900">{module.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-2">
                                {/* Quiz Progress */}
                                {module.quizProgress && module.quizProgress.total > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 min-w-[60px]">แบบทดสอบ:</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                      <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(module.quizProgress.answered / module.quizProgress.total) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900 min-w-[2.5rem] text-right">
                                      {module.quizProgress.answered}/{module.quizProgress.total} ข้อ
                                    </span>
                                  </div>
                                )}
                                {/* Reading Progress */}
                                {module.readingProgress && module.readingProgress.total > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 min-w-[60px]">การอ่าน:</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                      <div
                                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(module.readingProgress.read / module.readingProgress.total) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-900 min-w-[2.5rem] text-right">
                                      {module.readingProgress.read}/{module.readingProgress.total} ส่วน
                                    </span>
                                  </div>
                                )}
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
                                  {module.score}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-semibold ${getAchievementTextColor(module.achievementLevel)}`}>
                                {getAchievementLevelThai(module.achievementLevel)}
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
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">ผลการตรวจสอบความรู้</h3>
                  <p className="text-xs text-gray-600">การเรียนตัวต้านทาน</p>
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
                    <div className="text-5xl font-bold text-gray-900">{totalScore}%</div>
                    <div className="text-sm text-gray-600 mt-1 font-medium">คะแนนรวม</div>
                  </div>
                </div>

                {/* Achievement Level */}
                <div className="text-center mb-6">
                  <div className={`inline-block px-4 py-2 rounded-lg ${getAchievementColor(overallAchievementLevel)} text-white font-bold text-base`}>
                    {getAchievementLevelThai(overallAchievementLevel).toUpperCase()}
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">ระดับความสำเร็จ:</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded bg-red-500 flex-shrink-0"></div>
                    <span className="text-gray-700">ระดับเริ่มต้น (&lt;60%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded bg-yellow-500 flex-shrink-0"></div>
                    <span className="text-gray-700">ระดับกลาง (≥60%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded bg-cyan-500 flex-shrink-0"></div>
                    <span className="text-gray-700">ระดับสูง (≥80%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-4 h-4 rounded bg-green-500 flex-shrink-0"></div>
                    <span className="text-gray-700">เชี่ยวชาญ (≥90%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
}

