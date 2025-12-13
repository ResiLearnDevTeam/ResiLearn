'use client';

import ResistorDisplay from './ResistorDisplay';

interface ColorToValuePracticeProps {
  bands: string[];
  correctAnswer: string;
  options?: string[];
  selectedAnswer?: string | null;
  typedAnswer?: string;
  numberValue?: string;
  selectedUnit?: string;
  toleranceValue?: string;
  answerType: 'multiple_choice' | 'fill_in';
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  onAnswerSelect?: (answer: string) => void;
  onNumberValueChange?: (value: string) => void;
  onUnitChange?: (unit: string) => void;
  onToleranceChange?: (tolerance: string) => void;
  disabled?: boolean;
  showResult?: boolean;
  isCorrect?: boolean;
}

export default function ColorToValuePractice({
  bands,
  correctAnswer,
  options = [],
  selectedAnswer,
  typedAnswer,
  numberValue,
  selectedUnit,
  toleranceValue,
  answerType,
  resistorType,
  onAnswerSelect,
  onNumberValueChange,
  onUnitChange,
  onToleranceChange,
  disabled = false,
  showResult = false,
  isCorrect = false
}: ColorToValuePracticeProps) {
  return (
    <div className="space-y-6">
      {/* Resistor Display */}
      <div className="flex justify-center">
        <ResistorDisplay
          bands={bands}
          type={resistorType}
        />
      </div>
      
      {/* Question */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ค่าความต้านทานของตัวต้านทานนี้คือเท่าไร?
        </h2>
      </div>
      
      {/* Answer Options - Multiple Choice */}
      {answerType === 'multiple_choice' && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {options.map((option: string, index: number) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === correctAnswer;
            const isWrong = isSelected && !isCorrectOption;
            
            return (
              <button
                key={index}
                onClick={() => !disabled && onAnswerSelect && onAnswerSelect(option)}
                disabled={disabled || showResult}
                className={`rounded-xl border-2 px-6 py-4 text-left text-base font-semibold transition-all ${
                  showResult && isCorrectOption
                    ? 'border-green-600 bg-green-100 text-green-900'
                    : showResult && isWrong
                    ? 'border-red-600 bg-red-100 text-red-900'
                    : isSelected
                    ? 'border-orange-600 bg-orange-200 text-orange-900'
                    : 'border-gray-400 bg-white text-gray-900 hover:border-orange-400 hover:bg-orange-50'
                } ${disabled || showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
      
      {/* Fill-in-the-blank Answer */}
      {answerType === 'fill_in' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={numberValue || ''}
              onChange={(e) => onNumberValueChange && onNumberValueChange(e.target.value)}
              disabled={disabled || showResult}
              placeholder="ค่า"
              className={`flex-1 rounded-lg border-2 px-4 py-3 text-lg ${
                showResult
                  ? (typedAnswer?.trim() === correctAnswer
                      ? 'border-green-600 bg-green-100 text-gray-900'
                      : 'border-red-600 bg-red-100 text-gray-900')
                  : 'border-gray-400 text-gray-900 focus:border-orange-600 focus:ring-2 focus:ring-orange-300'
              }`}
            />
            <div className="flex gap-1">
              {['Ω', 'kΩ', 'MΩ'].map((unit) => (
                <button
                  key={unit}
                  onClick={() => !disabled && !showResult && onUnitChange && onUnitChange(unit)}
                  disabled={disabled || showResult}
                  className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                    selectedUnit === unit
                      ? 'border-orange-600 bg-orange-200 text-orange-900'
                      : 'border-gray-400 bg-white text-gray-800 hover:border-orange-400'
                  } ${disabled || showResult ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            {['±0.5%', '±1%', '±2%', '±5%', '±10%'].map((tolerance) => (
              <button
                key={tolerance}
                onClick={() => !disabled && !showResult && onToleranceChange && onToleranceChange(tolerance)}
                disabled={disabled || showResult}
                className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all ${
                  toleranceValue === tolerance
                    ? 'border-orange-600 bg-orange-200 text-orange-900'
                    : 'border-gray-400 bg-white text-gray-800 hover:border-orange-400'
                } ${disabled || showResult ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tolerance}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Result Display */}
      {showResult && (
        <div className={`rounded-xl border-2 p-4 ${
          isCorrect ? 'border-green-400 bg-green-100' : 'border-red-400 bg-red-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <svg className="h-5 w-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-green-900">ถูกต้อง!</h3>
              </>
            ) : (
              <>
                <svg className="h-5 w-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-red-900">ไม่ถูกต้อง</h3>
              </>
            )}
          </div>
          <p className="text-sm text-gray-900">
            คำตอบที่ถูกต้อง: <strong>{correctAnswer}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

