'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Handle newsletter subscription
    // TODO: Implement newsletter subscription API
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      alert('ขอบคุณสำหรับการสมัครรับจดหมายข่าว!');
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Content */}
          <div className="flex items-center gap-4 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">สมัครรับจดหมายข่าว</h3>
              <p className="text-orange-50">รับข่าวสารและอัปเดตล่าสุดจากเรา</p>
            </div>
          </div>

          {/* Right Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here"
              required
              className="px-6 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-900 placeholder-gray-400 min-w-[250px]"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg bg-white text-orange-600 font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? 'กำลังส่ง...' : 'สมัครเลย'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

