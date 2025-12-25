'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CourseList from '@/components/features/classroom/CourseList';
import { Course } from '@/types/classroom';
import { Plus, GraduationCap } from 'lucide-react';

export default function TeacherCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return (
      <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">จัดการหลักสูตร</h1>
              <p className="text-gray-600">สร้างและจัดการหลักสูตรสำหรับนักเรียน</p>
            </div>
            <Link
              href="/learn/classroom/teacher/courses/create"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              สร้างหลักสูตรใหม่
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {/* Courses List */}
          {courses.length === 0 && !isLoading ? (
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <GraduationCap className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">ยังไม่มีหลักสูตร</h3>
              <p className="mb-6 text-gray-600">เริ่มสร้างหลักสูตรแรกของคุณเลย</p>
              <Link
                href="/learn/classroom/teacher/courses/create"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="h-5 w-5" />
                สร้างหลักสูตรใหม่
              </Link>
            </div>
          ) : (
            <CourseList courses={courses} isTeacherView={true} />
          )}
    </main>
  );
}
