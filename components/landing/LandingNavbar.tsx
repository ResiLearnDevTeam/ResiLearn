'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isTeacher = session?.user?.role === 'TEACHER';
  const modeHref = isTeacher ? '/learn/classroom/teacher/courses' : '/learning-mode';
  const modeLabel = isTeacher ? 'โหมดห้องเรียน' : 'เลือกโหมดการเรียนรู้';

  const navLinks = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/learn/self/learningpath', label: 'หลักสูตร' },
    { href: '/learn/self/practice', label: 'โหมดฝึกฝน' },
    { href: '/learn/self/learningpath', label: 'บทเรียน' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            ResiLearn
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href={modeHref}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                >
                  {modeLabel}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-5 py-2.5 rounded-lg text-gray-700 font-semibold hover:text-red-600 hover:bg-red-50 transition-all border border-gray-200 hover:border-red-200 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-lg text-gray-700 font-semibold hover:text-orange-600 transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-orange-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                {isAuthenticated ? (
                  <>
                    <Link
                      href={modeHref}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {modeLabel}
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMenuOpen(false);
                      }}
                      className="px-5 py-2.5 rounded-lg text-center text-gray-700 font-semibold hover:text-red-600 hover:bg-red-50 transition-all border border-gray-200 hover:border-red-200 flex items-center justify-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      ออกจากระบบ
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-5 py-2.5 rounded-lg text-center text-gray-700 font-semibold hover:text-orange-600 transition-colors border border-gray-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      เข้าสู่ระบบ
                    </Link>
                    <Link
                      href="/register"
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-center hover:from-orange-600 hover:to-orange-700 transition-all shadow-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      สมัครสมาชิก
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
