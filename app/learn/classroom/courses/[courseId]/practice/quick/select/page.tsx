'use client';

import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBandLabel } from '@/lib/resistorUtils';

export default function ClassroomSelectResistorTypePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const [selectedType, setSelectedType] = useState<'FOUR_BAND' | 'FIVE_BAND'>('FOUR_BAND');
  const [answerType, setAnswerType] = useState<'multiple_choice' | 'fill_in' | 'color_selection'>('multiple_choice');
  const [practiceMode, setPracticeMode] = useState<'standard' | 'color_reading'>('standard');
  const [colorReadingMode, setColorReadingMode] = useState<string | null>(null);
  const [selectedBandIndex, setSelectedBandIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const expectedBandsCount = selectedType === 'FIVE_BAND' ? 5 : 4;

  // Check if selected band is a digit band
  const isDigitBand = (bandIndex: number): boolean => {
    if (selectedType === 'FIVE_BAND') {
      return bandIndex <= 2; // Bands 0, 1, 2 are digit bands
    } else {
      return bandIndex <= 1; // Bands 0, 1 are digit bands
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
    if (practiceMode === 'color_reading') {
      // Redirect to color reading page
      if (!colorReadingMode) return;
      
      const modeMap: { [key: string]: string } = {
        'value_to_color_full': 'value-to-color-full',
        'value_to_color_band_by_band': 'value-to-color-band-by-band',
        'color_to_value': 'color-to-value',
        'mixed': 'mixed'
      };
      
      let url = `/learn/classroom/courses/${courseId}/practice/color-reading/${modeMap[colorReadingMode]}?type=${selectedType}`;
      
      // Add bandIndex if selected (only for non-mixed modes)
      if (selectedBandIndex !== null && colorReadingMode !== 'mixed') {
        url += `&bandIndex=${selectedBandIndex}`;
      }
      
      router.push(url);
    } else {
      // Standard practice mode
      router.push(`/learn/classroom/courses/${courseId}/practice/quick?type=${selectedType}&answerType=${answerType}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Left Sidebar */}
      <ClassroomSidebar courseId={courseId} />

      {/* Main Content */}
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link href={`/learn/classroom/courses/${courseId}/practice`} className="text-blue-600 hover:text-blue-700 mb-3 sm:mb-4 inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              กลับไปโหมดฝึกฝน
            </Link>
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">ฝึกด่วน</h1>
            <p className="text-sm sm:text-base text-gray-600">
              เลือกประเภทตัวต้านทานที่คุณต้องการฝึกฝน
            </p>
          </div>

          {/* Practice Mode Selection */}
          <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl">
            <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
              เลือกโหมดการฝึก
            </label>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6">
              <button
                onClick={() => {
                  setPracticeMode('standard');
                  setColorReadingMode(null);
                }}
                className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                  practiceMode === 'standard'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    practiceMode === 'standard' ? 'bg-blue-600' : 'bg-gray-100'
                  }`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">ฝึกแบบปกติ</h3>
                </div>
                <p className="text-sm text-gray-600">
                  ฝึกอ่านค่าความต้านทานจากแถบสี หรือเลือกแถบสีจากค่าความต้านทาน
                </p>
              </button>

              <button
                onClick={() => setPracticeMode('color_reading')}
                className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                  practiceMode === 'color_reading'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    practiceMode === 'color_reading' ? 'bg-blue-600' : 'bg-gray-100'
                  }`}>
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">ฝึกอ่านสี</h3>
                </div>
                <p className="text-sm text-gray-600">
                  ฝึกอ่านสีแบบครบวงจร ทั้งค่า→สี และ สี→ค่า พร้อมโหมดทีละแถบ
                </p>
              </button>
            </div>
          </div>

          {/* Resistor Type Selection */}
          <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl">
            <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
              เลือกประเภทตัวต้านทาน
            </label>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <button
                onClick={() => setSelectedType('FOUR_BAND')}
                className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                  selectedType === 'FOUR_BAND'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    selectedType === 'FOUR_BAND' ? 'bg-blue-600' : 'bg-gray-100'
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
                onClick={() => setSelectedType('FIVE_BAND')}
                className={`rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 text-left transition-all ${
                  selectedType === 'FIVE_BAND'
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    selectedType === 'FIVE_BAND' ? 'bg-blue-600' : 'bg-gray-100'
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

            {/* Color Reading Mode Selection - Only show if color_reading mode is selected */}
            {practiceMode === 'color_reading' && (
              <>
                <div className="mb-6 sm:mb-8">
                  <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
                    เลือกโหมดการฝึกอ่านสี
                  </label>
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    {/* Value to Color - Full */}
                    <button
                      onClick={() => setColorReadingMode('value_to_color_full')}
                      className={`rounded-xl border-2 p-6 text-left transition-all ${
                        colorReadingMode === 'value_to_color_full'
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full border-2 ${
                          colorReadingMode === 'value_to_color_full' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}></div>
                        <h3 className="text-lg font-bold text-gray-900">ค่า → สี (เลือกทั้งหมด)</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        แสดงค่า แล้วเลือกสีทั้งหมด
                      </p>
                    </button>

                    {/* Value to Color - Band by Band */}
                    <button
                      onClick={() => setColorReadingMode('value_to_color_band_by_band')}
                      className={`rounded-xl border-2 p-6 text-left transition-all ${
                        colorReadingMode === 'value_to_color_band_by_band'
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full border-2 ${
                          colorReadingMode === 'value_to_color_band_by_band' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}></div>
                        <h3 className="text-lg font-bold text-gray-900">ค่า → สี (ทีละแถบ)</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        แสดงค่าความต้านทาน แล้วถามทีละแถบสีตามลำดับ
                      </p>
                    </button>

                    {/* Color to Value */}
                    <button
                      onClick={() => setColorReadingMode('color_to_value')}
                      className={`rounded-xl border-2 p-6 text-left transition-all ${
                        colorReadingMode === 'color_to_value'
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full border-2 ${
                          colorReadingMode === 'color_to_value' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}></div>
                        <h3 className="text-lg font-bold text-gray-900">สี → ค่า</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        แสดงแถบสี แล้วถามค่าความต้านทาน
                      </p>
                    </button>

                    {/* Mixed */}
                    <button
                      onClick={() => setColorReadingMode('mixed')}
                      className={`rounded-xl border-2 p-6 text-left transition-all ${
                        colorReadingMode === 'mixed'
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full border-2 ${
                          colorReadingMode === 'mixed' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                        }`}></div>
                        <h3 className="text-lg font-bold text-gray-900">สลับกัน</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        สุ่มสลับระหว่างค่า→สี และ สี→ค่า
                      </p>
                    </button>
                  </div>
                </div>

                {/* Band Selection - Show when color reading mode is selected (but not for mixed mode) */}
                {colorReadingMode && colorReadingMode !== 'mixed' && (
                  <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-xl border-2 border-blue-200">
                    <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
                      3. เลือกแถบที่ต้องการฝึก
                    </label>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {Array.from({ length: expectedBandsCount }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedBandIndex(index)}
                          className={`rounded-lg border-2 px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
                            selectedBandIndex === index
                              ? 'border-blue-600 bg-blue-100 text-blue-900'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                          }`}
                        >
                          {getBandLabel(index, selectedType)}
                        </button>
                      ))}
                    </div>
                    
                    <p className="mt-3 text-sm text-gray-600">
                      {selectedBandIndex !== null 
                        ? isDigitBand(selectedBandIndex)
                          ? `คุณเลือกฝึก: ${getBandLabel(selectedBandIndex, selectedType)} (ระบบจะสุ่มเฉพาะหลักนี้ให้เลย)`
                          : `คุณเลือกฝึก: ${getBandLabel(selectedBandIndex, selectedType)} - ระบบจะสุ่มเฉพาะแถบนี้`
                        : 'กรุณาเลือกแถบที่ต้องการฝึก'}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Answer Type Selection - Only show if standard mode is selected */}
            {practiceMode === 'standard' && (
              <div className="mb-6 sm:mb-8">
                <label className="mb-4 sm:mb-6 block text-base sm:text-lg font-semibold text-gray-900">
                  ประเภทคำตอบ
                </label>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                <button
                  onClick={() => setAnswerType('multiple_choice')}
                  className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 text-left transition-all ${
                    answerType === 'multiple_choice'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      answerType === 'multiple_choice' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">ตัวเลือก</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    เลือกจากตัวเลือกที่ให้มา
                  </p>
                </button>

                <button
                  onClick={() => setAnswerType('fill_in')}
                  className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 text-left transition-all ${
                    answerType === 'fill_in'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      answerType === 'fill_in' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">เติมคำ</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    พิมพ์คำตอบของคุณโดยตรง
                  </p>
                </button>

                <button
                  onClick={() => setAnswerType('color_selection')}
                  className={`rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 text-left transition-all ${
                    answerType === 'color_selection'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full border-2 ${
                      answerType === 'color_selection' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}></div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">เลือกสี</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    กำหนดค่าความต้านทานให้ แล้วเลือกแถบสี
                  </p>
                </button>
              </div>
            </div>
            )}

            {/* Start Button */}
            <div className="mt-6 sm:mt-8 flex gap-3 sm:gap-4">
              <button
                onClick={handleStartPractice}
                disabled={
                  practiceMode === 'color_reading' && (
                    !colorReadingMode || 
                    (colorReadingMode !== 'mixed' && selectedBandIndex === null)
                  )
                }
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                เริ่มฝึกฝน
              </button>
              <Link
                href={`/learn/classroom/courses/${courseId}/practice`}
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
