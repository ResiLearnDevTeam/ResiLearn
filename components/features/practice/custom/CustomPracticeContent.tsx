'use client';

import ResistorDisplay from '@/components/features/ResistorDisplay';
import PracticeResultDisplay from './PracticeResultDisplay';
import AnswerInputs from './AnswerInputs';
import { Question } from '@/lib/questionGenerator';

interface CustomPracticeContentProps {
  answerType: string;
  resistorType: string;
  currentQ: Question;
  selectedBands: string[];
  currentBandIndex: number;
  expectedBandsCount: number;
  showResult: boolean;
  isCorrect: boolean;
  selectedAnswer: string | null;
  numberValue: string;
  selectedUnit: string;
  toleranceValue: string;
  answered: boolean;
  hasTimeRunOut: boolean;
  onAnswerSelect: (answer: string) => void;
  onColorSelect: (color: string) => void;
  onNumberValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  onToleranceValueChange: (value: string) => void;
}

export default function CustomPracticeContent({
  answerType,
  resistorType,
  currentQ,
  selectedBands,
  currentBandIndex,
  expectedBandsCount,
  showResult,
  isCorrect,
  selectedAnswer,
  numberValue,
  selectedUnit,
  toleranceValue,
  answered,
  hasTimeRunOut,
  onAnswerSelect,
  onColorSelect,
  onNumberValueChange,
  onUnitChange,
  onToleranceValueChange,
}: CustomPracticeContentProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Resistor Display */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
            {answerType === 'color_selection' ? (
              <ResistorDisplay
                bands={selectedBands.map(b => b || 'gray')}
                type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                highlightBand={!showResult ? currentBandIndex : undefined}
              />
            ) : (
              <ResistorDisplay
                bands={currentQ.bands}
                type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
              />
            )}
          </div>
        </div>

        {/* Question / Target Value */}
        {answerType === 'color_selection' ? (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">เลือกแถบสีให้ตรงกับค่า</p>
            <div className="inline-block rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-8 py-4 shadow-lg">
              <p className="text-2xl lg:text-3xl font-extrabold text-white">
                {currentQ.correctAnswer}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg font-semibold text-gray-700">
            ค่าความต้านทานของตัวต้านทานนี้คือเท่าไร?
          </p>
        )}

        {/* Result Display */}
        {showResult && (
          <div className="py-4">
            <PracticeResultDisplay
              isCorrect={isCorrect}
              answerType={answerType}
              selectedAnswer={selectedAnswer}
              selectedBands={selectedBands}
              numberValue={numberValue}
              selectedUnit={selectedUnit}
              toleranceValue={toleranceValue}
              currentQ={currentQ}
            />
          </div>
        )}

        {/* Answer Options */}
        {!showResult && (
          <AnswerInputs
            answerType={answerType}
            resistorType={resistorType}
            currentQ={currentQ}
            selectedAnswer={selectedAnswer}
            numberValue={numberValue}
            selectedUnit={selectedUnit}
            toleranceValue={toleranceValue}
            selectedBands={selectedBands}
            currentBandIndex={currentBandIndex}
            expectedBandsCount={expectedBandsCount}
            answered={answered}
            hasTimeRunOut={hasTimeRunOut}
            onAnswerSelect={onAnswerSelect}
            onColorSelect={onColorSelect}
            onNumberValueChange={onNumberValueChange}
            onUnitChange={onUnitChange}
            onToleranceValueChange={onToleranceValueChange}
          />
        )}
      </div>
    </div>
  );
}
