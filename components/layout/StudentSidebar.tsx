'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import {
  GraduationCap,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

export default function StudentSidebar() {
  const pathname = usePathname();
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
      const saved = localStorage.getItem('student-sidebar-width');
      const initialWidth = saved ? parseInt(saved, 10) : 288;
      setSidebarWidth(initialWidth);
      document.documentElement.style.setProperty('--sidebar-width', `${initialWidth}px`);
    }
  }, []);

  // Save width to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('student-sidebar-width', sidebarWidth.toString());
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

  const navigation = [
    {
      name: 'ห้องเรียน',
      href: '/learn/classroom',
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
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6 bg-gradient-to-r from-blue-50/50 to-white">
            <div className="flex-1 min-w-0">
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 bg-clip-text text-transparent transition-all duration-200 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 block"
              >
                ResiLearn
              </Link>
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

              return (
                <Link
                  key={item.name}
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
