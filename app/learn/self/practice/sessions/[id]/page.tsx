'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/practice-sessions?id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSession(data);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  if (!session) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Session Not Found</h2>
            <Link
              href="/learn/self/practice"
              className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white font-semibold hover:from-orange-600 hover:to-orange-700"
            >
              Back to Practice
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const settings = session.settings as any || {};
  const resistorType = session.preset?.resistorType || settings.resistorType || 'FOUR_BAND';
  const answerType = settings.answerType || 'multiple_choice';
  const difficulty = settings.difficulty || 'medium';
  const questions = (session.questions as any[]) || [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <Link href="/learn/self/practice" className="text-orange-600 hover:text-orange-700 mb-3 sm:mb-4 inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Practice
            </Link>
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Practice Session Details</h1>
            <p className="text-sm sm:text-base text-gray-600">{formatDate(session.completedAt)}</p>
          </div>

          {/* Session Summary */}
          <div className="mb-6 rounded-xl bg-white p-4 sm:p-6 shadow-lg">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{session.presetName || 'Quick Practice'}</h2>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                {resistorType === 'FOUR_BAND' ? '4-Band' : '5-Band'}
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {answerType === 'multiple_choice' ? 'Multiple Choice' : 'Fill in'}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                difficulty === 'medium' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{session.correctAnswers}/{session.totalQuestions}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(session.accuracy)}%</div>
                <div className="text-xs text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatTime(session.totalTime)}</div>
                <div className="text-xs text-gray-600">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{questions.length}</div>
                <div className="text-xs text-gray-600">Questions</div>
              </div>
            </div>
          </div>

          {/* Question History */}
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Question History</h2>
            
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question: any, index: number) => (
                  <div
                    key={index}
                    className={`rounded-lg border-2 p-4 ${
                      question.isCorrect
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">Question {question.questionNumber || index + 1}</span>
                        {question.isCorrect ? (
                          <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-semibold text-white">
                            Correct
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white">
                            Incorrect
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resistor Display */}
                    <div className="mb-4">
                      <ResistorDisplay
                        bands={question.bands}
                        showAnswer={true}
                        answer={question.correctAnswer}
                        isCorrect={question.isCorrect}
                        type={resistorType as 'FOUR_BAND' | 'FIVE_BAND'}
                      />
                    </div>

                    {/* Answers */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Your Answer:</span>
                        <span className={`font-bold ${
                          question.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {question.userAnswer}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Correct Answer:</span>
                        <span className="font-bold text-green-700">{question.correctAnswer}</span>
                      </div>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div className="mt-3 rounded-lg bg-gray-100 p-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Explanation:</span> {question.explanation}
                        </p>
                      </div>
                    )}

                    {/* Options (if multiple choice) */}
                    {answerType === 'multiple_choice' && question.options && (
                      <div className="mt-3">
                        <p className="mb-2 text-sm font-semibold text-gray-700">Options:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.map((option: string, optIndex: number) => {
                            const isUserAnswer = option === question.userAnswer;
                            const isCorrect = option === question.correctAnswer;
                            
                            return (
                              <div
                                key={optIndex}
                                className={`rounded-lg border-2 p-2 text-sm ${
                                  isCorrect
                                    ? 'border-green-600 bg-green-100'
                                    : isUserAnswer && !isCorrect
                                    ? 'border-red-600 bg-red-100'
                                    : 'border-gray-300 bg-white'
                                }`}
                              >
                                {option}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                <p className="text-gray-600">No question history available for this session.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

