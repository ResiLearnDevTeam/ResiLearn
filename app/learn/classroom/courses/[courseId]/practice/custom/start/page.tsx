'use client';

import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import ColorBandSelector from '@/components/features/ColorBandSelector';
import { colorCodes, formatResistance } from '@/lib/resistorUtils';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';

function CustomPracticeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  
  // Parse settings from URL
  const resistorType = searchParams.get('type') || 'FOUR_BAND';
  const answerType = searchParams.get('answerType') || 'multiple_choice';
  const difficulty = searchParams.get('difficulty') || 'medium';
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
  const [selectedBands, setSelectedBands] = useState<string[]>([]);
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
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
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

  // Calculate detailed analytics from question history
  const calculateDetailedAnalytics = (history: any[]) => {
    if (!history || history.length === 0) {
      return {
        perType: {},
        perDifficulty: {},
        timing: {},
        firstAttemptAccuracy: 0,
        guessRate: 0,
        streaks: { current: 0, longest: 0 },
        repeatedMisses: [],
        confusion: [],
        predictions: {},
        pace: {},
        endReason: ''
      };
    }

    // Per Type Analysis (resistorType, answerType)
    const perType: any = {};
    const perDifficulty: any = {};
    const times: number[] = [];
    let firstAttemptCorrect = 0;
    let totalGuesses = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    const mistakePatterns: any = {};
    const confusionMatrix: any = {};
    const timeSpentArray: number[] = [];

    history.forEach((q, index) => {
      const typeKey = `${q.resistorType}_${q.answerType}`;
      const diffKey = q.difficulty || 'medium';

      // Per Type
      if (!perType[typeKey]) {
        perType[typeKey] = { correct: 0, total: 0, totalTime: 0, times: [] };
      }
      perType[typeKey].total++;
      perType[typeKey].totalTime += q.timeSpent || 0;
      perType[typeKey].times.push(q.timeSpent || 0);
      if (q.isCorrect) perType[typeKey].correct++;

      // Per Difficulty
      if (!perDifficulty[diffKey]) {
        perDifficulty[diffKey] = { correct: 0, total: 0, totalTime: 0, times: [] };
      }
      perDifficulty[diffKey].total++;
      perDifficulty[diffKey].totalTime += q.timeSpent || 0;
      perDifficulty[diffKey].times.push(q.timeSpent || 0);
      if (q.isCorrect) perDifficulty[diffKey].correct++;

      // Timing
      if (q.timeSpent) {
        times.push(q.timeSpent);
        timeSpentArray.push(q.timeSpent);
      }

      // First attempt accuracy (all questions are first attempts in this system)
      if (q.isCorrect) firstAttemptCorrect++;

      // Guess rate (for multiple choice, if answered very quickly < 3 seconds, might be guessing)
      if (q.answerType === 'multiple_choice' && q.timeSpent && q.timeSpent < 3) {
        totalGuesses++;
      }

      // Streaks
      if (q.isCorrect) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }

      // Confusion matrix (for color selection mistakes)
      if (!q.isCorrect && q.answerType === 'color_selection') {
        const correctBands = q.correctAnswer.split('-');
        const userBands = q.userAnswer.split('-');
        correctBands.forEach((correctBand: string, idx: number) => {
          const userBand = userBands[idx];
          if (correctBand !== userBand) {
            const key = `${correctBand}_${userBand}`;
            confusionMatrix[key] = (confusionMatrix[key] || 0) + 1;
          }
        });
      }

      // Repeated mistakes
      if (!q.isCorrect) {
        const mistakeKey = `${q.resistorType}_${q.answerType}_${q.difficulty}`;
        mistakePatterns[mistakeKey] = (mistakePatterns[mistakeKey] || 0) + 1;
      }
    });

    // Calculate per type stats
    Object.keys(perType).forEach(key => {
      const stats = perType[key];
      stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      stats.averageTime = stats.total > 0 ? stats.totalTime / stats.total : 0;
      stats.medianTime = stats.times.length > 0 
        ? stats.times.sort((a: number, b: number) => a - b)[Math.floor(stats.times.length / 2)]
        : 0;
      stats.p95Time = stats.times.length > 0
        ? stats.times.sort((a: number, b: number) => a - b)[Math.floor(stats.times.length * 0.95)]
        : 0;
    });

    // Calculate per difficulty stats
    Object.keys(perDifficulty).forEach(key => {
      const stats = perDifficulty[key];
      stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      stats.averageTime = stats.total > 0 ? stats.totalTime / stats.total : 0;
      stats.medianTime = stats.times.length > 0
        ? stats.times.sort((a: number, b: number) => a - b)[Math.floor(stats.times.length / 2)]
        : 0;
      stats.p95Time = stats.times.length > 0
        ? stats.times.sort((a: number, b: number) => a - b)[Math.floor(stats.times.length * 0.95)]
        : 0;
    });

    // Timing statistics
    const sortedTimes = [...times].sort((a, b) => a - b);
    const timing = {
      avg: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0,
      median: sortedTimes.length > 0 ? sortedTimes[Math.floor(sortedTimes.length / 2)] : 0,
      p95: sortedTimes.length > 0 ? sortedTimes[Math.floor(sortedTimes.length * 0.95)] : 0,
      fastest: sortedTimes.length > 0 ? sortedTimes[0] : 0,
      slowest: sortedTimes.length > 0 ? sortedTimes[sortedTimes.length - 1] : 0
    };

    // First attempt accuracy
    const firstAttemptAccuracy = history.length > 0 ? (firstAttemptCorrect / history.length) * 100 : 0;

    // Guess rate
    const guessRate = history.filter(q => q.answerType === 'multiple_choice').length > 0
      ? totalGuesses / history.filter(q => q.answerType === 'multiple_choice').length
      : 0;

    // Repeated mistakes
    const repeatedMisses = Object.entries(mistakePatterns)
      .filter(([_, count]: [string, any]) => count >= 2)
      .map(([key, count]: [string, any]) => ({
        topic: key,
        count
      }))
      .sort((a: any, b: any) => b.count - a.count);

    // Confusion matrix
    const confusion = Object.entries(confusionMatrix)
      .map(([key, count]: [string, any]) => {
        const [expected, chosen] = key.split('_');
        return { expected, chosen, times: count };
      })
      .sort((a: any, b: any) => b.times - a.times);

    // Mastery probability (Beta-Binomial with prior α=2, β=2)
    const totalCorrect = history.filter(q => q.isCorrect).length;
    const masteryProb = (2 + totalCorrect) / (2 + 2 + history.length);

    // Predicted next score (EWMA with α=0.35)
    const currentAccuracy = history.length > 0 ? (totalCorrect / history.length) * 100 : 0;
    // For first session, use current accuracy; otherwise would need previous session data
    const predictedNextScore = Math.round(currentAccuracy);

    // Estimated questions to mastery (assuming need 90% mastery probability)
    const targetMastery = 0.9;
    const estimatedQuestionsToMaster = masteryProb < targetMastery
      ? Math.ceil(((targetMastery * (2 + 2 + history.length) - (2 + totalCorrect)) / (1 - targetMastery)) - history.length)
      : 0;

    // Pace analysis
    const totalTime = timeSpentArray.reduce((a, b) => a + b, 0);
    const questionsPerMinute = totalTime > 0 ? (history.length / totalTime) * 60 : 0;
    
    // Time drift (compare first half vs second half)
    const firstHalf = timeSpentArray.slice(0, Math.floor(timeSpentArray.length / 2));
    const secondHalf = timeSpentArray.slice(Math.floor(timeSpentArray.length / 2));
    const firstHalfAvg = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
    const secondHalfAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
    const timeDrift = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;

    // End reason
    const endReason = hasTimeRunOut ? 'time_limit' : endedEarly ? 'manual_end' : 'completed';

    return {
      perType,
      perDifficulty,
      timing,
      firstAttemptAccuracy,
      guessRate,
      streaks: { current: currentStreak, longest: longestStreak },
      repeatedMisses,
      confusion,
      predictions: {
        predictedNextScore,
        mastery: Object.keys(perType).map(key => ({
          topic: key,
          prob: perType[key].total > 0 
            ? (2 + perType[key].correct) / (2 + 2 + perType[key].total)
            : 0
        })),
        estimatedQuestionsToMaster: Object.keys(perType).map(key => ({
          topic: key,
          needed: perType[key].total > 0 && (2 + perType[key].correct) / (2 + 2 + perType[key].total) < 0.9
            ? Math.ceil(((0.9 * (2 + 2 + perType[key].total) - (2 + perType[key].correct)) / 0.1) - perType[key].total)
            : 0
        }))
      },
      pace: {
        questionsPerMinute,
        timeDrift: Math.round(timeDrift)
      },
      endReason
    };
  };

  // Save session when practice is complete
  useEffect(() => {
    if ((isPracticeComplete || hasTimeRunOut) && !sessionSaved && score.total > 0) {
      const saveSession = async () => {
        try {
          const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;
          const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
          const questionsAnswered = totalQuestions !== null ? Math.min(currentQuestion, questions.length) : currentQuestion;
          
          // Calculate detailed analytics
          const analytics = calculateDetailedAnalytics(questionHistory);
          
          const response = await fetch(`/api/courses/${courseId}/practice/sessions`, {
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
                answerType,
                difficulty,
                optionCount,
                countdownTime,
                totalQuestions,
                hasTimeLimit: timeLimit !== null,
                timeLimit
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
  }, [isPracticeComplete, hasTimeRunOut, sessionSaved, score, startTime, currentQuestion, questions.length, totalQuestions, resistorType, answerType, difficulty, optionCount, countdownTime, timeLimit, questionHistory]);

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
    const isReverse = answerType === 'color_selection';
    const generatedQuestions = Array.from({ length: questionCount }, () => generateQuestion(resistorType, isReverse));
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
          bands: [],
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

      // Generate wrong answers based on option count and difficulty
      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, optionCount, type, difficulty as 'easy' | 'medium' | 'hard').filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, optionCount - 1)].sort(() => Math.random() - 0.5);

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

      // Generate wrong answers based on option count and difficulty
      const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, optionCount, type, difficulty as 'easy' | 'medium' | 'hard').filter(a => a !== correctAnswer);
      const options = [correctAnswer, ...wrongAnswers.slice(0, optionCount - 1)].sort(() => Math.random() - 0.5);

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
    
    // Generate random wrong answers
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

    // Generate wrong answers based on difficulty
    if (difficulty === 'easy') {
      // Easy mode: Completely random values (easy to distinguish)
      let attempts = 0;
      const maxAttempts = 500;
      
      while (wrongAnswers.length < optionCount - 1 && attempts < maxAttempts) {
        attempts++;
        const randomResistorValue = generateRandomResistor();
        
        if (!usedValues.has(randomResistorValue)) {
          usedValues.add(randomResistorValue);
          const randomTolerance = Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
          const wrongAnswer = formatResistance(randomResistorValue, randomTolerance);
          
          if (!wrongAnswers.includes(wrongAnswer)) {
            wrongAnswers.push(wrongAnswer);
          }
        }
      }
      
      // If we still don't have enough answers, fill with random ones
      while (wrongAnswers.length < optionCount - 1) {
        const randomResistorValue = generateRandomResistor();
        const randomTolerance = Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        const wrongAnswer = formatResistance(randomResistorValue, randomTolerance);
        if (!wrongAnswers.includes(wrongAnswer)) {
          wrongAnswers.push(wrongAnswer);
        }
      }
    } else if (difficulty === 'medium') {
      // Medium mode: Mix of close and random values
      const numCloseAnswers = Math.floor((optionCount - 1) / 2); // Half close, half random
      
      // Generate close answers
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
      
      // Generate random answers for the rest
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
      
      // Fill remaining with close values if needed
      while (wrongAnswers.length < optionCount - 1) {
        const multiplier = 0.5 + Math.random() * 2; // 0.5 to 2.5
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
    } else {
      // Hard mode: Very close values (very tricky, designed to trick users)
      const veryCloseMultipliers = [0.9, 0.95, 1.05, 1.1, 0.85, 1.15, 0.8, 1.2, 0.92, 1.08, 0.88, 1.12];
      const shuffled = veryCloseMultipliers.sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < optionCount - 1 && i < shuffled.length; i++) {
        const multiplier = shuffled[i];
        const closeValue = Math.round(correctResistorValue * multiplier);
        if (closeValue > 0 && closeValue !== correctResistorValue && !usedValues.has(closeValue)) {
          usedValues.add(closeValue);
          // Use same tolerance to make it even trickier
          const tolerance = Math.random() < 0.8 ? correctTolerance : Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
          wrongAnswers.push(formatResistance(closeValue, tolerance));
        }
      }
      
      // Fill remaining with very close values
      while (wrongAnswers.length < optionCount - 1) {
        const multiplier = 0.85 + Math.random() * 0.3; // 0.85 to 1.15 (very close range)
        const closeValue = Math.round(correctResistorValue * multiplier);
        if (closeValue > 0 && !usedValues.has(closeValue)) {
          usedValues.add(closeValue);
          const tolerance = correctTolerance; // Same tolerance to trick more
          const answer = formatResistance(closeValue, tolerance);
          if (!wrongAnswers.includes(answer)) {
            wrongAnswers.push(answer);
          }
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
    if (answered || hasTimeRunOut) return;
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

    // Calculate time spent on this question
    const timeSpent = questionStartTime ? Math.round((Date.now() - questionStartTime) / 1000) : 0;
    
    // Extract detailed information for analytics
    const correctBands = answerType === 'color_selection' ? currentQ.correctBands || [] : currentQ.bands || [];
    const userBands = answerType === 'color_selection' ? selectedBands : [];
    const correctResistorValue = currentQ.resistorValue;
    const correctTolerance = currentQ.tolerance || '';
    
    // Extract user resistor value and tolerance from answer
    let userResistorValue: number | undefined;
    let userTolerance: string | undefined;
    
    if (answerType === 'fill_in' && answer) {
      // Parse user answer to extract value and tolerance
      const parts = answer.split(' ');
      if (parts.length >= 2) {
        userTolerance = parts[1];
        // Try to parse the value part
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
      // Try to extract from wrong answer
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
      // Compare bands position by position
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
    
    // Store question history with detailed information
    const questionRecord = {
      questionNumber: currentQuestion + 1,
      bands: answerType === 'color_selection' ? selectedBands : currentQ.bands,
      correctAnswer: answerType === 'color_selection' ? currentQ.correctBands.join('-') : currentQ.correctAnswer,
      userAnswer: answer,
      isCorrect,
      timeSpent, // Time in seconds
      explanation: currentQ.explanation,
      options: currentQ.options || null,
      resistorValue: currentQ.resistorValue,
      questionType: currentQ.questionType || 'normal',
      resistorType,
      answerType,
      difficulty,
      timestamp: Date.now(),
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
    setCountdown(countdownTime);
    setQuestionStartTime(Date.now()); // Reset question start time
    
    // Check if we should generate a new question for unlimited mode
    if (totalQuestions === null && nextQuestion >= questions.length) {
      const isReverse = answerType === 'color_selection';
      const newQuestion = generateQuestion(resistorType, isReverse);
      setQuestions([...questions, newQuestion]);
    }
    
    // Mark practice as complete when on last question (for limited mode)
    if (totalQuestions !== null && nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  };

  const handleBandChange = (index: number, color: string) => {
    if (answered || hasTimeRunOut) return;
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
    // Set question start time when question changes
    setQuestionStartTime(Date.now());
  }, [currentQuestion, answerType, resistorType]);

  const progress = totalQuestions ? ((currentQuestion + 1) / questions.length) * 100 : 0;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
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

  // Practice complete state
  if (isPracticeComplete || hasTimeRunOut) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
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
                  {hasTimeRunOut 
                    ? 'ถึงเวลาที่กำหนดแล้ว!' 
                    : endedEarly
                    ? `เซสชันการฝึกฝนสิ้นสุดแล้ว คุณได้ตอบ ${score.total} คำถาม!`
                    : `คุณได้ทำคำถามครบทั้ง ${questions.length} ข้อแล้ว!`}
                </p>
                {score.total > 0 && (
                  <div className="mb-6 rounded-xl bg-blue-50 p-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-semibold text-blue-900">
                        คะแนน: {score.correct}/{score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                )}
                <Link
                  href={`/learn/classroom/courses/${courseId}/practice`}
                  className="inline-block w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-center font-bold text-white transition-all hover:from-blue-600 hover:to-blue-700"
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
            <button 
              onClick={handleEndPractice}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline font-medium">กำหนดเอง</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {timeRemaining !== null && (
                <div className="text-center">
                  <div className="text-base sm:text-lg font-bold text-purple-600">{formatTime(timeRemaining)}</div>
                  <div className="text-xs text-gray-500">เวลาที่เหลือ</div>
                </div>
              )}
              {totalQuestions && (
                <div className="text-center">
                  <div className="text-base sm:text-lg font-bold text-gray-900">{currentQuestion + 1}/{totalQuestions}</div>
                  <div className="text-xs text-gray-500">คำถาม</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-base sm:text-lg font-bold text-orange-600">{score.correct}/{score.total}</div>
                <div className="text-xs text-gray-500">ถูกต้อง</div>
              </div>
              <button
                onClick={handleEndPractice}
                className="ml-2 sm:ml-4 rounded-lg bg-red-500 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                <span className="hidden sm:inline">จบการฝึกฝน</span>
                <span className="sm:hidden">จบ</span>
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
                  isCorrect={selectedAnswer === currentQ.correctAnswer}
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
                  disabled={answered || hasTimeRunOut}
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
                      (answerType === 'fill_in' && !typedAnswer.trim()) ||
                      hasTimeRunOut
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
                    {totalQuestions === null 
                      ? 'คำถามถัดไป' 
                      : (currentQuestion >= questions.length - 1 ? 'ฝึกฝนเสร็จสิ้น!' : 'คำถามถัดไป')}
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

      {/* End Practice Confirmation Dialog */}
      {showEndConfirmDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ 
            backdropFilter: 'blur(6px) saturate(180%)',
            WebkitBackdropFilter: 'blur(6px) saturate(180%)',
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">จบเซสชันการฝึกฝน?</h3>
            </div>
            <p className="mb-6 text-gray-600">
              คุณแน่ใจหรือไม่ว่าต้องการจบเซสชันการฝึกฝนนี้? ความคืบหน้าของคุณจะถูกบันทึก
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelEndPractice}
                className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                ไม่ ฝึกต่อ
              </button>
              <button
                onClick={confirmEndPractice}
                className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700"
              >
                ใช่ จบการฝึกฝน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClassroomCustomPracticeStartPage() {
  return (
    <Suspense fallback={
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
    }>
      <CustomPracticeContent />
    </Suspense>
  );
}

