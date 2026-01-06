'use client';

import { Star } from 'lucide-react';
import ImagePlaceholder from './ImagePlaceholder';

const testimonials = [
  {
    name: 'สมชาย ใจดี',
    rating: 4.9,
    comment: 'ระบบการเรียนรู้แบบทีละขั้นตอนช่วยให้ฉันเข้าใจการอ่านค่าตัวต้านทานได้ดีขึ้นมาก แบบฝึกหัดที่หลากหลายทำให้การเรียนไม่น่าเบื่อ',
    avatar: null,
  },
  {
    name: 'สมหญิง รักเรียน',
    rating: 5.0,
    comment: 'ชอบมากเลยค่ะ สามารถเรียนได้ทุกที่ทุกเวลา และมีแบบทดสอบที่ช่วยให้รู้ว่าตัวเองเข้าใจมากแค่ไหน',
    avatar: null,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            นักเรียนของเรา{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-2">
              พูดถึงเรา
            </span>
            {' '}อย่างไร
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ฟังความคิดเห็นจากนักเรียนที่ใช้ระบบของเราในการพัฒนาทักษะการอ่านค่าตัวต้านทาน
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(testimonial.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600 font-semibold">
                  {testimonial.rating}
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">นักเรียน</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

