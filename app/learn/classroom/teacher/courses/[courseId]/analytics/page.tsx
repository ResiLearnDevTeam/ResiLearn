'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { Course } from '@/types/classroom';
import { TrendingUp, Users, BarChart3, Target } from 'lucide-react';
import Link from 'next/link';

export default function TeacherAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/teacher/courses/${courseId}/analytics`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'TEACHER') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchAnalyticsData();
    }
  }, [status, router, courseId, session]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const [courseRes, analyticsRes, studentsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/analytics`),
        fetch(`/api/courses/${courseId}/students`),
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
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <ClassroomSidebar courseName={course?.name} />
        <div
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <ClassroomSidebar courseName={course?.name} />
        <div
          className="flex-1 transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-red-600 mb-4">{error || 'ไม่พบหลักสูตร'}</p>
              <button
                onClick={() => router.push('/learn/classroom/teacher/courses')}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                กลับไปหน้าหลักสูตร
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const overall = analytics?.overall || {
    totalSessions: 0,
    totalQuestions: 0,
    overallAccuracy: 0,
  };

  const topWeakAreas = analytics?.topWeakAreas || [];

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
    <div className="flex min-h-screen bg-gray-50">
      <ClassroomSidebar courseName={course.name} />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">การวิเคราะห์</h1>
            <p className="text-gray-600">{course.name}</p>
          </div>

          {/* Overall Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">เซสชันทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">{overall.totalSessions}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">คำถามทั้งหมด</p>
                  <p className="text-2xl font-bold text-gray-900">{overall.totalQuestions}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-orange-100 p-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">ความแม่นยำรวม</p>
                  <p className="text-2xl font-bold text-gray-900">{overall.overallAccuracy}%</p>
                </div>
              </div>
            </div>
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
    </div>
  );
}

