'use client';

import Link from 'next/link';
import { Shield, Laptop, GraduationCap, Star, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '25+ หลักสูตรออนไลน์',
    description: 'หลักสูตรคุณภาพที่ครอบคลุมทุกระดับ',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Laptop,
    title: '30 บทเรียนฟรี',
    description: 'เริ่มเรียนได้ทันทีไม่มีค่าใช้จ่าย',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: GraduationCap,
    title: 'เรียนรู้ตามทักษะ',
    description: 'พัฒนาทักษะที่ต้องการได้ตรงจุด',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Star,
    title: 'ผู้สอนผู้เชี่ยวชาญ',
    description: 'เรียนกับผู้เชี่ยวชาญในสาขา',
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function AboutUsSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Images */}
          <div className="relative">
            {/* Main circular image */}
            <div className="relative w-80 h-80 mx-auto lg:mx-0">
              {/* Large circle */}
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden shadow-xl">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-2 bg-orange-300 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-10 h-10 text-orange-700" />
                    </div>
                    <p className="text-orange-700 text-sm font-medium">รูปภาพ 1</p>
                  </div>
                </div>
              </div>
              
              {/* Small overlapping circle */}
              <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 overflow-hidden shadow-xl border-4 border-white">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-orange-400 rounded-full flex items-center justify-center">
                      <Laptop className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-orange-800 text-sm font-medium">รูปภาพ 2</p>
                  </div>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-4 left-0 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">25+</p>
                    <p className="text-sm text-gray-600">ปีประสบการณ์</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-6 h-6 bg-orange-400 rounded-full opacity-60"></div>
            <div className="absolute bottom-20 right-20 w-4 h-4 bg-orange-300 rounded-full opacity-60"></div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
              <span className="text-sm font-medium text-orange-700">เกี่ยวกับเรา</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              วิธีใหม่ในการพัฒนา{' '}
              <span className="text-orange-600 underline decoration-orange-500 decoration-4 underline-offset-4">
                ทักษะของคุณ
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              เราเชื่อว่าการเรียนรู้ที่ดีเกิดจากการฝึกฝนอย่างเป็นระบบ ระบบของเรามีหลักสูตรที่หลากหลายครอบคลุมทุกระดับ 
              ตั้งแต่พื้นฐานจนถึงขั้นสูง พร้อมแบบฝึกหัดและแบบทดสอบที่ช่วยให้คุณพัฒนาได้อย่างมีประสิทธิภาพ
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="/learn/self/learningpath"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl group"
            >
              ดูหลักสูตรทั้งหมด
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
