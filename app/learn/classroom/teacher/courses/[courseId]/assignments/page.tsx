'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AssignmentList from '@/components/features/classroom/AssignmentList';
import AssignmentStatistics from '@/components/features/classroom/AssignmentStatistics';
import AssignmentFilters from '@/components/features/classroom/AssignmentFilters';
import { Course, CourseAssignment } from '@/types/classroom';
import { FileText, Rocket, ArrowRight } from 'lucide-react';

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 18) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

export default function TeacherAssignmentsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts' | 'overdue'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'practice' | 'exam'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [courseResponse, assignmentsResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/assignments`),
      ]);

      if (!courseResponse.ok) throw new Error('Failed to fetch course');
      if (!assignmentsResponse.ok) throw new Error('Failed to fetch assignments');

      const courseData = await courseResponse.json();
      const assignmentsData = await assignmentsResponse.json();

      setCourse(courseData);
      setAssignments(assignmentsData);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };


  const handleDeleteAssignment = async (assignment: CourseAssignment) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/assignments/${assignment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }

      fetchData();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบงาน');
    }
  };

  // Filter and search assignments
  const filteredAssignments = assignments.filter(assignment => {
    // Filter by status
    if (filter === 'published' && assignment.isDraft) return false;
    if (filter === 'drafts' && !assignment.isDraft) return false;
    if (filter === 'overdue') {
      if (!assignment.dueDate) return false;
      const dueDate = new Date(assignment.dueDate);
      const now = new Date();
      if (dueDate >= now || assignment.completed) return false;
    }

    // Filter by mode
    if (typeFilter === 'practice' && assignment.assignmentMode !== 'PRACTICE') return false;
    if (typeFilter === 'exam' && assignment.assignmentMode !== 'EXAM') return false;

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        assignment.title.toLowerCase().includes(query) ||
        (assignment.description && assignment.description.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Sort: Pinned first, then by priority, then by due date
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const priorityOrder = { HIGH: 3, NORMAL: 2, LOW: 1 };
    const aPriority = priorityOrder[a.priority || 'NORMAL'];
    const bPriority = priorityOrder[b.priority || 'NORMAL'];
    if (aPriority !== bPriority) return bPriority - aPriority;
    
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div
          className="w-full min-h-screen flex items-center justify-center transition-all duration-200 ease-out overflow-y-auto"
          style={{
            marginLeft: 'var(--sidebar-width, 288px)',
            width: 'calc(100% - var(--sidebar-width, 288px))'
          }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div
          className="w-full min-h-screen transition-all duration-200 ease-out overflow-y-auto"
          style={{
            marginLeft: 'var(--sidebar-width, 288px)',
            width: 'calc(100% - var(--sidebar-width, 288px))'
          }}
        >
          <main className="w-full h-full px-6 lg:px-12 xl:px-16 py-8">
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-red-600 mb-4">{error || 'ไม่พบหลักสูตร'}</p>
              <button
                onClick={() => router.push('/learn/classroom/teacher/courses')}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับไปหน้าหลักสูตร
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Calculate counts for filters
  const counts = {
    all: assignments.length,
    published: assignments.filter(a => !a.isDraft).length,
    drafts: assignments.filter(a => a.isDraft).length,
    overdue: assignments.filter(a => {
      if (!a.dueDate || a.completed) return false;
      const dueDate = new Date(a.dueDate);
      const now = new Date();
      return dueDate < now;
    }).length,
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div
        className="w-full min-h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{
          marginLeft: 'var(--sidebar-width, 288px)',
          width: 'calc(100% - var(--sidebar-width, 288px))'
        }}
      >
        <main className="w-full min-h-screen px-6 lg:px-12 xl:px-16 py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {getTimeGreeting()}, <span className="text-blue-600">{course.name}</span>
                </h1>
                <p className="mt-2 text-gray-600">จัดการงานที่มอบหมายให้กับนักเรียน</p>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
                {new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>

            {/* Header with Create Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">จัดการงาน</h2>
                  <p className="text-sm text-gray-500">สร้างและจัดการงานที่มอบหมาย</p>
                </div>
              </div>
              <Link
                href={`/learn/classroom/teacher/courses/${courseId}/assignments/new`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl"
              >
                <Rocket className="h-5 w-5" />
                สร้างงานใหม่
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Statistics Cards */}
            <AssignmentStatistics assignments={assignments} />

            {/* Filter and Search */}
            <AssignmentFilters
              filter={filter}
              typeFilter={typeFilter}
              searchQuery={searchQuery}
              onFilterChange={setFilter}
              onTypeFilterChange={setTypeFilter}
              onSearchChange={setSearchQuery}
              counts={counts}
            />

            {/* Assignments List */}
            <AssignmentList
              assignments={sortedAssignments}
              courseId={courseId}
              isTeacherView={true}
              emptyMessage="ยังไม่มีงาน"
              onDelete={handleDeleteAssignment}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
