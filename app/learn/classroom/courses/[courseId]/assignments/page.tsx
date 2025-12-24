'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LeftSidebar from '@/components/layout/LeftSidebar';
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
        <LeftSidebar />
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
        <LeftSidebar />
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
    <div className="flex min-h-screen bg-gray-50">
      <LeftSidebar />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Link
            href={`/learn/classroom/courses/${courseId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้าหลักสูตร
          </Link>

          <div className="mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">งานที่ได้รับมอบหมาย</h1>
          </div>
          <p className="mb-6 text-gray-600">{course.name}</p>

          <AssignmentList assignments={assignments} courseId={courseId} />
        </main>
      </div>
    </div>
  );
}
