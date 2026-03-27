'use client';

import { Facebook, Twitter, Linkedin } from 'lucide-react';

const instructors = [
  {
    name: 'สมชาย ใจดี',
    title: 'UI/UX Designer',
    bgColor: 'bg-pink-100',
    avatarColor: 'from-pink-400 to-pink-600',
    initial: 'ส',
  },
  {
    name: 'สมหญิง รักเรียน',
    title: 'Web Developer',
    bgColor: 'bg-blue-100',
    avatarColor: 'from-blue-400 to-blue-600',
    initial: 'ห',
  },
  {
    name: 'วิชัย เก่งมาก',
    title: 'Graphic Designer',
    bgColor: 'bg-cyan-100',
    avatarColor: 'from-cyan-400 to-cyan-600',
    initial: 'ว',
  },
  {
    name: 'มาลี สวยงาม',
    title: 'Content Creator',
    bgColor: 'bg-yellow-100',
    avatarColor: 'from-yellow-400 to-yellow-600',
    initial: 'ม',
  },
];

export default function InstructorsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
            <span className="text-sm font-medium text-orange-700">ทีมผู้สอน</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            พบกับ{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-4 underline-offset-4">
              ผู้สอน
            </span>
            {' '}ของเรา
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            เรียนรู้กับผู้เชี่ยวชาญที่มีประสบการณ์และความรู้ในสาขาของตน
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor, index) => (
            <div
              key={index}
              className={`group rounded-2xl p-6 text-center ${instructor.bgColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
            >
              {/* Avatar */}
              <div className={`w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br ${instructor.avatarColor} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                {instructor.initial}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {instructor.name}
              </h3>

              {/* Title */}
              <p className="text-gray-600 mb-6">{instructor.title}</p>

              {/* Social Icons */}
              <div className="flex justify-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors shadow-md"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors shadow-md"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
