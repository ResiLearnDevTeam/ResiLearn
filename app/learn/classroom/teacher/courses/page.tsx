'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LeftSidebar from '@/components/layout/LeftSidebar';

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // จำลองข้อมูล (สามารถต่อ API จริงได้ทีหลัง)
    const timer = setTimeout(() => {
      // ลองเปลี่ยน [] เป็น mock data เพื่อลองดูผล
      setCourses([]);
      // setCourses([{ id: 1, name: 'Resistor Basics 101' }]);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          👩‍🏫 หน้านี้สำหรับอาจารย์
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          แสดงคอร์สที่อาจารย์สร้าง และสามารถจัดการคอร์สได้ที่นี่
        </p>

        {isLoading ? (
          <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : courses.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">📚 คอร์สของคุณ</h2>
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-xl bg-white p-5 shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-200"
              >
                <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                <p className="text-gray-500 text-sm">Course ID: {course.id}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg mb-6">ยังไม่มีคอร์สในขณะนี้</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md"
                onClick={() => router.push('/learn/classroom/teacher/courses/create')}
              >
                ➕ สร้างคอร์ส
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all shadow-md"
                onClick={() => alert('ฟีเจอร์เข้าร่วมคอร์สยังไม่เปิดใช้งาน')}
              >
                🔗 เข้าร่วมคอร์ส
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
