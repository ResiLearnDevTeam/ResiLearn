'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function LearnRedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return; // รอจนกว่าจะโหลด session เสร็จ

    const role = session?.user?.role;

    if (role === 'STUDENT') {
      router.push('/learn/classroom/courses');
    } else if (role === 'TEACHER') {
      router.push('/learn/classroom/teacher/courses');
    } else {
      router.push('/learning-mode');
    }
  }, [status, session, router]);

  // ✅ เพิ่มหน้า Loading สวย ๆ ระหว่างรอ Redirect
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
}
