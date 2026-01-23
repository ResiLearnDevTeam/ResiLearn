'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colorCodes } from '@/lib/resistorUtils';

interface ColorValuePickerProps {
  mode?: 'digit' | 'multiplier' | 'tolerance' | 'all';
}

const allColors = {
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

export default function ColorValuePicker({ mode = 'all' }: ColorValuePickerProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'digit' | 'multiplier' | 'tolerance'>('digit');

  const getValue = (color: string, type: 'digit' | 'multiplier' | 'tolerance'): string => {
    if (type === 'digit') {
      const value = colorCodes.digit[color as keyof typeof colorCodes.digit];
      return value !== undefined ? value.toString() : '-';
    } else if (type === 'multiplier') {
      const value = colorCodes.multiplier[color as keyof typeof colorCodes.multiplier];
      if (value === undefined) return '-';
      if (value >= 1000000) return `${value / 1000000} MΩ`;
      if (value >= 1000) return `${value / 1000} kΩ`;
      if (value < 1) return `${value} (ตัวหาร)`;
      return `${value} Ω`;
    } else {
      return colorCodes.tolerance[color as keyof typeof colorCodes.tolerance] || '-';
    }
  };

  const getColors = (): string[] => {
    if (mode === 'all') {
      return activeTab === 'digit' 
        ? allColors.digit 
        : activeTab === 'multiplier' 
        ? allColors.multiplier 
        : allColors.tolerance;
    }
    return mode === 'digit' ? allColors.digit : mode === 'multiplier' ? allColors.multiplier : allColors.tolerance;
  };

  const colors = getColors();
  const currentType = mode === 'all' ? activeTab : mode;

  return (
    <div className="w-full space-y-4">
      {/* Tabs (only show if mode is 'all') */}
      {mode === 'all' && (
        <div className="flex gap-2 border-b border-slate-200">
          {(['digit', 'multiplier', 'tolerance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedColor(null);
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-orange-500 text-orange-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'digit' ? 'ตัวเลข' : tab === 'multiplier' ? 'ตัวคูณ' : 'ความคลาดเคลื่อน'}
            </button>
          ))}
        </div>
      )}

      {/* Color Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color;
          const colorCode = getColorCode(color);
          const isLightColor = ['yellow', 'white'].includes(color);
          const value = getValue(color, currentType);

          return (
            <motion.button
              key={color}
              onClick={() => setSelectedColor(isSelected ? null : color)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                isSelected
                  ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-200'
                  : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/50'
              }`}
            >
              <div
                className={`h-12 w-12 rounded-lg shadow-md ${
                  isLightColor ? 'border-2 border-slate-300' : ''
                }`}
                style={{ backgroundColor: colorCode }}
              />
              <span className={`text-xs font-semibold ${
                isSelected ? 'text-orange-700' : 'text-slate-600'
              }`}>
                {getColorName(color)}
              </span>
              <span className={`text-xs ${
                isSelected ? 'text-orange-600 font-bold' : 'text-slate-500'
              }`}>
                {value}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Color Details */}
      <AnimatePresence>
        {selectedColor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-6"
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-16 w-16 rounded-lg shadow-lg ${
                  ['yellow', 'white'].includes(selectedColor) ? 'border-2 border-slate-300' : ''
                }`}
                style={{ backgroundColor: getColorCode(selectedColor) }}
              />
              <div className="flex-1">
                <h4 className="text-lg font-bold text-slate-900">
                  {getColorName(selectedColor)}
                </h4>
                <div className="mt-2 space-y-1 text-sm">
                  {mode === 'all' || mode === 'digit' ? (
                    <div>
                      <span className="font-semibold text-slate-600">ตัวเลข: </span>
                      <span className="text-slate-800">{getValue(selectedColor, 'digit')}</span>
                    </div>
                  ) : null}
                  {mode === 'all' || mode === 'multiplier' ? (
                    <div>
                      <span className="font-semibold text-slate-600">ตัวคูณ: </span>
                      <span className="text-slate-800">{getValue(selectedColor, 'multiplier')}</span>
                    </div>
                  ) : null}
                  {mode === 'all' || mode === 'tolerance' ? (
                    <div>
                      <span className="font-semibold text-slate-600">ความคลาดเคลื่อน: </span>
                      <span className="text-slate-800">{getValue(selectedColor, 'tolerance')}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
