'use client';

import { CourseAssignment } from '@/types/classroom';
import AssignmentCard from './AssignmentCard';
import { FileText } from 'lucide-react';

interface AssignmentListProps {
  assignments: CourseAssignment[];
  courseId: string;
  isTeacher?: boolean;
  isTeacherView?: boolean;
  emptyMessage?: string;
  onDelete?: (assignment: CourseAssignment) => void;
}

export default function AssignmentList({
  assignments,
  courseId,
  isTeacher = false,
  isTeacherView = false,
  emptyMessage = 'ยังไม่มีงาน',
  onDelete,
}: AssignmentListProps) {
  // Sort: Pinned first, then by priority, then by due date
  const sortedAssignments = [...assignments].sort((a, b) => {
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

  if (assignments.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-16 text-center border-2 border-dashed border-gray-300">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{emptyMessage}</h3>
            <p className="text-sm text-gray-500">ยังไม่มีงานที่ได้รับมอบหมาย</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedAssignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          courseId={courseId}
          isTeacher={isTeacher || isTeacherView}
          isTeacherView={isTeacherView}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
