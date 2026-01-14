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
              <span className="text-orange-600 font-semibold tracking-wide">
                ค้นหาผู้สอนที่ใช่สำหรับคุณ
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                มาเรียนรู้เกี่ยวกับ
              </h1>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight relative inline-block">
                <span className="relative">
                  ความรู้ใหม่
                  {/* Hand-drawn circle around "ความรู้ใหม่" */}
                  <svg 
                    className="absolute -inset-x-4 -inset-y-2 w-[calc(100%+32px)] h-[calc(100%+16px)]" 
                    viewBox="0 0 200 80" 
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <ellipse 
                      cx="100" 
                      cy="40" 
                      rx="95" 
                      ry="35" 
                      stroke="#f97316" 
                      strokeWidth="3" 
                      fill="none"
                      strokeLinecap="round"
                      className="opacity-80"
                      style={{
                        strokeDasharray: '10 5',
                      }}
                    />
                  </svg>
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
              <button className="flex items-center gap-3 text-gray-700 font-medium hover:text-orange-600 transition-colors group">
                <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                  <Play className="w-5 h-5 text-gray-600 ml-1 group-hover:text-orange-500" />
                </div>
                <span>ดูวิดีโอแนะนำ</span>
              </button>
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

              {/* Floating Card - Top Right: Total Active Students */}
              <div className="absolute -top-4 -right-4 lg:right-[-60px] bg-white rounded-xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">25K+</p>
                    <p className="text-sm text-gray-600">นักเรียนที่แอคทีฟ</p>
                  </div>
                </div>
              </div>

              {/* Floating Card - Bottom: Expert Mentors */}
              <div className="absolute -bottom-6 left-0 lg:left-[-40px] bg-white rounded-xl shadow-xl p-5 border border-gray-100">
                <div className="text-center mb-3">
                  <p className="text-3xl font-bold text-gray-900">200+</p>
                  <p className="text-sm text-gray-600">ผู้สอนผู้เชี่ยวชาญ</p>
                </div>
                {/* Avatar row */}
                <div className="flex justify-center -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-orange-300 border-2 border-white flex items-center justify-center text-sm font-semibold text-orange-700">A</div>
                  <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-white flex items-center justify-center text-sm font-semibold text-blue-700">B</div>
                  <div className="w-10 h-10 rounded-full bg-green-300 border-2 border-white flex items-center justify-center text-sm font-semibold text-green-700">C</div>
                  <div className="w-10 h-10 rounded-full bg-purple-300 border-2 border-white flex items-center justify-center text-sm font-semibold text-purple-700">D</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
