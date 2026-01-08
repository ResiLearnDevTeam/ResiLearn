'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import { formatResistance } from '@/lib/resistorUtils';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';
import { ArrowLeft, ListChecks, PenLine, Paintbrush, CheckCircle2, Trophy, RotateCcw, Home } from 'lucide-react';

function QuickPracticeContent() {
  const searchParams = useSearchParams();
  const resistorType = searchParams.get('type') || 'FOUR_BAND';
  const answerType = searchParams.get('answerType') || 'multiple_choice';
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [numberValue, setNumberValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('Ω');
  const [toleranceValue, setToleranceValue] = useState<string>('±5%');
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
  const [currentBandIndex, setCurrentBandIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);

  const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;

  useEffect(() => {
    generateQuestions();
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('±5%');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    setCurrentBandIndex(0);
    setShowResult(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setQuestionHistory([]);
    setIsLoading(false);
  }, [resistorType, answerType]);

  // Save session when practice is complete
  useEffect(() => {
    if (isPracticeComplete && !sessionSaved && score.total > 0) {
      const saveSession = async () => {
        try {
          const accuracy = (score.correct / score.total) * 100;
          const elapsedTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
          const deepAnalytics = calculateDeepAnalytics(questionHistory);
          
          const response = await fetch('/api/practice-sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              presetId: null,
              presetName: `ฝึกด่วน - ${getAnswerTypeName()}`,
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
                totalQuestions: questions.length,
                difficulty: 'medium',
                analytics: { deepAnalytics }
              },
              questions: questionHistory
            })
          });

          if (response.ok) setSessionSaved(true);
        } catch (error) {
          console.error('Error saving practice session:', error);
        }
      };
      saveSession();
    }
  }, [isPracticeComplete, sessionSaved, questionHistory, resistorType, answerType]);

  const getAnswerTypeName = () => {
    switch (answerType) {
      case 'multiple_choice': return 'ตัวเลือก';
      case 'fill_in': return 'เติมคำ';
      case 'color_selection': return 'เลือกสี';
      default: return 'ตัวเลือก';
    }
  };

  const getAnswerTypeIcon = () => {
    switch (answerType) {
      case 'multiple_choice': return ListChecks;
      case 'fill_in': return PenLine;
      case 'color_selection': return Paintbrush;
      default: return ListChecks;
    }
  };

  const generateQuestions = () => {
    const isReverse = answerType === 'color_selection';
    const generatedQuestions = Array.from({ length: 10 }, () => generateQuestion(resistorType, isReverse));
    setQuestions(generatedQuestions);
  };

  const generateQuestion = (type: string, isReverse: boolean = false) => {
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
    };

    if (isReverse) {
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

        return { bands, correctAnswer, correctBands: bands, resistorValue, tolerance, questionType: 'reverse' };
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

        return { bands: [], correctAnswer, correctBands: bands, resistorValue, tolerance, questionType: 'reverse' };
      }
    }

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

      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, 4, type).filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return { bands, correctAnswer, options, questionType: 'normal', resistorValue, tolerance };
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

      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, 4, type).filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return { bands, correctAnswer, options, questionType: 'normal', resistorValue, tolerance };
    }
  };

  const generateWrongAnswers = (correctResistorValue: number, correctTolerance: string, optionCount: number, resType: string): string[] => {
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
    };

    const wrongAnswers: string[] = [];
    const usedValues = new Set<number>([correctResistorValue]);
    
    const generateRandomResistor = (): number => {
      const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
      if (resType === 'FIVE_BAND') {
        const digit1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
        const digit2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const digit3 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const multiplier = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
        return parseInt(`${digit1}${digit2}${digit3}`) * multiplier;
      } else {
        const digit1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
        const digit2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const multiplier = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
        return parseInt(`${digit1}${digit2}`) * multiplier;
      }
    };

    const closeMultipliers = [0.5, 0.8, 1.2, 1.5, 2, 0.7, 1.3].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < 2 && i < closeMultipliers.length; i++) {
      const multiplier = closeMultipliers[i];
      const closeValue = Math.round(correctResistorValue * multiplier);
      if (closeValue > 0 && closeValue !== correctResistorValue && !usedValues.has(closeValue)) {
        usedValues.add(closeValue);
        const tolerance = Math.random() < 0.5 ? correctTolerance : Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(closeValue, tolerance));
      }
    }
    
    let attempts = 0;
    while (wrongAnswers.length < optionCount - 1 && attempts < 100) {
      attempts++;
      const randomValue = generateRandomResistor();
      if (!usedValues.has(randomValue)) {
        usedValues.add(randomValue);
        const tolerance = Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(randomValue, tolerance));
      }
    }
    
    return wrongAnswers;
  };

  const currentQ = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Color options for color selection mode
  const colorOptions = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver']
  };

  const getColorCode = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      black: '#1a1a1a', brown: '#8B4513', red: '#DC143C', orange: '#FF6600',
      yellow: '#FFD700', green: '#228B22', blue: '#0066CC', violet: '#8B00FF',
      gray: '#808080', white: '#F5F5F5', gold: '#DAA520', silver: '#C0C0C0',
    };
    return colorMap[color.toLowerCase()] || '#CCCCCC';
  };

  const getColorName = (color: string): string => {
    const nameMap: { [key: string]: string } = {
      black: 'ดำ', brown: 'น้ำตาล', red: 'แดง', orange: 'ส้ม',
      yellow: 'เหลือง', green: 'เขียว', blue: 'น้ำเงิน', violet: 'ม่วง',
      gray: 'เทา', white: 'ขาว', gold: 'ทอง', silver: 'เงิน',
    };
    return nameMap[color.toLowerCase()] || color;
  };

  const getBandLabel = (index: number): string => {
    const is5Band = resistorType === 'FIVE_BAND';
    if (is5Band) {
      if (index === 0) return 'หลักที่ 1';
      if (index === 1) return 'หลักที่ 2';
      if (index === 2) return 'หลักที่ 3';
      if (index === 3) return 'ตัวคูณ';
      if (index === 4) return 'ความคลาดเคลื่อน';
    } else {
      if (index === 0) return 'หลักที่ 1';
      if (index === 1) return 'หลักที่ 2';
      if (index === 2) return 'ตัวคูณ';
      if (index === 3) return 'ความคลาดเคลื่อน';
    }
    return '';
  };

  const getAvailableColors = (index: number): string[] => {
    const is5Band = resistorType === 'FIVE_BAND';
    if (is5Band) {
      if (index === 0) return colorOptions.digit.filter(c => c !== 'black');
      else if (index >= 1 && index <= 2) return colorOptions.digit;
      else if (index === 3) return colorOptions.multiplier;
      else if (index === 4) return colorOptions.tolerance;
    } else {
      if (index === 0) return colorOptions.digit.filter(c => c !== 'black');
      else if (index === 1) return colorOptions.digit;
      else if (index === 2) return colorOptions.multiplier;
      else if (index === 3) return colorOptions.tolerance;
    }
    return [];
  };

  const handleAnswerSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    // Auto check for multiple choice
    setTimeout(() => {
      checkAnswer(answer);
    }, 150);
  };

  const handleColorSelect = (color: string) => {
    if (answered) return;
    const newBands = [...selectedBands];
    newBands[currentBandIndex] = color;
    setSelectedBands(newBands);

    // Auto advance to next band
    if (currentBandIndex < expectedBandsCount - 1) {
      setTimeout(() => {
        setCurrentBandIndex(currentBandIndex + 1);
      }, 200);
    }
  };

  const checkAnswer = (answer?: string) => {
    let userAnswer: string | null = null;
    let correct = false;

    if (answerType === 'color_selection') {
      const bandsToCheck = [...selectedBands];
      while (bandsToCheck.length < expectedBandsCount) bandsToCheck.push('');
      correct = bandsToCheck.every((band, index) => band === currentQ.correctBands[index]);
      userAnswer = bandsToCheck.join('-');
    } else if (answerType === 'multiple_choice') {
      userAnswer = answer || selectedAnswer;
      if (!userAnswer) return;
      correct = userAnswer === currentQ.correctAnswer;
    } else {
      const typedAnswer = `${numberValue}${selectedUnit} ${toleranceValue}`;
      userAnswer = typedAnswer.trim();
      if (!numberValue) return;
      correct = userAnswer === currentQ.correctAnswer;
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    setAnswered(true);
    
    if (correct) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    // Store question history
    const questionRecord = {
      questionNumber: currentQuestion + 1,
      bands: answerType === 'color_selection' ? selectedBands : currentQ.bands,
      correctAnswer: answerType === 'color_selection' ? currentQ.correctBands.join('-') : currentQ.correctAnswer,
      userAnswer,
      isCorrect: correct,
      resistorValue: currentQ.resistorValue,
      questionType: currentQ.questionType || 'normal',
      resistorType,
      answerType,
      correctBands: currentQ.correctBands || currentQ.bands,
      userBands: answerType === 'color_selection' ? selectedBands : [],
    };
    setQuestionHistory(prev => [...prev, questionRecord]);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('±5%');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    setCurrentBandIndex(0);
    setShowResult(false);
    
    if (nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('±5%');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    setCurrentBandIndex(0);
    setShowResult(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setQuestionHistory([]);
    generateQuestions();
  };

  const AnswerTypeIcon = getAnswerTypeIcon();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="text-gray-600 font-medium">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  // Practice complete state
  if (isPracticeComplete) {
    const finalAccuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const isExcellent = finalAccuracy >= 80;
    const isGood = finalAccuracy >= 60 && finalAccuracy < 80;
    
    return (
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
            <div className="text-center px-6 max-w-lg">
              <div className="mb-8 flex justify-center">
                <div className={`flex h-28 w-28 items-center justify-center rounded-full shadow-xl ${
                  isExcellent ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  isGood ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                  'bg-gradient-to-br from-blue-400 to-blue-500'
                }`}>
                  <Trophy className="h-14 w-14 text-white" />
                </div>
              </div>
              
              <h1 className="mb-3 text-4xl font-extrabold text-gray-900">
                {isExcellent ? 'ยอดเยี่ยม!' : isGood ? 'ดีมาก!' : 'ฝึกฝนเสร็จสิ้น!'}
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                คุณได้ทำครบทั้ง {questions.length} ข้อแล้ว
              </p>
              
              <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{score.correct}</div>
                    <div className="text-sm text-gray-500">ถูกต้อง</div>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <div className="text-3xl font-bold text-gray-400">{score.total - score.correct}</div>
                    <div className="text-sm text-gray-500">ผิด</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      isExcellent ? 'text-green-600' : isGood ? 'text-blue-600' : 'text-gray-600'
                    }`}>{finalAccuracy}%</div>
                    <div className="text-sm text-gray-500">ความแม่นยำ</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
                >
                  <RotateCcw className="h-5 w-5" />
                  ฝึกอีกครั้ง
                </button>
                <Link
                  href="/learn/self/practice"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-gray-200 px-6 py-4 font-bold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
                >
                  <Home className="h-5 w-5" />
                  กลับหน้าหลัก
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  return (
    <div className="flex h-screen bg-white">
      <LeftSidebar />
      
      <div className="flex-1 flex flex-col" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
        {/* Header with gradient */}
        <div className="relative z-10 flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <Link 
              href="/learn/self/practice/quick/select"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">กลับ</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <AnswerTypeIcon className="h-5 w-5" />
              <span className="font-bold text-sm sm:text-base">{getAnswerTypeName()}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">{currentQuestion + 1}/{questions.length}</div>
                <div className="text-xs text-white/70">คำถาม</div>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-lg font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  {score.correct}
                </div>
                <div className="text-xs text-white/70">ถูกต้อง</div>
              </div>
            </div>
          </div>
          
          <div className="px-4 lg:px-6 pb-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 space-y-6">
              
              {/* Resistor Display */}
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  {answerType === 'color_selection' ? (
                    <ResistorDisplay
                      bands={selectedBands.map(b => b || 'gray')}
                      type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                      highlightBand={!showResult ? currentBandIndex : undefined}
                    />
                  ) : (
                    <ResistorDisplay
                      bands={currentQ.bands}
                      type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                    />
                  )}
                </div>
              </div>

              {/* Question / Target Value */}
              {answerType === 'color_selection' ? (
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">เลือกแถบสีให้ตรงกับค่า</p>
                  <div className="inline-block rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-8 py-4 shadow-lg">
                    <p className="text-2xl lg:text-3xl font-extrabold text-white">
                      {currentQ.correctAnswer}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-lg font-semibold text-gray-700">
                  ค่าความต้านทานของตัวต้านทานนี้คือเท่าไร?
                </p>
              )}

              {/* Result Display */}
              {showResult && (
                <div className="py-4">
                  {isCorrect ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-3 animate-bounce">
                        <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-extrabold text-green-600">ถูกต้อง!</h3>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg mb-3">
                        <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-extrabold text-red-600 mb-3">ไม่ถูกต้อง</h3>
                      <div className="flex items-center gap-4">
                        <div className="text-center px-4 py-2 bg-red-50 rounded-xl border-2 border-red-200">
                          <p className="text-xs text-gray-500">คุณตอบ</p>
                          <p className="font-bold text-red-700">
                            {answerType === 'color_selection' 
                              ? selectedBands.map(b => getColorName(b)).join(' - ')
                              : answerType === 'multiple_choice' 
                                ? selectedAnswer 
                                : `${numberValue}${selectedUnit} ${toleranceValue}`}
                          </p>
                        </div>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <div className="text-center px-4 py-2 bg-green-50 rounded-xl border-2 border-green-300">
                          <p className="text-xs text-gray-500">คำตอบที่ถูก</p>
                          <p className="font-bold text-green-700">
                            {answerType === 'color_selection'
                              ? currentQ.correctBands.map((b: string) => getColorName(b)).join(' - ')
                              : currentQ.correctAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Answer Options */}
              {!showResult && (
                <>
                  {/* Multiple Choice */}
                  {answerType === 'multiple_choice' && (
                    <div className="grid grid-cols-2 gap-3 lg:gap-4">
                      {currentQ.options.map((option: string, index: number) => {
                        const isSelected = selectedAnswer === option;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAnswerSelect(option)}
                            disabled={answered}
                            className={`
                              p-4 lg:p-5 rounded-xl border-2 text-center transition-colors
                              ${isSelected
                                ? 'border-orange-500 bg-orange-500 text-white shadow-lg'
                                : 'border-gray-200 bg-white text-gray-800 hover:border-orange-500 hover:bg-orange-50'
                              }
                              ${answered ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:bg-orange-100'}
                            `}
                          >
                            <span className="text-lg lg:text-xl font-bold">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Fill-in */}
                  {answerType === 'fill_in' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 justify-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={numberValue}
                          onChange={(e) => setNumberValue(e.target.value)}
                          disabled={answered}
                          placeholder="ค่า"
                          className="w-32 lg:w-40 text-center text-2xl lg:text-3xl font-bold rounded-xl border-2 border-gray-200 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                      
                      <div className="flex justify-center gap-2">
                        {['Ω', 'kΩ', 'MΩ'].map((unit) => (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => setSelectedUnit(unit)}
                            disabled={answered}
                            className={`
                              px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all
                              ${selectedUnit === unit
                                ? 'border-orange-500 bg-orange-500 text-white'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-400'
                              }
                            `}
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex justify-center gap-2 flex-wrap">
                        {['±1%', '±2%', '±5%', '±10%'].map((tol) => (
                          <button
                            key={tol}
                            type="button"
                            onClick={() => setToleranceValue(tol)}
                            disabled={answered}
                            className={`
                              px-4 py-2 rounded-xl border-2 font-semibold transition-all
                              ${toleranceValue === tol
                                ? 'border-orange-500 bg-orange-500 text-white'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-400'
                              }
                            `}
                          >
                            {tol}
                          </button>
                        ))}
                      </div>
                      
                      <p className="text-center text-sm text-gray-500">
                        คำตอบ: <span className="font-bold text-gray-700">{numberValue ? `${numberValue}${selectedUnit} ${toleranceValue}` : '-'}</span>
                      </p>
                    </div>
                  )}

                  {/* Color Selection */}
                  {answerType === 'color_selection' && (
                    <div className="space-y-4">
                      {/* Band indicator */}
                      <div className="flex items-center justify-center gap-4">
                        <div className="rounded-xl border-2 border-orange-400 bg-orange-50 px-4 py-2">
                          <span className="text-sm lg:text-base font-bold text-orange-800">
                            {getBandLabel(currentBandIndex)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: expectedBandsCount }).map((_, index) => (
                            <div
                              key={index}
                              className={`w-3 h-3 rounded-full transition-all ${
                                index < currentBandIndex
                                  ? 'bg-green-500'
                                  : index === currentBandIndex
                                  ? 'bg-orange-500 ring-2 ring-orange-300'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Color grid */}
                      <div className="grid grid-cols-5 gap-3 max-w-xl mx-auto">
                        {getAvailableColors(currentBandIndex).map((color) => {
                          const itemColorCode = getColorCode(color);
                          const isSelected = selectedBands[currentBandIndex] === color;
                          const isLightColor = ['yellow', 'white', 'gold', 'silver'].includes(color);
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => handleColorSelect(color)}
                              disabled={answered}
                              className={`
                                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-colors
                                ${isSelected
                                  ? 'border-orange-500 bg-orange-50 shadow-lg ring-2 ring-orange-300'
                                  : 'border-gray-200 bg-white hover:border-orange-500 hover:bg-orange-50'
                                }
                                ${answered ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:bg-orange-100'}
                              `}
                            >
                              <div
                                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg shadow-md mb-1.5 ${
                                  isLightColor ? 'border-2 border-gray-300' : 'border border-gray-200'
                                }`}
                                style={{ backgroundColor: itemColorCode }}
                              />
                              <span className={`text-xs font-semibold ${
                                isSelected ? 'text-orange-700' : 'text-gray-600'
                              }`}>
                                {getColorName(color)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
          </div>
        </div>

        {/* Footer button */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-4 lg:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            {!showResult ? (
              <button
                onClick={() => checkAnswer()}
                disabled={
                  (answerType === 'multiple_choice' && !selectedAnswer) ||
                  (answerType === 'fill_in' && !numberValue) ||
                  (answerType === 'color_selection' && selectedBands.some(b => !b))
                }
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ตรวจคำตอบ
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
              >
                {currentQuestion >= questions.length - 1 ? 'ดูผลลัพธ์' : 'ต่อไป'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QuickPracticePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div className="flex-1 flex items-center justify-center" style={{ marginLeft: 'var(--sidebar-width, 288px)' }}>
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="text-gray-600 font-medium">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <QuickPracticeContent />
    </Suspense>
  );
}
