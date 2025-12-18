'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function ClassroomLeftSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const role = session?.user?.role;

  // จับ courseId จาก URL
  const match = pathname.match(/^\/learn\/classroom\/teacher\/courses\/([^\/]+)/);
  const courseId = match ? match[1] : null;

  // ตรวจสอบหน้า create
  const isCreatePage = pathname.includes("/create");

  const navigation: {
    name: string;
    href: string;
    icon: JSX.Element;
  }[] = [];


  // =====================
  // TEACHER
  // =====================
  if (role === 'TEACHER') {
    navigation.push(
      {
        name: 'Home',
        href: '/learn/classroom/teacher/courses',
        icon: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 
              001 1h3m10-11l2 2m-2-2v10a1 1 0 
              01-1 1h-3m-6 0a1 1 0 
              001-1v-4a1 1 0 
              011-1h2a1 1 0 
              011 1v4a1 1 0 
              001 1m-6 0h6"
            />
          </svg>
        ),
      },
      {
        name: 'Create Course',
        href: '/learn/classroom/teacher/courses/create',
        icon: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        ),
      }
    );
    // ⭐ แสดงปุ่มเฉพาะหน้า courseId และไม่ใช่ /create
    if (courseId && !isCreatePage) {
      navigation.push(
        {
          name: 'Student Setting',
          href: `/learn/classroom/teacher/courses/${courseId}/students`,
          icon: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" />
          </svg>
          ),
        },
        {
          name: 'Assignment',
          href: `/learn/classroom/teacher/courses/${courseId}/assignments`,
          icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
            </svg>
          ),
        },
        {
          name: 'Settings',
          href: `/learn/classroom/teacher/courses/${courseId}/settings`,
          icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        {
          name: 'Announcements',
          href: `/learn/classroom/teacher/courses/${courseId}/announcements`,
          icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V8a6 6 0 10-12 0v6c0 .386-.149.735-.395 1.004L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
            </svg>
          ),
        }
      );
    }
  }

  // =====================
  // STUDENT (เว้นไว้ก่อน)
  // =====================
  if (role === 'STUDENT') {
    navigation.push(
      {
        name: 'Home',
        href: '/learn/classroom/courses',
        icon: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 
              001 1h3m10-11l2 2m-2-2v10a1 1 0 
              01-1 1h-3m-6 0a1 1 0 
              001-1v-4a1 1 0 
              011-1h2a1 1 0 
              011 1v4a1 1 0 
              001 1m-6 0h6"
            />
          </svg>
        ),
      },
      {
        name: 'join Course',
        href: '/learn/classroom/courses/enroll',
        icon: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        ),
      }
    );
  }

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
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white shadow-lg transition-transform duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">
              ResiLearn
            </Link>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden">
              <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 space-y-2">
            <Link href="/learning-mode" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Modes
            </Link>

            <button onClick={() => signOut({ callbackUrl: '/' })} className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
}
