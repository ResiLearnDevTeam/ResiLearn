'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ClassroomLearningPathPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  
  useEffect(() => {
    // Fetch modules to get first lesson
    const redirectToFirstLesson = async () => {
      try {
        const response = await fetch('/api/modules');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].lessons.length > 0) {
            const firstLesson = data[0].lessons[0];
            router.replace(`/learn/classroom/courses/${courseId}/learningpath/lesson/${firstLesson.id}`);
          }
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    
    redirectToFirstLesson();
  }, [router, courseId]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">กำลังโหลดเนื้อหาหลักสูตร...</p>
      </div>
    </div>
  );
}

