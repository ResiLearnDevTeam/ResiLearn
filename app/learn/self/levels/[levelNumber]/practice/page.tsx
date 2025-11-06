'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';

function LevelPracticeContent() {
  const params = useParams();
  const levelNumber = params.levelNumber as string;
  
  const [level, setLevel] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);

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
    // Generate random resistor questions based on level type
    if (!level) return;
    const generatedQuestions = Array.from({ length: 10 }, () => generateQuestion(level.type));
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
        resistorValue
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
        resistorValue
      };
    }
  };

  const generateWrongAnswers = (correctValue: number, tolerance: string, count: number): string[] => {
    const wrongAnswers: string[] = [];
    while (wrongAnswers.length < count) {
      const variance = (Math.random() - 0.5) * 0.5; // ±25%
      const wrongValue = correctValue * (1 + variance);
      const wrongAnswer = formatResistance(wrongValue, tolerance);
      if (!wrongAnswers.includes(wrongAnswer) && wrongAnswer !== formatResistance(correctValue, tolerance)) {
        wrongAnswers.push(wrongAnswer);
      }
    }
    return wrongAnswers;
  };

  const formatResistance = (value: number, tolerance: string): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}MΩ${tolerance}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}kΩ${tolerance}`;
    } else {
      return `${value.toFixed(0)}Ω${tolerance}`;
    }
  };

  useEffect(() => {
    fetchLevelData();
  }, [levelNumber]);

  useEffect(() => {
    if (level) {
      // Generate initial questions
      generateQuestions();
      // Reset quiz state
      setCurrentQuestion(0);
      setScore({ correct: 0, total: 0 });
      setAnswered(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setStartTime(Date.now());
      setIsLoading(false);
    }
  }, [level]);

  const currentQ = questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    if (answered) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);
    setShowExplanation(true);
    
    if (answer === currentQ?.correctAnswer) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setAnswered(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
      
      // Generate more questions if needed (for unlimited practice)
      if (nextQuestion >= questions.length - 1) {
        const newQuestion = generateQuestion(level.type);
        setQuestions([...questions, newQuestion]);
      }
    }
  };

  // Progress is always 0% for unlimited practice
  const progress = 0;

  if (isLoading || !level || !currentQ) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
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
      <LeftSidebar />

      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
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
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-gray-900">{currentQuestion + 1}</div>
                <div className="text-xs text-gray-500">Question</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
            </div>
          </div>
          
          {/* Compact Progress Bar - Hidden for unlimited practice */}
          <div className="mb-4 sm:mb-6 hidden">
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
                What is the resistance value?
              </h2>
            </div>

            {/* Answer Options */}
            <div className="mb-6 grid gap-2 sm:gap-3 md:grid-cols-2">
              {currentQ.options.map((option: string, index: number) => {
                let buttonClass = "w-full rounded-lg px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg font-semibold transition-all border-2 ";
                
                if (answered) {
                  if (option === currentQ.correctAnswer) {
                    buttonClass += "bg-green-100 border-green-600 text-green-900 cursor-default";
                  } else if (option === selectedAnswer && option !== currentQ.correctAnswer) {
                    buttonClass += "bg-red-100 border-red-600 text-red-900 cursor-default";
                  } else {
                    buttonClass += "bg-gray-100 border-gray-400 text-gray-600 cursor-default";
                  }
                } else {
                  buttonClass += "bg-white border-gray-400 text-gray-900 hover:border-orange-600 hover:bg-orange-50 cursor-pointer";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={buttonClass}
                    disabled={answered}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={`mb-6 rounded-lg border-2 p-4 ${
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
                      <span className="font-bold text-green-900">Correct!</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-bold text-red-900">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-900">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Question Button */}
            {answered && (
              <div className="flex justify-center">
                <button
                  onClick={handleNextQuestion}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-base sm:text-lg font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700"
                >
                  Next Question
                </button>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="mt-6 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">{score.total}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">{score.correct}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LevelPracticePage() {
  return <LevelPracticeContent />;
}