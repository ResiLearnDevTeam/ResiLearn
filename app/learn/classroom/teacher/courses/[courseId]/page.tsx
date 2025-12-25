'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import CourseDetail from '@/components/features/classroom/CourseDetail';
import AssignmentList from '@/components/features/classroom/AssignmentList';
import AnnouncementList from '@/components/features/classroom/AnnouncementList';
import { Course, CourseAssignment, Announcement } from '@/types/classroom';
import { FileText, Bell, Settings, Users, ArrowLeft, LayoutDashboard, BarChart3 } from 'lucide-react';

export default function TeacherCourseDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/teacher/courses/${courseId}`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'TEACHER') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchCourseData();
    }
  }, [status, router, courseId, session]);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      const [courseRes, assignmentsRes, announcementsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/assignments`),
        fetch(`/api/courses/${courseId}/announcements`),
      ]);

      if (!courseRes.ok) {
        if (courseRes.status === 404) {
          throw new Error('ไม่พบหลักสูตร');
        }
        throw new Error('Failed to fetch course');
      }

      const courseData = await courseRes.json();
      setCourse(courseData);

      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData);
      }

      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json();
        setAnnouncements(announcementsData);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลหลักสูตร');
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
              <Link
                href="/learn/classroom/teacher/courses"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับไปหน้าหลักสูตร
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Verify teacher owns this course
  if (course.teacherId !== session?.user?.id) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <ClassroomSidebar courseName={course.name} />
        <div
          className="flex-1 transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-red-600 mb-4">คุณไม่มีสิทธิ์เข้าถึงหลักสูตรนี้</p>
              <Link
                href="/learn/classroom/teacher/courses"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับไปหน้าหลักสูตร
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClassroomSidebar courseName={course.name} />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/learn/classroom/teacher/courses"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้าหลักสูตร
          </Link>

          {/* Course Detail */}
          <div className="mb-8">
            <CourseDetail course={course} isTeacher={true} isTeacherView={true} />
          </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href={`/learn/classroom/teacher/courses/${courseId}/dashboard`}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
          >
            <LayoutDashboard className="mb-2 h-8 w-8" />
            <h3 className="font-semibold">แดชบอร์ด</h3>
            <p className="text-sm text-blue-100">ภาพรวมหลักสูตรและความคืบหน้า</p>
          </Link>
          <Link
            href={`/learn/classroom/teacher/courses/${courseId}/analytics`}
            className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white shadow-lg transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-xl"
          >
            <BarChart3 className="mb-2 h-8 w-8" />
            <h3 className="font-semibold">การวิเคราะห์</h3>
            <p className="text-sm text-purple-100">วิเคราะห์ผลการเรียนอย่างละเอียด</p>
          </Link>
          <Link
            href={`/learn/classroom/teacher/courses/${courseId}/students`}
            className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
          >
            <Users className="mb-2 h-8 w-8 text-blue-600" />
            <h3 className="font-semibold text-gray-900">จัดการนักเรียน</h3>
            <p className="text-sm text-gray-600">ดูและจัดการรายชื่อนักเรียน</p>
          </Link>
          <Link
            href={`/learn/classroom/teacher/courses/${courseId}/assignments`}
            className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
          >
            <FileText className="mb-2 h-8 w-8 text-green-600" />
            <h3 className="font-semibold text-gray-900">จัดการงาน</h3>
            <p className="text-sm text-gray-600">สร้างและแก้ไขงาน</p>
          </Link>
          <Link
            href={`/learn/classroom/teacher/courses/${courseId}/announcements`}
            className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
          >
            <Bell className="mb-2 h-8 w-8 text-purple-600" />
            <h3 className="font-semibold text-gray-900">จัดการประกาศ</h3>
            <p className="text-sm text-gray-600">สร้างและแก้ไขประกาศ</p>
          </Link>
          <Link
            href={`/learn/classroom/teacher/courses/${courseId}/settings`}
            className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
          >
            <Settings className="mb-2 h-8 w-8 text-orange-600" />
            <h3 className="font-semibold text-gray-900">ตั้งค่า</h3>
            <p className="text-sm text-gray-600">แก้ไขข้อมูลหลักสูตร</p>
          </Link>
        </div>

        {/* Assignments Preview */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">งานที่ได้รับมอบหมาย</h2>
            </div>
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/assignments`}
              className="text-blue-600 hover:underline"
            >
              ดูทั้งหมด
            </Link>
          </div>
          <AssignmentList
            assignments={assignments.slice(0, 3)}
            courseId={courseId}
            isTeacherView={true}
          />
        </div>

        {/* Announcements Preview */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">ประกาศ</h2>
            </div>
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/announcements`}
              className="text-blue-600 hover:underline"
            >
              ดูทั้งหมด
            </Link>
          </div>
          <AnnouncementList announcements={announcements.slice(0, 3)} isTeacherView={true} />
        </div>
        </main>
      </div>
    </div>
  );
}
