'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, Clock } from 'lucide-react';

interface StatsOverviewProps {
    stats: {
        levelsCompleted: number;
        totalLevels: number;
        overallProgress: number;
        totalPracticeTime: number;
    };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-3"
        >
            {/* Levels Completed */}
            <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y-[-8px] rounded-full bg-green-50 opacity-50" />
                <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">ระดับที่เสร็จสิ้น</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.levelsCompleted}</h3>
                        <span className="text-sm text-gray-500">/ {stats.totalLevels}</span>
                    </div>
                </div>
            </motion.div>

            {/* Overall Progress */}
            <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y-[-8px] rounded-full bg-orange-50 opacity-50" />
                <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                        <Target className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">ความคืบหน้ารวม</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.overallProgress}%</h3>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.overallProgress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full bg-orange-500"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Practice Time */}
            <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
                <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y-[-8px] rounded-full bg-blue-50 opacity-50" />
                <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-600">เวลาในการฝึกฝน</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-gray-900">{stats.totalPracticeTime} ชม.</h3>
                        <span className="text-sm text-gray-500">รวม</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
