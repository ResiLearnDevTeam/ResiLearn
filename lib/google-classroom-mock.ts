import { nanoid } from 'nanoid';

// Types for Google Classroom Mock Data
export interface MockClassroom {
  id: string;
  name: string;
  section: string;
  description: string;
  room: string;
  enrollmentCode: string;
  ownerId: string;
  students?: MockStudent[];
  assignments?: MockAssignment[];
  announcements?: MockAnnouncement[];
  grades?: MockGrade[];
}

export interface MockStudent {
  userId: string;
  profile: {
    id: string;
    name: {
      givenName: string;
      familyName: string;
      fullName: string;
    };
    emailAddress: string;
  };
}

export interface MockAssignment {
  id: string;
  title: string;
  description: string;
  maxPoints: number;
  dueDate?: string;
  state: 'PUBLISHED' | 'DRAFT';
}

export interface MockAnnouncement {
  id: string;
  text: string;
  state: 'PUBLISHED' | 'DRAFT';
  scheduledTime?: string;
}

export interface MockGrade {
  userId: string;
  courseWorkId: string;
  assignedGrade: number;
  maxPoints: number;
  state: 'NEW' | 'RETURNED' | 'GRADED';
}

export interface SyncHistory {
  id: string;
  type: 'GRADES' | 'ASSIGNMENTS' | 'STUDENTS';
  status: 'SUCCESS' | 'FAILED';
  syncedAt: Date;
  itemsCount: number;
  details: string;
}

// Mock Thai names for students
const THAI_FIRST_NAMES = [
  'สมชาย', 'สมหญิง', 'วิชัย', 'สุรชัย', 'นพดล', 'กมล', 'ปิยะ', 'อภิชัย',
  'ธนพล', 'กิตติ', 'วรพล', 'ชัยวัฒน์', 'ธนกฤต', 'ณัฐพล', 'กฤษณะ',
  'พิมพ์', 'สุชาดา', 'กัญญา', 'ปิยวรรณ', 'อรทัย', 'นันทนา', 'วิไล',
  'สุดา', 'วรรณา', 'จินดา', 'สมศรี', 'มาลี', 'ประไพ', 'วิมล'
];

const THAI_LAST_NAMES = [
  'วัฒนา', 'ศรีสุข', 'ทองดี', 'ใจดี', 'สุขสันต์', 'รุ่งเรือง', 'เจริญ',
  'ประเสริฐ', 'สมบูรณ์', 'สุขใจ', 'ดีใจ', 'รักดี', 'มีสุข', 'สุขดี',
  'ประจักษ์', 'ประเสริฐ', 'เจริญสุข', 'รุ่งโรจน์', 'วัฒนสุข', 'ประเสริฐสุข'
];

/**
 * Generate mock access token and refresh token
 */
export function generateMockTokens(): { access_token: string; refresh_token: string } {
  return {
    access_token: `mock_access_token_${nanoid(32)}`,
    refresh_token: `mock_refresh_token_${nanoid(32)}`,
  };
}

/**
 * Generate mock enrollment code (6 characters)
 */
function generateEnrollmentCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Generate mock student data
 */
function generateMockStudent(index: number): MockStudent {
  const firstName = THAI_FIRST_NAMES[Math.floor(Math.random() * THAI_FIRST_NAMES.length)];
  const lastName = THAI_LAST_NAMES[Math.floor(Math.random() * THAI_LAST_NAMES.length)];
  const fullName = `${firstName} ${lastName}`;
  const email = `student${index + 1}.${firstName.toLowerCase()}@example.com`;

  return {
    userId: nanoid(),
    profile: {
      id: nanoid(),
      name: {
        givenName: firstName,
        familyName: lastName,
        fullName: fullName,
      },
      emailAddress: email,
    },
  };
}

/**
 * Generate mock students (5-10 students)
 */
export function getMockStudents(classroomId: string, count?: number): MockStudent[] {
  const studentCount = count || Math.floor(Math.random() * 6) + 5; // 5-10 students
  const students: MockStudent[] = [];

  for (let i = 0; i < studentCount; i++) {
    students.push(generateMockStudent(i));
  }

  return students;
}

/**
 * Generate mock classroom with all data
 */
export function createMockClassroom(
  courseData: { name: string; description?: string },
  ownerId: string
): MockClassroom {
  const classroomId = nanoid();
  const section = `Section ${Math.floor(Math.random() * 5) + 1}`;
  const room = `Room ${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`;

  // Generate students
  const students = getMockStudents(classroomId);

  // Generate mock assignments (3-5)
  const assignmentCount = Math.floor(Math.random() * 3) + 3;
  const assignments: MockAssignment[] = [];
  for (let i = 0; i < assignmentCount; i++) {
    assignments.push({
      id: nanoid(),
      title: `Assignment ${i + 1}: ${courseData.name}`,
      description: `Complete the assignment for ${courseData.name}`,
      maxPoints: 100,
      dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week apart
      state: 'PUBLISHED' as const,
    });
  }

  // Generate mock announcements (2-3)
  const announcementCount = Math.floor(Math.random() * 2) + 2;
  const announcements: MockAnnouncement[] = [];
  const announcementTexts = [
    `ยินดีต้อนรับเข้าสู่คอร์ส ${courseData.name}`,
    `กรุณาตรวจสอบงานที่มอบหมาย`,
    `มีการอัปเดตเนื้อหาใหม่ในคอร์ส`,
    `นัดหมายสอบปลายภาค`,
  ];
  for (let i = 0; i < announcementCount; i++) {
    announcements.push({
      id: nanoid(),
      text: announcementTexts[i % announcementTexts.length],
      state: 'PUBLISHED' as const,
      scheduledTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  // Generate mock grades
  const grades: MockGrade[] = [];
  students.forEach((student) => {
    assignments.forEach((assignment) => {
      // Randomly assign grades (70% chance of having a grade)
      if (Math.random() > 0.3) {
        grades.push({
          userId: student.userId,
          courseWorkId: assignment.id,
          assignedGrade: Math.floor(Math.random() * 30) + 70, // 70-100
          maxPoints: assignment.maxPoints,
          state: Math.random() > 0.5 ? 'GRADED' : 'RETURNED',
        });
      }
    });
  });

  return {
    id: classroomId,
    name: courseData.name,
    section: section,
    description: courseData.description || `คอร์ส ${courseData.name}`,
    room: room,
    enrollmentCode: generateEnrollmentCode(),
    ownerId: ownerId,
    students: students,
    assignments: assignments,
    announcements: announcements,
    grades: grades,
  };
}

/**
 * Generate complete mock classroom data
 */
export function generateMockClassroomData(
  courseId: string,
  courseData: { name: string; description?: string },
  ownerId: string
): MockClassroom {
  return createMockClassroom(courseData, ownerId);
}

/**
 * Validate if user has mock Google Classroom connection
 */
export async function validateMockConnection(userId: string): Promise<boolean> {
  // This will be checked in the API route by querying Account table
  // For now, just return true as a placeholder
  return true;
}

/**
 * Mock sync grades operation
 */
export function mockSyncGrades(courseId: string, attempts: any[]): {
  success: boolean;
  syncedCount: number;
  details: string;
} {
  const syncedCount = attempts.length;
  return {
    success: true,
    syncedCount: syncedCount,
    details: `Synced ${syncedCount} grade(s) to Google Classroom Gradebook`,
  };
}

/**
 * Mock sync assignments operation
 */
export function mockSyncAssignments(courseId: string, assignments: any[]): {
  success: boolean;
  syncedCount: number;
  details: string;
} {
  const syncedCount = assignments.length;
  return {
    success: true,
    syncedCount: syncedCount,
    details: `Synced ${syncedCount} assignment(s) to Google Classroom`,
  };
}

/**
 * Generate mock sync history
 */
export function generateMockSyncHistory(courseId: string, count: number = 10): SyncHistory[] {
  const history: SyncHistory[] = [];
  const types: Array<'GRADES' | 'ASSIGNMENTS' | 'STUDENTS'> = ['GRADES', 'ASSIGNMENTS', 'STUDENTS'];
  const statuses: Array<'SUCCESS' | 'FAILED'> = ['SUCCESS', 'SUCCESS', 'SUCCESS', 'FAILED']; // 75% success rate

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const itemsCount = Math.floor(Math.random() * 20) + 1;

    history.push({
      id: nanoid(),
      type: type,
      status: status,
      syncedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000), // 2 hours apart
      itemsCount: itemsCount,
      details: status === 'SUCCESS'
        ? `Successfully synced ${itemsCount} ${type.toLowerCase()}`
        : `Failed to sync ${type.toLowerCase()}: Network error`,
    });
  }

  return history.sort((a, b) => b.syncedAt.getTime() - a.syncedAt.getTime()); // Most recent first
}

// In-memory storage for mock classrooms (keyed by userId)
const mockClassroomsCache: Map<string, MockClassroom[]> = new Map();

/**
 * Generate deterministic mock classroom name based on index
 * Uses electronics subjects for ปวช (Vocational Certificate)
 */
function generateMockClassroomName(index: number): string {
  const subjects = [
    'วงจรไฟฟ้าพื้นฐาน',
    'ตัวต้านทานและการอ่านค่า',
    'วงจรอิเล็กทรอนิกส์',
    'อุปกรณ์อิเล็กทรอนิกส์',
    'ระบบดิจิทัล',
    'ไมโครคอนโทรลเลอร์',
    'การบำรุงรักษาอิเล็กทรอนิกส์',
    'วงจรไฟฟ้ากระแสสลับ',
    'ระบบควบคุมอัตโนมัติ',
    'การออกแบบวงจร',
  ];
  const levels = ['ปวช.1', 'ปวช.2', 'ปวช.3'];
  const subject = subjects[index % subjects.length];
  const level = levels[Math.floor(index / subjects.length) % levels.length];
  return `${subject} ${level}`;
}

/**
 * Generate mock classrooms list for a user
 * Uses deterministic generation based on userId to ensure consistency
 */
export function generateMockClassroomsList(userId: string, count: number = 8): MockClassroom[] {
  // Check cache first
  if (mockClassroomsCache.has(userId)) {
    return mockClassroomsCache.get(userId)!;
  }

  // Use userId as seed for deterministic generation
  const seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const classrooms: MockClassroom[] = [];

  for (let i = 0; i < count; i++) {
    // Use seed + index for deterministic random
    const localSeed = seed + i;
    const name = generateMockClassroomName(i);
    const section = `Section ${(i % 5) + 1}`;
    const room = `Room ${String((i % 20) + 1).padStart(3, '0')}`;
    
    // Generate deterministic classroom ID based on userId and index
    const classroomId = `${userId}_classroom_${i}`;
    
    // Generate students (deterministic count based on index)
    const studentCount = 5 + (i % 6); // 5-10 students
    const students = getMockStudents(classroomId, studentCount);

    // Generate assignments (3-5)
    const assignmentCount = 3 + (i % 3);
    const assignments: MockAssignment[] = [];
    for (let j = 0; j < assignmentCount; j++) {
      assignments.push({
        id: `${classroomId}_assignment_${j}`,
        title: `งานที่ ${j + 1}: ${name}`,
        description: `ให้ทำการบ้านเรื่อง ${name}`,
        maxPoints: 100,
        dueDate: new Date(Date.now() + (j + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        state: 'PUBLISHED' as const,
      });
    }

    // Generate announcements (2-3)
    const announcementCount = 2 + (i % 2);
    const announcements: MockAnnouncement[] = [];
    const announcementTexts = [
      `ยินดีต้อนรับเข้าสู่คอร์ส ${name}`,
      `กรุณาตรวจสอบงานที่มอบหมาย`,
      `มีการอัปเดตเนื้อหาใหม่ในคอร์ส`,
    ];
    for (let j = 0; j < announcementCount; j++) {
      announcements.push({
        id: `${classroomId}_announcement_${j}`,
        text: announcementTexts[j % announcementTexts.length],
        state: 'PUBLISHED' as const,
        scheduledTime: new Date(Date.now() - j * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Generate grades
    const grades: MockGrade[] = [];
    students.forEach((student, sIdx) => {
      assignments.forEach((assignment, aIdx) => {
        // Deterministic grade assignment (70% chance)
        if ((localSeed + sIdx + aIdx) % 10 < 7) {
          const grade = 70 + ((localSeed + sIdx + aIdx) % 31); // 70-100
          grades.push({
            userId: student.userId,
            courseWorkId: assignment.id,
            assignedGrade: grade,
            maxPoints: assignment.maxPoints,
            state: (localSeed + sIdx + aIdx) % 2 === 0 ? 'GRADED' : 'RETURNED',
          });
        }
      });
    });

    // Generate deterministic enrollment code
    const enrollmentCode = generateEnrollmentCode();

    classrooms.push({
      id: classroomId,
      name: name,
      section: section,
      description: `คอร์ส ${name} - ${section}`,
      room: room,
      enrollmentCode: enrollmentCode,
      ownerId: userId,
      students: students,
      assignments: assignments,
      announcements: announcements,
      grades: grades,
    });
  }

  // Cache the result
  mockClassroomsCache.set(userId, classrooms);
  return classrooms;
}

/**
 * Get mock classroom by ID
 */
export function getMockClassroomById(classroomId: string, userId: string): MockClassroom | null {
  // Ensure list is generated
  const classrooms = generateMockClassroomsList(userId);
  return classrooms.find(c => c.id === classroomId) || null;
}
