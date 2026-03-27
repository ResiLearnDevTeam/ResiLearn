import { 
  ColorReadingMode, 
  AnswerType, 
  ResistorType, 
  Difficulty, 
  SessionType,
  PracticeSessionSettings 
} from '@/types/practiceSession';
import { getBandLabel } from './resistorUtils';

/**
 * Get color reading mode name in Thai
 */
export function getColorReadingModeName(
  mode: ColorReadingMode, 
  bandIndex?: number | null, 
  resistorType?: ResistorType
): string {
  const bandLabel = bandIndex !== null && bandIndex !== undefined && resistorType
    ? getBandLabel(bandIndex, resistorType)
    : '';
  
  switch (mode) {
    case 'value_to_color_band_by_band':
      return bandLabel ? `ค่า → สี (${bandLabel})` : 'ค่า → สี (ทีละแถบ)';
    case 'value_to_color_full':
      return 'ค่า → สี (ทั้งหมด)';
    case 'color_to_value':
      return bandLabel ? `สี → ค่า (${bandLabel})` : 'สี → ค่า';
    case 'mixed':
      return 'ผสม';
    default:
      return 'ฝึกอ่านค่ารหัสสี';
  }
}

/**
 * Get answer type name in Thai
 */
export function getAnswerTypeName(answerType: AnswerType): string {
  switch (answerType) {
    case 'multiple_choice':
      return 'ตัวเลือก';
    case 'fill_in':
      return 'เติมคำ';
    case 'color_selection':
      return 'เลือกสี';
    case 'color_reading':
      return 'ฝึกอ่านค่ารหัสสี';
    default:
      return 'ไม่ระบุ';
  }
}

/**
 * Get resistor type label in Thai
 */
export function getResistorTypeLabel(resistorType: ResistorType): string {
  return resistorType === 'FOUR_BAND' ? '4 แถบสี' : '5 แถบสี';
}

/**
 * Get difficulty label in Thai
 */
export function getDifficultyLabel(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy':
      return 'ง่าย';
    case 'medium':
      return 'ปานกลาง';
    case 'hard':
      return 'ยาก';
    default:
      return 'ไม่ระบุ';
  }
}

/**
 * Get session type label in Thai
 */
export function getSessionTypeLabel(sessionType: SessionType): string {
  switch (sessionType) {
    case 'quick':
      return 'ฝึกด่วน';
    case 'custom':
      return 'กำหนดเอง';
    case 'color_reading':
      return 'ฝึกอ่านค่ารหัสสี';
    case 'preset':
      return 'ใช้ Preset';
    default:
      return 'ไม่ระบุ';
  }
}

/**
 * Transform session name from settings and presetName
 */
export function formatSessionName(
  presetName: string | null | undefined,
  settings: PracticeSessionSettings | null | undefined
): string {
  // 1. ถ้ามี presetName ใช้เลย
  if (presetName) return presetName;
  
  if (!settings) return 'ฝึกด่วน';
  
  // 2. Color Reading Mode
  if (settings.colorReadingMode || settings.practiceMode === 'color_reading') {
    const mode = settings.colorReadingMode || 'color_to_value';
    return `ฝึกอ่านค่ารหัสสี - ${getColorReadingModeName(mode, settings.bandIndex, settings.resistorType)}`;
  }
  
  // 3. Custom Practice (มี countdown หรือ time limit)
  if (settings.countdownTime || settings.timeLimit || settings.hasTimeLimit) {
    const parts: string[] = ['กำหนดเอง'];
    if (settings.resistorType) {
      parts.push(getResistorTypeLabel(settings.resistorType));
    }
    if (settings.answerType) {
      parts.push(getAnswerTypeName(settings.answerType));
    }
    return parts.join(' - ');
  }
  
  // 4. Quick Practice
  const parts: string[] = ['ฝึกด่วน'];
  if (settings.totalQuestions === null || settings.totalQuestions === undefined) {
    parts.push('ไม่จำกัด');
  }
  if (settings.resistorType) {
    parts.push(getResistorTypeLabel(settings.resistorType));
  }
  if (settings.answerType) {
    parts.push(getAnswerTypeName(settings.answerType));
  }
  
  return parts.join(' - ');
}

/**
 * Determine session type from settings and presetId
 */
export function getSessionType(
  settings: PracticeSessionSettings | null | undefined,
  presetId?: string | null
): SessionType {
  // ถ้ามี presetId = preset
  if (presetId) return 'preset';
  
  if (!settings) return 'quick';
  
  // ถ้ามี colorReadingMode = color_reading
  if (settings.colorReadingMode || settings.practiceMode === 'color_reading') {
    return 'color_reading';
  }
  
  // ถ้ามี countdown หรือ time limit = custom
  if (settings.countdownTime || settings.timeLimit || settings.hasTimeLimit) {
    return 'custom';
  }
  
  // นอกนั้น = quick
  return 'quick';
}

/**
 * Format session date in Thai
 */
export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate session statistics
 */
export function calculateSessionStats(session: {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalTime: number;
  averageTime?: number | null;
}) {
  const accuracy = session.totalQuestions > 0 
    ? (session.correctAnswers / session.totalQuestions) * 100 
    : 0;
  
  const avgTime = session.averageTime || (session.totalQuestions > 0 
    ? session.totalTime / session.totalQuestions 
    : 0);
  
  return {
    accuracy: Math.round(accuracy * 100) / 100,
    averageTime: Math.round(avgTime * 100) / 100,
    totalTime: session.totalTime,
    correctRate: session.totalQuestions > 0 
      ? (session.correctAnswers / session.totalQuestions) 
      : 0
  };
}

/**
 * Validate session settings
 */
export function validateSessionSettings(settings: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!settings) {
    errors.push('Settings is required');
    return { valid: false, errors };
  }
  
  if (!settings.resistorType || !['FOUR_BAND', 'FIVE_BAND'].includes(settings.resistorType)) {
    errors.push('Invalid resistor type');
  }
  
  if (!settings.answerType || !['multiple_choice', 'fill_in', 'color_selection', 'color_reading'].includes(settings.answerType)) {
    errors.push('Invalid answer type');
  }
  
  if (settings.optionCount && (settings.optionCount < 2 || settings.optionCount > 4)) {
    errors.push('Option count must be between 2 and 4');
  }
  
  if (settings.countdownTime && settings.countdownTime < 0) {
    errors.push('Countdown time cannot be negative');
  }
  
  if (settings.timeLimit && settings.timeLimit < 0) {
    errors.push('Time limit cannot be negative');
  }
  
  if (settings.totalQuestions !== null && settings.totalQuestions !== undefined && settings.totalQuestions < 1) {
    errors.push('Total questions must be at least 1');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
