'use client';

import { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import LeftSidebar from '@/components/layout/LeftSidebar';

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

interface LearningPathContextType {
  modules: Module[];
  selectedLesson: string | null;
  currentLessonContent: CourseContent | null;
  isLoading: boolean;
  isLoadingContent: boolean;
  searchQuery: string;
  lessonCache: Map<string, CourseContent>;
  handleLessonClick: (lessonId: string) => void;
  toggleModule: (moduleId: string) => void;
  setSearchQuery: (query: string) => void;
  markLessonCompleted: (lessonId: string, completed: boolean) => Promise<void>;
  navigateLesson: (direction: 'prev' | 'next') => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentLessonTitle: string;
}

const LearningPathContext = createContext<LearningPathContextType | null>(null);

export function useLearningPath() {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error('useLearningPath must be used within LearningPathProvider');
  }
  return context;
}

export default function LearningPathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const lessonId = params?.lessonId as string | undefined;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [currentLessonContent, setCurrentLessonContent] = useState<CourseContent | null>(null);
  
  // Cache lesson content to prevent re-fetching
  const [lessonCache, setLessonCache] = useState<Map<string, CourseContent>>(new Map());
  
  // Keep previous content visible during transition
  const [displayContent, setDisplayContent] = useState<CourseContent | null>(null);

  // Course data from database
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle lessonId change from URL - keep previous content visible during transition
  useEffect(() => {
    if (!lessonId || modules.length === 0) return;
    
    // Verify lesson exists in modules
    const lessonExists = modules.some(m => m.lessons.some(l => l.id === lessonId));
    
    if (lessonExists && selectedLesson !== lessonId) {
      setSelectedLesson(lessonId);
      
      // Check cache first
      const cachedContent = lessonCache.get(lessonId);
      if (cachedContent) {
        // Update immediately if cached - no loading needed
        setCurrentLessonContent(cachedContent);
        setDisplayContent(cachedContent);
        setIsLoadingContent(false);
      } else {
        // Keep previous content visible while loading new one
        setIsLoadingContent(true);
        fetchLessonContent(lessonId);
      }
      
      // Expand module containing this lesson (only if not already expanded)
      setModules(prevModules => {
        const moduleWithLesson = prevModules.find(m => 
          m.lessons.some(l => l.id === lessonId)
        );
        
        if (moduleWithLesson && !moduleWithLesson.expanded) {
          return prevModules.map(m => {
            const hasLesson = m.lessons.some(l => l.id === lessonId);
            return hasLesson ? { ...m, expanded: true } : m;
          });
        }
        return prevModules;
      });
    } else if (!lessonExists && modules.length > 0) {
      // Redirect to first lesson if lesson not found
      const firstLesson = modules[0]?.lessons[0];
      if (firstLesson) {
        router.replace(`/learn/self/learningpath/lesson/${firstLesson.id}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, modules.length]);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/modules');
      if (response.ok) {
        const data = await response.json();
        // Expand module containing the current lesson
        if (lessonId) {
          const moduleWithLesson = data.find((m: Module) => 
            m.lessons.some((l: Lesson) => l.id === lessonId)
          );
          if (moduleWithLesson) {
            moduleWithLesson.expanded = true;
          }
        } else if (data.length > 0) {
          data[0].expanded = true;
        }
        setModules(data);
        
        // Set lesson from URL - fetchLessonContent will be called in useEffect
        if (lessonId && typeof lessonId === 'string') {
          setSelectedLesson(lessonId);
          // Check cache and set display content immediately
          const cached = lessonCache.get(lessonId);
          if (cached) {
            setCurrentLessonContent(cached);
            setDisplayContent(cached);
          }
        } else if (data.length > 0 && data[0].lessons.length > 0) {
          const firstLesson = data[0].lessons[0];
          router.replace(`/learn/self/learningpath/lesson/${firstLesson.id}`);
        }
      } else {
        const errorData = await response.json();
        console.error('Error fetching modules:', errorData);
        if (errorData.error) {
          alert(`Error: ${errorData.error}`);
        }
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      alert('Failed to load course content. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessonContent = async (lessonId: string) => {
    try {
      // Check cache first
      const cached = lessonCache.get(lessonId);
      if (cached) {
        setCurrentLessonContent(cached);
        setDisplayContent(cached);
        setIsLoadingContent(false);
        return;
      }
      
      setIsLoadingContent(true);
      const response = await fetch(`/api/lessons/${lessonId}`);
      if (response.ok) {
        const data = await response.json();
        const content: CourseContent = {
          title: data.title,
          content: data.content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        };
        
        // Cache the content
        setLessonCache(prev => new Map(prev).set(lessonId, content));
        setCurrentLessonContent(content);
        setDisplayContent(content);
      }
    } catch (error) {
      console.error('Error fetching lesson content:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, expanded: !m.expanded } : m
    ));
  };

  const handleLessonClick = useCallback((lessonId: string) => {
    // Update selected lesson immediately (before navigation)
    setSelectedLesson(lessonId);
    
    // Check cache first
    const cachedContent = lessonCache.get(lessonId);
    if (cachedContent) {
      setCurrentLessonContent(cachedContent);
      setDisplayContent(cachedContent);
      setIsLoadingContent(false);
    } else {
      setIsLoadingContent(true);
      fetchLessonContent(lessonId);
    }
    
    // Expand module containing this lesson
    setModules(prevModules => {
      const moduleWithLesson = prevModules.find(m => 
        m.lessons.some(l => l.id === lessonId)
      );
      
      if (moduleWithLesson && !moduleWithLesson.expanded) {
        return prevModules.map(m => {
          const hasLesson = m.lessons.some(l => l.id === lessonId);
          return hasLesson ? { ...m, expanded: true } : m;
        });
      }
      return prevModules;
    });
    
    // Use router.push() for URL update - layout prevents re-mounting
    router.push(`/learn/self/learningpath/lesson/${lessonId}`);
  }, [lessonCache, router]);

  const markLessonCompleted = async (lessonId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      
      if (response.ok) {
        // Update modules state directly instead of refetching
        setModules(prevModules => 
          prevModules.map(module => {
            const updatedLessons = module.lessons.map(lesson => 
              lesson.id === lessonId ? { ...lesson, completed } : lesson
            );
            
            // Recalculate progress
            const completedLessons = updatedLessons.filter(l => l.completed).length;
            const totalLessons = updatedLessons.length;
            const progress = totalLessons > 0 
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0;
            
            return {
              ...module,
              lessons: updatedLessons,
              progress,
            };
          })
        );
      }
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  };

  // Memoize calculations to prevent unnecessary re-renders
  const allLessons = useMemo(() => 
    modules.flatMap(m => m.lessons), 
    [modules]
  );
  
  const currentLessonIndex = useMemo(() => 
    selectedLesson 
      ? allLessons.findIndex(l => l.id === selectedLesson)
      : -1,
    [selectedLesson, allLessons]
  );
  
  const canGoPrevious = useMemo(() => currentLessonIndex > 0, [currentLessonIndex]);
  const canGoNext = useMemo(() => 
    currentLessonIndex < allLessons.length - 1, 
    [currentLessonIndex, allLessons.length]
  );

  const navigateLesson = useCallback((direction: 'prev' | 'next') => {
    if (direction === 'prev' && canGoPrevious) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      handleLessonClick(prevLesson.id);
    } else if (direction === 'next' && canGoNext) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      handleLessonClick(nextLesson.id);
    }
  }, [canGoPrevious, canGoNext, allLessons, currentLessonIndex, handleLessonClick]);

  const currentLessonTitle = useMemo(() => {
    if (!selectedLesson) return 'Select a lesson';
    const lesson = allLessons.find(l => l.id === selectedLesson);
    return lesson?.title || 'Select a lesson';
  }, [selectedLesson, allLessons]);

  const contextValue: LearningPathContextType = {
    modules,
    selectedLesson,
    currentLessonContent: displayContent || currentLessonContent,
    isLoading,
    isLoadingContent,
    searchQuery,
    lessonCache,
    handleLessonClick,
    toggleModule,
    setSearchQuery,
    markLessonCompleted,
    navigateLesson,
    canGoPrevious,
    canGoNext,
    currentLessonTitle,
  };

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
    <LearningPathContext.Provider value={contextValue}>
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar 
          modules={modules}
          selectedLesson={selectedLesson}
          onLessonClick={handleLessonClick}
          onToggleModule={toggleModule}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMarkLessonCompleted={markLessonCompleted}
        />
        {children}
      </div>
    </LearningPathContext.Provider>
  );
}

