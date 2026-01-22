'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import AssignmentList from '@/components/features/classroom/AssignmentList';
import { CourseAssignment, Course } from '@/types/classroom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function StudentCourseAssignmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/courses/${courseId}/assignments`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'STUDENT') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router, courseId, session]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [courseResponse, assignmentsResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/assignments`),
      ]);

      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course');
      }

      if (!assignmentsResponse.ok) {
        throw new Error('Failed to fetch assignments');
      }

      const courseData = await courseResponse.json();
      const assignmentsData = await assignmentsResponse.json();

      setCourse(courseData);
      setAssignments(assignmentsData);
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
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
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
                href={`/learn/classroom/courses/${courseId}`}
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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <ClassroomSidebar courseName={course?.name} />

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
                  {getTimeGreeting()}, <span className="text-blue-600">{course.name}</span>
                </h1>
                <p className="mt-2 text-gray-600">งานที่ได้รับมอบหมาย</p>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
                {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">งานที่ได้รับมอบหมาย</h2>
                <p className="text-sm text-gray-500">ดูและทำงานที่ได้รับมอบหมาย</p>
              </div>
            </div>

            {/* Assignments List */}
            <AssignmentList assignments={assignments} courseId={courseId} />
          </div>
        </main>
      </div>
    </div>
  );
}
