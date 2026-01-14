'use client';

import { useState } from 'react';
import { Send, Mail } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    if (email) {
      console.log('Subscribing email:', email);
      setEmail('');
      alert('ขอบคุณสำหรับการสมัครรับจดหมายข่าว!');
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl px-8 py-16 md:px-16 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/20 rounded-full"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-white/20 rounded-full"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              สมัครรับจดหมายข่าวเพื่อรับข่าวสารล่าสุดเกี่ยวกับบริการของเรา
            </h2>

            {/* Description */}
            <p className="text-orange-100 text-lg mb-8">
              รับข้อมูลหลักสูตรใหม่ โปรโมชั่นพิเศษ และเคล็ดลับการเรียนรู้ส่งตรงถึงอีเมลของคุณ
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมลของคุณ"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                สมัครเลย
                <Send className="w-5 h-5" />
              </button>
            </form>

            {/* Privacy note */}
            <p className="text-orange-100/80 text-sm mt-4">
              เราเคารพความเป็นส่วนตัวของคุณ ข้อมูลของคุณจะถูกเก็บเป็นความลับ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
