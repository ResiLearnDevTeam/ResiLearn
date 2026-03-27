'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'สมชาย ใจดี',
    title: 'ผู้ก่อตั้ง TechStart',
    rating: 5,
    comment: 'ระบบการเรียนรู้แบบทีละขั้นตอนช่วยให้ฉันเข้าใจการอ่านค่าตัวต้านทานได้ดีขึ้นมาก แบบฝึกหัดที่หลากหลายทำให้การเรียนไม่น่าเบื่อ เหมาะสำหรับทุกคนที่ต้องการพัฒนาทักษะ',
    avatarColor: 'from-orange-400 to-orange-600',
  },
  {
    name: 'สมหญิง รักเรียน',
    title: 'วิศวกรไฟฟ้า',
    rating: 5,
    comment: 'ชอบมากเลยค่ะ สามารถเรียนได้ทุกที่ทุกเวลา และมีแบบทดสอบที่ช่วยให้รู้ว่าตัวเองเข้าใจมากแค่ไหน ทำให้การเรียนรู้เป็นเรื่องสนุกและมีประสิทธิภาพ',
    avatarColor: 'from-blue-400 to-blue-600',
  },
  {
    name: 'วิชัย เก่งมาก',
    title: 'นักศึกษา',
    rating: 5,
    comment: 'หลักสูตรออกแบบมาดีมาก เนื้อหาครอบคลุมและเข้าใจง่าย ผู้สอนอธิบายได้ละเอียด ทำให้เรียนรู้ได้เร็วและจำได้นาน แนะนำเลยครับ',
    avatarColor: 'from-green-400 to-green-600',
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
            <span className="text-sm font-medium text-orange-700">รีวิว</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            นักเรียนของเรา{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-4 underline-offset-4">
              พูดถึงเรา
            </span>
            {' '}อย่างไร
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ฟังความคิดเห็นจากนักเรียนที่ใช้ระบบของเราในการพัฒนาทักษะ
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300 ${
                index === currentIndex ? 'ring-2 ring-orange-500 ring-offset-2' : ''
              }`}
            >
              {/* Header with Avatar and Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.title}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-orange-200" />
              </div>

              {/* Comment */}
              <p className="text-gray-700 leading-relaxed">
                "{testimonial.comment}"
              </p>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-center gap-4">
          <button
            onClick={prevTestimonial}
            className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-300 transition-colors shadow-md"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextTestimonial}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center hover:from-orange-600 hover:to-orange-700 transition-colors shadow-md"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
