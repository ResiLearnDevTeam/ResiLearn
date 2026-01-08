'use client';

import ResistorDisplay from './ResistorDisplay';
import { getBandLabel } from '@/lib/resistorUtils';

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
  resistorValue?: number;
  tolerance?: string;
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
}: ColorToValueBandByBandProps) {
  const is5Band = resistorType === 'FIVE_BAND';
  const expectedBandsCount = is5Band ? 5 : 4;
  
  const displayBands = [...bands];
  while (displayBands.length < expectedBandsCount) {
    displayBands.push('');
  }
  
  const bandLabel = getBandLabel(currentBandIndex, resistorType);
  
  // Categorize options for better display
  const isDigitBand = is5Band ? currentBandIndex <= 2 : currentBandIndex <= 1;
  const isMultiplierBand = is5Band ? currentBandIndex === 3 : currentBandIndex === 2;
  const isToleranceBand = is5Band ? currentBandIndex === 4 : currentBandIndex === 3;
  
  return (
    <div className="space-y-6">
      {/* Top Section: Resistor Display */}
      <div className="flex flex-col items-center pb-4 border-b border-gray-100">
        {/* Resistor Display - Larger */}
        <div className="w-full max-w-xl mb-4">
          <ResistorDisplay
            bands={displayBands}
            type={resistorType}
            highlightBand={currentBandIndex}
            partialBands={false}
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
                <span className="text-2xl lg:text-3xl font-bold text-green-700">
                  {selectedAnswer}
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
                  <div className="px-6 py-4 bg-red-50 rounded-xl border-2 border-red-200">
                    <span className="text-2xl lg:text-3xl font-bold text-red-600">
                      {selectedAnswer}
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
                  <div className="px-6 py-4 bg-green-50 rounded-xl border-2 border-green-300">
                    <span className="text-2xl lg:text-3xl font-bold text-green-700">
                      {correctValue}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Section: Value Options */}
      {!showResult && (
        <div className="pt-2">
          <p className="text-center text-sm font-semibold text-gray-500 mb-4">
            เลือกค่าที่ตรงกับแถบสีที่ไฮไลต์
          </p>
          
          {/* Different grid layouts based on option type */}
          {isDigitBand ? (
            // Digit options: 5 columns for 0-9
            <div className="grid grid-cols-5 gap-3 lg:gap-4 max-w-lg mx-auto">
              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onAnswerSelect(option)}
                    disabled={disabled}
                    className={`
                      flex items-center justify-center aspect-square rounded-xl border-2 transition-all
                      ${isSelected
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg scale-105 ring-2 ring-orange-300'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md hover:scale-[1.02]'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                    `}
                  >
                    <span className={`text-2xl lg:text-3xl font-bold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : isMultiplierBand ? (
            // Multiplier options: 4 columns
            <div className="grid grid-cols-4 gap-2 lg:gap-3 max-w-xl mx-auto">
              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onAnswerSelect(option)}
                    disabled={disabled}
                    className={`
                      flex items-center justify-center p-3 lg:p-4 rounded-xl border-2 transition-all
                      ${isSelected
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg scale-105 ring-2 ring-orange-300'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md hover:scale-[1.02]'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                    `}
                  >
                    <span className={`text-sm lg:text-base font-bold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : isToleranceBand ? (
            // Tolerance options: 4 columns
            <div className="grid grid-cols-4 gap-2 lg:gap-3 max-w-xl mx-auto">
              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onAnswerSelect(option)}
                    disabled={disabled}
                    className={`
                      flex items-center justify-center p-3 lg:p-4 rounded-xl border-2 transition-all
                      ${isSelected
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg scale-105 ring-2 ring-orange-300'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md hover:scale-[1.02]'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                    `}
                  >
                    <span className={`text-sm lg:text-base font-bold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            // Default: 3 columns
            <div className="grid grid-cols-3 gap-2 lg:gap-3 max-w-lg mx-auto">
              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onAnswerSelect(option)}
                    disabled={disabled}
                    className={`
                      flex items-center justify-center p-4 lg:p-5 rounded-xl border-2 transition-all
                      ${isSelected
                        ? 'border-orange-500 bg-orange-500 text-white shadow-lg scale-105 ring-2 ring-orange-300'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-orange-400 hover:bg-orange-50 hover:shadow-md hover:scale-[1.02]'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                    `}
                  >
                    <span className={`text-base lg:text-lg font-bold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
