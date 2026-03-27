'use client';

import Link from 'next/link';

/**
 * Wireframe หน้า Analysis / การวิเคราะห์ — โครงแบบหลอกสำหรับแคปรูปประกอบเอกสาร
 * เต็มหน้า ไม่มี sidebar — แคปครั้งเดียว
 */
export default function PracticeWireframeAnalysisPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-purple-100" />
          <div>
            <p className="text-lg font-bold text-gray-700">Lorem ipsum</p>
            <p className="text-xs text-gray-500">Dolor sit amet การวิเคราะห์</p>
          </div>
        </div>
        <Link href="/learn/self/practice/wireframe" className="text-xs text-orange-600 hover:underline">← กลับ</Link>
      </header>

      {/* Tabs */}
      <div className="shrink-0 flex gap-2 px-6 py-2 bg-gray-100 border-b border-gray-200">
        <div className="h-8 w-20 rounded-lg bg-gray-300" />
        <div className="h-8 w-20 rounded-lg bg-gray-200" />
        <span className="text-xs text-gray-500 self-center">ภาพรวม | จุดอ่อน</span>
      </div>

      {/* Content — 2x2 grid + จุดอ่อน แถวเดียว */}
      <main className="flex-1 min-h-0 p-4 grid grid-cols-2 grid-rows-2 gap-3 overflow-hidden">
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-3 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <div className="h-6 w-6 rounded bg-gray-200" />
            <p className="font-bold text-gray-700 text-sm">เรดาร์</p>
          </div>
          <div className="flex-1 min-h-0 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-xs text-gray-500">Radar</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-3 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <div className="h-6 w-6 rounded bg-gray-200" />
            <p className="font-bold text-gray-700 text-sm">ฮีตแมป</p>
          </div>
          <div className="flex-1 min-h-0 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-xs text-gray-500">Heatmap</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-3 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <div className="h-6 w-6 rounded bg-gray-200" />
            <p className="font-bold text-gray-700 text-sm">Bar</p>
          </div>
          <div className="flex-1 min-h-0 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-xs text-gray-500">Bar chart</p>
          </div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-3 flex flex-col min-h-0">
          <div className="flex items-center gap-2 mb-2 shrink-0">
            <div className="h-6 w-6 rounded bg-gray-200" />
            <p className="font-bold text-gray-700 text-sm">พาย</p>
          </div>
          <div className="flex-1 min-h-0 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-xs text-gray-500">Pie chart</p>
          </div>
        </div>
      </main>

      {/* จุดอ่อน — แถบล่าง */}
      <div className="shrink-0 px-6 py-3 border-t border-gray-200 bg-white flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-red-100" />
          <p className="font-bold text-gray-700 text-sm">จุดอ่อน</p>
        </div>
        <div className="flex gap-2 flex-1 min-w-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5">
              <div className="h-6 w-6 rounded bg-gray-200 shrink-0" />
              <div className="h-3 w-16 bg-gray-200 rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
