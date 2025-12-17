'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import ColorBandSelector from '@/components/features/ColorBandSelector';
import { colorCodes, formatResistance } from '@/lib/resistorUtils';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';

function QuickPracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [showExplanation, setShowExplanation] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);

  useEffect(() => {
    // Generate initial questions
    generateQuestions();
    // Reset quiz state when resistor type or answer type changes
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

  // Combine number, unit, and tolerance into typedAnswer
  useEffect(() => {
    if (answerType === 'fill_in') {
      const formatted = numberValue && selectedUnit && toleranceValue
        ? `${numberValue}${selectedUnit} ${toleranceValue}`
        : '';
      setTypedAnswer(formatted);
    }
  }, [numberValue, selectedUnit, toleranceValue, answerType]);

  // Save session when practice is complete
  useEffect(() => {
    if (isPracticeComplete && !sessionSaved) {
      const saveSession = async () => {
        try {
          const accuracy = (score.correct / score.total) * 100;
          const elapsedTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
          
          // Calculate deep analytics
          const deepAnalytics = calculateDeepAnalytics(questionHistory);
          
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
  }, [isPracticeComplete, sessionSaved, questionHistory, resistorType, answerType]);

  const generateQuestions = () => {
    // Generate random resistor questions based on type
    const isReverse = answerType === 'color_selection';
    const generatedQuestions = Array.from({ length: 10 }, () => generateQuestion(resistorType, isReverse));
    setQuestions(generatedQuestions);
  };

  const generateQuestion = (type: string, isReverse: boolean = false) => {
    // Color codes for resistors
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
    };

    // Reverse mode: generate resistance value first, then calculate bands
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

        return {
          bands,
          correctAnswer,
          correctBands: bands,
          resistorValue,
          tolerance,
          questionType: 'reverse',
          explanation: `แถบสีที่ถูกต้อง: ${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}) - ${bands[3]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[4]}(${tolerance})`
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

        return {
          bands: [],
          correctAnswer,
          correctBands: bands,
          resistorValue,
          tolerance,
          questionType: 'reverse',
          explanation: `แถบสีที่ถูกต้อง: ${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`
        };
      }
    }

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

      // Generate wrong answers using medium difficulty
      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, 4, type, 'medium').filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options,
        questionType: 'normal',
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

      // Generate wrong answers using medium difficulty
      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, 4, type, 'medium').filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);

      return {
        bands,
        correctAnswer,
        options,
        questionType: 'normal',
        explanation: `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`,
        resistorValue
      };
    }
  };

  const generateWrongAnswers = (correctResistorValue: number, correctTolerance: string, optionCount: number, resistorType: string, difficulty: 'easy' | 'medium' | 'hard'): string[] => {
    const colorCodes = {
      digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
      multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
      tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
    };

    const wrongAnswers: string[] = [];
    const usedValues = new Set<number>([correctResistorValue]);
    
    const generateRandomResistor = (): number => {
      if (resistorType === 'FIVE_BAND') {
        const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
        const digit1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
        const digit2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const digit3 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const multiplier = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
        return parseInt(`${digit1}${digit2}${digit3}`) * multiplier;
      } else {
        const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
        const digit1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
        const digit2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
        const multiplier = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
        return parseInt(`${digit1}${digit2}`) * multiplier;
      }
    };

    // Medium mode: Mix of close and random values
    const numCloseAnswers = Math.floor((optionCount - 1) / 2);
    const closeMultipliers = [0.5, 0.8, 1.2, 1.5, 2, 0.7, 1.3, 0.9, 1.1];
    const shuffled = closeMultipliers.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numCloseAnswers && i < shuffled.length; i++) {
      const multiplier = shuffled[i];
      const closeValue = Math.round(correctResistorValue * multiplier);
      if (closeValue > 0 && closeValue !== correctResistorValue && !usedValues.has(closeValue)) {
        usedValues.add(closeValue);
        const tolerance = Math.random() < 0.5 ? correctTolerance : Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(closeValue, tolerance));
      }
    }
    
    let attempts = 0;
    const maxAttempts = 500;
    while (wrongAnswers.length < optionCount - 1 && attempts < maxAttempts) {
      attempts++;
      const randomValue = generateRandomResistor();
      if (!usedValues.has(randomValue)) {
        usedValues.add(randomValue);
        const tolerance = Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        const answer = formatResistance(randomValue, tolerance);
        if (!wrongAnswers.includes(answer)) {
          wrongAnswers.push(answer);
        }
      }
    }
    
    while (wrongAnswers.length < optionCount - 1) {
      const multiplier = 0.5 + Math.random() * 2;
      const closeValue = Math.round(correctResistorValue * multiplier);
      if (closeValue > 0 && !usedValues.has(closeValue)) {
        usedValues.add(closeValue);
        const tolerance = correctTolerance;
        const answer = formatResistance(closeValue, tolerance);
        if (!wrongAnswers.includes(answer)) {
          wrongAnswers.push(answer);
        }
      }
    }
    
    return wrongAnswers;
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
    if (answered) return;
    setSelectedAnswer(answer);
  };

  const handleCheckAnswer = () => {
    let answer: string | null = null;
    let isCorrect = false;

    if (answerType === 'color_selection') {
      // Check if all bands are selected
      const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
      
      // Ensure selectedBands array has the correct length
      const bandsToCheck = [...selectedBands];
      while (bandsToCheck.length < expectedBandsCount) {
        bandsToCheck.push('');
      }
      
      // Check if all bands are selected
      if (bandsToCheck.some(b => !b || b.trim() === '')) {
        // Not all bands selected, but allow checking anyway
        // Fill missing bands with empty string for comparison
        const filledBands = bandsToCheck.map((band, index) => band || '');
        isCorrect = filledBands.every((band, index) => band === currentQ.correctBands[index]);
        answer = filledBands.join('-');
      } else {
        // All bands selected, compare normally
        isCorrect = bandsToCheck.every((band, index) => band === currentQ.correctBands[index]);
        answer = bandsToCheck.join('-');
      }
    } else if (answerType === 'multiple_choice') {
      answer = selectedAnswer;
      if (!answer) return;
      isCorrect = answer === currentQ.correctAnswer;
    } else {
      answer = typedAnswer.trim();
      if (!answer) return;
      isCorrect = answer === currentQ.correctAnswer;
    }
    
    setAnswered(true);
    setShowExplanation(true);
    
    if (isCorrect) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    // Extract detailed information for analytics
    const correctBands = answerType === 'color_selection' ? currentQ.correctBands || [] : currentQ.bands || [];
    const userBands = answerType === 'color_selection' ? selectedBands : [];
    const correctResistorValue = currentQ.resistorValue;
    const correctTolerance = currentQ.tolerance || '';
    
    // Extract user resistor value and tolerance from answer
    let userResistorValue: number | undefined;
    let userTolerance: string | undefined;
    
    if (answerType === 'fill_in' && answer) {
      const parts = answer.split(' ');
      if (parts.length >= 2) {
        userTolerance = parts[1];
        const valuePart = parts[0];
        const match = valuePart.match(/^([\d.]+)([kMG]?Ω?)$/);
        if (match) {
          const num = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          if (unit.includes('m')) {
            userResistorValue = num * 1000000;
          } else if (unit.includes('k')) {
            userResistorValue = num * 1000;
          } else {
            userResistorValue = num;
          }
        }
      }
    } else if (answerType === 'multiple_choice' && answer && !isCorrect) {
      const parts = answer.split(' ');
      if (parts.length >= 2) {
        userTolerance = parts[1];
        const valuePart = parts[0];
        const match = valuePart.match(/^([\d.]+)([kMG]?Ω?)$/);
        if (match) {
          const num = parseFloat(match[1]);
          const unit = match[2].toLowerCase();
          if (unit.includes('m')) {
            userResistorValue = num * 1000000;
          } else if (unit.includes('k')) {
            userResistorValue = num * 1000;
          } else {
            userResistorValue = num;
          }
        }
      }
    }
    
    // Extract digit positions for band-by-band comparison
    const digitPositions: any = {};
    const is5Band = resistorType === 'FIVE_BAND';
    
    if (answerType === 'color_selection' && correctBands.length > 0 && userBands.length > 0) {
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
    
    // Store question history
    const questionRecord = {
      questionNumber: currentQuestion + 1,
      bands: answerType === 'color_selection' ? selectedBands : currentQ.bands,
      correctAnswer: answerType === 'color_selection' ? currentQ.correctBands.join('-') : currentQ.correctAnswer,
      userAnswer: answer,
      isCorrect,
      explanation: currentQ.explanation,
      options: currentQ.options || null,
      resistorValue: currentQ.resistorValue,
      questionType: currentQ.questionType || 'normal',
      resistorType,
      answerType,
      // Enhanced fields for deep analytics
      correctBands,
      userBands,
      correctResistorValue,
      userResistorValue,
      correctTolerance,
      userTolerance,
      digitPositions
    };
    setQuestionHistory(prev => [...prev, questionRecord]);
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
    setSelectedBands([]);
    setShowExplanation(false);
    
    // Mark practice as complete when on last question
    if (nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  };

  const handleBandChange = (index: number, color: string) => {
    if (answered) return;
    const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
    const newBands = [...selectedBands];
    
    // Ensure array has correct length
    while (newBands.length < expectedBandsCount) {
      newBands.push('');
    }
    
    // Update the selected band
    newBands[index] = color;
    setSelectedBands(newBands);
  };

  // Initialize selected bands when question changes
  useEffect(() => {
    if (answerType === 'color_selection' && currentQ) {
      const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
      if (selectedBands.length !== expectedBandsCount) {
        setSelectedBands(Array(expectedBandsCount).fill(''));
      }
    }
  }, [currentQuestion, answerType, resistorType]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  // Practice complete state
  if (isPracticeComplete && !currentQ) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
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
                <p className="mb-6 text-gray-600">
                  คุณได้ทำคำถามครบทั้ง {questions.length} ข้อแล้ว!
                </p>
                <Link
                  href="/learn/self/practice"
                  className="inline-block w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700"
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div 
        className="flex-1 transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
          {/* Compact Header */}
          <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-3 shadow-md">
            <Link href="/learn/self/practice" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-orange-600 hover:text-orange-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline font-medium">โหมดฝึกฝน</span>
            </Link>
            
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-gray-900">{currentQuestion + 1}/{questions.length}</div>
                <div className="text-xs text-gray-500">คำถาม</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">ถูกต้อง</div>
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
          <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 md:p-6 shadow-lg">
            {/* Resistor Display */}
            <div className="mb-2 sm:mb-3">
              {answerType === 'color_selection' ? (
                <ResistorDisplay
                  bands={(() => {
                    const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
                    const bands = [...selectedBands];
                    while (bands.length < expectedBandsCount) {
                      bands.push('');
                    }
                    // Fill empty bands with gray for display
                    return bands.map(band => band || 'gray');
                  })()}
                  showAnswer={showExplanation}
                  answer={currentQ.correctAnswer}
                  isCorrect={selectedBands.length > 0 && selectedBands.every((band, index) => band && band === currentQ.correctBands[index])}
                  type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                />
              ) : (
                <ResistorDisplay
                  bands={currentQ.bands}
                  showAnswer={showExplanation}
                  answer={currentQ.correctAnswer}
                  isCorrect={(answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer}
                  type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                />
              )}
            </div>

            {/* Question */}
            <div className="mb-2 sm:mb-3 text-center">
              {answerType === 'color_selection' ? (
                <>
                  <h2 className="mb-1.5 text-sm sm:text-base font-bold text-gray-900">
                    เลือกแถบสีที่ถูกต้องสำหรับค่าความต้านทานนี้
                  </h2>
                  <div className="mb-1.5 inline-block rounded-lg bg-gradient-to-r from-orange-100 to-orange-50 px-3 py-1.5 border-2 border-orange-300">
                    <p className="text-lg sm:text-xl font-bold text-orange-700">
                      {currentQ.correctAnswer}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mb-1.5 text-sm sm:text-base font-bold text-gray-900">
                    ค่าความต้านทานของตัวต้านทานนี้คือเท่าไร?
                  </h2>
                </>
              )}
            </div>

            {/* Color Selection Answer */}
            {answerType === 'color_selection' && (
              <div className="mb-2 sm:mb-3">
                <ColorBandSelector
                  bands={(() => {
                    const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
                    const bands = [...selectedBands];
                    while (bands.length < expectedBandsCount) {
                      bands.push('');
                    }
                    return bands;
                  })()}
                  onBandChange={handleBandChange}
                  resistorType={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                  disabled={answered}
                  showLabels={true}
                />
              </div>
            )}

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
                    disabled={answered}
                    className={`rounded-lg sm:rounded-xl border-2 px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-semibold transition-all ${
                      answered && isCorrect
                        ? 'border-green-600 bg-green-100 text-green-900'
                        : answered && isWrong
                        ? 'border-red-600 bg-red-100 text-red-900'
                        : isSelected
                        ? 'border-orange-600 bg-orange-200 text-orange-900'
                        : 'border-gray-400 bg-white text-gray-900 hover:border-orange-400 hover:bg-orange-50'
                    } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
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
                  disabled={answered}
                  placeholder="ค่า"
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
                      disabled={answered}
                      className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all ${
                        selectedUnit === unit
                          ? 'border-orange-600 bg-orange-200 text-orange-900'
                          : 'border-gray-400 bg-white text-gray-800 hover:border-orange-400'
                      } ${answered ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    disabled={answered}
                    className={`flex-1 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all ${
                      toleranceValue === tolerance
                        ? 'border-orange-600 bg-orange-200 text-orange-900'
                        : 'border-gray-400 bg-white text-gray-800 hover:border-orange-400'
                    } ${answered ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {tolerance}
                  </button>
                ))}
              </div>
              
              <p className="text-xs sm:text-sm text-gray-600">
                ตัวอย่าง: <strong>{typedAnswer || 'กรอกค่าด้านบน'}</strong>
              </p>
            </div>
            )}

            {/* Action Button & Explanation */}
            <div className="space-y-2">
              {/* Check Answer or Next Button - Fixed at bottom */}
              {!answered ? (
                <div className="sticky bottom-0 bg-white pt-2 pb-2 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 border-t border-gray-200 z-10">
                  <button
                    onClick={handleCheckAnswer}
                    disabled={
                      (answerType === 'multiple_choice' && !selectedAnswer) || 
                      (answerType === 'fill_in' && !typedAnswer.trim())
                      // Allow checking color_selection even if not all bands are selected
                    }
                    className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ตรวจคำตอบ
                  </button>
                </div>
              ) : (
                <div className="sticky bottom-0 bg-white pt-2 pb-2 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 border-t border-gray-200 z-10">
                  <button
                    onClick={handleNextQuestion}
                    className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-orange-600 hover:to-orange-700"
                  >
                    {currentQuestion >= questions.length - 1 ? 'ฝึกฝนเสร็จสิ้น!' : 'คำถามถัดไป'}
                  </button>
                </div>
              )}

              {/* Compact Explanation */}
              {showExplanation && (
                <div className={`rounded-xl border-2 p-4 ${
                  answerType === 'color_selection'
                    ? (() => {
                        const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
                        const bandsToCheck = [...selectedBands];
                        while (bandsToCheck.length < expectedBandsCount) {
                          bandsToCheck.push('');
                        }
                        return bandsToCheck.every((band, index) => band && band === currentQ.correctBands[index])
                          ? 'border-green-400 bg-green-100'
                          : 'border-red-400 bg-red-100';
                      })()
                    : ((answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer
                        ? 'border-green-400 bg-green-100'
                        : 'border-red-400 bg-red-100')
                }`}>
                  <div className="mb-2 flex items-center gap-2">
                    {answerType === 'color_selection' ? (() => {
                      const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
                      const bandsToCheck = [...selectedBands];
                      while (bandsToCheck.length < expectedBandsCount) {
                        bandsToCheck.push('');
                      }
                      const allBandsSelected = bandsToCheck.every(b => b && b.trim() !== '');
                      const isCorrect = bandsToCheck.every((band, index) => band && band === currentQ.correctBands[index]);
                      
                      if (!allBandsSelected) {
                        return (
                          <>
                            <svg className="h-5 w-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="font-bold text-yellow-900">ยังเลือกไม่ครบทุกแถบ</h3>
                          </>
                        );
                      }
                      
                      return isCorrect ? (
                        <>
                          <svg className="h-5 w-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="font-bold text-green-900">ถูกต้อง!</h3>
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="font-bold text-red-900">ไม่ถูกต้อง</h3>
                        </>
                      );
                    })() : (answerType === 'multiple_choice' ? selectedAnswer : typedAnswer.trim()) === currentQ.correctAnswer ? (
                      <>
                        <svg className="h-5 w-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-green-900">ถูกต้อง!</h3>
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="font-bold text-red-900">ไม่ถูกต้อง</h3>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-900">{currentQ.explanation}</p>
                  {answerType === 'color_selection' && (() => {
                    const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
                    const bandsToCheck = [...selectedBands];
                    while (bandsToCheck.length < expectedBandsCount) {
                      bandsToCheck.push('');
                    }
                    return !bandsToCheck.every((band, index) => band && band === currentQ.correctBands[index]);
                  })() && (
                    <div className="mt-3 rounded-lg bg-white p-3 border border-gray-300">
                      <p className="text-sm font-semibold text-gray-700 mb-2">แถบสีที่ถูกต้อง:</p>
                      <ResistorDisplay
                        bands={currentQ.correctBands}
                        showAnswer={false}
                        type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                      />
                    </div>
                  )}
                </div>
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
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <QuickPracticeContent />
    </Suspense>
  );
}

