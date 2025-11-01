'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';

function QuickPracticeContent() {
  const searchParams = useSearchParams();
  const resistorType = searchParams.get('type') || 'FOUR_BAND';
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState(0);
  const [showResultsModal, setShowResultsModal] = useState(false);

  useEffect(() => {
    // Generate initial questions
    generateQuestions();
    // Reset quiz state when resistor type changes
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setTotalTime(0);
    setShowResultsModal(false);
    setIsLoading(false);
  }, [resistorType]);

  // Save session when practice is complete
  useEffect(() => {
    if (isPracticeComplete && !sessionSaved && questions.length > 0 && score.total > 0) {
      savePracticeSession();
    }
  }, [isPracticeComplete, sessionSaved, questions.length, score]);

  const savePracticeSession = async () => {
    try {
      const accuracy = (score.correct / score.total) * 100;
      const elapsedTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
      
      const response = await fetch('/api/practice-sessions', {
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
            optionCount: 4,
            countdownTime: null,
            totalQuestions: questions.length,
            hasTimeLimit: false,
            timeLimit: null
          }
        })
      });

      if (response.ok) {
        setSessionSaved(true);
        setTotalTime(elapsedTime);
        setShowResultsModal(true);
        console.log('Practice session saved successfully');
      } else {
        console.error('Failed to save practice session');
      }
    } catch (error) {
      console.error('Error saving practice session:', error);
    }
  };

  const generateQuestions = () => {
    // Generate random resistor questions based on type
    const generatedQuestions = Array.from({ length: 10 }, () => generateQuestion(resistorType));
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
      const bands = [
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
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

      // Generate wrong answers
      const wrongAnswers = [
        formatResistance(resistorValue * 0.1, tolerance),
        formatResistance(resistorValue * 10, tolerance),
        formatResistance(resistorValue * 100, tolerance)
      ].filter(a => a !== correctAnswer);

      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options,
        explanation: `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}) - ${bands[3]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[4]}(${tolerance})`,
        resistorValue
      };
    } else {
      // 4-band resistor: 2 digits + multiplier + tolerance
      const bands = [
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
        Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
        Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
      ] as string[];

      const value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}`;
      const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier];
      const tolerance = colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance];
      const resistorValue = parseInt(value) * multiplier;
      const correctAnswer = formatResistance(resistorValue, tolerance);

      // Generate wrong answers
      const wrongAnswers = [
        formatResistance(resistorValue * 0.1, tolerance),
        formatResistance(resistorValue * 10, tolerance),
        formatResistance(resistorValue * 100, tolerance)
      ].filter(a => a !== correctAnswer);

      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options,
        explanation: `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`,
        resistorValue
      };
    }
  };

  const formatResistance = (value: number, tolerance: string): string => {
    if (value >= 1000000) {
      return `${value / 1000000}MΩ ${tolerance}`;
    } else if (value >= 1000) {
      return `${value / 1000}kΩ ${tolerance}`;
    } else {
      return `${value}Ω ${tolerance}`;
    }
  };

  const currentQ = questions[currentQuestion];

  const handleAnswerSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
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
    
    // Mark practice as complete when on last question
    if (nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
          {/* Compact Header */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-md">
            <Link href="/learn/practice" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-orange-600 hover:text-orange-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline font-medium">Practice</span>
            </Link>
            
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-gray-900">{currentQuestion + 1}/{questions.length}</div>
                <div className="text-xs text-gray-500">Question</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">Correct</div>
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
                    disabled={answered}
                    className={`rounded-lg sm:rounded-xl border-2 px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold transition-all ${
                      answered && isCorrect
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : answered && isWrong
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-800'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-orange-300 hover:bg-orange-50'
                    } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Action Button & Explanation */}
            <div className="space-y-3 sm:space-y-4">
              {/* Check Answer or Next Button */}
              {!answered ? (
                <div className="text-center">
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedAnswer}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestion >= questions.length - 1}
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion >= questions.length - 1 ? 'Practice Complete!' : 'Next Question'}
                  </button>
                </div>
              )}

              {/* Compact Explanation */}
              {showExplanation && (
                <div className={`rounded-xl border-2 p-4 ${
                  selectedAnswer === currentQ.correctAnswer
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="mb-2 flex items-center gap-2">
                    {selectedAnswer === currentQ.correctAnswer ? (
                      <>
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-green-800">Correct!</h3>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-red-800">Incorrect</h3>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{currentQ.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowResultsModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  (score.correct / score.total) * 100 >= 80
                    ? 'bg-green-100'
                    : (score.correct / score.total) * 100 >= 50
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
                }`}>
                  <svg className={`h-10 w-10 ${
                    (score.correct / score.total) * 100 >= 80
                      ? 'text-green-600'
                      : (score.correct / score.total) * 100 >= 50
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {score.correct === score.total ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                  </svg>
                </div>
              </div>

              <h2 className="mb-4 text-3xl font-bold text-gray-900">Practice Complete!</h2>

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
                      {Math.round((score.correct / score.total) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Accuracy</div>
                  </div>

                  <div className="rounded-xl bg-purple-50 p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600">Time</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/learn/practice"
                  className="block w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700"
                >
                  Back to Practice
                </Link>
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="block w-full rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-center font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuickPracticePage() {
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
      <QuickPracticeContent />
    </Suspense>
  );
}

