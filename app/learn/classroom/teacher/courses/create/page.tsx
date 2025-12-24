'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LeftSidebar from '@/components/layout/LeftSidebar';
import CreateCourseForm from '@/components/features/classroom/CreateCourseForm';
import { ArrowLeft } from 'lucide-react';

export default function CreateCoursePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/learn/classroom/teacher/courses/create')}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'TEACHER') {
      router.push('/learn/classroom');
    }
  }, [status, router, session]);

  if (status === 'loading') {
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftSidebar />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/learn/classroom/teacher/courses"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าหลักสูตร
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">สร้างหลักสูตรใหม่</h1>
            <p className="mt-2 text-gray-600">กรอกข้อมูลเพื่อสร้างหลักสูตรใหม่</p>
          </div>

          {/* Form */}
          <div className="rounded-xl bg-white p-8 shadow-md">
            <CreateCourseForm />
          </div>
        </main>
      </div>
    </div>
  );
}
