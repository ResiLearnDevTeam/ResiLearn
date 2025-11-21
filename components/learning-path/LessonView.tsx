'use client';

import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Target,
    BookOpen,
    CheckCircle,
    PlayCircle,
    AlertCircle,
    ArrowDown
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

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
    const [hasReadToEnd, setHasReadToEnd] = useState(false);
    const [quizPassed, setQuizPassed] = useState(false);
    const contentEndRef = useRef<HTMLDivElement>(null);

    // Check if quiz is passed
    useEffect(() => {
        if (!lesson.quiz || lesson.quiz.questions.length === 0) {
            setQuizPassed(true);
            return;
        }

        const allAnswered = lesson.quiz.questions.every((_: any, idx: number) => selectedAnswers[idx] !== undefined);
        const allCorrect = lesson.quiz.questions.every((q: any, idx: number) => selectedAnswers[idx] === q.answerIndex);

        if (allAnswered && allCorrect) {
            setQuizPassed(true);
        } else {
            setQuizPassed(false);
        }
    }, [selectedAnswers, lesson.quiz]);

    // Scroll detection
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasReadToEnd(true);
                }
            },
            { threshold: 0.5 }
        );

        if (contentEndRef.current) {
            observer.observe(contentEndRef.current);
        }

        return () => observer.disconnect();
    }, [lesson.id]);

    // Auto-complete trigger
    useEffect(() => {
        if (hasReadToEnd && quizPassed && !isCompleted) {
            onComplete(true);
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#EA580C', '#F97316', '#FDBA74', '#FFFFFF']
            });
        }
    }, [hasReadToEnd, quizPassed, isCompleted, onComplete]);

    const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
        setSelectedAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
        setShowExplanation(prev => ({ ...prev, [questionIndex]: true }));
    };

    return (
        <div className="min-h-screen w-full bg-white font-prompt text-gray-800">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white px-6 py-12 sm:px-12 lg:px-16 border-b border-orange-100">
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-orange-600 bg-orange-100 w-fit px-3 py-1 rounded-full">
                        <BookOpen className="h-4 w-4" />
                        <span>บทเรียน</span>
                    </div>
                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl leading-tight">
                        {lesson.title}
                    </h1>
                    {lesson.strapline && (
                        <p className="mb-8 text-xl text-gray-600 font-light">
                            {lesson.strapline}
                        </p>
                    )}

                    {/* Hero Stats */}
                    {lesson.heroStats && lesson.heroStats.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {lesson.heroStats.map((stat: any, index: number) => (
                                <div key={index} className="flex items-center gap-3 rounded-xl bg-white/80 p-3 shadow-sm border border-orange-100 backdrop-blur-sm">
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
                <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 opacity-5 pointer-events-none">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#EA580C" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.4,82.2,23.1,70.8,34.8C59.4,46.5,47.9,56.2,35.2,63.3C22.5,70.4,8.6,74.9,-4.4,82.5C-17.4,90.1,-29.5,100.8,-40.3,98.4C-51.1,96,-60.6,80.5,-68.5,66.2C-76.4,51.9,-82.7,38.8,-85.5,25.2C-88.3,11.6,-87.6,-2.5,-82.3,-14.8C-77,-27.1,-67.1,-37.6,-56.4,-46.7C-45.7,-55.8,-34.2,-63.5,-21.9,-68.3C-9.6,-73.1,3.5,-75,16.6,-76.4L44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-4xl px-6 py-12 sm:px-12 lg:px-16">
                {/* Summary */}
                {lesson.summary && (
                    <div className="mb-12 rounded-2xl bg-orange-50 p-8 border border-orange-100">
                        <h3 className="mb-4 text-lg font-bold text-gray-900 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-orange-600" />
                            ภาพรวม
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{lesson.summary}</p>
                    </div>
                )}

                {/* Sections */}
                <div className="space-y-20">
                    {lesson.sections?.map((section: any, sectionIdx: number) => (
                        <section 
                            key={section.id} 
                            className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-lg shadow-slate-200/40 transition-all hover:shadow-xl"
                        >
                            {section.title && section.title !== 'เนื้อหาบทเรียน' && (
                                <div className="mb-8 pb-6 border-b border-slate-200">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{section.title}</h2>
                                    {section.description && (
                                        <p className="text-gray-600 text-lg leading-relaxed">{section.description}</p>
                                    )}
                                </div>
                            )}
                            <div className="space-y-10">
                                {section.content?.map((block: any, idx: number) => {
                                    if (block.type === 'text') {
                                        // Always render as markdown to support HTML/SVG
                                        return (
                                            <div 
                                                key={idx} 
                                                className="prose prose-slate prose-lg max-w-none 
                                                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-28
                                                    prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4 prose-h1:font-extrabold
                                                    prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-gray-800 prose-h2:font-bold
                                                    prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-gray-800 prose-h3:font-semibold
                                                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:font-normal
                                                    prose-strong:text-gray-900 prose-strong:font-semibold prose-strong:text-lg
                                                    prose-ul:list-disc prose-ul:ml-8 prose-ul:space-y-3 prose-ul:text-gray-700 prose-ul:my-6
                                                    prose-ol:list-decimal prose-ol:ml-8 prose-ol:space-y-3 prose-ol:text-gray-700 prose-ol:my-6
                                                    prose-li:text-lg prose-li:leading-relaxed prose-li:pl-2
                                                    prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8 prose-blockquote:shadow-sm
                                                    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-orange-700
                                                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8 prose-pre:shadow-lg
                                                    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-gray-200
                                                    prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all
                                                    [&_div.my-8]:my-8 [&_div.flex]:flex [&_div.justify-center]:justify-center
                                                    [&_svg]:my-8 [&_svg]:mx-auto [&_svg]:shadow-lg [&_svg]:rounded-lg [&_svg]:bg-white [&_svg]:p-4
                                                    [&_div.grid]:grid [&_div.gap-8]:gap-8 [&_div.my-6]:my-6
                                                    [&_.rounded-xl]:rounded-xl [&_.border]:border [&_.shadow-sm]:shadow-sm
                                                    [&_span.text-sm]:text-sm [&_span.text-gray-500]:text-gray-500"
                                            >
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                >
                                                    {block.text}
                                                </ReactMarkdown>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Content from Markdown (Fallback) */}
                {(!lesson.sections || lesson.sections.length === 0) && (lesson.fallbackContent || lesson.content) && (
                    <section className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-lg shadow-slate-200/40">
                        <div 
                            className="prose prose-slate prose-lg max-w-none
                                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-28
                                prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0 prose-h1:border-b prose-h1:border-gray-200 prose-h1:pb-4 prose-h1:font-extrabold
                                prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-gray-800 prose-h2:font-bold
                                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-gray-800 prose-h3:font-semibold
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:font-normal
                                prose-strong:text-gray-900 prose-strong:font-semibold prose-strong:text-lg
                                prose-ul:list-disc prose-ul:ml-8 prose-ul:space-y-3 prose-ul:text-gray-700 prose-ul:my-6
                                prose-ol:list-decimal prose-ol:ml-8 prose-ol:space-y-3 prose-ol:text-gray-700 prose-ol:my-6
                                prose-li:text-lg prose-li:leading-relaxed prose-li:pl-2
                                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8 prose-blockquote:shadow-sm
                                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-orange-700
                                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8 prose-pre:shadow-lg
                                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-gray-200
                                prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all
                                [&_div.my-8]:my-8 [&_div.flex]:flex [&_div.justify-center]:justify-center
                                [&_svg]:my-8 [&_svg]:mx-auto [&_svg]:shadow-lg [&_svg]:rounded-lg [&_svg]:bg-white [&_svg]:p-4
                                [&_div.grid]:grid [&_div.gap-8]:gap-8 [&_div.my-6]:my-6
                                [&_.rounded-xl]:rounded-xl [&_.border]:border [&_.shadow-sm]:shadow-sm
                                [&_span.text-sm]:text-sm [&_span.text-gray-500]:text-gray-500"
                        >
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {lesson.fallbackContent || lesson.content || ''}
                            </ReactMarkdown>
                        </div>
                    </section>
                )}

                {/* Quiz Section */}
                {lesson.quiz && lesson.quiz.questions.length > 0 && (
                    <div className="mt-16 border-t border-gray-100 pt-12">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Target className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">ทดสอบความเข้าใจ</h2>
                        </div>

                        <div className="space-y-8">
                            {lesson.quiz.questions.map((question: any, qIdx: number) => (
                                <div key={qIdx} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="mb-6 font-medium text-gray-900 text-lg">{question.prompt}</p>
                                    <div className="space-y-3">
                                        {question.options.map((option: string, oIdx: number) => {
                                            const isSelected = selectedAnswers[qIdx] === oIdx;
                                            const isCorrect = oIdx === question.answerIndex;
                                            const showResult = showExplanation[qIdx];

                                            let buttonStyle = "w-full rounded-xl border-2 p-4 text-left transition-all duration-200 relative overflow-hidden";
                                            if (showResult) {
                                                if (isCorrect) buttonStyle += " border-green-500 bg-green-50 text-green-800";
                                                else if (isSelected) buttonStyle += " border-red-500 bg-red-50 text-red-800";
                                                else buttonStyle += " border-gray-100 bg-gray-50 text-gray-400 opacity-50";
                                            } else if (isSelected) {
                                                buttonStyle += " border-orange-500 bg-orange-50 text-orange-800";
                                            } else {
                                                buttonStyle += " border-gray-100 hover:border-orange-200 hover:bg-orange-50/50";
                                            }

                                            return (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => handleAnswerSelect(qIdx, oIdx)}
                                                    disabled={showResult}
                                                    className={buttonStyle}
                                                >
                                                    <div className="flex items-center justify-between relative z-10">
                                                        <span className="font-medium">{option}</span>
                                                        {showResult && isCorrect && <CheckCircle className="h-6 w-6 text-green-600" />}
                                                        {showResult && isSelected && !isCorrect && <AlertCircle className="h-6 w-6 text-red-600" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {showExplanation[qIdx] && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 rounded-xl bg-blue-50 p-5 text-blue-900 border border-blue-100"
                                        >
                                            <p className="font-bold mb-2 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
                                                คำอธิบาย:
                                            </p>
                                            <p className="leading-relaxed">{question.explanation}</p>
                                        </motion.div>
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
                                <p className="text-orange-100 text-lg">{lesson.practiceLink.description || 'ทดสอบทักษะของคุณ!'}</p>
                            </div>
                            <div className="relative z-10 rounded-full bg-white/20 p-4 transition-transform group-hover:scale-110">
                                <PlayCircle className="h-10 w-10" />
                            </div>

                            {/* Decorative circles */}
                            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
                            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/10" />
                        </Link>
                    </div>
                )}

                {/* Completion Status & Navigation */}
                <div ref={contentEndRef} className="mt-20 border-t border-gray-100 pt-8">
                    {/* Completion Indicators */}
                    <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div className={`flex items-center gap-3 ${hasReadToEnd ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`p-2 rounded-full ${hasReadToEnd ? 'bg-green-100' : 'bg-gray-200'}`}>
                                {hasReadToEnd ? <CheckCircle className="h-6 w-6" /> : <ArrowDown className="h-6 w-6" />}
                            </div>
                            <span className="font-medium">อ่านจนจบ</span>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
                        <div className={`flex items-center gap-3 ${quizPassed ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`p-2 rounded-full ${quizPassed ? 'bg-green-100' : 'bg-gray-200'}`}>
                                {quizPassed ? <CheckCircle className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                            </div>
                            <span className="font-medium">ทำแบบทดสอบผ่าน</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={onPrev}
                            disabled={!canGoPrev}
                            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${canGoPrev
                                    ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    : 'cursor-not-allowed text-gray-300'
                                }`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                            ก่อนหน้า
                        </button>

                        {isCompleted ? (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-6 py-3 rounded-xl border border-green-100"
                            >
                                <CheckCircle className="h-6 w-6" />
                                <span>เรียนจบแล้ว</span>
                            </motion.div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                {!hasReadToEnd ? 'กรุณาอ่านเนื้อหาให้จบ...' : !quizPassed ? 'กรุณาทำแบบทดสอบให้ครบ...' : 'กำลังบันทึก...'}
                            </div>
                        )}

                        <button
                            onClick={onNext}
                            disabled={!canGoNext}
                            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${canGoNext
                                    ? 'bg-orange-600 text-white shadow-lg hover:bg-orange-700 hover:shadow-xl active:scale-95'
                                    : 'cursor-not-allowed bg-gray-100 text-gray-300'
                                }`}
                        >
                            ถัดไป
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
