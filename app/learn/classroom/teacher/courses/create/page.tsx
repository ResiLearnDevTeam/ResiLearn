'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🆕 สร้างคอร์สใหม่</h1>
        <p className="text-gray-600 text-lg mb-8">
          หน้านี้สำหรับสร้างคอร์สใหม่ในระบบ Classroom Mode
        </p>

        <div className="rounded-xl bg-white p-6 shadow-md border border-blue-100">
          <p className="text-gray-500 mb-6">
            (หน้านี้เป็นหน้า Mock-up สำหรับสร้างคอร์ส — ยังไม่เชื่อมต่อระบบจริง)
          </p>

          <button
            onClick={() => router.push('/learn/classroom/teacher/courses')}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md"
          >
            ⬅ กลับไปหน้าคอร์ส
          </button>
        </div>
      </div>
    </div>
  );
}
