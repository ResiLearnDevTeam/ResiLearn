'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft,
  GraduationCap,
  FileText,
  BarChart3,
  Target,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

const featureItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

export default function LearningModePage() {
  const [isVisible, setIsVisible] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/learning-mode')}`);
    } else if (status === 'authenticated') {
      if (session?.user?.role === 'TEACHER') {
        router.replace('/learn/classroom/teacher/courses');
        return;
      }
      setIsVisible(true);
    }
  }, [status, router, session?.user?.role]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="text-gray-600 text-base">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // If teacher, we redirect immediately (avoid rendering mode selection).
  if (status === 'authenticated' && session?.user?.role === 'TEACHER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            คุณอยากเรียนรู้วิธีไหนดี?
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl">
            เลือกเส้นทางการเรียนรู้รหัสสีตัวต้านทานของคุณได้เลย
          </p>
        </motion.div>

        {/* Learning Mode Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mx-auto max-w-6xl"
        >
          <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
            {/* Self Learning Mode */}
            <motion.div variants={cardVariants}>
              <Link
                href="/learn/self/dashboard"
                className="group relative block h-full overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 md:p-10"
              >
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-orange-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="absolute inset-[2px] rounded-2xl bg-white"></div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    variants={iconVariants}
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  >
                    <BookOpen className="h-8 w-8 text-orange-600" strokeWidth={2.5} />
                  </motion.div>

                  {/* Title */}
                  <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
                    1. โหมดเรียนรู้แบบเข้มข้น
                  </h2>
                  <p className="mb-1 text-sm font-medium text-orange-600">Self-Paced Learning</p>

                  {/* Description */}
                  <p className="mb-8 text-base leading-relaxed text-gray-600 md:text-lg">
                    เรียนรู้ทุกแง่มุมของการอ่านค่าตัวต้านทานได้อย่างลึกซึ้ง เรียนตามจังหวะของคุณเอง พร้อมบทเรียนครบชุดและแบบฝึกหัดไม่จำกัด จนกว่าคุณจะมั่นใจในทุกค่า!
                  </p>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    {[
                      { icon: Clock, text: 'เรียนรู้ได้ตามใจคุณ (ไม่เร่ง)' },
                      { icon: FileText, text: 'บทเรียน + แบบทดสอบ จัดเต็ม!' },
                      { icon: BarChart3, text: 'เห็นพัฒนาการของคุณชัดเจน' },
                      { icon: Target, text: 'ฝึกฝนซ้ำได้ไม่จำกัดครั้ง' },
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        custom={index}
                        variants={featureItemVariants}
                        className="flex items-center text-sm text-gray-700 md:text-base"
                      >
                        <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0 text-orange-600" strokeWidth={2.5} />
                        <span>{feature.text}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <span className="inline-flex items-center text-base font-semibold text-orange-600 transition-all duration-300 group-hover:translate-x-2 md:text-lg">
                      เริ่มเรียนรู้ทันที
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Classroom Mode */}
            <motion.div variants={cardVariants}>
              <Link
                href="/learn/classroom"
                className="group relative block h-full overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 md:p-10"
              >
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="absolute inset-[2px] rounded-2xl bg-white"></div>


                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div 
                    variants={iconVariants}
                    className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  >
                    <GraduationCap className="h-8 w-8 text-blue-600" strokeWidth={2.5} />
                  </motion.div>

                  {/* Title */}
                  <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
                    2. โหมดเรียนในห้องเรียน
                  </h2>
                  <p className="mb-1 text-sm font-medium text-blue-600">Classroom Learning</p>

                  {/* Description */}
                  <p className="mb-8 text-base leading-relaxed text-gray-600 md:text-lg">
                    เข้าร่วมหลักสูตรที่มีโครงสร้างพร้อมการบ้าน แบบทดสอบ และคำแนะนำจากครูผู้สอน รวมถึงการเชื่อมต่อกับ Google Classroom เพื่อประสบการณ์การเรียนรู้ที่สมบูรณ์แบบ
                  </p>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    {[
                      { icon: FileText, text: 'หลักสูตรที่มีโครงสร้างชัดเจน' },
                      { icon: Users, text: 'คำแนะนำและข้อเสนอแนะจากครู' },
                      { icon: GraduationCap, text: 'เชื่อมต่อกับ Google Classroom' },
                      { icon: BarChart3, text: 'ติดตามความคืบหน้าแบบละเอียด' },
                    ].map((feature, index) => (
                      <motion.li
                        key={index}
                        custom={index}
                        variants={featureItemVariants}
                        className="flex items-center text-sm text-gray-700 md:text-base"
                      >
                        <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0 text-blue-600" strokeWidth={2.5} />
                        <span>{feature.text}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="mt-8">
                    <span className="inline-flex items-center text-base font-semibold text-blue-600 transition-all duration-300 group-hover:translate-x-2 md:text-lg">
                      เข้าร่วมห้องเรียน
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center text-base text-gray-600 transition-colors duration-300 hover:text-orange-600 md:text-lg"
          >
            <ChevronLeft className="mr-2 h-5 w-5" strokeWidth={2.5} />
            กลับสู่หน้าหลัก
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
