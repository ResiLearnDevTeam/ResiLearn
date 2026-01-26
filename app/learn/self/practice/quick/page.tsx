'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import ColorReadingBandByBand from '@/components/features/ColorReadingBandByBand';
import ColorToValueBandByBand from '@/components/features/ColorToValueBandByBand';
import { formatResistance, generateValueToColorBandQuestion, generateColorToValueBandQuestion, generateColorToValueQuestion } from '@/lib/resistorUtils';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';
import { ArrowLeft, ListChecks, PenLine, Paintbrush, CheckCircle2, Trophy, RotateCcw, Home, Layers, Palette } from 'lucide-react';

type Variant = 'value_to_color_band' | 'color_to_value_band' | 'color_to_value' | 'value_to_color_full';

function QuickPracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resistorType = (searchParams.get('type') || 'FOUR_BAND') as 'FOUR_BAND' | 'FIVE_BAND';
  const mode = searchParams.get('mode') || (searchParams.get('answerType') ? 'standard' : null);
  const colorReadingMode = searchParams.get('colorReadingMode');
  const answerType = searchParams.get('answerType') || 'multiple_choice';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [numberValue, setNumberValue] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('Ω');
  const [toleranceValue, setToleranceValue] = useState<string>('');
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

  const variant: Variant | null =
    mode === 'color_reading' && colorReadingMode === 'value_to_color' ? 'value_to_color_band'
    : mode === 'color_reading' && colorReadingMode === 'color_to_value' ? 'color_to_value_band'
    : mode === 'standard' && (answerType === 'multiple_choice' || answerType === 'fill_in') ? 'color_to_value'
    : mode === 'standard' && answerType === 'color_selection' ? 'value_to_color_full'
    : null;

  useEffect(() => {
    if (!variant) {
      router.replace('/learn/self/practice/quick/select');
      return;
    }
  }, [variant, router]);

  const generateWrongAnswers = useCallback((correctResistorValue: number, correctTolerance: string, optionCount: number, resType: string): string[] => {
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
    };
    const wrongAnswers: string[] = [];
    const usedValues = new Set<number>([correctResistorValue]);
    const generateRandomResistor = (): number => {
      const firstDigitColors = Object.keys(colorCodes.digit).filter(c => c !== 'black');
      if (resType === 'FIVE_BAND') {
        const d1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
        const d2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const d3 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const mult = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
        return parseInt(`${d1}${d2}${d3}`) * mult;
      } else {
        const d1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
        const d2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const mult = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
        return parseInt(`${d1}${d2}`) * mult;
      }
    };
    const closeMultipliers = [0.5, 0.8, 1.2, 1.5, 2, 0.7, 1.3].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 2 && i < closeMultipliers.length; i++) {
      const m = closeMultipliers[i];
      const v = Math.round(correctResistorValue * m);
      if (v > 0 && v !== correctResistorValue && !usedValues.has(v)) {
        usedValues.add(v);
        const t = Math.random() < 0.5 ? correctTolerance : Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(v, t));
      }
    }
    let attempts = 0;
    while (wrongAnswers.length < optionCount - 1 && attempts < 100) {
      attempts++;
      const v = generateRandomResistor();
      if (!usedValues.has(v)) {
        usedValues.add(v);
        wrongAnswers.push(formatResistance(v, Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)]));
      }
    }
    return wrongAnswers;
  }, []);

  const generateValueToColorFull = useCallback((type: 'FOUR_BAND' | 'FIVE_BAND') => {
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
    };
    const firstDigitColors = Object.keys(colorCodes.digit).filter(c => c !== 'black');
    if (type === 'FIVE_BAND') {
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
      return { bands: [], correctAnswer: formatResistance(resistorValue, tolerance), correctBands: bands, resistorValue, tolerance };
    } else {
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
      return { bands: [], correctAnswer: formatResistance(resistorValue, tolerance), correctBands: bands, resistorValue, tolerance };
    }
  }, []);

  const generateQuestions = useCallback(() => {
    if (!variant) return;
    const maxBand = resistorType === 'FIVE_BAND' ? 5 : 4;
    const out: any[] = [];
    if (variant === 'value_to_color_band') {
      for (let i = 0; i < 10; i++) {
        const bandIndex = Math.floor(Math.random() * maxBand);
        const q = generateValueToColorBandQuestion(resistorType, bandIndex);
        out.push({ ...q, variant: 'value_to_color_band' as const, bandIndex });
      }
    } else if (variant === 'color_to_value_band') {
      for (let i = 0; i < 10; i++) {
        const bandIndex = Math.floor(Math.random() * maxBand);
        const q = generateColorToValueBandQuestion(resistorType, bandIndex);
        out.push({ ...q, variant: 'color_to_value_band' as const, bandIndex });
      }
    } else if (variant === 'color_to_value') {
      for (let i = 0; i < 10; i++) {
        const q = generateColorToValueQuestion(resistorType, 4, 'medium');
        const wrong = generateWrongAnswers(q.resistorValue, q.tolerance, 4, resistorType).filter(a => a !== q.correctAnswer);
        const options = [q.correctAnswer, ...wrong.slice(0, 3)].sort(() => Math.random() - 0.5);
        out.push({ ...q, options, variant: 'color_to_value' as const });
      }
    } else {
      for (let i = 0; i < 10; i++) {
        out.push({ ...generateValueToColorFull(resistorType), variant: 'value_to_color_full' as const });
      }
    }
    return out;
  }, [variant, resistorType, generateWrongAnswers, generateValueToColorFull]);

  useEffect(() => {
    if (!variant) return;
    const qs = generateQuestions();
    if (!qs || qs.length === 0) return;
    setQuestions(qs);
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    const bandIdx = (qs[0]?.variant === 'value_to_color_band' || qs[0]?.variant === 'color_to_value_band') ? (qs[0]?.bandIndex ?? 0) : 0;
    setCurrentBandIndex(bandIdx);
    setShowResult(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setQuestionHistory([]);
    setIsLoading(false);
  }, [resistorType, mode, colorReadingMode, answerType, variant, expectedBandsCount, generateQuestions]);

  useEffect(() => {
    if (questions.length === 0) return;
    const q = questions[currentQuestion];
    if (q?.variant === 'value_to_color_band' || q?.variant === 'color_to_value_band') {
      setCurrentBandIndex(q.bandIndex ?? 0);
    }
  }, [currentQuestion, questions]);

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
              analytics: { deepAnalytics },
              settings: {
                resistorType,
                mode,
                practiceMode: mode,
                colorReadingMode: mode === 'color_reading' ? colorReadingMode : undefined,
                answerType: mode === 'color_reading' ? 'color_reading' : answerType,
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
  }, [isPracticeComplete, sessionSaved, questionHistory, resistorType, answerType, mode, colorReadingMode]);

  const getAnswerTypeName = () => {
    if (variant === 'value_to_color_band') return 'ค่า → สี';
    if (variant === 'color_to_value_band') return 'สี → ค่า';
    if (answerType === 'multiple_choice') return 'ตัวเลือก';
    if (answerType === 'fill_in') return 'เติมคำ';
    if (answerType === 'color_selection') return 'เลือกสี';
    return 'ตัวเลือก';
  };

  const getAnswerTypeIcon = () => {
    if (variant === 'value_to_color_band' || variant === 'value_to_color_full') return Layers;
    if (variant === 'color_to_value_band') return Palette;
    if (answerType === 'multiple_choice') return ListChecks;
    if (answerType === 'fill_in') return PenLine;
    if (answerType === 'color_selection') return Paintbrush;
    return ListChecks;
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
    if (variant === 'value_to_color_full' && currentBandIndex < expectedBandsCount - 1) {
      setTimeout(() => setCurrentBandIndex(currentBandIndex + 1), 200);
    }
  };

  const checkAnswer = (answer?: string) => {
    let userAnswer: string | null = null;
    let correct = false;

    if (variant === 'value_to_color_band') {
      const bidx = currentQ.bandIndex ?? currentBandIndex;
      correct = (selectedBands[bidx] || '') === (currentQ.correctBands?.[bidx] || '');
      userAnswer = selectedBands[bidx] || '';
    } else if (variant === 'color_to_value_band') {
      userAnswer = answer || selectedAnswer;
      if (!userAnswer) return;
      correct = userAnswer === (currentQ.correctAnswer || currentQ.bandValue);
    } else if (variant === 'color_to_value' && answerType === 'multiple_choice') {
      userAnswer = answer || selectedAnswer;
      if (!userAnswer) return;
      correct = userAnswer === currentQ.correctAnswer;
    } else if (variant === 'color_to_value' && answerType === 'fill_in') {
      userAnswer = `${numberValue}${selectedUnit} ±${toleranceValue}%`.trim();
      if (!numberValue || !toleranceValue) return;
      correct = userAnswer === currentQ.correctAnswer;
    } else if (variant === 'value_to_color_full') {
      const bandsToCheck = [...selectedBands];
      while (bandsToCheck.length < expectedBandsCount) bandsToCheck.push('');
      correct = bandsToCheck.every((b, i) => b === (currentQ.correctBands?.[i] || ''));
      userAnswer = bandsToCheck.join('-');
    } else {
      return;
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    setAnswered(true);
    
    if (correct) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    const questionRecord = {
      questionNumber: currentQuestion + 1,
      bands: (variant === 'value_to_color_full' || variant === 'value_to_color_band') ? selectedBands : (currentQ.bands || []),
      correctAnswer: (variant === 'value_to_color_full' || variant === 'value_to_color_band') ? (currentQ.correctBands?.join('-') ?? currentQ.correctAnswer) : currentQ.correctAnswer,
      userAnswer,
      isCorrect: correct,
      resistorValue: currentQ.resistorValue,
      questionType: currentQ.questionType || 'normal',
      resistorType,
      answerType: variant === 'color_to_value' ? answerType : (variant === 'value_to_color_full' ? 'color_selection' : (variant === 'value_to_color_band' ? 'color_selection' : 'multiple_choice')),
      correctBands: currentQ.correctBands || currentQ.bands,
      userBands: (variant === 'value_to_color_full' || variant === 'value_to_color_band') ? selectedBands : [],
      ...(currentQ.tolerance != null && { correctTolerance: currentQ.tolerance }),
      ...(variant === 'color_to_value' && answerType === 'fill_in' && toleranceValue && { userTolerance: `±${toleranceValue}%` }),
    };
    setQuestionHistory(prev => [...prev, questionRecord]);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    const nextQ = questions[nextQuestion];
    setCurrentQuestion(nextQuestion);
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    const nextBand = (nextQ?.variant === 'value_to_color_band' || nextQ?.variant === 'color_to_value_band') ? (nextQ?.bandIndex ?? 0) : 0;
    setCurrentBandIndex(nextBand);
    setShowResult(false);

    if (nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  };

  const handleRestart = () => {
    const qs = generateQuestions();
    if (qs?.length) {
      setQuestions(qs);
      const bandIdx = (qs[0]?.variant === 'value_to_color_band' || qs[0]?.variant === 'color_to_value_band') ? (qs[0]?.bandIndex ?? 0) : 0;
      setCurrentBandIndex(bandIdx);
    }
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    setShowResult(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setQuestionHistory([]);
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
              {/* value_to_color_band: ColorReadingBandByBand (includes prompt + picker) */}
              {variant === 'value_to_color_band' && (
                <ColorReadingBandByBand
                  resistorType={resistorType}
                  currentBandIndex={currentQ.bandIndex ?? currentBandIndex}
                  selectedBands={selectedBands}
                  correctBands={currentQ.correctBands || []}
                  onBandSelect={handleColorSelect}
                  disabled={answered}
                  showResult={showResult}
                  isCorrect={isCorrect}
                  bandValue={currentQ.bandValue}
                  resistorValue={currentQ.resistorValue}
                  tolerance={currentQ.tolerance}
                />
              )}

              {/* color_to_value_band: ColorToValueBandByBand (includes resistor + options + result) */}
              {variant === 'color_to_value_band' && (
                <ColorToValueBandByBand
                  resistorType={resistorType}
                  currentBandIndex={currentQ.bandIndex ?? currentBandIndex}
                  bands={currentQ.bands || []}
                  correctValue={currentQ.correctAnswer || currentQ.bandValue || ''}
                  options={currentQ.options || []}
                  selectedAnswer={selectedAnswer}
                  onAnswerSelect={(ans) => { setSelectedAnswer(ans); setTimeout(() => checkAnswer(ans), 150); }}
                  disabled={answered}
                  showResult={showResult}
                  isCorrect={isCorrect}
                />
              )}

              {/* Resistor + Question only for color_to_value and value_to_color_full */}
              {(variant === 'color_to_value' || variant === 'value_to_color_full') && (
                <>
                  <div className="flex justify-center">
                    <div className="w-full max-w-lg">
                      {variant === 'value_to_color_full' ? (
                        <ResistorDisplay
                          bands={selectedBands.map(b => b || 'gray')}
                          type={resistorType}
                          highlightBand={!showResult ? currentBandIndex : undefined}
                        />
                      ) : (
                        <ResistorDisplay bands={currentQ.bands || []} type={resistorType} />
                      )}
                    </div>
                  </div>
                  {variant === 'value_to_color_full' ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">เลือกแถบสีให้ตรงกับค่า</p>
                      <div className="inline-block rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-8 py-4 shadow-lg">
                        <p className="text-2xl lg:text-3xl font-extrabold text-white">{currentQ.correctAnswer}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-lg font-semibold text-gray-700">ค่าความต้านทานของตัวต้านทานนี้คือเท่าไร?</p>
                  )}
                </>
              )}

              {/* Result — ไม่ใช้กับ band variants ที่มีผลใน component เอง */}
              {showResult && variant !== 'value_to_color_band' && variant !== 'color_to_value_band' && (
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
                            {variant === 'value_to_color_full'
                              ? selectedBands.map(b => getColorName(b)).join(' - ')
                              : variant === 'color_to_value' && answerType === 'multiple_choice'
                                ? selectedAnswer
                                : `${numberValue}${selectedUnit} ±${toleranceValue}%`}
                          </p>
                        </div>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <div className="text-center px-4 py-2 bg-green-50 rounded-xl border-2 border-green-300">
                          <p className="text-xs text-gray-500">คำตอบที่ถูก</p>
                          <p className="font-bold text-green-700">
                            {variant === 'value_to_color_full' && currentQ.correctBands
                              ? currentQ.correctBands.map((b: string) => getColorName(b)).join(' - ')
                              : currentQ.correctAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Answer Options — เฉพาะ color_to_value และ value_to_color_full (band variants รันด้านบน) */}
              {!showResult && (variant === 'color_to_value' || variant === 'value_to_color_full') && (
                <>
                  {variant === 'color_to_value' && answerType === 'multiple_choice' && (
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

                  {variant === 'color_to_value' && answerType === 'fill_in' && (
                    <div className="relative z-10 space-y-4">
                      {/* Single line input */}
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {/* Resistance value input */}
                        <input
                          type="text"
                          inputMode="numeric"
                          value={numberValue}
                          onChange={(e) => setNumberValue(e.target.value)}
                          disabled={answered}
                          placeholder="ค่า"
                          className="w-24 lg:w-28 text-center text-xl lg:text-2xl font-bold rounded-xl border-2 border-gray-200 px-3 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                        />
                        
                        {/* Unit buttons */}
                        <div className="flex gap-1">
                          {['Ω', 'kΩ', 'MΩ'].map((unit) => (
                            <button
                              key={unit}
                              type="button"
                              onClick={() => setSelectedUnit(unit)}
                              disabled={answered}
                              className={`
                                px-3 lg:px-4 py-2.5 rounded-xl border-2 font-bold text-base transition-colors
                                ${selectedUnit === unit
                                  ? 'border-orange-500 bg-orange-500 text-white'
                                  : 'border-gray-200 bg-white text-gray-700 hover:border-orange-500 hover:bg-orange-50'
                                }
                              `}
                            >
                              {unit}
                            </button>
                          ))}
                        </div>
                        
                        {/* Tolerance input */}
                        <div className="flex items-center gap-1">
                          <span className="text-xl font-bold text-gray-600">±</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={toleranceValue}
                            onChange={(e) => setToleranceValue(e.target.value)}
                            disabled={answered}
                            placeholder="5"
                            className="w-14 lg:w-16 text-center text-xl lg:text-2xl font-bold rounded-xl border-2 border-gray-200 px-2 py-2.5 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                          />
                          <span className="text-xl font-bold text-gray-600">%</span>
                        </div>
                      </div>
                      
                      <p className="text-center text-sm text-gray-500">
                        คำตอบ: <span className="font-bold text-gray-700">{numberValue ? `${numberValue}${selectedUnit} ±${toleranceValue}%` : '-'}</span>
                      </p>
                    </div>
                  )}

                  {variant === 'value_to_color_full' && (
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
                  (variant === 'value_to_color_band' && !selectedBands[currentQ?.bandIndex ?? currentBandIndex]) ||
                  (variant === 'color_to_value_band' && !selectedAnswer) ||
                  (variant === 'color_to_value' && answerType === 'multiple_choice' && !selectedAnswer) ||
                  (variant === 'color_to_value' && answerType === 'fill_in' && (!numberValue || !toleranceValue)) ||
                  (variant === 'value_to_color_full' && selectedBands.some(b => !b))
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
