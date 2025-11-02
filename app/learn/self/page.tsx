'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LearnSelfRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/learn/self/dashboard');
  }, [router]);

  return null;
}
