'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, Target, CheckCircle, XCircle, Trophy, BarChart3, Settings2, Search, Filter, X } from 'lucide-react';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import SessionDeepAnalytics from '@/components/analytics/SessionDeepAnalytics';
import { 
  formatSessionDate, 
  formatTime, 
  getResistorTypeLabel, 
  getAnswerTypeName, 
  getDifficultyLabel,
  getSessionTypeLabel
} from '@/lib/practiceSessionUtils';
import type { PracticeSessionData } from '@/types/practiceSession';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<PracticeSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCorrect, setFilterCorrect] = useState<string>('all'); // 'all', 'correct', 'incorrect'
  const [sortBy, setSortBy] = useState<string>('number'); // 'number', 'correct', 'incorrect'

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/practice-sessions?id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.session) {
          setSession(data.session);
        } else if (data.id) {
          // Fallback: if API returns session directly (backward compatibility)
          setSession(data as PracticeSessionData);
        } else {
          setError('ไม่พบข้อมูลเซสชัน');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    } catch (error) {
      console.error('Error fetching session:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{error || 'ไม่พบเซสชัน'}</h2>
            <Link
              href="/learn/self/practice"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
              กลับไปโหมดฝึกฝน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const settings = session.settings;
  const resistorType = settings.resistorType;
  const answerType = settings.answerType;
  const difficulty = settings.difficulty || 'medium';
  const allQuestions = session.questions || [];
  const accuracy = Math.round(session.accuracy);
  const isExcellent = accuracy >= 80;
  const isGood = accuracy >= 60 && accuracy < 80;

  // Filter and sort questions
  const filteredAndSortedQuestions = (() => {
    let filtered = [...allQuestions];

    // Filter by correct/incorrect
    if (filterCorrect === 'correct') {
      filtered = filtered.filter(q => q.isCorrect);
    } else if (filterCorrect === 'incorrect') {
      filtered = filtered.filter(q => !q.isCorrect);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => {
        const userAnswer = (q.userAnswer || '').toLowerCase();
        const correctAnswer = (q.correctAnswer || '').toLowerCase();
        const explanation = (q.explanation || '').toLowerCase();
        const questionNum = (q.questionNumber || 0).toString();
        return userAnswer.includes(query) || 
               correctAnswer.includes(query) || 
               explanation.includes(query) ||
               questionNum.includes(query);
      });
    }

    // Sort
    if (sortBy === 'correct') {
      filtered.sort((a, b) => {
        if (a.isCorrect === b.isCorrect) return (a.questionNumber || 0) - (b.questionNumber || 0);
        return a.isCorrect ? -1 : 1;
      });
    } else if (sortBy === 'incorrect') {
      filtered.sort((a, b) => {
        if (a.isCorrect === b.isCorrect) return (a.questionNumber || 0) - (b.questionNumber || 0);
        return a.isCorrect ? 1 : -1;
      });
    } else {
      // Sort by number (default)
      filtered.sort((a, b) => (a.questionNumber || 0) - (b.questionNumber || 0));
    }

    return filtered;
  })();

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <LeftSidebar />

      <div 
        className="flex-1 h-screen flex flex-col transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        {/* Header with gradient */}
        <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="px-4 lg:px-6 py-3">
            <Link 
              href="/learn/self/practice" 
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">กลับไปโหมดฝึกฝน</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold truncate mb-1">{session.sessionName}</h1>
            <p className="text-sm text-white/90">{formatSessionDate(session.completedAt)}</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <main className="container mx-auto px-4 py-6 sm:py-8 lg:px-8">

            {/* Session Type and Tags */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-200">
                {getSessionTypeLabel(session.sessionType)}
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-orange-700 border border-orange-200">
                {getResistorTypeLabel(resistorType)}
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                {getAnswerTypeName(answerType)}
              </span>
              {difficulty && (
                <span className={`rounded-full bg-white/90 px-3 py-1 text-xs font-semibold border ${
                  difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
                  difficulty === 'medium' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {getDifficultyLabel(difficulty)}
                </span>
              )}
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className={`h-5 w-5 ${isExcellent ? 'text-green-600' : isGood ? 'text-blue-600' : 'text-orange-600'}`} />
                  <span className="text-xs font-medium text-gray-600">ถูกต้อง</span>
                </div>
                <div className={`text-2xl font-bold ${
                  isExcellent ? 'text-green-600' : isGood ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {session.correctAnswers}/{session.totalQuestions}
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Target className={`h-5 w-5 ${isExcellent ? 'text-green-600' : isGood ? 'text-blue-600' : 'text-orange-600'}`} />
                  <span className="text-xs font-medium text-gray-600">ความแม่นยำ</span>
                </div>
                <div className={`text-2xl font-bold ${
                  isExcellent ? 'text-green-600' : isGood ? 'text-blue-600' : 'text-orange-600'
                }`}>
                  {accuracy}%
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-600">เวลา</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{formatTime(session.totalTime)}</div>
                {session.averageTime && (
                  <div className="text-xs text-gray-500 mt-1">เฉลี่ย {Math.round(session.averageTime)}s/ข้อ</div>
                )}
              </div>
              <div className="rounded-xl bg-white p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span className="text-xs font-medium text-gray-600">คำถาม</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{session.totalQuestions}</div>
              </div>
            </div>

            {/* Settings Summary */}
            <div className="mb-6 rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">การตั้งค่า</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">ประเภทตัวต้านทาน:</span>
                  <span className="ml-2 font-semibold text-gray-900">{getResistorTypeLabel(resistorType)}</span>
                </div>
                <div>
                  <span className="text-gray-600">ประเภทคำตอบ:</span>
                  <span className="ml-2 font-semibold text-gray-900">{getAnswerTypeName(answerType)}</span>
                </div>
                {difficulty && (
                  <div>
                    <span className="text-gray-600">ระดับความยาก:</span>
                    <span className="ml-2 font-semibold text-gray-900">{getDifficultyLabel(difficulty)}</span>
                  </div>
                )}
                {settings.optionCount && (
                  <div>
                    <span className="text-gray-600">จำนวนตัวเลือก:</span>
                    <span className="ml-2 font-semibold text-gray-900">{settings.optionCount} ตัวเลือก</span>
                  </div>
                )}
                {settings.countdownTime && (
                  <div>
                    <span className="text-gray-600">เวลานับถอยหลัง:</span>
                    <span className="ml-2 font-semibold text-gray-900">{settings.countdownTime} วินาที</span>
                  </div>
                )}
                {settings.timeLimit && (
                  <div>
                    <span className="text-gray-600">จำกัดเวลา:</span>
                    <span className="ml-2 font-semibold text-gray-900">{formatTime(settings.timeLimit)}</span>
                  </div>
                )}
                {settings.colorReadingMode && (
                  <div>
                    <span className="text-gray-600">โหมดฝึกอ่านค่ารหัสสี:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {settings.colorReadingMode === 'value_to_color_band_by_band' ? 'ค่า → สี (ทีละแถบ)' :
                       settings.colorReadingMode === 'value_to_color_full' ? 'ค่า → สี (ทั้งหมด)' :
                       settings.colorReadingMode === 'color_to_value' ? 'สี → ค่า' :
                       settings.colorReadingMode === 'mixed' ? 'ผสม' : 'ไม่ระบุ'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Deep Analytics */}
            {settings.analytics?.deepAnalytics && (
              <div className="mb-6">
                <SessionDeepAnalytics deepAnalytics={settings.analytics.deepAnalytics} />
              </div>
            )}

            {/* Question History */}
            <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">ประวัติคำถาม</h2>
                  <span className="text-sm text-gray-500">
                    ({filteredAndSortedQuestions.length}/{allQuestions.length})
                  </span>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาคำถาม..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter by Correct/Incorrect */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={filterCorrect}
                      onChange={(e) => setFilterCorrect(e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="all">ทั้งหมด</option>
                      <option value="correct">ถูกต้อง</option>
                      <option value="incorrect">ไม่ถูกต้อง</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="number">เรียงตามลำดับ</option>
                    <option value="correct">ถูกต้องก่อน</option>
                    <option value="incorrect">ไม่ถูกต้องก่อน</option>
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              {(filterCorrect !== 'all' || searchQuery.trim()) && (
                <div className="mb-4 flex items-center justify-between rounded-lg bg-orange-50 px-4 py-2 border border-orange-200">
                  <span className="text-sm text-gray-700">
                    แสดง {filteredAndSortedQuestions.length} จาก {allQuestions.length} คำถาม
                  </span>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCorrect('all');
                      setSortBy('number');
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              )}
            
            {allQuestions.length > 0 ? (
              filteredAndSortedQuestions.length > 0 ? (
              <div className="space-y-4">
                {filteredAndSortedQuestions.map((question: any, index: number) => (
                  <div
                    key={index}
                    className={`rounded-lg border-2 p-4 ${
                      question.isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">คำถาม {question.questionNumber || index + 1}</span>
                        {question.isCorrect ? (
                          <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                            ถูกต้อง
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                            ไม่ถูกต้อง
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resistor Display */}
                    <div className="mb-4">
                      <ResistorDisplay
                        bands={question.bands}
                        showAnswer={true}
                        answer={question.correctAnswer}
                        isCorrect={question.isCorrect}
                        type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                      />
                    </div>

                    {/* Answers */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">คำตอบของคุณ:</span>
                        <span className={`text-lg font-bold ${
                          question.isCorrect ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {question.userAnswer}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">คำตอบที่ถูกต้อง:</span>
                        <span className="text-lg font-bold text-green-800">{question.correctAnswer}</span>
                      </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="mt-3 rounded-lg bg-gray-100 p-3">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">คำอธิบาย:</span> {question.explanation}
                        </p>
                      </div>
                    )}

                    {/* Options (if multiple choice) */}
                    {answerType === 'multiple_choice' && question.options && (
                      <div className="mt-3">
                        <p className="mb-2 text-sm font-semibold text-gray-900">ตัวเลือก:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.map((option: string, optIndex: number) => {
                            const isUserAnswer = option === question.userAnswer;
                            const isCorrect = option === question.correctAnswer;
                            
                            return (
                              <div
                                key={optIndex}
                                className={`rounded-lg border-2 p-3 text-base font-semibold ${
                                  isCorrect
                                    ? 'border-green-600 bg-green-100 text-green-900'
                                    : isUserAnswer && !isCorrect
                                    ? 'border-red-600 bg-red-100 text-red-900'
                                    : 'border-gray-300 bg-white text-gray-900'
                                }`}
                              >
                                {option}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <p className="text-gray-600 mb-2">ไม่พบคำถามที่ตรงกับตัวกรอง</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCorrect('all');
                      setSortBy('number');
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                </div>
              )
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-gray-600">ไม่มีประวัติคำถามสำหรับเซสชันนี้</p>
              </div>
            )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

