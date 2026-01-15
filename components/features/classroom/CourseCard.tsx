'use client';

import Link from 'next/link';
import { Course } from '@/types/classroom';
import { formatCourseDate, getCourseStatus, isCourseActive } from '@/lib/classroom';
import { BookOpen, Users, Calendar, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
  isTeacherView?: boolean;
}

export default function CourseCard({ course, showProgress = false, isTeacherView = false }: CourseCardProps) {
  const status = getCourseStatus(course);
  const isActive = isCourseActive(course);
  const [copied, setCopied] = useState(false);
  const statusColors = {
    Published: 'bg-green-100 text-green-700',
    Upcoming: 'bg-blue-100 text-blue-700',
    Ended: 'bg-gray-100 text-gray-700',
    Private: 'bg-yellow-100 text-yellow-700',
  };

  const href = isTeacherView
    ? `/learn/classroom/teacher/courses/${course.id}`
    : course.isEnrolled
    ? `/learn/classroom/courses/${course.id}/dashboard`
    : `/learn/classroom/courses/${course.id}`;

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(course.code).then(() => {
      setCopied(true);
      toast.success('คัดลอกรหัสชั้นเรียนสำเร็จ!', {
        description: `รหัส: ${course.code}`,
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('ไม่สามารถคัดลอกได้');
    });
  };

  const cardContent = (
    <div className="group relative h-full overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        {/* Status Badge */}
        <div className="absolute right-4 top-4 z-10">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
              statusColors[status as keyof typeof statusColors] || statusColors.Private
            }`}
          >
            {status}
          </span>
        </div>

        {/* Course Image or Icon */}
        {course.image ? (
          <div className="mb-4 h-32 w-full overflow-hidden rounded-lg">
            <img
              src={course.image}
              alt={course.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
        )}

        {/* Course Info */}
        <div className="space-y-3">
          <div>
            <h3 className="mb-1 text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {course.name}
            </h3>
            {course.teacher && (
              <p className="text-sm text-gray-600">โดย {course.teacher.name || course.teacher.email}</p>
            )}
          </div>

          {course.description && (
            <p className="line-clamp-2 text-sm text-gray-600">{course.description}</p>
          )}

          {/* Course Code - More prominent for teachers */}
          {isTeacherView ? (
            <div className="relative rounded-lg bg-blue-50 border-2 border-blue-200 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-700 mb-1">รหัสชั้นเรียน</p>
                  <p className="font-mono text-lg font-bold text-blue-900">{course.code}</p>
                  <p className="text-xs text-blue-600 mt-1">แชร์รหัสนี้ให้นักเรียนเพื่อเข้าร่วม</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="relative z-20 flex-shrink-0 rounded-lg bg-blue-100 hover:bg-blue-200 p-2 transition-colors duration-200 group"
                  title="คัดลอกรหัสชั้นเรียน"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-mono font-semibold">รหัส: {course.code}</span>
            </div>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.enrollmentCount || 0} คน</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.assignmentCount || 0} งาน</span>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>เริ่ม: {formatCourseDate(course.startDate)}</span>
            </div>
            {course.endDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>สิ้นสุด: {formatCourseDate(course.endDate)}</span>
              </div>
            )}
          </div>

          {/* Progress (for enrolled students) */}
          {showProgress && course.isEnrolled && course.progress !== undefined && (
            <div className="pt-2">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-gray-600">ความคืบหน้า</span>
                <span className="font-semibold text-gray-900">{course.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
  );

  // Wrap card in Link for both teacher and student views
  return (
    <Link href={href}>
      {cardContent}
    </Link>
  );
}
