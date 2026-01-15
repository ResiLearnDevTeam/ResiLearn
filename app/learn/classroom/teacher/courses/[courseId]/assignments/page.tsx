'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AssignmentList from '@/components/features/classroom/AssignmentList';
import AssignmentFormModal from '@/components/features/classroom/AssignmentFormModal';
import AssignmentStatistics from '@/components/features/classroom/AssignmentStatistics';
import AssignmentFilters from '@/components/features/classroom/AssignmentFilters';
import { Course, CourseAssignment, CreateAssignmentData } from '@/types/classroom';
import { FileText, ArrowLeft, Plus } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface Level {
  id: string;
  number: number;
  name: string;
  description: string;
}

export default function TeacherAssignmentsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<CourseAssignment | null>(null);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts' | 'overdue'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'level-based' | 'custom-quiz' | 'fixed-questions'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [courseResponse, assignmentsResponse, levelsResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/assignments`),
        fetch('/api/levels'),
      ]);

      if (!courseResponse.ok) throw new Error('Failed to fetch course');
      if (!assignmentsResponse.ok) throw new Error('Failed to fetch assignments');
      if (!levelsResponse.ok) throw new Error('Failed to fetch levels');

      const courseData = await courseResponse.json();
      const assignmentsData = await assignmentsResponse.json();
      const levelsData = await levelsResponse.json();

      setCourse(courseData);
      setAssignments(assignmentsData);
      setLevels(levelsData);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAssignment = async (data: CreateAssignmentData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          description: data.descriptionFormat === 'HTML' ? sanitizeHtml(data.description || '') : data.description,
          instructions: data.instructions ? sanitizeHtml(data.instructions) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assignment');
      }

      setShowCreateForm(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการสร้างงาน');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAssignment = async (data: CreateAssignmentData) => {
    if (!editingAssignment) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/assignments/${editingAssignment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          description: data.descriptionFormat === 'HTML' ? sanitizeHtml(data.description || '') : data.description,
          instructions: data.instructions ? sanitizeHtml(data.instructions) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update assignment');
      }

      setEditingAssignment(null);
      setShowCreateForm(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการแก้ไขงาน');
    } finally {
      setIsSubmitting(false);
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

    // Filter by type
    if (typeFilter === 'level-based' && assignment.assignmentType !== 'LEVEL_BASED') return false;
    if (typeFilter === 'custom-quiz' && assignment.assignmentType !== 'CUSTOM_QUIZ') return false;
    if (typeFilter === 'fixed-questions' && assignment.assignmentType !== 'FIXED_QUESTIONS') return false;

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
            {/* Back Button */}
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/dashboard`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าแดชบอร์ด
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">จัดการงาน</h1>
                    <p className="mt-1 text-gray-600">{course.name}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingAssignment(null);
                  setShowCreateForm(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:scale-[1.02]"
              >
                <Plus className="h-5 w-5" />
                สร้างงานใหม่
              </button>
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
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <AssignmentList
                assignments={sortedAssignments}
                courseId={courseId}
                isTeacherView={true}
                emptyMessage="ยังไม่มีงาน"
                onDelete={handleDeleteAssignment}
                onEdit={(assignment) => {
                  setEditingAssignment(assignment);
                  setShowCreateForm(true);
                }}
              />
            </div>
          </div>

          {/* Assignment Form Modal */}
          <AssignmentFormModal
            show={showCreateForm}
            onClose={() => {
              setShowCreateForm(false);
              setEditingAssignment(null);
            }}
            onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
            initialData={editingAssignment ? {
              assignmentType: editingAssignment.assignmentType || 'LEVEL_BASED',
              levelId: editingAssignment.levelId || '',
              title: editingAssignment.title,
              description: editingAssignment.description || '',
              descriptionFormat: editingAssignment.descriptionFormat || 'PLAIN',
              instructions: editingAssignment.instructions || '',
              dueDate: editingAssignment.dueDate || '',
              maxPoints: editingAssignment.maxPoints,
              priority: editingAssignment.priority || 'NORMAL',
              isPinned: editingAssignment.isPinned || false,
              isDraft: editingAssignment.isDraft || false,
              publishedAt: editingAssignment.publishedAt,
              attachments: editingAssignment.attachments || [],
              quizSettings: editingAssignment.quizSettings,
              questions: editingAssignment.questions,
              quizSettingsForFixed: editingAssignment.quizSettingsForFixed,
            } : undefined}
            levels={levels}
            isEditing={!!editingAssignment}
            isSubmitting={isSubmitting}
          />
        </main>
      </div>
    </div>
  );
}
