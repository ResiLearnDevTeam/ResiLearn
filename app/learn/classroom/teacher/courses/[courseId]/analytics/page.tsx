'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Course } from '@/types/classroom';
import { TrendingUp, Users, BarChart3, Trophy } from 'lucide-react';
import Link from 'next/link';
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

export default function TeacherAnalyticsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [practiceSessions, setPracticeSessions] = useState<any[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [courseId]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const [courseRes, analyticsRes, studentsRes, sessionsRes, attemptsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/analytics`),
        fetch(`/api/courses/${courseId}/students`),
        fetch(`/api/courses/${courseId}/practice/sessions`),
        fetch(`/api/attempts?courseId=${courseId}&mode=QUIZ`),
      ]);

      if (!courseRes.ok) {
        if (courseRes.status === 404) {
          throw new Error('ไม่พบหลักสูตร');
        }
        throw new Error('Failed to fetch course');
      }

      const courseData: Course = await courseRes.json();
      setCourse(courseData);

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }

      if (sessionsRes.ok) {
        const sessions = await sessionsRes.json();
        setPracticeSessions(Array.isArray(sessions) ? sessions : []);
      }

      if (attemptsRes.ok) {
        const attempts = await attemptsRes.json();
        setQuizAttempts(Array.isArray(attempts) ? attempts : []);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="w-full h-full px-4 py-6 lg:px-8">
          <div className="rounded-xl bg-white p-12 text-center shadow-md">
            <p className="text-red-600 mb-4">{error || 'ไม่พบหลักสูตร'}</p>
            <Link
              href="/learn/classroom/teacher/courses"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              กลับไปหน้าหลักสูตร
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const overall = analytics?.overall || {
    totalSessions: 0,
    totalQuestions: 0,
    overallAccuracy: 0,
  };

  const topWeakAreas = analytics?.topWeakAreas || [];

  // Prepare chart data with trend and predictions
  // รวมข้อมูลจากทั้งแบบฝึกหัด (PracticeSession) และแบบทดสอบ (LevelAttempt)
  const allSessions = [
    ...practiceSessions
      .filter(s => s && s.completedAt && s.accuracy !== null)
      .map(s => ({
        completedAt: s.completedAt,
        accuracy: s.accuracy,
        type: 'practice',
      })),
    ...quizAttempts
      .filter(a => a && a.completedAt && a.percentage !== null)
      .map(a => ({
        completedAt: a.completedAt,
        accuracy: a.percentage || 0,
        type: 'quiz',
      })),
  ];

  const sortedSessions = allSessions.sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  // Format dates consistently and avoid duplicates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
    } catch {
      return null;
    }
  };

  const baseChartData: ChartDataPoint[] = sortedSessions
    .map((session) => {
      const formattedDate = formatDate(session.completedAt);
      if (!formattedDate) return null;
      return {
        name: formattedDate,
        accuracy: Math.round(session.accuracy || 0),
        date: new Date(session.completedAt),
      };
    })
    .filter((point): point is ChartDataPoint & { date: Date } => point !== null);

  // Group by date and average if multiple sessions on same day
  const dateMap = new Map<string, { accuracy: number; count: number; date: Date }>();
  baseChartData.forEach((point) => {
    const existing = dateMap.get(point.name);
    if (existing) {
      existing.accuracy += point.accuracy;
      existing.count += 1;
    } else {
      dateMap.set(point.name, {
        accuracy: point.accuracy,
        count: 1,
        date: point.date,
      });
    }
  });

  const aggregatedData: ChartDataPoint[] = Array.from(dateMap.entries())
    .map(([name, data]) => ({
      name,
      accuracy: Math.round(data.accuracy / data.count),
      date: data.date,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Calculate moving average (trend)
  const trendValues = calculateMovingAverage(aggregatedData, 5);
  const chartData = aggregatedData.map((point, index) => ({
    ...point,
    trend: trendValues[index],
  }));

  // Generate predictions using the last actual date
  const lastDate = aggregatedData.length > 0 
    ? aggregatedData[aggregatedData.length - 1].date 
    : new Date();
  const predictions = generatePredictions(aggregatedData, lastDate, 5);
  const combinedChartData = [...chartData, ...predictions];

  // Calculate statistics
  const statistics = calculateStatistics(aggregatedData);

  // Calculate student performance stats
  const studentStats = students.map((student: any) => {
    const avgScore = student.attempts.length > 0
      ? student.attempts.reduce((sum: number, a: any) => sum + a.score, 0) / student.attempts.length
      : 0;
    return {
      ...student,
      avgScore: Math.round(avgScore),
    };
  }).sort((a: any, b: any) => b.avgScore - a.avgScore);

  return (
    <div
      className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <main className="w-full h-full px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">การวิเคราะห์</h1>
            <p className="text-gray-600">{course.name}</p>
          </div>

          {/* Top Weak Areas */}
          {topWeakAreas.length > 0 && (
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">จุดอ่อนที่พบบ่อย</h2>
              <div className="space-y-3">
                {topWeakAreas.map((area: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{area.type}</p>
                      <p className="text-sm text-gray-600">{area.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">{area.errorRate.toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">อัตราความผิด</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Accuracy Trend Chart */}
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
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
                <div className="rounded-xl bg-white p-5 shadow-md border-2 border-orange-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">ค่าเฉลี่ย</p>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">{statistics.average}%</p>
                </div>
                <div className="rounded-xl bg-white p-5 shadow-md border-2 border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">อัตราการปรับปรุง</p>
                  </div>
                  <p className={`text-3xl font-bold ${statistics.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {statistics.improvement >= 0 ? '+' : ''}{statistics.improvement}%
                  </p>
                </div>
                <div className="rounded-xl bg-white p-5 shadow-md border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                      <Trophy className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">คะแนนสูงสุด</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{statistics.best}%</p>
                </div>
                <div className="rounded-xl bg-white p-5 shadow-md border-2 border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">แนวโน้ม</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`text-3xl font-bold ${
                      statistics.trend === 'up' ? 'text-green-600' :
                      statistics.trend === 'down' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {statistics.trend === 'up' ? '↑' : statistics.trend === 'down' ? '↓' : '→'}
                    </p>
                    <span className="text-sm font-semibold text-gray-600">
                      {statistics.trend === 'up' ? 'เพิ่มขึ้น' :
                       statistics.trend === 'down' ? 'ลดลง' :
                       'คงที่'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="h-[450px] w-full">
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
                      tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                      dy={10}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      interval={0}
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

          {/* Practice Summary */}
          {analytics?.deepAnalytics && (
            <div className="mb-8">
              <AggregateDeepAnalytics
                overall={analytics.overall}
                topWeakAreas={analytics.topWeakAreas}
                deepAnalytics={analytics.deepAnalytics}
              />
            </div>
          )}

          {/* Student Performance */}
          {studentStats.length > 0 && (
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">ผลการเรียนของนักเรียน</h2>
              <div className="space-y-3">
                {studentStats.map((student: any) => (
                  <Link
                    key={student.id}
                    href={`/learn/classroom/teacher/courses/${courseId}/students/${student.id}`}
                    className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          งานที่เสร็จ: {student.completedAssignments} / {student.totalAssignments}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">{student.avgScore}%</p>
                        <p className="text-xs text-gray-500">คะแนนเฉลี่ย</p>
                        <p className="mt-1 text-sm text-gray-600">
                          ความคืบหน้า: {student.progress}%
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {overall.totalSessions === 0 && (
            <div className="rounded-xl bg-white p-12 text-center shadow-lg">
              <BarChart3 className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">ยังไม่มีข้อมูลการวิเคราะห์</h3>
              <p className="text-gray-600">
                นักเรียนต้องเริ่มทำกิจกรรมในหลักสูตรเพื่อดูการวิเคราะห์
              </p>
            </div>
          )}
      </main>
    </div>
  );
}

