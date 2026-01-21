'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  Dumbbell,
  FileText,
  Bell,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
} from 'lucide-react';

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

interface ClassroomSidebarProps {
  courseId?: string;
  courseName?: string; // For backward compatibility
  modules?: Module[];
  selectedLesson?: string | null;
  onLessonClick?: (lessonId: string) => void;
  onToggleModule?: (moduleId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMarkLessonCompleted?: (lessonId: string, completed: boolean) => void;
}

export default function ClassroomSidebar({ 
  courseId: propCourseId, 
  courseName,
  modules = [],
  selectedLesson,
  onLessonClick,
  onToggleModule,
  searchQuery = '',
  onSearchChange,
  onMarkLessonCompleted
}: ClassroomSidebarProps = {}) {
  const pathname = usePathname();
  const params = useParams();
  const { data: session } = useSession();
  const isTeacher = session?.user?.role === 'TEACHER';
  const modeHref = isTeacher ? '/learn/classroom/teacher/courses' : '/learning-mode';
  const modeLabel = isTeacher ? 'โหมดห้องเรียน' : 'เลือกโหมดการเรียนรู้';
  const courseId = propCourseId || (params?.courseId as string | undefined);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Check if we're on learning path page (including lesson pages)
  const isLearningPathPage = pathname?.startsWith(`/learn/classroom/courses/${courseId}/learningpath`) || false;
  // Initialize expanded state - expand if on learning path page, otherwise allow manual toggle
  const [isLearningPathExpanded, setIsLearningPathExpanded] = useState(isLearningPathPage);
  const [localModules, setLocalModules] = useState<Module[]>(modules);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  
  // Sync modules from props
  useEffect(() => {
    if (modules.length > 0) {
      setLocalModules(modules);
    }
  }, [modules]);

  // Auto-expand when navigating to learning path page
  useEffect(() => {
    if (isLearningPathPage) {
      setIsLearningPathExpanded(true);
    }
  }, [isLearningPathPage]);

  // Fetch modules when expanded and no modules available
  useEffect(() => {
    if (isLearningPathExpanded && localModules.length === 0 && !isLoadingModules && courseId) {
      fetchModules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLearningPathExpanded]);

  const fetchModules = async () => {
    try {
      setIsLoadingModules(true);
      const response = await fetch(`/api/courses/${courseId}/learningpath/progress`);
      if (response.ok) {
        const data = await response.json();
        const modulesData = data.modules || [];
        // Set expanded for first module if none are expanded
        if (modulesData.length > 0 && !modulesData.some((m: Module) => m.expanded)) {
          modulesData[0].expanded = true;
        }
        setLocalModules(modulesData);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleToggleModule = (moduleId: string) => {
    setLocalModules(localModules.map(m => 
      m.id === moduleId ? { ...m, expanded: !m.expanded } : m
    ));
    onToggleModule?.(moduleId);
  };
  
  // Filter modules/lessons based on search query
  const filteredModules = searchQuery
    ? localModules.map(module => ({
        ...module,
        lessons: module.lessons.filter(lesson =>
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(module => module.lessons.length > 0)
    : localModules;

  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Initialize sidebar width from localStorage
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('classroom-sidebar-width');
      const initialWidth = saved ? parseInt(saved, 10) : 288;
      setSidebarWidth(initialWidth);
      document.documentElement.style.setProperty('--sidebar-width', `${initialWidth}px`);
    }
  }, []);

  // Save width to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('classroom-sidebar-width', sidebarWidth.toString());
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
    const minWidth = 240;
    const maxWidth = 480;

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

  // Fetch course name if not provided
  const [course, setCourse] = useState<{ name: string } | null>(null);
  useEffect(() => {
    if (courseId && !courseName) {
      fetch(`/api/courses/${courseId}`)
        .then(res => res.json())
        .then(data => setCourse(data))
        .catch(() => {});
    }
  }, [courseId, courseName]);

  const displayCourseName = courseName || course?.name || 'หลักสูตร';

  const navigation = courseId ? [
    {
      name: 'แดชบอร์ด',
      href: `/learn/classroom/courses/${courseId}/dashboard`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'บทเรียน',
      href: `/learn/classroom/courses/${courseId}/learningpath`,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: 'ฝึกฝน',
      href: `/learn/classroom/courses/${courseId}/practice`,
      icon: <Dumbbell className="h-5 w-5" />,
    },
    {
      name: 'งานที่ได้รับมอบหมาย',
      href: `/learn/classroom/courses/${courseId}/assignments`,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'ประกาศ',
      href: `/learn/classroom/courses/${courseId}/announcements`,
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: 'เพื่อนร่วมชั้น',
      href: `/learn/classroom/courses/${courseId}/classmates`,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'ตั้งค่า',
      href: `/learn/classroom/courses/${courseId}/settings`,
      icon: <Settings className="h-5 w-5" />,
    },
  ] : [];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-xl bg-blue-600 p-2.5 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl active:scale-95 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
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
          {/* Logo and Course Name */}
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6 bg-gradient-to-r from-blue-50/50 to-white">
            <div className="flex-1 min-w-0">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent transition-all duration-200 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 block"
              >
                ResiLearn
              </Link>
              {courseId && (
                <div className="mt-1 text-xs text-gray-600 truncate" title={displayCourseName}>
                  {displayCourseName}
                </div>
              )}
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto scrollbar-thin">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const isLearningPathItem = item.href === `/learn/classroom/courses/${courseId}/learningpath`;

              return (
                <div key={item.name}>
                  {isLearningPathItem ? (
                    <div>
                      <div className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <span className={`flex-shrink-0 transition-colors ${
                            isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                          }`}>
                            {item.icon}
                          </span>
                          <span className="truncate">{item.name}</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsLearningPathExpanded(!isLearningPathExpanded);
                          }}
                          className="p-1.5 rounded-lg hover:bg-blue-100 transition-all duration-200 active:scale-95 flex-shrink-0"
                          title={isLearningPathExpanded ? 'Collapse outline' : 'Expand outline'}
                        >
                          {isLearningPathExpanded ? (
                            <ChevronUp className="h-4 w-4 text-blue-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                          )}
                        </button>
                      </div>

                      {/* Course Outline - Expandable submenu */}
                      <div
                        className={`mt-2 ml-2 pl-3 border-l-2 border-blue-200 space-y-2.5 transition-all duration-300 ease-in-out overflow-hidden ${
                          isLearningPathExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        {/* Search */}
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="ค้นหาบทเรียน"
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                          />
                        </div>

                        {/* My Knowledge Check */}
                        <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-100 shadow-sm mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <svg className="h-3.5 w-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              <span className="text-xs font-semibold text-gray-700">ตรวจสอบความรู้</span>
                            </div>
                          </div>

                          <Link
                            href={`/learn/classroom/courses/${courseId}/practice`}
                            className="w-full mb-2 flex items-center justify-center gap-2 px-2 py-1.5 rounded-md bg-blue-600 text-xs font-medium text-white hover:bg-blue-700 transition-colors active:scale-95 shadow-sm"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>เริ่มทดสอบ</span>
                          </Link>

                          <Link
                            href={`/learn/classroom/courses/${courseId}/practice`}
                            className="w-full flex items-center justify-center gap-2 px-2 py-1.5 rounded-md bg-white border border-blue-200 text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors active:scale-95"
                          >
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>ดูประวัติ</span>
                          </Link>
                        </div>

                        {/* Modules */}
                        {isLoadingModules ? (
                          <div className="py-4 text-center">
                            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="mt-2 text-xs text-gray-500">กำลังโหลดบทเรียน...</p>
                          </div>
                        ) : localModules.length > 0 ? (
                          filteredModules.length > 0 ? (
                            <div className="space-y-3">
                              {filteredModules.map((module) => {
                              const completedLessons = module.lessons.filter(l => l.completed).length;
                              const totalLessons = module.lessons.length;
                              const isActiveModule = module.expanded || module.lessons.some(l => l.id === selectedLesson);

                              return (
                                <div
                                  key={module.id}
                                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                                    isActiveModule
                                      ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100'
                                      : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100'
                                  }`}
                                >
                                  {/* Module Header */}
                                  <button
                                    onClick={() => handleToggleModule(module.id)}
                                    className={`w-full p-4 flex items-center justify-between transition-colors ${
                                      isActiveModule ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex-1 text-left min-w-0 pr-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className={`text-sm font-bold truncate leading-tight ${
                                          isActiveModule ? 'text-blue-900' : 'text-gray-700'
                                        }`}>
                                          {module.title}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                          <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                              module.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                            }`}
                                            style={{ width: `${module.progress}%` }}
                                          />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 flex-shrink-0 min-w-[3rem] text-right">
                                          {completedLessons}/{totalLessons}
                                        </span>
                                      </div>
                                    </div>
                                    {module.expanded ? (
                                      <ChevronUp className={`h-4 w-4 flex-shrink-0 transition-transform ${
                                        isActiveModule ? 'text-blue-500' : 'text-gray-400'
                                      }`} />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 transition-transform" />
                                    )}
                                  </button>

                                  {/* Module Lessons */}
                                  <div
                                    className={`transition-all duration-300 ease-in-out ${
                                      module.expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                  >
                                    <div className="border-t border-gray-100 bg-white p-2 space-y-1">
                                      {module.lessons.map((lesson) => {
                                        const isActive = selectedLesson === lesson.id;

                                        return (
                                          <Link
                                            key={lesson.id}
                                            href={`/learn/classroom/courses/${courseId}/learningpath/lesson/${lesson.id}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              onLessonClick?.(lesson.id);
                                              setIsMobileOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-all duration-200 ${
                                              isActive
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                          >
                                            <div className={`h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center border transition-colors ${
                                              lesson.completed
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : isActive
                                                  ? 'border-blue-500 bg-white'
                                                  : 'border-gray-300 bg-white'
                                            }`}>
                                              {lesson.completed && <Check className="h-3 w-3" />}
                                              {!lesson.completed && isActive && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                                            </div>
                                            <span className="flex-1 truncate">{lesson.title}</span>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            </div>
                          ) : (
                            <div className="py-4 text-center">
                              <p className="text-xs text-gray-500">ไม่พบบทเรียนที่ค้นหา</p>
                            </div>
                          )
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-xs text-gray-500">ยังไม่มีบทเรียน</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`}
                  >
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
              href="/learn/classroom"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <ChevronLeft className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium">กลับไปหน้าหลักสูตร</span>
            </Link>
            <Link
              href={modeHref}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <GraduationCap className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="font-medium">{modeLabel}</span>
            </Link>
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' });
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">ออกจากระบบ</span>
            </button>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          ref={resizeRef}
          onMouseDown={handleMouseDown}
          className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-blue-300/50 transition-all duration-200 group lg:block hidden ${
            isResizing ? 'bg-blue-400 w-1' : ''
          }`}
          style={{ touchAction: 'none' }}
          title="Drag to resize sidebar"
        >
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 h-16 w-0.5 bg-blue-400 rounded-full transition-all ${
              isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          />
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}

