'use client';

import Link from 'next/link';

/**
 * Wireframe แบบฝึก — เลือกสี เท่านั้น — ตัวหลอกสำหรับแคปรูปประกอบเอกสาร
 */
export default function QuizColorWireframePage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5">
        <div className="flex items-center justify-between">
          <Link href="/learn/self/practice/wireframe/quiz" className="h-8 w-20 rounded bg-white/20 flex items-center justify-center text-white/90 text-xs">← กลับ</Link>
          <span className="font-bold text-sm">แบบฝึก — เลือกสี</span>
          <div className="flex gap-3 text-[10px]">
            <span>1/10</span>
            <span>0 ถูก</span>
          </div>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/30 mt-2 overflow-hidden">
          <div className="h-full w-[10%] rounded-full bg-white" />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto px-6 py-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <p className="text-sm text-gray-500">เลือกแถบสีให้ตรงกับค่า</p>
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-10 py-5 shadow-lg">
            <p className="text-2xl font-extrabold text-white">330Ω ±5%</p>
          </div>
          <div className="w-full max-w-lg h-24 rounded-lg border-2 border-dashed border-gray-400 bg-gray-100" />
          <div className="flex items-center justify-center gap-4">
            <div className="rounded-xl border-2 border-orange-400 bg-orange-50 px-5 py-2.5">
              <span className="text-sm font-bold text-orange-800">หลักที่ 1</span>
            </div>
            <div className="flex gap-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i===1 ? 'bg-orange-500 ring-2 ring-orange-300' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-5 gap-3 max-w-md">
            {['ดำ','น้ำตาล','แดง','ส้ม','เหลือง','เขียว','น้ำเงิน','ม่วง','เทา','ขาว'].map((c) => (
              <div key={c} className="flex flex-col items-center p-2 rounded-xl border-2 border-dashed border-gray-300">
                <div className="w-10 h-10 rounded-lg border border-gray-300 bg-gray-200 mb-1" />
                <span className="text-xs font-semibold text-gray-600">{c}</span>
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
