'use client';

import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import ColorBandSelector from '@/components/features/ColorBandSelector';
import { colorCodes, formatResistance } from '@/lib/resistorUtils';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';
import { generateStepByStepExplanation } from '@/lib/explanationUtils';
import SolutionExplanation from '@/components/features/SolutionExplanation';

function QuickPracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const resistorType = searchParams.get('type') || 'FOUR_BAND';
  const answerType = searchParams.get('answerType') || 'multiple_choice';
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('Ω');
  const [toleranceValue, setToleranceValue] = useState<string>('±5%');
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  
  // Initialize selectedBands array based on resistor type
  useEffect(() => {
    const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
    if (selectedBands.length !== expectedBandsCount) {
      setSelectedBands(Array(expectedBandsCount).fill(''));
    }
  }, [resistorType]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);

  useEffect(() => {
    generateQuestions();
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setTypedAnswer('');
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('±5%');
    setSelectedBands([]);
    setShowExplanation(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setQuestionHistory([]);
    setIsLoading(false);
  }, [resistorType, answerType]);

  useEffect(() => {
    if (answerType === 'fill_in') {
      const formatted = numberValue && selectedUnit && toleranceValue
        ? `${numberValue}${selectedUnit} ${toleranceValue}`
        : '';
      setTypedAnswer(formatted);
    }
  }, [numberValue, selectedUnit, toleranceValue, answerType]);

  useEffect(() => {
    if (isPracticeComplete && !sessionSaved) {
      const saveSession = async () => {
        try {
          const accuracy = (score.correct / score.total) * 100;
          const elapsedTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
          
          const deepAnalytics = calculateDeepAnalytics(questionHistory);
          
          const response = await fetch(`/api/courses/${courseId}/practice/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              presetId: null,
              presetName: 'Quick Practice',
              totalQuestions: questions.length,
              correctAnswers: score.correct,
              incorrectAnswers: score.total - score.correct,
              accuracy,
              averageTime: elapsedTime / questions.length,
              totalTime: elapsedTime,
              settings: {
                resistorType,
                answerType,
                optionCount: 4,
                countdownTime: null,
                totalQuestions: questions.length,
                hasTimeLimit: false,
                timeLimit: null,
                difficulty: 'medium',
                analytics: {
                  deepAnalytics
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
  }, [isPracticeComplete, sessionSaved, questionHistory, resistorType, answerType, courseId]);

  const generateQuestions = () => {
    const newQuestions = [];
    for (let i = 0; i < 10; i++) {
      const question = generateQuestion();
      newQuestions.push(question);
    }
    setQuestions(newQuestions);
  };

  const generateQuestion = () => {
    const isFiveBand = resistorType === 'FIVE_BAND';
    const numDigitBands = isFiveBand ? 3 : 2;
    
    const digitBands = Array.from({ length: numDigitBands }, () => {
      const colors = Object.keys(colorCodes.digit);
      return colors[Math.floor(Math.random() * colors.length)];
    });

    const multiplierBand = (() => {
      const colors = Object.keys(colorCodes.multiplier);
      return colors[Math.floor(Math.random() * colors.length)];
    })();

    const toleranceBand = (() => {
      const colors = ['brown', 'red', 'gold', 'silver'];
      return colors[Math.floor(Math.random() * colors.length)];
    })();

    const bands = [...digitBands, multiplierBand, toleranceBand];

    let value = 0;
    digitBands.forEach(color => {
      const digit = colorCodes.digit[color as keyof typeof colorCodes.digit];
      if (digit !== null && digit !== undefined) {
        value = value * 10 + digit;
      }
    });

    const multiplier = colorCodes.multiplier[multiplierBand as keyof typeof colorCodes.multiplier];
    if (multiplier !== null && multiplier !== undefined) {
      value *= multiplier;
    }

    const tolerance = colorCodes.tolerance[toleranceBand as keyof typeof colorCodes.tolerance] || '±5%';

    return {
      bands,
      correctAnswer: `${formatResistance(value, tolerance)}`,
      rawValue: value,
      tolerance,
      resistorType
    };
  };

  const question = questions[currentQuestion];

  const handleAnswer = () => {
    if (answered) return;

    let isCorrect = false;
    let userAnswer = '';

    if (answerType === 'multiple_choice' && selectedAnswer) {
      isCorrect = selectedAnswer === question.correctAnswer;
      userAnswer = selectedAnswer;
    } else if (answerType === 'fill_in') {
      const normalizedTyped = typedAnswer.trim().replace(/\s+/g, ' ');
      const normalizedCorrect = question.correctAnswer.trim().replace(/\s+/g, ' ');
      isCorrect = normalizedTyped.toLowerCase() === normalizedCorrect.toLowerCase();
      userAnswer = typedAnswer;
    } else if (answerType === 'color_selection') {
      const correctBands = question.bands.map((b: string) => b.toLowerCase());
      const userBands = selectedBands.map(b => b.toLowerCase());
      isCorrect = JSON.stringify(correctBands) === JSON.stringify(userBands);
      userAnswer = selectedBands.join(', ');
    }

    setAnswered(true);
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));

    const historyEntry = {
      bands: question.bands,
      correctAnswer: question.correctAnswer,
      userAnswer,
      isCorrect,
      explanation: `The correct answer is ${question.correctAnswer}`,
      resistorType: question.resistorType
    };
    setQuestionHistory(prev => [...prev, historyEntry]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setNumberValue('');
      setSelectedUnit('Ω');
      setToleranceValue('±5%');
      setSelectedBands([]);
      setShowExplanation(false);
    } else {
      setIsPracticeComplete(true);
    }
  };

  const generateOptions = () => {
    if (!question) return [];
    const options = [question.correctAnswer];
    
    while (options.length < 4) {
      const fakeQuestion = generateQuestion();
      if (!options.includes(fakeQuestion.correctAnswer)) {
        options.push(fakeQuestion.correctAnswer);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

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
    const accuracy = (score.correct / score.total) * 100;
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
        <div 
          className="flex-1 transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="container mx-auto px-4 py-8 lg:px-8">
            <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">เสร็จสิ้น!</h1>
                <p className="text-gray-600">คุณทำแบบฝึกหัดเสร็จแล้ว</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div className="rounded-xl bg-blue-50 p-6">
                  <p className="text-sm text-gray-600 mb-2">คะแนน</p>
                  <p className="text-3xl font-bold text-blue-600">{score.correct}/{score.total}</p>
                </div>
                <div className="rounded-xl bg-green-50 p-6">
                  <p className="text-sm text-gray-600 mb-2">ความแม่นยำ</p>
                  <p className="text-3xl font-bold text-green-600">{accuracy.toFixed(1)}%</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/learn/classroom/courses/${courseId}/practice`}
                  className="flex-1 rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  กลับไปหน้าฝึกฝน
                </Link>
                <button
                  onClick={() => {
                    generateQuestions();
                    setCurrentQuestion(0);
                    setScore({ correct: 0, total: 0 });
                    setAnswered(false);
                    setIsPracticeComplete(false);
                    setSessionSaved(false);
                    setStartTime(Date.now());
                    setQuestionHistory([]);
                  }}
                  className="flex-1 rounded-xl border-2 border-blue-600 px-6 py-3 text-center font-semibold text-blue-600 hover:bg-blue-50"
                >
                  ฝึกอีกครั้ง
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const options = answerType === 'multiple_choice' ? generateOptions() : [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <ClassroomSidebar courseId={courseId} />
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-8 lg:px-8">
          <div className="mb-6">
            <Link href={`/learn/classroom/courses/${courseId}/practice/quick/select`} className="text-blue-600 hover:text-blue-700 inline-flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              กลับ
            </Link>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ฝึกด่วน</h1>
              <p className="text-gray-600">คำถามที่ {currentQuestion + 1} / {questions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">คะแนน</p>
              <p className="text-2xl font-bold text-blue-600">{score.correct}/{score.total}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-8">
              <ResistorDisplay
                bands={question.bands}
                type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
              />
            </div>

            {answerType === 'multiple_choice' && (
              <div className="space-y-4">
                <p className="font-semibold text-gray-900 mb-4">เลือกค่าความต้านทานที่ถูกต้อง:</p>
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !answered && setSelectedAnswer(option)}
                    disabled={answered}
                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                      answered
                        ? option === question.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : option === selectedAnswer
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : selectedAnswer === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {answerType === 'fill_in' && (
              <div className="space-y-4">
                <p className="font-semibold text-gray-900 mb-4">กรอกค่าความต้านทาน:</p>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={numberValue}
                    onChange={(e) => setNumberValue(e.target.value)}
                    disabled={answered}
                    placeholder="ค่า"
                    className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3"
                  />
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    disabled={answered}
                    className="rounded-xl border-2 border-gray-300 px-4 py-3"
                  >
                    <option value="Ω">Ω</option>
                    <option value="kΩ">kΩ</option>
                    <option value="MΩ">MΩ</option>
                  </select>
                  <select
                    value={toleranceValue}
                    onChange={(e) => setToleranceValue(e.target.value)}
                    disabled={answered}
                    className="rounded-xl border-2 border-gray-300 px-4 py-3"
                  >
                    <option value="±1%">±1%</option>
                    <option value="±2%">±2%</option>
                    <option value="±5%">±5%</option>
                    <option value="±10%">±10%</option>
                  </select>
                </div>
              </div>
            )}

            {answerType === 'color_selection' && (
              <div className="space-y-4">
                <p className="font-semibold text-gray-900 mb-4">เลือกแถบสีที่ถูกต้อง:</p>
                <ColorBandSelector
                  bands={selectedBands}
                  resistorType={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                  onBandChange={(index, color) => {
                    const newBands = [...selectedBands];
                    newBands[index] = color;
                    setSelectedBands(newBands);
                  }}
                  disabled={answered}
                />
              </div>
            )}

            {answered && (
              <div className="mt-6 space-y-4">
                <div className={`rounded-xl p-4 ${
                  questionHistory[questionHistory.length - 1]?.isCorrect
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <p className="font-semibold mb-2">
                    {questionHistory[questionHistory.length - 1]?.isCorrect ? '✓ ถูกต้อง!' : '✗ ไม่ถูกต้อง'}
                  </p>
                  <p className="text-sm text-gray-700">คำตอบที่ถูกต้อง: {question.correctAnswer}</p>
                </div>
                
                {/* Solution Explanation - Show only when incorrect */}
                {!questionHistory[questionHistory.length - 1]?.isCorrect && 
                 question.bands && 
                 Array.isArray(question.bands) && 
                 question.bands.length > 0 &&
                 question.bands.every(b => b && b.trim() !== '') &&
                 question.resistorValue && 
                 question.tolerance && (
                  <SolutionExplanation
                    explanation={generateStepByStepExplanation(
                      question.bands.filter(b => b && b.trim() !== ''),
                      resistorType as 'FOUR_BAND' | 'FIVE_BAND',
                      question.resistorValue,
                      question.tolerance
                    )}
                  />
                )}
              </div>
            )}

            <div className="mt-8">
              {!answered ? (
                <button
                  onClick={handleAnswer}
                  disabled={
                    (answerType === 'multiple_choice' && !selectedAnswer) ||
                    (answerType === 'fill_in' && !typedAnswer) ||
                    (answerType === 'color_selection' && selectedBands.length === 0)
                  }
                  className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ตรวจคำตอบ
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {currentQuestion < questions.length - 1 ? 'คำถามถัดไป' : 'เสร็จสิ้น'}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function QuickPracticePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar />
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
      <QuickPracticeContent />
    </Suspense>
  );
}

