'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

export default function TeacherCourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<{ name: string; teacherId: string } | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/teacher/courses/${courseId}`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'TEACHER') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated' && courseId) {
      fetchCourse();
    }
  }, [status, router, courseId, session]);

  const fetchCourse = async () => {
    try {
      setIsLoadingCourse(true);
      const response = await fetch(`/api/courses/${courseId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/learn/classroom/teacher/courses');
          return;
        }
        throw new Error('Failed to fetch course');
      }

      const courseData = await response.json();
      setCourse(courseData);

      // Verify teacher owns this course
      if (courseData.teacherId !== session?.user?.id) {
        router.push('/learn/classroom/teacher/courses');
      }
    } catch (err) {
      console.error('Error fetching course:', err);
      router.push('/learn/classroom/teacher/courses');
    } finally {
      setIsLoadingCourse(false);
    }
  };

  if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'TEACHER')) {
    return null;
  }

  if (status === 'loading' || isLoadingCourse) {
    return null;
  }

  if (!course || course.teacherId !== session?.user?.id) {
    return null;
  }

  // Nested layout - ไม่ต้อง render sidebar และ wrapper อีก เพราะ parent layout จัดการให้แล้ว
  // แค่ส่ง courseId และ courseName ไปให้ children ใช้
  return <>{children}</>;
}

