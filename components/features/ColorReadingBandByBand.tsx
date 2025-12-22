'use client';

import { getBandLabel } from '@/lib/resistorUtils';

interface ColorReadingBandByBandProps {
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  currentBandIndex: number;
  selectedBands: string[];
  correctBands: string[];
  onBandSelect: (color: string) => void;
  onCheckAnswer?: () => void;
  disabled?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
  hasSelectedColor?: boolean;
  /** ค่าของแถบ/หลักที่ต้องตอบ เช่น "4", "×10K", "±5%" */
  bandValue?: string;
}

export default function ColorReadingBandByBand({
  resistorType,
  currentBandIndex,
  selectedBands,
  correctBands,
  onBandSelect,
  onCheckAnswer,
  disabled = false,
  showResult = false,
  isCorrect = false,
  hasSelectedColor = false,
  bandValue
}: ColorReadingBandByBandProps) {
  const is5Band = resistorType === 'FIVE_BAND';
  const expectedBandsCount = is5Band ? 5 : 4;
  
  // Ensure selectedBands array has correct length
  const displayBands = [...selectedBands];
  while (displayBands.length < expectedBandsCount) {
    displayBands.push('');
  }
  
  const colorOptions = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver']
  };
  
  const getAvailableColors = (index: number): string[] => {
    if (is5Band) {
      if (index === 0) {
        return colorOptions.digit.filter(c => c !== 'black');
      } else if (index >= 1 && index <= 2) {
        return colorOptions.digit;
      } else if (index === 3) {
        return colorOptions.multiplier;
      } else if (index === 4) {
        return colorOptions.tolerance;
      }
    } else {
      if (index === 0) {
        return colorOptions.digit.filter(c => c !== 'black');
      } else if (index === 1) {
        return colorOptions.digit;
      } else if (index === 2) {
        return colorOptions.multiplier;
      } else if (index === 3) {
        return colorOptions.tolerance;
      }
    }
    return [];
  };
  
  const getColorCode = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      black: '#000000',
      brown: '#8B4513',
      red: '#DC143C',
      orange: '#FF6600',
      yellow: '#FFFF00',
      green: '#008000',
      blue: '#0000FF',
      violet: '#8B00FF',
      gray: '#808080',
      white: '#FFFFFF',
      gold: '#FFD700',
      silver: '#C0C0C0',
    };
    return colorMap[color.toLowerCase()] || '#CCCCCC';
  };
  
  const getColorName = (color: string): string => {
    const nameMap: { [key: string]: string } = {
      black: 'ดำ',
      brown: 'น้ำตาล',
      red: 'แดง',
      orange: 'ส้ม',
      yellow: 'เหลือง',
      green: 'เขียว',
      blue: 'น้ำเงิน',
      violet: 'ม่วง',
      gray: 'เทา',
      white: 'ขาว',
      gold: 'ทอง',
      silver: 'เงิน',
    };
    return nameMap[color.toLowerCase()] || color;
  };
  
  const availableColors = getAvailableColors(currentBandIndex);
  const selectedColor = displayBands[currentBandIndex] || '';
  const correctColor = correctBands[currentBandIndex] || '';
  
  return (
    <div className="space-y-4">
      {/* Split layout: ซ้าย = ตัวต้านทาน, ขวา = สีของหลักนั้น + ตัวเลือก */}
      <div className="grid gap-6 md:grid-cols-2 items-center">
        {/* Left: แสดงค่าที่ต้องตอบตามหลัก (แทนตัวต้านทาน) + label + progress */}
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* ค่า R / ค่าของหลักที่ต้องตอบ */}
          <div className="flex justify-center">
            <div className="inline-block rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 px-6 py-3 border-2 border-orange-300">
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-orange-700 tracking-tight">
                {bandValue ?? '-'}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              {getBandLabel(currentBandIndex, resistorType)} (ให้ค่า → เลือกสี)
        </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              เลือกสีที่ตรงกับค่าของหลักนี้จากตัวเลือกด้านขวา
            </p>
        {showResult && (
              <div
                className={`mt-2 inline-block px-4 py-2 rounded-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
            {isCorrect ? '✓ ถูกต้อง!' : `✗ ไม่ถูกต้อง (คำตอบที่ถูก: ${getColorName(correctColor)})`}
          </div>
        )}
      </div>
      
          {/* Progress Indicator (ด้านล่างซ้าย) */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: expectedBandsCount }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < currentBandIndex
                    ? 'bg-green-500'
                    : index === currentBandIndex
                    ? 'bg-orange-500 ring-2 ring-orange-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: ตัวเลือกสี + ข้อความค่าของสี */}
        <div className="space-y-3">
          {!showResult && (
            <>
              <p className="text-center text-sm font-semibold text-gray-700 mb-1">
            เลือกสีที่ถูกต้อง:
          </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
            {availableColors.map((color) => {
              const itemColorCode = getColorCode(color);
              const isSelected = selectedColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => !disabled && onBandSelect(color)}
                  disabled={disabled}
                  className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all
                    ${isSelected
                          ? 'border-orange-600 bg-orange-100 shadow-md scale-[1.02]'
                      : 'border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div
                        className="w-10 h-10 rounded-md border border-gray-400 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: itemColorCode }}
                  />
                      <div className="flex flex-col items-start">
                        <span className={`text-sm font-semibold ${
                          isSelected ? 'text-orange-900' : 'text-gray-800'
                  }`}>
                    {getColorName(color)}
                  </span>
                      </div>
                  {isSelected && (
                        <svg className="ml-auto w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Check Answer Button */}
          {hasSelectedColor && onCheckAnswer && (
                <div className="mt-3">
              <button
                type="button"
                onClick={onCheckAnswer}
                disabled={disabled}
                className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-base font-bold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ตรวจคำตอบ
              </button>
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

