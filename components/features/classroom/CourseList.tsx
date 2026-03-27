'use client';

import { useState } from 'react';
import { Course } from '@/types/classroom';
import CourseCard from './CourseCard';
import { Search, Filter } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  showProgress?: boolean;
  emptyMessage?: string;
  isTeacherView?: boolean;
}

export default function CourseList({
  courses,
  showProgress = false,
  emptyMessage = 'ไม่มีหลักสูตร',
  isTeacherView = false,
}: CourseListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enrolled' | 'published'>('all');

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    // Search filter
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher?.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    if (filterStatus === 'enrolled' && !course.isEnrolled) return false;
    if (filterStatus === 'published' && !course.isPublished) return false;

    return true;
  });

  if (courses.length === 0) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-md">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาหลักสูตร..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">ทั้งหมด</option>
            <option value="enrolled">ที่ลงทะเบียนแล้ว</option>
            <option value="published">ที่เผยแพร่แล้ว</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {filteredCourses.length !== courses.length && (
        <p className="text-sm text-gray-600">
          แสดง {filteredCourses.length} จาก {courses.length} หลักสูตร
        </p>
      )}

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-md">
          <p className="text-gray-600">ไม่พบหลักสูตรที่ตรงกับการค้นหา</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} showProgress={showProgress} isTeacherView={isTeacherView} />
          ))}
        </div>
      )}
    </div>
  );
}

