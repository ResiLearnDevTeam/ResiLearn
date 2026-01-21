'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function TeacherCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  useEffect(() => {
    if (courseId) {
      router.replace(`/learn/classroom/teacher/courses/${courseId}/dashboard`);
    }
  }, [courseId, router]);

  return (
    <div
      className="w-full h-screen flex items-center justify-center transition-all duration-200 ease-out overflow-y-auto"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="text-gray-600">กำลังเปลี่ยนเส้นทาง...</p>
      </div>
    </div>
  );
}
