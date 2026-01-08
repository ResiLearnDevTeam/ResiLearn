'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Users, BookOpen } from 'lucide-react';

export default function HeroSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = '/register';
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-300/20 rounded-full blur-2xl"></div>
        {/* Decorative dots */}
        <div className="absolute top-32 right-1/4 w-3 h-3 bg-orange-400 rounded-full"></div>
        <div className="absolute top-48 right-1/3 w-2 h-2 bg-orange-300 rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-orange-200 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-sm font-medium text-orange-700">แพลตฟอร์มการเรียนออนไลน์</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                มาเรียนรู้เกี่ยวกับ{' '}
                <span className="text-orange-600 underline decoration-orange-500 decoration-4 underline-offset-4">
                  ความรู้ใหม่
                </span>
                <br />
                และทักษะต่าง ๆ
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                ระบบการเรียนรู้แบบออนไลน์ที่ครอบคลุม เรียนรู้การอ่านค่าตัวต้านทานและพัฒนาทักษะของคุณผ่านแบบฝึกหัดที่มีประสิทธิภาพ
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
              >
                เริ่มต้นเรียน
              </Link>
              <button className="flex items-center gap-3 px-6 py-4 text-gray-700 font-medium hover:text-orange-600 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <Play className="w-5 h-5 text-orange-600 ml-1" fill="currentColor" />
                </div>
                <span>ดูวิดีโอแนะนำ</span>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-orange-200 border-2 border-white flex items-center justify-center text-sm font-semibold text-orange-700">A</div>
                  <div className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-sm font-semibold text-blue-700">B</div>
                  <div className="w-10 h-10 rounded-full bg-green-200 border-2 border-white flex items-center justify-center text-sm font-semibold text-green-700">C</div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">20K+</p>
                  <p className="text-sm text-gray-600">นักเรียนที่ลงทะเบียน</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            {/* Main Hero Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 mx-auto mb-4 bg-orange-300 rounded-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-orange-700" />
                    </div>
                    <p className="text-orange-700 font-medium">รูปภาพ Hero</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Stat Card - Top Right */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-4 shadow-lg hidden md:block">
                <div className="text-center text-white">
                  <p className="text-3xl font-bold">200+</p>
                  <p className="text-sm">หลักสูตร</p>
                </div>
              </div>

              {/* Floating Card - Bottom Left */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">20K+</p>
                    <p className="text-sm text-gray-600">นักเรียนที่แอคทีฟ</p>
                  </div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -top-8 left-1/4 w-16 h-16 bg-orange-200 rounded-full -z-10"></div>
              <div className="absolute -bottom-8 right-1/4 w-12 h-12 bg-orange-300 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
