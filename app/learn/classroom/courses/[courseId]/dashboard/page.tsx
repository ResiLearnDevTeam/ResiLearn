'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import CourseProgressOverview from '@/components/classroom/CourseProgressOverview';
import CourseStatsOverview from '@/components/classroom/CourseStatsOverview';
import CourseActivityChart from '@/components/classroom/CourseActivityChart';
import RecentAssignments from '@/components/classroom/RecentAssignments';
import CourseAnalytics from '@/components/classroom/CourseAnalytics';
import { Course, CourseAssignment } from '@/types/classroom';

export default function StudentCourseDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [practiceSessions, setPracticeSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/learn/classroom/courses/${courseId}/dashboard`)}`);
    } else if (status === 'authenticated' && session?.user?.role !== 'STUDENT') {
      router.push('/learn/classroom');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router, courseId, session]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [courseRes, progressRes, assignmentsRes, sessionsRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/progress`),
        fetch(`/api/courses/${courseId}/assignments`),
        fetch(`/api/courses/${courseId}/practice/sessions`),
      ]);

      if (!courseRes.ok) {
        if (courseRes.status === 404) {
          throw new Error('ไม่พบหลักสูตร');
        }
        throw new Error('Failed to fetch course');
      }

      const courseData: Course = await courseRes.json();
      setCourse(courseData);

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }

      if (assignmentsRes.ok) {
        const assignmentsData: CourseAssignment[] = await assignmentsRes.json();
        setAssignments(assignmentsData);
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setPracticeSessions(sessionsData);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
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
              <button
                onClick={() => router.push('/learn/classroom')}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                กลับไปหน้าหลักสูตร
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const isEnrolled = course.isEnrolled || false;

  if (!isEnrolled) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <ClassroomSidebar courseName={course.name} />
        <div
          className="flex-1 transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-gray-600 mb-4">กรุณาลงทะเบียนเรียนเพื่อดูแดชบอร์ด</p>
              <button
                onClick={() => router.push(`/learn/classroom/courses/${courseId}`)}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                กลับไปหน้าหลักสูตร
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Calculate stats
  const completedAssignments = progress?.completedAssignments || 0;
  const totalAssignments = progress?.totalAssignments || 0;
  const earnedPoints = progress?.earnedPoints || 0;
  const totalPoints = progress?.totalPoints || 0;
  const overallProgress = progress?.progress || 0;
  
  // Calculate average score
  const assignmentScores = assignments
    .filter(a => a.completed && a.bestScore !== undefined)
    .map(a => a.bestScore || 0);
  const averageScore = assignmentScores.length > 0
    ? Math.round(assignmentScores.reduce((sum, score) => sum + score, 0) / assignmentScores.length)
    : 0;

  // Calculate total time spent (from quiz attempts and practice sessions)
  const totalTimeSpent = 0; // Will be calculated from API data

  // Calculate recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentActivity = practiceSessions.filter(s => 
    new Date(s.completedAt) >= sevenDaysAgo
  ).length;

  // Combine practice sessions and quiz attempts for activity chart
  const activityData = [...practiceSessions];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClassroomSidebar courseName={course.name} />

      <div
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
            <p className="text-gray-600">{course.name}</p>
          </div>

          {/* Progress Overview */}
          <div className="mb-6">
            <CourseProgressOverview
              progress={overallProgress}
              completedAssignments={completedAssignments}
              totalAssignments={totalAssignments}
              earnedPoints={earnedPoints}
              totalPoints={totalPoints}
              courseName={course.name}
            />
          </div>

          {/* Stats Overview */}
          <div className="mb-6">
            <CourseStatsOverview
              assignmentsCompleted={completedAssignments}
              totalAssignments={totalAssignments}
              totalTimeSpent={totalTimeSpent}
              averageScore={averageScore}
              recentActivity={recentActivity}
            />
          </div>

          {/* Activity Chart and Recent Assignments */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <CourseActivityChart data={activityData} />
            <RecentAssignments assignments={assignments} courseId={courseId} />
          </div>

          {/* Analytics */}
          <div className="mb-6">
            <CourseAnalytics courseId={courseId} />
          </div>
        </main>
      </div>
    </div>
  );
}

