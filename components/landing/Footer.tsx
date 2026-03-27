'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'หน้าแรก' },
  { href: '#about', label: 'เกี่ยวกับเรา' },
  { href: '/learn/self/learningpath', label: 'หลักสูตร' },
  { href: '#news', label: 'บทความ' },
  { href: '#contact', label: 'ติดต่อเรา' },
];

const usefulLinks = [
  { href: '#', label: 'เงื่อนไขการใช้งาน' },
  { href: '#', label: 'นโยบายความเป็นส่วนตัว' },
  { href: '#', label: 'คำถามที่พบบ่อย' },
  { href: '#', label: 'การสนับสนุน' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-orange-500 mb-4 inline-block">
              ResiLearn
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              ระบบเรียนรู้การอ่านค่าตัวต้านทานแบบทีละขั้นตอน 
              พัฒนาทักษะของคุณผ่านแบบฝึกหัดและแบบทดสอบที่ครอบคลุม
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">ลิงก์ด่วน</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-orange-500 transition-colors inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">ลิงก์ที่เป็นประโยชน์</h4>
            <ul className="space-y-3">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-orange-500 transition-colors inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6">ติดต่อเรา</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">support@resilearn.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">02-xxx-xxxx</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  123 ถนนสุขุมวิท แขวงคลองเตย<br />
                  เขตคลองเตย กรุงเทพฯ 10110
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            Copyright © {new Date().getFullYear()} ResiLearn. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
              เงื่อนไขการใช้งาน
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="#" className="text-gray-500 hover:text-orange-500 transition-colors">
              นโยบายความเป็นส่วนตัว
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
