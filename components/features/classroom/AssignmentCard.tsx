'use client';

import Link from 'next/link';
import { CourseAssignment } from '@/types/classroom';
import { formatDateTime, isAssignmentOverdue, getDaysUntilDue } from '@/lib/classroom';
import { Calendar, CheckCircle2, Clock, AlertCircle, Pin, FileText, Trash2, Edit, Eye } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface AssignmentCardProps {
  assignment: CourseAssignment;
  courseId: string;
  isTeacher?: boolean;
  isTeacherView?: boolean;
  onDelete?: (assignment: CourseAssignment) => void;
}

export default function AssignmentCard({
  assignment,
  courseId,
  isTeacher = false,
  isTeacherView = false,
  onDelete,
}: AssignmentCardProps) {
  const isOverdue = assignment.dueDate ? isAssignmentOverdue(assignment) : false;
  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
  const isCompleted = assignment.completed || false;
  const bestScore = assignment.bestScore || 0;

  const getAssignmentTypeLabel = () => {
    // ใช้ assignmentMode เป็นหลัก
    if (assignment.assignmentMode === 'PRACTICE') {
      return 'แบบฝึกหัด';
    } else if (assignment.assignmentMode === 'EXAM') {
      return 'แบบทดสอบ';
    }
    
    // Backward compatibility: ใช้ assignmentType ถ้าไม่มี assignmentMode
    switch (assignment.assignmentType) {
      case 'CUSTOM_QUIZ':
        return 'Custom Quiz';
      case 'FIXED_QUESTIONS':
        return 'Fixed Questions';
      default:
        return 'Level-based';
    }
  };

  const getAssignmentSubLabel = () => {
    if (assignment.assignmentMode) {
      if (assignment.assignmentType === 'CUSTOM_QUIZ') {
        return 'กำหนด Settings';
      } else if (assignment.assignmentType === 'FIXED_QUESTIONS') {
        return 'สร้างโจทย์';
      }
    }
    return null;
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

  const quizHref = `/learn/classroom/courses/${courseId}/assignments/${assignment.id}/quiz`;

  // Determine status badge
  const getStatusBadge = () => {
    if (assignment.isDraft) {
      return { label: 'Draft', color: 'bg-yellow-100 text-yellow-700' };
    }
    if (isCompleted) {
      return { label: 'เสร็จแล้ว', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
    }
    if (isOverdue) {
      return { label: 'เกินกำหนด', color: 'bg-red-100 text-red-700', icon: AlertCircle };
    }
    return null;
  };

  const statusBadge = getStatusBadge();
  const typeColor = assignment.assignmentMode === 'PRACTICE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700';

  return (
    <div className={`rounded-xl bg-white p-5 border border-gray-200 transition-all hover:border-gray-300 hover:shadow-md ${
      assignment.isPinned ? 'ring-2 ring-green-500 border-green-500' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {assignment.isPinned && (
              <Pin className="h-4 w-4 text-green-600" />
            )}
            <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${typeColor}`}>
              {getAssignmentTypeLabel()}
            </span>
            {statusBadge && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge.color}`}>
                {statusBadge.icon && <statusBadge.icon className="h-3 w-3" />}
                {statusBadge.label}
              </span>
            )}
          </div>

          {/* Description */}
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
        </div>
      </div>

      {/* Metadata - Compact */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
        {assignment.dueDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span className={isOverdue ? 'font-semibold text-red-600' : ''}>
              {formatDateTime(assignment.dueDate)}
            </span>
            {daysUntilDue !== null && daysUntilDue > 0 && !isOverdue && (
              <span className="text-xs">
                (เหลือ {daysUntilDue} วัน)
              </span>
            )}
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-700">คะแนนเต็ม:</span>
          <span>{assignment.maxPoints}</span>
        </div>
        {assignment.attachments && assignment.attachments.length > 0 && (
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{assignment.attachments.length} ไฟล์</span>
          </div>
        )}
        {!isTeacher && isCompleted && (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-green-700">
              คะแนน: {Math.round(bestScore)}/{assignment.maxPoints}
            </span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex items-center gap-2">
        {isTeacherView ? (
          <div className="flex items-center gap-2">
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/assignments/${assignment.id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600"
            >
              <Edit className="h-4 w-4" />
              แก้ไข
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(assignment)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
                ลบ
              </button>
            )}
          </div>
        ) : (
          isCompleted ? (
            // ตรวจสอบ allowRetake สำหรับแบบฝึกหัด
            (assignment.assignmentMode === 'PRACTICE' && assignment.allowRetake) ? (
              <Link
                href={quizHref}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl"
              >
                ทำอีกครั้ง
                <Clock className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`/learn/classroom/courses/${courseId}/assignments/${assignment.id}/result`}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700"
              >
                <Eye className="h-4 w-4" />
                ดูผลลัพธ์
              </Link>
            )
          ) : (
            <Link
              href={quizHref}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl"
            >
              เริ่มทำ
              <Clock className="h-4 w-4" />
            </Link>
          )
        )}
      </div>
    </div>
  );
}
