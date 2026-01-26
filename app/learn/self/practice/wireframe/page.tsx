'use client';

import Link from 'next/link';

/**
 * Wireframe หน้า /learn/self/practice (โหมดฝึกฝน) — ตัวหลอกสำหรับแคปรูปประกอบเอกสาร
 * เต็มหน้า ไม่มี sidebar — แคปครั้งเดียว
 */
export default function PracticeWireframePage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gray-300" />
              <div>
                <p className="text-xl font-bold text-gray-700">Lorem ipsum</p>
                <p className="text-sm text-gray-500">Dolor sit amet consectetur elit.</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-auto px-6 py-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            
            {/* 2 Cards */}
            <section className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-orange-300 bg-white p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gray-300" />
                  <div>
                    <p className="font-bold text-gray-700">Lorem ipsum</p>
                    <p className="text-xs text-gray-500">Dolor sit amet.</p>
                  </div>
                </div>
                <div className="space-y-1 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-200" />
                      <span className="text-xs text-gray-600">Lorem ipsum.</span>
                    </div>
                  ))}
                </div>
                <Link href="/learn/self/practice/wireframe/quiz" className="block h-10 w-full rounded-lg bg-gray-300" />
              </div>
              <div className="rounded-xl border-2 border-blue-300 bg-white p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-xl bg-gray-300" />
                  <div>
                    <p className="font-bold text-gray-700">Elit sed do</p>
                    <p className="text-xs text-gray-500">Eiusmod tempor.</p>
                  </div>
                </div>
                <div className="space-y-1 mb-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-gray-200" />
                      <span className="text-xs text-gray-600">Amet labore.</span>
                    </div>
                  ))}
                </div>
                <Link href="/learn/self/practice/wireframe/quiz" className="block h-10 w-full rounded-lg bg-gray-300" />
              </div>
            </section>

            <div className="text-center py-1"><span className="bg-gray-50 px-2 text-xs text-gray-500">Lorem amet</span></div>

            {/* ประวัติ + ตาราง compact */}
            <section>
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gray-200" />
                  <p className="font-bold text-gray-700 text-sm">Lorem ipsum dolor</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-36 rounded-lg bg-gray-200" />
                  <div className="h-8 w-20 rounded-lg bg-gray-200" />
                </div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 bg-white overflow-hidden">
                <div className="border-b bg-gray-50 px-4 py-2 flex gap-3">
                  <div className="h-3 w-20 bg-gray-300 rounded" />
                  <div className="h-3 w-16 bg-gray-300 rounded" />
                  <div className="h-3 w-12 bg-gray-300 rounded" />
                  <div className="h-3 w-14 bg-gray-300 rounded" />
                </div>
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 px-4 py-2 border-b border-gray-100 last:border-0">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-5 w-12 rounded-full bg-gray-200" />
                    <div className="h-5 w-12 rounded-full bg-gray-200" />
                    <div className="h-4 w-14 bg-gray-100 rounded" />
                  </div>
                ))}
                <div className="px-4 py-2 bg-gray-50 flex justify-between items-center">
                  <p className="text-xs text-gray-500">Lorem 1–2 ipsum 2</p>
                  <div className="flex gap-1">
                    <div className="h-7 w-7 rounded bg-gray-200" />
                    <div className="h-7 w-7 rounded bg-gray-300" />
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-center gap-3 py-2 text-xs flex-wrap">
              <Link href="/learn/self/practice" className="text-orange-600 hover:underline">← กลับ</Link>
              <Link href="/learn/self/practice/wireframe/quiz" className="text-gray-600 hover:underline">แบบฝึก (เลือกโหมด)</Link>
              <Link href="/learn/self/practice/wireframe/quiz/choice" className="text-gray-600 hover:underline">ตัวเลือก</Link>
              <Link href="/learn/self/practice/wireframe/quiz/fill-in" className="text-gray-600 hover:underline">เติมคำ</Link>
              <Link href="/learn/self/practice/wireframe/quiz/color" className="text-gray-600 hover:underline">เลือกสี</Link>
              <Link href="/learn/self/practice/wireframe/analysis" className="text-gray-600 hover:underline">Analysis</Link>
            </div>
          </div>
        </main>
    </div>
  );
}
