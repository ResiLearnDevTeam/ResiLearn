'use client';

import Link from 'next/link';
import CourseCard from './CourseCard';
import { ArrowRight } from 'lucide-react';

// Placeholder courses data
const placeholderCourses = [
  {
    id: '1',
    name: 'เรียนรู้ WordPress และ Elementor สำหรับผู้เริ่มต้น',
    description: 'สร้างเว็บไซต์สวยงามด้วย WordPress และ Elementor',
    teacher: { name: 'สมชาย ใจดี' },
    enrollmentCount: 156,
    price: 0,
    priceColor: 'bg-purple-500',
    lessons: 24,
    duration: '5 ชั่วโมง',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'คู่มือการเป็นนักออกแบบกราฟิกมืออาชีพ',
    description: 'เรียนรู้ทุกอย่างเกี่ยวกับการออกแบบกราฟิก',
    teacher: { name: 'สมหญิง รักเรียน' },
    enrollmentCount: 234,
    price: 199,
    priceColor: 'bg-green-500',
    lessons: 18,
    duration: '4 ชั่วโมง',
    rating: 4.9,
  },
  {
    id: '3',
    name: 'เรียนรู้วิธีการเขียนในฐานะนักเขียนมืออาชีพ',
    description: 'พัฒนาทักษะการเขียนอย่างมืออาชีพ',
    teacher: { name: 'วิชัย นักเขียน' },
    enrollmentCount: 189,
    price: 149,
    priceColor: 'bg-yellow-500',
    lessons: 15,
    duration: '3 ชั่วโมง',
    rating: 4.7,
  },
];

export default function CoursesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
            <span className="text-sm font-medium text-orange-700">หลักสูตรยอดนิยม</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ค้นพบ{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-4 underline-offset-4">
              หลักสูตร
            </span>
            {' '}ที่คุณชื่นชอบ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            เลือกเรียนจากหลักสูตรคุณภาพที่ออกแบบมาเพื่อพัฒนาทักษะของคุณ
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {placeholderCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              name={course.name}
              description={course.description}
              teacher={course.teacher}
              enrollmentCount={course.enrollmentCount}
              price={course.price}
              priceColor={course.priceColor}
              lessons={course.lessons}
              duration={course.duration}
              rating={course.rating}
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link
            href="/learn/self/learningpath"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl group"
          >
            ดูหลักสูตรเพิ่มเติม
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
