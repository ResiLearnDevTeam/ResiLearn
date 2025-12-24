'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBandLabel } from '@/lib/resistorUtils';

export default function CustomPracticePage() {
  const router = useRouter();
  
  const [settings, setSettings] = useState({
    resistorType: 'FOUR_BAND' as 'FOUR_BAND' | 'FIVE_BAND',
    answerType: 'multiple_choice' as 'multiple_choice' | 'fill_in' | 'color_selection' | 'color_reading',
    colorReadingMode: null as 'value_to_color_full' | 'value_to_color_band_by_band' | 'color_to_value' | 'mixed' | null,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    optionCount: 4,
    countdownTime: null as number | null,
    hasCountdown: false,
    totalQuestions: null as number | null,
    hasQuestionLimit: true,
    questionLimit: 10,
    hasTimeLimit: false,
    timeLimit: null as number | null,
  });

  const [selectedBandIndex, setSelectedBandIndex] = useState<number | null>(null);

  const expectedBandsCount = settings.resistorType === 'FIVE_BAND' ? 5 : 4;
  
  // Check if selected band is a digit band
  const isDigitBand = (bandIndex: number): boolean => {
    if (settings.resistorType === 'FIVE_BAND') {
      return bandIndex <= 2; // Bands 0, 1, 2 are digit bands
    } else {
      return bandIndex <= 1; // Bands 0, 1 are digit bands
    }
  };
  
  // Reset selections when resistor type changes
  useEffect(() => {
    setSelectedBandIndex(null);
  }, [settings.resistorType]);

  // Reset band selection when color reading mode changes
  useEffect(() => {
    if (settings.answerType !== 'color_reading') {
      setSelectedBandIndex(null);
    }
  }, [settings.answerType, settings.colorReadingMode]);

  const handleStartPractice = () => {
    // If color reading mode is selected, redirect to color reading page
    if (settings.answerType === 'color_reading' && settings.colorReadingMode) {
      const modeMap: { [key: string]: string } = {
        'value_to_color_full': 'value-to-color-full',
        'value_to_color_band_by_band': 'value-to-color-band-by-band',
        'color_to_value': 'color-to-value',
        'mixed': 'mixed'
      };
      
      let url = `/learn/self/practice/color-reading/${modeMap[settings.colorReadingMode]}?type=${settings.resistorType}${settings.colorReadingMode === 'color_to_value' || settings.colorReadingMode === 'mixed' ? '&answerType=multiple_choice' : ''}`;
      
      // Add bandIndex if selected (only for 4-band and normal mode, not comprehensive/mixed)
      if (selectedBandIndex !== null && settings.colorReadingMode !== 'mixed') {
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link href="/learn/self/practice" className="text-orange-600 hover:text-orange-700 mb-3 sm:mb-4 inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              กลับไปโหมดฝึกฝน
            </Link>
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">กำหนดเอง</h1>
            <p className="text-sm sm:text-base text-gray-600">
              กำหนดการฝึกฝนของคุณให้ตรงกับเป้าหมายการเรียนรู้
            </p>
          </div>

          {/* Configuration Form */}
          <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl">
            {/* Resistor Type */}
            <div className="mb-6 sm:mb-8">
              <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
                1. ประเภทตัวต้านทาน
              </label>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <button
                  onClick={() => setSettings({ ...settings, resistorType: 'FOUR_BAND' })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                    settings.resistorType === 'FOUR_BAND'
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      settings.resistorType === 'FOUR_BAND' ? 'bg-orange-600' : 'bg-gray-100'
                    }`}>
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">ตัวต้านทาน 4 แถบสี</h3>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">
                    รหัสสีมาตรฐาน เหมาะสำหรับผู้เริ่มต้น
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>2 หลัก</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>1 แถบตัวคูณ</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>1 แถบความคลาดเคลื่อน</span>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, resistorType: 'FIVE_BAND' })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                    settings.resistorType === 'FIVE_BAND'
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      settings.resistorType === 'FIVE_BAND' ? 'bg-orange-600' : 'bg-gray-100'
                    }`}>
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">ตัวต้านทาน 5 แถบสี</h3>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">
                    ตัวต้านทานแบบแม่นยำสูง สำหรับผู้เรียนระดับสูง
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>3 หลัก</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>1 แถบตัวคูณ</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>1 แถบความคลาดเคลื่อน</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Answer Type */}
            <div className="mb-6 sm:mb-8">
              <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
                2. ประเภทคำตอบ
              </label>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={() => setSettings({ ...settings, answerType: 'color_reading', colorReadingMode: 'value_to_color_band_by_band' })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 text-left transition-all ${
                    settings.answerType === 'color_reading'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.answerType === 'color_reading' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">ฝึกอ่านสี</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    โหมดฝึกอ่านสีแบบครบวงจร
                  </p>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, answerType: 'multiple_choice', colorReadingMode: null })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 text-left transition-all ${
                    settings.answerType === 'multiple_choice'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.answerType === 'multiple_choice' ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">ตัวเลือก</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    เลือกจากตัวเลือกที่ให้มา
                  </p>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, answerType: 'fill_in', colorReadingMode: null })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 text-left transition-all ${
                    settings.answerType === 'fill_in'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.answerType === 'fill_in' ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">เติมคำ</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    พิมพ์คำตอบของคุณโดยตรง
                  </p>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, answerType: 'color_selection', colorReadingMode: null })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 text-left transition-all ${
                    settings.answerType === 'color_selection'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.answerType === 'color_selection' ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">เลือกสี</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    กำหนดค่าความต้านทานให้ แล้วเลือกแถบสี
                  </p>
                </button>
              </div>
            </div>

            {/* Difficulty Level - Hide when color_reading is selected */}
            {settings.answerType !== 'color_reading' && (
            <div className="mb-6 sm:mb-8">
              <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
                3. ระดับความยาก
              </label>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                <button
                  onClick={() => setSettings({ ...settings, difficulty: 'easy' })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                    settings.difficulty === 'easy'
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.difficulty === 'easy' ? 'border-green-600 bg-green-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-lg font-bold text-gray-900">ง่าย</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    คำตอบผิดแบบสุ่มทั้งหมด
                  </p>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, difficulty: 'medium' })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                    settings.difficulty === 'medium'
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.difficulty === 'medium' ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-lg font-bold text-gray-900">ปานกลาง</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    ผสมระหว่างคำตอบผิดที่ใกล้เคียงและสุ่ม
                  </p>
                </button>

                <button
                  onClick={() => setSettings({ ...settings, difficulty: 'hard' })}
                  className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                    settings.difficulty === 'hard'
                      ? 'border-red-500 bg-red-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-red-300'
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      settings.difficulty === 'hard' ? 'border-red-600 bg-red-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-lg font-bold text-gray-900">ยาก</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    คำตอบผิดใกล้เคียงกับค่าที่ถูกต้องมาก (ยากมาก)
                  </p>
                </button>
              </div>
            </div>
            )}

            {/* Color Reading Mode Selection */}
            {settings.answerType === 'color_reading' && (
              <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl">
                <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
                  เลือกโหมดการฝึกอ่านสี
                </label>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  <button
                    onClick={() => setSettings({ ...settings, colorReadingMode: 'value_to_color_band_by_band' })}
                    className={`rounded-xl border-2 p-6 text-left transition-all ${
                      settings.colorReadingMode === 'value_to_color_band_by_band'
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full border-2 ${
                        settings.colorReadingMode === 'value_to_color_band_by_band' ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                      }`}></div>
                      <h3 className="text-lg font-bold text-gray-900">ค่า → สี</h3>
                    </div>
                    <p className="text-sm text-gray-600">แสดงค่า แล้วถามทีละแถบสีตามลำดับ</p>
                  </button>

                  <button
                    onClick={() => setSettings({ ...settings, colorReadingMode: 'color_to_value' })}
                    className={`rounded-xl border-2 p-6 text-left transition-all ${
                      settings.colorReadingMode === 'color_to_value'
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full border-2 ${
                        settings.colorReadingMode === 'color_to_value' ? 'border-orange-600 bg-orange-600' : 'border-gray-300'
                      }`}></div>
                      <h3 className="text-lg font-bold text-gray-900">สี → ค่า</h3>
                    </div>
                    <p className="text-sm text-gray-600">แสดงแถบสี แล้วถามค่าความต้านทาน</p>
                  </button>
                </div>
              </div>
            )}

            {/* Band Selection - Show only for color reading mode and 4-band resistors */}
            {settings.answerType === 'color_reading' && settings.colorReadingMode && settings.resistorType === 'FOUR_BAND' && (
              <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl border-2 border-orange-200">
                <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
                  4. เลือกแถบ/หลักที่ต้องการฝึก
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {Array.from({ length: expectedBandsCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedBandIndex(index)}
                      className={`rounded-lg border-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
                        selectedBandIndex === index
                          ? 'border-orange-600 bg-orange-100 text-orange-900'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400'
                      }`}
                    >
                      {getBandLabel(index, settings.resistorType)}
                    </button>
                  ))}
                </div>
                
                <p className="mt-3 text-sm text-gray-600">
                  {selectedBandIndex !== null 
                    ? isDigitBand(selectedBandIndex)
                      ? `คุณเลือกฝึก: ${getBandLabel(selectedBandIndex, settings.resistorType)} (ระบบจะสุ่มเฉพาะหลักนี้ให้เลย)`
                      : `คุณเลือกฝึก: ${getBandLabel(selectedBandIndex, settings.resistorType)} - ระบบจะสุ่มเฉพาะแถบนี้`
                    : 'กรุณาเลือกแถบที่ต้องการฝึก'}
                </p>
              </div>
            )}

            {/* Option Count - Only show for Multiple Choice */}
            {settings.answerType === 'multiple_choice' && !settings.colorReadingMode && (
            <div className="mb-6 sm:mb-8">
              <label className="mb-3 block text-base sm:text-lg font-semibold text-gray-900">
                4. จำนวนตัวเลือก
              </label>
              <div className="grid gap-3 sm:gap-4 grid-cols-3">
                {[2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() => setSettings({ ...settings, optionCount: count })}
                    className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 text-center text-sm sm:text-base transition-all ${
                      settings.optionCount === count
                        ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                    }`}
                  >
                    {count} ตัวเลือก
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs sm:text-sm text-gray-600">
                ตัวเลือกมากขึ้น = ความยากมากขึ้น
              </p>
            </div>
            )}

            {/* Question Limit */}
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  {settings.answerType === 'color_reading' && settings.colorReadingMode && settings.resistorType === 'FOUR_BAND' 
                    ? '4. จำนวนคำถาม' 
                    : settings.answerType === 'color_reading' 
                      ? '3. จำนวนคำถาม' 
                      : settings.answerType === 'multiple_choice' 
                        ? '4. จำนวนคำถาม' 
                        : '3. จำนวนคำถาม'}
                </label>
                <button
                  onClick={() => setSettings({ ...settings, hasQuestionLimit: !settings.hasQuestionLimit })}
                  className={`relative h-8 w-16 rounded-full transition-colors ${
                    settings.hasQuestionLimit ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.hasQuestionLimit ? 'translate-x-8' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              {settings.hasQuestionLimit && (
                <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-4">
                    {[5, 10, 20, 50].map((count) => (
                      <button
                        key={count}
                        onClick={() => setSettings({ ...settings, questionLimit: count })}
                        className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 text-center text-sm sm:text-base transition-all ${
                          settings.questionLimit === count
                            ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                        }`}
                      >
                        {count} คำถาม
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {!settings.hasQuestionLimit && (
                <div className="rounded-lg sm:rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-3 sm:p-4 text-center">
                  <p className="text-sm sm:text-base font-semibold text-orange-700">โหมดฝึกฝนไม่จำกัด</p>
                  <p className="text-xs sm:text-sm text-orange-600">ฝึกฝนได้นานเท่าที่คุณต้องการ!</p>
                </div>
              )}
            </div>

            {/* Countdown Timer - Hide for color reading */}
            {settings.answerType !== 'color_reading' && (
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  {settings.answerType === 'multiple_choice' ? '6. ตัวจับเวลานับถอยหลัง (ไม่บังคับ)' : '5. ตัวจับเวลานับถอยหลัง (ไม่บังคับ)'}
                </label>
                <button
                  onClick={() => {
                    if (settings.hasTimeLimit) {
                      setSettings({ ...settings, hasTimeLimit: false, timeLimit: null, hasCountdown: true, countdownTime: 30 });
                    } else {
                      setSettings({ ...settings, hasCountdown: !settings.hasCountdown, countdownTime: settings.hasCountdown ? null : 30 });
                    }
                  }}
                  className={`relative h-8 w-16 rounded-full transition-colors ${
                    settings.hasCountdown ? 'bg-orange-600' : 'bg-gray-300'
                  } ${settings.hasTimeLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={settings.hasTimeLimit}
                >
                  <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.hasCountdown ? 'translate-x-8' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              {settings.hasTimeLimit && (
                <div className="mb-2 rounded-lg bg-yellow-50 border border-yellow-200 p-2">
                  <p className="text-xs sm:text-sm text-yellow-700">⚠️ ไม่สามารถใช้ตัวจับเวลานับถอยหลังและจำกัดเวลารวมพร้อมกันได้</p>
                </div>
              )}
              
              {settings.hasCountdown && (
                <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6">
                  <label className="mb-3 block text-sm sm:text-base font-semibold text-gray-900">
                    วินาทีต่อคำถาม
                  </label>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="5"
                      value={settings.countdownTime || 30}
                      onChange={(e) => setSettings({ ...settings, countdownTime: parseInt(e.target.value) })}
                      className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, rgb(249, 115, 22) 0%, rgb(249, 115, 22) ${((settings.countdownTime || 30) - 5) * 100 / 115}%, rgb(229, 231, 235) ${((settings.countdownTime || 30) - 5) * 100 / 115}%, rgb(229, 231, 235) 100%)`
                      }}
                    />
                    <div className="min-w-[80px] rounded-xl bg-white border-2 border-orange-500 px-4 py-2 text-center shadow-md">
                      <div className="text-xl sm:text-2xl font-bold text-orange-600">{settings.countdownTime}</div>
                      <div className="text-xs text-gray-500">วินาที</div>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs text-gray-600">
                    <span>5s</span>
                    <span>120s</span>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Total Time Limit - Hide for color reading */}
            {settings.answerType !== 'color_reading' && (
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                  {settings.answerType === 'multiple_choice' ? '7. จำกัดเวลารวม (ไม่บังคับ)' : '6. จำกัดเวลารวม (ไม่บังคับ)'}
                </label>
                <button
                  onClick={() => {
                    if (settings.hasCountdown) {
                      setSettings({ ...settings, hasCountdown: false, countdownTime: null, hasTimeLimit: true, timeLimit: 600 });
                    } else {
                      setSettings({ ...settings, hasTimeLimit: !settings.hasTimeLimit, timeLimit: settings.hasTimeLimit ? null : 600 });
                    }
                  }}
                  className={`relative h-8 w-16 rounded-full transition-colors ${
                    settings.hasTimeLimit ? 'bg-orange-600' : 'bg-gray-300'
                  } ${settings.hasCountdown ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={settings.hasCountdown}
                >
                  <div className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                    settings.hasTimeLimit ? 'translate-x-8' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
              
              {settings.hasCountdown && (
                <div className="mb-2 rounded-lg bg-yellow-50 border border-yellow-200 p-2">
                  <p className="text-xs sm:text-sm text-yellow-700">⚠️ ไม่สามารถใช้ตัวจับเวลานับถอยหลังและจำกัดเวลารวมพร้อมกันได้</p>
                </div>
              )}
              
              {settings.hasTimeLimit && (
                <div className="rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <div className="grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-4">
                    {[
                      { minutes: 5, seconds: 300 },
                      { minutes: 10, seconds: 600 },
                      { minutes: 20, seconds: 1200 },
                      { minutes: 30, seconds: 1800 }
                    ].map((time) => (
                      <button
                        key={time.seconds}
                        onClick={() => setSettings({ ...settings, timeLimit: time.seconds })}
                        className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 text-center text-sm sm:text-base transition-all ${
                          settings.timeLimit === time.seconds
                            ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                        }`}
                      >
                        {time.minutes} นาที
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Summary */}
            <div className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6">
              <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold text-gray-900">สรุปการฝึกฝน</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>ประเภท:</strong> ตัวต้านทาน {settings.resistorType === 'FOUR_BAND' ? '4 แถบสี' : '5 แถบสี'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>ความยาก:</strong> {settings.difficulty === 'easy' ? 'ง่าย' : settings.difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>คำตอบ:</strong> {
                    settings.answerType === 'multiple_choice' ? 'ตัวเลือก' : 
                    settings.answerType === 'fill_in' ? 'เติมคำ' :
                    settings.answerType === 'color_selection' ? 'เลือกสี' :
                    settings.answerType === 'color_reading' ? `ฝึกอ่านสี (${settings.colorReadingMode === 'value_to_color_full' ? 'ค่า→สี (เลือกทั้งหมด)' : settings.colorReadingMode === 'value_to_color_band_by_band' ? 'ค่า→สี (ทีละแถบ)' : settings.colorReadingMode === 'color_to_value' ? 'สี→ค่า' : 'สลับกัน'})` : 'ตัวเลือก'
                  }</span>
                </div>
                {settings.answerType === 'multiple_choice' && (
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>ตัวเลือก:</strong> {settings.optionCount} ตัวเลือก</span>
                </div>
                )}
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>นับถอยหลัง:</strong> {settings.hasCountdown ? `${settings.countdownTime} วินาทีต่อคำถาม` : 'ไม่มี'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>คำถาม:</strong> {settings.hasQuestionLimit ? settings.questionLimit : 'ไม่จำกัด'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span><strong>จำกัดเวลา:</strong> {settings.hasTimeLimit && settings.timeLimit ? `${settings.timeLimit / 60} นาทีรวม` : 'ไม่มี'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
              <button
                onClick={handleStartPractice}
                disabled={
                  settings.answerType === 'color_reading' && (
                    !settings.colorReadingMode || 
                    (settings.resistorType === 'FOUR_BAND' && selectedBandIndex === null)
                  )
                }
                className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {settings.answerType === 'color_reading' ? 'เริ่มฝึกอ่านสี' : 'เริ่มฝึกฝนแบบกำหนดเอง'}
              </button>
              <Link
                href="/learn/self/practice"
                className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 sm:px-8 sm:py-4 text-center text-sm sm:text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                ยกเลิก
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

