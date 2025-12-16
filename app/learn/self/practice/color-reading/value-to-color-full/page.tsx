'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import { generateValueToColorBandQuestion, getBandLabel } from '@/lib/resistorUtils';

function ValueToColorFullContent() {
  const searchParams = useSearchParams();
  const resistorType = (searchParams.get('type') || 'FOUR_BAND') as 'FOUR_BAND' | 'FIVE_BAND';
  const bandIndexParam = searchParams.get('bandIndex');
  const bandIndex = bandIndexParam ? parseInt(bandIndexParam) : null;
  const digitIndexParam = searchParams.get('digitIndex');
  const digitIndex = digitIndexParam !== null ? parseInt(digitIndexParam) : null;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);

  useEffect(() => {
    if (bandIndex === null) {
      // Redirect back if no band selected
      window.location.href = '/learn/self/practice/color-reading';
      return;
    }
    
    generateQuestions();
    setStartTime(Date.now());
    setIsLoading(false);
  }, [resistorType, bandIndex, digitIndex]);

  const generateQuestions = () => {
    if (bandIndex === null) return;
    
    const questionCount = 10;
    const generatedQuestions = Array.from({ length: questionCount }, () => 
      generateValueToColorBandQuestion(resistorType, bandIndex, digitIndex)
    );
    setQuestions(generatedQuestions);
  };

  const currentQ = questions[currentQuestion];
  const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;

  useEffect(() => {
    if (currentQ) {
      setSelectedColor('');
      setAnswered(false);
      setShowExplanation(false);
    }
  }, [currentQuestion, currentQ]);

  const colorOptions = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver']
  };

  const getAvailableColors = (index: number): string[] => {
    if (resistorType === 'FIVE_BAND') {
      if (index === 0) {
        return colorOptions.digit.filter(c => c !== 'black');
      } else if (index >= 1 && index <= 2) {
        return colorOptions.digit;
      } else if (index === 3) {
        return colorOptions.multiplier;
      } else if (index === 4) {
        return colorOptions.tolerance;
      }
    } else {
      if (index === 0) {
        return colorOptions.digit.filter(c => c !== 'black');
      } else if (index === 1) {
        return colorOptions.digit;
      } else if (index === 2) {
        return colorOptions.multiplier;
      } else if (index === 3) {
        return colorOptions.tolerance;
      }
    }
    return [];
  };

  const getColorCode = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      black: '#000000',
      brown: '#8B4513',
      red: '#DC143C',
      orange: '#FF6600',
      yellow: '#FFFF00',
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

  const handleColorSelect = (color: string) => {
    if (answered) return;
    setSelectedColor(color);
  };

  const handleCheckAnswer = () => {
    if (answered || bandIndex === null || !selectedColor || !currentQ) return;
    
    const correctColor = currentQ.correctBands[bandIndex];
    const isCorrect = selectedColor === correctColor;
    
    setAnswered(true);
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    const questionRecord = {
      questionNumber: currentQuestion + 1,
      bandIndex,
      correctColor,
      userColor: selectedColor,
      isCorrect,
      correctAnswer: currentQ.correctBands.join('-'),
      resistorValue: currentQ.resistorValue,
      questionType: 'value_to_color_full',
      resistorType,
      timestamp: Date.now()
    };
    setQuestionHistory(prev => [...prev, questionRecord]);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    setSelectedColor('');
    setAnswered(false);
    setShowExplanation(false);
    
    if (nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  };

  // Save session when practice is complete
  useEffect(() => {
    if (isPracticeComplete && !sessionSaved && score.total > 0) {
      const saveSession = async () => {
        try {
          const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;
          const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
          
          const response = await fetch('/api/practice-sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              presetId: null,
              presetName: `ฝึกอ่านสี - ค่า→สี (${getBandLabel(bandIndex || 0, resistorType)})`,
              totalQuestions: questions.length,
              correctAnswers: score.correct,
              incorrectAnswers: score.total - score.correct,
              accuracy,
              averageTime: score.total > 0 ? elapsedTime / score.total : 0,
              totalTime: elapsedTime,
              settings: {
                resistorType,
                colorReadingMode: 'value_to_color_full',
                bandIndex,
                totalQuestions: questions.length
              },
              questions: questionHistory
            })
          });

          if (response.ok) {
            setSessionSaved(true);
          }
        } catch (error) {
          console.error('Error saving practice session:', error);
        }
      };
      
      saveSession();
    }
  }, [isPracticeComplete, sessionSaved, score, startTime, questions.length, resistorType, bandIndex, questionHistory]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isLoading || bandIndex === null) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isPracticeComplete) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div 
          className="flex-1 transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900">ฝึกฝนเสร็จสิ้น!</h2>
                {score.total > 0 && (
                  <div className="mb-6 rounded-xl bg-orange-50 p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-lg font-semibold text-orange-900">
                        คะแนน: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                )}
                <Link
                  href="/learn/self/practice"
                  className="inline-block w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700"
                >
                  กลับไปโหมดฝึกฝน
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  // Create display bands with only selected band visible
  const displayBands = Array(expectedBandsCount).fill('gray');
  if (selectedColor) {
    displayBands[bandIndex] = selectedColor;
  }

  const isCorrect = answered && selectedColor === currentQ.correctBands[bandIndex];
  const availableColors = getAvailableColors(bandIndex);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar />
      
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-md">
            <Link 
              href="/learn/self/practice/color-reading"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-orange-600 hover:text-orange-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline font-medium">กลับ</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-gray-900">{currentQuestion + 1}/{questions.length}</div>
                <div className="text-xs text-gray-500">คำถาม</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">ถูกต้อง</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 md:p-6 shadow-lg">
            {/* Value Display */}
            <div className="mb-4 text-center">
              <h2 className="mb-3 text-lg sm:text-xl font-bold text-gray-900">
                เลือกสีที่ถูกต้องสำหรับ {getBandLabel(bandIndex, resistorType)}
              </h2>
              <div className="inline-block rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-2 border-2 border-orange-300">
                <p className="text-xl sm:text-2xl font-bold text-orange-700">
                  {(currentQ as any).bandValue || currentQ.correctAnswer}
                </p>
              </div>
            </div>

            {/* Resistor Display */}
            <div className="mb-4">
              <ResistorDisplay
                bands={displayBands}
                type={resistorType}
                highlightBand={bandIndex}
                partialBands={true}
              />
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                เลือกสีสำหรับ {getBandLabel(bandIndex, resistorType)}:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {availableColors.map((color) => {
                  const colorCode = getColorCode(color);
                  const isSelected = selectedColor === color;
                  const isCorrectColor = color === currentQ.correctBands[bandIndex];
                  
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      disabled={answered}
                      className={`rounded-lg border-2 p-3 transition-all ${
                        answered && isCorrectColor
                          ? 'border-green-600 bg-green-100'
                          : answered && isSelected && !isCorrectColor
                          ? 'border-red-600 bg-red-100'
                          : isSelected
                          ? 'border-orange-600 bg-orange-100'
                          : 'border-gray-300 bg-white hover:border-orange-400'
                      } ${answered ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div
                        className="w-full h-12 rounded border-2 border-gray-400 mb-1"
                        style={{ backgroundColor: colorCode }}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {getColorName(color)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <div className="space-y-2">
              {!answered ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedColor}
                  className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ตรวจคำตอบ
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700"
                >
                  {currentQuestion >= questions.length - 1 ? 'ฝึกฝนเสร็จสิ้น!' : 'คำถามถัดไป'}
                </button>
              )}

              {/* Explanation */}
              {showExplanation && (
                <div className={`rounded-xl border-2 p-4 ${
                  isCorrect
                    ? 'border-green-400 bg-green-100'
                    : 'border-red-400 bg-red-100'
                }`}>
                  <div className="mb-2 flex items-center gap-2">
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
                    {getBandLabel(bandIndex, resistorType)} ที่ถูกต้องคือ: <strong>{getColorName(currentQ.correctBands[bandIndex])}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ValueToColorFullPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <ValueToColorFullContent />
    </Suspense>
  );
}
