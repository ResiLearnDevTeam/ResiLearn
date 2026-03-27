'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Course } from '@/types/classroom';
import { ArrowLeft, User, Mail, Calendar, TrendingUp, FileText, Target, Clock, Award, Download, BookOpen, AlertCircle } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function IndividualStudentDetailPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const studentId = params?.studentId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [studentData, setStudentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [courseId, studentId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [courseRes, detailRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/students/${studentId}/detail`),
      ]);

      if (!courseRes.ok) {
        throw new Error('Failed to fetch course');
      }

      if (!detailRes.ok) {
        throw new Error('Failed to fetch student details');
      }

      const courseData = await courseRes.json();
      const detailData = await detailRes.json();

      setCourse(courseData);
      setStudentData(detailData);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const performanceChartData = useMemo(() => {
    if (!studentData?.performanceTrends) return [];

    return studentData.performanceTrends
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .map((trend: any) => ({
        date: new Date(trend.date).toLocaleDateString('th-TH', {
          month: 'short',
          day: 'numeric',
        }),
        score: Math.round(trend.score),
        passed: trend.passed,
      }));
  }, [studentData?.performanceTrends]);

  const quizChartData = useMemo(() => {
    if (!studentData?.quizAttempts) return [];

    return studentData.quizAttempts
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(a.completedAt).getTime() -
          new Date(b.completedAt).getTime()
      )
      .slice(-10)
      .map((attempt: any) => ({
        date: new Date(attempt.completedAt).toLocaleDateString('th-TH', {
          month: 'short',
          day: 'numeric',
        }),
        score: Math.round(attempt.score),
        passed: attempt.passed,
      }));
  }, [studentData?.quizAttempts]);

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

  if (error || !course || !studentData) {
    return (
      <div
        className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="w-full h-full px-4 py-6 lg:px-8">
          <div className="rounded-xl bg-white p-12 text-center shadow-md">
            <p className="text-red-600 mb-4">{error || 'ไม่พบข้อมูล'}</p>
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/students`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้านักเรียน
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { student, assignmentHistory, quizAttempts, practiceSessions, learningPathProgress, timeAnalysis, weakAreas, performanceTrends } = studentData;

  // Calculate stats
  const completedAssignments = assignmentHistory.filter((a: any) => a.completed).length;
  const totalAssignments = assignmentHistory.length;
  const averageScore = quizAttempts.length > 0
    ? Math.round(quizAttempts.reduce((sum: number, a: any) => sum + a.score, 0) / quizAttempts.length)
    : 0;
  const totalTimeHours = Math.floor(timeAnalysis.totalTimeSpent / 3600);
  const totalTimeMinutes = Math.floor((timeAnalysis.totalTimeSpent % 3600) / 60);

  const handleExportReport = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/students/${studentId}/export`);
      if (!response.ok) throw new Error('Failed to export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student-report-${student.name || studentId}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการ export');
    }
  };

  return (
    <div
      className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <main className="w-full h-full px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/students`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้านักเรียน
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">รายละเอียดนักเรียน</h1>
            <p className="text-gray-600">{course.name}</p>
          </div>

          {/* Student Overview */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-start gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-2xl font-bold text-gray-900">{student.name || 'ไม่มีชื่อ'}</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{student.email}</span>
                  </div>
                  {student.studentId && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span>รหัสนักเรียน: {student.studentId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>ลงทะเบียนเมื่อ: {new Date(student.enrolledAt).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-medium text-gray-600">ความคืบหน้า</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{student.progress}%</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-gray-600">งานที่เสร็จ</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {completedAssignments}/{totalAssignments}
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  <p className="text-sm font-medium text-gray-600">คะแนนเฉลี่ย</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-medium text-gray-600">เวลาที่ใช้</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTimeHours}ชม. {totalTimeMinutes}น.
                </p>
              </div>
            </div>
          </div>

          {/* Assignment History */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">ประวัติงานที่ได้รับมอบหมาย</h2>
            {assignmentHistory.length > 0 ? (
              <div className="space-y-4">
                {assignmentHistory.map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                        assignment.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {assignment.completed ? 'เสร็จแล้ว' : 'ยังไม่เสร็จ'}
                      </span>
                    </div>
                    {assignment.level ? (
                      <div className="mb-2 text-sm text-gray-600">
                        ระดับ {assignment.level.number}: {assignment.level.name}
                      </div>
                    ) : (
                      <div className="mb-2 text-sm text-gray-400 italic">
                        ไม่ได้กำหนดระดับ
                      </div>
                    )}
                    {assignment.completed && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600">คะแนนที่ดีที่สุด: <span className="font-semibold text-gray-900">{Math.round(assignment.bestScore)}%</span></p>
                        <p className="text-sm text-gray-600">จำนวนครั้งที่ทำ: {assignment.attemptCount}</p>
                      </div>
                    )}
                    {assignment.dueDate && (
                      <p className="text-xs text-gray-500">
                        กำหนดส่ง: {new Date(assignment.dueDate).toLocaleDateString('th-TH')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">ยังไม่มีงานที่ได้รับมอบหมาย</p>
            )}
          </div>

          {/* Quiz Attempts */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">ประวัติการทำ Quiz</h2>
            {quizAttempts.length > 0 ? (
              <div className="space-y-3">
                {quizAttempts.slice(0, 10).map((attempt: any) => (
                  <div
                    key={attempt.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                          {attempt.level ? (
                        <p className="font-semibold text-gray-900">
                          ระดับ {attempt.level.number}: {attempt.level.name}
                        </p>
                      ) : (
                        <p className="font-semibold text-gray-400 italic">
                          ไม่พบข้อมูลระดับ
                        </p>
                      )}

                        <p className="text-sm text-gray-600">
                          {new Date(attempt.completedAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          attempt.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.round(attempt.score)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {attempt.passed ? 'ผ่าน' : 'ไม่ผ่าน'}
                        </p>
                        {attempt.timeTaken && (
                          <p className="text-xs text-gray-500">
                            เวลา: {Math.floor(attempt.timeTaken / 60)}น. {attempt.timeTaken % 60}ว.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {quizAttempts.length > 10 && (
                  <p className="text-center text-sm text-gray-500">
                    แสดง 10 จาก {quizAttempts.length} ครั้ง
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">ยังไม่มีการทำ Quiz</p>
            )}
          </div>

          {/* Practice Sessions */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">เซสชันการฝึกฝน</h2>
            {practiceSessions.length > 0 ? (
              <div className="space-y-3">
                {practiceSessions.slice(0, 10).map((session: any) => (
                  <div
                    key={session.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {session.presetName || 'ฝึกด่วน'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(session.completedAt).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.totalQuestions} คำถาม | ถูก {session.correctAnswers} ผิด {session.incorrectAnswers}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          session.accuracy >= 80 ? 'text-green-600' :
                          session.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {Math.round(session.accuracy)}%
                        </p>
                        {session.averageTime && (
                          <p className="text-xs text-gray-500">
                            เฉลี่ย {Math.round(session.averageTime)}ว./ข้อ
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {practiceSessions.length > 10 && (
                  <p className="text-center text-sm text-gray-500">
                    แสดง 10 จาก {practiceSessions.length} เซสชัน
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">ยังไม่มีเซสชันการฝึกฝน</p>
            )}
          </div>

          {/* Learning Path Progress */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">ความคืบหน้าใน Learning Path</h2>
            {learningPathProgress.modules.length > 0 ? (
              <div className="space-y-4">
                {learningPathProgress.modules.map((module: any) => (
                  <div key={module.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{module.module.title}</h3>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                        module.completed
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {module.progress}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">ยังไม่มีความคืบหน้าใน Learning Path</p>
            )}
          </div>

          {/* Weak Areas */}
          {Object.keys(weakAreas.resistorTypes).length > 0 && (
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-bold text-gray-900">จุดอ่อนที่ต้องปรับปรุง</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(weakAreas.resistorTypes).map(([type, data]: [string, any]) => {
                  const total = data.correct + data.incorrect;
                  const errorRate = total > 0 ? (data.incorrect / total) * 100 : 0;
                  if (total === 0) return null;
                  
                  return (
                    <div key={type} className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {type === 'FOUR_BAND' ? 'ตัวต้านทาน 4 แถบสี' : 'ตัวต้านทาน 5 แถบสี'}
                          </p>
                          <p className="text-sm text-gray-600">
                            ถูก {data.correct} ผิด {data.incorrect} จาก {total} ข้อ
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-red-600">{errorRate.toFixed(1)}%</p>
                          <p className="text-xs text-gray-500">อัตราความผิด</p>
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-red-200">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${errorRate}%` }}
                        />
                      </div>
                      {errorRate > 50 && (
                        <p className="mt-2 text-xs text-red-700">
                          💡 แนะนำ: ควรฝึกฝนเพิ่มเติมในส่วนนี้
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Performance Trends */}
          {performanceTrends.length > 0 && (
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">แนวโน้มผลการเรียน</h2>
              {performanceChartData.length > 0 && (
                <div className="mb-6 h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '8px',
                        }}
                        formatter={(value: any) => [`${value}%`, 'คะแนน']}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPerformance)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div className="space-y-2">
                {performanceTrends.slice(0, 10).map((trend: any, index: number) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(trend.date).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-semibold ${
                        trend.passed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Math.round(trend.score)}%
                      </p>
                      <span className={`rounded-full px-2 py-1 text-xs ${
                        trend.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trend.passed ? 'ผ่าน' : 'ไม่ผ่าน'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </main>
    </div>
  );
}

