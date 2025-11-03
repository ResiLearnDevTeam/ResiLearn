'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';

function CustomPracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Parse settings from URL
  const resistorType = searchParams.get('type') || 'FOUR_BAND';
  const answerType = searchParams.get('answerType') || 'multiple_choice';
  const optionCount = parseInt(searchParams.get('options') || '4');
  const questionsParam = searchParams.get('questions');
  const countdownParam = searchParams.get('countdown');
  const limitParam = searchParams.get('limit');
  
  const totalQuestions = questionsParam === 'unlimited' ? null : parseInt(questionsParam || '10');
  const countdownTime = countdownParam ? parseInt(countdownParam) : null;
  const timeLimit = limitParam ? parseInt(limitParam) : null;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('Ω');
  const [toleranceValue, setToleranceValue] = useState<string>('±5%');
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [hasTimeRunOut, setHasTimeRunOut] = useState(false);
  const [endedEarly, setEndedEarly] = useState(false);
  const [showEndConfirmDialog, setShowEndConfirmDialog] = useState(false);
  const timeRemainingRef = useRef<number | null>(null);

  useEffect(() => {
    // Generate initial questions
    generateQuestions();
    setStartTime(Date.now());
    
    // Set up total time limit if specified
    if (timeLimit) {
      setTimeRemaining(timeLimit);
      timeRemainingRef.current = timeLimit;
    }
    
    setIsLoading(false);
  }, [resistorType, totalQuestions]);

  // Combine number, unit, and tolerance into typedAnswer
  useEffect(() => {
    if (answerType === 'fill_in') {
      const formatted = numberValue && selectedUnit && toleranceValue
        ? `${numberValue}${selectedUnit} ${toleranceValue}`
        : '';
      setTypedAnswer(formatted);
    }
  }, [numberValue, selectedUnit, toleranceValue, answerType]);

  // Countdown timer per question
  useEffect(() => {
    if (answered || !countdownTime || !currentQ) return;
    
    setCountdown(countdownTime);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (!answered) {
            // Auto-show correct answer when time runs out
            const correctAnswer = currentQ.correctAnswer;
            setSelectedAnswer(correctAnswer);
            setAnswered(true);
            setShowExplanation(true);
            setScore(prev => ({ ...prev, total: prev.total + 1 }));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestion, countdownTime, answered, questions]);

  // Total time limit timer
  useEffect(() => {
    if (!timeLimit || isPracticeComplete || hasTimeRunOut) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev === null || prev <= 1 ? 0 : prev - 1;
        timeRemainingRef.current = newTime;
        
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setHasTimeRunOut(true);
          handleTimeLimitReached();
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLimit, isPracticeComplete, hasTimeRunOut]);

  // Save session when practice is complete
  useEffect(() => {
    if ((isPracticeComplete || hasTimeRunOut) && !sessionSaved && score.total > 0) {
      const saveSession = async () => {
        try {
          const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;
          const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
          const questionsAnswered = totalQuestions !== null ? Math.min(currentQuestion, questions.length) : currentQuestion;
          
          const response = await fetch('/api/practice-sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              presetId: null,
              presetName: 'Custom Practice',
              totalQuestions: questionsAnswered,
              correctAnswers: score.correct,
              incorrectAnswers: score.total - score.correct,
              accuracy,
              averageTime: score.total > 0 ? elapsedTime / score.total : 0,
              totalTime: elapsedTime,
              settings: {
                resistorType,
                optionCount,
                countdownTime,
                totalQuestions,
                hasTimeLimit: timeLimit !== null,
                timeLimit
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
  }, [isPracticeComplete, hasTimeRunOut, sessionSaved, score, startTime, currentQuestion, questions.length, totalQuestions, resistorType, optionCount, countdownTime, timeLimit]);

  const handleTimeLimitReached = () => {
    setIsPracticeComplete(true);
  };

  const handleEndPractice = () => {
    // Show confirmation dialog
    setShowEndConfirmDialog(true);
  };

  const confirmEndPractice = async () => {
    // Close dialog
    setShowEndConfirmDialog(false);
    // Mark practice as complete (this will trigger the useEffect to save)
    setEndedEarly(true);
    setIsPracticeComplete(true);
  };

  const cancelEndPractice = () => {
    // Close dialog without ending practice
    setShowEndConfirmDialog(false);
  };

  const generateQuestions = () => {
    // Generate random resistor questions based on type
    const questionCount = totalQuestions || 10; // Use 10 as default for unlimited during generation
    const generatedQuestions = Array.from({ length: questionCount }, () => generateQuestion(resistorType));
    setQuestions(generatedQuestions);
  };

  const generateQuestion = (type: string) => {
    // Color codes for resistors
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
    };

    if (type === 'FIVE_BAND') {
      // 5-band resistor: 3 digits + multiplier + tolerance
      // First digit cannot be black (0)
      const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
      const bands = [
        firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
        Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
        Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
      ] as string[];

      const value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}`;
      const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier];
      const tolerance = colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance];
      const resistorValue = parseInt(value) * multiplier;
      const correctAnswer = formatResistance(resistorValue, tolerance);

      // Generate wrong answers based on option count
      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, optionCount).filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, optionCount - 1)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options,
        explanation: `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}) - ${bands[3]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[4]}(${tolerance})`,
        resistorValue
      };
    } else {
      // 4-band resistor: 2 digits + multiplier + tolerance
      // First digit cannot be black (0)
      const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
      const bands = [
        firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
        Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
        Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
      ] as string[];

      const value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}`;
      const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier];
      const tolerance = colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance];
      const resistorValue = parseInt(value) * multiplier;
      const correctAnswer = formatResistance(resistorValue, tolerance);

      // Generate wrong answers based on option count
      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, optionCount).filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, optionCount - 1)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options,
        explanation: `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`,
        resistorValue
      };
    }
  };

  const generateWrongAnswers = (resistorValue: number, tolerance: string, optionCount: number): string[] => {
    // Generate more wrong answers for larger option counts
    const multipliers = [];
    if (optionCount >= 2) multipliers.push(0.1, 10);
    if (optionCount >= 3) multipliers.push(100);
    if (optionCount >= 4) multipliers.push(0.01, 0.5, 2, 1000);
    
    return multipliers.map(m => formatResistance(resistorValue * m, tolerance));
  };

  const formatResistance = (value: number, tolerance: string): string => {
    if (value >= 1000000) {
      const megaOhm = value / 1000000;
      const formatted = megaOhm % 1 === 0 ? megaOhm.toString() : megaOhm.toString().replace(/\.?0+$/, '');
      return `${formatted}MΩ ${tolerance}`;
    } else if (value >= 1000) {
      const kiloOhm = value / 1000;
      const formatted = kiloOhm % 1 === 0 ? kiloOhm.toString() : kiloOhm.toString().replace(/\.?0+$/, '');
      return `${formatted}kΩ ${tolerance}`;
    } else {
      return `${value}Ω ${tolerance}`;
    }
  };

  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    if (answered || hasTimeRunOut) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    const answer = answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim();
    if (!answer) return;
    
    setAnswered(true);
    setShowExplanation(true);
    
    const isCorrect = answer === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
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
    setShowExplanation(false);
    setCountdown(countdownTime);
    
    // Check if we should generate a new question for unlimited mode
    if (totalQuestions === null && nextQuestion >= questions.length) {
      const newQuestion = generateQuestion(resistorType);
      setQuestions([...questions, newQuestion]);
    }
    
    // Mark practice as complete when on last question (for limited mode)
    if (totalQuestions !== null && nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  };

  const progress = totalQuestions ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Practice complete state
  if (isPracticeComplete || hasTimeRunOut) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div className="flex-1 lg:ml-64">
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
                <h2 className="mb-4 text-3xl font-bold text-gray-900">Practice Complete!</h2>
                <p className="mb-6 text-gray-600">
                  {hasTimeRunOut 
                    ? 'Time limit reached!' 
                    : endedEarly
                    ? `Practice session ended. You answered ${score.total} question${score.total !== 1 ? 's' : ''}!`
                    : `You've completed all ${questions.length} questions!`}
                </p>
                {score.total > 0 && (
                  <div className="mb-6 rounded-xl bg-orange-50 p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-semibold text-orange-900">
                        Score: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                )}
                <Link
                  href="/learn/self/practice"
                  className="inline-block w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700"
                >
                  Back to Practice Mode
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
          {/* Compact Header */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-md">
            <button 
              onClick={handleEndPractice}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-orange-600 hover:text-orange-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline font-medium">Custom Practice</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {timeRemaining !== null && (
                <div className="text-center">
                  <div className="text-base sm:text-lg font-bold text-purple-600">{formatTime(timeRemaining)}</div>
                  <div className="text-xs text-gray-500">Time Left</div>
                </div>
              )}
              {totalQuestions && (
                <div className="text-center">
                  <div className="text-base sm:text-lg font-bold text-gray-900">{currentQuestion + 1}/{totalQuestions}</div>
                  <div className="text-xs text-gray-500">Question</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              <button
                onClick={handleEndPractice}
                className="ml-2 sm:ml-4 rounded-lg bg-red-500 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                <span className="hidden sm:inline">End Practice</span>
                <span className="sm:hidden">End</span>
              </button>
            </div>
          </div>
          
          {/* Compact Progress Bar */}
          {totalQuestions && (
            <div className="mb-4 sm:mb-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Countdown Timer */}
          {countdownTime && countdown !== null && !answered && (
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 border-2 border-red-200">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg sm:text-xl font-bold text-red-600">{countdown}s</span>
              </div>
            </div>
          )}

          {/* Question Card */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg">
            {/* Resistor Display */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <ResistorDisplay
                bands={currentQ.bands}
                showAnswer={showExplanation}
                answer={currentQ.correctAnswer}
                isCorrect={selectedAnswer === currentQ.correctAnswer}
                type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
              />
            </div>

            {/* Question */}
            <div className="mb-4 sm:mb-6 text-center">
              <h2 className="mb-2 sm:mb-4 text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                What is the resistance value of this resistor?
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Read the color bands to determine the resistance and tolerance
              </p>
            </div>

            {/* Answer Options - Multiple Choice */}
            {answerType === 'multiple_choice' && (
            <div className="mb-4 sm:mb-6 grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
              {currentQ.options.map((option: string, index: number) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQ.correctAnswer;
                const isWrong = isSelected && !isCorrect;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={answered || hasTimeRunOut}
                    className={`rounded-lg sm:rounded-xl border-2 px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold transition-all ${
                      answered && isCorrect
                        ? 'border-green-600 bg-green-100 text-green-900'
                        : answered && isWrong
                        ? 'border-red-600 bg-red-100 text-red-900'
                        : isSelected
                        ? 'border-orange-600 bg-orange-200 text-orange-900'
                        : 'border-gray-400 bg-white text-gray-900 hover:border-orange-400 hover:bg-orange-50'
                    } ${answered || hasTimeRunOut ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            )}

            {/* Fill-in-the-blank Answer */}
            {answerType === 'fill_in' && (
            <div className="mb-4 sm:mb-6 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={numberValue}
                  onChange={(e) => setNumberValue(e.target.value)}
                  disabled={answered || hasTimeRunOut}
                  placeholder="Value"
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-base sm:text-lg ${
                    answered
                      ? typedAnswer.trim() === currentQ.correctAnswer
                        ? 'border-green-600 bg-green-100 text-gray-900'
                        : 'border-red-600 bg-red-100 text-gray-900'
                      : 'border-gray-400 text-gray-900 focus:border-orange-600 focus:ring-2 focus:ring-orange-300'
                  }`}
                />
                <div className="flex gap-1">
                  {['Ω', 'kΩ', 'MΩ'].map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setSelectedUnit(unit)}
                      disabled={answered || hasTimeRunOut}
                    className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                      selectedUnit === unit
                        ? 'border-orange-600 bg-orange-200 text-orange-900'
                        : 'border-gray-400 bg-white text-gray-800 hover:border-orange-400'
                    } ${answered || hasTimeRunOut ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    onClick={() => setToleranceValue(tolerance)}
                    disabled={answered || hasTimeRunOut}
                    className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all ${
                      toleranceValue === tolerance
                        ? 'border-orange-600 bg-orange-200 text-orange-900'
                        : 'border-gray-400 bg-white text-gray-800 hover:border-orange-400'
                    } ${answered || hasTimeRunOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {tolerance}
                  </button>
                ))}
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600">
                Preview: <strong>{typedAnswer || 'Enter value above'}</strong>
              </p>
            </div>
            )}

            {/* Action Button & Explanation */}
            <div className="space-y-3 sm:space-y-4">
              {/* Check Answer or Next Button */}
              {!answered ? (
                <div className="text-center">
                  <button
                    onClick={handleCheckAnswer}
                    disabled={(answerType === 'multiple_choice' && !selectedAnswer) || (answerType === 'fill_in' && !typedAnswer.trim()) || hasTimeRunOut}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
                  >
                    {totalQuestions === null 
                      ? 'Next Question' 
                      : (currentQuestion >= questions.length - 1 ? 'Practice Complete!' : 'Next Question')}
                  </button>
                </div>
              )}

              {/* Compact Explanation */}
              {showExplanation && (
                <div className={`rounded-xl border-2 p-4 ${
                  (answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer
                    ? 'border-green-400 bg-green-100'
                    : 'border-red-400 bg-red-100'
                }`}>
                  <div className="mb-2 flex items-center gap-2">
                    {(answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer ? (
                      <>
                        <svg className="h-5 w-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-green-900">Correct!</h3>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-red-900">Incorrect</h3>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-900">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* End Practice Confirmation Dialog */}
      {showEndConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-20">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">End Practice Session?</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to end this practice session? Your progress will be saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelEndPractice}
                className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                No, Continue
              </button>
              <button
                onClick={confirmEndPractice}
                className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700"
              >
                Yes, End Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomPracticeStartPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CustomPracticeContent />
    </Suspense>
  );
}

