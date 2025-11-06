'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Moon, Sun, Globe, Maximize, Bookmark, X, ChevronLeft, ChevronRight, Search, ChevronDown } from 'lucide-react';
import LeftSidebar from '@/components/layout/LeftSidebar';

// Mock data structure for course outline
interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  progress: number;
  expanded: boolean;
  lessons: Lesson[];
}

interface CourseContent {
  title: string;
  content: string;
}

export default function LearningPathPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLessonContent, setCurrentLessonContent] = useState<CourseContent | null>(null);

  // Course data from database
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    if (selectedLesson) {
      fetchLessonContent(selectedLesson);
    }
  }, [selectedLesson]);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/modules');
      if (response.ok) {
        const data = await response.json();
        // Set first module as expanded by default
        if (data.length > 0) {
          data[0].expanded = true;
        }
        setModules(data);
        
        // Set first lesson as selected by default
        if (data.length > 0 && data[0].lessons.length > 0) {
          setSelectedLesson(data[0].lessons[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessonContent = async (lessonId: string) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        setCurrentLessonContent({
          title: data.title,
          content: data.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        });
      }
    } catch (error) {
      console.error('Error fetching lesson content:', error);
    }
  };

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, expanded: !m.expanded } : m
    ));
  };

  const handleLessonClick = async (lessonId: string) => {
    setSelectedLesson(lessonId);
    // Mark lesson as completed when clicked (optional - can be done when user finishes reading)
    // await fetch(`/api/lessons/${lessonId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ completed: true }),
    // });
  };

  const currentLessonIndex = selectedLesson 
    ? modules.flatMap(m => m.lessons).findIndex(l => l.id === selectedLesson)
    : -1;
  
  const allLessons = modules.flatMap(m => m.lessons);
  const canGoPrevious = currentLessonIndex > 0;
  const canGoNext = currentLessonIndex < allLessons.length - 1;

  const navigateLesson = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && canGoPrevious) {
      setSelectedLesson(allLessons[currentLessonIndex - 1].id);
    } else if (direction === 'next' && canGoNext) {
      setSelectedLesson(allLessons[currentLessonIndex + 1].id);
    }
  };

  const currentContent = currentLessonContent;
  const currentLessonTitle = selectedLesson 
    ? allLessons.find(l => l.id === selectedLesson)?.title 
    : 'Select a lesson';

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar 
        modules={modules}
        selectedLesson={selectedLesson}
        onLessonClick={handleLessonClick}
        onToggleModule={toggleModule}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-200 ease-out ${fullscreen ? 'fixed inset-0 z-50' : ''}`}
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        {/* Top Toolbar */}
        <div className="sticky top-0 z-20 border-b border-orange-200 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-gray-900">{currentLessonTitle}</h1>
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
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-orange-50 transition-colors text-gray-600 hover:text-orange-600 flex items-center gap-1"
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
          <div className="container mx-auto px-8 py-12 max-w-4xl">
            {currentContent ? (
              <div className="space-y-6">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                    {currentContent.title}
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <div className="space-y-4 text-gray-700 leading-relaxed">
                    <p className="text-lg">{currentContent.content}</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                      eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                    </p>
                    <p>
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos 
                      qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
                    </p>
                  </div>
                </div>
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
    </div>
  );
}
