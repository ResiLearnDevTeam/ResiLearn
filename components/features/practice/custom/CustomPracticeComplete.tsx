'use client';

import Link from 'next/link';
import { Trophy, RotateCcw, Home } from 'lucide-react';

interface CustomPracticeCompleteProps {
  score: { correct: number; total: number };
  hasTimeRunOut: boolean;
  endedEarly: boolean;
  totalQuestions: number | null;
  questionsLength: number;
  onRestart: () => void;
}

export default function CustomPracticeComplete({
  score,
  hasTimeRunOut,
  endedEarly,
  totalQuestions,
  questionsLength,
  onRestart,
}: CustomPracticeCompleteProps) {
  const finalAccuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const isExcellent = finalAccuracy >= 80;
  const isGood = finalAccuracy >= 60 && finalAccuracy < 80;

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
          <div className="text-center px-6 max-w-lg">
            <div className="mb-8 flex justify-center">
              <div className={`flex h-28 w-28 items-center justify-center rounded-full shadow-xl ${
                isExcellent ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                isGood ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                'bg-gradient-to-br from-blue-400 to-blue-500'
              }`}>
                <Trophy className="h-14 w-14 text-white" />
              </div>
            </div>
            
            <h1 className="mb-3 text-4xl font-extrabold text-gray-900">
              {hasTimeRunOut ? 'ถึงเวลาที่กำหนดแล้ว!' : endedEarly ? 'ฝึกฝนเสร็จสิ้น!' : isExcellent ? 'ยอดเยี่ยม!' : isGood ? 'ดีมาก!' : 'ฝึกฝนเสร็จสิ้น!'}
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              {hasTimeRunOut 
                ? 'คุณได้ทำครบเวลาที่กำหนดแล้ว' 
                : endedEarly
                ? `คุณได้ตอบ ${score.total} คำถาม`
                : totalQuestions !== null
                ? `คุณได้ทำครบทั้ง ${questionsLength} ข้อแล้ว`
                : `คุณได้ทำ ${score.total} คำถามแล้ว`}
            </p>
            
            <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{score.correct}</div>
                  <div className="text-sm text-gray-500">ถูกต้อง</div>
                </div>
                <div className="text-center border-x border-gray-200">
                  <div className="text-3xl font-bold text-gray-400">{score.total - score.correct}</div>
                  <div className="text-sm text-gray-500">ผิด</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    isExcellent ? 'text-green-600' : isGood ? 'text-blue-600' : 'text-gray-600'
                  }`}>{finalAccuracy}%</div>
                  <div className="text-sm text-gray-500">ความแม่นยำ</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRestart}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
              >
                <RotateCcw className="h-5 w-5" />
                ฝึกอีกครั้ง
              </button>
              <Link
                href="/learn/self/practice"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-gray-200 px-6 py-4 font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
              >
                <Home className="h-5 w-5" />
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
