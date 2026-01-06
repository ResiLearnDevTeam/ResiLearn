'use client';

import ImagePlaceholder from './ImagePlaceholder';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PlatformSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Image */}
              <div className="relative">
                <ImagePlaceholder
                  aspectRatio="aspect-[3/4]"
                  description="Student with Book"
                  className="rounded-xl shadow-lg"
                />
              </div>

              {/* Right Image */}
              <div className="relative mt-8">
                <ImagePlaceholder
                  aspectRatio="aspect-[3/4]"
                  description="Happy Student"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>

            {/* Overlay Chat Bubble */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">!</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">สวัสดี!</p>
                  <p className="text-sm text-gray-600">เข้าร่วมหลักสูตรของเรา</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                แพลตฟอร์มเดียวและ{' '}
                <span className="text-orange-600 underline decoration-orange-500 decoration-2">
                  หลักสูตรมากมาย
                </span>
                {' '}สำหรับคุณ
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                เรียนรู้การอ่านค่าตัวต้านทานผ่านระบบการเรียนรู้แบบทีละขั้นตอน 
                พร้อมแบบฝึกหัดและแบบทดสอบที่ครอบคลุม
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {[
                'หลักสูตรออนไลน์ 24/7',
                'หลักสูตรที่เสร็จสมบูรณ์ 300+',
                'ผู้สอนและติวเตอร์ที่เชื่อถือได้',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 text-lg">{feature}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="/register"
              className="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              เริ่มเรียนเลย
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

