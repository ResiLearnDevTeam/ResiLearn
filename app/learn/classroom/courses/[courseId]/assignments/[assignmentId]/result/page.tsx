'use client';

import ClassroomSidebar from '@/components/layout/ClassroomSidebar';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import { CourseAssignment } from '@/types/classroom';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { AlertCircle, ArrowLeft, CheckCircle2, Clock, Eye } from 'lucide-react';

interface AttemptData {
  id: string;
  userId: string;
  assignmentId: string;
  assignmentType: string;
  courseId: string;
  levelId: string | null;
  mode: string;
  score: number | null;
  percentage: number | null;
  timeTaken: number | null;
  completedAt: string;
  passed: boolean | null;
  questions: any[];
  level?: any;
  course?: any;
}

function AssignmentResultContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const courseId = params?.courseId as string;
  const assignmentId = params?.assignmentId as string;

  const [assignment, setAssignment] = useState<CourseAssignment | null>(null);
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [courseId, assignmentId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch assignment and attempt in parallel
      const [assignmentResponse, attemptResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}/assignments/${assignmentId}`),
        fetch(`/api/courses/${courseId}/assignments/${assignmentId}/attempt`),
      ]);

      if (!assignmentResponse.ok) {
        const errorData = await assignmentResponse.json();
        throw new Error(errorData.error || 'Failed to fetch assignment');
      }

      if (!attemptResponse.ok) {
        if (attemptResponse.status === 404) {
          // No attempt found - redirect to assignments page
          router.push(`/learn/classroom/courses/${courseId}/assignments`);
          return;
        }
        const errorData = await attemptResponse.json();
        throw new Error(errorData.error || 'Failed to fetch attempt');
      }

      const assignmentData = await assignmentResponse.json();
      const attemptData = await attemptResponse.json();

      setAssignment(assignmentData);
      setAttempt(attemptData);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
      setIsLoading(false);
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

  if (error || !assignment || !attempt) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <ClassroomSidebar courseId={courseId} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error || 'ไม่พบข้อมูล'}</p>
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

  const accuracy = attempt.percentage || 0;
  const elapsedTime = attempt.timeTaken || 0;
  const passed = attempt.passed || false;
  const questions = Array.isArray(attempt.questions) ? attempt.questions : [];

  // Check if showCorrectAnswer is enabled
  let showCorrectAnswer = true; // default
  // สำหรับ EXAM: ไม่แสดงคำตอบเสมอ
  if (assignment.assignmentMode === 'EXAM') {
    showCorrectAnswer = false;
  } else if (assignment.assignmentMode === 'PRACTICE') {
    // สำหรับ PRACTICE: ตรวจสอบจาก settings
    if (assignment.assignmentType === 'CUSTOM_QUIZ') {
      showCorrectAnswer = assignment.quizSettings?.showCorrectAnswer !== false;
    } else if (assignment.assignmentType === 'FIXED_QUESTIONS') {
      showCorrectAnswer = assignment.quizSettingsForFixed?.showCorrectAnswer !== false;
    }
  } else {
    // Backward compatibility
    if (assignment.assignmentType === 'CUSTOM_QUIZ') {
      showCorrectAnswer = assignment.quizSettings?.showCorrectAnswer !== false;
    } else if (assignment.assignmentType === 'FIXED_QUESTIONS') {
      showCorrectAnswer = assignment.quizSettingsForFixed?.showCorrectAnswer !== false;
    }
  }

  // Check if should show score
  let shouldShowScore = true;
  if (assignment.assignmentMode === 'EXAM') {
    shouldShowScore = assignment.showScore !== false;
  } else if (assignment.assignmentMode === 'PRACTICE') {
    shouldShowScore = assignment.hasScore !== false;
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
          </div>

          {/* Summary Cards */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {passed ? (
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                ) : (
                  <AlertCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? 'ทำสำเร็จ!' : 'ยังไม่ผ่าน'}
              </h2>
              <p className="text-gray-500">
                ทำเมื่อ: {new Date(attempt.completedAt).toLocaleString('th-TH')}
              </p>
            </div>
            
            <div className={`grid gap-4 ${
              shouldShowScore ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-2'
            }`}>
              {shouldShowScore && (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">คะแนน</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {attempt.score || 0}/{assignment.maxPoints}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-1">เปอร์เซ็นต์</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(accuracy)}%
                    </p>
                  </div>
                </>
              )}
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">เวลา</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </p>
              </div>
              {shouldShowScore && (
                <div className={`rounded-lg p-4 text-center ${
                  passed ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className="text-sm text-gray-600 mb-1">สถานะ</p>
                  <p className={`text-2xl font-bold ${
                    passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {passed ? 'ผ่าน' : 'ไม่ผ่าน'}
                  </p>
                </div>
              )}
              {!shouldShowScore && (
                <div className={`rounded-lg p-4 text-center ${
                  passed ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className="text-sm text-gray-600 mb-1">สถานะ</p>
                  <p className={`text-2xl font-bold ${
                    passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {passed ? 'ผ่าน' : 'ไม่ผ่าน'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Question Results */}
          {questions.length > 0 && showCorrectAnswer ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">รายละเอียดคำตอบ</h3>
              <div className="space-y-4">
                {questions.map((item: any, idx: number) => {
                  const question = item.question || {};
                  const userAnswer = item.userAnswer || '';
                  const isCorrect = item.isCorrect || false;
                  const userBands = item.userBands;

                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-lg border-2 ${
                        isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                              isCorrect
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className={`font-semibold ${
                              isCorrect ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {isCorrect ? '✓ คำตอบถูกต้อง' : '✗ คำตอบไม่ถูกต้อง'}
                            </span>
                          </div>

                          {/* Resistor Display */}
                          {question.bands && question.bands.length > 0 && (
                            <div className="mb-4">
                              <ResistorDisplay
                                bands={question.bands}
                                type={question.resistorType || 'FOUR_BAND'}
                              />
                            </div>
                          )}

                          {/* User Bands (for color_selection) */}
                          {userBands && Array.isArray(userBands) && userBands.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">แถบสีที่คุณเลือก:</p>
                              <ResistorDisplay
                                bands={userBands}
                                type={question.resistorType || 'FOUR_BAND'}
                              />
                            </div>
                          )}

                          {/* Correct Bands (for color_selection) */}
                          {question.correctBands && Array.isArray(question.correctBands) && question.correctBands.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-700 mb-2">แถบสีที่ถูกต้อง:</p>
                              <ResistorDisplay
                                bands={question.correctBands}
                                type={question.resistorType || 'FOUR_BAND'}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {userAnswer && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">คำตอบของคุณ:</p>
                            <p className="text-base text-gray-900 font-semibold">{userAnswer}</p>
                          </div>
                        )}
                        {question.correctAnswer && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">คำตอบที่ถูกต้อง:</p>
                            <p className="text-base text-gray-900 font-semibold">{question.correctAnswer}</p>
                          </div>
                        )}
                        {question.explanation && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-1">คำอธิบาย:</p>
                            <p className="text-sm text-gray-600">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : questions.length > 0 && !showCorrectAnswer ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-gray-600">ครูไม่ได้เปิดให้ดูคำตอบที่ถูกต้อง</p>
            </div>
          ) : null}

          {/* Action Button */}
          <div className="mt-6 text-center">
            <Link
              href={`/learn/classroom/courses/${courseId}/assignments`}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้างาน
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AssignmentResultPage() {
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
      <AssignmentResultContent />
    </Suspense>
  );
}
