'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LearnSelfLevelsRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/learn/self/learningpath');
  }, [router]);

  return null;
}

