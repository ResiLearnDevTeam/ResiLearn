// Utility functions for Classroom Learning operations
import { Course, Enrollment, CourseAssignment } from '@/types/classroom';

/**
 * Format course progress percentage
 */
export function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`;
}

/**
 * Check if course is active (between start and end date)
 */
export function isCourseActive(course: Course): boolean {
  if (!course.isPublished) return false;
  
  const now = new Date();
  const startDate = new Date(course.startDate);
  const endDate = course.endDate ? new Date(course.endDate) : null;
  
  if (now < startDate) return false;
  if (endDate && now > endDate) return false;
  
  return true;
}

/**
 * Get course status text
 */
export function getCourseStatus(course: Course): string {
  if (!course.isPublished) return 'Private';
  
  const now = new Date();
  const startDate = new Date(course.startDate);
  const endDate = course.endDate ? new Date(course.endDate) : null;
  
  if (now < startDate) return 'Upcoming';
  if (endDate && now > endDate) return 'Ended';
  return 'Published';
}

/**
 * Format date for display
 */
export function formatCourseDate(dateString: string | null): string {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Check if assignment is overdue
 */
export function isAssignmentOverdue(assignment: CourseAssignment): boolean {
  if (!assignment.dueDate) return false;
  
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  
  return now > dueDate && !assignment.completed;
}

/**
 * Get days until due date
 */
export function getDaysUntilDue(dueDate: string | null): number | null {
  if (!dueDate) return null;
  
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Calculate course progress from assignments
 */
export function calculateCourseProgress(
  assignments: CourseAssignment[],
  totalPoints: number = 100
): number {
  if (assignments.length === 0) return 0;
  
  const completedAssignments = assignments.filter(a => a.completed);
  const completedPoints = completedAssignments.reduce(
    (sum, a) => sum + (a.bestScore || 0),
    0
  );
  
  return Math.min(100, Math.round((completedPoints / totalPoints) * 100));
}

/**
 * Sort assignments by due date (upcoming first, then overdue, then no due date)
 */
export function sortAssignmentsByDueDate(
  assignments: CourseAssignment[]
): CourseAssignment[] {
  return [...assignments].sort((a, b) => {
    // No due date goes to end
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    
    // Sort by due date
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}
