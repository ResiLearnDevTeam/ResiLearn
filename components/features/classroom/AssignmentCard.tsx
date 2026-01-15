'use client';

import Link from 'next/link';
import { CourseAssignment } from '@/types/classroom';
import { formatDateTime, isAssignmentOverdue, getDaysUntilDue } from '@/lib/classroom';
import { BookOpen, Calendar, CheckCircle2, Clock, AlertCircle, Pin, Flag, FileText, Trash2, Edit } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface AssignmentCardProps {
  assignment: CourseAssignment;
  courseId: string;
  isTeacher?: boolean;
  isTeacherView?: boolean;
  onDelete?: (assignment: CourseAssignment) => void;
  onEdit?: (assignment: CourseAssignment) => void;
}

export default function AssignmentCard({
  assignment,
  courseId,
  isTeacher = false,
  isTeacherView = false,
  onDelete,
  onEdit,
}: AssignmentCardProps) {
  const isOverdue = assignment.dueDate ? isAssignmentOverdue(assignment) : false;
  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isCompleted = assignment.completed || false;
  const bestScore = assignment.bestScore || 0;

  const getAssignmentTypeLabel = () => {
    switch (assignment.assignmentType) {
      case 'LEVEL_BASED':
        return 'Level-based';
      case 'CUSTOM_QUIZ':
        return 'Custom Quiz';
      case 'FIXED_QUESTIONS':
        return 'Fixed Questions';
      default:
        return 'Level-based';
    }
  };

  const getPriorityColor = () => {
    switch (assignment.priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-700';
      case 'LOW':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const levelHref = `/learn/self/levels/${assignment.level?.number}/quiz`;
  const quizHref = `/learn/classroom/courses/${courseId}/assignments/${assignment.id}/quiz`;

  return (
    <div className={`rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg ${
      assignment.isPinned ? 'ring-2 ring-green-500' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            {assignment.isPinned && (
              <Pin className="h-4 w-4 text-green-600" />
            )}
            <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
            {assignment.isDraft && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                Draft
              </span>
            )}
            {assignment.priority && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor()}`}>
                <Flag className="h-3 w-3" />
                {assignment.priority === 'HIGH' ? 'สำคัญ' : assignment.priority === 'LOW' ? 'ต่ำ' : 'ปกติ'}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-700">
              {getAssignmentTypeLabel()}
            </span>
            {assignment.assignmentType === 'FIXED_QUESTIONS' && assignment.questions && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                {Array.isArray(assignment.questions) ? assignment.questions.length : 0} ข้อ
              </span>
            )}
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
            <div 
              className="mb-3 text-sm text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{ 
                __html: assignment.descriptionFormat === 'HTML' 
                  ? sanitizeHtml(assignment.description) 
                  : assignment.description 
              }}
            />
          )}
          
          {assignment.instructions && (
            <div 
              className="mb-3 text-sm text-gray-500 line-clamp-1"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeHtml(assignment.instructions) 
              }}
            />
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

          {/* Attachments */}
          {assignment.attachments && assignment.attachments.length > 0 && (
            <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>{assignment.attachments.length} ไฟล์แนบ</span>
            </div>
          )}

          {/* Scheduled Publishing */}
          {assignment.publishedAt && new Date(assignment.publishedAt) > new Date() && (
            <div className="mb-3 text-sm text-gray-500">
              <Calendar className="h-4 w-4 inline mr-1" />
              เผยแพร่: {formatDateTime(assignment.publishedAt)}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center gap-2">
        {isTeacherView ? (
          <>
            {onEdit && (
              <button
                onClick={() => onEdit(assignment)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600"
              >
                <Edit className="h-4 w-4" />
                แก้ไข
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(assignment)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
                ลบ
              </button>
            )}
          </>
        ) : (
          <Link
            href={assignment.assignmentType === 'LEVEL_BASED' ? levelHref : quizHref}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-green-600 hover:to-green-700"
          >
            {isCompleted ? 'ทำอีกครั้ง' : 'เริ่มทำ'}
            <Clock className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
