'use client';

import { getColorCode, getColorName, getBandLabel, getAvailableColors } from '@/lib/colorUtils';
import { Question } from '@/lib/questionGenerator';

interface AnswerInputsProps {
  answerType: string;
  resistorType: string;
  currentQ: Question;
  selectedAnswer: string | null;
  numberValue: string;
  selectedUnit: string;
  toleranceValue: string;
  selectedBands: string[];
  currentBandIndex: number;
  expectedBandsCount: number;
  answered: boolean;
  hasTimeRunOut: boolean;
  onAnswerSelect: (answer: string) => void;
  onColorSelect: (color: string) => void;
  onNumberValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  onToleranceValueChange: (value: string) => void;
}

export default function AnswerInputs({
  answerType,
  resistorType,
  currentQ,
  selectedAnswer,
  numberValue,
  selectedUnit,
  toleranceValue,
  selectedBands,
  currentBandIndex,
  expectedBandsCount,
  answered,
  hasTimeRunOut,
  onAnswerSelect,
  onColorSelect,
  onNumberValueChange,
  onUnitChange,
  onToleranceValueChange,
}: AnswerInputsProps) {
  if (answerType === 'multiple_choice') {
    return (
      <div className="grid grid-cols-2 gap-3 lg:gap-4">
        {currentQ.options?.map((option: string, index: number) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onAnswerSelect(option)}
              disabled={answered || hasTimeRunOut}
              className={`
                p-4 lg:p-5 rounded-xl border-2 text-center transition-colors
                ${isSelected
                  ? 'border-orange-500 bg-orange-500 text-white shadow-lg'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-orange-500 hover:bg-orange-50'
                }
                ${answered || hasTimeRunOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:bg-orange-100'}
              `}
            >
              <span className="text-lg lg:text-xl font-bold">{option}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (answerType === 'fill_in') {
    return (
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <input
            type="text"
            inputMode="numeric"
            value={numberValue}
            onChange={(e) => onNumberValueChange(e.target.value)}
            disabled={answered || hasTimeRunOut}
            placeholder="ค่า"
            className="w-24 lg:w-28 text-center text-xl lg:text-2xl font-bold rounded-xl border-2 border-gray-200 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
          />
          
          <div className="flex gap-1">
            {['Ω', 'kΩ', 'MΩ'].map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => onUnitChange(unit)}
                disabled={answered || hasTimeRunOut}
                className={`
                  px-3 lg:px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-colors
                  ${selectedUnit === unit
                    ? 'border-orange-500 bg-orange-500 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-orange-500 hover:bg-orange-50'
                  }
                `}
              >
                {unit}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-gray-600">±</span>
            <input
              type="text"
              inputMode="numeric"
              value={toleranceValue}
              onChange={(e) => onToleranceValueChange(e.target.value)}
              disabled={answered || hasTimeRunOut}
              placeholder="5"
              className="w-14 lg:w-16 text-center text-xl lg:text-2xl font-bold rounded-xl border-2 border-gray-200 px-2 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
            />
            <span className="text-xl font-bold text-gray-600">%</span>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          คำตอบ: <span className="font-bold text-gray-700">{numberValue ? `${numberValue}${selectedUnit} ±${toleranceValue}%` : '-'}</span>
        </p>
      </div>
    );
  }

  if (answerType === 'color_selection') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="rounded-xl border-2 border-orange-400 bg-orange-50 px-4 py-2">
            <span className="text-sm lg:text-base font-bold text-orange-800">
              {getBandLabel(currentBandIndex, resistorType)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: expectedBandsCount }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
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
        
        <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto">
          {getAvailableColors(currentBandIndex, resistorType).map((color) => {
            const itemColorCode = getColorCode(color);
            const isSelected = selectedBands[currentBandIndex] === color;
            const isLightColor = ['yellow', 'white', 'gold', 'silver'].includes(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() => onColorSelect(color)}
                disabled={answered || hasTimeRunOut}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors
                  ${isSelected
                    ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-300'
                    : 'border-gray-200 bg-white hover:border-orange-500 hover:bg-orange-50'
                  }
                  ${answered || hasTimeRunOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:bg-orange-100'}
                `}
              >
                <div
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg shadow-md mb-1.5 ${
                    isLightColor ? 'border-2 border-gray-300' : 'border border-gray-200'
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
      </div>
    );
  }

  return null;
}
