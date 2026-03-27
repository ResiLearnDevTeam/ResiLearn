import { useState, useEffect, useRef, useCallback } from 'react';
import { generateQuestions, generateQuestion, Question } from '@/lib/questionGenerator';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';

export interface CustomPracticeSettings {
  resistorType: string;
  answerType: string;
  difficulty: string;
  optionCount: number;
  totalQuestions: number | null;
  countdownTime: number | null;
  timeLimit: number | null;
}

export interface UseCustomPracticeReturn {
  // State
  currentQuestion: number;
  score: { correct: number; total: number };
  answered: boolean;
  selectedAnswer: string | null;
  numberValue: string;
  selectedUnit: string;
  toleranceValue: string;
  selectedBands: string[];
  currentBandIndex: number;
  showResult: boolean;
  isCorrect: boolean;
  questions: Question[];
  isLoading: boolean;
  isPracticeComplete: boolean;
  sessionSaved: boolean;
  startTime: number | null;
  countdown: number | null;
  timeRemaining: number | null;
  hasTimeRunOut: boolean;
  endedEarly: boolean;
  showEndConfirmDialog: boolean;
  questionHistory: any[];
  questionStartTime: number | null;
  currentQ: Question | null;
  progress: number;
  expectedBandsCount: number;
  
  // Handlers
  setSelectedAnswer: (answer: string | null) => void;
  setNumberValue: (value: string) => void;
  setSelectedUnit: (unit: string) => void;
  setToleranceValue: (value: string) => void;
  setSelectedBands: (bands: string[]) => void;
  setCurrentBandIndex: (index: number) => void;
  handleAnswerSelect: (answer: string) => void;
  handleColorSelect: (color: string) => void;
  handleCheckAnswer: (answer?: string, isTimeout?: boolean) => void;
  handleNextQuestion: () => void;
  handleRestart: () => void;
  handleEndPractice: () => void;
  confirmEndPractice: () => void;
  cancelEndPractice: () => void;
}

export function useCustomPractice(settings: CustomPracticeSettings): UseCustomPracticeReturn {
  const {
    resistorType,
    answerType,
    difficulty,
    optionCount,
    totalQuestions,
    countdownTime,
    timeLimit,
  } = settings;

  const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;

  // State
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
  const [questions, setQuestions] = useState<Question[]>([]);
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

  const currentQ = questions[currentQuestion] || null;
  const progress = totalQuestions ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Generate questions
  const generateQuestionsCallback = useCallback(() => {
    const generatedQuestions = generateQuestions(
      resistorType,
      answerType,
      totalQuestions,
      optionCount,
      difficulty as 'easy' | 'medium' | 'hard'
    );
    setQuestions(generatedQuestions);
  }, [resistorType, answerType, totalQuestions, optionCount, difficulty]);

  // Initialize
  useEffect(() => {
    generateQuestionsCallback();
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    setCurrentBandIndex(0);
    setShowResult(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setCountdown(countdownTime);
    if (timeLimit) {
      setTimeRemaining(timeLimit);
      timeRemainingRef.current = timeLimit;
    }
    setHasTimeRunOut(false);
    setEndedEarly(false);
    setQuestionHistory([]);
    setIsLoading(false);
  }, [resistorType, answerType, totalQuestions, countdownTime, timeLimit, expectedBandsCount, generateQuestionsCallback]);

  // Handlers
  const handleAnswerSelect = useCallback((answer: string) => {
    if (answered || hasTimeRunOut) return;
    setSelectedAnswer(answer);
    // Auto check for multiple choice
    if (answerType === 'multiple_choice') {
      setTimeout(() => {
        handleCheckAnswer(answer);
      }, 150);
    }
  }, [answered, hasTimeRunOut, answerType]);

  const handleColorSelect = useCallback((color: string) => {
    if (answered || hasTimeRunOut) return;
    const newBands = [...selectedBands];
    newBands[currentBandIndex] = color;
    setSelectedBands(newBands);

    // Auto advance to next band
    if (currentBandIndex < expectedBandsCount - 1) {
      setTimeout(() => {
        setCurrentBandIndex(currentBandIndex + 1);
      }, 200);
    }
  }, [answered, hasTimeRunOut, selectedBands, currentBandIndex, expectedBandsCount]);

  const handleCheckAnswer = useCallback((answer?: string, isTimeout?: boolean) => {
    if (!currentQ) return;
    
    let userAnswer: string | null = null;
    let correct = false;

    if (answerType === 'color_selection') {
      const bandsToCheck = [...selectedBands];
      while (bandsToCheck.length < expectedBandsCount) bandsToCheck.push('');
      if (isTimeout) {
        // Timeout: mark as incorrect, use current bands or empty
        userAnswer = bandsToCheck.some(b => b) ? bandsToCheck.join('-') : 'ไม่ตอบ';
        correct = false;
      } else {
        correct = bandsToCheck.every((band, index) => band === currentQ.correctBands![index]);
        userAnswer = bandsToCheck.join('-');
      }
    } else if (answerType === 'multiple_choice') {
      if (isTimeout) {
        // Timeout: mark as incorrect, use null or empty string
        userAnswer = null;
        correct = false;
      } else {
        userAnswer = answer || selectedAnswer;
        if (!userAnswer) return;
        correct = userAnswer === currentQ.correctAnswer;
      }
    } else {
      // fill_in
      if (isTimeout) {
        // Timeout: mark as incorrect, use empty or current input
        userAnswer = (numberValue && toleranceValue) 
          ? `${numberValue}${selectedUnit} ±${toleranceValue}%` 
          : 'ไม่ตอบ';
        correct = false;
      } else {
        const typedAnswer = `${numberValue}${selectedUnit} ±${toleranceValue}%`;
        userAnswer = typedAnswer.trim();
        if (!numberValue || !toleranceValue) return;
        correct = userAnswer === currentQ.correctAnswer;
      }
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    setAnswered(true);
    
    if (correct) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }

    // Calculate time spent
    const timeSpent = questionStartTime ? Math.round((Date.now() - questionStartTime) / 1000) : 0;

    // Store question history
    const questionRecord = {
      questionNumber: currentQuestion + 1,
      bands: answerType === 'color_selection' ? selectedBands : currentQ.bands,
      correctAnswer: answerType === 'color_selection' ? currentQ.correctBands!.join('-') : currentQ.correctAnswer,
      userAnswer,
      isCorrect: correct,
      timeSpent,
      resistorValue: currentQ.resistorValue,
      questionType: currentQ.questionType || 'normal',
      resistorType,
      answerType,
      difficulty,
      correctBands: currentQ.correctBands || currentQ.bands,
      userBands: answerType === 'color_selection' ? selectedBands : [],
    };
    setQuestionHistory(prev => [...prev, questionRecord]);
  }, [answerType, selectedBands, expectedBandsCount, currentQ, selectedAnswer, numberValue, selectedUnit, toleranceValue, currentQuestion, questionStartTime, resistorType, difficulty]);

  const handleNextQuestion = useCallback(() => {
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    setCurrentBandIndex(0);
    setShowResult(false);
    setCountdown(countdownTime);
    setQuestionStartTime(Date.now());
    
    // Check if we should generate a new question for unlimited mode
    if (totalQuestions === null && nextQuestion >= questions.length) {
      const isReverse = answerType === 'color_selection';
      const newQuestion = generateQuestion(
        resistorType,
        isReverse,
        optionCount,
        difficulty as 'easy' | 'medium' | 'hard'
      );
      setQuestions([...questions, newQuestion]);
    }
    
    if (totalQuestions !== null && nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  }, [currentQuestion, totalQuestions, questions.length, answerType, resistorType, optionCount, difficulty, countdownTime, expectedBandsCount]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setNumberValue('');
    setSelectedUnit('Ω');
    setToleranceValue('');
    setSelectedBands(Array(expectedBandsCount).fill(''));
    setCurrentBandIndex(0);
    setShowResult(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setCountdown(countdownTime);
    if (timeLimit) {
      setTimeRemaining(timeLimit);
      timeRemainingRef.current = timeLimit;
    }
    setHasTimeRunOut(false);
    setEndedEarly(false);
    setQuestionHistory([]);
    generateQuestionsCallback();
  }, [countdownTime, timeLimit, expectedBandsCount, generateQuestionsCallback]);

  const handleEndPractice = useCallback(() => {
    setShowEndConfirmDialog(true);
  }, []);

  const confirmEndPractice = useCallback(() => {
    setShowEndConfirmDialog(false);
    setEndedEarly(true);
    setIsPracticeComplete(true);
  }, []);

  const cancelEndPractice = useCallback(() => {
    setShowEndConfirmDialog(false);
  }, []);

  // Countdown timer per question
  useEffect(() => {
    if (answered || !countdownTime || !currentQ || isPracticeComplete) return;
    
    setCountdown(countdownTime);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestion, countdownTime, answered, questions, isPracticeComplete, currentQ]);
  
  // Auto-check when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && !answered && currentQ && countdownTime && !isPracticeComplete) {
      // When timeout: show correct answer, mark as incorrect, disable options
      if (answerType === 'multiple_choice' && currentQ.options && currentQ.options.length > 0) {
        // Set selectedAnswer to null to show "ไม่ตอบ" in result display
        setSelectedAnswer(null);
        setTimeout(() => {
          handleCheckAnswer(undefined, true); // Pass isTimeout = true, answer = undefined
        }, 100);
      } else {
        // For fill_in and color_selection, call handleCheckAnswer with isTimeout flag
        setTimeout(() => {
          handleCheckAnswer(undefined, true); // Pass isTimeout = true
        }, 100);
      }
    }
  }, [countdown, answered, currentQ, countdownTime, answerType, isPracticeComplete, handleCheckAnswer]);

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
          setIsPracticeComplete(true);
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
          const deepAnalytics = calculateDeepAnalytics(questionHistory);
          
          const response = await fetch('/api/practice-sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
                timeLimit,
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
  }, [isPracticeComplete, hasTimeRunOut, sessionSaved, score, startTime, currentQuestion, questions.length, totalQuestions, resistorType, answerType, difficulty, optionCount, countdownTime, timeLimit, questionHistory]);

  return {
    // State
    currentQuestion,
    score,
    answered,
    selectedAnswer,
    numberValue,
    selectedUnit,
    toleranceValue,
    selectedBands,
    currentBandIndex,
    showResult,
    isCorrect,
    questions,
    isLoading,
    isPracticeComplete,
    sessionSaved,
    startTime,
    countdown,
    timeRemaining,
    hasTimeRunOut,
    endedEarly,
    showEndConfirmDialog,
    questionHistory,
    questionStartTime,
    currentQ,
    progress,
    expectedBandsCount,
    
    // Handlers
    setSelectedAnswer,
    setNumberValue,
    setSelectedUnit,
    setToleranceValue,
    setSelectedBands,
    setCurrentBandIndex,
    handleAnswerSelect,
    handleColorSelect,
    handleCheckAnswer,
    handleNextQuestion,
    handleRestart,
    handleEndPractice,
    confirmEndPractice,
    cancelEndPractice,
  };
}
