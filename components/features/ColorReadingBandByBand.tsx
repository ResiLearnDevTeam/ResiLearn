'use client';

import { useState } from 'react';
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
  const [openDropdown, setOpenDropdown] = useState(false);
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
      
      {/* Color Selector */}
      {!showResult && (
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setOpenDropdown(!openDropdown)}
            disabled={disabled}
            className={`
              w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border-2 transition-all
              ${selectedColor
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 bg-white'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-orange-400'}
            `}
          >
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-12 h-12 rounded border-2 border-gray-400 flex-shrink-0"
                style={{ backgroundColor: selectedColor ? getColorCode(selectedColor) : '#CCCCCC' }}
              />
              <span className="text-base font-medium text-gray-700">
                {selectedColor ? getColorName(selectedColor) : 'เลือกสี...'}
              </span>
            </div>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${openDropdown ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {openDropdown && !disabled && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setOpenDropdown(false)}
              />
              <div className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {availableColors.map((color) => {
                  const itemColorCode = getColorCode(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        onBandSelect(color);
                        setOpenDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div
                        className="w-12 h-12 rounded border-2 border-gray-400 flex-shrink-0"
                        style={{ backgroundColor: itemColorCode }}
                      />
                      <span className="text-base font-medium text-gray-700 flex-1 text-left">
                        {getColorName(color)}
                      </span>
                      {selectedColor === color && (
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

