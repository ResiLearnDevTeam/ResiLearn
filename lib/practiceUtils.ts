import { ListChecks, PenLine, Paintbrush, LucideIcon } from 'lucide-react';

export function getAnswerTypeName(answerType: string): string {
  switch (answerType) {
    case 'multiple_choice': return 'ตัวเลือก';
    case 'fill_in': return 'เติมคำ';
    case 'color_selection': return 'เลือกสี';
    default: return 'ตัวเลือก';
  }
}

export function getAnswerTypeIcon(answerType: string): LucideIcon {
  switch (answerType) {
    case 'multiple_choice': return ListChecks;
    case 'fill_in': return PenLine;
    case 'color_selection': return Paintbrush;
    default: return ListChecks;
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
