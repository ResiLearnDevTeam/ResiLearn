'use client';

import { 
  BarChart3, 
  Palette, 
  Atom, 
  Music, 
  Code, 
  Calculator,
  Zap,
  BookOpen
} from 'lucide-react';

const topics = [
  { icon: BarChart3, title: 'Data Science', courses: 10, color: 'bg-pink-100 text-pink-600' },
  { icon: Palette, title: 'UI/UX Design', courses: 8, color: 'bg-orange-100 text-orange-600' },
  { icon: Atom, title: 'Physics', courses: 12, color: 'bg-blue-100 text-blue-600' },
  { icon: Music, title: 'Music Theory', courses: 6, color: 'bg-green-100 text-green-600' },
  { icon: Code, title: 'Programming', courses: 15, color: 'bg-purple-100 text-purple-600' },
  { icon: Calculator, title: 'Mathematics', courses: 9, color: 'bg-yellow-100 text-yellow-600' },
  { icon: Zap, title: 'Electronics', courses: 7, color: 'bg-red-100 text-red-600' },
  { icon: BookOpen, title: 'Resistor Reading', courses: 7, color: 'bg-teal-100 text-teal-600' },
];

export default function TopicsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            หัวข้อ{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-2">
              ยอดนิยม
            </span>
            {' '}สำหรับเรียนรู้
          </h2>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 ${topic.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {topic.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {topic.courses} หลักสูตร
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

