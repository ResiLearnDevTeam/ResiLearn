'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import JoinCourseForm from '@/components/features/classroom/JoinCourseForm';
import CourseList from '@/components/features/classroom/CourseList';
import StudentSidebar from '@/components/layout/StudentSidebar';
import { Course } from '@/types/classroom';
import { GraduationCap } from 'lucide-react';

export default function ClassroomPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/learn/classroom')}`);
    } else if (status === 'authenticated') {
      // Redirect teachers to their courses page
      if (session?.user?.role === 'TEACHER') {
        router.push('/learn/classroom/teacher/courses');
        return;
      }
      // For students, fetch enrolled courses
      if (session?.user?.role === 'STUDENT') {
        fetchCourses();
      }
    }
  }, [status, router, session]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/courses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data: Course[] = await response.json();
      // Filter only enrolled courses
      setCourses(data.filter(c => c.isEnrolled));
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดหลักสูตร');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSuccess = (course: Course) => {
    // Refresh courses list
    fetchCourses();
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <StudentSidebar />
        <div
          className="w-full h-screen flex items-center justify-center transition-all duration-200 ease-out overflow-y-auto"
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

  // Only show for students (teachers are redirected)
  if (session?.user?.role !== 'STUDENT') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <div
        className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="w-full h-full px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">ห้องเรียน</h1>
            <p className="text-gray-600">เข้าร่วมหลักสูตรด้วยรหัสชั้นเรียนหรือดูหลักสูตรที่ลงทะเบียนแล้ว</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {/* Join Course Form */}
          <div className="mb-8">
            <JoinCourseForm onSuccess={handleJoinSuccess} />
          </div>

          {/* Enrolled Courses List */}
          {courses.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">หลักสูตรที่ลงทะเบียนแล้ว</h2>
              <CourseList courses={courses} showProgress={true} />
            </div>
          )}

          {/* Empty State */}
          {courses.length === 0 && !isLoading && (
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <GraduationCap className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                ยังไม่ได้ลงทะเบียนเรียนหลักสูตรใด
              </h3>
              <p className="text-gray-600">
                ใช้ฟอร์มด้านบนเพื่อเข้าร่วมหลักสูตรด้วยรหัสชั้นเรียนที่ได้รับจากครูผู้สอน
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
