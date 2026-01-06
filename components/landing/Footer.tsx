'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">ResiLearn</h3>
            <p className="text-sm leading-relaxed">
              ระบบเรียนรู้การอ่านค่าตัวต้านทานแบบทีละขั้นตอน 
              พัฒนาทักษะของคุณผ่านแบบฝึกหัดและแบบทดสอบที่ครอบคลุม
            </p>
            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">ลิงก์</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/learn/self/learningpath" className="hover:text-orange-500 transition-colors">
                  หลักสูตร
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  บทความ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">กฎหมาย</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  เงื่อนไขการใช้งาน
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  นโยบายคุกกี้
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">
                  สิทธิ์การใช้งาน
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">จดหมายข่าว</h4>
            <p className="text-sm mb-4">
              สมัครรับจดหมายข่าวเพื่อรับข่าวสารและอัปเดตล่าสุด
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your address"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
              >
                สมัครเลย
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm">
          <p>Copyright © {new Date().getFullYear()} ResiLearn. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

