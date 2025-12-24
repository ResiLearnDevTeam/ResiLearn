'use client';

import { Course } from '@/types/classroom';
import { formatCourseDate, getCourseStatus, isCourseActive } from '@/lib/classroom';
import { BookOpen, Users, Calendar, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';

interface CourseDetailProps {
  course: Course;
  isEnrolled?: boolean;
  progress?: number;
  onEnroll?: () => void;
  isTeacher?: boolean;
  isTeacherView?: boolean;
}

export default function CourseDetail({
  course,
  isEnrolled = false,
  progress = 0,
  onEnroll,
  isTeacher = false,
  isTeacherView = false,
}: CourseDetailProps) {
  const status = getCourseStatus(course);
  const isActive = isCourseActive(course);

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        {course.image && (
          <div className="mb-6 h-48 w-full overflow-hidden rounded-lg">
            <img
              src={course.image}
              alt={course.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : status === 'Upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : status === 'Ended'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {status}
                </span>
                {isEnrolled && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    <CheckCircle2 className="h-3 w-3" />
                    ลงทะเบียนแล้ว
                  </span>
                )}
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">{course.name}</h1>
              {course.teacher && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span>โดย {course.teacher.name || course.teacher.email}</span>
                </div>
              )}
            </div>
          </div>

          {course.description && (
            <p className="text-gray-700 leading-relaxed">{course.description}</p>
          )}

          {/* Course Code - More prominent for teachers */}
          {isTeacherView ? (
            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 p-4">
              <p className="text-sm font-semibold text-blue-700 mb-2">รหัสชั้นเรียน</p>
              <p className="font-mono text-2xl font-bold text-blue-900 mb-2">{course.code}</p>
              <p className="text-xs text-blue-600">แชร์รหัสนี้ให้นักเรียนเพื่อเข้าร่วมหลักสูตร</p>
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-700">รหัสหลักสูตร</p>
              <p className="font-mono text-lg font-bold text-gray-900">{course.code}</p>
            </div>
          )}

          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-50 p-4 text-center">
              <Users className="mx-auto mb-2 h-6 w-6 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{course.enrollmentCount || 0}</p>
              <p className="text-xs text-gray-600">นักเรียน</p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <BookOpen className="mx-auto mb-2 h-6 w-6 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">{course.assignmentCount || 0}</p>
              <p className="text-xs text-gray-600">งาน</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 text-center">
              <Calendar className="mx-auto mb-2 h-6 w-6 text-purple-600" />
              <p className="text-sm font-bold text-gray-900">
                {course.announcementCount || 0}
              </p>
              <p className="text-xs text-gray-600">ประกาศ</p>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">วันที่เริ่ม</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCourseDate(course.startDate)}
              </span>
            </div>
            {course.endDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">วันที่สิ้นสุด</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCourseDate(course.endDate)}
                </span>
              </div>
            )}
          </div>

          {/* Progress (for enrolled students) */}
          {isEnrolled && progress !== undefined && (
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">ความคืบหน้า</span>
                <span className="text-lg font-bold text-gray-900">{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isTeacher && !isEnrolled && isActive && (
              <button
                onClick={onEnroll}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              >
                ลงทะเบียนเรียน
              </button>
            )}
            {isTeacher && (
              <Link
                href={`/learn/classroom/teacher/courses/${course.id}`}
                className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
              >
                จัดการหลักสูตร
              </Link>
            )}
            {isEnrolled && (
              <Link
                href={`/learn/classroom/courses/${course.id}`}
                className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-center font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              >
                เข้าสู่หลักสูตร
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
