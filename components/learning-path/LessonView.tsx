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

// Helper function to render content with HTML/SVG support
function renderContentWithHTML(content: string) {
    const hasHTMLBlocks = /<div|<svg|<table|<figure/i.test(content);
    
    if (!hasHTMLBlocks) {
        return null; // Return null to use regular markdown rendering
    }
    
    // Split content by HTML blocks
    const parts = content.split(/(<div[^>]*>[\s\S]*?<\/div>|<svg[^>]*>[\s\S]*?<\/svg>)/gi);
    
    return (
        <div className="space-y-8">
            {parts.map((part: string, partIdx: number) => {
                const isHTML = /^<(div|svg|table|figure)/i.test(part.trim());
                
                if (isHTML) {
                    return (
                        <div
                            key={partIdx}
                            className="my-8 [&_svg]:mx-auto [&_svg]:max-w-full [&_div.flex]:flex [&_div.justify-center]:justify-center [&_div.grid]:grid [&_div.gap-8]:gap-8"
                            dangerouslySetInnerHTML={{ __html: part }}
                        />
                    );
                } else if (part.trim()) {
                    return (
                        <div 
                            key={partIdx}
                            className="prose prose-slate prose-lg max-w-none
                                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-28
                                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:font-extrabold prose-h1:pt-0
                                prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-12 prose-h2:text-gray-800 prose-h2:font-bold
                                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-gray-800 prose-h3:font-semibold
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:font-normal
                                prose-strong:text-gray-900 prose-strong:font-semibold
                                prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2 prose-ul:text-gray-700 prose-ul:my-6
                                prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2 prose-ol:text-gray-700 prose-ol:my-6
                                prose-li:text-lg prose-li:leading-relaxed
                                prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8
                                prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-orange-700
                                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6 prose-pre:my-8
                                prose-img:rounded-lg prose-img:my-8
                                prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all"
                        >
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            >
                                {part}
                            </ReactMarkdown>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
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
    const [readSections, setReadSections] = useState<Set<string>>(new Set());
    const contentEndRef = useRef<HTMLDivElement>(null);
    const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
    const confettiFiredRef = useRef(false);

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

    // Track reading progress for each section
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        
        // Observe each section
        sectionRefs.current.forEach((element, sectionId) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setReadSections(prev => new Set([...prev, sectionId]));
                    }
                },
                { threshold: 0.3 }
            );
            observer.observe(element);
            observers.push(observer);
        });

        // Observe end of content
        const endObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasReadToEnd(true);
                }
            },
            { threshold: 0.5 }
        );

        if (contentEndRef.current) {
            endObserver.observe(contentEndRef.current);
        }

        return () => {
            observers.forEach(obs => obs.disconnect());
            endObserver.disconnect();
        };
    }, [lesson.id, lesson.sections]);

    // Calculate quiz progress
    const quizProgress = lesson.quiz 
        ? {
            answered: Object.keys(selectedAnswers).length,
            total: lesson.quiz.questions.length,
            percentage: lesson.quiz.questions.length > 0 
                ? Math.round((Object.keys(selectedAnswers).length / lesson.quiz.questions.length) * 100)
                : 0
          }
        : null;

    // Calculate reading progress
    const readingProgress = lesson.sections && lesson.sections.length > 0
        ? {
            read: readSections.size,
            total: lesson.sections.length,
            percentage: Math.round((readSections.size / lesson.sections.length) * 100),
            lastReadSection: Array.from(readSections).pop() || null
          }
        : null;

    // Auto-complete trigger
    useEffect(() => {
        if (hasReadToEnd && quizPassed && !isCompleted && !confettiFiredRef.current) {
            confettiFiredRef.current = true;
            onComplete(true);
            
            // Fire confetti with limited duration and particle count
            confetti({
                particleCount: 50, // ลดจาก 150 เป็น 50
                spread: 60, // ลดจาก 80 เป็น 60
                origin: { y: 0.6 },
                colors: ['#EA580C', '#F97316', '#FDBA74', '#FFFFFF'],
                zIndex: 1000, // กำหนด z-index
                ticks: 100, // กำหนดจำนวน frames (ทำให้หยุดเร็วขึ้น)
                gravity: 0.8, // เพิ่ม gravity เพื่อให้ตกเร็วขึ้น
                decay: 0.9, // เพิ่ม decay เพื่อให้หายไปเร็วขึ้น
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
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50/30 to-white px-6 py-16 sm:px-12 lg:px-20">
                <div className="relative z-10 max-w-5xl mx-auto">
                    <div className="mb-6 flex items-center gap-2 text-sm font-medium text-orange-600">
                        <BookOpen className="h-4 w-4" />
                        <span>บทเรียน</span>
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-tight">
                        {lesson.title}
                    </h1>
                    {lesson.strapline && (
                        <p className="mb-10 text-xl text-gray-600 font-light max-w-3xl">
                            {lesson.strapline}
                        </p>
                    )}

                    {/* Hero Stats */}
                    {lesson.heroStats && lesson.heroStats.length > 0 && (
                        <div className="flex flex-wrap gap-6">
                            {lesson.heroStats.map((stat: any, index: number) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                        {stat.label === 'เวลา' ? <Clock className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                        <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-5xl px-6 py-16 sm:px-12 lg:px-20">
                {/* Summary */}
                {lesson.summary && (
                    <div className="mb-16 pb-12 border-b border-gray-200">
                        <div className="flex items-start gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">ภาพรวม</h3>
                                <p className="text-gray-700 leading-relaxed text-lg">{lesson.summary}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sections */}
                <div className="space-y-16">
                    {lesson.sections?.map((section: any, sectionIdx: number) => (
                        <section 
                            key={section.id} 
                            ref={(el) => {
                                if (el) {
                                    sectionRefs.current.set(section.id, el);
                                } else {
                                    sectionRefs.current.delete(section.id);
                                }
                            }}
                            className="scroll-mt-28"
                        >
                            {section.title && section.title !== 'เนื้อหาบทเรียน' && (
                                <div className="mb-10">
                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
                                    {section.description && (
                                        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">{section.description}</p>
                                    )}
                                </div>
                            )}
                            <div className="space-y-8">
                                {section.content?.map((block: any, idx: number) => {
                                    if (block.type === 'text') {
                                        const text = block.text;
                                        // Check if content contains HTML/SVG blocks
                                        const hasHTMLBlocks = /<div|<svg|<table|<figure/i.test(text);
                                        
                                        if (hasHTMLBlocks) {
                                            // Split content by HTML blocks and render separately
                                            const parts = text.split(/(<div[^>]*>[\s\S]*?<\/div>|<svg[^>]*>[\s\S]*?<\/svg>)/gi);
                                            
                                            return (
                                                <div key={idx} className="space-y-6">
                                                    {parts.map((part: string, partIdx: number) => {
                                                        const isHTML = /^<(div|svg|table|figure)/i.test(part.trim());
                                                        
                                                        if (isHTML) {
                                                            // Render HTML/SVG directly
                                                            return (
                                                                <div
                                                                    key={partIdx}
                                                                    className="my-8 [&_svg]:mx-auto [&_svg]:max-w-full [&_div.flex]:flex [&_div.justify-center]:justify-center [&_div.grid]:grid [&_div.gap-8]:gap-8"
                                                                    dangerouslySetInnerHTML={{ __html: part }}
                                                                />
                                                            );
                                                        } else if (part.trim()) {
                                                            // Render markdown
                                                            return (
                                                                <div 
                                                                    key={partIdx}
                                                                    className="prose prose-slate prose-lg max-w-none 
                                                        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-28
                                                        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:font-extrabold prose-h1:pt-0
                                                        prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-12 prose-h2:text-gray-800 prose-h2:font-bold
                                                        prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-gray-800 prose-h3:font-semibold
                                                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:font-normal
                                                        prose-strong:text-gray-900 prose-strong:font-semibold
                                                        prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2 prose-ul:text-gray-700 prose-ul:my-6
                                                        prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2 prose-ol:text-gray-700 prose-ol:my-6
                                                        prose-li:text-lg prose-li:leading-relaxed
                                                        prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8
                                                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-orange-700
                                                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6 prose-pre:my-8
                                                        prose-img:rounded-lg prose-img:my-8
                                                        prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all"
                                                                >
                                                                    <ReactMarkdown 
                                                                        remarkPlugins={[remarkGfm]}
                                                                        rehypePlugins={[rehypeRaw]}
                                                                    >
                                                                        {part}
                                                                    </ReactMarkdown>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                                </div>
                                            );
                                        }
                                        
                                        // Regular markdown content
                                        return (
                                            <div 
                                                key={idx} 
                                                className="prose prose-slate prose-lg max-w-none 
                                                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-28
                                                    prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:font-extrabold prose-h1:pt-0
                                                    prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-12 prose-h2:text-gray-800 prose-h2:font-bold
                                                    prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-gray-800 prose-h3:font-semibold
                                                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:font-normal
                                                    prose-strong:text-gray-900 prose-strong:font-semibold
                                                    prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2 prose-ul:text-gray-700 prose-ul:my-6
                                                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2 prose-ol:text-gray-700 prose-ol:my-6
                                                    prose-li:text-lg prose-li:leading-relaxed
                                                    prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8
                                                    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-orange-700
                                                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6 prose-pre:my-8
                                                    prose-img:rounded-lg prose-img:my-8
                                                    prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all"
                                            >
                                                <ReactMarkdown 
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeRaw]}
                                                >
                                                    {text}
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
                    <section className="scroll-mt-28">
                        {(() => {
                            const content = lesson.fallbackContent || lesson.content || '';
                            const htmlContent = renderContentWithHTML(content);
                            
                            if (htmlContent) {
                                return htmlContent;
                            }
                            
                            // Regular markdown
                            return (
                                <div 
                                    className="prose prose-slate prose-lg max-w-none
                                        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-28
                                        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-0 prose-h1:font-extrabold prose-h1:pt-0
                                        prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-12 prose-h2:text-gray-800 prose-h2:font-bold
                                        prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-gray-800 prose-h3:font-semibold
                                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-6 prose-p:font-normal
                                        prose-strong:text-gray-900 prose-strong:font-semibold
                                        prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2 prose-ul:text-gray-700 prose-ul:my-6
                                        prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2 prose-ol:text-gray-700 prose-ol:my-6
                                        prose-li:text-lg prose-li:leading-relaxed
                                        prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:pr-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-8
                                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-orange-700
                                        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6 prose-pre:my-8
                                        prose-img:rounded-lg prose-img:my-8
                                        prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all"
                                >
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                    >
                                        {content}
                                    </ReactMarkdown>
                                </div>
                            );
                        })()}
                    </section>
                )}

                {/* Quiz Section - ตรวจสอบความรู้ */}
                {lesson.quiz && lesson.quiz.questions.length > 0 && (
                    <div className="mt-20 pt-16 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <Target className="h-6 w-6" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">ตรวจสอบความรู้</h2>
                            </div>
                            
                            {/* Progress Indicators */}
                            <div className="flex items-center gap-6">
                                {/* Reading Progress */}
                                {readingProgress && (
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600 mb-1">ความคืบหน้าการอ่าน</div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-lg font-bold text-orange-600">
                                                {readingProgress.read}/{readingProgress.total}
                                            </div>
                                            <div className="text-sm text-gray-500">ส่วน</div>
                                        </div>
                                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className="h-full bg-orange-500 rounded-full transition-all duration-300"
                                                style={{ width: `${readingProgress.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {/* Quiz Progress */}
                                {quizProgress && (
                                    <div className="text-right">
                                        <div className="text-sm text-gray-600 mb-1">ความคืบหน้าแบบทดสอบ</div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-lg font-bold text-blue-600">
                                                {quizProgress.answered}/{quizProgress.total}
                                            </div>
                                            <div className="text-sm text-gray-500">ข้อ</div>
                                        </div>
                                        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                                style={{ width: `${quizProgress.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-10">
                            {lesson.quiz.questions.map((question: any, qIdx: number) => (
                                <div key={qIdx} className="pb-8 border-b border-gray-100 last:border-0">
                                    <p className="mb-6 font-semibold text-gray-900 text-xl">{question.prompt}</p>
                                    <div className="space-y-3">
                                        {question.options.map((option: string, oIdx: number) => {
                                            const isSelected = selectedAnswers[qIdx] === oIdx;
                                            const isCorrect = oIdx === question.answerIndex;
                                            const showResult = showExplanation[qIdx];

                                            let buttonStyle = "w-full rounded-lg border-2 p-4 text-left transition-all duration-200 relative overflow-hidden";
                                            if (showResult) {
                                                if (isCorrect) buttonStyle += " border-green-500 bg-green-50 text-green-800";
                                                else if (isSelected) buttonStyle += " border-red-500 bg-red-50 text-red-800";
                                                else buttonStyle += " border-gray-100 bg-gray-50 text-gray-400 opacity-50";
                                            } else if (isSelected) {
                                                buttonStyle += " border-orange-500 bg-orange-50 text-orange-800";
                                            } else {
                                                buttonStyle += " border-gray-200 hover:border-orange-300 hover:bg-orange-50/50";
                                            }

                                            return (
                                                <button
                                                    key={oIdx}
                                                    onClick={() => handleAnswerSelect(qIdx, oIdx)}
                                                    disabled={showResult}
                                                    className={buttonStyle}
                                                >
                                                    <div className="flex items-center justify-between relative z-10">
                                                        <span className="font-medium text-lg">{option}</span>
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
                                            className="mt-6 rounded-lg bg-blue-50 p-5 text-blue-900"
                                        >
                                            <p className="font-bold mb-2 flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
                                                คำอธิบาย:
                                            </p>
                                            <p className="leading-relaxed text-lg">{question.explanation}</p>
                                        </motion.div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Practice Link */}
                {lesson.practiceLink && (
                    <div className="mt-16">
                        <Link
                            href={lesson.practiceLink.href}
                            className="group relative flex items-center justify-between overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-white transition-all hover:shadow-lg"
                        >
                            <div className="relative z-10">
                                <h3 className="mb-2 text-2xl font-bold">{lesson.practiceLink.title}</h3>
                                <p className="text-orange-100 text-lg">{lesson.practiceLink.description || 'ทดสอบทักษะของคุณ!'}</p>
                            </div>
                            <div className="relative z-10 rounded-full bg-white/20 p-4 transition-transform group-hover:scale-110">
                                <PlayCircle className="h-10 w-10" />
                            </div>
                        </Link>
                    </div>
                )}

                {/* Completion Status & Navigation */}
                <div ref={contentEndRef} className="mt-24 pt-12 border-t border-gray-200">
                    {/* Completion Indicators */}
                    <div className="mb-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                        <div className={`flex items-center gap-3 ${hasReadToEnd ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`p-2 rounded-full ${hasReadToEnd ? 'bg-green-100' : 'bg-gray-200'}`}>
                                {hasReadToEnd ? <CheckCircle className="h-6 w-6" /> : <ArrowDown className="h-6 w-6" />}
                            </div>
                            <span className="font-medium text-lg">อ่านจนจบ</span>
                        </div>
                        <div className="hidden sm:block h-8 w-px bg-gray-300"></div>
                        <div className={`flex items-center gap-3 ${quizPassed ? 'text-green-600' : 'text-gray-400'}`}>
                            <div className={`p-2 rounded-full ${quizPassed ? 'bg-green-100' : 'bg-gray-200'}`}>
                                {quizPassed ? <CheckCircle className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                            </div>
                            <span className="font-medium text-lg">ทำแบบทดสอบผ่าน</span>
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
