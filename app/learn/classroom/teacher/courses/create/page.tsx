'use client';

import Link from 'next/link';
import CreateCourseForm from '@/components/features/classroom/CreateCourseForm';
import { ArrowLeft } from 'lucide-react';

export default function CreateCoursePage() {
  return (
    <div
      className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <main className="w-full h-full px-4 py-6 lg:px-8">
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
  );
}
