'use client';

import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import ColorReadingBandByBand from '@/components/features/ColorReadingBandByBand';
import { generateValueToColorQuestion, generateValueToColorBandQuestion, getBandLabel } from '@/lib/resistorUtils';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';

function ValueToColorBandByBandContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const courseId = params?.courseId as string;
  const resistorType = (searchParams.get('type') || 'FOUR_BAND') as 'FOUR_BAND' | 'FIVE_BAND';
  const bandIndexParam = searchParams.get('bandIndex');
  const bandIndex = bandIndexParam !== null ? parseInt(bandIndexParam) : null;
  const digitIndexParam = searchParams.get('digitIndex');
  const digitIndex = digitIndexParam !== null ? parseInt(digitIndexParam) : null;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentBandIndex, setCurrentBandIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);
  const [bandHistory, setBandHistory] = useState<any[]>([]);

  const isSpecificBandMode = bandIndex !== null;

  useEffect(() => {
    generateQuestions();
    setStartTime(Date.now());
    setIsLoading(false);
  }, [resistorType, bandIndex, digitIndex]);

  const generateQuestions = () => {
    const questionCount = 10;
    const generatedQuestions = Array.from({ length: questionCount }, () => {
      if (isSpecificBandMode && bandIndex !== null) {
        return generateValueToColorBandQuestion(resistorType, bandIndex, digitIndex);
      } else {
        return generateValueToColorQuestion(resistorType);
      }
    });
    setQuestions(generatedQuestions);
  };

  const currentQ = questions[currentQuestion];
  const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;

  useEffect(() => {
    if (currentQ) {
      if (isSpecificBandMode) {
        // In specific band mode, only show the selected band
        setSelectedBands(Array(expectedBandsCount).fill(''));
        // For digit bands with digitIndex, use digitIndex as the current band index
        const isDigitBand = resistorType === 'FIVE_BAND' ? (bandIndex || 0) <= 2 : (bandIndex || 0) <= 1;
        if (isDigitBand && digitIndex !== null && digitIndex !== undefined) {
          setCurrentBandIndex(digitIndex);
        } else {
          setCurrentBandIndex(bandIndex || 0);
        }
      } else {
        // In band-by-band mode, show all bands sequentially
        if (selectedBands.length !== expectedBandsCount) {
          setSelectedBands(Array(expectedBandsCount).fill(''));
        }
        setCurrentBandIndex(0);
      }
      setAnswered(false);
      setShowResult(false);
    }
  }, [currentQuestion, resistorType, currentQ, expectedBandsCount, isSpecificBandMode, bandIndex, digitIndex]);

  const handleBandSelect = (color: string) => {
    if (answered) return;
    
    const newBands = [...selectedBands];
    while (newBands.length < expectedBandsCount) {
      newBands.push('');
    }
    
    // Always use currentBandIndex to ensure the color is set in the correct band
    // This ensures that when showing result, the color appears in the correct band
    const targetBandIndex = currentBandIndex;
    
    newBands[targetBandIndex] = color;
    setSelectedBands(newBands);
    
    // Auto-check answer when color is selected
    setTimeout(() => {
      handleCheckAnswerWithBands(newBands, targetBandIndex);
    }, 100);
  };
  
  const handleCheckAnswerWithBands = (bands: string[], targetBandIndex: number) => {
    if (answered) return;
    
    const selectedColor = bands[targetBandIndex] || '';
    if (!selectedColor) return; // No color selected
    
    // Check if correct
    const correct = selectedColor === currentQ.correctBands[targetBandIndex];
    setIsCorrect(correct);
    setShowResult(true);
    setAnswered(true);
    
    // Record band answer
    const bandRecord = {
      questionNumber: currentQuestion + 1,
      bandIndex: targetBandIndex,
      correctColor: currentQ.correctBands[targetBandIndex],
      userColor: selectedColor,
      isCorrect: correct,
      timestamp: Date.now()
    };
    setBandHistory(prev => [...prev, bandRecord]);
    
    // In specific band mode, move to next question after answer
    if (isSpecificBandMode) {
      if (correct) {
        setTimeout(() => {
          handleNextQuestion();
        }, 1500);
      }
    } else {
      // In band-by-band mode, auto-advance to next band if correct
      if (correct) {
        setTimeout(() => {
          handleNextBand();
        }, 1500);
      }
    }
  };

  const handleCheckAnswer = () => {
    if (answered) return;
    
    const targetBandIndex = isSpecificBandMode 
      ? (() => {
          const isDigitBand = resistorType === 'FIVE_BAND' ? (bandIndex || 0) <= 2 : (bandIndex || 0) <= 1;
          if (isDigitBand && digitIndex !== null && digitIndex !== undefined) {
            return digitIndex;
          }
          return bandIndex || 0;
        })()
      : currentBandIndex;
    
    const selectedColor = selectedBands[targetBandIndex] || '';
    if (!selectedColor) return; // No color selected
    
    // Check if correct
    const correct = selectedColor === currentQ.correctBands[targetBandIndex];
    setIsCorrect(correct);
    setShowResult(true);
    setAnswered(true);
    
    // Record band answer
    const bandRecord = {
      questionNumber: currentQuestion + 1,
      bandIndex: targetBandIndex,
      correctColor: currentQ.correctBands[targetBandIndex],
      userColor: selectedColor,
      isCorrect: correct,
      timestamp: Date.now()
    };
    setBandHistory(prev => [...prev, bandRecord]);
    
    // In specific band mode, move to next question after answer
    if (isSpecificBandMode) {
      if (correct) {
        setTimeout(() => {
          handleNextQuestion();
        }, 1500);
      }
    } else {
      // In band-by-band mode, auto-advance to next band if correct
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
      // Don't clear selectedBands - keep all previous selections
    } else {
      // All bands answered, move to next question
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    // Record question result
    const allCorrect = selectedBands.every((band, index) => band === currentQ.correctBands[index]);
    
    // Extract detailed information for analytics
    const correctBands = currentQ.correctBands || [];
    const userBands = selectedBands;
    const correctResistorValue = currentQ.resistorValue;
    const correctTolerance = currentQ.tolerance || '';
    
    // Extract digit positions for band-by-band comparison
    const digitPositions: any = {};
    const is5Band = resistorType === 'FIVE_BAND';
    
    if (correctBands.length > 0 && userBands.length > 0) {
      const maxBands = Math.max(correctBands.length, userBands.length);
      for (let i = 0; i < maxBands; i++) {
        const correctBand = correctBands[i] || '';
        const userBand = userBands[i] || '';
        
        if (is5Band) {
          if (i === 0) {
            digitPositions.position1 = { correct: correctBand, user: userBand };
          } else if (i === 1) {
            digitPositions.position2 = { correct: correctBand, user: userBand };
          } else if (i === 2) {
            digitPositions.position3 = { correct: correctBand, user: userBand };
          } else if (i === 3) {
            digitPositions.multiplier = { correct: correctBand, user: userBand };
          } else if (i === 4) {
            digitPositions.tolerance = { correct: correctBand, user: userBand };
          }
        } else {
          if (i === 0) {
            digitPositions.position1 = { correct: correctBand, user: userBand };
          } else if (i === 1) {
            digitPositions.position2 = { correct: correctBand, user: userBand };
          } else if (i === 2) {
            digitPositions.multiplier = { correct: correctBand, user: userBand };
          } else if (i === 3) {
            digitPositions.tolerance = { correct: correctBand, user: userBand };
          }
        }
      }
    }
    
    const questionRecord = {
      questionNumber: currentQuestion + 1,
      bands: selectedBands,
      correctAnswer: currentQ.correctBands.join('-'),
      userAnswer: selectedBands.join('-'),
      isCorrect: allCorrect,
      explanation: currentQ.explanation,
      resistorValue: currentQ.resistorValue,
      questionType: 'value_to_color_band_by_band',
      resistorType,
      bandHistory: bandHistory.filter(b => b.questionNumber === currentQuestion + 1),
      timestamp: Date.now(),
      // Enhanced fields for deep analytics
      correctBands,
      userBands,
      correctResistorValue,
      userResistorValue: undefined,
      correctTolerance,
      userTolerance: undefined,
      digitPositions
    };
    setQuestionHistory(prev => [...prev, questionRecord]);
    
    if (allCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
    
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    setCurrentBandIndex(0);
    setSelectedBands(Array(expectedBandsCount).fill(''));
    setAnswered(false);
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
          
          const response = await fetch(`/api/courses/${courseId}/practice/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              presetId: null,
              presetName: isSpecificBandMode 
                ? `ฝึกอ่านสี - ค่า→สี (${getBandLabel(bandIndex || 0, resistorType)})`
                : 'ฝึกอ่านสี - ค่า→สี (ทีละแถบ)',
              totalQuestions: questions.length,
              correctAnswers: score.correct,
              incorrectAnswers: score.total - score.correct,
              accuracy,
              averageTime: score.total > 0 ? elapsedTime / score.total : 0,
              totalTime: elapsedTime,
              settings: {
                resistorType,
                colorReadingMode: 'value_to_color_band_by_band',
                totalQuestions: questions.length,
                bandIndex: isSpecificBandMode ? bandIndex : undefined,
                digitIndex: isSpecificBandMode ? digitIndex : undefined,
                analytics: {
                  deepAnalytics: calculateDeepAnalytics(questionHistory)
                }
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
  }, [isPracticeComplete, sessionSaved, score, startTime, questions.length, resistorType, questionHistory, isSpecificBandMode, bandIndex, digitIndex]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isPracticeComplete) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
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
                  <div className="mb-6 rounded-xl bg-blue-50 p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-lg font-semibold text-blue-900">
                        คะแนน: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                )}
                <Link
                  href={`/learn/classroom/courses/${courseId}/practice`}
                  className="inline-block w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-center font-bold text-white transition-all hover:from-blue-600 hover:to-blue-700"
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
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <ClassroomSidebar courseId={courseId} />
      
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-md">
            <Link 
              href={`/learn/classroom/courses/${courseId}/practice/quick/select`}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors"
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
                <div className="text-base sm:text-lg font-bold text-blue-600">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">ถูกต้อง</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg">
            {/* Band by Band Selector */}
            {isSpecificBandMode ? (() => {
              // For digit bands with digitIndex, use digitIndex as the current band index
              const isDigitBand = resistorType === 'FIVE_BAND' ? (bandIndex || 0) <= 2 : (bandIndex || 0) <= 1;
              const displayBandIndex = (isDigitBand && digitIndex !== null && digitIndex !== undefined) 
                ? digitIndex 
                : (bandIndex || 0);
              
              // Show only the selected band
              // Make sure to preserve the selected color even when showing result
              const filteredBands = Array(expectedBandsCount).fill('');
              // Always use the selectedBands value for the display band index
              const selectedColor = selectedBands[displayBandIndex] || '';
              filteredBands[displayBandIndex] = selectedColor;
              
              return (
                <ColorReadingBandByBand
                  resistorType={resistorType}
                  currentBandIndex={displayBandIndex}
                  selectedBands={filteredBands}
                  correctBands={currentQ.correctBands}
                  bandValue={currentQ.bandValue}
                  resistorValue={currentQ.resistorValue}
                  tolerance={currentQ.tolerance}
                  onBandSelect={handleBandSelect}
                  disabled={answered}
                  showResult={showResult}
                  isCorrect={isCorrect}
                  hasSelectedColor={!!selectedBands[displayBandIndex]}
                />
              );
            })() : (() => {
              // Show only the current band being asked
              // Make sure to preserve the selected color even when showing result
              const filteredBands = Array(expectedBandsCount).fill('');
              // Always use the selectedBands value for the current band index
              // This ensures the student's selected color is shown in the correct band
              // Use the actual selectedBands array value, not filtered
              const selectedColor = selectedBands[currentBandIndex] || '';
              filteredBands[currentBandIndex] = selectedColor;
              
              // Debug: Log to verify the color is being passed correctly
              // console.log('Current band index:', currentBandIndex, 'Selected color:', selectedColor, 'All selectedBands:', selectedBands);
              
              return (
                <ColorReadingBandByBand
                  resistorType={resistorType}
                  currentBandIndex={currentBandIndex}
                  selectedBands={filteredBands}
                  correctBands={currentQ.correctBands}
                  bandValue={currentQ.bandValue}
                  resistorValue={currentQ.resistorValue}
                  tolerance={currentQ.tolerance}
                  onBandSelect={handleBandSelect}
                  disabled={answered}
                  showResult={showResult}
                  isCorrect={isCorrect}
                  hasSelectedColor={!!selectedBands[currentBandIndex]}
                />
              );
            })()}

            {/* Continue Button (when wrong) */}
            {showResult && !isCorrect && (
              <div className="mt-4">
                <button
                  onClick={isSpecificBandMode ? handleNextQuestion : handleNextBand}
                  className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700"
                >
                  ต่อไป
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ValueToColorBandByBandPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <ValueToColorBandByBandContent />
    </Suspense>
  );
}

