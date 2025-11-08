'use client';

import Link from 'next/link';
import { useEffect, useState, useRef, ReactNode, useMemo } from 'react';
import { Bolt, LineChart, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Resistor3DModel from '@/components/features/Resistor3DModel';
import { useTranslation } from '@/lib/i18n';

// --- DESIGN SYSTEM COMPONENTS (Local for maximum control) ---

const Noise = () => (
  <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
  />
);

const Glow = ({ className = '', color = 'bg-orange-400' }: { className?: string, color?: string }) => (
  <div className={`pointer-events-none absolute rounded-full blur-[120px] opacity-40 mix-blend-multiply will-change-transform ${color} ${className}`} />
);

const Badge = ({ children, variant = 'orange' }: { children: ReactNode, variant?: 'orange' | 'blue' }) => {
    const colors = variant === 'orange' 
        ? 'bg-orange-50 text-orange-700 border-orange-200/60' 
        : 'bg-blue-50 text-blue-700 border-blue-200/60';
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${colors} backdrop-blur-md`}>
            {variant === 'orange' && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span>}
            {children}
        </span>
    );
};

// Animation Component
const Reveal = ({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 cubic-bezier(0.21, 0.47, 0.32, 0.98) ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
};

const featureStyles = {
  orange: {
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    glow: 'bg-orange-200/30',
    hoverBorder: 'hover:border-orange-200/50',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    glow: 'bg-blue-200/30',
    hoverBorder: 'hover:border-blue-200/50',
  },
  green: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
    glow: 'bg-emerald-200/30',
    hoverBorder: 'hover:border-emerald-200/50',
  },
} as const;

type FeatureStyle = (typeof featureStyles)[keyof typeof featureStyles];

type FeatureItem = {
  id: string;
  Icon: LucideIcon;
  style: FeatureStyle;
  title: string;
  desc: string;
};

type StatItem = {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
};

const AnimatedCounter = ({
  value,
  suffix = '',
  label,
  duration = 1400,
}: StatItem) => {
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

  const formattedValue = useMemo(() => {
    if (value >= 1000) {
      return `${displayValue.toLocaleString()}${suffix}`;
    }
    return `${displayValue}${suffix}`;
  }, [displayValue, suffix, value]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center px-6 first:pl-0 last:pr-0 border-r last:border-0 border-slate-200/60"
    >
      <span className="text-2xl font-black text-slate-900 md:text-3xl">
        {formattedValue}
      </span>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
  );
};

const FloatingDecor = () => (
  <div className="pointer-events-none absolute inset-0 -z-10">
    <div className="absolute left-[12%] top-[18%] h-24 w-24 rounded-full bg-orange-300/30 blur-2xl animate-[float_9s_ease-in-out_infinite]" />
    <div className="absolute right-[18%] top-[26%] h-16 w-16 rounded-full border border-amber-500/30 animate-[float_7s_ease-in-out_infinite_reverse]" />
    <div className="absolute left-1/2 top-[34%] h-32 w-32 -translate-x-1/2 rounded-[2rem] border border-white/40 backdrop-blur animate-[float_10s_ease-in-out_infinite] opacity-80" />
    <div className="absolute right-[8%] bottom-[22%] h-20 w-20 rounded-full bg-orange-200/40 blur-3xl animate-[float_12s_ease-in-out_infinite]" />
  </div>
);

// --- PAGE CONTENT ---

export default function Home() {
  const { t, language } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [parallax, setParallax] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setParallax(Math.min(scrollY * 0.12, 120));
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const features = useMemo<FeatureItem[]>(() => [
    {
      id: 'learn',
      Icon: Bolt,
      style: featureStyles.orange,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
    },
    {
      id: 'practice',
      Icon: Target,
      style: featureStyles.blue,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
    },
    {
      id: 'progress',
      Icon: LineChart,
      style: featureStyles.green,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
    },
  ], [t]);

  const journey = useMemo(() => [
      { step: "01", title: language === 'th' ? "พื้นฐานแน่น" : "Foundations", desc: language === 'th' ? "เรียนรู้ทฤษฎีและรหัสสี" : "Master core concepts & codes" },
      { step: "02", title: language === 'th' ? "ฝึกฝนเข้มข้น" : "Interactive Labs", desc: language === 'th' ? "จำลองการอ่านค่าจริง" : "Simulate real-world reading" },
      { step: "03", title: language === 'th' ? "ทดสอบวัดระดับ" : "Skill Assessment", desc: language === 'th' ? "วัดผลและรับ Feedback" : "Get evaluated & feedback" },
      { step: "04", title: language === 'th' ? "สู่มืออาชีพ" : "Expert Status", desc: language === 'th' ? "มั่นใจ พร้อมใช้งานจริง" : "Job-ready confidence" },
  ], [language]);

  const stats = useMemo<StatItem[]>(() => [
    { value: 1000, suffix: '+', label: t('studentsEnrolled') },
    { value: 50, suffix: '+', label: t('practiceExercises') },
    { value: 95, suffix: '%', label: t('successRate') },
  ], [t]);

  const [primaryFeature, ...secondaryFeatures] = features;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFA] text-slate-900 selection:bg-orange-500/20">
      <Noise />
      
      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden px-6 pt-20">
        {/* Background 3D Model (Lower opacity to not compete with text too much) */}
        <div
          className="absolute inset-0 z-0 opacity-60 mix-blend-multiply pointer-events-none transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${parallax}px)` }}
        >
             <Resistor3DModel />
             <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] via-transparent to-[#FAFAFA]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex max-w-[90rem] w-full flex-col items-center text-center">
           <Glow className="top-[-20%] left-[30%] w-[800px] h-[800px] bg-orange-300/20" />
           <FloatingDecor />
           
           <Reveal delay={100}>
             <Badge>{t('heroTitle1')}</Badge>
           </Reveal>

           <Reveal delay={200} className="mt-8 relative">
              <h1 className="animate-gradient text-7xl font-black tracking-tighter md:text-[9rem] leading-[0.9] text-slate-900">
               READ<br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                 RESISTORS
               </span>
             </h1>
             <p className="text-xl md:text-2xl font-medium text-slate-600 max-w-2xl mx-auto mt-8 leading-relaxed">
                {t('heroSubtitle')}
             </p>
           </Reveal>

           <Reveal delay={400} className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
              <Link href="/learning-mode" className="group relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-slate-900 px-8 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                  <span className="relative flex items-center gap-2">
                    {t('startLearning')} 
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </span>
              </Link>
              <Link href="/register" className="flex h-14 w-full items-center justify-center rounded-full border-2 border-slate-200 bg-white/50 px-8 text-lg font-bold text-slate-600 backdrop-blur-sm transition-all hover:border-orange-200 hover:text-orange-600">
                  {t('createAccount')}
              </Link>
           </Reveal>
        </div>

        {/* Floating Stats Bar */}
        <Reveal delay={600} className="mt-16 hidden w-full justify-center md:flex">
            <div className="flex items-center gap-12 rounded-full border border-white/40 bg-white/70 px-10 py-4 shadow-xl shadow-slate-200/40 backdrop-blur-xl">
                {stats.map((stat, index) => (
                  <AnimatedCounter
                    key={stat.label}
                    value={stat.value}
                    suffix={stat.suffix}
                    label={stat.label}
                    duration={1200 + index * 200}
                  />
                ))}
            </div>
        </Reveal>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section className="relative px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl relative">
            {/* Section Header */}
            <Reveal className="mb-20 md:max-w-2xl">
                <Badge variant="blue">{language === 'th'
                  ? 'ฟีเจอร์หลัก'
                  : 'Core Features'}
                </Badge>
                <h2 className="mt-6 text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] animate-gradient-slow">
                   Engineered for <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Rapid Mastery.</span>
                </h2>
            </Reveal>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[300px]">
                {/* Main Feature - Large Card */}
                {primaryFeature && (
                  <Reveal delay={100} className={`md:col-span-7 row-span-2 relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-10 shadow-2xl shadow-slate-200/50 group transition-all will-change-transform ${primaryFeature.style.hoverBorder}`}>
                       <Glow className={`bottom-[-40%] right-[-20%] w-[600px] h-[600px] opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${primaryFeature.style.glow}`} />
                       <div className="relative z-10 h-full flex flex-col justify-between">
                           <div>
                               <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 ${primaryFeature.style.iconBg}`}>
                                 <primaryFeature.Icon className={`h-8 w-8 ${primaryFeature.style.iconColor}`} strokeWidth={1.8} />
                               </div>
                               <h3 className="text-3xl font-bold mb-4">{primaryFeature.title}</h3>
                               <p className="text-lg text-slate-600 max-w-md">{primaryFeature.desc}</p>
                           </div>
                           {/* Mockup UI Area */}
                           <div className="mt-8 h-64 w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative">
                               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
                                   <div className="h-4 w-1/3 bg-slate-100 rounded-full animate-pulse" />
                                   <div className="h-4 w-1/2 bg-slate-100 rounded-full animate-pulse delay-75" />
                                   <div className="mt-auto h-20 w-full bg-orange-50/50 rounded-lg border border-orange-100 flex items-center justify-center">
                                       <div className="flex gap-1">
                                           {[...Array(4)].map((_,i) => <div key={i} className="w-4 h-12 rounded-sm bg-orange-200" style={{ opacity: 0.3 + i*0.2 }} />)}
                                       </div>
                                   </div>
                               </div>
                           </div>
                       </div>
                  </Reveal>
                )}

                {/* Secondary Features */}
                {secondaryFeatures.map((feature, index) => (
                  <Reveal
                    key={feature.id}
                    delay={200 + index * 80}
                    className={`md:col-span-5 relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-10 shadow-xl shadow-slate-200/30 group transition-all will-change-transform ${feature.style.hoverBorder}`}
                  >
                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110 ${feature.style.iconBg}`}>
                      <feature.Icon className={`h-6 w-6 ${feature.style.iconColor}`} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                    <Glow
                      className={`${index === 0 ? 'top-[-50%] right-[-50%]' : 'bottom-[-50%] left-[-50%]'} w-[300px] h-[300px] opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${feature.style.glow}`}
                    />
                  </Reveal>
                ))}
            </div>
        </div>
      </section>

      {/* --- CIRCUIT JOURNEY --- */}
      <section className="relative py-32 overflow-hidden">
        {/* Subtle Circuit Lines Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.15]">
             <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M-100 400 H 1540" stroke="url(#line_grad)" strokeWidth="2" strokeDasharray="8 8" />
                 <defs>
                     <linearGradient id="line_grad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                         <stop offset="0%" stopColor="#fb923c" stopOpacity="0" />
                         <stop offset="50%" stopColor="#fb923c" stopOpacity="1" />
                         <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
                     </linearGradient>
                 </defs>
             </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24 relative z-10">
             <Reveal className="text-center mb-24">
                 <h2 className="text-4xl md:text-5xl font-black text-slate-900">{language === 'th' ? 'เส้นทางสู่ความสำเร็จ' : 'Your Circuit to Success'}</h2>
             </Reveal>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative">
                 {journey.map((item, idx) => (
                     <Reveal key={idx} delay={idx * 150} className="relative group">
                         {/* Node Point */}
                         <div className="absolute top-0 left-1/2 md:left-0 -translate-x-1/2 md:-translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-4 border-orange-500 rounded-full z-20 shadow-lg group-hover:scale-125 transition-transform duration-300">
                             <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20"></div>
                         </div>
                         
                         <div className="pt-12 md:pt-16 text-center md:text-left">
                             <div className="text-6xl font-black text-slate-900/5 absolute top-4 left-0 right-0 md:left-auto z-0 select-none">{item.step}</div>
                             <h3 className="text-xl font-bold text-slate-900 relative z-10 mb-2">{item.title}</h3>
                             <p className="text-slate-600 relative z-10">{item.desc}</p>
                         </div>
                     </Reveal>
                 ))}
             </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="relative py-32 px-6">
          <Reveal className="mx-auto max-w-5xl">
              <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-12 md:p-24 text-center">
                  <Noise />
                  <Glow className="top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/30 blur-[150px] animate-pulse-slow" />
                  <Glow className="bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/20 blur-[150px] animate-pulse-slow delay-300" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                      <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight animate-gradient">
                          Ready to <span className="text-orange-400">Master</span> it?
                      </h2>
                      <p className="mt-6 text-xl text-slate-300 max-w-2xl">
                          {language === 'th' ? 'เริ่มเรียนรู้วันนี้ ฟรีบทเรียนแรก ไม่ต้องใช้บัตรเครดิต' : 'Start your first lesson today. No credit card required.'}
                      </p>
                      <div className="mt-12">
                          <Link href="/register" className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-white px-10 text-lg font-bold text-slate-900 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(251,146,60,0.5)]">
                              <span className="relative z-10">{t('createAccount')}</span>
                          </Link>
                      </div>
                  </div>
              </div>
          </Reveal>
      </section>

      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate3d(0, 0px, 0);
          }
          50% {
            transform: translate3d(0, -14px, 0);
          }
        }

        @keyframes pulseSlow {
          0%,
          100% {
            opacity: 0.35;
          }
          50% {
            opacity: 0.55;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 6s ease-in-out infinite;
        }

        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradientShift 12s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}