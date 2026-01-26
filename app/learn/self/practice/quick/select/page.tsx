'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Palette, 
  Shield, 
  ShieldCheck, 
  Rocket,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

export default function SelectResistorTypePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'FOUR_BAND' | 'FIVE_BAND' | null>(null);
  const [practiceMode, setPracticeMode] = useState<'standard' | 'color_reading' | null>(null);

  // 2 steps: โหมดการฝึก → ประเภทตัวต้านทาน; โหมดอ่านสี / ประเภทคำตอบ สุ่มตอนกด เริ่มฝึกฝน
  const totalSteps = 2;

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return !!practiceMode;
      case 2: return !!selectedType;
      default: return false;
    }
  };

  const canProceed = isStepComplete(currentStep);
  const isStep2AndReady = currentStep === 2 && canProceed;

  const handleNext = () => {
    if (!canProceed) return;
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleStartPractice = () => {
    if (!selectedType) return;
    const params = new URLSearchParams({ type: selectedType, mode: practiceMode! });
    if (practiceMode === 'color_reading') {
      const v = ['value_to_color', 'color_to_value'][Math.floor(Math.random() * 2)];
      params.set('colorReadingMode', v);
    } else {
      const a = ['multiple_choice', 'fill_in', 'color_selection'][Math.floor(Math.random() * 3)];
      params.set('answerType', a);
    }
    router.push(`/learn/self/practice/quick?${params.toString()}`);
  };

  // Progress Bar Component - Compact version
  const ProgressBar = () => {
    const progress = (currentStep / totalSteps) * 100;
    
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            ขั้นตอนที่ {currentStep} จาก {totalSteps}
          </span>
          <span className="text-sm font-bold text-orange-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Step indicators */}
        <div className="flex justify-between mt-3">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-orange-500 text-white ring-2 ring-orange-200 scale-110' 
                      : 'bg-gray-200 text-gray-400'
                  }
                `}>
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Selection Card Component - Compact version
  const SelectionCard = ({ 
    title, 
    description,
    icon: Icon, 
    isSelected, 
    onClick,
    badge,
    badgeColor = 'orange'
  }: { 
    title: string; 
    description?: string;
    icon: LucideIcon; 
    isSelected: boolean; 
    onClick: () => void;
    badge?: string;
    badgeColor?: 'orange' | 'blue' | 'green' | 'purple';
  }) => {
    const badgeColors = {
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return (
      <button
        onClick={onClick}
        className={`
          relative w-full flex items-center gap-4 rounded-xl border-2 p-5 text-left transition-all duration-200
          ${isSelected 
            ? 'border-orange-500 bg-orange-50 shadow-lg scale-[1.01]' 
            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
          }
        `}
      >
        {/* Badge */}
        {badge && (
          <span className={`absolute -top-2.5 right-4 px-3 py-1 rounded-full text-xs font-bold border ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
        
        {/* Icon */}
        <div className={`
          flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all
          ${isSelected 
            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md' 
            : 'bg-gray-100 text-gray-500'
          }
        `}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-lg ${isSelected ? 'text-orange-900' : 'text-gray-900'}`}>
            {title}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">{description}</p>
          )}
        </div>

        {/* Check */}
        {isSelected && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 shadow">
            <Check className="h-5 w-5 text-white" />
          </div>
        )}
      </button>
    );
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'เลือกโหมดการฝึก';
      case 2: return 'เลือกประเภทตัวต้านทาน';
      default: return '';
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        {/* Header - Compact */}
        <header className="shrink-0 px-8 lg:px-16 xl:px-24 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <Link 
              href="/learn/self/practice" 
              className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ฝึกด่วน</h1>
            </div>
          </div>
        </header>

        {/* Main Content Area - No scroll, fit to viewport */}
        <main className="flex-1 flex flex-col px-8 lg:px-16 xl:px-24 py-4 overflow-hidden">
          <div className="w-full h-full flex flex-col">
            {/* Progress Bar */}
            <div className="shrink-0 mb-4">
              <ProgressBar />
            </div>

            {/* Step Content - Below progress bar */}
            <div className="flex flex-col items-center min-h-0 mt-2">
              {/* Step Title */}
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 text-center shrink-0">{getStepTitle()}</h2>
              {currentStep === 2 && (
                <p className="text-sm text-gray-500 mb-2 text-center">โหมดอ่านสี หรือ ประเภทคำตอบ ตามโหมดจะถูกสุ่มโดยระบบ</p>
              )}

              {/* Step Content Container */}
              <div className="w-full max-w-3xl">
                {/* Step 1: Practice Mode */}
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <SelectionCard
                      title="ฝึกอ่านค่ารหัสสี"
                      description="ฝึกแปลงค่าความต้านทาน ↔ สีแถบ ทีละแถบ"
                      icon={Palette}
                      isSelected={practiceMode === 'color_reading'}
                      onClick={() => {
                        setPracticeMode('color_reading');
                        setCurrentStep(2);
                      }}
                      badge="เบื้องต้น"
                      badgeColor="green"
                    />
                    <SelectionCard
                      title="ฝึกอ่านค่าตัวต้านทาน"
                      description="อ่านค่าความต้านทานจากแถบสี หรือเลือกสีจากค่า"
                      icon={Zap}
                      isSelected={practiceMode === 'standard'}
                      onClick={() => {
                        setPracticeMode('standard');
                        setCurrentStep(2);
                      }}
                      badge="แนะนำ"
                      badgeColor="orange"
                    />
                  </div>
                )}

                {/* Step 2: Resistor Type */}
                {currentStep === 2 && (
                  <div className="space-y-3">
                    <SelectionCard
                      title="ตัวต้านทาน 4 แถบสี"
                      description="2 หลักนัยสำคัญ + ตัวคูณ + ค่าความคลาดเคลื่อน"
                      icon={Shield}
                      isSelected={selectedType === 'FOUR_BAND'}
                      onClick={() => setSelectedType('FOUR_BAND')}
                      badge="เริ่มต้น"
                      badgeColor="green"
                    />
                    <SelectionCard
                      title="ตัวต้านทาน 5 แถบสี"
                      description="3 หลักนัยสำคัญ + ตัวคูณ + ค่าความคลาดเคลื่อน"
                      icon={ShieldCheck}
                      isSelected={selectedType === 'FIVE_BAND'}
                      onClick={() => setSelectedType('FIVE_BAND')}
                      badge="ขั้นสูง"
                      badgeColor="blue"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation - Compact */}
        <footer className="shrink-0 px-8 lg:px-16 xl:px-24 py-4 border-t border-gray-100 bg-white">
          <div className="max-w-3xl mx-auto flex gap-3">
            {/* Back Button */}
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all
                ${currentStep === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <ChevronLeft className="h-5 w-5" />
              ย้อนกลับ
            </button>

            {/* Next / Start Button — ขั้น 2 พร้อมแล้วแสดง เริ่มฝึกฝน (โหมดอ่านสี/ประเภทคำตอบ สุ่มโดยระบบ) */}
            {isStep2AndReady ? (
              <button
                onClick={handleStartPractice}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all"
              >
                <Rocket className="h-5 w-5" />
                เริ่มฝึกฝน
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold transition-all
                  ${canProceed
                    ? 'text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }
                `}
              >
                ถัดไป
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
