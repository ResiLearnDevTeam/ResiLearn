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
            {isCorrect ? '✓ ถูกต้อง!' : `✗ ไม่ถูกต้อง (คำตอบที่ถูก: ${correctValue})`}
          </div>
        )}
      </div>
      
      {/* Answer Options */}
      {options.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => !disabled && onAnswerSelect(option)}
              disabled={disabled}
              className={`rounded-lg border-2 px-4 py-3 text-sm font-semibold transition-all ${
                selectedAnswer === option
                  ? 'border-orange-600 bg-orange-100 text-orange-900'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

