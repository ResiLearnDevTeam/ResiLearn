'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';

/**
 * Wireframe หน้ากำหนดเอง (custom) — ตัวหลอกสำหรับแคปรูปประกอบเอกสาร
 */
export default function PracticeWireframeCustomPage() {
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
              <p className="text-xl font-bold text-gray-700">Elit sed do</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 lg:px-16 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-lg font-bold text-gray-700">Lorem ipsum</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border-2 border-orange-400 bg-orange-50/30 p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-300" />
                  <div>
                    <p className="font-bold text-gray-700">Lorem</p>
                    <p className="text-sm text-gray-500">Dolor sit amet.</p>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />
                  <div>
                    <p className="font-bold text-gray-700">Ipsum</p>
                    <p className="text-sm text-gray-500">Consectetur elit.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-gray-400 text-sm font-bold flex items-center justify-center text-white">2</div>
                <p className="text-lg font-bold text-gray-700">Dolor sit amet</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />
                  <p className="font-bold text-gray-700">Lorem 4</p>
                </div>
                <div className="rounded-xl border-2 border-dashed border-gray-300 p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />
                  <p className="font-bold text-gray-700">Lorem 5</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-gray-400 text-sm font-bold flex items-center justify-center text-white">3</div>
                <p className="text-lg font-bold text-gray-700">Consectetur elit</p>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {['Lorem', 'Ipsum', 'Dolor'].map((t) => (
                  <div key={t} className="rounded-xl border-2 border-dashed border-gray-300 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gray-200" />
                    <p className="font-bold text-gray-700 text-sm">{t}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Toggle + options */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gray-400" />
                  <p className="text-lg font-bold text-gray-700">Lorem amet</p>
                </div>
                <div className="h-7 w-12 rounded-full bg-gray-400" />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[5, 10, 20, 50].map((n) => (
                  <div key={n} className="rounded-xl border-2 border-dashed border-gray-300 p-4 text-center">
                    <p className="font-bold text-gray-700">{n} Lorem</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-2xl border-2 border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-full bg-gray-400" />
                <p className="font-bold text-gray-700">Lorem ipsum</p>
              </div>
              <div className="space-y-2 bg-white rounded-xl p-4">
                {['Lorem', 'Ipsum', 'Dolor', 'Sit'].map((t) => (
                  <div key={t} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-600">{t}</span>
                    <span className="font-semibold text-gray-700">—</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 px-8 lg:px-16 py-4 border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Link href="/learn/self/practice/wireframe" className="text-gray-600 hover:underline py-3">
              ← กลับ
            </Link>
            <div className="flex-1 h-12 rounded-xl bg-gray-400" />
          </div>
        </footer>
      </div>
    </div>
  );
}
