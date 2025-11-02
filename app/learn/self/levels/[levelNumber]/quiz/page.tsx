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
      
      if (level.timeLimit) {
        setTimeRemaining(level.timeLimit * 60); // Convert minutes to seconds
      }
    }
  }, [level]);

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
          const passed = accuracy >= level.passScore;
          
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
              questions: questions.map((q, idx) => ({
                bands: q.bands,
                correctAnswer: q.correctAnswer,
                userAnswer: idx < questions.length ? q.userAnswer : null,
                isCorrect: idx < questions.length ? q.userAnswer === q.correctAnswer : false
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
    const generatedQuestions = Array.from({ length: level.questionCount }, () => generateQuestion(level.type));
    setQuestions(generatedQuestions);
  };

  const generateQuestion = (type: string) => {
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

      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, 4).filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options,
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

      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, 4).filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options,
        explanation: `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`,
        resistorValue,
        userAnswer: null as string | null
      };
    }
  };

  const generateWrongAnswers = (resistorValue: number, tolerance: string, optionCount: number): string[] => {
    const multipliers = [0.1, 10, 100];
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    if (answered || hasTimeRunOut) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || hasTimeRunOut) return;
    
    // Store user answer
    currentQ.userAnswer = selectedAnswer;
    
    setAnswered(true);
    setShowExplanation(true);
    
    if (selectedAnswer === currentQ.correctAnswer) {
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
    setShowExplanation(false);
    
    // Mark quiz as complete when on last question
    if (nextQuestion >= questions.length) {
      setIsQuizComplete(true);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

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

  // Quiz complete state
  if ((isQuizComplete || hasTimeRunOut) && !currentQ) {
    const accuracy = (score.correct / score.total) * 100;
    const passed = accuracy >= level.passScore;
    
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

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href="/learn/self/learningpath"
                    className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700"
                  >
                    Back to Learning Path
                  </Link>
                  {!passed && (
                    <Link
                      href={`/learn/self/levels/${level.number}/quiz`}
                      className="block w-full rounded-xl border-2 border-orange-300 bg-white px-6 py-3 text-center font-semibold text-orange-700 transition-colors hover:bg-orange-50"
                    >
                      Try Again
                    </Link>
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
                isCorrect={selectedAnswer === currentQ.correctAnswer}
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

            {/* Answer Options */}
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

            {/* Action Button & Explanation */}
            <div className="space-y-3 sm:space-y-4">
              {!answered ? (
                <div className="text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer || hasTimeRunOut}
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
                  selectedAnswer === currentQ.correctAnswer
                    ? 'border-green-400 bg-green-100'
                    : 'border-red-400 bg-red-100'
                }`}>
                  <div className="mb-2 flex items-center gap-2">
                    {selectedAnswer === currentQ.correctAnswer ? (
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

