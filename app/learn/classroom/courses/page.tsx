'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ClassroomLeftSidebar from '@/components/layout/ClassroomLeftSidebar';

export default function StudentCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data || []);
      } catch (err) {
        console.error('Error loading courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <ClassroomLeftSidebar/>

      <div className="flex-1 lg:ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧑‍🎓 คอร์สของฉัน
        </h1>

        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 text-lg">
            แสดงรายการคอร์สที่นักเรียนลงทะเบียนไว้
          </p>

          <button
            onClick={() => router.push('/learn/classroom/courses/enroll')}
            className="px-5 py-2.5 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-all"
          >
            🔑 เข้าร่วมคอร์สด้วยรหัส
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-500 animate-pulse">กำลังโหลด...</p>
        ) : courses.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-gray-700 text-lg mb-4">
              ยังไม่ได้ลงทะเบียนคอร์สใดๆ
            </p>
            <button
              onClick={() => router.push('/learn/classroom/courses/enroll')}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all shadow-md"
            >
              🔑 เข้าร่วมคอร์ส
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() =>
                  router.push(`/learn/classroom/courses/${course.id}`)
                }
                className="cursor-pointer rounded-2xl bg-white p-5 shadow-md border border-orange-100 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {course.name}
                </h3>

                <p className="text-gray-500 text-sm mb-2">
                  รหัสคอร์ส: <span className="font-mono">{course.code}</span>
                </p>

                <p className="text-gray-400 text-sm">
                  {new Date(course.startDate).toLocaleDateString()} -{' '}
                  {new Date(course.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
