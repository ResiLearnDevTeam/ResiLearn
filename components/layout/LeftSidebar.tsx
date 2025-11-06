'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Search, ChevronDown, ChevronUp, Check, RefreshCw, BarChart3 } from 'lucide-react';

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
}

export default function LeftSidebar({ 
  modules = [], 
  selectedLesson, 
  onLessonClick, 
  onToggleModule,
  searchQuery = '',
  onSearchChange
}: LeftSidebarProps = {}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLearningPathExpanded, setIsLearningPathExpanded] = useState(pathname === '/learn/self/learningpath');
  const isLearningPath = pathname === '/learn/self/learningpath';

  const navigation = [
    {
      name: 'Dashboard',
      href: '/learn/self/dashboard',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Learning Path',
      href: '/learn/self/learningpath',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      name: 'Practice',
      href: '/learn/self/practice',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        className="fixed top-4 left-4 z-50 rounded-lg bg-orange-600 p-2 text-white lg:hidden"
        aria-label="Toggle menu"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
              ResiLearn
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden"
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const isLearningPathItem = item.href === '/learn/self/learningpath';
              
              return (
                <div key={item.name}>
                  {isLearningPathItem ? (
                    <div>
                      <div className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="flex items-center gap-3 flex-1"
                        >
                          {item.icon}
                          {item.name}
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsLearningPathExpanded(!isLearningPathExpanded);
                          }}
                          className="p-1 hover:bg-orange-200 rounded transition-colors"
                          title={isLearningPathExpanded ? 'Collapse outline' : 'Expand outline'}
                        >
                          {isLearningPathExpanded ? (
                            <ChevronUp className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 flex-shrink-0" />
                          )}
                        </button>
                      </div>
                      
                      {/* Course Outline - Expandable submenu */}
                      {isLearningPathExpanded && modules.length > 0 && (
                        <div className="mt-1 ml-4 pl-4 border-l-2 border-orange-200 space-y-3">
                          {/* Search */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search course outline"
                              value={searchQuery}
                              onChange={(e) => onSearchChange?.(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 border border-orange-200 rounded-lg text-xs bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                          </div>

                          {/* My Knowledge Check */}
                          <div className="p-2 rounded-lg bg-orange-50 border border-orange-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <BarChart3 className="h-3.5 w-3.5 text-orange-600" />
                                <span className="text-xs font-medium text-gray-700">My Knowledge Check</span>
                              </div>
                              <button className="p-0.5 hover:bg-orange-100 rounded transition-colors">
                                <RefreshCw className="h-3 w-3 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Modules */}
                          <div className="space-y-1.5">
                            {modules.map((module) => (
                              <div key={module.id} className="border-2 border-orange-100 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                                {/* Module Header */}
                                <button
                                  onClick={() => onToggleModule?.(module.id)}
                                  className="w-full p-2 flex items-center justify-between hover:bg-orange-50 transition-colors rounded-t-lg"
                                >
                                  <div className="flex-1 text-left min-w-0">
                                    <div className="text-xs font-semibold mb-1 text-gray-900 truncate">{module.title}</div>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all"
                                          style={{ width: `${module.progress}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium text-orange-600 flex-shrink-0">{module.progress}%</span>
                                    </div>
                                  </div>
                                  {module.expanded ? (
                                    <ChevronUp className="h-3 w-3 text-orange-600 ml-2 flex-shrink-0" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3 text-orange-600 ml-2 flex-shrink-0" />
                                  )}
                                </button>

                                {/* Module Lessons */}
                                {module.expanded && (
                                  <div className="border-t border-orange-100 p-1.5 space-y-1 bg-orange-50/30 rounded-b-lg">
                                    {module.lessons.map((lesson) => {
                                      const isActive = selectedLesson === lesson.id;
                                      return (
                                        <button
                                          key={lesson.id}
                                          onClick={() => {
                                            onLessonClick?.(lesson.id);
                                            setIsMobileOpen(false);
                                          }}
                                          className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center gap-2 transition-all ${
                                            isActive
                                              ? 'bg-orange-100 border-2 border-orange-500 text-orange-700 font-medium shadow-sm'
                                              : lesson.completed
                                              ? 'hover:bg-orange-50 text-gray-700 border border-transparent hover:border-orange-200'
                                              : 'hover:bg-orange-50 text-gray-500 border border-transparent hover:border-orange-200'
                                          }`}
                                        >
                                          {lesson.completed ? (
                                            <Check className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                          ) : (
                                            <div className="h-3 w-3 flex-shrink-0 border border-gray-300 rounded-full" />
                                          )}
                                          <span className="flex-1 truncate">{lesson.title}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-orange-100 text-orange-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-2">
            <Link
              href="/learning-mode"
              className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Modes
            </Link>
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' });
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}

