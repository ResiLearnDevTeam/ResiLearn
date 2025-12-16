'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ColorToValuePractice from '@/components/features/ColorToValuePractice';
import ColorToValueBandByBand from '@/components/features/ColorToValueBandByBand';
import { generateColorToValueQuestion, generateColorToValueBandQuestion, formatResistance, getBandLabel, colorCodes } from '@/lib/resistorUtils';

function ColorToValueContent() {
  const searchParams = useSearchParams();
  const resistorType = (searchParams.get('type') || 'FOUR_BAND') as 'FOUR_BAND' | 'FIVE_BAND';
  const answerTypeParam = searchParams.get('answerType');
  const answerType = (answerTypeParam === 'fill_in' ? 'fill_in' : 'multiple_choice') as 'multiple_choice' | 'fill_in';
  const bandIndexParam = searchParams.get('bandIndex');
  const bandIndex = bandIndexParam !== null ? parseInt(bandIndexParam) : null;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentBandIndex, setCurrentBandIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('Ω');
  const [toleranceValue, setToleranceValue] = useState<string>('±5%');
  const [showExplanation, setShowExplanation] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);
  const [bandHistory, setBandHistory] = useState<any[]>([]);
  
  const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
  const isBandByBandMode = bandIndex === null; // Band-by-band mode when no specific band is selected

  useEffect(() => {
    generateQuestions();
    setStartTime(Date.now());
    setIsLoading(false);
  }, [resistorType, answerType, bandIndex]);

  const generateQuestions = () => {
    const questionCount = 10;
    const generatedQuestions = Array.from({ length: questionCount }, () => {
      if (bandIndex !== null) {
        return generateColorToValueBandQuestion(resistorType, bandIndex);
      } else {
        // For band-by-band mode, generate full color questions
        return generateColorToValueQuestion(resistorType, 4, 'medium');
      }
    });
    setQuestions(generatedQuestions);
  };
  
  // Reset band index when question changes in band-by-band mode
  useEffect(() => {
    if (isBandByBandMode && currentQuestion < questions.length) {
      setCurrentBandIndex(0);
      setAnswered(false);
      setShowResult(false);
      setSelectedAnswer(null);
    }
  }, [currentQuestion, isBandByBandMode, questions.length]);

  useEffect(() => {
    if (answerType === 'fill_in') {
      const formatted = numberValue && selectedUnit && toleranceValue
        ? `${numberValue}${selectedUnit} ${toleranceValue}`
        : '';
      setTypedAnswer(formatted);
    }
  }, [numberValue, selectedUnit, toleranceValue, answerType]);

  const currentQ = questions[currentQuestion];
  
  // Get current band value for band-by-band mode
  const getCurrentBandValue = (): string => {
    if (!currentQ || !isBandByBandMode) return '';
    
    const is5Band = resistorType === 'FIVE_BAND';
    const bands = currentQ.bands;
    
    if (is5Band) {
      if (currentBandIndex === 0) {
        return colorCodes.digit[bands[0] as keyof typeof colorCodes.digit].toString();
      } else if (currentBandIndex === 1) {
        return colorCodes.digit[bands[1] as keyof typeof colorCodes.digit].toString();
      } else if (currentBandIndex === 2) {
        return colorCodes.digit[bands[2] as keyof typeof colorCodes.digit].toString();
      } else if (currentBandIndex === 3) {
        const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier];
        if (multiplier >= 1000) {
          const divisor = 1000;
          const k = multiplier / divisor;
          return k % 1 === 0 ? `${k}k` : multiplier.toString();
        }
        return multiplier.toString();
      } else if (currentBandIndex === 4) {
        return colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance];
      }
    } else {
      if (currentBandIndex === 0) {
        return colorCodes.digit[bands[0] as keyof typeof colorCodes.digit].toString();
      } else if (currentBandIndex === 1) {
        return colorCodes.digit[bands[1] as keyof typeof colorCodes.digit].toString();
      } else if (currentBandIndex === 2) {
        const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier];
        if (multiplier >= 1000) {
          const divisor = 1000;
          const k = multiplier / divisor;
          return k % 1 === 0 ? `${k}k` : multiplier.toString();
        }
        return multiplier.toString();
      } else if (currentBandIndex === 3) {
        return colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance];
      }
    }
    return '';
  };
  
  // Generate options for current band
  const getCurrentBandOptions = (): string[] => {
    const correctValue = getCurrentBandValue();
    if (!correctValue) return [];
    
    const is5Band = resistorType === 'FIVE_BAND';
    let wrongAnswers: string[] = [];
    
    if (is5Band) {
      if (currentBandIndex <= 2) {
        // Digit bands
        const allDigits = Array.from({ length: 10 }, (_, i) => i.toString());
        wrongAnswers = allDigits.filter(d => d !== correctValue).sort(() => Math.random() - 0.5).slice(0, 3);
      } else if (currentBandIndex === 3) {
        // Multiplier band
        const multipliers = [1, 10, 100, 1000, 10000, 100000, 1000000];
        const divisor = 1000;
        wrongAnswers = multipliers
          .filter(m => {
            const mStr = m >= divisor ? `${m / divisor}k` : m.toString();
            return mStr !== correctValue;
          })
          .map(m => m >= divisor ? `${m / divisor}k` : m.toString())
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      } else {
        // Tolerance band
        const tolerances = ['±1%', '±2%', '±0.5%', '±0.25%', '±0.1%', '±0.05%', '±5%', '±10%'];
        wrongAnswers = tolerances.filter(t => t !== correctValue).sort(() => Math.random() - 0.5).slice(0, 3);
      }
    } else {
      if (currentBandIndex <= 1) {
        // Digit bands
        const allDigits = Array.from({ length: 10 }, (_, i) => i.toString());
        wrongAnswers = allDigits.filter(d => d !== correctValue).sort(() => Math.random() - 0.5).slice(0, 3);
      } else if (currentBandIndex === 2) {
        // Multiplier band
        const multipliers = [1, 10, 100, 1000, 10000, 100000, 1000000];
        const divisor = 1000;
        wrongAnswers = multipliers
          .filter(m => {
            const mStr = m >= divisor ? `${m / divisor}k` : m.toString();
            return mStr !== correctValue;
          })
          .map(m => m >= divisor ? `${m / divisor}k` : m.toString())
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      } else {
        // Tolerance band
        const tolerances = ['±1%', '±2%', '±0.5%', '±0.25%', '±0.1%', '±0.05%', '±5%', '±10%'];
        wrongAnswers = tolerances.filter(t => t !== correctValue).sort(() => Math.random() - 0.5).slice(0, 3);
      }
    }
    
    return [correctValue, ...wrongAnswers].sort(() => Math.random() - 0.5);
  };

  const handleAnswerSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    
    if (isBandByBandMode) {
      // Check answer immediately in band-by-band mode
      const correctValue = getCurrentBandValue();
      const correct = answer === correctValue;
      setIsCorrect(correct);
      setShowResult(true);
      setAnswered(true);
      
      // Record band answer
      const bandRecord = {
        questionNumber: currentQuestion + 1,
        bandIndex: currentBandIndex,
        correctValue,
        userAnswer: answer,
        isCorrect: correct,
        timestamp: Date.now()
      };
      setBandHistory(prev => [...prev, bandRecord]);
      
      // Auto-advance after 1.5 seconds if correct
      if (correct) {
        setTimeout(() => {
          handleNextBand();
        }, 1500);
      }
    }
  };
  
  const handleNextBand = () => {
    if (currentBandIndex < expectedBandsCount - 1) {
      setCurrentBandIndex(currentBandIndex + 1);
      setAnswered(false);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      // All bands answered, move to next question
      handleNextQuestion();
    }
  };

  const handleCheckAnswer = () => {
    if (answered || isBandByBandMode) return; // Band-by-band mode handles answers automatically
    
    let answer: string | null = null;
    let isCorrect = false;

    if (answerType === 'multiple_choice') {
      answer = selectedAnswer;
      if (!answer) return;
      isCorrect = answer === currentQ.correctAnswer;
    } else {
      answer = typedAnswer.trim();
      if (!answer) return;
      isCorrect = answer === currentQ.correctAnswer;
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
      bands: currentQ.bands,
      correctAnswer: currentQ.correctAnswer,
      userAnswer: answer,
      isCorrect,
      explanation: currentQ.explanation,
      resistorValue: currentQ.resistorValue,
      questionType: 'color_to_value',
      resistorType,
      answerType,
      timestamp: Date.now()
    };
    setQuestionHistory(prev => [...prev, questionRecord]);
  };

  const handleNextQuestion = () => {
    // Record question result for band-by-band mode
    if (isBandByBandMode && currentQ) {
      const allCorrect = bandHistory
        .filter(b => b.questionNumber === currentQuestion + 1)
        .every(b => b.isCorrect);
      
      const questionRecord = {
        questionNumber: currentQuestion + 1,
        bands: currentQ.bands,
        correctAnswer: currentQ.correctAnswer,
        userAnswer: bandHistory
          .filter(b => b.questionNumber === currentQuestion + 1)
          .map(b => b.userAnswer)
          .join('-'),
        isCorrect: allCorrect,
        explanation: currentQ.explanation,
        resistorValue: currentQ.resistorValue,
        questionType: 'color_to_value_band_by_band',
        resistorType,
        bandHistory: bandHistory.filter(b => b.questionNumber === currentQuestion + 1),
        timestamp: Date.now()
      };
      setQuestionHistory(prev => [...prev, questionRecord]);
      
      if (allCorrect) {
        setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      } else {
        setScore(prev => ({ ...prev, total: prev.total + 1 }));
      }
    }
    
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    setCurrentBandIndex(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('±5%');
    setShowExplanation(false);
    setShowResult(false);
    
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
              presetName: 'ฝึกอ่านสี - สี→ค่า',
              totalQuestions: questions.length,
              correctAnswers: score.correct,
              incorrectAnswers: score.total - score.correct,
              accuracy,
              averageTime: score.total > 0 ? elapsedTime / score.total : 0,
              totalTime: elapsedTime,
              settings: {
                resistorType,
                colorReadingMode: 'color_to_value',
                answerType,
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
  }, [isPracticeComplete, sessionSaved, score, startTime, questions.length, resistorType, answerType, questionHistory]);

  const calculateProgress = () => {
    if (questions.length === 0) return 0;
    const current = currentQuestion + 1;
    const total = questions.length;
    const ratio = current / total;
    return Math.round(ratio * 100);
  };
  const progressPercent = calculateProgress();

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
                {score.total > 0 && (() => {
                  const accuracy = Math.round((score.correct / score.total) * 100);
                  return (
                    <div className="mb-6 rounded-xl bg-orange-50 p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-orange-900">
                          คะแนน: {score.correct} / {score.total} ({accuracy}%)
                        </span>
                      </div>
                    </div>
                  );
                })()}
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
                <div className="text-base sm:text-lg font-bold text-gray-900">{currentQuestion + 1} / {questions.length}</div>
                <div className="text-xs text-gray-500">คำถาม</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">{score.correct} / {score.total}</div>
                <div className="text-xs text-gray-500">ถูกต้อง</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 md:p-6 shadow-lg">
            {isBandByBandMode ? (
              <ColorToValueBandByBand
                resistorType={resistorType}
                currentBandIndex={currentBandIndex}
                bands={currentQ.bands}
                correctValue={getCurrentBandValue()}
                options={getCurrentBandOptions()}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                disabled={answered}
                showResult={showResult}
                isCorrect={isCorrect}
              />
            ) : (
              <>
                {/* Band Selection Info */}
                {bandIndex !== null && (
                  <div className="mb-4 text-center">
                    <h2 className="mb-2 text-lg sm:text-xl font-bold text-gray-900">
                      เลือกค่าที่ถูกต้องสำหรับ {getBandLabel(bandIndex, resistorType)}
                    </h2>
                  </div>
                )}
                <ColorToValuePractice
                  bands={currentQ.bands}
                  correctAnswer={currentQ.correctAnswer}
                  options={currentQ.options}
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
                  isCorrect={answered && (answerType === 'multiple_choice' ? selectedAnswer === currentQ.correctAnswer : typedAnswer.trim() === currentQ.correctAnswer)}
                  highlightBand={bandIndex !== null ? bandIndex : undefined}
                />
              </>
            )}

            {/* Action Button */}
            {isBandByBandMode ? (
              showResult && !isCorrect ? (
                <div className="mt-4">
                  <button
                    onClick={handleNextBand}
                    className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700"
                  >
                    ต่อไป
                  </button>
                </div>
              ) : null
            ) : (
              <div className="mt-4 space-y-2">
                {!answered ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={
                      (answerType === 'multiple_choice' && !selectedAnswer) || 
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
                    {currentQ.explanation && (
                      <div
                        className={
                          (answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer
                            ? 'rounded-xl border-2 p-4 border-green-400 bg-green-100'
                            : 'rounded-xl border-2 p-4 border-red-400 bg-red-100'
                        }
                      >
                        <p className="text-sm text-gray-900">{currentQ.explanation}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ColorToValuePage() {
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
      <ColorToValueContent />
    </Suspense>
  );
}

