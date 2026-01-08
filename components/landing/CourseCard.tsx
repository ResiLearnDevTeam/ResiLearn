'use client';

import Link from 'next/link';
import { Star, BookOpen, Users, Clock } from 'lucide-react';

interface CourseCardProps {
  id: string;
  name: string;
  description: string;
  teacher?: {
    name: string;
    image?: string;
  };
  enrollmentCount?: number;
  image?: string;
  price?: number;
  priceColor?: string;
  lessons?: number;
  duration?: string;
  rating?: number;
}

export default function CourseCard({
  id,
  name,
  description,
  teacher,
  enrollmentCount = 0,
  image,
  price = 0,
  priceColor = 'bg-purple-500',
  lessons = 12,
  duration = '3 ชั่วโมง',
  rating = 4.5,
}: CourseCardProps) {
  return (
    <Link href={`/learn/classroom/courses/${id}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Course Image */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-orange-300 rounded-full flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-orange-700" />
                </div>
                <p className="text-orange-700 text-sm font-medium">รูปภาพหลักสูตร</p>
              </div>
            </div>
          )}
          
          {/* Price Circle */}
          <div className={`absolute top-4 right-4 w-14 h-14 ${priceColor} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
            {price === 0 ? 'ฟรี' : `฿${price}`}
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          {/* Instructor & Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                {teacher?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {teacher?.name || 'อาจารย์ผู้สอน'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{rating}</span>
            </div>
          </div>

          {/* Course Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {name}
          </h3>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4"></div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{lessons} บทเรียน</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{enrollmentCount} คน</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
