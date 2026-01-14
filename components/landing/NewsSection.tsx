'use client';

import Link from 'next/link';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

const newsArticles = [
  {
    id: '1',
    title: 'เหตุผลที่ค่าเล่าเรียนมหาวิทยาลัยสูงขึ้นเรื่อย ๆ',
    date: '27 ก.ย. 2567',
    category: 'การศึกษา',
    image: null,
  },
  {
    id: '2',
    title: 'วิธีการเป็นนักออกแบบ UI/UX ที่ประสบความสำเร็จ',
    date: '25 ก.ย. 2567',
    category: 'อาชีพ',
    image: null,
  },
  {
    id: '3',
    title: 'รีวิวเครื่องมือการเรียนออนไลน์ยอดนิยมปี 2567',
    date: '23 ก.ย. 2567',
    category: 'เทคโนโลยี',
    image: null,
  },
];

export default function NewsSection() {
  return (
    <section id="news" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
            <span className="text-sm font-medium text-orange-700">บทความ</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            บทความ{' '}
            <span className="text-orange-600 underline decoration-orange-500 decoration-4 underline-offset-4">
              ล่าสุด
            </span>
            {' '}ของเรา
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            อัปเดตข่าวสารและเคล็ดลับดี ๆ เกี่ยวกับการเรียนรู้และพัฒนาทักษะ
          </p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <div
              key={article.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Article Image */}
              <div className="aspect-[16/10] bg-gradient-to-br from-orange-100 to-orange-200 overflow-hidden">
                {article.image ? (
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-orange-300 rounded-full flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-orange-700" />
                      </div>
                      <p className="text-orange-700 text-sm font-medium">รูปภาพบทความ</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Date & Category */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {article.title}
                </h3>

                {/* Read More Link */}
                <Link
                  href={`/blog/${article.id}`}
                  className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group/link"
                >
                  อ่านเพิ่มเติม
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
