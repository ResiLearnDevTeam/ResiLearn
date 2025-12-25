'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { Course } from '@/types/classroom';
import { Users, FileText, TrendingUp, Clock, Award } from 'lucide-react';
import Link from 'next/link';

export default function TeacherCourseDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/teacher/courses/${courseId}/dashboard`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'TEACHER') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router, courseId, session]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [courseRes, dashboardRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/dashboard`),
      ]);

      if (!courseRes.ok) {
        if (courseRes.status === 404) {
          throw new Error('ไม่พบหลักสูตร');
        }
        throw new Error('Failed to fetch course');
      }

      const courseData: Course = await courseRes.json();
      setCourse(courseData);

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setDashboardData(dashboardData);
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

  const stats = dashboardData || {
    totalStudents: 0,
    activeStudents: 0,
    totalAssignments: 0,
    completedAttempts: 0,
    totalAttempts: 0,
    averageScore: 0,
  };

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
            <h1 className="mb-2 text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
            <p className="text-gray-600">{course.name}</p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">นักเรียนทั้งหมด</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
              <p className="mt-1 text-sm text-gray-500">
                {stats.activeStudents} คนที่ใช้งาน
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-green-100 p-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">งานที่มอบหมาย</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalAssignments}</p>
              <p className="mt-1 text-sm text-gray-500">
                {stats.completedAttempts} งานที่เสร็จแล้ว
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-orange-100 p-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">คะแนนเฉลี่ย</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
              <p className="mt-1 text-sm text-gray-500">
                จาก {stats.totalAttempts} ครั้งที่ทำ
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-purple-100 p-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">อัตราเสร็จสิ้น</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalAttempts > 0
                  ? Math.round((stats.completedAttempts / stats.totalAttempts) * 100)
                  : 0}%
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {stats.completedAttempts} / {stats.totalAttempts}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/analytics`}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <TrendingUp className="h-8 w-8" />
                <h3 className="text-xl font-bold">การวิเคราะห์</h3>
              </div>
              <p className="text-blue-100">
                ดูการวิเคราะห์ผลการเรียนของนักเรียนอย่างละเอียด
              </p>
            </Link>

            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/students`}
              className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-6 text-white shadow-lg transition-all hover:from-green-600 hover:to-green-700 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <Users className="h-8 w-8" />
                <h3 className="text-xl font-bold">จัดการนักเรียน</h3>
              </div>
              <p className="text-green-100">
                ดูรายชื่อนักเรียนและความก้าวหน้าแต่ละคน
              </p>
            </Link>

            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/assignments`}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <FileText className="h-8 w-8" />
                <h3 className="text-xl font-bold">จัดการงาน</h3>
              </div>
              <p className="text-orange-100">
                สร้างและจัดการงานที่มอบหมาย
              </p>
            </Link>
          </div>

          {/* Recent Enrollments */}
          {dashboardData?.enrollments && dashboardData.enrollments.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">นักเรียนที่ลงทะเบียนล่าสุด</h2>
              <div className="space-y-3">
                {dashboardData.enrollments.slice(0, 5).map((enrollment: any) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{enrollment.user.name}</p>
                      <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">ความคืบหน้า</p>
                      <p className="text-lg font-bold text-blue-600">{enrollment.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
              {dashboardData.enrollments.length > 5 && (
                <Link
                  href={`/learn/classroom/teacher/courses/${courseId}/students`}
                  className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  ดูทั้งหมด ({dashboardData.enrollments.length} คน)
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

