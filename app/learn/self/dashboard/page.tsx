'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Trophy, 
  Target, 
  Clock, 
  FileText,
  Zap,
  Settings2,
  TrendingUp,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AggregateDeepAnalytics from '@/components/analytics/AggregateDeepAnalytics';

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'ผู้เรียน';
  
  const [stats, setStats] = useState({
    levelsCompleted: 0,
    totalLevels: 0,
    overallAccuracy: 0,
    totalSessions: 0,
    totalPracticeTime: 0,
  });
  const [practiceSessions, setPracticeSessions] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

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
      const sessionsResponse = await fetch('/api/practice-sessions?limit=20');
      const sessions = sessionsResponse.ok ? await sessionsResponse.json() : [];
      setPracticeSessions(sessions);

      // Fetch aggregate analytics
      const analyticsResponse = await fetch('/api/analytics/practice');
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json();
        setAnalyticsData(analytics);
      }

      // Calculate stats
      const completedLevels = new Set(
        attempts.filter((a: any) => a.passed && a.mode === 'QUIZ')
          .map((a: any) => a.level.number)
      );

      const totalTime = attempts.reduce((sum: number, a: any) => sum + (a.timeTaken || 0), 0);
      
      // Calculate overall accuracy from sessions
      const validSessions = sessions.filter((s: any) => s.accuracy !== null && s.accuracy !== undefined);
      const overallAccuracy = validSessions.length > 0 
        ? Math.round(validSessions.reduce((sum: number, s: any) => sum + s.accuracy, 0) / validSessions.length)
        : 0;

      setStats({
        levelsCompleted: completedLevels.size,
        totalLevels: levels.length,
        overallAccuracy,
        totalSessions: sessions.length,
        totalPracticeTime: Math.round(totalTime / 60), // Convert to minutes
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data
  const chartData = practiceSessions
    .filter(s => s && s.completedAt && s.accuracy !== null)
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    .map((session) => ({
      name: new Date(session.completedAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
      accuracy: Math.round(session.accuracy || 0),
    }));

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <LeftSidebar />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="px-6 lg:px-12 xl:px-16 py-8">
          <div className="space-y-8">
            
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {getTimeGreeting()}, <span className="text-orange-600">{userName}</span>
                </h1>
                <p className="mt-2 text-gray-600">พร้อมฝึกฝนทักษะอ่านค่าตัวต้านทานวันนี้หรือยัง?</p>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
                {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Stats Cards - Border Style */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Levels Completed */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-l-4 border-green-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ระดับที่ผ่าน</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.levelsCompleted}</h3>
                      <span className="text-lg text-gray-400">/ {stats.totalLevels}</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Overall Accuracy */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-l-4 border-orange-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ความแม่นยำเฉลี่ย</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.overallAccuracy}%</h3>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Total Sessions */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-l-4 border-blue-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">เซสชันฝึกแล้ว</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.totalSessions}</h3>
                      <span className="text-lg text-gray-400">ครั้ง</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Practice Time */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-l-4 border-purple-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">เวลาฝึกรวม</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.totalPracticeTime}</h3>
                      <span className="text-lg text-gray-400">นาที</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/learn/self/practice/quick/select"
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] hover:border-orange-200"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30">
                  <Zap className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">ฝึกด่วน</h3>
                  <p className="text-sm text-gray-500">เริ่มฝึกได้ทันที</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </Link>

              <Link
                href="/learn/self/practice/custom"
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] hover:border-blue-200"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                  <Settings2 className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">กำหนดเอง</h3>
                  <p className="text-sm text-gray-500">ปรับแต่งการฝึกตามต้องการ</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </Link>
            </div>

            {/* Chart Section - Full Width */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">แนวโน้มความแม่นยำ</h3>
                  <p className="text-sm text-gray-500">ผลการฝึกฝนที่ผ่านมา</p>
                </div>
              </div>

              <div className="h-[280px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        }}
                        formatter={(value: number) => [`${value}%`, 'ความแม่นยำ']}
                        labelFormatter={(label) => `วันที่: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#f97316"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAccuracy)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>เริ่มฝึกฝนเพื่อดูแนวโน้มความก้าวหน้า</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics Section with Tabs */}
            {analyticsData && (
              <AggregateDeepAnalytics
                overall={analyticsData.overall}
                topWeakAreas={analyticsData.topWeakAreas}
              />
            )}

            {/* Recent Sessions - Compact Horizontal */}
            {practiceSessions.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">ฝึกล่าสุด</h3>
                      <p className="text-sm text-gray-500">เซสชันที่ผ่านมา</p>
                    </div>
                  </div>
                  <Link 
                    href="/learn/self/practice" 
                    className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    ดูทั้งหมด
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {practiceSessions.slice(0, 4).map((session) => {
                    const accuracy = Math.round(session.accuracy || 0);
                    const isGood = accuracy >= 80;
                    const isMedium = accuracy >= 60 && accuracy < 80;
                    
                    return (
                      <Link
                        key={session.id}
                        href={`/learn/self/practice/sessions/${session.id}`}
                        className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-orange-200 hover:bg-orange-50/50"
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold text-lg ${
                          isGood ? 'bg-green-100 text-green-600' : 
                          isMedium ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-red-100 text-red-600'
                        }`}>
                          {accuracy}%
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate text-sm">
                            {session.presetName || 'ฝึกด่วน'}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {new Date(session.completedAt).toLocaleDateString('th-TH', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State for New Users */}
            {practiceSessions.length === 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-12 text-center border border-orange-100">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">ยินดีต้อนรับ!</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  เริ่มต้นการฝึกฝนครั้งแรกของคุณเพื่อดูสถิติและติดตามความก้าวหน้า
                </p>
                <Link
                  href="/learn/self/practice/quick/select"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-amber-600 hover:scale-105"
                >
                  <Zap className="h-6 w-6" />
                  เริ่มฝึกเลย!
                </Link>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
