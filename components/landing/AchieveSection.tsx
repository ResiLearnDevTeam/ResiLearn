'use client';

import ImagePlaceholder from './ImagePlaceholder';
import { Target, Lightbulb } from 'lucide-react';

export default function AchieveSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                สถานที่ที่คุณสามารถ{' '}
                <span className="text-orange-600 underline decoration-orange-500 decoration-2">
                  บรรลุเป้าหมาย
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                คุณสามารถลงทะเบียนเรียนหลักสูตรออนไลน์ของเราจากทุกที่ในโลก 
                เรียนรู้ด้วยตนเองตามจังหวะของคุณเอง และพัฒนาทักษะการอ่านค่าตัวต้านทานอย่างเป็นระบบ
              </p>
            </div>

            {/* Bullet Points */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">วิสัยทัศน์ของเรา</h3>
                  <p className="text-gray-600">
                    สร้างระบบการเรียนรู้ที่เข้าถึงได้ง่ายและมีประสิทธิภาพสำหรับทุกคน
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">พันธกิจของเรา</h3>
                  <p className="text-gray-600">
                    พัฒนาเครื่องมือการเรียนรู้ที่ทันสมัยและมีประสิทธิภาพเพื่อพัฒนาทักษะทางเทคนิค
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Top Left Image */}
              <div className="relative">
                <ImagePlaceholder
                  aspectRatio="aspect-[4/3]"
                  description="Students Learning"
                  className="rounded-xl shadow-lg"
                />
              </div>

              {/* Bottom Left Image */}
              <div className="relative mt-8">
                <ImagePlaceholder
                  aspectRatio="aspect-[4/3]"
                  description="Student Writing"
                  className="rounded-xl shadow-lg"
                />
              </div>

              {/* Top Right Image */}
              <div className="relative -mt-4">
                <ImagePlaceholder
                  aspectRatio="aspect-[4/3]"
                  description="Happy Student"
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

