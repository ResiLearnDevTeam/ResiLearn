'use client';

import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import ColorBandSelector from '@/components/features/ColorBandSelector';
import { colorCodes, formatResistance, generateValueToColorQuestion, generateColorToValueQuestion } from '@/lib/resistorUtils';
import { generateQuestion } from '@/lib/questionGenerator';
import { CourseAssignment, FixedQuestion } from '@/types/classroom';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import ColorReadingBandByBand from '@/components/features/ColorReadingBandByBand';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, FileText } from 'lucide-react';

function AssignmentQuizContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params?.courseId as string;
  const assignmentId = params?.assignmentId as string;

  const [assignment, setAssignment] = useState<CourseAssignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [hasTimeRunOut, setHasTimeRunOut] = useState(false);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [currentBandIndex, setCurrentBandIndex] = useState(0);
  const timeRemainingRef = useRef<number | null>(null);

  useEffect(() => {
    checkExistingAttempt();
  }, [courseId, assignmentId]);

  const checkExistingAttempt = async () => {
    try {
      // Fetch assignment เพื่อตรวจสอบ assignmentMode และ settings
      const assignmentResponse = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}`);
      if (!assignmentResponse.ok) {
        fetchAssignment();
        return;
      }
      
      const assignmentData = await assignmentResponse.json();
      
      // สำหรับ EXAM: ทำได้ครั้งเดียวเสมอ
      if (assignmentData.assignmentMode === 'EXAM') {
        const response = await fetch(`/api/attempts?assignmentId=${assignmentId}`);
        if (response.ok) {
          const attempts = await response.json();
          if (attempts.length > 0) {
            // มี attempt แล้ว - redirect ไปหน้าแสดงผลลัพธ์
            router.push(`/learn/classroom/courses/${courseId}/assignments/${assignmentId}/result`);
            return;
          }
        }
      }
      // สำหรับ PRACTICE: ตรวจสอบ allowRetake
      else if (assignmentData.assignmentMode === 'PRACTICE') {
        if (assignmentData.allowRetake === false) {
          // ไม่อนุญาตทำซ้ำ - ตรวจสอบ attempt
          const response = await fetch(`/api/attempts?assignmentId=${assignmentId}`);
          if (response.ok) {
            const attempts = await response.json();
            if (attempts.length > 0) {
              // มี attempt แล้ว - redirect ไปหน้าแสดงผลลัพธ์
              router.push(`/learn/classroom/courses/${courseId}/assignments/${assignmentId}/result`);
              return;
            }
          }
        }
        // ถ้า allowRetake = true ให้ทำได้หลายครั้ง
      }
      
      // ถ้ายังไม่มี attempt หรืออนุญาตทำซ้ำ ให้ fetch assignment และเริ่มทำ quiz
      fetchAssignment();
    } catch (err) {
      console.error('Error checking attempt:', err);
      // ถ้าเกิด error ให้ fetch assignment ต่อ
      fetchAssignment();
    }
  };

  const fetchAssignment = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch assignment');
      }

      const data = await response.json();
      
      // Check if assignment is published
      const now = new Date();
      if (data.isDraft) {
        throw new Error('This assignment is not yet published');
      }
      if (data.publishedAt && new Date(data.publishedAt) > now) {
        throw new Error('This assignment is scheduled for future publication');
      }

      setAssignment(data);
      
      // Initialize questions based on assignment type
      if (data.assignmentType === 'FIXED_QUESTIONS' && data.questions) {
        // Use fixed questions from assignment
        const fixedQuestions = (data.questions as FixedQuestion[]).map((q, idx) => ({
          id: q.id,
          order: q.order || idx + 1,
          bands: q.bands,
          correctAnswer: q.correctAnswer,
          options: q.options || [],
          correctBands: q.correctBands,
          explanation: q.explanation,
          resistorType: q.resistorType,
          answerType: q.answerType,
          points: q.points || 10,
        }));
        setQuestions(fixedQuestions);
        
        // Set review mode and show correct answers from settings
        if (data.quizSettingsForFixed) {
          setReviewMode(data.quizSettingsForFixed.allowReview || false);
          // สำหรับ EXAM: ไม่แสดงคำตอบเสมอ
          if (data.assignmentMode === 'EXAM') {
            setShowCorrectAnswers(false);
          } else {
            setShowCorrectAnswers(data.quizSettingsForFixed.showCorrectAnswer !== false);
          }
        }
      } else if (data.assignmentType === 'CUSTOM_QUIZ' && data.quizSettings) {
        const settings = data.quizSettings;
        const questionCount = settings.totalQuestions || 10;
        const generatedQuestions: any[] = [];
        const isColorReading = settings.answerType === 'color_reading';
        const mode = settings.colorReadingMode ?? (isColorReading ? 'value_to_color_full' : null);

        const pickOptionsForMultipleChoice = (allOptions: string[], correct: string, count: number): string[] => {
          const wrong = (allOptions || []).filter((o) => o !== correct);
          const take = Math.min(count - 1, wrong.length);
          const selected = wrong.sort(() => Math.random() - 0.5).slice(0, take);
          return [correct, ...selected].sort(() => Math.random() - 0.5);
        };

        for (let i = 0; i < questionCount; i++) {
          let q: any;

          if (isColorReading && mode === 'value_to_color_full') {
            const question = generateValueToColorQuestion(settings.resistorType);
            q = {
              id: `q_${i + 1}`,
              order: i + 1,
              bands: question.bands || [],
              correctAnswer: question.correctAnswer,
              correctBands: question.correctBands,
              options: question.options || [],
              explanation: question.explanation,
              resistorType: settings.resistorType,
              answerType: 'color_reading',
              colorReadingMode: 'value_to_color_full',
              points: Math.floor(data.maxPoints / questionCount),
              resistorValue: question.resistorValue,
              tolerance: question.tolerance,
            };
          } else if (isColorReading && mode === 'value_to_color_band_by_band') {
            const question = generateValueToColorQuestion(settings.resistorType);
            q = {
              id: `q_${i + 1}`,
              order: i + 1,
              bands: question.bands || [],
              correctAnswer: question.correctAnswer,
              correctBands: question.correctBands,
              options: question.options || [],
              explanation: question.explanation,
              resistorType: settings.resistorType,
              answerType: 'color_reading',
              colorReadingMode: 'value_to_color_band_by_band',
              points: Math.floor(data.maxPoints / questionCount),
              resistorValue: question.resistorValue,
              tolerance: question.tolerance,
            };
          } else if (isColorReading && mode === 'color_to_value') {
            const question = generateColorToValueQuestion(
              settings.resistorType,
              settings.optionCount || 4,
              settings.difficulty || 'medium'
            );
            const cvAnswerType = settings.colorToValueAnswerType || 'fill_in';
            let options: string[] = [];
            if (cvAnswerType === 'multiple_choice' && Array.isArray(question.options) && question.options.length > 1) {
              options = pickOptionsForMultipleChoice(
                question.options as string[],
                question.correctAnswer,
                settings.optionCount || 4
              );
            }
            q = {
              id: `q_${i + 1}`,
              order: i + 1,
              bands: question.bands || [],
              correctAnswer: question.correctAnswer,
              options,
              explanation: question.explanation,
              resistorType: settings.resistorType,
              answerType: 'color_reading',
              colorReadingMode: 'color_to_value',
              colorToValueAnswerType: cvAnswerType,
              points: Math.floor(data.maxPoints / questionCount),
              resistorValue: question.resistorValue,
              tolerance: question.tolerance,
            };
          } else if (isColorReading && mode === 'mixed') {
            const useValueToColor = Math.random() < 0.5;
            if (useValueToColor) {
              const question = generateValueToColorQuestion(settings.resistorType);
              q = {
                id: `q_${i + 1}`,
                order: i + 1,
                bands: question.bands || [],
                correctAnswer: question.correctAnswer,
                correctBands: question.correctBands,
                options: question.options || [],
                explanation: question.explanation,
                resistorType: settings.resistorType,
                answerType: 'color_reading',
                colorReadingMode: 'mixed',
                colorReadingSubMode: 'value_to_color',
                points: Math.floor(data.maxPoints / questionCount),
                resistorValue: question.resistorValue,
                tolerance: question.tolerance,
              };
            } else {
              const question = generateColorToValueQuestion(
                settings.resistorType,
                settings.optionCount || 4,
                settings.difficulty || 'medium'
              );
              const cvAnswerType = settings.colorToValueAnswerType || 'fill_in';
              let options: string[] = [];
              if (cvAnswerType === 'multiple_choice' && Array.isArray(question.options) && question.options.length > 1) {
                options = pickOptionsForMultipleChoice(
                  question.options as string[],
                  question.correctAnswer,
                  settings.optionCount || 4
                );
              }
              q = {
                id: `q_${i + 1}`,
                order: i + 1,
                bands: question.bands || [],
                correctAnswer: question.correctAnswer,
                options,
                explanation: question.explanation,
                resistorType: settings.resistorType,
                answerType: 'color_reading',
                colorReadingMode: 'mixed',
                colorReadingSubMode: 'color_to_value',
                colorToValueAnswerType: cvAnswerType,
                points: Math.floor(data.maxPoints / questionCount),
                resistorValue: question.resistorValue,
                tolerance: question.tolerance,
              };
            }
          } else {
            // multiple_choice, fill_in, color_selection, or color_reading fallback
            const isReverse = settings.answerType === 'color_selection' || (settings.answerType === 'color_reading' && !mode);
            const question = generateQuestion(
              settings.resistorType,
              isReverse,
              settings.optionCount || 4,
              settings.difficulty
            );
            q = {
              id: `q_${i + 1}`,
              order: i + 1,
              bands: question.bands || [],
              correctAnswer: question.correctAnswer,
              correctBands: question.correctBands,
              options: question.options || [],
              explanation: question.explanation,
              resistorType: settings.resistorType,
              answerType: settings.answerType,
              points: Math.floor(data.maxPoints / questionCount),
              resistorValue: question.resistorValue,
              tolerance: question.tolerance,
            };
          }
          generatedQuestions.push(q);
        }
        setQuestions(generatedQuestions);
        
        // Set showCorrectAnswers from settings
        // สำหรับ EXAM: ไม่แสดงคำตอบเสมอ
        if (data.assignmentMode === 'EXAM') {
          setShowCorrectAnswers(false);
        } else {
          setShowCorrectAnswers(data.quizSettings.showCorrectAnswer !== false);
        }
      }
      // ไม่รองรับ LEVEL_BASED แล้ว

      setStartTime(Date.now());
      
      // Set time limits
      if (data.assignmentType === 'CUSTOM_QUIZ' && data.quizSettings?.timeLimit) {
        setTimeRemaining(data.quizSettings.timeLimit);
        timeRemainingRef.current = data.quizSettings.timeLimit;
      } else if (data.assignmentType === 'FIXED_QUESTIONS' && data.quizSettingsForFixed?.timeLimit) {
        setTimeRemaining(data.quizSettingsForFixed.timeLimit);
        timeRemainingRef.current = data.quizSettingsForFixed.timeLimit;
      }

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load assignment');
      setIsLoading(false);
    }
  };

  // Combine number, unit, and tolerance into typedAnswer
  useEffect(() => {
    const cur = questions[currentQuestion];
    if (assignment?.assignmentType === 'CUSTOM_QUIZ' && assignment.quizSettings?.answerType === 'fill_in') {
      const formatted = numberValue && selectedUnit && toleranceValue
        ? `${numberValue}${selectedUnit} ${toleranceValue}`
        : '';
      setTypedAnswer(formatted);
    } else if (assignment?.assignmentType === 'FIXED_QUESTIONS' && cur?.answerType === 'fill_in') {
      const formatted = numberValue && selectedUnit && toleranceValue
        ? `${numberValue}${selectedUnit} ${toleranceValue}`
        : '';
      setTypedAnswer(formatted);
    } else if (cur?.colorToValueAnswerType === 'fill_in') {
      const formatted = numberValue && selectedUnit && toleranceValue
        ? `${numberValue}${selectedUnit} ${toleranceValue}`
        : '';
      setTypedAnswer(formatted);
    }
  }, [numberValue, selectedUnit, toleranceValue, assignment, questions, currentQuestion]);

  // Countdown timer per question
  useEffect(() => {
    if (answered || isQuizComplete || !questions[currentQuestion]) return;
    
    const currentQ = questions[currentQuestion];
    let countdownTime: number | null = null;
    
    if (assignment?.assignmentType === 'CUSTOM_QUIZ' && assignment.quizSettings?.countdownTime) {
      countdownTime = assignment.quizSettings.countdownTime;
    } else if (assignment?.assignmentType === 'FIXED_QUESTIONS' && assignment.quizSettingsForFixed?.countdownTime) {
      countdownTime = assignment.quizSettingsForFixed.countdownTime;
    }
    
    if (!countdownTime) return;
    
    setCountdown(countdownTime);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (!answered) {
            handleAutoAnswer();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestion, answered, isQuizComplete, assignment, questions]);

  // Total time limit timer
  useEffect(() => {
    if (!timeRemaining || isQuizComplete || hasTimeRunOut) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = (prev === null || prev <= 1) ? 0 : prev - 1;
        timeRemainingRef.current = newTime;
        
        if (newTime === 0) {
          setHasTimeRunOut(true);
          handleCompleteQuiz();
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, isQuizComplete, hasTimeRunOut]);

  const currentQ = questions[currentQuestion];

  const handleAutoAnswer = () => {
    if (!currentQ) return;
    setSelectedAnswer(currentQ.correctAnswer);
    setAnswered(true);
    setShowExplanation(true);
    setScore(prev => ({ ...prev, total: prev.total + 1 }));
  };

  const handleAnswer = (answer: string | boolean, bandsOverride?: string[]) => {
    if (answered || reviewMode) return;
    
    let isCorrect = false;
    let userAnswerStr = '';
    const isColorToValue = currentQ.colorReadingMode === 'color_to_value' || (currentQ.colorReadingMode === 'mixed' && currentQ.colorReadingSubMode === 'color_to_value');

    // Handle color_selection / color_reading value-to-color: compare bands
    if ((currentQ.answerType === 'color_selection' || currentQ.answerType === 'color_reading') && !isColorToValue && currentQ.correctBands) {
      const bandsToCompare = bandsOverride ?? selectedBands;
      isCorrect = JSON.stringify(bandsToCompare) === JSON.stringify(currentQ.correctBands);
      userAnswerStr = bandsToCompare.join('-');
    } else if (currentQ.answerType === 'color_selection' || currentQ.answerType === 'color_reading') {
      // color_to_value or fallback: compare string answer
      isCorrect = answer === currentQ.correctAnswer || answer === true;
      userAnswerStr = typeof answer === 'string' ? answer : selectedBands.join('-');
    } else {
      // For other answer types, compare string answers
      isCorrect = answer === currentQ.correctAnswer || answer === true;
      userAnswerStr = typeof answer === 'string' ? answer : String(answer);
    }
    
    setSelectedAnswer(userAnswerStr);
    setAnswered(true);
    
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
    
    setQuestionHistory(prev => [...prev, {
      question: currentQ,
      userAnswer: userAnswerStr,
      userBands: (bandsOverride ?? (currentQ.answerType === 'color_selection' || currentQ.answerType === 'color_reading' ? selectedBands : undefined)),
      isCorrect,
      timestamp: Date.now(),
    }]);
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setAnswered(false);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setNumberValue('');
      setSelectedUnit('Ω');
      setToleranceValue('±5%');
      setSelectedBands([]);
      setShowExplanation(false);
      setCountdown(null);
      setCurrentBandIndex(0);
    } else {
      handleCompleteQuiz();
    }
  };

  // Reset state when question changes
  useEffect(() => {
    if (currentQ) {
      setAnswered(false);
      setSelectedAnswer(null);
      setTypedAnswer('');
      setNumberValue('');
      setSelectedUnit('Ω');
      setToleranceValue('±5%');
      setSelectedBands([]);
      setShowExplanation(false);
      if (currentQ.colorReadingMode === 'value_to_color_band_by_band') {
        setCurrentBandIndex(0);
      }
      // Initialize selectedBands for color_selection and color_reading value-to-color
      if (currentQ.answerType === 'color_selection' || currentQ.answerType === 'color_reading') {
        const expectedBandsCount = currentQ.resistorType === 'FIVE_BAND' ? 5 : 4;
        setSelectedBands(new Array(expectedBandsCount).fill(''));
      }
    }
  }, [currentQuestion, currentQ]);

  const handleCompleteQuiz = () => {
    setIsQuizComplete(true);
    saveAttempt();
  };

  const saveAttempt = async () => {
    if (sessionSaved || !assignment) return;
    
    try {
      const accuracy = (score.correct / score.total) * 100;
      const elapsedTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
      const passThreshold = assignment.passThreshold ?? 50;
      const passed = accuracy >= passThreshold;
      
      const response = await fetch('/api/attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentId: assignment.id,
          assignmentType: assignment.assignmentType,
          courseId: assignment.courseId,
          levelId: assignment.levelId || null,
          mode: 'QUIZ',
          questions: questionHistory,
          score: score.correct,
          percentage: accuracy,
          timeTaken: elapsedTime,
          passed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to save attempt:', errorData);
        throw new Error(errorData.error || 'Failed to save attempt');
      }

      setSessionSaved(true);
      
      // ตรวจสอบ assignmentMode และ settings
      // สำหรับ EXAM: redirect เสมอ
      // สำหรับ PRACTICE: redirect ถ้า allowRetake = false
      if (assignment.assignmentMode === 'EXAM' || (assignment.assignmentMode === 'PRACTICE' && assignment.allowRetake === false)) {
        router.push(`/learn/classroom/courses/${courseId}/assignments/${assignmentId}/result`);
      }
      // สำหรับ PRACTICE ที่ allowRetake = true: ไม่ redirect (แสดงปุ่ม "ทำอีกครั้ง")
    } catch (err) {
      console.error('Error saving attempt:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error || 'ไม่พบงาน'}</p>
            <Link
              href={`/learn/classroom/courses/${courseId}/assignments`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้างาน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If quiz is complete, it should redirect to result page
  // This screen should not be shown as we redirect immediately after saving
  if (isQuizComplete && sessionSaved) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังนำไปหน้าผลลัพธ์...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">ไม่มีคำถาม</p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isColorToValueQ = currentQ.colorReadingMode === 'color_to_value' || (currentQ.colorReadingMode === 'mixed' && currentQ.colorReadingSubMode === 'color_to_value');
  const isValueToColorFull = (currentQ.answerType === 'color_selection') || (currentQ.answerType === 'color_reading' && (currentQ.colorReadingMode === 'value_to_color_full' || (currentQ.colorReadingMode === 'mixed' && currentQ.colorReadingSubMode === 'value_to_color')));
  const isValueToColorBandByBand = currentQ.answerType === 'color_reading' && currentQ.colorReadingMode === 'value_to_color_band_by_band';
  const expectedBandsCount = currentQ.resistorType === 'FIVE_BAND' ? 5 : 4;
  const isLastBand = currentBandIndex === expectedBandsCount - 1;
  const hasSelectedCurrentBand = !!(selectedBands[currentBandIndex] || '').trim();

  let isCorrect = false;
  if ((currentQ.answerType === 'color_selection' || currentQ.answerType === 'color_reading') && !isColorToValueQ && currentQ.correctBands) {
    isCorrect = JSON.stringify(selectedBands) === JSON.stringify(currentQ.correctBands);
  } else {
    isCorrect = selectedAnswer === currentQ.correctAnswer;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <ClassroomSidebar courseId={courseId} />
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/learn/classroom/courses/${courseId}/assignments`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้างาน
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{assignment.title}</h1>
            {assignment.description && (
              <div
                className="text-gray-600 mb-4"
                dangerouslySetInnerHTML={{
                  __html: assignment.descriptionFormat === 'HTML'
                    ? sanitizeHtml(assignment.description)
                    : assignment.description
                }}
              />
            )}
            {assignment.instructions && (
              <div
                className="text-sm text-gray-500 mb-4 p-3 bg-blue-50 rounded-lg"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(assignment.instructions) }}
              />
            )}
          </div>

          {/* Progress and Timer */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                ข้อ {currentQuestion + 1} จาก {questions.length}
              </span>
              <div className="flex items-center gap-4">
                {countdown !== null && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-600">{countdown} วินาที</span>
                  </div>
                )}
                {timeRemaining !== null && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            {isValueToColorFull && (
              <div className="mb-6">
                <p className="text-lg font-semibold mb-4">ค่าตัวต้านทาน: {currentQ.correctAnswer}</p>
                <p className="text-sm text-gray-600 mb-4">เลือกแถบสีที่ถูกต้อง:</p>
              </div>
            )}
            {isValueToColorBandByBand && (
              <div className="mb-6">
                <ColorReadingBandByBand
                  resistorType={currentQ.resistorType}
                  currentBandIndex={currentBandIndex}
                  selectedBands={selectedBands}
                  correctBands={currentQ.correctBands || []}
                  onBandSelect={(color) => {
                    const newBands = [...selectedBands];
                    newBands[currentBandIndex] = color;
                    setSelectedBands(newBands);
                        if (isLastBand) {
                          handleAnswer(true, newBands);
                        }
                  }}
                  disabled={answered || reviewMode}
                      showResult={hasSelectedCurrentBand || answered}
                      isCorrect={answered ? (JSON.stringify(selectedBands) === JSON.stringify(currentQ.correctBands)) : (hasSelectedCurrentBand && (selectedBands[currentBandIndex] === currentQ.correctBands?.[currentBandIndex]))}
                  resistorValue={currentQ.resistorValue}
                  tolerance={currentQ.tolerance}
                />
                {hasSelectedCurrentBand && !isLastBand && !answered && !reviewMode && (
                  <button
                    type="button"
                    onClick={() => setCurrentBandIndex((prev) => prev + 1)}
                    className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    แถบถัดไป
                  </button>
                )}
              </div>
            )}
            {isColorToValueQ && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">ค่าความต้านทานของตัวต้านทานนี้คือ?</p>
                <ResistorDisplay bands={currentQ.bands || []} type={currentQ.resistorType} />
              </div>
            )}
            {!isValueToColorFull && !isValueToColorBandByBand && !isColorToValueQ && (
              <div className="mb-6">
                <ResistorDisplay bands={currentQ.bands || []} type={currentQ.resistorType} />
              </div>
            )}

            {(currentQ.answerType === 'multiple_choice' || currentQ.colorToValueAnswerType === 'multiple_choice') && (
              <div className="space-y-3">
                {currentQ.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    disabled={answered || reviewMode}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answered && showCorrectAnswers && option === currentQ.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : answered && option === selectedAnswer && !isCorrect
                        ? 'border-red-500 bg-red-50'
                        : selectedAnswer === option
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${answered || reviewMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {(currentQ.answerType === 'fill_in' || currentQ.colorToValueAnswerType === 'fill_in') && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={numberValue}
                    onChange={(e) => setNumberValue(e.target.value)}
                    disabled={answered || reviewMode}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="ค่าตัวต้านทาน"
                  />
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    disabled={answered || reviewMode}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Ω">Ω</option>
                    <option value="kΩ">kΩ</option>
                    <option value="MΩ">MΩ</option>
                  </select>
                  <select
                    value={toleranceValue}
                    onChange={(e) => setToleranceValue(e.target.value)}
                    disabled={answered || reviewMode}
                    className="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="±5%">±5%</option>
                    <option value="±10%">±10%</option>
                    <option value="±1%">±1%</option>
                    <option value="±2%">±2%</option>
                    <option value="±0.5%">±0.5%</option>
                    <option value="±0.25%">±0.25%</option>
                    <option value="±0.1%">±0.1%</option>
                    <option value="±0.05%">±0.05%</option>
                  </select>
                </div>
                {!answered && !reviewMode && (
                  <button
                    onClick={() => handleAnswer(typedAnswer)}
                    disabled={!typedAnswer}
                    className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ส่งคำตอบ
                  </button>
                )}
              </div>
            )}

            {isValueToColorFull && (
              <div>
                <ColorBandSelector
                  bands={selectedBands}
                  onBandChange={(index, color) => {
                    const newBands = [...selectedBands];
                    newBands[index] = color;
                    setSelectedBands(newBands);
                  }}
                  resistorType={currentQ.resistorType}
                  disabled={answered || reviewMode}
                />
                {!answered && !reviewMode && selectedBands.length === expectedBandsCount && selectedBands.every((b) => !!b) && (
                  <button
                    onClick={() => {
                      // For color_selection, compare bands with correctBands
                      if (currentQ.correctBands) {
                        const isCorrect = JSON.stringify(selectedBands) === JSON.stringify(currentQ.correctBands);
                        handleAnswer(isCorrect);
                      } else {
                        // Fallback: calculate and compare
                        const calculatedAnswer = formatResistance(
                          calculateResistance(selectedBands, currentQ.resistorType),
                          getTolerance(selectedBands, currentQ.resistorType)
                        );
                        handleAnswer(calculatedAnswer);
                      }
                    }}
                    className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    ส่งคำตอบ
                  </button>
                )}
                {answered && showCorrectAnswers && currentQ.correctBands && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">แถบสีที่ถูกต้อง:</p>
                    <ResistorDisplay
                      bands={currentQ.correctBands}
                      type={currentQ.resistorType}
                    />
                  </div>
                )}
              </div>
            )}

            {answered && (currentQ.answerType !== 'color_selection' && (currentQ.answerType !== 'color_reading' || isColorToValueQ)) && (
              <div className={`mt-4 p-4 rounded-lg ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? '✓ คำตอบถูกต้อง!' : '✗ คำตอบไม่ถูกต้อง'}
                </p>
                {showCorrectAnswers && (
                  <>
                    <p className="text-sm text-gray-600 mt-1">
                      คำตอบที่ถูกต้อง: {currentQ.correctAnswer}
                    </p>
                    {currentQ.explanation && (
                      <p className="text-sm text-gray-600 mt-2">{currentQ.explanation}</p>
                    )}
                  </>
                )}
              </div>
            )}
            {answered && (currentQ.answerType === 'color_selection' || (currentQ.answerType === 'color_reading' && !isColorToValueQ)) && (
              <div className={`mt-4 p-4 rounded-lg ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? '✓ คำตอบถูกต้อง!' : '✗ คำตอบไม่ถูกต้อง'}
                </p>
                {showCorrectAnswers && currentQ.explanation && (
                  <p className="text-sm text-gray-600 mt-2">{currentQ.explanation}</p>
                )}
              </div>
            )}

            {answered && (
              <button
                onClick={handleNext}
                className="mt-4 w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
              >
                {currentQuestion < questions.length - 1 ? 'ข้อถัดไป' : 'เสร็จสิ้น'}
              </button>
            )}
          </div>

          {/* Score */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">คะแนน</span>
              <span className="text-lg font-bold text-gray-900">
                {score.correct}/{score.total}
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper functions
function calculateResistance(bands: string[], resistorType: 'FOUR_BAND' | 'FIVE_BAND'): number {
  if (resistorType === 'FIVE_BAND') {
    if (bands.length < 5) return 0;
    const digit1 = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit] || 0;
    const digit2 = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit] || 0;
    const digit3 = colorCodes.digit[bands[2] as keyof typeof colorCodes.digit] || 0;
    const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier] || 1;
    return parseInt(`${digit1}${digit2}${digit3}`) * multiplier;
  } else {
    if (bands.length < 4) return 0;
    const digit1 = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit] || 0;
    const digit2 = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit] || 0;
    const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier] || 1;
    return parseInt(`${digit1}${digit2}`) * multiplier;
  }
}

function getTolerance(bands: string[], resistorType: 'FOUR_BAND' | 'FIVE_BAND'): string {
  const toleranceBand = bands[resistorType === 'FIVE_BAND' ? 4 : 3];
  return colorCodes.tolerance[toleranceBand as keyof typeof colorCodes.tolerance] || '±5%';
}

export default function AssignmentQuizPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <AssignmentQuizContent />
    </Suspense>
  );
}
