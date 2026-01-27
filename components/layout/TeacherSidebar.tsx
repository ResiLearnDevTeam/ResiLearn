'use client';

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Bell,
  BarChart3,
  Settings,
  GraduationCap,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
} from 'lucide-react';
import { Course } from '@/types/classroom';
import { getCourseStatus } from '@/lib/classroom';

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

interface TeacherSidebarProps {
  courseId?: string;
  courseName?: string;
  modules?: Module[];
  selectedLesson?: string | null;
  onLessonClick?: (lessonId: string) => void;
  onToggleModule?: (moduleId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onMarkLessonCompleted?: (lessonId: string, completed: boolean) => void;
}

export default function TeacherSidebar({ 
  courseId: propCourseId, 
  courseName,
  modules = [],
  selectedLesson,
  onLessonClick,
  onToggleModule,
  searchQuery = '',
  onSearchChange,
  onMarkLessonCompleted
}: TeacherSidebarProps = {}) {
  const pathname = usePathname();
  const params = useParams();
  const { data: session } = useSession();
  const courseId = propCourseId || (params?.courseId as string | undefined);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
      const saved = localStorage.getItem('teacher-sidebar-width');
      const initialWidth = saved ? parseInt(saved, 10) : 288;
      setSidebarWidth(initialWidth);
      document.documentElement.style.setProperty('--sidebar-width', `${initialWidth}px`);
    }
  }, []);

  // Save width to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('teacher-sidebar-width', sidebarWidth.toString());
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

  // Determine navigation based on pathname
  const isCourseDetailMode = courseId && pathname?.startsWith(`/learn/classroom/teacher/courses/${courseId}`);

  // Courses list state and fetching
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [isCoursesExpanded, setIsCoursesExpanded] = useState(true); // Default expanded

  // Check if we're on courses list page
  const isCoursesListPage = pathname === '/learn/classroom/teacher/courses';
  // Check if we're on any courses page (list or detail)
  const isOnCoursesPage = pathname?.startsWith('/learn/classroom/teacher/courses');

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Fetch courses when on courses list page only
  useEffect(() => {
    if (isCoursesListPage && session?.user?.role === 'TEACHER') {
      fetchCourses();
    }
  }, [isCoursesListPage, session?.user?.role]);

  // Learning path state
  const isLearningPathPage = pathname?.startsWith(`/learn/classroom/teacher/courses/${courseId}/learningpath`) || false;
  const [isLearningPathExpanded, setIsLearningPathExpanded] = useState(isLearningPathPage);
  const [localModules, setLocalModules] = useState<Module[]>(modules);

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

  // Filter modules based on search query
  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) {
      return localModules;
    }
    const query = searchQuery.toLowerCase();
    return localModules
      .map(module => ({
        ...module,
        lessons: module.lessons.filter(lesson =>
          lesson.title.toLowerCase().includes(query)
        ),
      }))
      .filter(module => module.lessons.length > 0);
  }, [localModules, searchQuery]);

  const handleToggleModule = (moduleId: string) => {
    if (onToggleModule) {
      onToggleModule(moduleId);
    } else {
      setLocalModules(prevModules =>
        prevModules.map(m =>
          m.id === moduleId ? { ...m, expanded: !m.expanded } : m
        )
      );
    }
  };
  
  const navigation = isCourseDetailMode ? [
    {
      name: 'แดชบอร์ด',
      href: `/learn/classroom/teacher/courses/${courseId}/dashboard`,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'ประกาศ',
      href: `/learn/classroom/teacher/courses/${courseId}/announcements`,
      icon: <Bell className="h-5 w-5" />,
    },
    {
      name: 'งาน',
      href: `/learn/classroom/teacher/courses/${courseId}/assignments`,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: 'บทเรียน',
      href: `/learn/classroom/teacher/courses/${courseId}/learningpath`,
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: 'นักเรียน',
      href: `/learn/classroom/teacher/courses/${courseId}/students`,
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: 'การวิเคราะห์',
      href: `/learn/classroom/teacher/courses/${courseId}/analytics`,
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: 'ตั้งค่า',
      href: `/learn/classroom/teacher/courses/${courseId}/settings`,
      icon: <Settings className="h-5 w-5" />,
    },
  ] : [
    {
      name: 'หลักสูตร',
      href: '/learn/classroom/teacher/courses',
      icon: <GraduationCap className="h-5 w-5" />,
    },
  ];

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
                className="text-xl font-bold transition-all duration-200 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 inline-flex items-baseline gap-0.5"
              >
                <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent">ResiLearn</span>
                {isOnCoursesPage && <sup className="text-xs font-normal text-blue-600 leading-none">Teacher</sup>}
              </Link>
              {isCourseDetailMode && courseId && (
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
              const isLearningPathItem = item.href === `/learn/classroom/teacher/courses/${courseId}/learningpath`;

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

                      {/* Lessons Section - Expandable submenu */}
                      <div
                        className={`mt-2 ml-2 pl-3 border-l-2 border-blue-200 space-y-2.5 transition-all duration-300 ease-in-out overflow-hidden ${
                          isLearningPathExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        {/* Search */}
                        {onSearchChange && (
                          <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="ค้นหาบทเรียน"
                              value={searchQuery}
                              onChange={(e) => onSearchChange(e.target.value)}
                              className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                            />
                          </div>
                        )}

                        {/* Modules */}
                        {localModules.length > 0 ? (
                          filteredModules.length > 0 ? (
                            <div className="space-y-3">
                              {filteredModules.map((module) => {
                                const isActiveModule = module.expanded || module.lessons.some((l: Lesson) => l.id === selectedLesson);

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
                                        <div className={`text-sm font-bold truncate leading-tight ${
                                          isActiveModule ? 'text-blue-900' : 'text-gray-700'
                                        }`}>
                                          {module.title}
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
                                        {module.lessons.map((lesson: Lesson) => {
                                          const isActive = selectedLesson === lesson.id;

                                          return (
                                            <Link
                                              key={lesson.id}
                                              href={`/learn/classroom/teacher/courses/${courseId}/learningpath/lesson/${lesson.id}`}
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
                                              <div className="h-5 w-5 flex-shrink-0 rounded-full bg-green-500 border-green-500">
                                              </div>
                                              <span className="truncate flex-1">{lesson.title}</span>
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
                            <div className="py-4 text-center text-sm text-gray-500">
                              ไม่พบบทเรียนที่ค้นหา
                            </div>
                          )
                        ) : (
                          <div className="py-4 text-center">
                            <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                            <p className="mt-2 text-xs text-gray-500">กำลังโหลดบทเรียน...</p>
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
                      <span className={`flex-shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}

            {/* Courses List Section - Show only on courses list page */}
            {isCoursesListPage && (
              <div className="mt-4">
                {/* Courses List Header */}
                <div className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isCoursesListPage
                    ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}>
                <Link
                  href="/learn/classroom/teacher/courses"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 flex-1 min-w-0"
                >
                  <span className={`flex-shrink-0 transition-colors ${
                    isCoursesListPage ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                  }`}>
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <span className="truncate">รายการหลักสูตร</span>
                  {(() => {
                    const activeCourses = courses.filter((c) => c.status !== 'end');
                    return activeCourses.length > 0 && (
                      <span className={`text-xs ml-1 ${
                        isCoursesListPage ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        ({activeCourses.length})
                      </span>
                    );
                  })()}
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsCoursesExpanded(!isCoursesExpanded);
                  }}
                  className={`p-1.5 rounded-lg transition-all duration-200 active:scale-95 flex-shrink-0 ${
                    isCoursesListPage
                      ? 'hover:bg-blue-200'
                      : 'hover:bg-blue-100'
                  }`}
                  title={isCoursesExpanded ? 'Collapse courses' : 'Expand courses'}
                >
                  {isCoursesExpanded ? (
                    <ChevronUp className={`h-4 w-4 ${
                      isCoursesListPage ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`} />
                  ) : (
                    <ChevronDown className={`h-4 w-4 ${
                      isCoursesListPage ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`} />
                  )}
                </button>
              </div>

              {/* Courses List Items - Expandable submenu */}
              <div
                className={`mt-2 ml-2 pl-3 space-y-3 transition-all duration-300 ease-in-out overflow-hidden border-l-2 ${
                  isCoursesListPage
                    ? 'border-blue-200'
                    : 'border-gray-200'
                } ${
                  isCoursesExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                  {isLoadingCourses ? (
                    <div className="py-4 text-center">
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
                      <p className="mt-2 text-xs text-gray-500">กำลังโหลดหลักสูตร...</p>
                    </div>
                  ) : (() => {
                    const activeCourses = courses.filter((c) => c.status !== 'end');
                    return activeCourses.length > 0;
                  })() ? (
                    <div className="space-y-3">
                      {courses.filter((c) => c.status !== 'end').map((courseItem) => {
                        const isActiveCourse = courseId === courseItem.id;
                        const courseHref = `/learn/classroom/teacher/courses/${courseItem.id}`;
                        const status = getCourseStatus(courseItem);
                        const statusColors: Record<string, string> = {
                          Private: 'bg-yellow-100 text-yellow-700',
                          Published: 'bg-green-100 text-green-700',
                          Upcoming: 'bg-blue-100 text-blue-700',
                          Ended: 'bg-gray-100 text-gray-700',
                        };
                        const displayStatusMap: Record<string, string> = {
                          Private: 'Private',
                          Published: 'Public',
                        };
                        const displayStatus = displayStatusMap[status] || status;

                        return (
                          <div
                            key={courseItem.id}
                            className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                              isActiveCourse
                                ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100'
                                : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100'
                            }`}
                          >
                            <Link
                              href={courseHref}
                              onClick={() => setIsMobileOpen(false)}
                              className={`block p-3 transition-colors ${
                                isActiveCourse ? 'bg-blue-50/30' : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-bold truncate leading-tight ${
                                    isActiveCourse ? 'text-blue-900' : 'text-gray-700'
                                  }`}>
                                    {courseItem.name}
                                  </div>
                                  {courseItem.teacher && (
                                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                                      โดย {courseItem.teacher.name || courseItem.teacher.email}
                                    </div>
                                  )}
                                </div>
                                {displayStatus && (
                                  <span
                                    className={`ml-2 px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0 ${
                                      statusColors[status] || 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {displayStatus}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Users className="h-3 w-3" />
                                  <span>{courseItem.enrollmentCount || 0} คน</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <FileText className="h-3 w-3" />
                                  <span>{courseItem.assignmentCount || 0} งาน</span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs text-gray-500">ยังไม่มีหลักสูตร</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-100 p-4 space-y-1.5 bg-gray-50/50">
            {isCourseDetailMode && (
              <Link
                href="/learn/classroom/teacher/courses"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
                onClick={() => setIsMobileOpen(false)}
              >
                <ChevronLeft className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="font-medium">กลับไปหน้าหลักสูตร</span>
              </Link>
            )}
            <Link
              href="/learning-mode"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <svg className="h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">กลับไปหน้าเลือกโหมด</span>
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
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-16 w-0.5 bg-blue-400 rounded-full transition-all ${
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
    </>
  );
}

