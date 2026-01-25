// Practice Modes
export type PracticeMode = 'standard' | 'color_reading';

// Color Reading Modes
export type ColorReadingMode = 
  | 'value_to_color_band_by_band'  // ค่า → สี ทีละแถบ
  | 'value_to_color_full'          // ค่า → สี ทั้งหมด
  | 'color_to_value'               // สี → ค่า
  | 'mixed';                       // ผสม

// Answer Types
export type AnswerType = 
  | 'multiple_choice'    // ตัวเลือก
  | 'fill_in'            // เติมคำ
  | 'color_selection'    // เลือกสี
  | 'color_reading';    // ฝึกอ่านค่ารหัสสี (สำหรับ classroom)

// Resistor Types
export type ResistorType = 'FOUR_BAND' | 'FIVE_BAND';

// Difficulty Levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Session Types
export type SessionType = 'quick' | 'custom' | 'color_reading' | 'preset';

export interface PracticeSessionSettings {
  // Basic Settings
  resistorType: ResistorType;
  answerType: AnswerType;
  difficulty?: Difficulty;
  optionCount?: number; // 2, 3, หรือ 4
  
  // Time Settings
  countdownTime?: number | null;      // เวลานับถอยหลังต่อข้อ (วินาที)
  timeLimit?: number | null;          // จำกัดเวลาทั้งหมด (วินาที)
  hasTimeLimit?: boolean;
  
  // Question Settings
  totalQuestions?: number | null;     // null = ไม่จำกัด
  hasQuestionLimit?: boolean;
  questionLimit?: number;
  
  // Color Reading Settings
  practiceMode?: PracticeMode;        // 'standard' | 'color_reading'
  colorReadingMode?: ColorReadingMode;
  bandIndex?: number | null;          // สำหรับฝึกทีละแถบ
  digitIndex?: number | null;          // สำหรับฝึกทีละหลัก
  
  // Analytics
  analytics?: {
    deepAnalytics?: any;
  };
}

export interface PracticeQuestion {
  questionNumber: number;
  bands: string[];
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation?: string;
  options?: string[];
  timeSpent?: number;
}

export interface PracticeSessionData {
  id: string;
  sessionName: string; // เปลี่ยนจาก presetName - ชื่อที่อ่านง่าย
  sessionType: SessionType; // 'quick' | 'custom' | 'color_reading' | 'preset'
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  averageTime: number | null; // วินาทีต่อข้อ
  totalTime: number; // วินาทีทั้งหมด
  settings: PracticeSessionSettings;
  questions: PracticeQuestion[] | null;
  startedAt: string;
  completedAt: string;
  presetId?: string | null;
  courseId?: string | null; // null = self-learning
}

export interface PracticeSessionResponse {
  success?: boolean;
  session?: PracticeSessionData;
  error?: string;
  details?: string;
}
