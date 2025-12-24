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
}

export default function AssignmentList({
  assignments,
  courseId,
  isTeacher = false,
  isTeacherView = false,
  emptyMessage = 'ยังไม่มีงาน',
}: AssignmentListProps) {
  const sortedAssignments = sortAssignmentsByDueDate(assignments);

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
        />
      ))}
    </div>
  );
}
