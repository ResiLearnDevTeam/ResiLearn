'use client';

import Link from 'next/link';

/**
 * Wireframe แบบฝึก — ตัวเลือก (ช้อย) เท่านั้น — ตัวหลอกสำหรับแคปรูปประกอบเอกสาร
 */
export default function QuizChoiceWireframePage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5">
        <div className="flex items-center justify-between">
          <Link href="/learn/self/practice/wireframe/quiz" className="h-8 w-20 rounded bg-white/20 flex items-center justify-center text-white/90 text-xs">← กลับ</Link>
          <span className="font-bold text-sm">แบบฝึก — ตัวเลือก (ช้อย)</span>
          <div className="flex gap-3 text-[10px]">
            <span>1/10</span>
            <span>0 ถูก</span>
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/30 mt-2 overflow-hidden">
          <div className="h-full w-[10%] rounded-full bg-white" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 min-h-0">
        <div className="w-full max-w-xl flex flex-col items-center gap-6">
          <div className="w-64 h-28 rounded-lg border-2 border-dashed border-gray-400 bg-gray-100" />
          <p className="text-center text-lg font-semibold text-gray-700">
            ค่าความต้านทานของตัวต้านทานนี้คือเท่าไร?
          </p>
          <div className="grid grid-cols-2 gap-4 w-full">
            {['330Ω ±5%', '1kΩ ±5%', '470Ω ±5%', '2.2kΩ ±5%'].map((o) => (
              <div key={o} className="p-5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-center">
                <span className="text-lg font-bold text-gray-600">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4">
        <div className="max-w-xl mx-auto h-12 rounded-xl bg-gray-400" />
      </div>
    </div>
  );
}
