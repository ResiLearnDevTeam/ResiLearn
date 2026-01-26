'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CourseList from '@/components/features/classroom/CourseList';
import { Course } from '@/types/classroom';
import { Plus, GraduationCap, BookOpen, FileText, CalendarCheck, ArrowLeft } from 'lucide-react';
import { getCourseStatus } from '@/lib/classroom';

export default function TeacherCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showEnded = searchParams.get('ended') === 'true';

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCourses();
    }
  }, [status]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดหลักสูตร');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  // Filter courses based on showEnded
  const displayedCourses = showEnded 
    ? courses.filter((c) => c.status === 'end')
    : courses.filter((c) => c.status !== 'end');

  // Calculate statistics from courses
  const stats = {
    totalCourses: courses.filter((c) => c.status !== 'end').length,
    endedCourses: courses.filter((c) => c.status === 'end').length,
    totalAssignments: courses.reduce((sum, c) => sum + (c.assignmentCount || 0), 0),
  };

  const userName = session?.user?.name?.split(' ')[0] || 'คุณครู';

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div
          className="w-full min-h-screen flex items-center justify-center transition-all duration-200 ease-out"
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div
        className="w-full min-h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{ 
          marginLeft: 'var(--sidebar-width, 288px)',
          width: 'calc(100% - var(--sidebar-width, 288px))'
        }}
      >
        <main className="w-full px-6 lg:px-12 xl:px-16 py-8">
          <div className="w-full space-y-8">
            
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {getTimeGreeting()}, <span className="text-blue-600">{userName}</span>
                </h1>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
                {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Total Courses */}
              {showEnded ? (
                <Link
                  href="/learn/classroom/teacher/courses"
                  className="rounded-2xl bg-white p-6 shadow-lg border-2 border-blue-500 hover:border-blue-600 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">หลักสูตรทั้งหมด</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.totalCourses}</h3>
                        <span className="text-lg text-gray-400">หลักสูตร</span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-blue-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">หลักสูตรทั้งหมด</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.totalCourses}</h3>
                        <span className="text-lg text-gray-400">หลักสูตร</span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              )}

              {/* Total Assignments */}
              <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-orange-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">งานที่มอบหมาย</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.totalAssignments}</h3>
                      <span className="text-lg text-gray-400">งาน</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>

              {/* Ended Courses */}
              <Link
                href="/learn/classroom/teacher/courses?ended=true"
                className="rounded-2xl bg-white p-6 shadow-lg border-2 border-gray-500 hover:border-gray-600 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">หลักสูตรที่จบแล้ว</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900">{stats.endedCourses}</h3>
                      <span className="text-lg text-gray-400">หลักสูตร</span>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <CalendarCheck className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-red-700 border border-red-200">
                <p>{error}</p>
              </div>
            )}

            {/* Back Button when showing ended courses */}
            {showEnded && (
              <Link
                href="/learn/classroom/teacher/courses"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                กลับไปรายการหลักสูตร
              </Link>
            )}

            {/* Courses List */}
            {displayedCourses.length === 0 && !isLoading ? (
              <div className="relative rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50 p-12 shadow-lg border border-blue-100 text-center overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-blue-300/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-blue-300/30 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 shadow-inner">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/40">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">เริ่มสร้างหลักสูตรแรกของคุณ!</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    ยังไม่มีหลักสูตร เริ่มสร้างหลักสูตรแรกเพื่อจัดการชั้นเรียนและมอบหมายงานให้นักเรียน
                  </p>
                  
                  <Link
                    href="/learn/classroom/teacher/courses/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:from-blue-600 hover:to-blue-700 hover:scale-105"
                  >
                    <Plus className="h-6 w-6" />
                    สร้างหลักสูตรใหม่
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900">
                        {showEnded ? 'รายการหลักสูตรที่จบแล้ว' : 'รายการหลักสูตร'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {displayedCourses.length > 0
                          ? showEnded
                            ? `${displayedCourses.length} หลักสูตรที่จบแล้ว`
                            : `${displayedCourses.length} หลักสูตร`
                          : 'ไม่มีหลักสูตร'}
                      </p>
                    </div>
                  </div>

                  {!showEnded && (
                    <Link
                      href="/learn/classroom/teacher/courses/create"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:scale-[1.02] flex-shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      สร้างหลักสูตรใหม่
                    </Link>
                  )}
                </div>
                <CourseList courses={displayedCourses} isTeacherView={true} />
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
