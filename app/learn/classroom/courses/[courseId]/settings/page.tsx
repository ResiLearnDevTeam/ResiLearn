'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { Course } from '@/types/classroom';
import { Settings, ArrowLeft, User, Mail, Calendar } from 'lucide-react';

export default function StudentCourseSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/courses/${courseId}/settings`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'STUDENT') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router, courseId, session]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [courseRes, progressRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/progress`),
      ]);

      if (!courseRes.ok) {
        throw new Error('Failed to fetch course');
      }

      const courseData = await courseRes.json();
      setCourse(courseData);

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setEnrollment(progressData);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveCourse = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากหลักสูตรนี้?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/enrollments/leave`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to leave course');
      }

      router.push('/learn/classroom');
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการออกจากหลักสูตร');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <ClassroomSidebar courseName={course?.name} />
        <div
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
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
        <ClassroomSidebar courseName={course?.name} />
        <div
          className="flex-1 transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-red-600 mb-4">{error || 'ไม่พบหลักสูตร'}</p>
              <Link
                href="/learn/classroom"
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

  const isEnrolled = course.isEnrolled || false;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClassroomSidebar courseName={course.name} />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/learn/classroom/courses/${courseId}/dashboard`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าแดชบอร์ด
            </Link>
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">ตั้งค่า</h1>
            </div>
            <p className="mt-2 text-gray-600">{course.name}</p>
          </div>

          {/* Course Info */}
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">ข้อมูลหลักสูตร</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">ชื่อหลักสูตร</p>
                <p className="text-lg font-semibold text-gray-900">{course.name}</p>
              </div>
              {course.description && (
                <div>
                  <p className="text-sm font-medium text-gray-600">คำอธิบาย</p>
                  <p className="text-gray-900">{course.description}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-600">รหัสชั้นเรียน</p>
                <p className="text-lg font-mono font-semibold text-blue-600">{course.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">วันที่เริ่มต้น</p>
                <p className="text-gray-900">
                  {new Date(course.startDate).toLocaleDateString('th-TH')}
                </p>
              </div>
              {course.endDate && (
                <div>
                  <p className="text-sm font-medium text-gray-600">วันที่สิ้นสุด</p>
                  <p className="text-gray-900">
                    {new Date(course.endDate).toLocaleDateString('th-TH')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Enrollment Info */}
          {isEnrolled && enrollment && (
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-gray-900">ข้อมูลการลงทะเบียน</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">ความคืบหน้า</p>
                  <p className="text-2xl font-bold text-gray-900">{enrollment.progress || 0}%</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${enrollment.progress || 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">งานที่เสร็จแล้ว</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {enrollment.completedAssignments || 0} / {enrollment.totalAssignments || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">การจัดการ</h2>
            {isEnrolled ? (
              <button
                onClick={handleLeaveCourse}
                className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-red-600"
              >
                ออกจากหลักสูตร
              </button>
            ) : (
              <p className="text-gray-600">คุณยังไม่ได้ลงทะเบียนในหลักสูตรนี้</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

