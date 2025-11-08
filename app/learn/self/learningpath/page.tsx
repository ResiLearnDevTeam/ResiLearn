'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LearningPathPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Fetch modules to get first lesson
    const redirectToFirstLesson = async () => {
      try {
        const response = await fetch('/api/modules');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].lessons.length > 0) {
            const firstLesson = data[0].lessons[0];
            router.replace(`/learn/self/learningpath/lesson/${firstLesson.id}`);
          }
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    
    redirectToFirstLesson();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading course content...</p>
      </div>
    </div>
  );
}
