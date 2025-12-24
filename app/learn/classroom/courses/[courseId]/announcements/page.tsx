'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LeftSidebar from '@/components/layout/LeftSidebar';
import AnnouncementList from '@/components/features/classroom/AnnouncementList';
import { Announcement, Course } from '@/types/classroom';
import { Bell, ArrowLeft } from 'lucide-react';

export default function StudentCourseAnnouncementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/courses/${courseId}/announcements`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'STUDENT') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router, courseId, session]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [courseResponse, announcementsResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/announcements`),
      ]);

      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course');
      }

      if (!announcementsResponse.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const courseData = await courseResponse.json();
      const announcementsData = await announcementsResponse.json();

      setCourse(courseData);
      setAnnouncements(announcementsData);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LeftSidebar />
        <div
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <LeftSidebar />
        <div
          className="flex-1 transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-red-600 mb-4">{error || 'ไม่พบหลักสูตร'}</p>
              <Link
                href={`/learn/classroom/courses/${courseId}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับไปหน้าหลักสูตร
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftSidebar />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Link
            href={`/learn/classroom/courses/${courseId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้าหลักสูตร
          </Link>

          <div className="mb-6 flex items-center gap-2">
            <Bell className="h-6 w-6 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">ประกาศ</h1>
          </div>
          <p className="mb-6 text-gray-600">{course.name}</p>

          <AnnouncementList announcements={announcements} />
        </main>
      </div>
    </div>
  );
}
