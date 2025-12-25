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
import { ArrowLeft, FileText, Bell } from 'lucide-react';

export default function StudentCourseDetailPage() {
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
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/courses/${courseId}`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'STUDENT') {
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

      const courseData: Course = await courseRes.json();
      setCourse(courseData);

      if (assignmentsRes.ok) {
        const assignmentsData: CourseAssignment[] = await assignmentsRes.json();
        setAssignments(assignmentsData);
      }

      if (announcementsRes.ok) {
        const announcementsData: Announcement[] = await announcementsRes.json();
        setAnnouncements(announcementsData);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลหลักสูตร');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && course && !isLoading) {
      // Redirect to dashboard if enrolled
      if (course.isEnrolled) {
        router.replace(`/learn/classroom/courses/${courseId}/dashboard`);
      }
    }
  }, [status, course, courseId, router, isLoading]);

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
                href="/learn/classroom"
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

  const isEnrolled = course.isEnrolled || false;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClassroomSidebar courseName={course.name} />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Link
            href="/learn/classroom"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้าหลักสูตร
          </Link>

          {/* Course Detail */}
          <div className="mb-8">
            <CourseDetail course={course} isTeacherView={false} />
          </div>

          {/* Content */}
          {isEnrolled ? (
            <div className="space-y-8">
              {/* Assignments */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">งานที่ได้รับมอบหมาย</h2>
                </div>
                <AssignmentList assignments={assignments} courseId={courseId} />
              </div>

              {/* Announcements */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Bell className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">ประกาศ</h2>
                </div>
                <AnnouncementList announcements={announcements} />
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-gray-600">กรุณาลงทะเบียนเรียนเพื่อดูงานและประกาศ</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
