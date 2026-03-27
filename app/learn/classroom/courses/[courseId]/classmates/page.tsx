'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { Course } from '@/types/classroom';
import { Users, ArrowLeft, Mail, User } from 'lucide-react';

interface Classmate {
  id: string;
  name: string | null;
  email: string;
  enrolledAt: string;
  progress: number;
}

export default function StudentCourseClassmatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/courses/${courseId}/classmates`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'STUDENT') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router, courseId, session]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [courseResponse, enrollmentsResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/enrollments`),
      ]);

      if (!courseResponse.ok) throw new Error('Failed to fetch course');
      if (!enrollmentsResponse.ok) throw new Error('Failed to fetch enrollments');

      const courseData = await courseResponse.json();
      const enrollmentsData = await enrollmentsResponse.json();

      setCourse(courseData);
      // Filter out current user from classmates
      const filtered = enrollmentsData.filter(
        (e: any) => e.userId !== session?.user?.id
      );
      setClassmates(filtered.map((e: any) => ({
        id: e.user.id,
        name: e.user.name,
        email: e.user.email,
        enrolledAt: e.enrolledAt,
        progress: e.progress,
      })));
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
    <div className="flex min-h-screen bg-gray-50">
      <ClassroomSidebar courseName={course?.name} />

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
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">เพื่อนร่วมชั้น</h1>
          </div>
          <p className="mb-6 text-gray-600">{course.name}</p>

          {classmates.length === 0 ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <p className="text-gray-600">ยังไม่มีเพื่อนร่วมชั้นในหลักสูตรนี้</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {classmates.map((classmate) => (
                <div
                  key={classmate.id}
                  className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate text-lg font-bold text-gray-900">
                        {classmate.name || 'ไม่มีชื่อ'}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{classmate.email}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">ความคืบหน้า</p>
                        <p className="text-sm font-semibold text-gray-900">{classmate.progress}%</p>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${classmate.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
