'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import ColorBandSelector from '@/components/features/ColorBandSelector';
import ColorToValuePractice from '@/components/features/ColorToValuePractice';
import { generateColorToValueQuestion, generateValueToColorQuestion } from '@/lib/resistorUtils';

type QuestionMode = 'value_to_color' | 'color_to_value';

interface MixedQuestion {
  mode: QuestionMode;
  data: any;
}

function MixedContent() {
  const searchParams = useSearchParams();
  const resistorType = (searchParams.get('type') || 'FOUR_BAND') as 'FOUR_BAND' | 'FIVE_BAND';
  const answerTypeParam = searchParams.get('answerType');
  const answerType = (answerTypeParam === 'fill_in' ? 'fill_in' : 'multiple_choice') as 'multiple_choice' | 'fill_in';
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('Ω');
  const [toleranceValue, setToleranceValue] = useState<string>('±5%');
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<MixedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);

  useEffect(() => {
    generateQuestions();
    setStartTime(Date.now());
    setIsLoading(false);
  }, [resistorType, answerType]);

  const generateQuestions = () => {
    const questionCount = 10;
    const generatedQuestions: MixedQuestion[] = [];
    
    for (let i = 0; i < questionCount; i++) {
      // Randomly choose mode
      const mode: QuestionMode = Math.random() < 0.5 ? 'value_to_color' : 'color_to_value';
      
      if (mode === 'value_to_color') {
        generatedQuestions.push({
          mode: 'value_to_color',
          data: generateValueToColorQuestion(resistorType)
        });
      } else {
        generatedQuestions.push({
          mode: 'color_to_value',
          data: generateColorToValueQuestion(resistorType, 4, 'medium')
        });
      }
    }
    
    setQuestions(generatedQuestions);
  };

  useEffect(() => {
    if (answerType === 'fill_in' && questions[currentQuestion]?.mode === 'color_to_value') {
      const formatted = numberValue && selectedUnit && toleranceValue
        ? `${numberValue}${selectedUnit} ${toleranceValue}`
        : '';
      setTypedAnswer(formatted);
    }
  }, [numberValue, selectedUnit, toleranceValue, answerType, currentQuestion, questions]);

  const currentQ = questions[currentQuestion];
  const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;

  useEffect(() => {
    if (currentQ && currentQ.mode === 'value_to_color') {
      if (selectedBands.length !== expectedBandsCount) {
        setSelectedBands(Array(expectedBandsCount).fill(''));
      }
    }
  }, [currentQuestion, currentQ, expectedBandsCount]);

  const handleAnswerSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };

  const handleBandChange = (index: number, color: string) => {
    if (answered) return;
    const newBands = [...selectedBands];
    
    while (newBands.length < expectedBandsCount) {
      newBands.push('');
    }
    
    newBands[index] = color;
    setSelectedBands(newBands);
  };

  const handleCheckAnswer = () => {
    if (answered) return;
    
    let answer: string | null = null;
    let isCorrect = false;

    if (currentQ.mode === 'value_to_color') {
      const bandsToCheck = [...selectedBands];
      while (bandsToCheck.length < expectedBandsCount) {
        bandsToCheck.push('');
      }
      isCorrect = bandsToCheck.every((band, index) => band === currentQ.data.correctBands[index]);
      answer = bandsToCheck.join('-');
    } else {
      if (answerType === 'multiple_choice') {
        answer = selectedAnswer;
        if (!answer) return;
        isCorrect = answer === currentQ.data.correctAnswer;
      } else {
        answer = typedAnswer.trim();
        if (!answer) return;
        isCorrect = answer === currentQ.data.correctAnswer;
      }
    }
    
    setAnswered(true);
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    const questionRecord = {
      questionNumber: currentQuestion + 1,
      mode: currentQ.mode,
      bands: currentQ.mode === 'value_to_color' ? selectedBands : currentQ.data.bands,
      correctAnswer: currentQ.mode === 'value_to_color' ? currentQ.data.correctBands.join('-') : currentQ.data.correctAnswer,
      userAnswer: answer,
      isCorrect,
      explanation: currentQ.data.explanation,
      resistorValue: currentQ.data.resistorValue,
      questionType: 'mixed',
      resistorType,
      answerType: currentQ.mode === 'color_to_value' ? answerType : undefined,
      timestamp: Date.now()
    };
    setQuestionHistory(prev => [...prev, questionRecord]);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    setAnswered(false);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('±5%');
    setSelectedBands([]);
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
          
          // Calculate analytics by mode
          const valueToColorCount = questionHistory.filter(q => q.mode === 'value_to_color').length;
          const colorToValueCount = questionHistory.filter(q => q.mode === 'color_to_value').length;
          const valueToColorCorrect = questionHistory.filter(q => q.mode === 'value_to_color' && q.isCorrect).length;
          const colorToValueCorrect = questionHistory.filter(q => q.mode === 'color_to_value' && q.isCorrect).length;
          
          const response = await fetch('/api/practice-sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              presetId: null,
              presetName: 'ฝึกอ่านสี - สลับกัน',
              totalQuestions: questions.length,
              correctAnswers: score.correct,
              incorrectAnswers: score.total - score.correct,
              accuracy,
              averageTime: score.total > 0 ? elapsedTime / score.total : 0,
              totalTime: elapsedTime,
              settings: {
                resistorType,
                colorReadingMode: 'mixed',
                answerType,
                totalQuestions: questions.length
              },
              questions: questionHistory,
              analytics: {
                valueToColor: {
                  total: valueToColorCount,
                  correct: valueToColorCorrect,
                  accuracy: valueToColorCount > 0 ? (valueToColorCorrect / valueToColorCount) * 100 : 0
                },
                colorToValue: {
                  total: colorToValueCount,
                  correct: colorToValueCorrect,
                  accuracy: colorToValueCount > 0 ? (colorToValueCorrect / colorToValueCount) * 100 : 0
                }
              }
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
  }, [isPracticeComplete, sessionSaved, score, startTime, questions.length, resistorType, answerType, questionHistory]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isLoading) {
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

  const isValueToColor = currentQ.mode === 'value_to_color';
  const isCorrectAnswer = answered && (
    isValueToColor
      ? selectedBands.every((band, index) => band === currentQ.data.correctBands[index])
      : (answerType === 'multiple_choice' ? selectedAnswer === currentQ.data.correctAnswer : typedAnswer.trim() === currentQ.data.correctAnswer)
  );

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
          
          {/* Mode Indicator */}
          <div className="mb-4 text-center">
            <div className={`inline-block px-4 py-2 rounded-lg ${
              isValueToColor ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              <span className="text-sm font-semibold">
                {isValueToColor ? 'ค่า → สี' : 'สี → ค่า'}
              </span>
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
            {isValueToColor ? (
              <>
                {/* Value to Color Mode */}
                <div className="mb-4 text-center">
                  <h2 className="mb-3 text-lg sm:text-xl font-bold text-gray-900">
                    เลือกแถบสีที่ถูกต้องสำหรับค่าความต้านทานนี้
                  </h2>
                  <div className="inline-block rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-2 border-2 border-orange-300">
                    <p className="text-xl sm:text-2xl font-bold text-orange-700">
                      {currentQ.data.correctAnswer}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <ResistorDisplay
                    bands={(() => {
                      const bands = [...selectedBands];
                      while (bands.length < expectedBandsCount) {
                        bands.push('');
                      }
                      return bands.map(band => band || 'gray');
                    })()}
                    showAnswer={showExplanation}
                    answer={currentQ.data.correctBands?.join('-')}
                    isCorrect={isCorrectAnswer}
                    type={resistorType}
                    partialBands={true}
                  />
                </div>

                <div className="mb-4">
                  <ColorBandSelector
                    bands={(() => {
                      const bands = [...selectedBands];
                      while (bands.length < expectedBandsCount) {
                        bands.push('');
                      }
                      return bands;
                    })()}
                    onBandChange={handleBandChange}
                    resistorType={resistorType}
                    disabled={answered}
                    showLabels={true}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Color to Value Mode */}
                <ColorToValuePractice
                  bands={currentQ.data.bands}
                  correctAnswer={currentQ.data.correctAnswer}
                  options={currentQ.data.options}
                  selectedAnswer={selectedAnswer}
                  typedAnswer={typedAnswer}
                  numberValue={numberValue}
                  selectedUnit={selectedUnit}
                  toleranceValue={toleranceValue}
                  answerType={answerType}
                  resistorType={resistorType}
                  onAnswerSelect={handleAnswerSelect}
                  onNumberValueChange={setNumberValue}
                  onUnitChange={setSelectedUnit}
                  onToleranceChange={setToleranceValue}
                  disabled={answered}
                  showResult={showExplanation}
                  isCorrect={isCorrectAnswer}
                />
              </>
            )}

            {/* Action Button */}
            <div className="mt-4 space-y-2">
              {!answered ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={
                    isValueToColor
                      ? selectedBands.some(b => !b || b.trim() === '')
                      : (answerType === 'multiple_choice' && !selectedAnswer) || 
                        (answerType === 'fill_in' && !typedAnswer.trim())
                  }
                  className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ตรวจคำตอบ
                </button>
              ) : (
                <>
                  <button
                    onClick={handleNextQuestion}
                    className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700"
                  >
                    {currentQuestion >= questions.length - 1 ? 'ฝึกฝนเสร็จสิ้น!' : 'คำถามถัดไป'}
                  </button>
                  
                  {/* Explanation */}
                  <div className={`rounded-xl border-2 p-4 ${
                    isCorrectAnswer
                      ? 'border-green-400 bg-green-100'
                      : 'border-red-400 bg-red-100'
                  }`}>
                    <p className="text-sm text-gray-900">{currentQ.data.explanation}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function MixedPage() {
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
      <MixedContent />
    </Suspense>
  );
}

