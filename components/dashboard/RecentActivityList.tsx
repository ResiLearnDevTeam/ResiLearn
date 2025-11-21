'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface RecentActivityListProps {
    attempts: any[];
}

export default function RecentActivityList({ attempts }: RecentActivityListProps) {
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

    return (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">กิจกรรมล่าสุด</h3>
                    <p className="text-sm text-gray-500">การทำแบบทดสอบล่าสุด</p>
                </div>
            </div>

            {attempts.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    {attempts.map((attempt, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-orange-100 hover:bg-orange-50/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${attempt.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {attempt.passed ? (
                                        <CheckCircle className="h-5 w-5" />
                                    ) : (
                                        <XCircle className="h-5 w-5" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{attempt.level.name}</h4>
                                    <p className="text-xs text-gray-500">
                                        {new Date(attempt.completedAt).toLocaleDateString('th-TH', {
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
                                    <p className={`font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {Math.round(attempt.percentage)}%
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {attempt.score} / {attempt.level.questionCount}
                                    </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-4">
                        <CheckCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium">ยังไม่มีกิจกรรม</p>
                    <p className="text-sm text-gray-500">เริ่มทำแบบทดสอบเพื่อดูความคืบหน้าของคุณ!</p>
                </div>
            )}
        </div>
    );
}
