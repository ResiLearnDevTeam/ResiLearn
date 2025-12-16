'use client';

import ResistorDisplay from './ResistorDisplay';
import { getBandLabel } from '@/lib/resistorUtils';

interface ColorReadingBandByBandProps {
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  currentBandIndex: number;
  selectedBands: string[];
  correctBands: string[];
  onBandSelect: (color: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
}

export default function ColorReadingBandByBand({
  resistorType,
  currentBandIndex,
  selectedBands,
  correctBands,
  onBandSelect,
  disabled = false,
  showResult = false,
  isCorrect = false
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
      {/* Resistor Display */}
      <div className="flex justify-center">
        <ResistorDisplay
          bands={displayBands}
          type={resistorType}
          highlightBand={currentBandIndex}
          partialBands={true}
        />
      </div>
      
      {/* Current Band Label */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {getBandLabel(currentBandIndex, resistorType)}
        </h3>
        {showResult && (
          <div className={`inline-block px-4 py-2 rounded-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✓ ถูกต้อง!' : `✗ ไม่ถูกต้อง (คำตอบที่ถูก: ${getColorName(correctColor)})`}
          </div>
        )}
      </div>
      
      {/* Color Selector - Buttons */}
      {!showResult && (
        <div className="space-y-3">
          <p className="text-center text-sm font-semibold text-gray-700 mb-3">
            เลือกสีที่ถูกต้อง:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                    flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
                    ${isSelected
                      ? 'border-orange-600 bg-orange-100 shadow-md scale-105'
                      : 'border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-400 shadow-sm"
                    style={{ backgroundColor: itemColorCode }}
                  />
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-orange-900' : 'text-gray-700'
                  }`}>
                    {getColorName(color)}
                  </span>
                  {isSelected && (
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Progress Indicator */}
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
  );
}

