'use client';

import { Shield, Headphones, FileText, Award, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'ผู้สอนมีประสบการณ์',
    description: 'เรียนกับผู้เชี่ยวชาญที่มีประสบการณ์จริงในสายงาน',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: Headphones,
    title: 'การสนับสนุนเฉพาะทาง',
    description: 'ทีมงานพร้อมช่วยเหลือและตอบคำถามตลอดการเรียน',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: FileText,
    title: 'การเรียนรู้ดิจิทัล',
    description: 'เข้าถึงเนื้อหาได้ทุกที่ทุกเวลาผ่านแพลตฟอร์มออนไลน์',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Award,
    title: 'ใบประกาศนียบัตร',
    description: 'รับใบประกาศนียบัตรเมื่อเรียนจบหลักสูตร',
    color: 'bg-purple-100 text-purple-600',
  },
];

export default function DifferentSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full">
              <span className="text-sm font-medium text-orange-700">ทำไมต้องเรา</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              อะไรทำให้เรา{' '}
              <span className="text-orange-600 underline decoration-orange-500 decoration-4 underline-offset-4">
                แตกต่าง
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              เราให้ความสำคัญกับประสบการณ์การเรียนรู้ของคุณ ด้วยหลักสูตรคุณภาพ 
              ผู้สอนมืออาชีพ และระบบสนับสนุนที่ครอบคลุม
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 mx-auto mb-4 bg-orange-300 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-orange-700" />
                  </div>
                  <p className="text-orange-700 font-medium">รูปภาพทีมงาน</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200 rounded-full -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-300 rounded-full -z-10"></div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 right-8 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">100%</p>
                  <p className="text-sm text-gray-600">ความพึงพอใจ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
