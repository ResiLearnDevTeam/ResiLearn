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
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Line,
  ComposedChart,
} from 'recharts';
import AggregateDeepAnalytics from '@/components/analytics/AggregateDeepAnalytics';
import {
  calculateMovingAverage,
  generatePredictions,
  calculateStatistics,
  ChartDataPoint,
} from '@/lib/chartUtils';

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'ผู้เรียน';
  
  const [stats, setStats] = useState({
    lessonsCompleted: 0,
    totalLessons: 0,
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
      // Fetch dashboard stats from single endpoint
      const statsResponse = await fetch('/api/dashboard/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('Dashboard stats:', statsData);
        setStats({
          lessonsCompleted: statsData.lessonsCompleted ?? 0,
          totalLessons: statsData.totalLessons ?? 0,
          overallAccuracy: statsData.overallAccuracy ?? 0,
          totalSessions: statsData.totalSessions ?? 0,
          totalPracticeTime: statsData.totalPracticeTime ?? 0,
        });
      } else {
        const errorData = await statsResponse.json().catch(() => ({}));
        console.error('Failed to fetch dashboard stats:', errorData);
        // Fallback: set default values
        setStats({
          lessonsCompleted: 0,
          totalLessons: 0,
          overallAccuracy: 0,
          totalSessions: 0,
          totalPracticeTime: 0,
        });
      }

      // Fetch practice sessions for chart and recent sessions
      const sessionsResponse = await fetch('/api/practice-sessions?limit=20');
      if (sessionsResponse.ok) {
        const sessions = await sessionsResponse.json();
        setPracticeSessions(Array.isArray(sessions) ? sessions : []);
      }

      // Fetch aggregate analytics
      const analyticsResponse = await fetch('/api/analytics/practice');
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json();
        setAnalyticsData(analytics);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats({
        lessonsCompleted: 0,
        totalLessons: 0,
        overallAccuracy: 0,
        totalSessions: 0,
        totalPracticeTime: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data with trend and predictions
  const sortedSessions = practiceSessions
    .filter(s => s && s.completedAt && s.accuracy !== null)
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());

  const baseChartData: ChartDataPoint[] = sortedSessions.map((session) => ({
    name: new Date(session.completedAt).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
    accuracy: Math.round(session.accuracy || 0),
  }));

  // Calculate moving average (trend)
  const trendValues = calculateMovingAverage(baseChartData, 5);
  const chartData = baseChartData.map((point, index) => ({
    ...point,
    trend: trendValues[index],
  }));

  // Generate predictions
  const predictions = generatePredictions(baseChartData, 5);
  const combinedChartData = [...chartData, ...predictions];

  // Calculate statistics
  const statistics = calculateStatistics(baseChartData);

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
              {/* Lessons Completed */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-green-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">บทเรียนที่ผ่าน</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.lessonsCompleted}</h3>
                      <span className="text-lg text-gray-400">/ {stats.totalLessons}</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Overall Accuracy */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-orange-500">
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
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-blue-500">
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
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-purple-500">
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

            {/* Chart Section - Full Width with Statistics */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">แนวโน้มความแม่นยำ</h3>
                  <p className="text-sm text-gray-500">ผลการฝึกฝนที่ผ่านมาและการทำนายอนาคต</p>
                </div>
              </div>

              {/* Statistics Cards */}
              {chartData.length > 0 && (
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 border border-orange-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">ค่าเฉลี่ย</p>
                    <p className="text-2xl font-bold text-orange-700">{statistics.average}%</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">อัตราการปรับปรุง</p>
                    <p className={`text-2xl font-bold ${statistics.improvement >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {statistics.improvement >= 0 ? '+' : ''}{statistics.improvement}%
                    </p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4 border border-green-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">คะแนนสูงสุด</p>
                    <p className="text-2xl font-bold text-green-700">{statistics.best}%</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 border border-purple-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">แนวโน้ม</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-2xl font-bold ${
                        statistics.trend === 'up' ? 'text-green-700' :
                        statistics.trend === 'down' ? 'text-red-700' :
                        'text-gray-700'
                      }`}>
                        {statistics.trend === 'up' ? '↑' : statistics.trend === 'down' ? '↓' : '→'}
                      </p>
                      <span className="text-sm font-medium text-gray-600">
                        {statistics.trend === 'up' ? 'เพิ่มขึ้น' :
                         statistics.trend === 'down' ? 'ลดลง' :
                         'คงที่'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="h-[350px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={combinedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                        formatter={(value: number, name: string, props: any) => {
                          if (name === 'accuracy') {
                            return [`${value}%`, 'ความแม่นยำ'];
                          } else if (name === 'trend') {
                            return [`${value}%`, 'แนวโน้ม'];
                          } else if (name === 'prediction') {
                            return [`${value}%`, 'การทำนาย'];
                          }
                          return [value, name];
                        }}
                        labelFormatter={(label) => {
                          const isPrediction = combinedChartData.find(d => d.name === label)?.isPrediction;
                          return isPrediction ? `วันที่: ${label} (ทำนาย)` : `วันที่: ${label}`;
                        }}
                        cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="line"
                        formatter={(value) => {
                          if (value === 'accuracy') return 'ความแม่นยำ';
                          if (value === 'trend') return 'แนวโน้ม';
                          if (value === 'prediction') return 'การทำนาย';
                          return value;
                        }}
                      />
                      {/* Actual Accuracy Area */}
                      <Area
                        type="monotone"
                        dataKey="accuracy"
                        name="accuracy"
                        stroke="#f97316"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAccuracy)"
                        data={chartData}
                      />
                      {/* Trend Line */}
                      <Line
                        type="monotone"
                        dataKey="trend"
                        name="trend"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        data={chartData}
                      />
                      {/* Prediction Line */}
                      {predictions.length > 0 && (
                        <Line
                          type="monotone"
                          dataKey="accuracy"
                          name="prediction"
                          stroke="#10b981"
                          strokeWidth={2}
                          strokeDasharray="8 4"
                          dot={{ fill: '#10b981', r: 4 }}
                          data={predictions}
                        />
                      )}
                    </ComposedChart>
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
