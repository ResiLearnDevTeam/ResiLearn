'use client';

import { CourseAssignment } from '@/types/classroom';
import AssignmentCard from './AssignmentCard';
import { sortAssignmentsByDueDate } from '@/lib/classroom';

interface AssignmentListProps {
  assignments: CourseAssignment[];
  courseId: string;
  isTeacher?: boolean;
  isTeacherView?: boolean;
  emptyMessage?: string;
  onDelete?: (assignment: CourseAssignment) => void;
  onEdit?: (assignment: CourseAssignment) => void;
}

export default function AssignmentList({
  assignments,
  courseId,
  isTeacher = false,
  isTeacherView = false,
  emptyMessage = 'ยังไม่มีงาน',
  onDelete,
  onEdit,
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
      <div className="rounded-xl bg-white p-12 text-center shadow-md">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedAssignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          courseId={courseId}
          isTeacher={isTeacher || isTeacherView}
          isTeacherView={isTeacherView}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
