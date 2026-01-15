'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import JoinCourseForm from '@/components/features/classroom/JoinCourseForm';
import StudentSidebar from '@/components/layout/StudentSidebar';
import { Course } from '@/types/classroom';
import { ArrowLeft } from 'lucide-react';

export default function JoinCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/learn/classroom/join')}`);
    } else if (status === 'authenticated') {
      // Redirect teachers to their courses page
      if (session?.user?.role === 'TEACHER') {
        router.push('/learn/classroom/teacher/courses');
        return;
      }
    }
  }, [status, router, session]);

  const handleJoinSuccess = (course: Course) => {
    // Redirect to dashboard after successful join
    setTimeout(() => {
      router.push(`/learn/classroom/courses/${course.id}/dashboard`);
      router.refresh();
    }, 1500);
  };

  if (status === 'loading') {
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
          {/* Back Button */}
          <Link
            href="/learn/classroom"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้าหลักสูตร
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">เข้าร่วมหลักสูตร</h1>
            <p className="text-gray-600">กรอกรหัสชั้นเรียนที่ได้รับจากครูผู้สอนเพื่อเข้าร่วมหลักสูตร</p>
          </div>

          {/* Join Course Form */}
          <div className="max-w-2xl">
            <JoinCourseForm onSuccess={handleJoinSuccess} />
          </div>
        </main>
      </div>
    </div>
  );
}
