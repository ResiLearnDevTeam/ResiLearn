import { useLanguageStore } from '@/store/languageStore';

export const translations = {
  en: {
    // Landing Page
    heroTitle1: 'Master the Art',
    heroTitle2: 'of Reading Resistors',
    heroSubtitle: 'Progressive learning system designed to help you master resistor color codes through interactive exercises and real-world practice.',
    startLearning: 'Start Learning',
    createAccount: 'Create Account',
    
    // Features
    feature1Title: 'Progressive Learning',
    feature1Desc: 'Start with the basics and gradually advance to complex resistor reading scenarios.',
    feature2Title: 'Track Progress',
    feature2Desc: 'Monitor your improvement with detailed analytics and performance metrics.',
    feature3Title: 'Interactive Practice',
    feature3Desc: 'Learn through hands-on exercises and real-world resistor reading challenges.',
    
    // Stats
    studentsEnrolled: 'Students Enrolled',
    practiceExercises: 'Practice Exercises',
    successRate: 'Success Rate',
  },
  th: {
    // Landing Page
    heroTitle1: 'เชี่ยวชาญศิลปะ',
    heroTitle2: 'การอ่านค่าตัวต้านทาน',
    heroSubtitle: 'ระบบเรียนรู้แบบทีละขั้นตอนเพื่อช่วยให้คุณเชี่ยวชาญรหัสสีของตัวต้านทานผ่านแบบฝึกหัดโต้ตอบและฝึกฝนในโลกจริง',
    startLearning: 'เริ่มเรียน',
    createAccount: 'สร้างบัญชี',
    
    // Features
    feature1Title: 'การเรียนรู้แบบทีละขั้น',
    feature1Desc: 'เริ่มจากพื้นฐานและค่อยๆ พัฒนาไปสู่สถานการณ์การอ่านตัวต้านทานที่ซับซ้อน',
    feature2Title: 'ติดตามความคืบหน้า',
    feature2Desc: 'เฝ้าดูการพัฒนาของคุณด้วยการวิเคราะห์อย่างละเอียดและเมตริกประสิทธิภาพ',
    feature3Title: 'ฝึกฝนแบบโต้ตอบ',
    feature3Desc: 'เรียนรู้ผ่านแบบฝึกหัดเชิงปฏิบัติและความท้าทายการอ่านตัวต้านทานในโลกจริง',
    
    // Stats
    studentsEnrolled: 'นักเรียนที่ลงทะเบียน',
    practiceExercises: 'แบบฝึกหัด',
    successRate: 'อัตราความสำเร็จ',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  
  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };
  
  return { t, language };
};

