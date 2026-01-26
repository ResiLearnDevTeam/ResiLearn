'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';

/**
 * Wireframe หน้า ฝึกด่วน (quick/select) — ตัวหลอกสำหรับแคปรูปประกอบเอกสาร
 */
export default function PracticeWireframeQuickPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <LeftSidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
        {/* Header */}
        <header className="shrink-0 px-8 lg:px-16 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-300" />
              <p className="text-xl font-bold text-gray-700">Lorem ipsum</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-8 lg:px-16 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Lorem 1 ipsum 3</span>
                <span className="text-sm font-bold text-gray-600">—%</span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gray-400 rounded-full" />
              </div>
              <div className="flex justify-between mt-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full bg-gray-300" />
                ))}
              </div>
            </div>

            {/* Step title */}
            <p className="text-xl font-bold text-gray-700 text-center">Lorem ipsum dolor sit</p>

            {/* Selection cards */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-xl border-2 border-orange-400 bg-orange-50/50 p-5">
                <div className="h-12 w-12 rounded-xl bg-gray-300" />
                <div className="flex-1">
                  <p className="font-bold text-gray-700">Lorem ipsum</p>
                  <p className="text-sm text-gray-500">Dolor sit amet consectetur.</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-300" />
              </div>
              <div className="flex items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 p-5">
                <div className="h-12 w-12 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <p className="font-bold text-gray-700">Elit sed do</p>
                  <p className="text-sm text-gray-500">Eiusmod tempor incididunt.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 px-8 lg:px-16 py-4 border-t border-gray-200 bg-white">
          <div className="max-w-2xl mx-auto flex gap-3 items-center">
            <Link href="/learn/self/practice/wireframe" className="text-sm text-orange-600 hover:underline">
              ← กลับ
            </Link>
            <div className="h-11 w-20 rounded-xl bg-gray-200" />
            <div className="flex-1 h-11 rounded-xl bg-gray-400" />
          </div>
        </footer>
      </div>
    </div>
  );
}
