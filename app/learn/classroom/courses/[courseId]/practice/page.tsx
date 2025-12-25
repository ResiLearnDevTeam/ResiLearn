'use client';

import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Dumbbell, Zap, Settings, TrendingUp } from 'lucide-react';

export default function ClassroomPracticePage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <ClassroomSidebar courseId={courseId} />

      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">โหมดฝึกฝน</h1>
                <p className="text-gray-600">เลือกรูปแบบการฝึกฝนที่เหมาะกับคุณ</p>
              </div>
            </div>
          </div>

          {/* Practice Modes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Quick Practice */}
            <Link
              href={`/learn/classroom/courses/${courseId}/practice/quick/select`}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-8px] rounded-full bg-blue-100 opacity-20" />
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-transform group-hover:scale-110">
                  <Zap className="h-8 w-8" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-gray-900">ฝึกด่วน</h2>
                <p className="mb-4 text-gray-600">
                  เริ่มฝึกฝนทันที ไม่ต้องตั้งค่า เหมาะสำหรับการฝึกฝนแบบรวดเร็ว
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                  <span>เริ่มเลย</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Custom Practice */}
            <Link
              href={`/learn/classroom/courses/${courseId}/practice/custom`}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-8px] rounded-full bg-purple-100 opacity-20" />
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transition-transform group-hover:scale-110">
                  <Settings className="h-8 w-8" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-gray-900">ฝึกแบบกำหนดเอง</h2>
                <p className="mb-4 text-gray-600">
                  ปรับแต่งการฝึกฝนตามความต้องการ กำหนดจำนวนคำถาม เวลา และความยาก
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
                  <span>ตั้งค่า</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* View Progress */}
            <Link
              href={`/learn/classroom/courses/${courseId}/dashboard`}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-8px] rounded-full bg-green-100 opacity-20" />
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transition-transform group-hover:scale-110">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h2 className="mb-3 text-2xl font-bold text-gray-900">ดูความคืบหน้า</h2>
                <p className="mb-4 text-gray-600">
                  ตรวจสอบผลการฝึกฝน ดูสถิติ และวิเคราะห์จุดที่ต้องพัฒนา
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <span>ดูรายงาน</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Tips Section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">💡 เคล็ดลับการฝึกฝน</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">ฝึกสม่ำเสมอ</h4>
                  <p className="text-sm text-gray-600">
                    ฝึกฝนวันละ 10-15 นาทีจะได้ผลดีกว่าฝึกนานแต่ไม่สม่ำเสมอ
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">ตรวจสอบความก้าวหน้า</h4>
                  <p className="text-sm text-gray-600">
                    ดูสถิติและวิเคราะห์จุดอ่อนเพื่อปรับปรุงการเรียนรู้
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">เริ่มจากง่าย</h4>
                  <p className="text-sm text-gray-600">
                    เริ่มจากตัวต้านทาน 4 แถบก่อน แล้วค่อยไปยัง 5 แถบ
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">ทำความเข้าใจ</h4>
                  <p className="text-sm text-gray-600">
                    อ่านคำอธิบายเมื่อตอบผิด เพื่อเรียนรู้และจำได้ดีขึ้น
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
