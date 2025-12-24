// Type definitions for Classroom Learning system

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface Course {
  id: string;
  name: string;
  description: string | null;
  code: string;
  teacherId: string;
  teacher?: {
    id: string;
    name: string | null;
    email: string;
  };
  image: string | null;
  startDate: string;
  endDate: string | null;
  isPublished: boolean;
  googleClassroomId: string | null;
  createdAt: string;
  updatedAt: string;
  enrollmentCount?: number;
  assignmentCount?: number;
  announcementCount?: number;
  progress?: number; // For enrolled students
  isEnrolled?: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
  course?: Course;
}

export interface CourseAssignment {
  id: string;
  courseId: string;
  levelId: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  maxPoints: number;
  order: number;
  createdAt: string;
  level?: {
    id: string;
    number: number;
    name: string;
    description: string;
  };
  completed?: boolean; // For students
  bestScore?: number; // For students
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  course?: Course;
}

export interface CreateCourseData {
  name: string;
  description?: string;
  code: string;
  startDate: string;
  endDate?: string;
  image?: string;
  isPublished?: boolean;
}

export interface UpdateCourseData {
  name?: string;
  description?: string;
  code?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  isPublished?: boolean;
}

export interface CreateAssignmentData {
  levelId: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxPoints?: number;
  order?: number;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
}

export interface EnrollData {
  courseCode: string;
}

export interface CourseWithDetails extends Course {
  enrollments: Enrollment[];
  assignments: CourseAssignment[];
  announcements: Announcement[];
}
