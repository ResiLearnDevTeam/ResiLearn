'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';

export default function TeacherCoursesPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          👩‍🏫 หน้านี้สำหรับอาจารย์
        </h1>
        <p className="text-gray-600 text-lg">
          แสดงคอร์สที่อาจารย์สร้าง และสามารถจัดการคอร์สได้ที่นี่
        </p>
      </div>
    </div>
  );
}
