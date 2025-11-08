'use client';

import { useState } from 'react';
import { BookOpen, Moon, Sun, Globe, Maximize, Bookmark, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useLearningPath } from '../../layout';
import {
  LessonContentRenderer,
  RESISTOR_LESSON_BLUEPRINTS,
} from '@/components/learning-path/ResistorLessonsContent';

export default function LessonPage() {
  const {
    currentLessonContent,
    isLoadingContent,
    navigateLesson,
    canGoPrevious,
    canGoNext,
    currentLessonTitle,
  } = useLearningPath();
  
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const currentContent = currentLessonContent;

  return (
    <>
      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-200 ease-out ${fullscreen ? 'fixed inset-0 z-50' : ''}`}
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        {/* Top Toolbar */}
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-gray-900 transition-all duration-200">{currentLessonTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-600 hover:text-orange-600"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-600 hover:text-orange-600"
                title="Language"
              >
                <Globe className="h-5 w-5" />
                <span className="text-xs font-medium">EN</span>
              </button>
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-600 hover:text-orange-600"
                title="Fullscreen"
              >
                <Maximize className="h-5 w-5" />
              </button>
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-2 rounded-lg transition-colors ${
                  bookmarked 
                    ? 'text-yellow-500 hover:bg-yellow-50' 
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
                title="Bookmark"
              >
                <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-600 hover:text-orange-600"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[calc(100vh-64px)] bg-white">
          {/* Navigation Arrows */}
          <button
            onClick={() => navigateLesson('prev')}
            disabled={!canGoPrevious}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full transition-all ${
              canGoPrevious
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Previous lesson"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => navigateLesson('next')}
            disabled={!canGoNext}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full transition-all ${
              canGoNext
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Next lesson"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Lesson Content */}
          <div className="container mx-auto px-8 py-12 max-w-4xl relative min-h-[400px]">
            {isLoadingContent && !currentContent ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-500">Loading lesson content...</p>
                </div>
              </div>
            ) : null}
            {currentContent ? (
              <div
                className={`space-y-6 transition-all duration-300 ${
                  isLoadingContent ? 'opacity-60' : 'animate-slide-fade'
                }`}
              >
                {RESISTOR_LESSON_BLUEPRINTS[
                  currentContent.title as keyof typeof RESISTOR_LESSON_BLUEPRINTS
                ] ? (
                  <LessonContentRenderer
                    blueprint={
                      RESISTOR_LESSON_BLUEPRINTS[
                        currentContent.title as keyof typeof RESISTOR_LESSON_BLUEPRINTS
                      ]
                    }
                  />
                ) : (
                  <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40">
                    <header>
                      <h2 className="text-3xl font-bold text-slate-900">
                        {currentContent.title}
                      </h2>
                    </header>
                    <div className="prose prose-lg max-w-none text-slate-700">
                      {currentContent.content ? (
                        currentContent.content.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))
                      ) : (
                        <p className="text-slate-500">
                          This lesson content will be available soon. In the meantime, review
                          the practice modules or revisit previous lessons.
                        </p>
                      )}
                    </div>
                  </article>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-orange-300" />
                <p className="text-gray-500">Select a lesson from the course outline to begin</p>
              </div>
            )}
          </div>

          {/* Scroll to begin indicator */}
          {currentContent && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-sm text-gray-500 mb-2">Scroll to begin</p>
              <ChevronDown className="h-6 w-6 mx-auto text-orange-400 animate-bounce" />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
