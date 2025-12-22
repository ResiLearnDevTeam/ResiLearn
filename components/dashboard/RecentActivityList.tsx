'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface RecentActivityListProps {
    sessions: any[]; // Practice sessions
}

export default function RecentActivityList({ sessions }: RecentActivityListProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    // Filter valid sessions
    const validSessions = Array.isArray(sessions) ? sessions.filter((session) => 
        session && 
        session.completedAt &&
        session.accuracy !== null &&
        session.accuracy !== undefined
    ) : [];

    return (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">เซสชันล่าสุด</h3>
                    <p className="text-sm text-gray-500">การฝึกฝนล่าสุดของคุณ</p>
                </div>
            </div>

            {validSessions.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {validSessions.map((session, index) => {
                        const accuracy = Math.round(session.accuracy || 0);
                        const isGood = accuracy >= 80;
                        const isMedium = accuracy >= 60 && accuracy < 80;
                        
                        return (
                            <Link
                                key={session.id || index}
                                href={`/learn/self/practice/sessions/${session.id}`}
                            >
                        <motion.div
                            variants={item}
                                    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-md cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                            isGood ? 'bg-green-100 text-green-600' : 
                                            isMedium ? 'bg-yellow-100 text-yellow-600' : 
                                            'bg-red-100 text-red-600'
                                    }`}>
                                        <CheckCircle className="h-5 w-5" />
                                </div>
                                <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {session.presetName || 'ฝึกด่วน'}
                                            </h4>
                                    <p className="text-xs text-gray-500">
                                                {new Date(session.completedAt).toLocaleDateString('th-TH', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                            <p className={`font-bold ${
                                                isGood ? 'text-green-600' : 
                                                isMedium ? 'text-yellow-600' : 
                                                'text-red-600'
                                        }`}>
                                                {accuracy}%
                                    </p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {session.totalQuestions || 0} ข้อ
                                    </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                            </Link>
                        );
                    })}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                        <CheckCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium">ยังไม่มีเซสชัน</p>
                    <p className="text-sm text-gray-500">เริ่มฝึกฝนเพื่อดูความคืบหน้าของคุณ!</p>
                </div>
            )}
        </div>
    );
}
