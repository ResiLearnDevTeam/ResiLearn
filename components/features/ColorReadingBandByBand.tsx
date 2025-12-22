'use client';

import { getBandLabel, colorCodes, formatResistance } from '@/lib/resistorUtils';
import ResistorDisplay from './ResistorDisplay';

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
  /** ค่าความต้านทานจริง */
  resistorValue?: number;
  /** ค่าความคลาดเคลื่อน */
  tolerance?: string;
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
  bandValue,
  resistorValue,
  tolerance
}: ColorReadingBandByBandProps) {
  const is5Band = resistorType === 'FIVE_BAND';
  const expectedBandsCount = is5Band ? 5 : 4;
  
  // Ensure selectedBands array has correct length
  const normalizedSelectedBands = [...selectedBands];
  while (normalizedSelectedBands.length < expectedBandsCount) {
    normalizedSelectedBands.push('');
  }
  
  // Only show the current band being asked, others should be empty
  // Always show the selected color for the current band (even when showing result)
  // The selectedBands should already have the correct value at currentBandIndex from parent
  // Create displayBands array with only the highlighted band showing the selected color
  const displayBands = Array(expectedBandsCount).fill('');
  // Get the color from selectedBands at currentBandIndex - this is what the student selected
  // Make sure to use the value from selectedBands, not from correctBands
  // Always show the selected color in the highlighted band position
  const studentSelectedColor = normalizedSelectedBands[currentBandIndex] || '';
  // Set the color at the currentBandIndex position (which matches highlightBand)
  displayBands[currentBandIndex] = studentSelectedColor;
  
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
  
  // Get the actual resistor value to display
  const displayValue = resistorValue && tolerance 
    ? formatResistance(resistorValue, tolerance)
    : bandValue || '-';
  
  // Get band label with highlight
  const bandLabel = getBandLabel(currentBandIndex, resistorType);
  
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Split layout: ซ้าย = ตัวต้านทาน, ขวา = สีของหลักนั้น + ตัวเลือก */}
      <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 items-start">
        {/* Left: แสดงตัวต้านทาน + label + progress */}
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-5 md:space-y-6">
          {/* ค่าความต้านทานจริง */}
          <div className="flex justify-center w-full">
            <div className="inline-block rounded-lg sm:rounded-xl bg-gradient-to-r from-orange-100 to-orange-50 px-5 sm:px-6 md:px-8 py-3 sm:py-4 border-2 border-orange-300 shadow-md">
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-orange-700 tracking-tight">
                {displayValue}
              </p>
            </div>
          </div>
          
          {/* Resistor Display */}
          <div className="w-full px-1 sm:px-2 md:px-4">
            <ResistorDisplay
              bands={displayBands}
              type={resistorType}
              highlightBand={currentBandIndex}
              partialBands={true}
            />
          </div>
          
          <div className="text-center w-full space-y-2 sm:space-y-3">
            {/* Band Label with border highlight */}
            <div className="inline-block rounded-lg sm:rounded-xl border-2 border-orange-500 bg-orange-50 px-4 sm:px-5 md:px-6 py-2 sm:py-3 shadow-md">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-orange-900">
                {bandLabel}
              </h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2 sm:px-4">
              เลือกสีที่ตรงกับค่าของหลักนี้จากตัวเลือกด้านขวา
            </p>
        {showResult && (
              <div
                className={`mt-3 sm:mt-4 inline-block px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
            {isCorrect ? '✓ ถูกต้อง!' : `✗ ไม่ถูกต้อง (คำตอบที่ถูก: ${getColorName(correctColor)})`}
          </div>
        )}
      </div>
      
          {/* Progress Indicator (ด้านล่างซ้าย) */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            {Array.from({ length: expectedBandsCount }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full transition-all ${
                  index < currentBandIndex
                    ? 'bg-green-500'
                    : index === currentBandIndex
                    ? 'bg-orange-500 ring-2 sm:ring-3 ring-orange-300 scale-105 sm:scale-110'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: ตัวเลือกสี + ข้อความค่าของสี */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {!showResult && (
            <>
              <p className="text-center text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-3 sm:mb-4 md:mb-5">
            เลือกสีที่ถูกต้อง:
          </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
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
                        flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl border-2 transition-all
                    ${isSelected
                          ? 'border-orange-600 bg-orange-100 shadow-md sm:shadow-lg scale-[1.02] sm:scale-[1.03]'
                      : 'border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50 hover:shadow-md'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md sm:rounded-lg border-2 border-gray-400 shadow-sm sm:shadow-md flex-shrink-0"
                    style={{ backgroundColor: itemColorCode }}
                  />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className={`text-sm sm:text-base md:text-lg font-semibold sm:font-bold truncate w-full ${
                          isSelected ? 'text-orange-900' : 'text-gray-800'
                  }`}>
                    {getColorName(color)}
                  </span>
                      </div>
                  {isSelected && (
                        <svg className="ml-auto w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
          
            </>
          )}
        </div>
      </div>
    </div>
  );
}

