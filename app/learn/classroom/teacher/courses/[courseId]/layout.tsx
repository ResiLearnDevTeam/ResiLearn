'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import TeacherSidebar from '@/components/layout/TeacherSidebar';
import { ArrowLeft } from 'lucide-react';

export default function TeacherCourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<{ name: string; teacherId: string } | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/teacher/courses/${courseId}`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'TEACHER') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated' && courseId) {
      fetchCourse();
    }
  }, [status, router, courseId, session]);

  const fetchCourse = async () => {
    try {
      setIsLoadingCourse(true);
      const response = await fetch(`/api/courses/${courseId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/learn/classroom/teacher/courses');
          return;
        }
        throw new Error('Failed to fetch course');
      }

      const courseData = await response.json();
      setCourse(courseData);

      // Verify teacher owns this course
      if (courseData.teacherId !== session?.user?.id) {
        router.push('/learn/classroom/teacher/courses');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      router.push('/learn/classroom/teacher/courses');
    } finally {
      setIsLoadingCourse(false);
    }
  };

  if (status === 'loading' || isLoadingCourse) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <TeacherSidebar courseId={courseId} />
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

  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'TEACHER')) {
    return null;
  }

  if (!course || course.teacherId !== session?.user?.id) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <TeacherSidebar courseId={courseId} courseName={course?.name} />
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
      <TeacherSidebar courseId={courseId} courseName={course.name} />
      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        {children}
      </div>
    </div>
  );
}

