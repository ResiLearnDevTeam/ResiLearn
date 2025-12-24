'use client';

import Link from 'next/link';
import { CourseAssignment } from '@/types/classroom';
import { formatDateTime, isAssignmentOverdue, getDaysUntilDue } from '@/lib/classroom';
import { BookOpen, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface AssignmentCardProps {
  assignment: CourseAssignment;
  courseId: string;
  isTeacher?: boolean;
}

export default function AssignmentCard({
  assignment,
  courseId,
  isTeacher = false,
}: AssignmentCardProps) {
  const isOverdue = assignment.dueDate ? isAssignmentOverdue(assignment) : false;
  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isCompleted = assignment.completed || false;
  const bestScore = assignment.bestScore || 0;

  const levelHref = `/learn/self/levels/${assignment.level?.number}/quiz`;

  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                <CheckCircle2 className="h-3 w-3" />
                เสร็จแล้ว
              </span>
            )}
            {isOverdue && !isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                <AlertCircle className="h-3 w-3" />
                เกินกำหนด
              </span>
            )}
          </div>

          {assignment.description && (
            <p className="mb-3 text-sm text-gray-600 line-clamp-2">{assignment.description}</p>
          )}

          {/* Level Info */}
          {assignment.level && (
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="h-4 w-4" />
              <span>Level {assignment.level.number}: {assignment.level.name}</span>
            </div>
          )}

          {/* Due Date */}
          {assignment.dueDate && (
            <div className="mb-3 flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className={isOverdue ? 'font-semibold text-red-600' : 'text-gray-600'}>
                กำหนดส่ง: {formatDateTime(assignment.dueDate)}
              </span>
              {daysUntilDue !== null && daysUntilDue > 0 && !isOverdue && (
                <span className="text-xs text-gray-500">
                  (เหลือ {daysUntilDue} วัน)
                </span>
              )}
            </div>
          )}

          {/* Score (for students) */}
          {!isTeacher && isCompleted && (
            <div className="mb-3 rounded-lg bg-green-50 p-2">
              <p className="text-sm font-semibold text-green-700">
                คะแนนที่ดีที่สุด: {Math.round(bestScore)}/{assignment.maxPoints}
              </p>
            </div>
          )}

          {/* Points */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold">คะแนนเต็ม: {assignment.maxPoints}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4">
        {isTeacher ? (
          <Link
            href={`/learn/classroom/teacher/courses/${courseId}/assignments`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600"
          >
            จัดการงาน
          </Link>
        ) : (
          <Link
            href={levelHref}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700"
          >
            {isCompleted ? 'ทำอีกครั้ง' : 'เริ่มทำ'}
            <Clock className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
