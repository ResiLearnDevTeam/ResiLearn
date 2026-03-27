'use client';

import Link from 'next/link';

/**
 * Wireframe หน้า /learn/self/dashboard — ตัวหลอกสำหรับแคปรูปประกอบเอกสาร
 * เต็มหน้า ไม่มี sidebar — แคปครั้งเดียว
 */
export default function DashboardWireframePage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      <main className="flex-1 min-h-0 overflow-auto px-4 py-3">
        <div className="space-y-3 max-w-6xl mx-auto">
            
            {/* Welcome */}
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="text-lg font-bold text-gray-700">Lorem ipsum dolor sit amet</div>
                <div className="text-xs text-gray-500">Consectetur adipiscing elit.</div>
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Lorem 25 Jan 2025</div>
            </div>

            {/* Stats — 4 */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { border: 'border-green-400' },
                { border: 'border-orange-400' },
                { border: 'border-blue-400' },
                { border: 'border-purple-400' },
              ].map(({ border }, i) => (
                <div key={i} className={`rounded-xl bg-white p-3 border-2 ${border}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-gray-500">Lorem</p>
                      <p className="text-lg font-bold text-gray-700">—</p>
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick — 2 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border-2 border-dashed border-gray-300">
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm">Lorem</p>
                  <p className="text-[10px] text-gray-500 truncate">Dolor sit amet.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white p-3 border-2 border-dashed border-gray-300">
                <div className="h-10 w-10 rounded-lg bg-gray-200" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm">Elit</p>
                  <p className="text-[10px] text-gray-500 truncate">Eiusmod tempor.</p>
                </div>
              </div>
            </div>

            {/* Chart + Analytics แถวเดียว */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white p-3 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded bg-gray-200" />
                  <p className="font-bold text-gray-700 text-sm">Lorem กราฟ</p>
                </div>
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {['L', 'I', 'D', 'S'].map((t) => (
                    <div key={t} className="rounded bg-gray-100 p-1 text-center">
                      <p className="text-[10px] text-gray-500">{t}</p>
                      <p className="text-xs font-bold">—%</p>
                    </div>
                  ))}
                </div>
                <div className="h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                  Chart
                </div>
              </div>
              <div className="rounded-xl bg-white p-3 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded bg-gray-200" />
                  <p className="font-bold text-gray-700 text-sm">Analytics</p>
                </div>
                <div className="flex gap-1 mb-2">
                  {['L', 'I', 'D'].map((t) => (
                    <div key={t} className="h-6 px-2 rounded bg-gray-100 border border-gray-200 text-[10px]" />
                  ))}
                </div>
                <div className="h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                  กราฟ
                </div>
              </div>
            </div>

            {/* Recent + กลับ */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-gray-200 shrink-0" />
                <div className="flex gap-2 flex-1 min-w-0">
                  {['L', 'I', 'D', 'S'].map((t) => (
                    <div key={t} className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1.5 border border-gray-200 shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                      <div>
                        <p className="font-medium text-gray-700 text-xs">{t}</p>
                        <p className="text-[10px] text-gray-500">—</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/learn/self/dashboard" className="text-xs text-orange-600 hover:underline shrink-0">← กลับ</Link>
            </div>
          </div>
        </main>
    </div>
  );
}
