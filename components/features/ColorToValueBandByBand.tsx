'use client';

import { useState } from 'react';
import ResistorDisplay from './ResistorDisplay';
import { getBandLabel, colorCodes } from '@/lib/resistorUtils';

interface ColorToValueBandByBandProps {
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  currentBandIndex: number;
  bands: string[];
  correctValue: string;
  options?: string[];
  selectedAnswer?: string | null;
  onAnswerSelect: (answer: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
}

export default function ColorToValueBandByBand({
  resistorType,
  currentBandIndex,
  bands,
  correctValue,
  options = [],
  selectedAnswer,
  onAnswerSelect,
  disabled = false,
  showResult = false,
  isCorrect = false
}: ColorToValueBandByBandProps) {
  const is5Band = resistorType === 'FIVE_BAND';
  const expectedBandsCount = is5Band ? 5 : 4;
  
  // Create display bands - show only up to current band
  const displayBands = Array(expectedBandsCount).fill('gray');
  for (let i = 0; i <= currentBandIndex && i < bands.length; i++) {
    displayBands[i] = bands[i];
  }
  
  return (
    <div className="space-y-4">
      {/* Split layout: ซ้าย = ตัวต้านทาน, ขวา = ตัวเลือกตัวเลข/ค่า */}
      <div className="grid gap-6 md:grid-cols-2 items-center">
        {/* Left: Resistor + current band info (จัดกึ่งกลางในคอลัมน์ซ้าย) */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-full max-w-[640px]">
        <ResistorDisplay
          bands={displayBands}
          type={resistorType}
          highlightBand={currentBandIndex}
          partialBands={true}
        />
      </div>
      <div className="text-center">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
              {getBandLabel(currentBandIndex, resistorType)} (ให้สีมา → เลือกตัวเลข/ค่า)
        </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              เลือกตัวเลข/ค่าที่ตรงกับแถบสีที่ไฮไลต์บนตัวต้านทาน
            </p>
        {showResult && (
              <div
                className={`mt-2 inline-block px-4 py-2 rounded-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
            {isCorrect ? '✓ ถูกต้อง!' : `✗ ไม่ถูกต้อง (คำตอบที่ถูก: ${correctValue})`}
          </div>
        )}
          </div>
      </div>
      
        {/* Right: ตัวเลือกเป็นค่า/ตัวเลขของหลักนี้ */}
        <div className="space-y-3">
      {options.length > 0 && (
            <>
              <p className="text-center text-sm font-semibold text-gray-700">
                เลือกค่าที่ถูกต้องสำหรับหลักนี้
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => !disabled && onAnswerSelect(option)}
              disabled={disabled}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                selectedAnswer === option
                        ? 'border-orange-600 bg-orange-100 text-orange-900 shadow-md'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400 hover:bg-orange-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
        </div>
            </>
      )}
        </div>
      </div>
    </div>
  );
}

