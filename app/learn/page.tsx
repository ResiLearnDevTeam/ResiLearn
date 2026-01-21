'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function LearnRedirectPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (status !== 'authenticated') return;

    if (session?.user?.role === 'TEACHER') {
      router.replace('/learn/classroom/teacher/courses');
      return;
    }

    router.replace('/learning-mode');
  }, [router, session?.user?.role, status]);

  return null;
}
