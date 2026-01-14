'use client';

import { getColorName } from '@/lib/colorUtils';
import { Question } from '@/lib/questionGenerator';

interface PracticeResultDisplayProps {
  isCorrect: boolean;
  answerType: string;
  selectedAnswer: string | null;
  selectedBands: string[];
  numberValue: string;
  selectedUnit: string;
  toleranceValue: string;
  currentQ: Question;
}

export default function PracticeResultDisplay({
  isCorrect,
  answerType,
  selectedAnswer,
  selectedBands,
  numberValue,
  selectedUnit,
  toleranceValue,
  currentQ,
}: PracticeResultDisplayProps) {
  if (isCorrect) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-3 animate-bounce">
          <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl lg:text-2xl font-extrabold text-green-600">ถูกต้อง!</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg mb-3">
        <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h3 className="text-xl lg:text-2xl font-extrabold text-red-600 mb-3">ไม่ถูกต้อง</h3>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="text-center px-4 py-2 bg-red-50 rounded-xl border-2 border-red-200">
          <p className="text-xs text-gray-500">คุณตอบ</p>
          <p className="font-bold text-red-700">
            {answerType === 'color_selection' 
              ? selectedBands.map(b => getColorName(b)).join(' - ')
              : answerType === 'multiple_choice' 
                ? selectedAnswer 
                : `${numberValue}${selectedUnit} ±${toleranceValue}%`}
          </p>
        </div>
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
        <div className="text-center px-4 py-2 bg-green-50 rounded-xl border-2 border-green-300">
          <p className="text-xs text-gray-500">คำตอบที่ถูก</p>
          <p className="font-bold text-green-700">
            {answerType === 'color_selection'
              ? currentQ.correctBands?.map((b: string) => getColorName(b)).join(' - ') || ''
              : currentQ.correctAnswer}
          </p>
        </div>
      </div>
    </div>
  );
}
