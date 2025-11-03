'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';

function LevelQuizContent() {
  const params = useParams();
  const router = useRouter();
  const levelNumber = params.levelNumber as string;
  
  const [level, setLevel] = useState<any>(null);
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
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [hasTimeRunOut, setHasTimeRunOut] = useState(false);

  useEffect(() => {
    fetchLevelData();
  }, [levelNumber]);

  useEffect(() => {
    if (level) {
      generateQuestions();
      setStartTime(Date.now());
      setSelectedAnswer(null);
      setTypedAnswer('');
      setNumberValue('');
      setSelectedUnit('Ω');
      setToleranceValue('±5%');
      
      if (level.timeLimit) {
        setTimeRemaining(level.timeLimit * 60); // Convert minutes to seconds
      }
    }
  }, [level]);

  // Combine number, unit, and tolerance into typedAnswer
  useEffect(() => {
    if (numberValue && selectedUnit && toleranceValue) {
      const formatted = `${numberValue}${selectedUnit} ${toleranceValue}`;
      setTypedAnswer(formatted);
    } else {
      setTypedAnswer('');
    }
  }, [numberValue, selectedUnit, toleranceValue]);

  // Total time limit timer
  const timeRemainingRef = useRef<number | null>(null);

  useEffect(() => {
    if (level && level.timeLimit) {
      setTimeRemaining(level.timeLimit * 60);
      timeRemainingRef.current = level.timeLimit * 60;
    }
  }, [level]);

  useEffect(() => {
    if (!level?.timeLimit || isQuizComplete || hasTimeRunOut) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = (prev === null || prev <= 1) ? 0 : prev - 1;
        timeRemainingRef.current = newTime;
        
        if (newTime === 0) {
          setHasTimeRunOut(true);
          setIsQuizComplete(true);
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [level?.timeLimit, isQuizComplete, hasTimeRunOut]);

  // Save session when quiz is complete
  useEffect(() => {
    if ((isQuizComplete || hasTimeRunOut) && !sessionSaved) {
      const saveQuizAttempt = async () => {
        try {
          const accuracy = (score.correct / score.total) * 100;
          const elapsedTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
          
          // Use 70% pass score for Level 1, otherwise use level.passScore
          const passThreshold = level.number === 1 ? 70 : level.passScore;
          const passed = accuracy >= passThreshold;
          
          const response = await fetch('/api/attempts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              levelId: level.id,
              mode: 'QUIZ',
              score: score.correct,
              percentage: accuracy,
              timeTaken: elapsedTime,
              passed: passed,
              questions: questions.map((q) => ({
                bands: q.bands,
                correctAnswer: q.correctAnswer,
                userAnswer: q.userAnswer || null,
                isCorrect: q.userAnswer === q.correctAnswer,
                answerType: q.answerType || 'multiple_choice',
                options: q.options || null,
                explanation: q.explanation
              }))
            })
          });

          if (response.ok) {
            setSessionSaved(true);
          }
        } catch (error) {
          console.error('Error saving quiz attempt:', error);
        }
      };
      
      saveQuizAttempt();
    }
  }, [isQuizComplete, hasTimeRunOut, sessionSaved]);

  const fetchLevelData = async () => {
    try {
      const response = await fetch('/api/levels');
      if (response.ok) {
        const levels = await response.json();
        const foundLevel = levels.find((l: any) => l.number === parseInt(levelNumber));
        if (foundLevel) {
          setLevel(foundLevel);
        }
      }
    } catch (error) {
      console.error('Error fetching level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = () => {
    if (!level) return;
    // Alternate between multiple choice and fill-in for variety
    const generatedQuestions = Array.from({ length: level.questionCount }, (_, index) => {
      const answerType = index % 2 === 0 ? 'multiple_choice' : 'fill_in'; // Alternate
      return generateQuestion(level.type, answerType, level.number);
    });
    setQuestions(generatedQuestions);
  };

  const generateQuestion = (type: string, answerType: string = 'multiple_choice', levelNumber: number = 1) => {
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
    };

    if (type === 'FIVE_BAND') {
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

      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, 4, levelNumber).filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options: answerType === 'multiple_choice' ? options : null,
        answerType,
        explanation: `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}) - ${bands[3]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[4]}(${tolerance})`,
        resistorValue,
        userAnswer: null as string | null
      };
    } else {
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

      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, 4, levelNumber).filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options: answerType === 'multiple_choice' ? options : null,
        answerType,
        explanation: `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`,
        resistorValue,
        userAnswer: null as string | null
      };
    }
  };

  const generateWrongAnswers = (resistorValue: number, tolerance: string, optionCount: number, levelNumber: number = 1): string[] => {
    // For Level 1 (Basic Colors), use easier wrong answers
    if (levelNumber === 1) {
      const easyMultipliers = [0.1, 0.5, 2, 10, 100];
      const wrongAnswers: string[] = [];
      const usedValues = new Set<number>([resistorValue]);
      
      for (const mult of easyMultipliers) {
        const wrongValue = Math.round(resistorValue * mult);
        if (wrongValue > 0 && !usedValues.has(wrongValue)) {
          usedValues.add(wrongValue);
          wrongAnswers.push(formatResistance(wrongValue, tolerance));
        }
        if (wrongAnswers.length >= optionCount - 1) break;
      }
      
      return wrongAnswers;
    }
    
    // For other levels, use medium difficulty
    const multipliers = [0.5, 0.8, 1.2, 2, 10];
    if (optionCount >= 4) multipliers.push(0.1, 0.3, 1.5, 100);
    return multipliers.slice(0, optionCount - 1).map(m => formatResistance(Math.round(resistorValue * m), tolerance));
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    if (answered || hasTimeRunOut) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return;
    
    const answer = currentQ.answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim();
    if (!answer || hasTimeRunOut) return;
    
    // Store user answer
    currentQ.userAnswer = answer;
    
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
    
    // Mark quiz as complete when on last question
    if (nextQuestion >= questions.length) {
      setIsQuizComplete(true);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Show loading or no questions state
  if (isLoading || !level || questions.length === 0) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  // Quiz complete state
  if ((isQuizComplete || hasTimeRunOut) && (!currentQ || currentQuestion >= questions.length)) {
    const accuracy = (score.correct / score.total) * 100;
    const passThreshold = level.number === 1 ? 70 : level.passScore;
    const passed = accuracy >= passThreshold;
    
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div className="flex-1 lg:ml-64">
          <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
                <div className="mb-6 flex justify-center">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full ${
                    passed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <svg className={`h-10 w-10 ${passed ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {passed ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                  {passed ? 'Congratulations!' : 'Keep Practicing!'}
                </h2>
                <p className="mb-6 text-gray-600">
                  {hasTimeRunOut ? 'Time limit reached!' : `You completed ${level.name}!`}
                </p>

                {/* Results */}
                <div className="mb-6 space-y-4">
                  <div className="rounded-xl bg-orange-50 p-4">
                    <div className="text-4xl font-bold text-orange-600">
                      {score.correct}/{score.total}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-blue-50 p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(accuracy)}%
                      </div>
                      <div className="text-xs text-gray-600">Accuracy</div>
                    </div>

                    <div className="rounded-xl bg-purple-50 p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(accuracy)}%
                      </div>
                      <div className="text-xs text-gray-600">Score</div>
                    </div>
                  </div>
                </div>

                {passed && (
                  <div className="mb-6 rounded-xl bg-green-50 p-4 border-2 border-green-200">
                    <p className="text-green-800 font-semibold">
                      ✅ Level {level.number} Completed! Next level unlocked.
                    </p>
                  </div>
                )}

                {/* Question Review */}
                <div className="mb-6 max-h-96 overflow-y-auto space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Question Review</h3>
                  {questions.map((q: any, index: number) => {
                    const isCorrect = q.userAnswer === q.correctAnswer;
                    return (
                      <div
                        key={index}
                        className={`rounded-lg border-2 p-3 ${
                          isCorrect
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            Question {index + 1}
                          </span>
                          {isCorrect ? (
                            <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                              Correct
                            </span>
                          ) : (
                            <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                              Incorrect
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Your Answer:</span>
                            <span className={`font-bold ${
                              isCorrect ? 'text-green-800' : 'text-red-800'
                            }`}>
                              {q.userAnswer || 'No answer'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Correct Answer:</span>
                            <span className="font-bold text-green-800">{q.correctAnswer}</span>
                          </div>
                          {q.explanation && (
                            <p className="text-xs text-gray-600 mt-2">
                              <span className="font-semibold">Explanation:</span> {q.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href="/learn/self/learningpath"
                    className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700"
                  >
                    Back to Learning Path
                  </Link>
                  {!passed && (
                    <button
                      onClick={() => {
                        // Reset quiz state
                        setCurrentQuestion(0);
                        setScore({ correct: 0, total: 0 });
                        setAnswered(false);
                        setSelectedAnswer(null);
                        setTypedAnswer('');
                        setNumberValue('');
                        setSelectedUnit('Ω');
                        setToleranceValue('±5%');
                        setShowExplanation(false);
                        setIsQuizComplete(false);
                        setSessionSaved(false);
                        setHasTimeRunOut(false);
                        setStartTime(Date.now());
                        generateQuestions();
                        if (level.timeLimit) {
                          setTimeRemaining(level.timeLimit * 60);
                        }
                      }}
                      className="w-full rounded-xl border-2 border-orange-300 bg-white px-6 py-3 text-center font-semibold text-orange-700 transition-colors hover:bg-orange-50"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
          {/* Compact Header */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-md">
            <Link href="/learn/self/learningpath" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-orange-600 hover:text-orange-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline font-medium">Learning Path</span>
            </Link>
            
            <div className="flex items-center gap-3 sm:gap-6">
              {timeRemaining !== null && (
                <div className="text-center">
                  <div className={`text-base sm:text-lg font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-purple-600'}`}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-xs text-gray-500">Time Left</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-gray-900">{currentQuestion + 1}/{questions.length}</div>
                <div className="text-xs text-gray-500">Question</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            </div>
          </div>
          
          {/* Compact Progress Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 md:p-8 shadow-lg">
            {/* Resistor Display */}
            <div className="mb-4 sm:mb-6 md:mb-8">
                <ResistorDisplay
                bands={currentQ.bands}
                showAnswer={showExplanation}
                answer={currentQ.correctAnswer}
                isCorrect={(currentQ.answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer}
                type={level.type as 'FOUR_BAND' | 'FIVE_BAND'}
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
            {currentQ.answerType === 'multiple_choice' && currentQ.options && (
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
            {currentQ.answerType === 'fill_in' && (
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
              {!answered ? (
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={(currentQ.answerType === 'multiple_choice' && !selectedAnswer) || (currentQ.answerType === 'fill_in' && !typedAnswer.trim()) || hasTimeRunOut}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
                  >
                    {currentQuestion >= questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </div>
              )}

              {/* Compact Explanation */}
              {showExplanation && (
                <div className={`rounded-xl border-2 p-4 ${
                  ((currentQ.answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer)
                    ? 'border-green-400 bg-green-100'
                    : 'border-red-400 bg-red-100'
                }`}>
                  <div className="mb-2 flex items-center gap-2">
                    {(currentQ.answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer ? (
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
    </div>
  );
}

export default function LevelQuizPage() {
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
      <LevelQuizContent />
    </Suspense>
  );
}

