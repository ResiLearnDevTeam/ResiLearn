'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TeacherSidebar from '@/components/layout/TeacherSidebar';

export default function TeacherCoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/learn/classroom/teacher/courses')}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'TEACHER') {
      router.push('/learn/classroom');
    }
  }, [status, router, session]);

  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'TEACHER')) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      {children}
    </div>
  );
}

