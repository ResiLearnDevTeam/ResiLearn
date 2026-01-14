'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Timer, Clock, LucideIcon } from 'lucide-react';
import { formatTime, getAnswerTypeIcon, getAnswerTypeName } from '@/lib/practiceUtils';

interface CustomPracticeHeaderProps {
  answerType: string;
  timeRemaining: number | null;
  countdown: number | null;
  answered: boolean;
  totalQuestions: number | null;
  currentQuestion: number;
  score: { correct: number; total: number };
  progress: number;
  onEndPractice: () => void;
}

export default function CustomPracticeHeader({
  answerType,
  timeRemaining,
  countdown,
  answered,
  totalQuestions,
  currentQuestion,
  score,
  progress,
  onEndPractice,
}: CustomPracticeHeaderProps) {
  const AnswerTypeIcon = getAnswerTypeIcon(answerType);

  return (
    <div className="relative z-10 flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        <Link 
          href="/learn/self/practice/custom"
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline font-medium">กลับ</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <AnswerTypeIcon className="h-5 w-5" />
          <span className="font-bold text-sm sm:text-base">{getAnswerTypeName(answerType)}</span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {timeRemaining !== null && (
            <div className="text-center hidden sm:block">
              <div className="flex items-center gap-1 text-lg font-bold">
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-white/70">เวลาที่เหลือ</div>
            </div>
          )}
          {countdown !== null && !answered && (
            <div className="text-center">
              <div className="flex items-center gap-1 text-lg font-bold">
                <Timer className="h-4 w-4" />
                {countdown}s
              </div>
              <div className="text-xs text-white/70">นับถอยหลัง</div>
            </div>
          )}
          {totalQuestions && (
            <div className="text-center">
              <div className="text-lg font-bold">{currentQuestion + 1}/{totalQuestions}</div>
              <div className="text-xs text-white/70">คำถาม</div>
            </div>
          )}
          {!totalQuestions && (
            <div className="text-center">
              <div className="text-lg font-bold">{currentQuestion + 1}</div>
              <div className="text-xs text-white/70">คำถาม</div>
            </div>
          )}
          <div className="text-center">
            <div className="flex items-center gap-1 text-lg font-bold">
              <CheckCircle2 className="h-4 w-4" />
              {score.correct}
            </div>
            <div className="text-xs text-white/70">ถูกต้อง</div>
          </div>
          <button
            onClick={onEndPractice}
            className="ml-2 rounded-lg bg-red-500/90 hover:bg-red-600 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white transition-colors"
          >
            <span className="hidden sm:inline">จบ</span>
            <span className="sm:hidden">×</span>
          </button>
        </div>
      </div>
      
      <div className="px-4 lg:px-6 pb-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
