'use client';

import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Target, TrendingUp, CheckCircle, XCircle, Zap, Award, BarChart3, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

export default function ClassroomPracticePage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const [isVisible, setIsVisible] = useState(false);
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all'); // 'all', 'FOUR_BAND', 'FIVE_BAND'
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all'); // 'all', 'easy', 'medium', 'hard'
  const itemsPerPage = 10;

  useEffect(() => {
    setIsVisible(true);
    if (courseId) {
      fetchRecentSessions();
    }
  }, [courseId]);

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/practice/sessions?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setRecentSessions(data || []);
        setFilteredSessions(data || []);
      }
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Filter and search sessions
  useEffect(() => {
    let filtered = [...recentSessions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => {
        const presetName = (session.presetName || '').toLowerCase();
        const resistorType = (session.preset?.resistorType || session.settings?.resistorType || '').toLowerCase();
        return presetName.includes(query) || resistorType.includes(query);
      });
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(session => {
        const sessionType = session.preset?.resistorType || session.settings?.resistorType || 'FOUR_BAND';
        return sessionType === filterType;
      });
    }

    // Difficulty filter
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(session => {
        const sessionDifficulty = session.settings?.difficulty || 'medium';
        return sessionDifficulty === filterDifficulty;
      });
    }

    setFilteredSessions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filterType, filterDifficulty, recentSessions]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <ClassroomSidebar courseId={courseId} />

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
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
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
                href={`/learn/classroom/courses/${courseId}/practice/quick/select`}
                className="mt-auto block w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
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
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
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
                href={`/learn/classroom/courses/${courseId}/practice/custom`}
                className="mt-auto block w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-purple-600 hover:to-purple-700"
              >
                กำหนดการฝึกฝน
              </Link>
            </div>
          </div>

          {/* Recent Practice Sessions */}
          <div className="mt-12">
            <div className="mb-6">
              <div className="mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">เซสชันการฝึกฝนล่าสุด</h2>
                <p className="mt-1 text-sm text-gray-600">ดูผลการฝึกฝนและวิเคราะห์ประสิทธิภาพของคุณ</p>
              </div>
              
              {/* Search and Filter Bar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาเซสชัน..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">ประเภท:</span>
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="all">ทั้งหมด</option>
                    <option value="FOUR_BAND">4 แถบสี</option>
                    <option value="FIVE_BAND">5 แถบสี</option>
                  </select>
                  
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="all">ทุกระดับ</option>
                    <option value="easy">ง่าย</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="hard">ยาก</option>
                  </select>
                </div>
              </div>
            </div>
            
            {isLoadingSessions ? (
              <div className="rounded-xl bg-white p-8 shadow-lg">
                <div className="flex flex-col items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-4 text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
                </div>
              </div>
            ) : filteredSessions.length > 0 ? (
              <>
                <div className="space-y-4">
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
                  
                  const incorrectAnswers = session.totalQuestions - session.correctAnswers;
                  const incorrectPercentage = session.totalQuestions > 0 
                    ? Math.round((incorrectAnswers / session.totalQuestions) * 100)
                    : 0;
                  const streakLongest = analytics?.streaks?.longest || 0;
                  const predictedScore = analytics?.predictions?.predictedNextScore || null;
                  const questionsPerMinute = analytics?.pace?.questionsPerMinute || null;
                  
                  return (
                    <Link
                      key={session.id}
                      href={`/learn/classroom/courses/${courseId}/practice/sessions/${session.id}`}
                      className="group relative block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="p-3 sm:p-4">
                        {/* Header with Date/Time */}
                        <div className="mb-3 flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="mb-1 text-base sm:text-lg font-bold text-gray-900 truncate">
                              {session.presetName || 'ฝึกด่วน'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-1.5 text-xs">
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 font-medium text-blue-700">
                                {resistorType === 'FOUR_BAND' ? '4 แถบ' : '5 แถบ'}
                              </span>
                              <span className="rounded-full bg-purple-100 px-2 py-0.5 font-medium text-purple-700">
                                {answerType === 'multiple_choice' ? 'ตัวเลือก' : 
                                 answerType === 'fill_in' ? 'เติมคำ' : 'เลือกสี'}
                              </span>
                              <span className={`rounded-full px-2 py-0.5 font-medium ${
                                difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {difficulty === 'easy' ? 'ง่าย' : difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span className="truncate">{formatDate(session.completedAt)}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end flex-shrink-0 gap-1">
                            <div className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              accuracy >= 90 ? 'bg-green-100 text-green-700' :
                              accuracy >= 80 ? 'bg-cyan-100 text-cyan-700' :
                              accuracy >= 60 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {achievementLevel.level}
                            </div>
                            <div className="text-xl font-bold text-gray-900">{accuracy}%</div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                              <span className="text-blue-600 font-semibold">{session.correctAnswers} ถูก</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-purple-600 font-semibold">{incorrectAnswers} ผิด</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-indigo-600 font-semibold">
                                {session.averageTime ? Math.round(session.averageTime) : 0}วินาที/ข้อ
                              </span>
                            </div>
                          </div>
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
                      <span className="hidden sm:inline">ก่อนหน้า</span>
                    </button>

                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-md">
                      <span className="text-sm font-semibold text-gray-900">
                        หน้า {currentPage}
                      </span>
                      <span className="text-sm text-gray-500">
                        / {totalPages}
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
                      <span className="hidden sm:inline">ถัดไป</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Results Count */}
                <div className="mt-4 text-center text-sm text-gray-600">
                  แสดง {currentSessions.length} จาก {filteredSessions.length} เซสชัน
                </div>
              </>
            ) : recentSessions.length > 0 ? (
              <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 sm:p-12 shadow-lg">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Search className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">ไม่พบเซสชันที่ค้นหา</h3>
                  <p className="mb-6 text-gray-600">ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูผลลัพธ์</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                      setFilterDifficulty('all');
                    }}
                    className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 sm:p-12 shadow-lg">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">ยังไม่มีเซสชันการฝึกฝน</h3>
                  <p className="mb-6 text-gray-600">เริ่มการฝึกฝนครั้งแรกของคุณเพื่อดูสถิติและความคืบหน้า</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                      href={`/learn/classroom/courses/${courseId}/practice/quick/select`}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-center font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
                    >
                      เริ่มฝึกด่วน
                    </Link>
                    <Link
                      href={`/learn/classroom/courses/${courseId}/practice/custom`}
                      className="rounded-xl border-2 border-blue-500 bg-white px-6 py-3 text-center font-semibold text-blue-600 transition-all hover:bg-blue-50"
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
