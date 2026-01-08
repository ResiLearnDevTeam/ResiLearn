'use client';

import { getBandLabel, formatResistance } from '@/lib/resistorUtils';
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
  bandValue?: string;
  resistorValue?: number;
  tolerance?: string;
}

export default function ColorReadingBandByBand({
  resistorType,
  currentBandIndex,
  selectedBands,
  correctBands,
  onBandSelect,
  disabled = false,
  showResult = false,
  isCorrect = false,
  bandValue,
  resistorValue,
  tolerance
}: ColorReadingBandByBandProps) {
  const is5Band = resistorType === 'FIVE_BAND';
  const expectedBandsCount = is5Band ? 5 : 4;
  
  const normalizedSelectedBands = [...selectedBands];
  while (normalizedSelectedBands.length < expectedBandsCount) {
    normalizedSelectedBands.push('');
  }
  
  const displayBands = Array(expectedBandsCount).fill('');
  const studentSelectedColor = normalizedSelectedBands[currentBandIndex] || '';
  displayBands[currentBandIndex] = studentSelectedColor;
  
  const colorOptions = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver']
  };
  
  const getAvailableColors = (index: number): string[] => {
    if (is5Band) {
      if (index === 0) return colorOptions.digit.filter(c => c !== 'black');
      else if (index >= 1 && index <= 2) return colorOptions.digit;
      else if (index === 3) return colorOptions.multiplier;
      else if (index === 4) return colorOptions.tolerance;
    } else {
      if (index === 0) return colorOptions.digit.filter(c => c !== 'black');
      else if (index === 1) return colorOptions.digit;
      else if (index === 2) return colorOptions.multiplier;
      else if (index === 3) return colorOptions.tolerance;
    }
    return [];
  };
  
  const getColorCode = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      black: '#1a1a1a',
      brown: '#8B4513',
      red: '#DC143C',
      orange: '#FF6600',
      yellow: '#FFD700',
      green: '#228B22',
      blue: '#0066CC',
      violet: '#8B00FF',
      gray: '#808080',
      white: '#F5F5F5',
      gold: '#DAA520',
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
  
  const displayValue = resistorValue && tolerance 
    ? formatResistance(resistorValue, tolerance)
    : bandValue || '-';
  
  const bandLabel = getBandLabel(currentBandIndex, resistorType);
  
  return (
    <div className="space-y-6">
      {/* Top Section: Resistor Info */}
      <div className="flex flex-col items-center pb-4 border-b border-gray-100">
        {/* Resistance Value - Large and prominent */}
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-8 py-4 shadow-lg">
          <p className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {displayValue}
          </p>
        </div>
        
        {/* Resistor Display */}
        <div className="w-full max-w-lg mb-4">
          <ResistorDisplay
            bands={showResult ? (isCorrect ? displayBands : correctBands) : displayBands}
            type={resistorType}
            highlightBand={currentBandIndex}
            partialBands={!showResult}
          />
        </div>
        
        {/* Band Label + Progress */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl border-2 border-orange-400 bg-orange-50 px-4 py-2">
            <span className="text-sm lg:text-base font-bold text-orange-800">
              {bandLabel}
            </span>
          </div>
          
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: expectedBandsCount }).map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full transition-all ${
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
      </div>

      {/* Result Section - Enhanced */}
      {showResult && (
        <div className="py-6">
          {isCorrect ? (
            // Correct Answer Display
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-4 animate-bounce">
                <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-green-600 mb-2">ถูกต้อง!</h3>
              <div className="flex items-center gap-3 px-6 py-3 bg-green-50 rounded-xl border-2 border-green-200">
                <div
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg shadow-md border-2 border-green-300"
                  style={{ backgroundColor: getColorCode(selectedColor) }}
                />
                <span className="text-lg lg:text-xl font-bold text-green-700">
                  {getColorName(selectedColor)}
                </span>
              </div>
            </div>
          ) : (
            // Wrong Answer Display
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg mb-4">
                <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-red-600 mb-4">ไม่ถูกต้อง</h3>
              
              {/* Comparison: Your answer vs Correct answer */}
              <div className="flex items-center gap-4 lg:gap-6">
                {/* Your Answer */}
                <div className="flex flex-col items-center">
                  <span className="text-xs lg:text-sm font-semibold text-gray-500 mb-2">คุณตอบ</span>
                  <div className="p-3 bg-red-50 rounded-xl border-2 border-red-200">
                    <div
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg shadow-md border-2 border-red-300 mb-2"
                      style={{ backgroundColor: getColorCode(selectedColor) }}
                    />
                    <span className="block text-center text-sm lg:text-base font-bold text-red-700">
                      {getColorName(selectedColor)}
                    </span>
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                
                {/* Correct Answer */}
                <div className="flex flex-col items-center">
                  <span className="text-xs lg:text-sm font-semibold text-gray-500 mb-2">คำตอบที่ถูก</span>
                  <div className="p-3 bg-green-50 rounded-xl border-2 border-green-300">
                    <div
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg shadow-md border-2 border-green-400 mb-2"
                      style={{ backgroundColor: getColorCode(correctColor) }}
                    />
                    <span className="block text-center text-sm lg:text-base font-bold text-green-700">
                      {getColorName(correctColor)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Section: Color Options */}
      {!showResult && (
        <div className="pt-2">
          <p className="text-center text-sm font-semibold text-gray-500 mb-4">
            เลือกสีที่ถูกต้อง
          </p>
          <div className="grid grid-cols-5 gap-3 lg:gap-4 max-w-2xl mx-auto">
            {availableColors.map((color) => {
              const itemColorCode = getColorCode(color);
              const isSelected = selectedColor === color;
              const isLightColor = ['yellow', 'white', 'gold', 'silver'].includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => onBandSelect(color)}
                  disabled={disabled}
                  className={`
                    relative flex flex-col items-center justify-center p-3 lg:p-4 rounded-xl border-2 transition-all
                    ${isSelected
                      ? 'border-orange-500 bg-orange-50 shadow-lg scale-105 ring-2 ring-orange-300'
                      : 'border-gray-200 bg-white hover:border-orange-400 hover:shadow-md hover:scale-[1.02]'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                  `}
                >
                  <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-lg shadow-md mb-2 ${
                      isLightColor ? 'border-2 border-gray-300' : 'border border-gray-200'
                    }`}
                    style={{ backgroundColor: itemColorCode }}
                  />
                  <span className={`text-xs lg:text-sm font-semibold ${
                    isSelected ? 'text-orange-700' : 'text-gray-600'
                  }`}>
                    {getColorName(color)}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
