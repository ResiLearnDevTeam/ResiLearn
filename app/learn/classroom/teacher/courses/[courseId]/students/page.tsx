'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { Course } from '@/types/classroom';
import { Users, ArrowLeft, Mail, User } from 'lucide-react';

interface Student {
  id: string;
  name: string | null;
  email: string;
  studentId: string | null;
  enrolledAt: string;
  progress: number;
  completedAssignments: number;
  totalAssignments: number;
  attempts: Array<{
    levelId: string;
    score: number;
    passed: boolean;
    completedAt: string;
  }>;
}

export default function TeacherStudentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/teacher/courses/${courseId}/students`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'TEACHER') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router, courseId, session]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [courseResponse, studentsResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/students`),
      ]);

      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course');
      }

      if (!studentsResponse.ok) {
        throw new Error('Failed to fetch students');
      }

      const courseData = await courseResponse.json();
      const studentsData = await studentsResponse.json();

      setCourse(courseData);
      setStudents(studentsData);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = async (userId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนคนนี้ออกจากหลักสูตร?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/enrollments/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove student');
      }

      fetchData(); // Refresh
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบนักเรียน');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <ClassroomSidebar courseId={courseId} />
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
        <ClassroomSidebar courseId={courseId} />
        <div
          className="flex-1 transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-red-600 mb-4">{error || 'ไม่พบหลักสูตร'}</p>
              <Link
                href="/learn/classroom/teacher/courses"
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
      <ClassroomSidebar courseId={courseId} />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าหลักสูตร
            </Link>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">จัดการนักเรียน</h1>
          </div>
          <p className="mt-2 text-gray-600">{course.name}</p>
        </div>

        {/* Students List */}
        {students.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-md">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="text-gray-600">ยังไม่มีนักเรียนลงทะเบียนในหลักสูตรนี้</p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/learn/classroom/teacher/courses/${courseId}/students/${student.id}`}
                className="block rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {student.name || 'ไม่มีชื่อ'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{student.email}</span>
                        </div>
                        {student.studentId && (
                          <p className="text-xs text-gray-500">รหัสนักเรียน: {student.studentId}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">ความคืบหน้า</p>
                        <p className="text-lg font-bold text-gray-900">{student.progress}%</p>
                        <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">งานที่เสร็จ</p>
                        <p className="text-lg font-bold text-gray-900">
                          {student.completedAssignments}/{student.totalAssignments}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">ลงทะเบียนเมื่อ</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(student.enrolledAt).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveStudent(student.id);
                      }}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
                    >
                      ลบออก
                    </button>
                    <span className="text-xs text-blue-600 text-center">คลิกเพื่อดูรายละเอียด</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
