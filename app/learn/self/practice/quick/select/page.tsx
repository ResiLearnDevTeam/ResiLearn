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
  ChevronRight,
  LucideIcon
} from 'lucide-react';

export default function SelectResistorTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'FOUR_BAND' | 'FIVE_BAND' | null>(null);
  const [answerType, setAnswerType] = useState<'multiple_choice' | 'fill_in' | 'color_selection' | null>(null);
  const [practiceMode, setPracticeMode] = useState<'standard' | 'color_reading' | null>(null);
  const [colorReadingMode, setColorReadingMode] = useState<string | null>(null);
  const [selectedBandIndex, setSelectedBandIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const expectedBandsCount = selectedType === 'FIVE_BAND' ? 5 : 4;

  // Calculate current step
  const getCurrentStep = () => {
    if (!practiceMode) return 1;
    if (!selectedType) return 2;
    if (practiceMode === 'standard' && !answerType) return 3;
    if (practiceMode === 'color_reading' && !colorReadingMode) return 3;
    if (practiceMode === 'color_reading' && selectedBandIndex === null) return 4;
    return practiceMode === 'color_reading' ? 5 : 4;
  };

  const currentStep = getCurrentStep();

  // Check if we can proceed to next step
  const canStartPractice = () => {
    if (!practiceMode || !selectedType) return false;
    if (practiceMode === 'standard' && !answerType) return false;
    if (practiceMode === 'color_reading') {
      if (!colorReadingMode) return false;
      if (selectedBandIndex === null) return false;
    }
    return true;
  };

  // Check if selected band is a digit band
  const isDigitBand = (bandIndex: number): boolean => {
    if (selectedType === 'FIVE_BAND') {
      return bandIndex <= 2;
    } else {
      return bandIndex <= 1;
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Reset band selection when resistor type changes
  useEffect(() => {
    setSelectedBandIndex(null);
  }, [selectedType]);

  const handleStartPractice = () => {
    if (!canStartPractice()) return;
    
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

  // Step indicator component
  const StepIndicator = ({ step, label, isActive, isCompleted }: { 
    step: number; 
    label: string; 
    isActive: boolean; 
    isCompleted: boolean;
  }) => (
    <div className="flex items-center gap-3">
      <div className={`
        relative flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm
        transition-all duration-300 
        ${isCompleted 
          ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-200' 
          : isActive 
            ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-200 ring-4 ring-orange-100' 
            : 'bg-gray-100 text-gray-400'
        }
      `}>
        {isCompleted ? (
          <Check className="h-5 w-5" />
        ) : (
          step
        )}
        {isActive && (
          <span className="absolute -inset-1 animate-ping rounded-full bg-orange-400 opacity-20"></span>
        )}
      </div>
      <span className={`text-sm font-medium hidden sm:block transition-colors ${
        isActive ? 'text-orange-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  );

  // Selection card component
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
    description: string; 
    icon: LucideIcon; 
    isSelected: boolean; 
    onClick: () => void;
    badge?: string;
    badgeColor?: 'orange' | 'blue' | 'green' | 'purple';
  }) => {
    const badgeColors = {
      orange: 'bg-orange-100 text-orange-700',
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      purple: 'bg-purple-100 text-purple-700',
    };

    return (
      <button
        onClick={onClick}
        className={`
          group relative rounded-2xl border-2 p-6 text-left transition-all duration-300
          ${isSelected 
            ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl shadow-orange-100 scale-[1.02]' 
            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-lg hover:scale-[1.01]'
          }
        `}
      >
        {/* Glow effect when selected */}
        {isSelected && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/10 to-orange-600/10 animate-pulse"></div>
        )}
        
        {/* Badge */}
        {badge && (
          <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold ${badgeColors[badgeColor]}`}>
            {badge}
          </div>
        )}

        <div className="relative z-10">
          {/* Icon */}
          <div className={`
            mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300
            ${isSelected 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200' 
              : 'bg-gray-100 group-hover:bg-orange-100'
            }
          `}>
            <Icon className={`h-7 w-7 transition-colors ${isSelected ? 'text-white' : 'text-gray-600 group-hover:text-orange-600'}`} />
          </div>

          {/* Title and Description */}
          <h3 className={`text-lg font-bold mb-2 transition-colors ${isSelected ? 'text-orange-900' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>

          {/* Selection indicator */}
          <div className={`
            absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full 
            transition-all duration-300
            ${isSelected 
              ? 'bg-green-500 scale-100' 
              : 'bg-gray-200 scale-75 opacity-0 group-hover:opacity-50'
            }
          `}>
            <Check className="h-4 w-4 text-white" />
          </div>
        </div>
      </button>
    );
  };

  // Get total steps
  const getTotalSteps = () => {
    if (!practiceMode) return 4;
    if (practiceMode === 'standard') return 4;
    return 5;
  };

  const totalSteps = getTotalSteps();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-6 lg:px-8 max-w-5xl">
          {/* Header */}
          <div className={`mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Link 
              href="/learn/self/practice" 
              className="text-orange-600 hover:text-orange-700 mb-4 inline-flex items-center gap-2 text-sm font-medium group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              กลับไปโหมดฝึกฝน
            </Link>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ฝึกด่วน</h1>
                <p className="text-gray-600">ปรับแต่งการฝึกของคุณ</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className={`mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
              <StepIndicator step={1} label="โหมดการฝึก" isActive={currentStep === 1} isCompleted={!!practiceMode} />
              <ChevronRight className="h-5 w-5 text-gray-300 hidden sm:block" />
              <StepIndicator step={2} label="ประเภทตัวต้านทาน" isActive={currentStep === 2} isCompleted={!!selectedType} />
              <ChevronRight className="h-5 w-5 text-gray-300 hidden sm:block" />
              <StepIndicator 
                step={3} 
                label={practiceMode === 'color_reading' ? 'โหมดอ่านสี' : 'ประเภทคำตอบ'} 
                isActive={currentStep === 3} 
                isCompleted={practiceMode === 'standard' ? !!answerType : !!colorReadingMode} 
              />
              {practiceMode === 'color_reading' && colorReadingMode && (
                <>
                  <ChevronRight className="h-5 w-5 text-gray-300 hidden sm:block" />
                  <StepIndicator step={4} label="เลือกแถบ" isActive={currentStep === 4} isCompleted={selectedBandIndex !== null} />
                </>
              )}
            </div>
          </div>

          {/* Step 1: Practice Mode Selection */}
          <div className={`mb-6 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold text-gray-900">เลือกโหมดการฝึก</h2>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <SelectionCard
                  title="ฝึกอ่านสี"
                  description="ฝึกอ่านสีแบบครบวงจร ทั้งค่า→สี และ สี→ค่า พร้อมโหมดทีละแถบ"
                  icon={Palette}
                  isSelected={practiceMode === 'color_reading'}
                  onClick={() => {
                    setPracticeMode('color_reading');
                    setAnswerType(null);
                  }}
                  badge="เบื้องต้น"
                  badgeColor="green"
                />
                <SelectionCard
                  title="ฝึกแบบปกติ"
                  description="ฝึกอ่านค่าความต้านทานจากแถบสี หรือเลือกแถบสีจากค่าที่กำหนด"
                  icon={Zap}
                  isSelected={practiceMode === 'standard'}
                  onClick={() => {
                    setPracticeMode('standard');
                    setColorReadingMode(null);
                    setSelectedBandIndex(null);
                  }}
                  badge="แนะนำ"
                  badgeColor="orange"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Resistor Type Selection */}
          {practiceMode && (
            <div className={`mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">เลือกประเภทตัวต้านทาน</h2>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectionCard
                    title="ตัวต้านทาน 4 แถบสี"
                    description="รหัสสีมาตรฐาน เหมาะสำหรับผู้เริ่มต้น • 2 หลัก + ตัวคูณ + ความคลาดเคลื่อน"
                    icon={Shield}
                    isSelected={selectedType === 'FOUR_BAND'}
                    onClick={() => setSelectedType('FOUR_BAND')}
                    badge="เริ่มต้น"
                    badgeColor="green"
                  />
                  <SelectionCard
                    title="ตัวต้านทาน 5 แถบสี"
                    description="ตัวต้านทานแบบแม่นยำสูง • 3 หลัก + ตัวคูณ + ความคลาดเคลื่อน"
                    icon={ShieldCheck}
                    isSelected={selectedType === 'FIVE_BAND'}
                    onClick={() => setSelectedType('FIVE_BAND')}
                    badge="ขั้นสูง"
                    badgeColor="blue"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3a: Answer Type Selection (Standard Mode) */}
          {practiceMode === 'standard' && selectedType && (
            <div className={`mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">เลือกประเภทคำตอบ</h2>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <SelectionCard
                    title="ตัวเลือก"
                    description="เลือกคำตอบจาก 4 ตัวเลือกที่ให้มา"
                    icon={ListChecks}
                    isSelected={answerType === 'multiple_choice'}
                    onClick={() => setAnswerType('multiple_choice')}
                  />
                  <SelectionCard
                    title="เติมคำ"
                    description="พิมพ์คำตอบค่าความต้านทานโดยตรง"
                    icon={PenLine}
                    isSelected={answerType === 'fill_in'}
                    onClick={() => setAnswerType('fill_in')}
                  />
                  <SelectionCard
                    title="เลือกสี"
                    description="กำหนดค่า แล้วเลือกแถบสีที่ถูกต้อง"
                    icon={Paintbrush}
                    isSelected={answerType === 'color_selection'}
                    onClick={() => setAnswerType('color_selection')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3b: Color Reading Mode Selection */}
          {practiceMode === 'color_reading' && selectedType && (
            <div className={`mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-sm">
                    3
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">เลือกโหมดการฝึกอ่านสี</h2>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <SelectionCard
                    title="ค่า → สี"
                    description="แสดงค่า แล้วถามทีละแถบสีตามลำดับ"
                    icon={Layers}
                    isSelected={colorReadingMode === 'value_to_color_band_by_band'}
                    onClick={() => setColorReadingMode('value_to_color_band_by_band')}
                  />
                  <SelectionCard
                    title="สี → ค่า"
                    description="แสดงแถบสี แล้วถามค่าความต้านทาน"
                    icon={Palette}
                    isSelected={colorReadingMode === 'color_to_value'}
                    onClick={() => setColorReadingMode('color_to_value')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Band Selection (Color Reading modes) */}
          {practiceMode === 'color_reading' && colorReadingMode && selectedType && (
            <div className={`mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 font-bold text-sm">
                    4
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">เลือกแถบที่ต้องการฝึก</h2>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: expectedBandsCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedBandIndex(index)}
                      className={`
                        relative px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300
                        ${selectedBandIndex === index
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                        }
                      `}
                    >
                      {selectedBandIndex === index && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                          <Check className="h-3 w-3 text-white" />
                        </span>
                      )}
                      {getBandLabel(index, selectedType)}
                    </button>
                  ))}
                </div>
                
                {selectedBandIndex !== null && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <p className="text-sm text-orange-800">
                      <span className="font-semibold">คุณเลือกฝึก:</span> {getBandLabel(selectedBandIndex, selectedType)}
                      {isDigitBand(selectedBandIndex) 
                        ? ' (ระบบจะสุ่มเฉพาะหลักนี้ให้เลย)'
                        : ' - ระบบจะสุ่มเฉพาะแถบนี้'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Start Button */}
          <div className={`transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex gap-4">
              <button
                onClick={handleStartPractice}
                disabled={!canStartPractice()}
                className={`
                  flex-1 relative flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-lg font-bold text-white 
                  shadow-xl transition-all duration-300
                  ${canStartPractice()
                    ? 'bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:via-orange-600 hover:to-amber-600 hover:shadow-2xl hover:scale-[1.02] cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {canStartPractice() && (
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 opacity-0 animate-pulse"></span>
                )}
                <Rocket className={`h-6 w-6 ${canStartPractice() ? 'animate-bounce' : ''}`} />
                <span className="relative">เริ่มฝึกฝนเลย!</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <Link
                href="/learn/self/practice"
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-6 py-5 font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                ยกเลิก
              </Link>
            </div>

            {/* Progress summary */}
            {!canStartPractice() && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  กรุณาเลือกตัวเลือกทั้งหมดเพื่อเริ่มฝึกฝน
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
