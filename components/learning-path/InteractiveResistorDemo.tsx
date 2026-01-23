'use client';

import { useState, useMemo } from 'react';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import { motion } from 'framer-motion';
import { colorCodes, formatResistance } from '@/lib/resistorUtils';

// Helper functions
function calculateResistance(bands: string[], resistorType: 'FOUR_BAND' | 'FIVE_BAND'): number {
  if (resistorType === 'FIVE_BAND') {
    if (bands.length < 5 || !bands.every(b => b)) return 0;
    const digit1 = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit] || 0;
    const digit2 = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit] || 0;
    const digit3 = colorCodes.digit[bands[2] as keyof typeof colorCodes.digit] || 0;
    const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier] || 1;
    return parseInt(`${digit1}${digit2}${digit3}`) * multiplier;
  } else {
    if (bands.length < 4 || !bands.every(b => b)) return 0;
    const digit1 = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit] || 0;
    const digit2 = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit] || 0;
    const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier] || 1;
    return parseInt(`${digit1}${digit2}`) * multiplier;
  }
}

function getTolerance(bands: string[], resistorType: 'FOUR_BAND' | 'FIVE_BAND'): string {
  if (resistorType === 'FIVE_BAND') {
    if (bands.length < 5 || !bands[4]) return '±5%';
    return colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance] || '±5%';
  } else {
    if (bands.length < 4 || !bands[3]) return '±5%';
    return colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance] || '±5%';
  }
}

interface InteractiveResistorDemoProps {
  resistorType?: 'FOUR_BAND' | 'FIVE_BAND';
}

const colorOptions = {
  digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
  multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver'],
  tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver'],
};

const getColorCode = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    black: '#000000',
    brown: '#8B4513',
    red: '#DC143C',
    orange: '#FF6600',
    yellow: '#FFD700',
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

const getAvailableColors = (index: number, is5Band: boolean): string[] => {
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

const getBandLabel = (index: number, is5Band: boolean): string => {
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

export default function InteractiveResistorDemo({ resistorType = 'FOUR_BAND' }: InteractiveResistorDemoProps) {
  const is5Band = resistorType === 'FIVE_BAND';
  const expectedBandsCount = is5Band ? 5 : 4;
  const [bands, setBands] = useState<string[]>(
    is5Band ? ['brown', 'black', 'black', 'red', 'brown'] : ['brown', 'black', 'red', 'gold']
  );
  const [currentBandIndex, setCurrentBandIndex] = useState<number>(0);

  const calculatedValue = useMemo(() => {
    if (bands.length === expectedBandsCount && bands.every(b => b)) {
      try {
        const resistance = calculateResistance(bands, resistorType);
        const tolerance = getTolerance(bands, resistorType);
        return formatResistance(resistance, tolerance);
      } catch (error) {
        return 'ไม่สามารถคำนวณได้';
      }
    }
    return 'เลือกสีให้ครบทุกแถบ';
  }, [bands, expectedBandsCount, resistorType]);

  const handleColorSelect = (color: string) => {
    const newBands = [...bands];
    newBands[currentBandIndex] = color;
    setBands(newBands);
    
    // Auto advance to next band
    if (currentBandIndex < expectedBandsCount - 1) {
      setCurrentBandIndex(currentBandIndex + 1);
    }
  };

  const handleBandClick = (index: number) => {
    setCurrentBandIndex(index);
  };

  const availableColors = getAvailableColors(currentBandIndex, is5Band);

  return (
    <div className="w-full space-y-6">
      {/* Resistor Display */}
      <div className="flex flex-col items-center space-y-4">
        <ResistorDisplay
          bands={bands}
          type={resistorType}
          highlightBand={currentBandIndex}
          partialBands={true}
        />
        
        {/* Band Labels */}
        <div className={`grid gap-2 ${is5Band ? 'grid-cols-5' : 'grid-cols-4'} w-full max-w-2xl`}>
          {Array.from({ length: expectedBandsCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleBandClick(idx)}
              className={`rounded-lg border-2 p-2 text-center transition-all ${
                currentBandIndex === idx
                  ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                  : bands[idx]
                  ? 'border-green-300 bg-green-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="text-xs font-semibold text-slate-500">
                แถบ {idx + 1}
              </div>
              <div className="text-sm font-medium text-slate-700">
                {getBandLabel(idx, is5Band)}
              </div>
              {bands[idx] && (
                <div className="mt-1 text-xs text-green-600 font-semibold">
                  {getColorName(bands[idx])}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-3">
        <div className="text-center">
          <h4 className="text-sm font-semibold text-slate-700">
            เลือกสีสำหรับ: {getBandLabel(currentBandIndex, is5Band)}
          </h4>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {availableColors.map((color) => {
            const isSelected = bands[currentBandIndex] === color;
            const colorCode = getColorCode(color);
            const isLightColor = ['yellow', 'white'].includes(color);

            return (
              <motion.button
                key={color}
                onClick={() => handleColorSelect(color)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-200'
                    : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/50'
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-lg shadow-md ${
                    isLightColor ? 'border-2 border-slate-300' : ''
                  }`}
                  style={{ backgroundColor: colorCode }}
                />
                <span className={`text-xs font-semibold ${
                  isSelected ? 'text-orange-700' : 'text-slate-600'
                }`}>
                  {getColorName(color)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Calculated Value */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-6 text-center shadow-lg"
      >
        <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          ค่าที่คำนวณได้
        </div>
        <div className="mt-2 text-3xl font-bold text-orange-700">
          {calculatedValue}
        </div>
      </motion.div>
    </div>
  );
}
