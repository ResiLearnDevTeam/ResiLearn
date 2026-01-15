'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Course } from '@/types/classroom';
import { formatCourseDate, getCourseStatus, isCourseActive } from '@/lib/classroom';
import { BookOpen, Users, Calendar, CheckCircle2, Clock, Copy, Check } from 'lucide-react';

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
    Active: 'bg-green-100 text-green-700',
    Upcoming: 'bg-blue-100 text-blue-700',
    Ended: 'bg-gray-100 text-gray-700',
    Draft: 'bg-yellow-100 text-yellow-700',
  };

  const href = isTeacherView
    ? `/learn/classroom/teacher/courses/${course.id}/dashboard`
    : `/learn/classroom/courses/${course.id}`;

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(course.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Link href={href} className="h-full block">
      <div className="group relative h-full flex flex-col overflow-hidden rounded-xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        {/* Status Badge */}
        <div className="absolute right-3 top-3 z-10">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
              statusColors[status as keyof typeof statusColors] || statusColors.Draft
            }`}
          >
            {status}
          </span>
        </div>

        {/* Course Image or Icon */}
        {course.image ? (
          <div className="mb-4 h-24 w-full flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={course.image}
              alt={course.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="mb-4 flex h-24 w-full flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <BookOpen className="h-10 w-10 text-blue-600" />
          </div>
        )}

        {/* Course Info */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Title and Teacher */}
          <div className="mb-2">
            <h3 className="mb-1 text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {course.name}
            </h3>
            {course.teacher && (
              <p className="text-sm text-gray-600 leading-tight">โดย {course.teacher.name || course.teacher.email}</p>
            )}
          </div>

          {/* Description - Fixed height to maintain consistent spacing */}
          <div className="mb-2 min-h-[2.5rem]">
            {course.description ? (
              <p className="line-clamp-2 text-sm text-gray-500 leading-snug">{course.description}</p>
            ) : (
              <div className="h-0"></div>
            )}
          </div>

          {/* Course Code - For teacher view */}
          {isTeacherView ? (
            <div className="mb-3 rounded-lg bg-blue-50 border border-blue-200 p-2.5 flex-shrink-0">
              <p className="text-xs font-medium text-blue-700 mb-1 leading-tight">รหัสชั้นเรียน</p>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-lg font-bold text-blue-900 leading-tight flex-1">{course.code}</p>
                <button
                  onClick={handleCopyCode}
                  className="flex-shrink-0 p-1.5 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all duration-200 active:scale-95"
                  title="คัดลอกรหัส"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-1 leading-tight">แชร์รหัสนี้ให้นักเรียนเพื่อเข้าร่วม</p>
            </div>
          ) : (
            <div className="mb-2">
              <span className="text-sm text-gray-500 font-mono font-semibold">รหัส: {course.code}</span>
            </div>
          )}

          {/* Stats */}
          <div className="mb-2.5 flex items-center gap-4 text-sm text-gray-600 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{course.enrollmentCount || 0} คน</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>{course.assignmentCount || 0} งาน</span>
            </div>
          </div>

          {/* Dates */}
          <div className="mb-2 flex flex-col gap-1 text-sm text-gray-500 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="leading-tight">เริ่ม: {formatCourseDate(course.startDate)}</span>
            </div>
            {course.endDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="leading-tight">สิ้นสุด: {formatCourseDate(course.endDate)}</span>
              </div>
            )}
          </div>

          {/* Progress (for enrolled students) - Only if needed */}
          {showProgress && course.isEnrolled && course.progress !== undefined && (
            <div className="mb-2 flex-shrink-0">
              <div className="mb-1 flex items-center justify-between text-sm">
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

          {/* Enrollment Status - Only if enrolled */}
          {course.isEnrolled && (
            <div className="flex items-center gap-1.5 text-sm text-green-600 flex-shrink-0">
              <CheckCircle2 className="h-4 w-4" />
              <span>ลงทะเบียนแล้ว</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
