'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ColorToValueBandByBand from '@/components/features/ColorToValueBandByBand';
import { generateColorToValueQuestion, generateColorToValueBandQuestion, getBandLabel, colorCodes } from '@/lib/resistorUtils';
import { calculateDeepAnalytics } from '@/lib/analyticsUtils';
import { ArrowLeft, Eye, CheckCircle2, Trophy, RotateCcw, Home } from 'lucide-react';

function ColorToValueContent() {
  const searchParams = useSearchParams();
  const resistorType = (searchParams.get('type') || 'FOUR_BAND') as 'FOUR_BAND' | 'FIVE_BAND';
  const bandIndexParam = searchParams.get('bandIndex');
  const bandIndex = bandIndexParam !== null ? parseInt(bandIndexParam) : null;
  const digitIndexParam = searchParams.get('digitIndex');
  const digitIndex = digitIndexParam !== null ? parseInt(digitIndexParam) : null;
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentBandIndex, setCurrentBandIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPracticeComplete, setIsPracticeComplete] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionHistory, setQuestionHistory] = useState<any[]>([]);
  const [bandHistory, setBandHistory] = useState<any[]>([]);
  
  const expectedBandsCount = resistorType === 'FIVE_BAND' ? 5 : 4;
  const isSpecificBandMode = bandIndex !== null;

  useEffect(() => {
    generateQuestions();
    setStartTime(Date.now());
    setIsLoading(false);
  }, [resistorType, bandIndex, digitIndex]);

  const generateQuestions = () => {
    const questionCount = 10;
    const generatedQuestions = Array.from({ length: questionCount }, () => {
      if (bandIndex !== null) {
        return generateColorToValueBandQuestion(resistorType, bandIndex, digitIndex);
      } else {
        return generateColorToValueQuestion(resistorType, 4, 'medium');
      }
    });
    setQuestions(generatedQuestions);
  };
  
  useEffect(() => {
    if (currentQuestion < questions.length) {
      setCurrentBandIndex(0);
      setAnswered(false);
      setShowResult(false);
      setSelectedAnswer(null);
    }
  }, [currentQuestion, questions.length]);

  const currentQ = questions[currentQuestion];
  const displayBandIndex = isSpecificBandMode ? (bandIndex || 0) : currentBandIndex;
  
  const getCurrentBandValue = (): string => {
    if (!currentQ) return '';
    
    const is5Band = resistorType === 'FIVE_BAND';
    const bands = currentQ.bands;
    const bandIdx = displayBandIndex;
    
    if (is5Band) {
      if (bandIdx === 0) {
        return colorCodes.digit[bands[0] as keyof typeof colorCodes.digit].toString();
      } else if (bandIdx === 1) {
        return colorCodes.digit[bands[1] as keyof typeof colorCodes.digit].toString();
      } else if (bandIdx === 2) {
        return colorCodes.digit[bands[2] as keyof typeof colorCodes.digit].toString();
      } else if (bandIdx === 3) {
        const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier];
        if (multiplier >= 1000000000) return '×1G';
        else if (multiplier >= 100000000) return '×100M';
        else if (multiplier >= 10000000) return '×10M';
        else if (multiplier >= 1000000) return '×1M';
        else if (multiplier >= 100000) return '×100K';
        else if (multiplier >= 10000) return '×10K';
        else if (multiplier >= 1000) return '×1K';
        else if (multiplier === 0.1) return '×0.1';
        else if (multiplier === 0.01) return '×0.01';
        else return `×${multiplier}`;
      } else if (bandIdx === 4) {
        return colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance];
      }
    } else {
      if (bandIdx === 0) {
        return colorCodes.digit[bands[0] as keyof typeof colorCodes.digit].toString();
      } else if (bandIdx === 1) {
        return colorCodes.digit[bands[1] as keyof typeof colorCodes.digit].toString();
      } else if (bandIdx === 2) {
        const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier];
        if (multiplier >= 1000000000) return '×1G';
        else if (multiplier >= 100000000) return '×100M';
        else if (multiplier >= 10000000) return '×10M';
        else if (multiplier >= 1000000) return '×1M';
        else if (multiplier >= 100000) return '×100K';
        else if (multiplier >= 10000) return '×10K';
        else if (multiplier >= 1000) return '×1K';
        else if (multiplier === 0.1) return '×0.1';
        else if (multiplier === 0.01) return '×0.01';
        else return `×${multiplier}`;
      } else if (bandIdx === 3) {
        return colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance];
      }
    }
    return '';
  };
  
  const getCurrentBandOptions = (): string[] => {
    const correctValue = getCurrentBandValue();
    if (!correctValue) return [];
    
    const is5Band = resistorType === 'FIVE_BAND';
    const bandIdx = displayBandIndex;
    let allOptions: string[] = [];
    
    if (is5Band) {
      if (bandIdx <= 2) {
        allOptions = Array.from({ length: 10 }, (_, i) => i.toString());
      } else if (bandIdx === 3) {
        const multipliers = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 0.1, 0.01];
        allOptions = multipliers.map(m => {
          if (m >= 1000000000) return '×1G';
          if (m >= 100000000) return '×100M';
          if (m >= 10000000) return '×10M';
          if (m >= 1000000) return '×1M';
          if (m >= 100000) return '×100K';
          if (m >= 10000) return '×10K';
          if (m >= 1000) return '×1K';
          if (m === 0.1) return '×0.1';
          if (m === 0.01) return '×0.01';
          return `×${m}`;
        });
      } else {
        allOptions = ['±1%', '±2%', '±0.5%', '±0.25%', '±0.1%', '±0.05%', '±5%', '±10%'];
      }
    } else {
      if (bandIdx <= 1) {
        allOptions = Array.from({ length: 10 }, (_, i) => i.toString());
      } else if (bandIdx === 2) {
        const multipliers = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 0.1, 0.01];
        allOptions = multipliers.map(m => {
          if (m >= 1000000000) return '×1G';
          if (m >= 100000000) return '×100M';
          if (m >= 10000000) return '×10M';
          if (m >= 1000000) return '×1M';
          if (m >= 100000) return '×100K';
          if (m >= 10000) return '×10K';
          if (m >= 1000) return '×1K';
          if (m === 0.1) return '×0.1';
          if (m === 0.01) return '×0.01';
          return `×${m}`;
        });
      } else {
        allOptions = ['±1%', '±2%', '±0.5%', '±0.25%', '±0.1%', '±0.05%', '±5%', '±10%'];
      }
    }
    
    return allOptions;
  };

  const handleAnswerSelect = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    
    setTimeout(() => {
      handleCheckAnswerWithValue(answer);
    }, 100);
  };
  
  const handleCheckAnswerWithValue = (answer: string) => {
    if (answered) return;
    
    const correctValue = getCurrentBandValue();
    const correct = answer === correctValue;
    setIsCorrect(correct);
    setShowResult(true);
    setAnswered(true);
    
    const bandRecord = {
      questionNumber: currentQuestion + 1,
      bandIndex: displayBandIndex,
      correctValue,
      userAnswer: answer,
      isCorrect: correct,
      timestamp: Date.now()
    };
    setBandHistory(prev => [...prev, bandRecord]);
    
    if (correct) {
      setTimeout(() => {
        if (isSpecificBandMode) {
          handleNextQuestion();
        } else {
          handleNextBand();
        }
      }, 1500);
    }
  };
  
  const handleNextBand = () => {
    if (isSpecificBandMode) {
      handleNextQuestion();
    } else if (currentBandIndex < expectedBandsCount - 1) {
      setCurrentBandIndex(currentBandIndex + 1);
      setAnswered(false);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    if (currentQ) {
      const allCorrect = bandHistory
        .filter(b => b.questionNumber === currentQuestion + 1)
        .every(b => b.isCorrect);
      
      const correctBands = currentQ.bands || [];
      const userBands = bandHistory
        .filter(b => b.questionNumber === currentQuestion + 1)
        .map(b => b.userAnswer);
      const correctResistorValue = currentQ.resistorValue;
      const correctTolerance = currentQ.tolerance || '';
      
      const digitPositions: any = {};
      const is5Band = resistorType === 'FIVE_BAND';
      
      if (correctBands.length > 0 && userBands.length > 0) {
        const maxBands = Math.max(correctBands.length, userBands.length);
        for (let i = 0; i < maxBands; i++) {
          const correctBand = correctBands[i] || '';
          const userBand = userBands[i] || '';
          
          if (is5Band) {
            if (i === 0) digitPositions.position1 = { correct: correctBand, user: userBand };
            else if (i === 1) digitPositions.position2 = { correct: correctBand, user: userBand };
            else if (i === 2) digitPositions.position3 = { correct: correctBand, user: userBand };
            else if (i === 3) digitPositions.multiplier = { correct: correctBand, user: userBand };
            else if (i === 4) digitPositions.tolerance = { correct: correctBand, user: userBand };
          } else {
            if (i === 0) digitPositions.position1 = { correct: correctBand, user: userBand };
            else if (i === 1) digitPositions.position2 = { correct: correctBand, user: userBand };
            else if (i === 2) digitPositions.multiplier = { correct: correctBand, user: userBand };
            else if (i === 3) digitPositions.tolerance = { correct: correctBand, user: userBand };
          }
        }
      }
      
      const questionRecord = {
        questionNumber: currentQuestion + 1,
        bands: currentQ.bands,
        correctAnswer: currentQ.correctAnswer,
        userAnswer: userBands.join('-'),
        isCorrect: allCorrect,
        explanation: currentQ.explanation,
        resistorValue: currentQ.resistorValue,
        questionType: 'color_to_value_band_by_band',
        resistorType,
        bandHistory: bandHistory.filter(b => b.questionNumber === currentQuestion + 1),
        timestamp: Date.now(),
        correctBands,
        userBands,
        correctResistorValue,
        userResistorValue: undefined,
        correctTolerance,
        userTolerance: undefined,
        digitPositions
      };
      setQuestionHistory(prev => [...prev, questionRecord]);
      
      if (allCorrect) {
        setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
      } else {
        setScore(prev => ({ ...prev, total: prev.total + 1 }));
      }
    }
    
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    setCurrentBandIndex(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setShowResult(false);
    
    if (nextQuestion >= questions.length) {
      setIsPracticeComplete(true);
    }
  };

  // Save session when practice is complete
  useEffect(() => {
    if (isPracticeComplete && !sessionSaved && score.total > 0) {
      const saveSession = async () => {
        try {
          const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;
          const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
          const deepAnalytics = calculateDeepAnalytics(questionHistory);
          
          const response = await fetch('/api/practice-sessions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              presetId: null,
              presetName: isSpecificBandMode 
                ? `ฝึกอ่านสี - สี→ค่า (${getBandLabel(bandIndex || 0, resistorType)})`
                : 'ฝึกอ่านสี - สี→ค่า (ทีละแถบ)',
              totalQuestions: questions.length,
              correctAnswers: score.correct,
              incorrectAnswers: score.total - score.correct,
              accuracy,
              averageTime: score.total > 0 ? elapsedTime / score.total : 0,
              totalTime: elapsedTime,
              settings: {
                resistorType,
                colorReadingMode: 'color_to_value',
                totalQuestions: questions.length,
                bandIndex: isSpecificBandMode ? bandIndex : undefined,
                digitIndex: isSpecificBandMode ? digitIndex : undefined,
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
  }, [isPracticeComplete, sessionSaved, score, startTime, questions.length, resistorType, questionHistory, isSpecificBandMode, bandIndex, digitIndex]);

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Get practice mode title
  const getPracticeTitle = () => {
    if (isSpecificBandMode) {
      return `ฝึกอ่านสี - ${getBandLabel(bandIndex || 0, resistorType)}`;
    }
    return 'ฝึกอ่านสี (สี→ค่า)';
  };

  // Handle restart practice
  const handleRestart = () => {
    setCurrentQuestion(0);
    setCurrentBandIndex(0);
    setScore({ correct: 0, total: 0 });
    setAnswered(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setIsPracticeComplete(false);
    setSessionSaved(false);
    setStartTime(Date.now());
    setQuestionHistory([]);
    setBandHistory([]);
    generateQuestions();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="text-gray-600 font-medium">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  // Practice complete state - Full screen celebration
  if (isPracticeComplete) {
    const finalAccuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const isExcellent = finalAccuracy >= 80;
    const isGood = finalAccuracy >= 60 && finalAccuracy < 80;
    
    return (
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div 
          className="flex-1 flex flex-col transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          {/* Full screen celebration */}
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100">
            <div className="text-center px-6 max-w-lg">
              {/* Trophy/Icon */}
              <div className="mb-8 flex justify-center">
                <div className={`flex h-28 w-28 items-center justify-center rounded-full shadow-xl ${
                  isExcellent ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  isGood ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                  'bg-gradient-to-br from-blue-400 to-blue-500'
                }`}>
                  <Trophy className="h-14 w-14 text-white" />
                </div>
              </div>
              
              {/* Congratulation text */}
              <h1 className="mb-3 text-4xl font-extrabold text-gray-900">
                {isExcellent ? 'ยอดเยี่ยม!' : isGood ? 'ดีมาก!' : 'ฝึกฝนเสร็จสิ้น!'}
              </h1>
              <p className="mb-8 text-lg text-gray-600">
                คุณได้ทำครบทั้ง {questions.length} ข้อแล้ว
              </p>
              
              {/* Score card */}
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
              
              {/* Action buttons */}
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
      
      <div 
        className="flex-1 flex flex-col transition-all duration-200 ease-out"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            {/* Back button */}
            <Link 
              href="/learn/self/practice/quick/select"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline font-medium">กลับ</span>
            </Link>
            
            {/* Title */}
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="font-bold text-sm sm:text-base">{getPracticeTitle()}</span>
            </div>
            
            {/* Stats */}
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
          
          {/* Progress bar */}
          <div className="px-4 lg:px-6 pb-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content area - fills remaining space */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex items-center justify-center p-4 lg:p-6 overflow-y-auto">
            <div className="w-full max-w-5xl my-auto">
              <ColorToValueBandByBand
                resistorType={resistorType}
                currentBandIndex={displayBandIndex}
                bands={currentQ.bands}
                correctValue={getCurrentBandValue()}
                options={getCurrentBandOptions()}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                disabled={answered}
                showResult={showResult}
                isCorrect={isCorrect}
                resistorValue={currentQ.resistorValue}
                tolerance={currentQ.tolerance}
                bandValue={getCurrentBandValue()}
              />
            </div>
          </div>

          {/* Footer with continue button (when wrong) */}
          {showResult && !isCorrect && (
            <div className="border-t border-gray-200 bg-white px-4 lg:px-6 py-4">
              <div className="max-w-5xl mx-auto">
                <button
                  onClick={handleNextBand}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-xl"
                >
                  ต่อไป
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ColorToValuePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-white">
        <LeftSidebar />
        <div 
          className="flex-1 flex items-center justify-center transition-all duration-200 ease-out"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="text-gray-600 font-medium">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    }>
      <ColorToValueContent />
    </Suspense>
  );
}
