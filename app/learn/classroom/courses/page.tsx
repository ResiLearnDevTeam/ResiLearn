'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import LeftSidebar from '@/components/layout/LeftSidebar';
import EnrollmentForm from '@/components/features/classroom/EnrollmentForm';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // โหลดคอร์สที่นักเรียนลงทะเบียนไว้
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) throw new Error('Failed to load courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('❌ Error fetching student courses:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Sidebar */}
      <LeftSidebar />

      {/* Content */}
      <div className="flex-1 lg:ml-64 p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧑‍🎓 คอร์สของฉัน (My Courses)
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          ด้านล่างนี้คือคอร์สที่คุณได้ลงทะเบียนไว้
        </p>

        {/* ⭐ ฟอร์มลงทะเบียนด้วยรหัสคอร์ส */}
        <div className="mb-10">
          <EnrollmentForm />
        </div>

        {/* 🔄 Loading */}
        {isLoading ? (
          <div className="text-gray-500 animate-pulse">Loading...</div>
        ) : courses.length === 0 ? (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg mb-4">
              คุณยังไม่ได้ลงทะเบียนในคอร์สใดเลย
            </p>
            <p className="text-orange-500 font-semibold">
              ลองลงทะเบียนด้วยรหัสคอร์สด้านบนได้เลย ⭐
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              📚 คอร์สที่ลงทะเบียนแล้ว
            </h2>

            {/* 📦 แสดงคอร์สทั้งหมด */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() =>
                    router.push(`/learn/classroom/courses/${course.id}`)
                  }
                  className="cursor-pointer rounded-2xl bg-white p-5 shadow-md 
                             border border-orange-200 hover:shadow-lg 
                             transition-all duration-200 hover:-translate-y-1"
                >
                  <h3 className="text-lg font-bold text-gray-800">
                    {course.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2">
                    ผู้สอน: {course.teacherName ?? 'Unknown'}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    {course.startDate
                      ? new Date(course.startDate).toLocaleDateString()
                      : 'เริ่ม: N/A'}{' '}
                    –{' '}
                    {course.endDate
                      ? new Date(course.endDate).toLocaleDateString()
                      : 'สิ้นสุด: N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
