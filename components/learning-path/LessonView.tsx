'use client';

import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Target,
    BookOpen,
    CheckCircle,
    PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import confetti from 'canvas-confetti';

interface LessonViewProps {
    lesson: any;
    onComplete: (completed: boolean) => void;
    onNext: () => void;
    onPrev: () => void;
    canGoNext: boolean;
    canGoPrev: boolean;
    isCompleted: boolean;
}

export default function LessonView({
    lesson,
    onComplete,
    onNext,
    onPrev,
    canGoNext,
    canGoPrev,
    isCompleted
}: LessonViewProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

    const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
        setShowExplanation(prev => ({ ...prev, [questionIndex]: true }));
    };

    const handleComplete = () => {
        onComplete(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    return (
        <div className="min-h-screen w-full bg-white font-sans">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white px-6 py-12 sm:px-12 lg:px-16">
                <div className="relative z-10 max-w-4xl">
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-orange-600">
                        <BookOpen className="h-4 w-4" />
                        <span>บทเรียน</span>
                    </div>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        {lesson.title}
                    </h1>
                    {lesson.strapline && (
                        <p className="mb-8 text-xl text-gray-600">
                            {lesson.strapline}
                        </p>
                    )}

                    {/* Hero Stats */}
                    {lesson.heroStats && lesson.heroStats.length > 0 && (
                        <div className="flex flex-wrap gap-6">
                            {lesson.heroStats.map((stat: any, index: number) => (
                                <div key={index} className="flex items-center gap-3 rounded-xl bg-white/60 p-3 backdrop-blur-sm">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                        {stat.label === 'เวลา' ? <Clock className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                                        <p className="font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Decorative Background */}
                <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-5">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA580C" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,70.8,34.8C59.4,46.5,47.9,56.2,35.2,63.3C22.5,70.4,8.6,74.9,-4.4,82.5C-17.4,90.1,-29.5,100.8,-40.3,98.4C-51.1,96,-60.6,80.5,-68.5,66.2C-76.4,51.9,-82.7,38.8,-85.5,25.2C-88.3,11.6,-87.6,-2.5,-82.3,-14.8C-77,-27.1,-67.1,-37.6,-56.4,-46.7C-45.7,-55.8,-34.2,-63.5,-21.9,-68.3C-9.6,-73.1,3.5,-75,16.6,-76.4L44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12 lg:px-16">
                {/* Summary */}
                {lesson.summary && (
                    <div className="mb-12 rounded-2xl bg-orange-50 p-8">
                        <h3 className="mb-4 text-lg font-bold text-gray-900">ภาพรวม</h3>
                        <p className="text-gray-700 leading-relaxed">{lesson.summary}</p>
                    </div>
                )}

                {/* Sections */}
                <div className="space-y-16">
                    {lesson.sections?.map((section: any) => (
                        <section key={section.id} className="prose prose-orange max-w-none">
                            {section.title && (
                                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                            )}
                            {section.content.map((block: any, idx: number) => (
                                <div key={idx}>
                                    {block.type === 'text' && (
                                        <div dangerouslySetInnerHTML={{ __html: block.value }} />
                                    )}
                                </div>
                            ))}
                        </section>
                    ))}
                </div>

                {/* Content from Markdown */}
                {(!lesson.sections || lesson.sections.length === 0) && lesson.content && (
                    <div className="prose prose-orange max-w-none space-y-8">
                        {lesson.content.split('\n').map((line: string, i: number) => {
                            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                            if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                            if (line.startsWith('* ')) return <li key={i} className="ml-4 list-disc">{line.replace('* ', '')}</li>;
                            if (line.trim() === '') return <br key={i} />;
                            return <p key={i} className="text-gray-700 leading-relaxed">{line}</p>;
                        })}
                    </div>
                )}

                {/* Quiz Section */}
                {lesson.quiz && lesson.quiz.questions.length > 0 && (
                    <div className="mt-16 border-t border-gray-100 pt-12">
                        <h2 className="mb-8 text-2xl font-bold text-gray-900">ทดสอบความเข้าใจ</h2>
                        <div className="space-y-8">
                            {lesson.quiz.questions.map((question: any, qIdx: number) => (
                                <div key={qIdx} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <p className="mb-4 font-medium text-gray-900">{question.prompt}</p>
                                    <div className="space-y-3">
                                        {question.options.map((option: string, oIdx: number) => {
                                            const isSelected = selectedAnswers[qIdx] === oIdx;
                                            const isCorrect = oIdx === question.answerIndex;
                                            const showResult = showExplanation[qIdx];

                                            let buttonStyle = "w-full rounded-xl border p-4 text-left transition-all hover:bg-gray-50";
                                            if (showResult) {
                                                if (isCorrect) buttonStyle = "w-full rounded-xl border border-green-200 bg-green-50 p-4 text-left text-green-800";
                                                else if (isSelected) buttonStyle = "w-full rounded-xl border border-red-200 bg-red-50 p-4 text-left text-red-800";
                                                else buttonStyle = "w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-left text-gray-400";
                                            } else if (isSelected) {
                                                buttonStyle = "w-full rounded-xl border border-orange-200 bg-orange-50 p-4 text-left text-orange-800";
                                            }

                                            return (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => handleAnswerSelect(qIdx, oIdx)}
                                                    disabled={showResult}
                                                    className={buttonStyle}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{option}</span>
                                                        {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {showExplanation[qIdx] && (
                                        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                                            <p className="font-bold mb-1">คำอธิบาย:</p>
                                            {question.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Practice Link */}
                {lesson.practiceLink && (
                    <div className="mt-12">
                        <Link
                            href={lesson.practiceLink.href}
                            className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-white shadow-lg transition-transform hover:scale-[1.02]"
                        >
                            <div className="relative z-10">
                                <h3 className="mb-2 text-2xl font-bold">{lesson.practiceLink.title}</h3>
                                <p className="text-orange-100">{lesson.practiceLink.description || 'ทดสอบทักษะของคุณ!'}</p>
                            </div>
                            <div className="relative z-10 rounded-full bg-white/20 p-3 transition-transform group-hover:scale-110">
                                <PlayCircle className="h-8 w-8" />
                            </div>

                            {/* Decorative circles */}
                            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
                            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10" />
                        </Link>
                    </div>
                )}

                {/* Navigation Footer */}
                <div className="mt-20 flex items-center justify-between border-t border-gray-100 pt-8">
                    <button
                        onClick={onPrev}
                        disabled={!canGoPrev}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${canGoPrev
                            ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            : 'cursor-not-allowed text-gray-300'
                            }`}
                    >
                        <ChevronLeft className="h-5 w-5" />
                        ก่อนหน้า
                    </button>

                    {!isCompleted ? (
                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-xl active:scale-95"
                        >
                            <CheckCircle className="h-5 w-5" />
                            ทำเครื่องหมายว่าเรียนจบ
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 text-green-600 font-bold">
                            <CheckCircle className="h-5 w-5" />
                            เรียนจบแล้ว
                        </div>
                    )}

                    <button
                        onClick={onNext}
                        disabled={!canGoNext}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors ${canGoNext
                            ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            : 'cursor-not-allowed text-gray-300'
                            }`}
                    >
                        ถัดไป
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
