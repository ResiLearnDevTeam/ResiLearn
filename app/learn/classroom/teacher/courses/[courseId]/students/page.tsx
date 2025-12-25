'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Course } from '@/types/classroom';
import { Users, ArrowLeft, Mail, User, Search, Download, Filter, TrendingUp, BarChart3, X } from 'lucide-react';

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

type SortField = 'name' | 'progress' | 'completedAssignments' | 'enrolledAt';
type SortDirection = 'asc' | 'desc';
type ProgressFilter = 'all' | '0-25' | '26-50' | '51-75' | '76-100';
type AssignmentFilter = 'all' | 'completed' | 'in-progress' | 'not-started';

export default function TeacherStudentsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

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

  // Calculate statistics
  const statistics = useMemo(() => {
    if (students.length === 0) {
      return {
        total: 0,
        averageProgress: 0,
        totalCompletedAssignments: 0,
        totalAssignments: 0,
      };
    }

    const totalCompleted = students.reduce((sum, s) => sum + s.completedAssignments, 0);
    const totalAssignments = students.reduce((sum, s) => sum + s.totalAssignments, 0);
    const averageProgress = Math.round(
      students.reduce((sum, s) => sum + s.progress, 0) / students.length
    );

    return {
      total: students.length,
      averageProgress,
      totalCompletedAssignments: totalCompleted,
      totalAssignments: totalAssignments > 0 ? totalAssignments / students.length : 0,
    };
  }, [students]);

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = [...students];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.studentId?.toLowerCase().includes(query)
      );
    }

    // Progress filter
    if (progressFilter !== 'all') {
      const [min, max] = progressFilter.split('-').map(Number);
      filtered = filtered.filter((s) => s.progress >= min && s.progress <= max);
    }

    // Assignment filter
    if (assignmentFilter !== 'all') {
      filtered = filtered.filter((s) => {
        if (assignmentFilter === 'completed') {
          return s.completedAssignments === s.totalAssignments && s.totalAssignments > 0;
        } else if (assignmentFilter === 'in-progress') {
          return s.completedAssignments > 0 && s.completedAssignments < s.totalAssignments;
        } else if (assignmentFilter === 'not-started') {
          return s.completedAssignments === 0;
        }
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name || a.email;
          bValue = b.name || b.email;
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'completedAssignments':
          aValue = a.completedAssignments;
          bValue = b.completedAssignments;
          break;
        case 'enrolledAt':
          aValue = new Date(a.enrolledAt).getTime();
          bValue = new Date(b.enrolledAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [students, searchQuery, progressFilter, assignmentFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/students/export`);
      if (!response.ok) throw new Error('Failed to export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students-${courseId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการ export');
    }
  };

  const handleRemoveStudent = async (userId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
      <div className="mb-6">
        <Link
          href={`/learn/classroom/teacher/courses/${courseId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับไปหน้าหลักสูตร
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">จัดการนักเรียน</h1>
            </div>
            <p className="mt-2 text-gray-600">{course.name}</p>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">จำนวนนักเรียน</p>
              <p className="text-xl font-bold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">ความคืบหน้าเฉลี่ย</p>
              <p className="text-xl font-bold text-gray-900">{statistics.averageProgress}%</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">งานที่เสร็จแล้ว</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.round(statistics.totalCompletedAssignments)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600">งานทั้งหมด</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.round(statistics.totalAssignments)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาตามชื่อ, email, หรือรหัสนักเรียน"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            กรอง
            {showFilters && <X className="h-4 w-4" />}
          </button>
        </div>

        {showFilters && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  กรองตามความคืบหน้า
                </label>
                <select
                  value={progressFilter}
                  onChange={(e) => setProgressFilter(e.target.value as ProgressFilter)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="0-25">0-25%</option>
                  <option value="26-50">26-50%</option>
                  <option value="51-75">51-75%</option>
                  <option value="76-100">76-100%</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  กรองตามสถานะงาน
                </label>
                <select
                  value={assignmentFilter}
                  onChange={(e) => setAssignmentFilter(e.target.value as AssignmentFilter)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="completed">เสร็จทั้งหมด</option>
                  <option value="in-progress">กำลังทำ</option>
                  <option value="not-started">ยังไม่เริ่ม</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      {students.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-md">
          <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <p className="text-gray-600">ยังไม่มีนักเรียนลงทะเบียนในหลักสูตรนี้</p>
        </div>
      ) : filteredAndSortedStudents.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-md">
          <Search className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <p className="text-gray-600">ไม่พบบทเรียนที่ค้นหา</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setProgressFilter('all');
              setAssignmentFilter('all');
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            ล้างการกรอง
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-md">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    ชื่อนักเรียน
                    {sortField === 'name' && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  <button
                    onClick={() => handleSort('progress')}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    ความคืบหน้า
                    {sortField === 'progress' && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  <button
                    onClick={() => handleSort('completedAssignments')}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    งานที่เสร็จ
                    {sortField === 'completedAssignments' && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                  <button
                    onClick={() => handleSort('enrolledAt')}
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    ลงทะเบียนเมื่อ
                    {sortField === 'enrolledAt' && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredAndSortedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <Link
                      href={`/learn/classroom/teacher/courses/${courseId}/students/${student.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {student.name || 'ไม่มีชื่อ'}
                        </div>
                        {student.studentId && (
                          <div className="text-xs text-gray-500">รหัส: {student.studentId}</div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{student.email}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-[100px]">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium text-gray-700">{student.progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full transition-all ${
                              student.progress === 100
                                ? 'bg-green-500'
                                : student.progress >= 50
                                ? 'bg-blue-500'
                                : 'bg-orange-500'
                            }`}
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {student.completedAssignments}/{student.totalAssignments}
                    </div>
                    {student.totalAssignments > 0 && (
                      <div className="text-xs text-gray-500">
                        {Math.round((student.completedAssignments / student.totalAssignments) * 100)}%
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {new Date(student.enrolledAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/learn/classroom/teacher/courses/${courseId}/students/${student.id}`}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-blue-700"
                      >
                        ดูรายละเอียด
                      </Link>
                      <button
                        onClick={(e) => handleRemoveStudent(student.id, e)}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-red-600"
                      >
                        ลบออก
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Results count */}
      {filteredAndSortedStudents.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          แสดง {filteredAndSortedStudents.length} จาก {students.length} คน
        </div>
      )}
      </main>
    </div>
  );
}
