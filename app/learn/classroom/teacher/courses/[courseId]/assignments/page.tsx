'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AssignmentList from '@/components/features/classroom/AssignmentList';
import { Course, CourseAssignment, CreateAssignmentData } from '@/types/classroom';
import { FileText, ArrowLeft, Plus, X } from 'lucide-react';

interface Level {
  id: string;
  number: number;
  name: string;
  description: string;
}

export default function TeacherAssignmentsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateAssignmentData>({
    levelId: '',
    title: '',
    description: '',
    dueDate: '',
    maxPoints: 100,
  });

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

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create assignment');
      }

      setShowCreateForm(false);
      setFormData({
        levelId: '',
        title: '',
        description: '',
        dueDate: '',
        maxPoints: 100,
      });
      fetchData(); // Refresh
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการสร้างงาน');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete assignment');
      }

      fetchData(); // Refresh
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบงาน');
    }
  };

  if (isLoading) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="w-full h-full px-4 py-6 lg:px-8">
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
    );
  }

  return (
    <div
      className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <main className="w-full h-full px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link
                href={`/learn/classroom/teacher/courses/${courseId}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับไปหน้าหลักสูตร
              </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">จัดการงาน</h1>
            </div>
            <p className="mt-2 text-gray-600">{course.name}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            สร้างงานใหม่
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">สร้างงานใหม่</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    เลือก Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.levelId}
                    onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">เลือก Level...</option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>
                        Level {level.number}: {level.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    ชื่องาน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="เช่น งาน Level 1: การอ่านค่าตัวต้านทาน 4 แถบ"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    คำอธิบาย
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="อธิบายรายละเอียดงาน..."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      กำหนดส่ง
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      คะแนนเต็ม
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxPoints}
                      onChange={(e) => setFormData({ ...formData, maxPoints: parseInt(e.target.value) || 100 })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังสร้าง...' : 'สร้างงาน'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignments List */}
        <AssignmentList
          assignments={assignments}
          courseId={courseId}
          isTeacherView={true}
        />
      </main>
    </div>
  );
}
