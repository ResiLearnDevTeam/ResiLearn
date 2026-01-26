'use client';

import Link from 'next/link';

/**
 * Wireframe แบบฝึก — หน้าเลือกเข้าแต่ละโหมด (ตัวเลือก | เติมคำ | เลือกสี)
 * ลิงก์เข้า: /quiz/choice, /quiz/fill-in, /quiz/color
 */
export default function PracticeWireframeQuizPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link href="/learn/self/practice/wireframe" className="text-sm text-orange-600 hover:underline">← กลับ wireframe ฝึกฝน</Link>
          <p className="font-bold text-gray-700">แบบฝึก — เลือกโหมด</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          
          <Link
            href="/learn/self/practice/wireframe/quiz/choice"
            className="rounded-2xl border-2 border-orange-300 bg-orange-50/50 p-6 hover:border-orange-500 hover:shadow-lg transition-all"
          >
            <p className="text-lg font-bold text-orange-700 mb-2">ตัวเลือก (ช้อย)</p>
            <p className="text-sm text-gray-600 mb-4">เลือกคำตอบจาก 4 ตัวเลือกที่ให้มา</p>
            <div className="h-10 rounded-xl bg-orange-200/50 flex items-center justify-center text-orange-800 font-semibold text-sm">
              เข้าแบบฝึก →
            </div>
          </Link>

          <Link
            href="/learn/self/practice/wireframe/quiz/fill-in"
            className="rounded-2xl border-2 border-blue-300 bg-blue-50/50 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <p className="text-lg font-bold text-blue-700 mb-2">เติมคำ</p>
            <p className="text-sm text-gray-600 mb-4">พิมพ์ค่าความต้านทานโดยตรง (ค่า + หน่วย + ±%)</p>
            <div className="h-10 rounded-xl bg-blue-200/50 flex items-center justify-center text-blue-800 font-semibold text-sm">
              เข้าแบบฝึก →
            </div>
          </Link>

          <Link
            href="/learn/self/practice/wireframe/quiz/color"
            className="rounded-2xl border-2 border-purple-300 bg-purple-50/50 p-6 hover:border-purple-500 hover:shadow-lg transition-all"
          >
            <p className="text-lg font-bold text-purple-700 mb-2">เลือกสี</p>
            <p className="text-sm text-gray-600 mb-4">กำหนดค่า แล้วเลือกแถบสีที่ถูกต้อง</p>
            <div className="h-10 rounded-xl bg-purple-200/50 flex items-center justify-center text-purple-800 font-semibold text-sm">
              เข้าแบบฝึก →
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
