'use client';

import { Cloud, Video, Palette, FolderOpen } from 'lucide-react';

const categories = [
  {
    icon: Cloud,
    title: 'พัฒนาตนเอง',
    description: 'เรียนรู้ทักษะการพัฒนาตนเองเพื่อเติบโตในทุกด้านของชีวิต',
    bgColor: 'bg-pink-50',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-500',
    hoverBorder: 'hover:border-pink-300',
  },
  {
    icon: Video,
    title: 'ตัดต่อวิดีโอ',
    description: 'เรียนรู้การตัดต่อวิดีโอจากพื้นฐานจนถึงขั้นสูง',
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    hoverBorder: 'hover:border-blue-300',
  },
  {
    icon: Palette,
    title: 'ออกแบบกราฟิก',
    description: 'สร้างสรรค์งานออกแบบที่สวยงามและมีประสิทธิภาพ',
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    hoverBorder: 'hover:border-red-300',
  },
  {
    icon: FolderOpen,
    title: 'UI/UX Design',
    description: 'ออกแบบประสบการณ์ผู้ใช้และอินเทอร์เฟซที่ยอดเยี่ยม',
    bgColor: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    hoverBorder: 'hover:border-yellow-300',
  },
];

export default function CourseCategoriesSection() {
  return (
    <section id="categories" className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
            <span className="text-sm font-medium text-orange-700">หมวดหมู่</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            สำรวจ{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-4 underline-offset-4">
              หลักสูตร
            </span>
            {' '}ตามหมวดหมู่
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            เลือกหมวดหมู่ที่คุณสนใจและเริ่มต้นการเรียนรู้ได้ทันที
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl ${category.bgColor} border-2 border-transparent ${category.hoverBorder} transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${category.iconBg} flex items-center justify-center mb-6`}>
                <category.icon className={`w-8 h-8 ${category.iconColor}`} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {category.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
