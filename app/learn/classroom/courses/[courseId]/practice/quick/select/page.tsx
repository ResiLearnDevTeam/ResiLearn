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

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const expectedBandsCount = selectedType === 'FIVE_BAND' ? 5 : 4;

  const isDigitBand = (bandIndex: number): boolean => {
    if (selectedType === 'FIVE_BAND') {
      return bandIndex <= 2;
    } else {
      return bandIndex <= 1;
    }
  };

  useEffect(() => {
    setSelectedBandIndex(null);
  }, [selectedType]);

  const handleStartPractice = () => {
    if (practiceMode === 'color_reading') {
      if (!colorReadingMode) return;
      
      const modeMap: { [key: string]: string } = {
        'value_to_color_full': 'value-to-color-full',
        'value_to_color_band_by_band': 'value-to-color-band-by-band',
        'color_to_value': 'color-to-value',
        'mixed': 'mixed'
      };
      
      let url = `/learn/classroom/courses/${courseId}/practice/color-reading/${modeMap[colorReadingMode]}?type=${selectedType}`;
      
      if (selectedBandIndex !== null && colorReadingMode !== 'mixed') {
        url += `&bandIndex=${selectedBandIndex}`;
      }
      
      router.push(url);
    } else {
      router.push(`/learn/classroom/courses/${courseId}/practice/quick?type=${selectedType}&answerType=${answerType}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <ClassroomSidebar courseId={courseId} />

      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 lg:px-8">
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
                className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${
                  practiceMode === 'standard'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">โหมดมาตรฐาน</h3>
                <p className="text-sm text-gray-600">ดูแถบสีและตอบค่าความต้านทาน</p>
              </button>
              <button
                onClick={() => {
                  setPracticeMode('color_reading');
                  setColorReadingMode('color_to_value');
                }}
                className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${
                  practiceMode === 'color_reading'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">โหมดอ่านสี</h3>
                <p className="text-sm text-gray-600">ฝึกฝนการอ่านและเลือกแถบสี</p>
              </button>
            </div>

            {practiceMode === 'standard' && (
              <>
                <label className="mb-4 block text-base sm:text-lg font-semibold text-gray-900">
                  เลือกประเภทตัวต้านทาน
                </label>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-6">
                  <button
                    onClick={() => setSelectedType('FOUR_BAND')}
                    className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${
                      selectedType === 'FOUR_BAND'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">4 แถบสี</h3>
                  </button>
                  <button
                    onClick={() => setSelectedType('FIVE_BAND')}
                    className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${
                      selectedType === 'FIVE_BAND'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">5 แถบสี</h3>
                  </button>
                </div>

                <label className="mb-4 block text-base sm:text-lg font-semibold text-gray-900">
                  เลือกประเภทคำตอบ
                </label>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-3 mb-6">
                  <button
                    onClick={() => setAnswerType('multiple_choice')}
                    className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${
                      answerType === 'multiple_choice'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">ตัวเลือก</h3>
                  </button>
                  <button
                    onClick={() => setAnswerType('fill_in')}
                    className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${
                      answerType === 'fill_in'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">เติมคำ</h3>
                  </button>
                  <button
                    onClick={() => setAnswerType('color_selection')}
                    className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${
                      answerType === 'color_selection'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">เลือกสี</h3>
                  </button>
                </div>
              </>
            )}

            {practiceMode === 'color_reading' && colorReadingMode && (
              <div className="mb-6">
                <label className="mb-4 block text-base sm:text-lg font-semibold text-gray-900">
                  เลือกโหมดอ่านสี
                </label>
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  {[
                    { value: 'color_to_value', label: 'สี → ค่า', desc: 'ดูแถบสีและตอบค่าความต้านทาน' },
                    { value: 'value_to_color_full', label: 'ค่า → สี (เต็ม)', desc: 'ดูค่าและเลือกแถบสีทั้งหมด' },
                    { value: 'value_to_color_band_by_band', label: 'ค่า → สี (ทีละแถบ)', desc: 'ดูค่าและเลือกแถบสีทีละแถบ' },
                    { value: 'mixed', label: 'แบบผสม', desc: 'โหมดผสมทั้งสองแบบ' },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setColorReadingMode(mode.value)}
                      className={`rounded-xl p-4 sm:p-6 border-2 transition-all text-left ${
                        colorReadingMode === mode.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{mode.label}</h3>
                      <p className="text-sm text-gray-600">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleStartPractice}
              disabled={practiceMode === 'color_reading' && !colorReadingMode}
              className="w-full rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base font-semibold text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              เริ่มฝึกฝน
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

