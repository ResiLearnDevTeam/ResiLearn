'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Clock, Target, TrendingUp, CheckCircle, XCircle, Zap, Award, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PracticePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setIsVisible(true);
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch('/api/practice-sessions?limit=100');
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

  // Calculate pagination
  const totalPages = Math.ceil(recentSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = recentSessions.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { 
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
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">โหมดฝึกฝน</h1>
            <p className="text-sm sm:text-base text-gray-600">
              เลือกสไตล์การฝึกฝนของคุณ - ฝึกด่วนสำหรับการฝึกแบบรวดเร็ว หรือกำหนดเองสำหรับการฝึกแบบเฉพาะตัว
            </p>
          </div>

          {/* Practice Options */}
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Quick Practice */}
            <div
              className={`flex flex-col transform rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-500 hover:scale-105 ${
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">ฝึกด่วน</h2>
                  <p className="text-sm sm:text-base text-gray-600">เริ่มต้นได้ทันที</p>
                </div>
              </div>

              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700">
                เริ่มฝึกฝนด้วยการตั้งค่าเริ่มต้น เหมาะสำหรับการฝึกแบบรวดเร็วและการวอร์มอัพ
              </p>

              <div className="mb-6 flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ตัวต้านทาน 4 แถบสี</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>4 ตัวเลือก</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ไม่จำกัดเวลา</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>คำถามไม่จำกัด</span>
                </div>
                {/* Empty space to match Custom Practice card */}
                <div className="h-0"></div>
              </div>

              <Link
                href="/learn/self/practice/quick/select"
                className="mt-auto block w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
              >
                เริ่มฝึกด่วน
              </Link>
            </div>

            {/* Custom Practice */}
            <div
              className={`flex flex-col transform rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">กำหนดเอง</h2>
                  <p className="text-sm sm:text-base text-gray-600">ปรับแต่งการฝึกฝนของคุณ</p>
                </div>
              </div>

              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700">
                ปรับแต่งทุกด้านของการฝึกฝนเพื่อการเรียนรู้ที่ตรงเป้าหมาย
              </p>

              <div className="mb-6 flex-1 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>เลือกตัวต้านทาน 4 หรือ 5 แถบสี</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>2, 3 หรือ 4 ตัวเลือก</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>ตั้งเวลานับถอยหลังต่อคำถาม</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>คำถามจำนวนคงที่หรือไม่จำกัด</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>บันทึกการตั้งค่าที่คุณชอบ</span>
                </div>
              </div>

              <Link
                href="/learn/self/practice/custom"
                className="mt-auto block w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
              >
                กำหนดการฝึกฝน
              </Link>
            </div>
          </div>

          {/* Recent Practice Sessions */}
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">เซสชันการฝึกฝนล่าสุด</h2>
                <p className="mt-1 text-sm text-gray-600">ดูผลการฝึกฝนและวิเคราะห์ประสิทธิภาพของคุณ</p>
              </div>
            </div>
            
            {isLoadingSessions ? (
              <div className="rounded-xl bg-white p-8 shadow-lg">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
                  <p className="mt-4 text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
              </div>
            ) : recentSessions.length > 0 ? (
              <>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  {currentSessions.map((session) => {
                  const settings = session.settings as any || {};
                  const analytics = settings.analytics || {};
                  const resistorType = session.preset?.resistorType || settings.resistorType || 'FOUR_BAND';
                  const answerType = settings.answerType || 'multiple_choice';
                  const difficulty = settings.difficulty || 'medium';
                  
                  // Calculate achievement level
                  const accuracy = Math.round(session.accuracy);
                  const achievementLevel = 
                    accuracy >= 90 ? { level: 'เชี่ยวชาญ', color: 'green', bg: 'from-green-500 to-emerald-600' } :
                    accuracy >= 80 ? { level: 'ระดับสูง', color: 'cyan', bg: 'from-cyan-500 to-blue-600' } :
                    accuracy >= 60 ? { level: 'ระดับกลาง', color: 'yellow', bg: 'from-yellow-500 to-orange-600' } :
                    { level: 'ระดับเริ่มต้น', color: 'red', bg: 'from-red-500 to-pink-600' };
                  
                  return (
                    <Link
                      key={session.id}
                      href={`/learn/self/practice/sessions/${session.id}`}
                      className="group relative block overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    >
                      {/* Content */}
                      <div className="p-4 sm:p-5">
                        {/* Header with Title and Achievement Badge */}
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="mb-2 text-lg font-bold text-gray-900">
                              {session.presetName || 'ฝึกด่วน'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                                {resistorType === 'FOUR_BAND' ? '4 แถบสี' : '5 แถบสี'}
                              </span>
                              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {answerType === 'multiple_choice' ? 'ตัวเลือก' : 
                                 answerType === 'fill_in' ? 'เติมคำ' : 'เลือกสี'}
                              </span>
                              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {difficulty === 'easy' ? 'ง่าย' : difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3 flex flex-col items-end">
                            <div className={`rounded-full px-3 py-1 text-xs font-bold ${
                              accuracy >= 90 ? 'bg-green-100 text-green-700' :
                              accuracy >= 80 ? 'bg-cyan-100 text-cyan-700' :
                              accuracy >= 60 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {achievementLevel.level}
                            </div>
                            <div className="mt-1 text-2xl font-bold text-gray-900">{accuracy}%</div>
                          </div>
                        </div>
                        {/* Date & Time */}
                        <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(session.completedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Zap className="h-4 w-4" />
                            <span>{formatTime(session.totalTime)}</span>
                          </div>
                        </div>

                        {/* Main Stats Grid */}
                        <div className="mb-4 grid grid-cols-3 gap-4">
                          <div className="rounded-lg bg-orange-50 p-3 text-center">
                            <div className="mb-1 flex items-center justify-center gap-1">
                              <CheckCircle className="h-4 w-4 text-orange-600" />
                              <span className="text-lg sm:text-xl font-bold text-orange-600">
                                {session.correctAnswers}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">ถูกต้อง</div>
                            <div className="mt-1 text-xs text-gray-500">
                              จาก {session.totalQuestions} ข้อ
                            </div>
                          </div>
                          
                          <div className="rounded-lg bg-blue-50 p-3 text-center">
                            <div className="mb-1 flex items-center justify-center gap-1">
                              <Target className="h-4 w-4 text-blue-600" />
                              <span className="text-lg sm:text-xl font-bold text-blue-600">
                                {session.totalQuestions - session.correctAnswers}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">ผิดพลาด</div>
                            <div className="mt-1 text-xs text-gray-500">
                              {session.totalQuestions > 0 
                                ? Math.round(((session.totalQuestions - session.correctAnswers) / session.totalQuestions) * 100)
                                : 0}%
                            </div>
                          </div>
                          
                          <div className="rounded-lg bg-purple-50 p-3 text-center">
                            <div className="mb-1 flex items-center justify-center gap-1">
                              <BarChart3 className="h-4 w-4 text-purple-600" />
                              <span className="text-lg sm:text-xl font-bold text-purple-600">
                                {session.averageTime ? Math.round(session.averageTime) : 0}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">วินาที/ข้อ</div>
                            <div className="mt-1 text-xs text-gray-500">เวลาเฉลี่ย</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-700">ความแม่นยำ</span>
                            <span className="font-semibold text-gray-900">{accuracy}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                accuracy >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                accuracy >= 80 ? 'bg-gradient-to-r from-cyan-500 to-blue-600' :
                                accuracy >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                                'bg-gradient-to-r from-red-500 to-pink-600'
                              }`}
                              style={{ width: `${accuracy}%` }}
                            />
                          </div>
                        </div>

                        {/* Analytics (if available) */}
                        {analytics && Object.keys(analytics).length > 0 && (
                          <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
                            {analytics.streaks && analytics.streaks.longest > 0 && (
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Award className="h-4 w-4 text-yellow-500" />
                                  <span>Streak สูงสุด</span>
                                </div>
                                <span className="font-bold text-gray-900">{analytics.streaks.longest} ข้อ</span>
                              </div>
                            )}
                            
                            {analytics.predictions && analytics.predictions.predictedNextScore && (
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <TrendingUp className="h-4 w-4 text-blue-500" />
                                  <span>คะแนนที่คาดการณ์</span>
                                </div>
                                <span className="font-bold text-blue-600">
                                  {analytics.predictions.predictedNextScore}%
                                </span>
                              </div>
                            )}

                            {analytics.pace && analytics.pace.questionsPerMinute && (
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Zap className="h-4 w-4 text-purple-500" />
                                  <span>ความเร็ว</span>
                                </div>
                                <span className="font-bold text-gray-900">
                                  {analytics.pace.questionsPerMinute.toFixed(1)} ข้อ/นาที
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* View Details Link */}
                        <div className="mt-4 flex items-center justify-end border-t border-gray-200 pt-4">
                          <span className="text-sm font-medium text-orange-600 group-hover:text-orange-700">
                            ดูรายละเอียด →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                        currentPage === 1
                          ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                          : 'bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg'
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>ก่อนหน้า</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        หน้า {currentPage} จาก {totalPages}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({recentSessions.length} เซสชันทั้งหมด)
                      </span>
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all ${
                        currentPage === totalPages
                          ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                          : 'bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:shadow-lg'
                      }`}
                    >
                      <span>ถัดไป</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 sm:p-12 shadow-lg">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">ยังไม่มีเซสชันการฝึกฝน</h3>
                  <p className="mb-6 text-gray-600">เริ่มการฝึกฝนครั้งแรกของคุณเพื่อดูสถิติและความคืบหน้า</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                      href="/learn/self/practice/quick/select"
                      className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
                    >
                      เริ่มฝึกด่วน
                    </Link>
                    <Link
                      href="/learn/self/practice/custom"
                      className="rounded-xl border-2 border-orange-500 bg-white px-6 py-3 text-center font-semibold text-orange-600 transition-all hover:bg-orange-50"
                    >
                      กำหนดเอง
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

