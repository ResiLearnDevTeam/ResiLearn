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
  assignmentType: 'LEVEL_BASED' | 'CUSTOM_QUIZ' | 'FIXED_QUESTIONS';
  levelId?: string;
  title: string;
  description?: string | null;
  descriptionFormat?: 'HTML' | 'MARKDOWN' | 'PLAIN';
  instructions?: string | null;
  dueDate: string | null;
  maxPoints: number;
  order: number;
  quizSettings?: CustomQuizSettings;
  questions?: FixedQuestion[];
  quizSettingsForFixed?: FixedQuestionsSettings;
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  isPinned?: boolean;
  isDraft?: boolean;
  publishedAt?: string | null;
  attachments?: Array<{name: string, url: string, type: string, size: number}>;
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

export interface CustomQuizSettings {
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  answerType: 'multiple_choice' | 'fill_in' | 'color_selection' | 'color_reading';
  difficulty: 'easy' | 'medium' | 'hard';
  optionCount: number; // 2, 3, หรือ 4
  totalQuestions: number | null; // null = unlimited
  countdownTime: number | null; // seconds per question
  timeLimit: number | null; // seconds total
  colorReadingMode?: 'value_to_color_full' | 'value_to_color_band_by_band' | 'color_to_value' | 'mixed' | null;
}

export interface FixedQuestion {
  id: string;
  order: number;
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  answerType: 'multiple_choice' | 'fill_in' | 'color_selection' | 'color_reading';
  bands: string[]; // ['brown', 'red', 'orange', 'gold']
  correctAnswer: string; // "12kΩ ±5%"
  options?: string[]; // สำหรับ multiple_choice
  correctBands?: string[]; // สำหรับ color_selection (reverse question)
  explanation?: string;
  points: number; // คะแนนต่อข้อ
}

export interface FixedQuestionsSettings {
  countdownTime?: number | null; // seconds per question
  timeLimit?: number | null; // seconds total
  allowReview?: boolean; // อนุญาตให้ review ก่อนส่ง
  showCorrectAnswer?: boolean; // แสดงคำตอบที่ถูกต้องหลังทำเสร็จ
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  contentFormat?: 'HTML' | 'MARKDOWN' | 'PLAIN';
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  isPinned?: boolean;
  isDraft?: boolean;
  publishedAt?: string;
  attachments?: Array<{name: string, url: string, type: string, size: number}>;
  wordDocumentUrl?: string;
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
  assignmentType: 'LEVEL_BASED' | 'CUSTOM_QUIZ' | 'FIXED_QUESTIONS';
  levelId?: string; // Required if assignmentType = 'LEVEL_BASED'
  title: string;
  description?: string;
  descriptionFormat?: 'HTML' | 'MARKDOWN' | 'PLAIN';
  instructions?: string;
  dueDate?: string;
  maxPoints?: number;
  order?: number;
  quizSettings?: CustomQuizSettings; // Required if assignmentType = 'CUSTOM_QUIZ'
  questions?: FixedQuestion[]; // Required if assignmentType = 'FIXED_QUESTIONS'
  quizSettingsForFixed?: FixedQuestionsSettings; // Optional for FIXED_QUESTIONS
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  isPinned?: boolean;
  isDraft?: boolean;
  publishedAt?: string; // ISO date string
  attachments?: Array<{name: string, url: string, type: string, size: number}>;
}

export interface CreateAnnouncementData {
  title: string;
  content: string; // HTML content from rich text editor
  contentFormat?: 'HTML' | 'MARKDOWN' | 'PLAIN';
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
  isPinned?: boolean;
  isDraft?: boolean;
  publishedAt?: string; // ISO date string
  attachments?: Array<{name: string, url: string, type: string, size: number}>;
}

export interface EnrollData {
  courseCode: string;
}

export interface CourseWithDetails extends Course {
  enrollments: Enrollment[];
  assignments: CourseAssignment[];
  announcements: Announcement[];
}
