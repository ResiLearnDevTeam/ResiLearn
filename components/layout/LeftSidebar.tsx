'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { Search, ChevronDown, ChevronUp, Check, RefreshCw, BarChart3, History } from 'lucide-react';
import KnowledgeCheckHistory from '@/components/features/KnowledgeCheckHistory';

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

interface LeftSidebarProps {
  modules?: Module[];
  selectedLesson?: string | null;
  onLessonClick?: (lessonId: string) => void;
  onToggleModule?: (moduleId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMarkLessonCompleted?: (lessonId: string, completed: boolean) => void;
}

export default function LeftSidebar({ 
  modules = [], 
  selectedLesson, 
  onLessonClick, 
  onToggleModule,
  searchQuery = '',
  onSearchChange,
  onMarkLessonCompleted
}: LeftSidebarProps = {}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Check if we're on learning path page (including lesson pages)
  const isLearningPathPage = pathname?.startsWith('/learn/self/learningpath') || false;
  const [isLearningPathExpanded, setIsLearningPathExpanded] = useState(isLearningPathPage);
  const [isKnowledgeCheckHistoryOpen, setIsKnowledgeCheckHistoryOpen] = useState(false);
  const isLearningPath = isLearningPathPage;
  
  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(288); // Default 288px (w-72)
  const [isResizing, setIsResizing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Initialize sidebar width from localStorage after mount (to prevent hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-width');
      const initialWidth = saved ? parseInt(saved, 10) : 288;
      setSidebarWidth(initialWidth);
      document.documentElement.style.setProperty('--sidebar-width', `${initialWidth}px`);
    }
  }, []);

  // Save width to localStorage and update CSS variable when width changes
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('sidebar-width', sidebarWidth.toString());
      document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    }
  }, [sidebarWidth, isMounted]);

  // Handle resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    const minWidth = 240; // Minimum width
    const maxWidth = 480; // Maximum width
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/learn/self/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Learning Path',
      href: '/learn/self/learningpath',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: 'Practice',
      href: '/learn/self/practice',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-xl bg-orange-600 p-2.5 text-white shadow-lg transition-all duration-200 hover:bg-orange-700 hover:shadow-xl active:scale-95 lg:hidden"
        aria-label="Toggle menu"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={{ 
          width: isMounted ? `${sidebarWidth}px` : '288px',
          transition: isResizing ? 'none' : 'width 0.2s ease-out, transform 0.3s ease-in-out'
        }}
        className={`fixed left-0 top-0 z-40 h-screen bg-white shadow-xl lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isResizing ? 'select-none' : ''}`}
        suppressHydrationWarning
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6 bg-gradient-to-r from-orange-50/50 to-white">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent transition-all duration-200 hover:from-orange-600 hover:via-orange-700 hover:to-orange-800"
            >
              ResiLearn
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => {
              // Check if active - for learning path, also check if pathname starts with it
              const isActive = item.href === '/learn/self/learningpath' 
                ? pathname?.startsWith('/learn/self/learningpath')
                : pathname === item.href;
              const isLearningPathItem = item.href === '/learn/self/learningpath';
              
              return (
                <div key={item.name}>
                  {isLearningPathItem ? (
                    <div>
                      <div className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                            {item.icon}
                          </span>
                          <span className="truncate">{item.name}</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsLearningPathExpanded(!isLearningPathExpanded);
                          }}
                          className="p-1.5 rounded-lg hover:bg-orange-100 transition-all duration-200 active:scale-95 flex-shrink-0"
                          title={isLearningPathExpanded ? 'Collapse outline' : 'Expand outline'}
                        >
                          {isLearningPathExpanded ? (
                            <ChevronUp className="h-4 w-4 text-orange-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-orange-600" />
                          )}
                        </button>
                      </div>
                      
                      {/* Course Outline - Expandable submenu */}
                      {isLearningPathExpanded && modules.length > 0 && (
                        <div className="mt-2 ml-2 pl-3 border-l-2 border-orange-200 space-y-2.5 animate-fade-in">
                          {/* Search */}
                          <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search course outline"
                              value={searchQuery}
                              onChange={(e) => onSearchChange?.(e.target.value)}
                              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                            />
                          </div>

                          {/* My Knowledge Check */}
                          <div className="p-2.5 rounded-lg bg-gradient-to-br from-orange-50 to-orange-50/50 border border-orange-100 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-3.5 w-3.5 text-orange-600" />
                                <span className="text-xs font-semibold text-gray-700">Knowledge Check</span>
                              </div>
                              <button className="p-1 rounded-md hover:bg-orange-100 transition-colors active:scale-95">
                                <RefreshCw className="h-3 w-3 text-gray-500 hover:text-orange-600 transition-colors" />
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                setIsKnowledgeCheckHistoryOpen(true);
                                setIsMobileOpen(false);
                              }}
                              className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded-md bg-white border border-orange-200 text-xs font-medium text-orange-700 hover:bg-orange-50 transition-colors active:scale-95"
                            >
                              <History className="h-3 w-3" />
                              <span>View History</span>
                            </button>
                          </div>

                          {/* Modules */}
                          <div className="space-y-2">
                            {modules.map((module) => {
                              const completedLessons = module.lessons.filter(l => l.completed).length;
                              const totalLessons = module.lessons.length;
                              const isActiveModule = module.expanded && module.lessons.some(l => l.id === selectedLesson);
                              
                              return (
                                <div 
                                  key={module.id} 
                                  className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                                    isActiveModule
                                      ? 'bg-orange-50/50 border-orange-200 shadow-md'
                                      : 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                                  }`}
                                >
                                  {/* Module Header */}
                                  <button
                                    onClick={() => onToggleModule?.(module.id)}
                                    className={`w-full p-3 flex items-center justify-between transition-colors ${
                                      isActiveModule ? 'hover:bg-orange-50' : 'hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex-1 text-left min-w-0 pr-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className={`text-sm font-bold text-gray-900 truncate leading-tight ${
                                          isActiveModule ? 'text-orange-800' : ''
                                        }`}>
                                          {module.title}
                                        </div>
                                        {totalLessons > 0 && (
                                          <span className={`text-xs font-semibold flex-shrink-0 ${
                                            isActiveModule ? 'text-orange-700' : 'text-gray-500'
                                          }`}>
                                            {completedLessons}/{totalLessons}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500 shadow-sm"
                                            style={{ width: `${module.progress}%` }}
                                          />
                                        </div>
                                        <span className="text-xs font-semibold text-orange-600 flex-shrink-0 min-w-[3rem] text-right">
                                          {module.progress}%
                                        </span>
                                      </div>
                                    </div>
                                    {module.expanded ? (
                                      <ChevronUp className={`h-4 w-4 flex-shrink-0 ${
                                        isActiveModule ? 'text-orange-600' : 'text-gray-400'
                                      }`} />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    )}
                                  </button>

                                  {/* Module Lessons */}
                                  {module.expanded && (
                                    <div className={`border-t p-2 space-y-0 ${
                                      isActiveModule 
                                        ? 'border-orange-200 bg-orange-50/30' 
                                        : 'border-gray-200 bg-white'
                                    }`}>
                                      {module.lessons.map((lesson, index) => {
                                        const isActive = selectedLesson === lesson.id;
                                        const isLast = index === module.lessons.length - 1;
                                        
                                        return (
                                          <div key={lesson.id} className="relative flex items-center">
                                            {/* Vertical dashed line connecting checkboxes */}
                                            {!isLast && (
                                              <div className={`absolute left-[7px] top-6 w-0.5 h-full border-l border-dashed ${
                                                isActiveModule ? 'border-orange-300' : 'border-gray-300'
                                              }`} />
                                            )}
                                            
                                            <button
                                              onMouseEnter={() => {
                                                // Prefetch lesson content on hover
                                                if (typeof window !== 'undefined' && !lesson.completed) {
                                                  fetch(`/api/lessons/${lesson.id}`, { method: 'GET' }).catch(() => {});
                                                }
                                              }}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                onLessonClick?.(lesson.id);
                                                setIsMobileOpen(false);
                                              }}
                                              onContextMenu={(e) => {
                                                e.preventDefault();
                                                // Copy lesson URL to clipboard
                                                const url = `${window.location.origin}/learn/self/learningpath/lesson/${lesson.id}`;
                                                navigator.clipboard.writeText(url);
                                              }}
                                              onDoubleClick={(e) => {
                                                e.stopPropagation();
                                                if (onMarkLessonCompleted) {
                                                  onMarkLessonCompleted(lesson.id, !lesson.completed);
                                                }
                                              }}
                                              className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center gap-3 transition-all duration-150 relative z-10 ${
                                                isActive
                                                  ? 'bg-orange-100 border border-orange-400 text-orange-800 font-semibold shadow-sm'
                                                  : lesson.completed
                                                  ? 'hover:bg-orange-50/70 text-gray-700 border border-transparent hover:border-orange-200'
                                                  : 'hover:bg-gray-50 text-gray-600 border border-transparent hover:border-gray-200'
                                              }`}
                                            >
                                              {lesson.completed ? (
                                                <div className="h-4 w-4 flex-shrink-0 rounded-full bg-orange-500 flex items-center justify-center">
                                                  <Check className="h-3 w-3 text-white" />
                                                </div>
                                              ) : (
                                                <div className="h-4 w-4 flex-shrink-0 border-2 border-gray-400 rounded-full bg-white" />
                                              )}
                                              <span className="flex-1 truncate leading-relaxed">{lesson.title}</span>
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-orange-600' : 'text-gray-500 group-hover:text-orange-600'}`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-100 p-4 space-y-1.5 bg-gray-50/50">
            <Link
              href="/learning-mode"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <svg className="h-4 w-4 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Modes</span>
            </Link>
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' });
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          onMouseDown={handleMouseDown}
          className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-orange-300/50 transition-all duration-200 group lg:block hidden ${
            isResizing ? 'bg-orange-400 w-1' : ''
          }`}
          style={{ touchAction: 'none' }}
          title="Drag to resize sidebar"
        >
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-16 w-0.5 bg-orange-400 rounded-full transition-all ${
            isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`} />
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Knowledge Check History Modal */}
      <KnowledgeCheckHistory
        isOpen={isKnowledgeCheckHistoryOpen}
        onClose={() => setIsKnowledgeCheckHistoryOpen(false)}
      />
    </>
  );
}
