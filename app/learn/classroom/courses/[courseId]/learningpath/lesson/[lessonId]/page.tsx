'use client';

import { useClassroomLearningPath } from '../../layout';
import LessonView from '@/components/learning-path/LessonView';

export default function ClassroomLessonPage() {
  const {
    currentLessonContent,
    isLoadingContent,
    navigateLesson,
    canGoPrevious,
    canGoNext,
    markLessonCompleted,
    selectedLesson
  } = useClassroomLearningPath();

  const displayContent = currentLessonContent;

  if (!displayContent && isLoadingContent && selectedLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">กำลังโหลดเนื้อหา...</p>
        </div>
      </div>
    );
  }

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
          isCompleted={false}
        />
      </div>
    </main>
  );
}

