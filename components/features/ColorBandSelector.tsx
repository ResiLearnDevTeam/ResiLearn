'use client';

import { useState, useEffect } from 'react';

interface ColorBandSelectorProps {
  bands: string[];
  onBandChange: (index: number, color: string) => void;
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  disabled?: boolean;
  showLabels?: boolean;
  autoAdvance?: boolean;
}

export default function ColorBandSelector({
  bands,
  onBandChange,
  resistorType,
  disabled = false,
  showLabels = true,
  autoAdvance = true
}: ColorBandSelectorProps) {
  const [currentBandIndex, setCurrentBandIndex] = useState<number>(0);
  const is5Band = resistorType === 'FIVE_BAND';
  const expectedBandsCount = is5Band ? 5 : 4;
  
  // Reset current band index when bands change (e.g., new question)
  useEffect(() => {
    const firstEmptyIndex = bands.findIndex(b => !b);
    if (firstEmptyIndex >= 0) {
      setCurrentBandIndex(firstEmptyIndex);
    } else {
      setCurrentBandIndex(0);
    }
  }, [bands.length === 0]);

  const colorOptions = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver']
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

  const handleColorSelect = (color: string) => {
    if (disabled) return;
    onBandChange(currentBandIndex, color);
    
    // Auto-advance to next band
    if (autoAdvance && currentBandIndex < expectedBandsCount - 1) {
      setTimeout(() => {
        setCurrentBandIndex(currentBandIndex + 1);
      }, 200);
    }
  };

  const handleBandClick = (index: number) => {
    if (!disabled) {
      setCurrentBandIndex(index);
    }
  };

  const availableColors = getAvailableColors(currentBandIndex);
  const isLightColor = (color: string) => ['yellow', 'white', 'gold', 'silver'].includes(color);

  return (
    <div className="space-y-4">
      {/* Band step indicator */}
      {showLabels && (
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-xl border-2 border-orange-400 bg-orange-50 px-4 py-2">
            <span className="text-sm font-bold text-orange-800">
              {getBandLabel(currentBandIndex)}
            </span>
          </div>
          
          {/* Step dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: expectedBandsCount }).map((_, index) => {
              const hasValue = bands[index] && bands[index] !== '';
              const isCurrent = index === currentBandIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleBandClick(index)}
                  disabled={disabled}
                  className={`
                    flex flex-col items-center transition-all
                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div
                    className={`
                      w-3 h-3 rounded-full transition-all
                      ${hasValue
                        ? 'bg-green-500'
                        : isCurrent
                        ? 'bg-orange-500 ring-2 ring-orange-300'
                        : 'bg-gray-300'
                      }
                    `}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color grid */}
      <div className="grid grid-cols-5 gap-2.5">
        {availableColors.map((color) => {
          const itemColorCode = getColorCode(color);
          const isSelected = bands[currentBandIndex] === color;
          const isLight = isLightColor(color);
          return (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              disabled={disabled}
              className={`
                flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-colors
                ${isSelected
                  ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-300'
                  : 'border-gray-200 bg-white hover:border-orange-500 hover:bg-orange-50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:bg-orange-100'}
              `}
            >
              <div
                className={`w-9 h-9 rounded-lg shadow-md mb-1 ${
                  isLight ? 'border-2 border-gray-300' : 'border border-gray-200'
                }`}
                style={{ backgroundColor: itemColorCode }}
              />
              <span className={`text-xs font-semibold ${
                isSelected ? 'text-orange-700' : 'text-gray-600'
              }`}>
                {getColorName(color)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected bands preview */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {Array.from({ length: expectedBandsCount }).map((_, index) => {
          const bandColor = bands[index];
          const colorCode = bandColor ? getColorCode(bandColor) : '#E5E7EB';
          const isCurrent = index === currentBandIndex;
          const isLight = bandColor && isLightColor(bandColor);
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleBandClick(index)}
              disabled={disabled}
              className={`
                w-8 h-10 rounded transition-all
                ${isCurrent ? 'ring-2 ring-orange-500 ring-offset-1' : ''}
                ${isLight || !bandColor ? 'border border-gray-300' : ''}
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:ring-2 hover:ring-orange-300'}
              `}
              style={{ backgroundColor: colorCode }}
              title={bandColor ? getColorName(bandColor) : getBandLabel(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
