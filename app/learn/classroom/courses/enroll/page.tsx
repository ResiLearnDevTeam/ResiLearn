'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClassroomLeftSidebar from '@/components/layout/ClassroomLeftSidebar';
import JoinCourse from '@/components/features/classroom/JoinCourse';

export default function EnrollCoursePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return alert('กรุณากรอกรหัสคอร์ส');

    setLoading(true);

    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'ลงทะเบียนไม่สำเร็จ');
        return;
      }

      alert('🎉 ลงทะเบียนสำเร็จ!');
      router.push('/learn/classroom/courses');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <ClassroomLeftSidebar />

      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">

          {/* Header เหมือนตัวอย่าง */}
          <div className="mb-6 sm:mb-8">
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Join Course
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              เข้าร่วมคอร์สด้วยรหัสจากอาจารย์
            </p>
          </div>

          {/* Feature Component */}
          <div className="mx-auto">
            <JoinCourse
              code={code}
              setCode={setCode}
              loading={loading}
              handleEnroll={handleEnroll}
            />
          </div>

        </main>
      </div>
    </div>
  );
}
