'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getBandLabel } from '@/lib/resistorUtils';
import { 
  Zap, 
  Palette, 
  Shield, 
  ShieldCheck, 
  ListChecks, 
  PenLine, 
  Paintbrush,
  Rocket,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Edit3,
  LucideIcon
} from 'lucide-react';

export default function SelectResistorTypePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<'FOUR_BAND' | 'FIVE_BAND' | null>(null);
  const [answerType, setAnswerType] = useState<'multiple_choice' | 'fill_in' | 'color_selection' | null>(null);
  const [practiceMode, setPracticeMode] = useState<'standard' | 'color_reading' | null>(null);
  const [colorReadingMode, setColorReadingMode] = useState<string | null>(null);
  const [selectedBandIndex, setSelectedBandIndex] = useState<number | null>(null);

  const expectedBandsCount = selectedType === 'FIVE_BAND' ? 5 : 4;
  
  // Total steps: 5 for color_reading (includes band selection), 4 for standard (skip band selection)
  const totalSteps = practiceMode === 'color_reading' ? 5 : 4;

  // Check if current step selection is complete
  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return !!practiceMode;
      case 2: return !!selectedType;
      case 3: return practiceMode === 'standard' ? !!answerType : !!colorReadingMode;
      case 4: 
        if (practiceMode === 'standard') return true; // Summary step for standard
        return selectedBandIndex !== null; // Band selection for color_reading
      case 5: return true; // Summary step
      default: return false;
    }
  };

  // Check if we can proceed to next step
  const canProceed = isStepComplete(currentStep);

  // Reset band selection when resistor type changes
  useEffect(() => {
    setSelectedBandIndex(null);
  }, [selectedType]);

  // Handle next step
  const handleNext = () => {
    if (!canProceed) return;
    
    if (practiceMode === 'standard' && currentStep === 3) {
      // Skip to summary (step 4) for standard mode
      setCurrentStep(4);
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handleBack = () => {
    if (currentStep > 1) {
      if (practiceMode === 'standard' && currentStep === 4) {
        // Go back to step 3 from summary
        setCurrentStep(3);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Handle edit from summary
  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleStartPractice = () => {
    if (practiceMode === 'color_reading') {
      const modeMap: { [key: string]: string } = {
        'value_to_color_band_by_band': 'value-to-color-band-by-band',
        'color_to_value': 'color-to-value',
      };
      
      let url = `/learn/self/practice/color-reading/${modeMap[colorReadingMode!]}?type=${selectedType}`;
      
      if (selectedBandIndex !== null) {
        url += `&bandIndex=${selectedBandIndex}`;
      }
      
      router.push(url);
    } else {
      router.push(`/learn/self/practice/quick?type=${selectedType}&answerType=${answerType}`);
    }
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

  // Summary Row Component - Compact version
  const SummaryRow = ({ 
    label, 
    value, 
    onEdit,
  }: { 
    label: string; 
    value: string; 
    onEdit: () => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
      <button 
        onClick={onEdit}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors font-medium text-sm"
      >
        <Edit3 className="h-4 w-4" />
        แก้ไข
      </button>
    </div>
  );

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'เลือกโหมดการฝึก';
      case 2: return 'เลือกประเภทตัวต้านทาน';
      case 3: return practiceMode === 'color_reading' ? 'เลือกโหมดอ่านสี' : 'เลือกประเภทคำตอบ';
      case 4: 
        if (practiceMode === 'standard') return 'ยืนยันการเลือก';
        return 'เลือกแถบที่ต้องการฝึก';
      case 5: return 'ยืนยันการเลือก';
      default: return '';
    }
  };

  // Check if current step is summary
  const isSummaryStep = (practiceMode === 'standard' && currentStep === 4) || 
                        (practiceMode === 'color_reading' && currentStep === 5);

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

              {/* Step Content Container */}
              <div className="w-full max-w-3xl">
                {/* Step 1: Practice Mode */}
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <SelectionCard
                      title="ฝึกอ่านสี"
                      description="ฝึกแปลงค่าความต้านทาน ↔ สีแถบ ทีละแถบ"
                      icon={Palette}
                      isSelected={practiceMode === 'color_reading'}
                      onClick={() => {
                        setPracticeMode('color_reading');
                        setAnswerType(null);
                        setCurrentStep(2);
                      }}
                      badge="เบื้องต้น"
                      badgeColor="green"
                    />
                    <SelectionCard
                      title="ฝึกแบบปกติ"
                      description="อ่านค่าความต้านทานจากแถบสี หรือเลือกสีจากค่า"
                      icon={Zap}
                      isSelected={practiceMode === 'standard'}
                      onClick={() => {
                        setPracticeMode('standard');
                        setColorReadingMode(null);
                        setSelectedBandIndex(null);
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
                      onClick={() => {
                        setSelectedType('FOUR_BAND');
                        setCurrentStep(3);
                      }}
                      badge="เริ่มต้น"
                      badgeColor="green"
                    />
                    <SelectionCard
                      title="ตัวต้านทาน 5 แถบสี"
                      description="3 หลักนัยสำคัญ + ตัวคูณ + ค่าความคลาดเคลื่อน"
                      icon={ShieldCheck}
                      isSelected={selectedType === 'FIVE_BAND'}
                      onClick={() => {
                        setSelectedType('FIVE_BAND');
                        setCurrentStep(3);
                      }}
                      badge="ขั้นสูง"
                      badgeColor="blue"
                    />
                  </div>
                )}

                {/* Step 3: Answer Type / Color Mode */}
                {currentStep === 3 && practiceMode === 'standard' && (
                  <div className="space-y-3">
                    <SelectionCard
                      title="ตัวเลือก"
                      description="เลือกคำตอบจาก 4 ตัวเลือกที่ให้มา"
                      icon={ListChecks}
                      isSelected={answerType === 'multiple_choice'}
                      onClick={() => {
                        setAnswerType('multiple_choice');
                        setCurrentStep(4); // Go to summary for standard mode
                      }}
                    />
                    <SelectionCard
                      title="เติมคำ"
                      description="พิมพ์ค่าความต้านทานโดยตรง"
                      icon={PenLine}
                      isSelected={answerType === 'fill_in'}
                      onClick={() => {
                        setAnswerType('fill_in');
                        setCurrentStep(4); // Go to summary for standard mode
                      }}
                    />
                    <SelectionCard
                      title="เลือกสี"
                      description="กำหนดค่า แล้วเลือกแถบสีที่ถูกต้อง"
                      icon={Paintbrush}
                      isSelected={answerType === 'color_selection'}
                      onClick={() => {
                        setAnswerType('color_selection');
                        setCurrentStep(4); // Go to summary for standard mode
                      }}
                    />
                  </div>
                )}

                {currentStep === 3 && practiceMode === 'color_reading' && (
                  <div className="space-y-3">
                    <SelectionCard
                      title="ค่า → สี"
                      description="ดูค่าความต้านทาน แล้วเลือกสีแถบที่ถูกต้องทีละแถบ"
                      icon={Layers}
                      isSelected={colorReadingMode === 'value_to_color_band_by_band'}
                      onClick={() => {
                        setColorReadingMode('value_to_color_band_by_band');
                        setCurrentStep(4); // Go to band selection for color_reading
                      }}
                    />
                    <SelectionCard
                      title="สี → ค่า"
                      description="ดูแถบสี แล้วตอบค่าความต้านทาน"
                      icon={Palette}
                      isSelected={colorReadingMode === 'color_to_value'}
                      onClick={() => {
                        setColorReadingMode('color_to_value');
                        setCurrentStep(4); // Go to band selection for color_reading
                      }}
                    />
                  </div>
                )}

                {/* Step 4: Band Selection (Color Reading Only) */}
                {currentStep === 4 && practiceMode === 'color_reading' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-3 text-center">เลือกแถบสีที่ต้องการฝึกเป็นพิเศษ</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: expectedBandsCount }).map((_, index) => {
                        const label = getBandLabel(index, selectedType || 'FOUR_BAND');
                        const isSelected = selectedBandIndex === index;
                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedBandIndex(index);
                              setCurrentStep(5); // Go to summary
                            }}
                            className={`
                              relative p-4 rounded-xl border-2 text-center transition-all duration-200
                              ${isSelected
                                ? 'border-orange-500 bg-orange-50 shadow-lg scale-[1.01]'
                                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
                              }
                            `}
                          >
                            {isSelected && (
                              <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow">
                                <Check className="h-4 w-4 text-white" />
                              </span>
                            )}
                            <p className={`font-bold ${isSelected ? 'text-orange-900' : 'text-gray-900'}`}>
                              {label}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Summary Step */}
                {isSummaryStep && (
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow">
                        <Check className="h-5 w-5" />
                      </div>
                      <p className="font-bold text-gray-900">ตรวจสอบการเลือกของคุณ</p>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4">
                      <SummaryRow 
                        label="โหมดการฝึก"
                        value={practiceMode === 'color_reading' ? 'ฝึกอ่านสี' : 'ฝึกแบบปกติ'}
                        onEdit={() => handleEdit(1)}
                      />
                      <SummaryRow 
                        label="ประเภทตัวต้านทาน"
                        value={selectedType === 'FOUR_BAND' ? '4 แถบสี' : '5 แถบสี'}
                        onEdit={() => handleEdit(2)}
                      />
                      <SummaryRow 
                        label={practiceMode === 'color_reading' ? 'โหมดอ่านสี' : 'ประเภทคำตอบ'}
                        value={
                          practiceMode === 'color_reading'
                            ? colorReadingMode === 'value_to_color_band_by_band' ? 'ค่า → สี' : 'สี → ค่า'
                            : answerType === 'multiple_choice' ? 'ตัวเลือก' 
                              : answerType === 'fill_in' ? 'เติมคำ' : 'เลือกสี'
                        }
                        onEdit={() => handleEdit(3)}
                      />
                      {practiceMode === 'color_reading' && (
                        <SummaryRow 
                          label="แถบที่ฝึก"
                          value={getBandLabel(selectedBandIndex || 0, selectedType || 'FOUR_BAND')}
                          onEdit={() => handleEdit(4)}
                        />
                      )}
                    </div>
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

            {/* Next / Start Button */}
            {isSummaryStep ? (
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
