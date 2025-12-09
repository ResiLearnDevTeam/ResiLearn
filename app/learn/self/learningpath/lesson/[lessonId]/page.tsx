'use client';

import { useLearningPath } from '../../layout';
import LessonView from '@/components/learning-path/LessonView';
import { useEffect } from 'react';

export default function LessonPage() {
  const {
    currentLessonContent,
    isLoadingContent,
    navigateLesson,
    canGoPrevious,
    canGoNext,
    markLessonCompleted,
    selectedLesson
  } = useLearningPath();

  // Use currentLessonContent which already handles displayContent logic in context
  // This will show previous content while loading new content seamlessly
  const displayContent = currentLessonContent;

  // Only show loading screen on very first load when there's absolutely no content
  if (!displayContent && isLoadingContent && selectedLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="text-gray-600">กำลังโหลดเนื้อหา...</p>
        </div>
      </div>
    );
  }

  // If no content and not loading, show nothing (shouldn't happen in normal flow)
  if (!displayContent) {
    return null;
  }

  return (
    <main
      className="flex-1 transition-all duration-300 ease-in-out"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <div className={`transition-opacity duration-300 ease-in-out ${isLoadingContent ? 'opacity-60' : 'opacity-100'}`}>
        <LessonView
          lesson={displayContent}
          onComplete={(completed) => {
            if (selectedLesson) {
              markLessonCompleted(selectedLesson, completed);
            }
          }}
          onNext={() => navigateLesson('next')}
          onPrev={() => navigateLesson('prev')}
          canGoNext={canGoNext}
          canGoPrev={canGoPrevious}
          isCompleted={false} // You might want to add this to the context/lesson data if available
        />
      </div>
    </main>
  );
}
