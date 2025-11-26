'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import {
  Clock,
  Award,
  BookOpen,
  Users,
  Star,
  ChevronRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Shield,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Palette,
  Brain,
  Lightbulb,
  Download
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// Animation Component with Enhanced Effects
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
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Counter with Circular Progress
const AnimatedCounter = ({
  value,
  suffix = '',
  label,
  duration = 1400,
  color = 'orange'
}: {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
  color?: string;
}) => {
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

  const percentage = (displayValue / value) * 100;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className="relative flex flex-col items-center group"
    >
      {/* Circular Progress Background */}
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={`text-${color}-500`}
            initial={{ strokeDasharray: "0 352" }}
            animate={hasAnimated ? {
              strokeDasharray: `${(percentage / 100) * 352} 352`
            } : { strokeDasharray: "0 352" }}
            transition={{ duration: duration / 1000, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl md:text-4xl font-bold bg-gradient-to-br from-${color}-500 to-${color}-700 bg-clip-text text-transparent`}>
            {displayValue}{suffix}
          </span>
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-700 text-center px-4">
        {label}
      </span>
    </motion.div>
  );
};

// Resistor Color Code Card Component
const ColorCodeCard = ({
  color,
  value,
  name,
  delay = 0
}: {
  color: string;
  value: string;
  name: string;
  delay?: number;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={() => setIsFlipped(!isFlipped)}
      className="relative h-24 cursor-pointer perspective-1000"
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl shadow-lg flex items-center justify-center font-bold text-lg backface-hidden"
          style={{
            backgroundColor: color,
            color: ['#FFFF00', '#FFFFFF', '#C0C0C0'].includes(color) ? '#000' : '#FFF',
            backfaceVisibility: 'hidden'
          }}
        >
          {name}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl shadow-lg bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold text-2xl backface-hidden"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          {value}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Features Data with Resistor Theme
  const features = [
    {
      icon: Brain,
      title: 'เรียนรู้แบบก้าวหน้า',
      desc: 'ระบบการเรียนรู้แบบทีละขั้นตอน เริ่มจากพื้นฐานไปสู่ความเชี่ยวชาญ พร้อมติดตามความก้าวหน้า',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Lightbulb,
      title: 'ฝึกฝนด้วยตัวเอง',
      desc: 'แบบฝึกหัดมากมายพร้อมคำอธิบายละเอียด ฝึกได้ไม่จำกัดจนกว่าจะเชี่ยวชาญ',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Palette,
      title: 'ตารางสีครบถ้วน',
      desc: 'อ้างอิงตารางสีตัวต้านทานแบบ Interactive พร้อมคำอธิบายและตัวอย่างการใช้งาน',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Target,
      title: 'ทดสอบความรู้',
      desc: 'แบบทดสอบหลากหลายรูปแบบ วัดความเข้าใจและติดตามผลการเรียนรู้',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Award,
      title: 'ใบรับรองความสำเร็จ',
      desc: 'รับใบรับรองเมื่อผ่านหลักสูตร เพิ่มมูลค่าให้กับประวัติการศึกษาและอาชีพ',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: BarChart3,
      title: 'วิเคราะห์ผลการเรียน',
      desc: 'Dashboard แสดงสถิติและความก้าวหน้า ช่วยให้เห็นจุดแข็งและจุดที่ต้องพัฒนา',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  // Resistor Color Codes
  const resistorColors = [
    { name: 'Black', color: '#000000', value: '0' },
    { name: 'Brown', color: '#8B4513', value: '1' },
    { name: 'Red', color: '#FF0000', value: '2' },
    { name: 'Orange', color: '#FF6600', value: '3' },
    { name: 'Yellow', color: '#FFFF00', value: '4' },
    { name: 'Green', color: '#00FF00', value: '5' },
    { name: 'Blue', color: '#0000FF', value: '6' },
    { name: 'Violet', color: '#9400D3', value: '7' },
    { name: 'Gray', color: '#808080', value: '8' },
    { name: 'White', color: '#FFFFFF', value: '9' },
  ];

  // Popular Courses
  const popularCourses = [
    {
      id: 1,
      title: 'พื้นฐานการอ่านค่าตัวต้านทาน',
      desc: 'เรียนรู้พื้นฐานการอ่านค่าตัวต้านทาน 4 แถบสี ตั้งแต่เริ่มต้นจนเชี่ยวชาญ',
      level: 'ระดับเริ่มต้น',
      students: 1200,
      color: 'bg-orange-100 text-orange-700',
    },
    {
      id: 2,
      title: 'การอ่านค่าตัวต้านทาน 5 แถบสี',
      desc: 'เรียนรู้การอ่านค่าตัวต้านทาน 5 แถบสีแบบละเอียด พร้อมเทคนิคขั้นสูง',
      level: 'ระดับกลาง',
      students: 850,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      id: 3,
      title: 'การใช้งานจริงในวงจร',
      desc: 'เรียนรู้การใช้งานตัวต้านทานในวงจรจริง พร้อมตัวอย่างการคำนวณ',
      level: 'ระดับสูง',
      students: 650,
      color: 'bg-purple-100 text-purple-700',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'สมชาย ใจดี',
      role: 'วิศวกรอิเล็กทรอนิกส์',
      content: 'หลักสูตรนี้ช่วยให้ผมเข้าใจการอ่านค่าตัวต้านทานได้อย่างชัดเจน เนื้อหาชัดเจนและเข้าใจง่ายมาก แนะนำให้ทุกคนที่สนใจ',
      rating: 5,
      avatar: 'SM',
    },
    {
      name: 'สมหญิง รักเรียน',
      role: 'นักศึกษาวิศวกรรม',
      content: 'ระบบการเรียนรู้แบบทีละขั้นตอนทำให้ผมสามารถพัฒนาทักษะได้อย่างต่อเนื่อง มีแบบทดสอบที่ช่วยให้เข้าใจมากขึ้น',
      rating: 5,
      avatar: 'SY',
    },
    {
      name: 'วิชัย เก่งมาก',
      role: 'ช่างเทคนิค',
      content: 'ฝึกฝนได้จริง มีแบบทดสอบที่ช่วยให้ผมมั่นใจในการทำงานมากขึ้น ใช้ได้จริงในงานประจำวัน',
      rating: 5,
      avatar: 'WJ',
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-white via-orange-50/30 to-white text-gray-900 overflow-hidden">
      {/* --- REDESIGNED HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden bg-gradient-to-b from-white via-orange-50/30 to-white">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #FF6600 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl w-full mx-auto">
          <div className="flex flex-col items-center">
            {/* Text Content */}
            <div className="text-center space-y-8 w-full">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ opacity: 1, transform: 'none' }}
              >
                <span className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-sm font-bold shadow-lg">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  แพลตฟอร์มการเรียนรู้ที่ทันสมัยที่สุด
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ opacity: 1, transform: 'none' }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
              >
                <span className="text-gray-900">เชี่ยวชาญ</span>
                <br />
                <span className="relative inline-block">
                  <span className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 blur-lg opacity-30"></span>
                  <span className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    ตัวต้านทาน
                  </span>
                </span>
                <br />
                <span className="text-gray-900">ได้ง่ายๆ</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ opacity: 1, transform: 'none' }}
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              >
                เรียนรู้การอ่านค่าตัวต้านทานแบบมืออาชีพ ด้วยหลักสูตรที่ออกแบบมาเพื่อคุณโดยเฉพาะ
                <span className="font-semibold text-orange-600"> เริ่มต้นได้ทันที ไม่ต้องมีพื้นฐาน</span>
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ opacity: 1, transform: 'none' }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/learning-mode"
                  className="group relative flex h-16 items-center justify-center gap-3 px-10 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg font-bold transition-all hover:from-orange-600 hover:to-orange-700 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/40 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    animate={{
                      x: ['-200%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: 'linear',
                    }}
                  />
                  <Zap className="w-5 h-5" aria-hidden="true" />
                  <span className="relative">เริ่มเรียนรู้ทันที</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  href="/learn/self/learningpath"
                  className="group flex h-16 items-center justify-center gap-2 px-10 rounded-2xl border-2 border-orange-600 bg-white text-orange-600 text-lg font-bold transition-all hover:bg-orange-50 hover:scale-105 hover:shadow-xl"
                >
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                  <span>สำรวจหลักสูตร</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{ opacity: 1 }}
                className="flex flex-wrap gap-6 justify-center pt-4"
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5 text-orange-500" aria-hidden="true" />
                  <span className="font-medium">1,000+ ผู้เรียน</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" aria-hidden="true" />
                  <span className="font-medium">95% ความสำเร็จ</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-orange-500" aria-hidden="true" />
                  <span className="font-medium">4.9/5 คะแนน</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-400 hover:text-orange-500 transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium mb-2">เลื่อนลงเพื่อสำรวจ</span>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronRight className="w-6 h-6 rotate-90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- ENHANCED STATS SECTION --- */}
      <section className="relative py-20 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              ผลลัพธ์ที่พิสูจน์แล้ว
            </h2>
            <p className="text-lg text-gray-600">
              ตัวเลขที่บอกเล่าความสำเร็จของผู้เรียน
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <AnimatedCounter value={1000} suffix="+" label="นักเรียนที่ลงทะเบียน" color="orange" />
            <AnimatedCounter value={50} suffix="+" label="แบบฝึกหัดและบทเรียน" color="blue" />
            <AnimatedCounter value={95} suffix="%" label="อัตราความสำเร็จ" color="green" />
          </div>
        </div>
      </section>

      {/* --- ENHANCED FEATURES SECTION --- */}
      <section className="relative py-28 px-6 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #FF6600 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <Reveal className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-sm font-bold"
            >
              <Sparkles className="inline w-4 h-4 mr-2" />
              คุณสมบัติเด่น
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              ทำไมต้อง <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">ResiLearn</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              แพลตฟอร์มการเรียนรู้ที่ออกแบบมาเพื่อให้คุณเชี่ยวชาญการอ่านค่าตัวต้านทานอย่างแท้จริง
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="group relative"
              >
                {/* Glassmorphism Card */}
                <div className={`relative h-full rounded-3xl p-8 backdrop-blur-sm bg-white/80 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden ${feature.bgColor}/30`}>
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  {/* Animated Icon Container */}
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text transition-all">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>

                  {/* Decorative Corner */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-bl-full`} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW: RESISTOR COLOR CODE REFERENCE SECTION --- */}
      <section className="relative py-28 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent"
              style={{ left: `${i * 5}%` }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 text-orange-400 text-sm font-bold"
            >
              <Palette className="w-4 h-4" />
              ตารางอ้างอิง
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              ตารางสี<span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">ตัวต้านทาน</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              คลิกที่การ์ดเพื่อดูค่าของแต่ละสี - เครื่องมือที่จำเป็นสำหรับทุกคนที่ทำงานกับอิเล็กทรอนิกส์
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5" />
              ดาวน์โหลดตารางสี PDF
            </motion.button>
          </Reveal>

          {/* Color Code Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {resistorColors.map((colorData, index) => (
              <ColorCodeCard
                key={index}
                color={colorData.color}
                value={colorData.value}
                name={colorData.name}
                delay={index * 50}
              />
            ))}
          </div>

          {/* Additional Info */}
          <Reveal className="mt-16 text-center">
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4 text-orange-400">💡 เคล็ดลับการจำ</h3>
              <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                <span className="font-semibold text-white">B.B. ROY</span> of <span className="font-semibold text-white">Great Britain</span> had a <span className="font-semibold text-white">Very Good Wife</span>
                <br />
                <span className="text-sm text-gray-400 mt-2 block">
                  (Black-Brown-Red-Orange-Yellow-Green-Blue-Violet-Gray-White)
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- ENHANCED POPULAR COURSES SECTION --- */}
      <section className="relative py-28 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-sm font-bold"
            >
              <BookOpen className="inline w-4 h-4 mr-2" />
              หลักสูตรแนะนำ
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              เริ่มต้นการเรียนรู้<span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">วันนี้</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              เลือกหลักสูตรที่เหมาะกับระดับของคุณ ตั้งแต่ผู้เริ่มต้นจนถึงผู้เชี่ยวชาญ
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    {/* Level Badge */}
                    <div className="mb-6">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${course.color} text-sm font-bold shadow-md`}>
                        <Target className="w-4 h-4" />
                        {course.level}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {course.desc}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/register"
                        className="group/btn flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        <Zap className="w-4 h-4" />
                        <span>เริ่มเรียนเลย</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                      <Link
                        href="/learn/self/learningpath"
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>ดูรายละเอียด</span>
                      </Link>
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-200 to-blue-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ENHANCED TESTIMONIALS SECTION --- */}
      <section className="relative py-28 px-6 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 text-sm font-bold"
            >
              <Star className="inline w-4 h-4 mr-2 fill-current" />
              รีวิวจากผู้เรียน
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              เสียงตอบรับจาก<span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">ผู้เรียน</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              ผู้เรียนหลายพันคนไว้วางใจและประสบความสำเร็จกับ ResiLearn
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative h-full bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:border-orange-200 transition-all duration-500">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 text-6xl text-orange-100 font-serif leading-none">"</div>

                  <div className="relative z-10">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + i * 0.1, duration: 0.3 }}
                        >
                          <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <p className="text-gray-700 mb-8 leading-relaxed text-lg italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {testimonial.avatar}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 blur-md opacity-50" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ENHANCED FINAL CTA SECTION --- */}
      <section className="relative py-32 px-6 bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(60)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* CTA Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold"
            >
              <Sparkles className="w-4 h-4" />
              เริ่มต้นฟรี ไม่ต้องใช้บัตรเครดิต
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
              พร้อมที่จะเป็น<br />
              <span className="relative inline-block">
                <span className="absolute -inset-2 bg-white/20 blur-2xl"></span>
                <span className="relative">ผู้เชี่ยวชาญ</span>
              </span>
              แล้วหรือยัง?
            </h2>

            <p className="text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              เข้าร่วมกับผู้เรียนหลายพันคนที่ประสบความสำเร็จ
              <br />
              <span className="font-bold">เริ่มต้นการเรียนรู้ได้ทันทีวันนี้</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/register"
                className="group relative flex items-center justify-center gap-3 h-20 px-12 rounded-2xl bg-white text-orange-600 text-xl font-bold hover:bg-orange-50 transition-all hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-100/0 via-orange-100/50 to-orange-100/0"
                  animate={{
                    x: ['-200%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
                <Zap className="w-6 h-6 relative" />
                <span className="relative">เริ่มเรียนฟรีทันที</span>
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2 relative" />
              </Link>

              <Link
                href="/learn/self/learningpath"
                className="group flex items-center justify-center gap-2 h-20 px-12 rounded-2xl border-3 border-white/40 backdrop-blur-sm bg-white/10 text-white text-xl font-bold hover:bg-white/20 hover:border-white/60 transition-all hover:scale-105"
              >
                <BookOpen className="w-6 h-6" />
                <span>ดูหลักสูตร</span>
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 justify-center items-center text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">ไม่ต้องใช้บัตรเครดิต</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">ยกเลิกได้ทุกเมื่อ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="font-medium">เข้าถึงได้ทันที</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative py-16 px-6 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-4">
                ResiLearn
              </h3>
              <p className="text-gray-400">
                แพลตฟอร์มการเรียนรู้การอ่านค่าตัวต้านทานที่ทันสมัยและครบถ้วน
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">เมนู</h4>
              <ul className="space-y-2">
                <li><Link href="/learn/self/learningpath" className="text-gray-400 hover:text-orange-400 transition-colors">หลักสูตร</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">เกี่ยวกับเรา</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">บทความ</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">ติดต่อเรา</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">ข้อมูลเพิ่มเติม</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">เงื่อนไขการใช้บริการ</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-orange-400 transition-colors">แผนผังเว็บไซต์</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">ติดต่อเรา</h4>
              <ul className="space-y-2 text-gray-400">
                <li>อีเมล: contact@resilearn.com</li>
                <li>โทรศัพท์: 02-XXX-XXXX</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} ResiLearn. สงวนลิขสิทธิ์</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
