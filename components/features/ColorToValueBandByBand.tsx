'use client';

import { useState } from 'react';
import ResistorDisplay from './ResistorDisplay';
import { getBandLabel, colorCodes, formatResistance } from '@/lib/resistorUtils';

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
  /** ค่าความต้านทานจริง */
  resistorValue?: number;
  /** ค่าความคลาดเคลื่อน */
  tolerance?: string;
  /** ค่าของแถบ/หลักที่ต้องตอบ เช่น "4", "×10K", "±5%" */
  bandValue?: string;
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
  isCorrect = false,
  resistorValue,
  tolerance,
  bandValue
}: ColorToValueBandByBandProps) {
  const is5Band = resistorType === 'FIVE_BAND';
  const expectedBandsCount = is5Band ? 5 : 4;
  
  // Create display bands - show all bands, highlight current band
  const displayBands = [...bands];
  while (displayBands.length < expectedBandsCount) {
    displayBands.push('');
  }
  // Ensure all bands are shown (not filtered)
  
  // Get the actual resistor value to display
  const displayValue = resistorValue && tolerance 
    ? formatResistance(resistorValue, tolerance)
    : bandValue || '-';
  
  // Get band label with highlight
  const bandLabel = getBandLabel(currentBandIndex, resistorType);
  
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Split layout: ซ้าย = ตัวต้านทาน, ขวา = ตัวเลือกตัวเลข/ค่า */}
      <div className="grid gap-6 sm:gap-8 md:gap-10 lg:gap-12 md:grid-cols-2 items-start">
        {/* Left: แสดงตัวต้านทาน + label + progress */}
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-5 md:space-y-6">
          {/* Resistor Display */}
          <div className="w-full px-1 sm:px-2 md:px-4">
            <ResistorDisplay
              bands={displayBands}
              type={resistorType}
              highlightBand={currentBandIndex}
              partialBands={false}
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
              เลือกค่าที่ตรงกับแถบสีที่ไฮไลต์บนตัวต้านทาน
            </p>
            {showResult && (
              <div
                className={`mt-3 sm:mt-4 inline-block px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isCorrect ? '✓ ถูกต้อง!' : `✗ ไม่ถูกต้อง (คำตอบที่ถูก: ${correctValue})`}
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
      
        {/* Right: ตัวเลือกเป็นค่า/ตัวเลขของหลักนี้ */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5">
          {!showResult && (
            <>
              <p className="text-center text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-3 sm:mb-4 md:mb-5">
                เลือกค่าที่ถูกต้อง:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !disabled && onAnswerSelect(option)}
                    disabled={disabled}
                    className={`
                      flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl border-2 transition-all
                      ${selectedAnswer === option
                        ? 'border-orange-600 bg-orange-100 text-orange-900 shadow-md sm:shadow-lg scale-[1.02] sm:scale-[1.03]'
                        : 'border-gray-300 bg-white text-gray-800 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span className={`text-sm sm:text-base md:text-lg font-semibold sm:font-bold truncate w-full ${
                        selectedAnswer === option ? 'text-orange-900' : 'text-gray-800'
                      }`}>
                        {option}
                      </span>
                    </div>
                    {selectedAnswer === option && (
                      <svg className="ml-auto w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
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

