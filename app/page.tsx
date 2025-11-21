'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { Clock, Award, BookOpen, Users, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useLanguageStore } from '@/store/languageStore';

// Animation Component
const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { 
      if (entry.isIntersecting) { 
        setInView(true); 
        observer.disconnect(); 
      } 
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', label, duration = 1400 }: { value: number; suffix?: string; label: string; duration?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
      }
    }, { threshold: 0.35 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const start = performance.now();
    let frameId: number;

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [duration, hasAnimated, value]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <span className="text-4xl md:text-5xl font-bold text-orange-600">
        {displayValue}{suffix}
      </span>
      <span className="text-sm font-medium text-gray-600 mt-2">
        {label}
      </span>
    </div>
  );
};

export default function Home() {
  const { t, language } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isThai = language === 'th';

  // Features Data
  const features = [
    {
      icon: Clock,
      title: isThai ? 'เรียนรู้ได้ตามใจคุณ' : 'Self-Paced Learning',
      desc: isThai ? 'เรียนได้ทุกที่ทุกเวลา ตามจังหวะของคุณเอง' : 'Learn at your own pace, anywhere, anytime',
    },
    {
      icon: BookOpen,
      title: isThai ? 'เนื้อหาอัปเดตใหม่เสมอ' : 'Always Updated Content',
      desc: isThai ? 'เนื้อหาครบถ้วนและอัปเดตตามมาตรฐานล่าสุด' : 'Comprehensive and up-to-date content',
    },
    {
      icon: Award,
      title: isThai ? 'ใบรับรองจากผู้เชี่ยวชาญ' : 'Expert Certification',
      desc: isThai ? 'รับใบรับรองเมื่อสำเร็จหลักสูตร' : 'Get certified upon course completion',
    },
  ];

  // Popular Courses (Mock Data)
  const popularCourses = [
    {
      id: 1,
      title: isThai ? 'พื้นฐานการอ่านค่าตัวต้านทาน' : 'Resistor Reading Basics',
      desc: isThai ? 'เรียนรู้พื้นฐานการอ่านค่าตัวต้านทาน 4 แถบสี' : 'Learn the basics of reading 4-band resistors',
      level: isThai ? 'ระดับเริ่มต้น' : 'Beginner',
      students: 1200,
    },
    {
      id: 2,
      title: isThai ? 'การอ่านค่าตัวต้านทาน 5 แถบสี' : '5-Band Resistor Reading',
      desc: isThai ? 'เรียนรู้การอ่านค่าตัวต้านทาน 5 แถบสีแบบละเอียด' : 'Master the art of reading 5-band resistors',
      level: isThai ? 'ระดับกลาง' : 'Intermediate',
      students: 850,
    },
    {
      id: 3,
      title: isThai ? 'การใช้งานจริงในวงจร' : 'Real-World Applications',
      desc: isThai ? 'เรียนรู้การใช้งานตัวต้านทานในวงจรจริง' : 'Learn practical resistor applications in real circuits',
      level: isThai ? 'ระดับสูง' : 'Advanced',
      students: 650,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: isThai ? 'สมชาย ใจดี' : 'John Smith',
      role: isThai ? 'วิศวกรอิเล็กทรอนิกส์' : 'Electronics Engineer',
      content: isThai ? 'หลักสูตรนี้ช่วยให้ผมเข้าใจการอ่านค่าตัวต้านทานได้อย่างชัดเจน เนื้อหาชัดเจนและเข้าใจง่ายมาก' : 'This course helped me understand resistor reading clearly. The content is clear and easy to understand.',
      rating: 5,
    },
    {
      name: isThai ? 'สมหญิง รักเรียน' : 'Jane Doe',
      role: isThai ? 'นักศึกษาวิศวกรรม' : 'Engineering Student',
      content: isThai ? 'ระบบการเรียนรู้แบบทีละขั้นตอนทำให้ผมสามารถพัฒนาทักษะได้อย่างต่อเนื่อง แนะนำมาก!' : 'The progressive learning system allows me to continuously develop my skills. Highly recommended!',
      rating: 5,
    },
    {
      name: isThai ? 'วิชัย เก่งมาก' : 'Mike Johnson',
      role: isThai ? 'ช่างเทคนิค' : 'Technician',
      content: isThai ? 'ฝึกฝนได้จริง มีแบบทดสอบที่ช่วยให้ผมมั่นใจในการทำงานมากขึ้น' : 'Real practice with tests that help me be more confident at work.',
      rating: 5,
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-white text-[#333333]">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 via-white to-white"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl w-full text-center">
          <Reveal delay={100}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              <span className="text-[#333333]">{isThai ? 'ยกระดับความรู้' : 'Elevate Your'}</span>
              <br />
              <span className="text-orange-600">{isThai ? 'สู่มืออาชีพ' : 'Knowledge'}</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-xl md:text-2xl text-[#333333] max-w-3xl mx-auto mb-4 leading-relaxed">
              {isThai 
                ? 'ไปกับหลักสูตรที่เราคัดสรรมาเพื่อคุณ'
                : 'With courses carefully selected for you'}
            </p>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              {isThai
                ? 'เริ่มต้นเส้นทางการเรียนรู้ใหม่ได้ทุกที่ ทุกเวลา ด้วยระบบที่ทันสมัยและเข้าใจง่าย'
                : 'Start your new learning journey anywhere, anytime with a modern and easy-to-understand system'}
            </p>
          </Reveal>

          <Reveal delay={300} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/learn/self/learningpath"
              className="group relative flex h-16 w-full sm:w-auto items-center justify-center gap-2 px-10 rounded-full bg-orange-600 text-white text-lg font-bold transition-all hover:bg-orange-700 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
            >
              <span>{isThai ? 'สำรวจหลักสูตรทั้งหมด' : 'Explore All Courses'}</span>
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link 
              href="/register"
              className="flex h-16 w-full sm:w-auto items-center justify-center px-10 rounded-full border-2 border-orange-600 bg-white text-orange-600 text-lg font-bold transition-all hover:bg-orange-50 hover:scale-105"
            >
              {isThai ? 'เริ่มเรียนฟรีทันที' : 'Start Learning Free'}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="relative py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCounter value={1000} suffix="+" label={isThai ? 'นักเรียนที่ลงทะเบียน' : 'Students Enrolled'} />
            <AnimatedCounter value={50} suffix="+" label={isThai ? 'แบบฝึกหัด' : 'Practice Exercises'} />
            <AnimatedCounter value={95} suffix="%" label={isThai ? 'อัตราความสำเร็จ' : 'Success Rate'} />
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="relative py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
              {isThai ? 'ทำไมต้องเลือกเรา' : 'Why Choose Us'}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Reveal key={index} delay={index * 100} className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-100">
                    <feature.icon className="w-10 h-10 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#333333] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- POPULAR COURSES SECTION --- */}
      <section className="relative py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
              {isThai ? 'หลักสูตรยอดนิยมประจำเดือน' : 'Popular Courses This Month'}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map((course, index) => (
              <Reveal key={course.id} delay={index * 100}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#333333] mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {course.desc}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <Users className="w-4 h-4" />
                    <span>{course.students} {isThai ? 'นักเรียน' : 'students'}</span>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href="/register"
                      className="flex-1 text-center px-6 py-3 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
                    >
                      {isThai ? 'ลงทะเบียน' : 'Enroll'}
                    </Link>
                    <Link
                      href="/learn/self/learningpath"
                      className="flex-1 text-center px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-orange-200 hover:text-orange-600 transition-colors"
                    >
                      {isThai ? 'ดูรายละเอียด' : 'Details'}
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST SECTION (Testimonials) --- */}
      <section className="relative py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
              {isThai ? 'เสียงตอบรับจากผู้เรียน' : 'Student Testimonials'}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-bold text-[#333333]">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {isThai ? 'พร้อมเริ่มเรียนรู้แล้วหรือยัง?' : 'Ready to Start Learning?'}
            </h2>
            <p className="text-xl text-orange-50 mb-12 max-w-2xl mx-auto">
              {isThai
                ? 'เริ่มเรียนรู้วันนี้ ฟรีบทเรียนแรก ไม่ต้องใช้บัตรเครดิต'
                : 'Start your first lesson today. No credit card required.'}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-16 px-12 rounded-full bg-white text-orange-600 text-lg font-bold hover:bg-orange-50 transition-all hover:scale-105 hover:shadow-xl"
            >
              {isThai ? 'เริ่มเรียนฟรีทันที' : 'Start Learning Free'}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative py-16 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                ResiLearn
              </h3>
              <p className="text-gray-600">
                {isThai 
                  ? 'แพลตฟอร์มการเรียนรู้การอ่านค่าตัวต้านทานที่ทันสมัย'
                  : 'Modern platform for learning resistor reading'}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#333333] mb-4">{isThai ? 'เมนู' : 'Menu'}</h4>
              <ul className="space-y-2">
                <li><Link href="/learn/self/learningpath" className="text-gray-600 hover:text-orange-600 transition-colors">{isThai ? 'หลักสูตร' : 'Courses'}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">{isThai ? 'เกี่ยวกับเรา' : 'About Us'}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">{isThai ? 'บทความ' : 'Blog'}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">{isThai ? 'ติดต่อเรา' : 'Contact'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#333333] mb-4">{isThai ? 'ข้อมูลเพิ่มเติม' : 'More Info'}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">{isThai ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">{isThai ? 'เงื่อนไขการใช้บริการ' : 'Terms of Service'}</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-orange-600 transition-colors">{isThai ? 'แผนผังเว็บไซต์' : 'Sitemap'}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#333333] mb-4">{isThai ? 'ติดต่อเรา' : 'Contact Us'}</h4>
              <ul className="space-y-2 text-gray-600">
                <li>{isThai ? 'อีเมล: contact@resilearn.com' : 'Email: contact@resilearn.com'}</li>
                <li>{isThai ? 'โทรศัพท์: 02-XXX-XXXX' : 'Phone: 02-XXX-XXXX'}</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} ResiLearn. {isThai ? 'สงวนลิขสิทธิ์' : 'All rights reserved'}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
