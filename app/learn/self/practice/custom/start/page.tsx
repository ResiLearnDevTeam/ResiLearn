'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCustomPractice } from '@/hooks/useCustomPractice';
import CustomPracticeHeader from '@/components/features/practice/custom/CustomPracticeHeader';
import CustomPracticeContent from '@/components/features/practice/custom/CustomPracticeContent';
import CustomPracticeFooter from '@/components/features/practice/custom/CustomPracticeFooter';
import CustomPracticeComplete from '@/components/features/practice/custom/CustomPracticeComplete';
import EndPracticeDialog from '@/components/features/practice/custom/EndPracticeDialog';

function CustomPracticeContentWrapper() {
  const searchParams = useSearchParams();
  
  // Parse settings from URL
  const resistorType = searchParams.get('type') || 'FOUR_BAND';
  const answerType = searchParams.get('answerType') || 'multiple_choice';
  const difficulty = searchParams.get('difficulty') || 'medium';
  const optionCount = parseInt(searchParams.get('options') || '4');
  const questionsParam = searchParams.get('questions');
  const countdownParam = searchParams.get('countdown');
  const limitParam = searchParams.get('limit');
  
  const totalQuestions = questionsParam === 'unlimited' ? null : parseInt(questionsParam || '10');
  const countdownTime = countdownParam ? parseInt(countdownParam) : null;
  const timeLimit = limitParam ? parseInt(limitParam) : null;

  const practice = useCustomPractice({
    resistorType,
    answerType,
    difficulty,
    optionCount,
    totalQuestions,
    countdownTime,
    timeLimit,
  });

  // Loading state
  if (practice.isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="text-gray-600 font-medium">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  // Practice complete state
  if (practice.isPracticeComplete || practice.hasTimeRunOut) {
    return (
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
          <CustomPracticeComplete
            score={practice.score}
            hasTimeRunOut={practice.hasTimeRunOut}
            endedEarly={practice.endedEarly}
            totalQuestions={totalQuestions}
            questionsLength={practice.questions.length}
            onRestart={practice.handleRestart}
          />
        </div>
      </div>
    );
  }

  if (!practice.currentQ) return null;

  return (
    <div className="flex h-screen bg-white">
      <LeftSidebar />
      
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
        <CustomPracticeHeader
          answerType={answerType}
          timeRemaining={practice.timeRemaining}
          countdown={practice.countdown}
          answered={practice.answered}
          totalQuestions={totalQuestions}
          currentQuestion={practice.currentQuestion}
          score={practice.score}
          progress={practice.progress}
          onEndPractice={practice.handleEndPractice}
        />

        <CustomPracticeContent
          answerType={answerType}
          resistorType={resistorType}
          currentQ={practice.currentQ}
          selectedBands={practice.selectedBands}
          currentBandIndex={practice.currentBandIndex}
          expectedBandsCount={practice.expectedBandsCount}
          showResult={practice.showResult}
          isCorrect={practice.isCorrect}
          selectedAnswer={practice.selectedAnswer}
          numberValue={practice.numberValue}
          selectedUnit={practice.selectedUnit}
          toleranceValue={practice.toleranceValue}
          answered={practice.answered}
          hasTimeRunOut={practice.hasTimeRunOut}
          onAnswerSelect={practice.handleAnswerSelect}
          onColorSelect={practice.handleColorSelect}
          onNumberValueChange={practice.setNumberValue}
          onUnitChange={practice.setSelectedUnit}
          onToleranceValueChange={practice.setToleranceValue}
        />

        <CustomPracticeFooter
          showResult={practice.showResult}
          answerType={answerType}
          selectedAnswer={practice.selectedAnswer}
          numberValue={practice.numberValue}
          toleranceValue={practice.toleranceValue}
          selectedBands={practice.selectedBands}
          hasTimeRunOut={practice.hasTimeRunOut}
          totalQuestions={totalQuestions}
          currentQuestion={practice.currentQuestion}
          questionsLength={practice.questions.length}
          onCheckAnswer={() => practice.handleCheckAnswer()}
          onNextQuestion={practice.handleNextQuestion}
        />

        <EndPracticeDialog
          show={practice.showEndConfirmDialog}
          onConfirm={practice.confirmEndPractice}
          onCancel={practice.cancelEndPractice}
        />
      </div>
    </div>
  );
}

export default function CustomPracticeStartPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="text-gray-600 font-medium">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <CustomPracticeContentWrapper />
    </Suspense>
  );
}
