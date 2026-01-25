'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBandLabel } from '@/lib/resistorUtils';
import {
  ArrowLeft,
  Settings2,
  Shield,
  ShieldCheck,
  Palette,
  ListChecks,
  PenLine,
  Paintbrush,
  Layers,
  Check,
  Rocket,
  ArrowRight,
  Clock,
  Timer,
  HelpCircle,
  Zap,
  LucideIcon
} from 'lucide-react';

export default function CustomPracticePage() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    practiceMode: 'standard' as 'standard' | 'color_reading',
    resistorType: 'FOUR_BAND' as 'FOUR_BAND' | 'FIVE_BAND',
    answerType: 'multiple_choice' as 'multiple_choice' | 'fill_in' | 'color_selection',
    colorReadingMode: 'value_to_color_band_by_band' as 'value_to_color_band_by_band' | 'color_to_value',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    optionCount: 4,
    countdownTime: null as number | null,
    hasCountdown: false,
    hasQuestionLimit: true,
    questionLimit: 10,
    hasTimeLimit: false,
    timeLimit: null as number | null,
  });

  const [selectedBandIndex, setSelectedBandIndex] = useState<number | null>(null);

  const expectedBandsCount = settings.resistorType === 'FIVE_BAND' ? 5 : 4;
  
  const isDigitBand = (bandIndex: number): boolean => {
    if (settings.resistorType === 'FIVE_BAND') {
      return bandIndex <= 2;
    } else {
      return bandIndex <= 1;
    }
  };
  
  useEffect(() => {
    setSelectedBandIndex(null);
  }, [settings.resistorType]);

  useEffect(() => {
    if (settings.practiceMode !== 'color_reading') {
      setSelectedBandIndex(null);
    }
  }, [settings.practiceMode, settings.colorReadingMode]);

  const handleStartPractice = () => {
    if (settings.practiceMode === 'color_reading') {
      const modeMap: { [key: string]: string } = {
        'value_to_color_band_by_band': 'value-to-color-band-by-band',
        'color_to_value': 'color-to-value',
      };
      
      let url = `/learn/self/practice/color-reading/${modeMap[settings.colorReadingMode]}?type=${settings.resistorType}${settings.colorReadingMode === 'color_to_value' ? '&answerType=multiple_choice' : ''}`;
      
      if (selectedBandIndex !== null) {
        url += `&bandIndex=${selectedBandIndex}`;
      }
      
      router.push(url);
      return;
    }
    
    const queryParams = new URLSearchParams({
      type: settings.resistorType,
      answerType: settings.answerType,
      difficulty: settings.difficulty,
      questions: settings.hasQuestionLimit ? settings.questionLimit!.toString() : 'unlimited',
      ...(settings.answerType === 'multiple_choice' && { options: settings.optionCount.toString() }),
      ...(settings.hasCountdown && settings.countdownTime && { countdown: settings.countdownTime.toString() }),
      ...(settings.hasTimeLimit && settings.timeLimit && { limit: settings.timeLimit.toString() }),
    });
    
    router.push(`/learn/self/practice/custom/start?${queryParams.toString()}`);
  };

  const canStart = !(settings.practiceMode === 'color_reading' && 
    settings.resistorType === 'FOUR_BAND' && 
    selectedBandIndex === null
  );

  // Selection Card Component
  const SelectionCard = ({ 
    title, 
    description,
    icon: Icon, 
    isSelected, 
    onClick,
    badge,
    badgeColor = 'orange',
    compact = false
  }: { 
    title: string; 
    description?: string;
    icon: LucideIcon; 
    isSelected: boolean; 
    onClick: () => void;
    badge?: string;
    badgeColor?: 'orange' | 'blue' | 'green' | 'red' | 'purple';
    compact?: boolean;
  }) => {
    const badgeColors = {
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return (
      <button
        onClick={onClick}
        className={`
          relative w-full flex items-center gap-4 rounded-xl border-2 text-left transition-all duration-200
          ${compact ? 'p-4' : 'p-5'}
          ${isSelected 
            ? 'border-orange-500 bg-orange-50 shadow-lg scale-[1.01]' 
            : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md'
          }
        `}
      >
        {badge && (
          <span className={`absolute -top-2.5 right-4 px-3 py-1 rounded-full text-xs font-bold border ${badgeColors[badgeColor]}`}>
            {badge}
          </span>
        )}
        
        <div className={`
          flex shrink-0 items-center justify-center rounded-xl transition-all
          ${compact ? 'h-10 w-10' : 'h-12 w-12'}
          ${isSelected 
            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md' 
            : 'bg-gray-100 text-gray-500'
          }
        `}>
          <Icon className={compact ? 'h-5 w-5' : 'h-6 w-6'} />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-bold ${compact ? 'text-base' : 'text-lg'} ${isSelected ? 'text-orange-900' : 'text-gray-900'}`}>
            {title}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>

        {isSelected && (
          <div className={`flex shrink-0 items-center justify-center rounded-full bg-green-500 shadow ${compact ? 'h-6 w-6' : 'h-8 w-8'}`}>
            <Check className={compact ? 'h-4 w-4 text-white' : 'h-5 w-5 text-white'} />
          </div>
        )}
      </button>
    );
  };

  // Section Header Component
  const SectionHeader = ({ number, title }: { number: number; title: string }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
    </div>
  );

  // Summary Row Component
  const SummaryRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <LeftSidebar />

      <div 
        className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        {/* Header */}
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
                <Settings2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">กำหนดเอง</h1>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-8 lg:px-16 xl:px-24 py-6">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Section 1: Practice Mode */}
            <section>
              <SectionHeader number={1} title="รูปแบบการฝึก" />
              <div className="grid gap-3 md:grid-cols-2">
                <SelectionCard
                  title="ฝึกอ่านค่ารหัสสี"
                  description="ฝึกแปลงค่าความต้านทาน ↔ สีแถบ ทีละแถบ"
                  icon={Palette}
                  isSelected={settings.practiceMode === 'color_reading'}
                  onClick={() => setSettings({ ...settings, practiceMode: 'color_reading' })}
                  badge="เบื้องต้น"
                  badgeColor="green"
                />
                <SelectionCard
                  title="ฝึกอ่านค่าตัวต้านทาน"
                  description="อ่านค่าความต้านทานจากแถบสี หรือเลือกสีจากค่า"
                  icon={Zap}
                  isSelected={settings.practiceMode === 'standard'}
                  onClick={() => setSettings({ ...settings, practiceMode: 'standard' })}
                  badge="แนะนำ"
                  badgeColor="orange"
                />
              </div>
            </section>

            {/* Section 2: Resistor Type */}
            <section>
              <SectionHeader number={2} title="ประเภทตัวต้านทาน" />
              <div className="grid gap-3 md:grid-cols-2">
                <SelectionCard
                  title="ตัวต้านทาน 4 แถบสี"
                  description="2 หลักนัยสำคัญ + ตัวคูณ + ค่าความคลาดเคลื่อน"
                  icon={Shield}
                  isSelected={settings.resistorType === 'FOUR_BAND'}
                  onClick={() => setSettings({ ...settings, resistorType: 'FOUR_BAND' })}
                  badge="เริ่มต้น"
                  badgeColor="green"
                />
                <SelectionCard
                  title="ตัวต้านทาน 5 แถบสี"
                  description="3 หลักนัยสำคัญ + ตัวคูณ + ค่าความคลาดเคลื่อน"
                  icon={ShieldCheck}
                  isSelected={settings.resistorType === 'FIVE_BAND'}
                  onClick={() => setSettings({ ...settings, resistorType: 'FIVE_BAND' })}
                  badge="ขั้นสูง"
                  badgeColor="blue"
                />
              </div>
            </section>

            {/* Section 3: Answer Type (for standard mode) */}
            {settings.practiceMode === 'standard' && (
              <section>
                <SectionHeader number={3} title="ประเภทคำตอบ" />
                <div className="grid gap-3 md:grid-cols-3">
                  <SelectionCard
                    title="ตัวเลือก"
                    description="เลือกคำตอบจาก 4 ตัวเลือกที่ให้มา"
                    icon={ListChecks}
                    isSelected={settings.answerType === 'multiple_choice'}
                    onClick={() => setSettings({ ...settings, answerType: 'multiple_choice' })}
                  />
                  <SelectionCard
                    title="เติมคำ"
                    description="พิมพ์ค่าความต้านทานโดยตรง"
                    icon={PenLine}
                    isSelected={settings.answerType === 'fill_in'}
                    onClick={() => setSettings({ ...settings, answerType: 'fill_in' })}
                  />
                  <SelectionCard
                    title="เลือกสี"
                    description="กำหนดค่า แล้วเลือกแถบสีที่ถูกต้อง"
                    icon={Paintbrush}
                    isSelected={settings.answerType === 'color_selection'}
                    onClick={() => setSettings({ ...settings, answerType: 'color_selection' })}
                  />
                </div>
              </section>
            )}

            {/* Section 3: Color Reading Mode (for color_reading mode) */}
            {settings.practiceMode === 'color_reading' && (
              <section>
                <SectionHeader number={3} title="โหมดการฝึกอ่านค่ารหัสสี" />
                <div className="grid gap-3 md:grid-cols-2">
                  <SelectionCard
                    title="ค่า → สี"
                    description="ดูค่าความต้านทาน แล้วเลือกสีแถบที่ถูกต้องทีละแถบ"
                    icon={Layers}
                    isSelected={settings.colorReadingMode === 'value_to_color_band_by_band'}
                    onClick={() => setSettings({ ...settings, colorReadingMode: 'value_to_color_band_by_band' })}
                  />
                  <SelectionCard
                    title="สี → ค่า"
                    description="ดูแถบสี แล้วตอบค่าความต้านทาน"
                    icon={Palette}
                    isSelected={settings.colorReadingMode === 'color_to_value'}
                    onClick={() => setSettings({ ...settings, colorReadingMode: 'color_to_value' })}
                  />
                </div>
              </section>
            )}

            {/* Section 4: Band Selection (for color_reading mode with 4-band) */}
            {settings.practiceMode === 'color_reading' && settings.resistorType === 'FOUR_BAND' && (
              <section>
                <SectionHeader number={4} title="เลือกแถบที่ต้องการฝึก" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Array.from({ length: expectedBandsCount }).map((_, index) => {
                    const label = getBandLabel(index, settings.resistorType);
                    const isSelected = selectedBandIndex === index;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedBandIndex(index)}
                        className={`
                          relative p-4 rounded-xl border-2 text-center transition-all duration-200
                          ${isSelected
                            ? 'border-orange-500 bg-orange-50 shadow-lg'
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
                {selectedBandIndex !== null && (
                  <p className="mt-3 text-sm text-gray-600">
                    {isDigitBand(selectedBandIndex)
                      ? `คุณเลือกฝึก: ${getBandLabel(selectedBandIndex, settings.resistorType)} (ระบบจะสุ่มเฉพาะหลักนี้)`
                      : `คุณเลือกฝึก: ${getBandLabel(selectedBandIndex, settings.resistorType)}`}
                  </p>
                )}
              </section>
            )}

            {/* Section 4: Difficulty (for standard mode) */}
            {settings.practiceMode === 'standard' && (
              <section>
                <SectionHeader number={4} title="ระดับความยาก" />
                <div className="grid gap-3 md:grid-cols-3">
                  <SelectionCard
                    title="ง่าย"
                    description="คำตอบผิดแบบสุ่มทั้งหมด"
                    icon={Shield}
                    isSelected={settings.difficulty === 'easy'}
                    onClick={() => setSettings({ ...settings, difficulty: 'easy' })}
                    badgeColor="green"
                    compact
                  />
                  <SelectionCard
                    title="ปานกลาง"
                    description="ผสมระหว่างคำตอบผิดที่ใกล้เคียงและสุ่ม"
                    icon={Shield}
                    isSelected={settings.difficulty === 'medium'}
                    onClick={() => setSettings({ ...settings, difficulty: 'medium' })}
                    badgeColor="orange"
                    compact
                  />
                  <SelectionCard
                    title="ยาก"
                    description="คำตอบผิดใกล้เคียงกับค่าที่ถูกต้องมาก"
                    icon={Shield}
                    isSelected={settings.difficulty === 'hard'}
                    onClick={() => setSettings({ ...settings, difficulty: 'hard' })}
                    badgeColor="red"
                    compact
                  />
                </div>
              </section>
            )}

            {/* Section 5: Option Count (only for multiple_choice in standard mode) */}
            {settings.practiceMode === 'standard' && settings.answerType === 'multiple_choice' && (
              <section>
                <SectionHeader number={5} title="จำนวนตัวเลือก" />
                <div className="grid gap-3 grid-cols-3">
                  {[2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSettings({ ...settings, optionCount: count })}
                      className={`
                        rounded-xl border-2 p-4 text-center transition-all
                        ${settings.optionCount === count
                          ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                        }
                      `}
                    >
                      {count} ตัวเลือก
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Section: Question Limit */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">จำนวนคำถาม</h3>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, hasQuestionLimit: !settings.hasQuestionLimit })}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    settings.hasQuestionLimit ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    settings.hasQuestionLimit ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {settings.hasQuestionLimit ? (
                <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                  {[5, 10, 20, 50].map((count) => (
                    <button
                      key={count}
                      onClick={() => setSettings({ ...settings, questionLimit: count })}
                      className={`
                        rounded-xl border-2 p-4 text-center transition-all
                        ${settings.questionLimit === count
                          ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                        }
                      `}
                    >
                      {count} คำถาม
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-4 text-center">
                  <p className="font-semibold text-orange-700">โหมดฝึกฝนไม่จำกัด</p>
                  <p className="text-sm text-orange-600">ฝึกฝนได้นานเท่าที่คุณต้องการ!</p>
                </div>
              )}
            </section>

            {/* Section: Countdown Timer (not for color_reading) */}
            {settings.practiceMode === 'standard' && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
                      <Timer className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">ตัวจับเวลานับถอยหลัง</h3>
                    <span className="text-sm text-gray-500">(ไม่บังคับ)</span>
                  </div>
                  <button
                    onClick={() => {
                      if (settings.hasTimeLimit) {
                        setSettings({ ...settings, hasTimeLimit: false, timeLimit: null, hasCountdown: true, countdownTime: 30 });
                      } else {
                        setSettings({ ...settings, hasCountdown: !settings.hasCountdown, countdownTime: settings.hasCountdown ? null : 30 });
                      }
                    }}
                    disabled={settings.hasTimeLimit}
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      settings.hasCountdown ? 'bg-orange-500' : 'bg-gray-300'
                    } ${settings.hasTimeLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      settings.hasCountdown ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {settings.hasCountdown && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center gap-6">
                      <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={settings.countdownTime || 30}
                        onChange={(e) => setSettings({ ...settings, countdownTime: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, rgb(249, 115, 22) 0%, rgb(249, 115, 22) ${((settings.countdownTime || 30) - 5) * 100 / 115}%, rgb(229, 231, 235) ${((settings.countdownTime || 30) - 5) * 100 / 115}%, rgb(229, 231, 235) 100%)`
                        }}
                      />
                      <div className="min-w-[70px] rounded-lg bg-white border-2 border-orange-500 px-3 py-2 text-center">
                        <div className="text-xl font-bold text-orange-600">{settings.countdownTime}</div>
                        <div className="text-xs text-gray-500">วินาที</div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Section: Time Limit (not for color_reading) */}
            {settings.practiceMode === 'standard' && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
                      <Clock className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">จำกัดเวลารวม</h3>
                    <span className="text-sm text-gray-500">(ไม่บังคับ)</span>
                  </div>
                  <button
                    onClick={() => {
                      if (settings.hasCountdown) {
                        setSettings({ ...settings, hasCountdown: false, countdownTime: null, hasTimeLimit: true, timeLimit: 600 });
                      } else {
                        setSettings({ ...settings, hasTimeLimit: !settings.hasTimeLimit, timeLimit: settings.hasTimeLimit ? null : 600 });
                      }
                    }}
                    disabled={settings.hasCountdown}
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      settings.hasTimeLimit ? 'bg-orange-500' : 'bg-gray-300'
                    } ${settings.hasCountdown ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      settings.hasTimeLimit ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                
                {settings.hasTimeLimit && (
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    {[
                      { minutes: 5, seconds: 300 },
                      { minutes: 10, seconds: 600 },
                      { minutes: 20, seconds: 1200 },
                      { minutes: 30, seconds: 1800 }
                    ].map((time) => (
                      <button
                        key={time.seconds}
                        onClick={() => setSettings({ ...settings, timeLimit: time.seconds })}
                        className={`
                          rounded-xl border-2 p-4 text-center transition-all
                          ${settings.timeLimit === time.seconds
                            ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                          }
                        `}
                      >
                        {time.minutes} นาที
                      </button>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Summary Card */}
            <section className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900">สรุปการตั้งค่า</h3>
              </div>
              
              <div className="bg-white rounded-xl p-4 text-sm">
                <SummaryRow 
                  label="รูปแบบการฝึก" 
                  value={settings.practiceMode === 'color_reading' ? 'ฝึกอ่านค่ารหัสสี' : 'ฝึกอ่านค่าตัวต้านทาน'} 
                />
                <SummaryRow 
                  label="ประเภทตัวต้านทาน" 
                  value={settings.resistorType === 'FOUR_BAND' ? '4 แถบสี' : '5 แถบสี'} 
                />
                {settings.practiceMode === 'color_reading' ? (
                  <SummaryRow 
                    label="โหมดอ่านสี" 
                    value={settings.colorReadingMode === 'value_to_color_band_by_band' ? 'ค่า → สี' : 'สี → ค่า'} 
                  />
                ) : (
                  <SummaryRow 
                    label="ประเภทคำตอบ" 
                    value={
                      settings.answerType === 'multiple_choice' ? 'ตัวเลือก'
                      : settings.answerType === 'fill_in' ? 'เติมคำ' : 'เลือกสี'
                    } 
                  />
                )}
                {settings.practiceMode === 'color_reading' && settings.resistorType === 'FOUR_BAND' && selectedBandIndex !== null && (
                  <SummaryRow 
                    label="แถบที่ฝึก" 
                    value={getBandLabel(selectedBandIndex, settings.resistorType)} 
                  />
                )}
                {settings.practiceMode === 'standard' && (
                  <SummaryRow 
                    label="ระดับความยาก" 
                    value={settings.difficulty === 'easy' ? 'ง่าย' : settings.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'} 
                  />
                )}
                {settings.practiceMode === 'standard' && settings.answerType === 'multiple_choice' && (
                  <SummaryRow label="จำนวนตัวเลือก" value={`${settings.optionCount} ตัวเลือก`} />
                )}
                <SummaryRow 
                  label="จำนวนคำถาม" 
                  value={settings.hasQuestionLimit ? `${settings.questionLimit} คำถาม` : 'ไม่จำกัด'} 
                />
                {settings.practiceMode === 'standard' && (
                  <>
                    <SummaryRow 
                      label="นับถอยหลัง" 
                      value={settings.hasCountdown ? `${settings.countdownTime} วินาที/คำถาม` : 'ไม่มี'} 
                    />
                    <SummaryRow 
                      label="จำกัดเวลารวม" 
                      value={settings.hasTimeLimit && settings.timeLimit ? `${settings.timeLimit / 60} นาที` : 'ไม่มี'} 
                    />
                  </>
                )}
              </div>
            </section>

          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 px-8 lg:px-16 xl:px-24 py-4 border-t border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Link
              href="/learn/self/practice"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              ยกเลิก
            </Link>
            <button
              onClick={handleStartPractice}
              disabled={!canStart}
              className={`
                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                ${canStart
                  ? 'text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                }
              `}
            >
              <Rocket className="h-5 w-5" />
              {settings.practiceMode === 'color_reading' ? 'เริ่มฝึกอ่านค่ารหัสสี' : 'เริ่มฝึกฝน'}
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
