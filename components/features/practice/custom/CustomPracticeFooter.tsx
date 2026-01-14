'use client';

interface CustomPracticeFooterProps {
  showResult: boolean;
  answerType: string;
  selectedAnswer: string | null;
  numberValue: string;
  toleranceValue: string;
  selectedBands: string[];
  hasTimeRunOut: boolean;
  totalQuestions: number | null;
  currentQuestion: number;
  questionsLength: number;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
}

export default function CustomPracticeFooter({
  showResult,
  answerType,
  selectedAnswer,
  numberValue,
  toleranceValue,
  selectedBands,
  hasTimeRunOut,
  totalQuestions,
  currentQuestion,
  questionsLength,
  onCheckAnswer,
  onNextQuestion,
}: CustomPracticeFooterProps) {
  const isDisabled = showResult
    ? false
    : (answerType === 'multiple_choice' && !selectedAnswer) ||
      (answerType === 'fill_in' && (!numberValue || !toleranceValue)) ||
      (answerType === 'color_selection' && selectedBands.some(b => !b)) ||
      hasTimeRunOut;

  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 lg:px-6 py-4">
      <div className="max-w-3xl mx-auto">
        {!showResult ? (
          <button
            onClick={onCheckAnswer}
            disabled={isDisabled}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ตรวจคำตอบ
          </button>
        ) : (
          <button
            onClick={onNextQuestion}
            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
          >
            {totalQuestions === null 
              ? 'คำถามถัดไป' 
              : (currentQuestion >= questionsLength - 1 ? 'ดูผลลัพธ์' : 'ต่อไป')}
          </button>
        )}
      </div>
    </div>
  );
}
