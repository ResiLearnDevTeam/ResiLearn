'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 md:pt-32 lg:pt-40 pb-16 bg-gradient-to-br from-orange-50 via-orange-50/50 to-white overflow-hidden">
      {/* Decorative curved lines - right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
        {/* Large outer circle */}
        <div className="absolute right-[-200px] top-1/2 -translate-y-1/2 w-[700px] h-[700px] border-[3px] border-orange-400 rounded-full opacity-60"></div>
        {/* Medium circle */}
        <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[500px] h-[500px] border-[3px] border-orange-400 rounded-full opacity-40"></div>
        {/* Small inner circle */}
        <div className="absolute right-[0px] top-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[2px] border-orange-300 rounded-full opacity-30"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Wavy lines top */}
        <svg className="absolute top-32 right-1/3 w-12 h-12 text-orange-400" viewBox="0 0 48 48" fill="none">
          <path d="M4 12C8 8 12 16 16 12C20 8 24 16 28 12C32 8 36 16 40 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M4 24C8 20 12 28 16 24C20 20 24 28 28 24C32 20 36 28 40 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        
        {/* Dots pattern left */}
        <div className="absolute left-1/4 top-2/3 grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-orange-300 rounded-full opacity-50"></div>
          ))}
        </div>

        {/* Triangle shapes */}
        <div className="absolute right-20 top-1/3">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-orange-500"></div>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-orange-500"></div>
            </div>
            <div className="flex gap-1 ml-2">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-orange-500"></div>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-orange-500"></div>
            </div>
          </div>
        </div>

        {/* Arrow shapes */}
        <svg className="absolute right-10 bottom-1/3 w-16 h-8 text-orange-400" viewBox="0 0 64 32" fill="none">
          <path d="M4 16H20M20 16L14 10M20 16L14 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 16H40M40 16L34 10M40 16L34 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M44 16H60M60 16L54 10M60 16L54 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-5xl ml-12 lg:ml-0">
          {/* Main Content - Full Width */}
          <div className="space-y-10 text-left">
            {/* Main Heading - Single Line */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                มาเรียนรู้เกี่ยวกับ <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">ความรู้ใหม่</span> และทักษะต่าง ๆ <span className="text-orange-600">ใน ResiLearn</span>
              </h1>
            </div>

            {/* Description */}
            <div className="max-w-3xl">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
                ระบบการเรียนรู้ที่ออกแบบมาเพื่อช่วยให้คุณเข้าใจและเชี่ยวชาญ การอ่านค่าตัวต้านทานด้วยแถบสี พร้อมแบบฝึกหัดและแบบทดสอบที่ปรับให้เหมาะกับความสามารถของคุณ
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 pt-4">
              <Link
                href="/register"
                className="group px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                เริ่มต้นเลย
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/learn"
                className="px-8 py-4 rounded-full bg-white text-orange-600 font-semibold border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                ดูหลักสูตร
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
