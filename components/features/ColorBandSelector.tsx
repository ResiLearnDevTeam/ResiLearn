'use client';

import { useState } from 'react';

interface ColorBandSelectorProps {
  bands: string[];
  onBandChange: (index: number, color: string) => void;
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  disabled?: boolean;
  showLabels?: boolean;
}

export default function ColorBandSelector({
  bands,
  onBandChange,
  resistorType,
  disabled = false,
  showLabels = true
}: ColorBandSelectorProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const is5Band = resistorType === 'FIVE_BAND';
  
  const colorOptions = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver']
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

  const getBandLabel = (index: number): string => {
    if (is5Band) {
      if (index === 0) return 'หลักที่ 1';
      if (index === 1) return 'หลักที่ 2';
      if (index === 2) return 'หลักที่ 3';
      if (index === 3) return 'ตัวคูณ';
      if (index === 4) return 'ความคลาดเคลื่อน';
    } else {
      if (index === 0) return 'หลักที่ 1';
      if (index === 1) return 'หลักที่ 2';
      if (index === 2) return 'ตัวคูณ';
      if (index === 3) return 'ความคลาดเคลื่อน';
    }
    return '';
  };

  const getAvailableColors = (index: number): string[] => {
    if (is5Band) {
      if (index === 0) {
        // First digit cannot be black
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
        // First digit cannot be black
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

  const handleSelectColor = (index: number, color: string) => {
    onBandChange(index, color);
    setOpenDropdown(null);
  };

  return (
    <div className="space-y-2.5">
      {bands.map((band, index) => {
        const availableColors = getAvailableColors(index);
        const isOpen = openDropdown === index;
        const selectedColor = band || '';
        const colorCode = getColorCode(selectedColor);
        
        return (
          <div key={index} className="relative">
            {showLabels && (
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {getBandLabel(index)}
              </label>
            )}
            <button
              type="button"
              onClick={() => !disabled && setOpenDropdown(isOpen ? null : index)}
              disabled={disabled}
              className={`
                w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border-2 transition-all
                ${selectedColor
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 bg-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-orange-400'}
              `}
            >
              <div className="flex items-center gap-2.5 flex-1">
                <div
                  className="w-10 h-10 rounded border-2 border-gray-400 flex-shrink-0"
                  style={{ backgroundColor: colorCode }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {selectedColor ? getColorName(selectedColor) : 'เลือกสี...'}
                </span>
              </div>
              <svg 
                className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && !disabled && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setOpenDropdown(null)}
                />
                <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {availableColors.map((color) => {
                    const itemColorCode = getColorCode(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleSelectColor(index, color)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div
                          className="w-10 h-10 rounded border-2 border-gray-400 flex-shrink-0"
                          style={{ backgroundColor: itemColorCode }}
                        />
                        <span className="text-sm font-medium text-gray-700 flex-1 text-left">
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
        );
      })}
    </div>
  );
}

