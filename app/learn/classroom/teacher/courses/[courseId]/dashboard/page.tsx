'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Course, CourseAssignment, Announcement } from '@/types/classroom';
import { Users, FileText, TrendingUp, Award, Bell, Settings, ChevronRight, BarChart3 } from 'lucide-react';
import AssignmentList from '@/components/features/classroom/AssignmentList';
import AnnouncementList from '@/components/features/classroom/AnnouncementList';
import CourseAnalytics from '@/components/classroom/CourseAnalytics';

export default function TeacherCourseDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  useEffect(() => {
    fetchDashboardData();
  }, [courseId]);

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

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div
          className="w-full min-h-screen flex items-center justify-center transition-all duration-200 ease-out overflow-y-auto"
          style={{
            marginLeft: 'var(--sidebar-width, 288px)',
            width: 'calc(100% - var(--sidebar-width, 288px))'
          }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div
          className="w-full min-h-screen transition-all duration-200 ease-out overflow-y-auto"
          style={{
            marginLeft: 'var(--sidebar-width, 288px)',
            width: 'calc(100% - var(--sidebar-width, 288px))'
          }}
        >
          <main className="w-full h-full px-6 lg:px-12 xl:px-16 py-8">
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

  const completionRate = stats.totalAttempts > 0
    ? Math.round((stats.completedAttempts / stats.totalAttempts) * 100)
    : 0;

  const recentAssignments: CourseAssignment[] = dashboardData?.recentAssignments || [];
  const recentAnnouncements: Announcement[] = dashboardData?.recentAnnouncements || [];

  const userName = session?.user?.name?.split(' ')[0] || 'คุณครู';

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div
        className="w-full min-h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{
          marginLeft: 'var(--sidebar-width, 288px)',
          width: 'calc(100% - var(--sidebar-width, 288px))'
        }}
      >
        <main className="w-full min-h-screen px-6 lg:px-12 xl:px-16 py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {getTimeGreeting()}, <span className="text-blue-600">{userName}</span>
                </h1>
                <p className="mt-2 text-gray-600">ภาพรวมหลักสูตรและการจัดการ</p>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
                {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Stats Cards - Border Style */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Students */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-blue-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">นักเรียนทั้งหมด</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.totalStudents}</h3>
                      <span className="text-lg text-gray-400">คน</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{stats.activeStudents} คนที่ใช้งาน</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              {/* Total Assignments */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-green-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">งานที่มอบหมาย</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.totalAssignments}</h3>
                      <span className="text-lg text-gray-400">งาน</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{stats.completedAttempts} งานที่เสร็จแล้ว</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-orange-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">คะแนนเฉลี่ย</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.averageScore}%</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">จาก {stats.totalAttempts} ครั้งที่ทำ</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-purple-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">อัตราเสร็จสิ้น</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{completionRate}%</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{stats.completedAttempts} / {stats.totalAttempts}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href={`/learn/classroom/teacher/courses/${courseId}/students`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] hover:border-blue-200"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <Users className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">จัดการนักเรียน</h3>
                  <p className="text-sm text-gray-500">ดูรายชื่อและความก้าวหน้า</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </Link>

              <Link
                href={`/learn/classroom/teacher/courses/${courseId}/assignments`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] hover:border-green-200"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30">
                  <FileText className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">จัดการงาน</h3>
                  <p className="text-sm text-gray-500">สร้างและจัดการงานที่มอบหมาย</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
              </Link>

              <Link
                href={`/learn/classroom/teacher/courses/${courseId}/analytics`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] hover:border-purple-200"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">การวิเคราะห์</h3>
                  <p className="text-sm text-gray-500">วิเคราะห์ผลการเรียนอย่างละเอียด</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </Link>

              <Link
                href={`/learn/classroom/teacher/courses/${courseId}/announcements`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] hover:border-orange-200"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30">
                  <Bell className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">จัดการประกาศ</h3>
                  <p className="text-sm text-gray-500">สร้างและแก้ไขประกาศ</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </Link>

              <Link
                href={`/learn/classroom/teacher/courses/${courseId}/settings`}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.02] hover:border-gray-300"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30">
                  <Settings className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">ตั้งค่า</h3>
                  <p className="text-sm text-gray-500">แก้ไขข้อมูลหลักสูตร</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Assignments */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">งานล่าสุด</h3>
                      <p className="text-sm text-gray-500">งานที่สร้างล่าสุด</p>
                    </div>
                  </div>
                  {recentAssignments.length > 0 && (
                    <Link
                      href={`/learn/classroom/teacher/courses/${courseId}/assignments`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ดูทั้งหมด
                    </Link>
                  )}
                </div>
                {recentAssignments.length > 0 ? (
                  <AssignmentList
                    assignments={recentAssignments}
                    courseId={courseId}
                    isTeacherView={true}
                    emptyMessage="ยังไม่มีงาน"
                  />
                ) : (
                  <div className="rounded-xl bg-gray-50 p-8 text-center">
                    <p className="text-gray-500">ยังไม่มีงานที่สร้าง</p>
                  </div>
                )}
              </div>

              {/* Recent Announcements */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <Bell className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">ประกาศล่าสุด</h3>
                      <p className="text-sm text-gray-500">ประกาศที่สร้างล่าสุด</p>
                    </div>
                  </div>
                  {recentAnnouncements.length > 0 && (
                    <Link
                      href={`/learn/classroom/teacher/courses/${courseId}/announcements`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      ดูทั้งหมด
                    </Link>
                  )}
                </div>
                {recentAnnouncements.length > 0 ? (
                  <AnnouncementList
                    announcements={recentAnnouncements}
                    isTeacherView={true}
                    emptyMessage="ยังไม่มีประกาศ"
                  />
                ) : (
                  <div className="rounded-xl bg-gray-50 p-8 text-center">
                    <p className="text-gray-500">ยังไม่มีประกาศ</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Enrollments */}
            {dashboardData?.enrollments && dashboardData.enrollments.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">นักเรียนที่ลงทะเบียนล่าสุด</h3>
                      <p className="text-sm text-gray-500">นักเรียนที่ลงทะเบียนในหลักสูตร</p>
                    </div>
                  </div>
                  <Link
                    href={`/learn/classroom/teacher/courses/${courseId}/students`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ดูทั้งหมด ({dashboardData.enrollments.length} คน)
                  </Link>
                </div>
                <div className="space-y-3">
                  {dashboardData.enrollments.slice(0, 5).map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
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
              </div>
            )}

            {/* Analytics Section */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">การวิเคราะห์ผลการเรียน</h3>
                    <p className="text-sm text-gray-500">ภาพรวมผลการเรียนของนักเรียนทั้งหมด</p>
                  </div>
                </div>
                <Link
                  href={`/learn/classroom/teacher/courses/${courseId}/analytics`}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  ดูรายละเอียด →
                </Link>
              </div>
              <CourseAnalytics courseId={courseId} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

