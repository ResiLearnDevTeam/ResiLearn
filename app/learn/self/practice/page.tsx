'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Target, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Zap,
  Settings2,
  ArrowLeft,
  Dumbbell,
  Check,
  Clock,
  Trophy,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { 
  getResistorTypeLabel, 
  getAnswerTypeName, 
  getDifficultyLabel,
  getSessionTypeLabel,
  formatSessionDate as formatDateUtil
} from '@/lib/practiceSessionUtils';
import type { PracticeSessionData } from '@/types/practiceSession';

export default function PracticePage() {
  const [recentSessions, setRecentSessions] = useState<PracticeSessionData[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<PracticeSessionData[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterSessionType, setFilterSessionType] = useState<string>('all');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch('/api/practice-sessions?limit=100');
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

  useEffect(() => {
    let filtered = [...recentSessions];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => {
        const sessionName = (session.sessionName || '').toLowerCase();
        const resistorType = (session.settings?.resistorType || '').toLowerCase();
        const answerType = (session.settings?.answerType || '').toLowerCase();
        return sessionName.includes(query) || resistorType.includes(query) || answerType.includes(query);
      });
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(session => {
        const sessionType = session.settings?.resistorType || 'FOUR_BAND';
        return sessionType === filterType;
      });
    }

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(session => {
        const sessionDifficulty = session.settings?.difficulty || 'medium';
        return sessionDifficulty === filterDifficulty;
      });
    }

    if (filterSessionType !== 'all') {
      filtered = filtered.filter(session => {
        return session.sessionType === filterSessionType;
      });
    }

    setFilteredSessions(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterType, filterDifficulty, filterSessionType, recentSessions]);

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = filteredSessions.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  // Feature list component for practice cards
  const FeatureItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
        <Check className="h-3 w-3 text-green-600" />
      </div>
      <span>{children}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <LeftSidebar />

      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        {/* Header */}
        <header className="shrink-0 px-6 lg:px-12 xl:px-16 py-5 border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link 
              href="/learning-mode" 
              className="flex items-center justify-center h-11 w-11 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">โหมดฝึกฝน</h1>
                <p className="text-sm text-gray-500">เลือกรูปแบบและเริ่มฝึกทักษะอ่านค่าตัวต้านทาน</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 xl:px-16 py-8">
          <div className="space-y-10">
            
            {/* Section: Practice Mode Cards */}
            <section>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Quick Practice Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-1 shadow-xl shadow-orange-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02]">
                  <div className="rounded-xl bg-white p-6">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40">
                        <Zap className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">ฝึกด่วน</h3>
                        <p className="text-gray-500 mt-1">เริ่มต้นได้ทันที ไม่ต้องตั้งค่า</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-6">
                      <FeatureItem>ตัวต้านทาน 4 แถบสี</FeatureItem>
                      <FeatureItem>4 ตัวเลือกต่อข้อ</FeatureItem>
                      <FeatureItem>ไม่จำกัดเวลา</FeatureItem>
                      <FeatureItem>คำถามไม่จำกัด</FeatureItem>
                    </div>

                    <Link
                      href="/learn/self/practice/quick/select"
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-amber-600 hover:shadow-xl"
                    >
                      <Zap className="h-5 w-5" />
                      เริ่มฝึกด่วน
                    </Link>
                  </div>
                </div>

                {/* Custom Practice Card */}
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-xl shadow-blue-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-[1.02]">
                  <div className="rounded-xl bg-white p-6">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/40">
                        <Settings2 className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">กำหนดเอง</h3>
                        <p className="text-gray-500 mt-1">ปรับแต่งการฝึกตามต้องการ</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 mb-6">
                      <FeatureItem>เลือกตัวต้านทาน 4 หรือ 5 แถบ</FeatureItem>
                      <FeatureItem>2, 3 หรือ 4 ตัวเลือก</FeatureItem>
                      <FeatureItem>ตั้งเวลานับถอยหลัง</FeatureItem>
                      <FeatureItem>กำหนดจำนวนคำถาม</FeatureItem>
                    </div>

                    <Link
                      href="/learn/self/practice/custom"
                      className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                    >
                      <Settings2 className="h-5 w-5" />
                      กำหนดการฝึกฝน
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-r from-orange-50 via-white to-amber-50 px-4 text-sm text-gray-400">
                  ประวัติและสถิติ
                </span>
              </div>
            </div>

            {/* Section: Recent Sessions */}
            <section>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">ประวัติการฝึก</h2>
                    <p className="text-sm text-gray-500">
                      {filteredSessions.length > 0 
                        ? `${filteredSessions.length} เซสชัน` 
                        : 'ดูผลการฝึกฝนที่ผ่านมา'}
                    </p>
                  </div>
                </div>
                
                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ค้นหาเซสชัน..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-48 rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                    />
                  </div>
                  <select
                    value={filterSessionType}
                    onChange={(e) => setFilterSessionType(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                  >
                    <option value="all">ทุกโหมด</option>
                    <option value="quick">ฝึกด่วน</option>
                    <option value="custom">กำหนดเอง</option>
                    <option value="color_reading">ฝึกอ่านสี</option>
                    <option value="preset">Preset</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                  >
                    <option value="all">ทุกประเภท</option>
                    <option value="FOUR_BAND">4 แถบ</option>
                    <option value="FIVE_BAND">5 แถบ</option>
                  </select>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-sm"
                  >
                    <option value="all">ทุกระดับ</option>
                    <option value="easy">ง่าย</option>
                    <option value="medium">ปานกลาง</option>
                    <option value="hard">ยาก</option>
                  </select>
                </div>
              </div>
              
              {isLoadingSessions ? (
                <div className="rounded-2xl bg-white p-12 shadow-lg border border-gray-100">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-r-transparent"></div>
                    <p className="mt-4 text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
                  </div>
                </div>
              ) : filteredSessions.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">เซสชัน</th>
                          <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">ประเภท</th>
                          <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">ระดับ</th>
                          <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">คะแนน</th>
                          <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">ถูก/ผิด</th>
                          <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">เวลาเฉลี่ย</th>
                          <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">วันที่</th>
                          <th className="px-4 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {currentSessions.map((session, index) => {
                          const settings = session.settings;
                          const resistorType = settings.resistorType;
                          const difficulty = settings.difficulty || 'medium';
                          const accuracy = Math.round(session.accuracy);
                          const incorrectAnswers = session.incorrectAnswers;
                          
                          return (
                            <tr 
                              key={session.id}
                              className={`hover:bg-orange-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                              {/* Session Name */}
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900">
                                  {session.sessionName}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {getSessionTypeLabel(session.sessionType)}
                                </div>
                              </td>

                              {/* Type */}
                              <td className="px-4 py-4 text-center">
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                  {getResistorTypeLabel(resistorType)}
                                </span>
                              </td>

                              {/* Difficulty */}
                              <td className="px-4 py-4 text-center">
                                {difficulty ? (
                                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                    difficulty === 'easy' 
                                      ? 'bg-green-100 text-green-700' 
                                      : difficulty === 'medium' 
                                        ? 'bg-yellow-100 text-yellow-700' 
                                        : 'bg-red-100 text-red-700'
                                  }`}>
                                    {getDifficultyLabel(difficulty)}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>

                              {/* Score with Progress Bar */}
                              <td className="px-4 py-4">
                                <div className="flex flex-col items-center gap-1">
                                  <span className={`text-lg font-bold ${
                                    accuracy >= 80 ? 'text-green-600' :
                                    accuracy >= 60 ? 'text-yellow-600' :
                                    accuracy >= 40 ? 'text-orange-600' :
                                    'text-red-600'
                                  }`}>
                                    {accuracy}%
                                  </span>
                                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all ${
                                        accuracy >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                        accuracy >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                                        accuracy >= 40 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                                        'bg-gradient-to-r from-red-400 to-red-500'
                                      }`}
                                      style={{ width: `${accuracy}%` }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* Correct/Wrong */}
                              <td className="px-4 py-4 text-center hidden md:table-cell">
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-green-600 font-semibold">{session.correctAnswers}</span>
                                  <span className="text-gray-400">/</span>
                                  <span className="text-red-500 font-semibold">{incorrectAnswers}</span>
                                </div>
                              </td>

                              {/* Avg Time */}
                              <td className="px-4 py-4 text-center hidden lg:table-cell">
                                <div className="flex items-center justify-center gap-1 text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span>{session.averageTime ? Math.round(session.averageTime) : 0}s</span>
                                </div>
                              </td>

                              {/* Date */}
                              <td className="px-4 py-4 text-center">
                                <span className="text-sm text-gray-500">
                                  {new Date(session.completedAt).toLocaleDateString('th-TH', { 
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </td>

                              {/* Action */}
                              <td className="px-4 py-4 text-right">
                                <Link
                                  href={`/learn/self/practice/sessions/${session.id}`}
                                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-gray-400 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          แสดง {startIndex + 1}-{Math.min(endIndex, filteredSessions.length)} จาก {filteredSessions.length} รายการ
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                              currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm'
                            }`}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            ก่อนหน้า
                          </button>

                          <div className="flex items-center gap-1 px-3">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`h-9 w-9 rounded-lg text-sm font-medium transition-all ${
                                    currentPage === pageNum
                                      ? 'bg-orange-500 text-white shadow-md'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                              currentPage === totalPages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm'
                            }`}
                          >
                            ถัดไป
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : recentSessions.length > 0 ? (
                /* No Search Results */
                <div className="rounded-2xl bg-white p-10 shadow-lg border border-gray-100 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบผลลัพธ์</h3>
                  <p className="text-gray-500 mb-6">ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูผลลัพธ์</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                      setFilterDifficulty('all');
                      setFilterSessionType('all');
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-semibold text-white shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                </div>
              ) : (
                /* Empty State */
                <div className="relative rounded-2xl bg-gradient-to-br from-orange-50 via-white to-amber-50 p-12 shadow-lg border border-orange-100 text-center overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  
                  <div className="relative">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-amber-100 shadow-inner">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/40">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">เริ่มต้นการฝึกฝนของคุณ!</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      ยังไม่มีประวัติการฝึก เริ่มการฝึกฝนครั้งแรกเพื่อดูสถิติ 
                      และติดตามความก้าวหน้าของคุณ
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/learn/self/practice/quick/select"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-amber-600 hover:scale-105"
                      >
                        <Zap className="h-6 w-6" />
                        เริ่มฝึกด่วน
                      </Link>
                      <Link
                        href="/learn/self/practice/custom"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400"
                      >
                        <Settings2 className="h-6 w-6" />
                        กำหนดเอง
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}
