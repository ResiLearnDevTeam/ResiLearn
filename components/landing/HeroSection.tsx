'use client';

import Link from 'next/link';
import { Play, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-gradient-to-br from-orange-50 via-orange-50/50 to-white overflow-hidden">
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center">

            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                มาเรียนรู้เกี่ยวกับ
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight relative inline-block">
                <span className="relative">
                  ความรู้ใหม่
                </span>
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                และทักษะต่าง ๆ
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              เรามอบผู้สอนที่ดีที่สุดเพื่อเพิ่มพูนความรู้และทักษะของคุณ 
              มาเริ่มต้นและสัมผัสประสบการณ์การเรียนรู้ที่ผ่อนคลาย
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-6">
              <Link
                href="/register"
                className="px-8 py-4 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
              >
                เริ่มต้นเลย
              </Link>

            </div>
          </div>

          {/* Right Side - Image with floating cards */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Main Image Container */}
            <div className="relative w-[400px] h-[500px]">
              {/* Image placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-orange-300 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-orange-700" />
                  </div>
                  <p className="text-orange-700 font-medium">รูปภาพนักเรียน</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
