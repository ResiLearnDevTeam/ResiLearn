'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QuickPracticePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate initial questions
    generateQuestions();
    setIsLoading(false);
  }, []);

  const generateQuestions = () => {
    // Generate random 4-band resistor questions
    const generatedQuestions = Array.from({ length: 10 }, () => generateQuestion());
    setQuestions(generatedQuestions);
  };

  const generateQuestion = () => {
    // Color codes for 4-band resistors
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { gold: '±5%', silver: '±10%' }
    };

    const bands = [
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
      Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
    ];

    const value = `${colorCodes.digit[bands[0]]}${colorCodes.digit[bands[1]]}`;
    const multiplier = colorCodes.multiplier[bands[2]];
    const tolerance = colorCodes.tolerance[bands[3]];
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
      explanation: `${bands[0]}(${colorCodes.digit[bands[0]]}) - ${bands[1]}(${colorCodes.digit[bands[1]]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue)}, ${bands[3]}(${tolerance})`,
      resistorValue
    };
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
      setScore({ ...score, correct: score.correct + 1, total: score.total + 1 });
    } else {
      setScore({ ...score, total: score.total + 1 });
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuestion + 1);
    setAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
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
        <main className="container mx-auto px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Link href="/learn/practice" className="text-orange-600 hover:text-orange-700 mb-2 inline-flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Practice
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Quick Practice - 4-Band</h1>
                <p className="text-gray-600">Learn at your own pace with instant feedback</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{score.correct}/{score.total}</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            {/* Resistor Display */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                {/* Resistor Container */}
                <div className="flex h-40 items-center">
                  {/* Left Lead */}
                  <div className="h-3 w-12 bg-gradient-to-b from-gray-300 to-gray-500"></div>
                  
                  {/* Resistor Body with realistic spacing */}
                  <div className="relative flex h-24 w-56 items-center overflow-hidden rounded-lg bg-gradient-to-br from-amber-200 via-amber-100 to-amber-200 shadow-inner">
                    {/* Metallic coating effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    
                    {/* Color Bands with realistic spacing */}
                    <div className="relative z-10 flex h-full w-full items-center justify-center">
                      {currentQ.bands.map((color: string, index: number) => {
                        const isLastBand = index === currentQ.bands.length - 1;
                        const bandWidth = 20;
                        const gapWidth = 3;
                        
                        return (
                          <div key={index} className="flex items-center">
                            <div 
                              className={`${getColorClass(color)} border border-gray-400/30 shadow-sm`}
                              style={{ 
                                height: '80px',
                                width: `${bandWidth}px`
                              }}
                            />
                            {!isLastBand && (
                              <div 
                                className="bg-gradient-to-br from-amber-100 to-amber-200"
                                style={{ 
                                  height: '80px',
                                  width: `${gapWidth}px`
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Right Lead */}
                  <div className="h-3 w-12 bg-gradient-to-b from-gray-500 to-gray-300"></div>
                </div>

                {/* Answer Display (after checking) */}
                {showExplanation && (
                  <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-4 py-2 text-center font-bold shadow-lg ${
                    selectedAnswer === currentQ.correctAnswer 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentQ.correctAnswer}
                  </div>
                )}
              </div>
            </div>

            {/* Question */}
            <div className="mb-6 text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                What is the resistance value of this resistor?
              </h2>
              <p className="text-gray-600">
                Read the color bands to determine the resistance and tolerance
              </p>
            </div>

            {/* Answer Options */}
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              {currentQ.options.map((option: string, index: number) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQ.correctAnswer;
                const isWrong = isSelected && !isCorrect;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={answered}
                    className={`rounded-xl border-2 px-6 py-4 text-left font-semibold transition-all ${
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

            {/* Check Answer Button */}
            {!answered && (
              <div className="text-center">
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Check Answer
                </button>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className={`mt-6 rounded-xl border-2 p-6 ${
                selectedAnswer === currentQ.correctAnswer
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="mb-2 flex items-center gap-2">
                  {selectedAnswer === currentQ.correctAnswer ? (
                    <>
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-bold text-green-800">Correct!</h3>
                    </>
                  ) : (
                    <>
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-bold text-red-800">Incorrect</h3>
                    </>
                  )}
                </div>
                <p className="text-gray-700">{currentQ.explanation}</p>
              </div>
            )}

            {/* Continue Button (after checking) */}
            {answered && currentQuestion < questions.length - 1 && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleNextQuestion}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper function to get color class
function getColorClass(color: string): string {
  const colorMap: { [key: string]: string } = {
    black: 'bg-black',
    brown: 'bg-amber-900',
    red: 'bg-red-600',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-400',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    violet: 'bg-purple-600',
    gray: 'bg-gray-400',
    white: 'bg-white border-gray-400',
    gold: 'bg-yellow-600',
    silver: 'bg-gray-300',
  };
  return colorMap[color.toLowerCase()] || 'bg-gray-200';
}

