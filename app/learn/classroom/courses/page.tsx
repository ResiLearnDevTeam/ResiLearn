'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import EnrollmentForm from '@/components/features/classroom/EnrollmentForm';

export default function StudentCoursesPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧑‍🎓 หน้านี้สำหรับนักเรียน
        </h1>

        <p className="text-gray-600 text-lg">
          แสดงรายการคอร์สที่นักเรียนลงทะเบียน และสามารถเข้าร่วมคอร์สได้
        </p>

        {/* ⭐ ปุ่มลงทะเบียนคอร์สด้วยรหัส */}
        <EnrollmentForm />

      </div>
    </div>
  );
}
