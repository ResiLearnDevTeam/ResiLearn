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
            <motion.div 
                variants={item} 
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-white p-5 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
            >
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 translate-y-[-6px] rounded-full bg-green-100 opacity-40" />
                <div className="relative z-10">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-green-200 text-green-600 shadow-sm">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium text-gray-600">ระดับที่เสร็จสิ้น</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">{stats.levelsCompleted}</h3>
                        <span className="text-sm text-gray-500">/ {stats.totalLevels}</span>
                    </div>
                </div>
            </motion.div>

            {/* Overall Progress */}
            <motion.div 
                variants={item} 
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-white p-5 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
            >
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 translate-y-[-6px] rounded-full bg-orange-100 opacity-40" />
                <div className="relative z-10">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 shadow-sm">
                        <Target className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium text-gray-600">ความคืบหน้ารวม</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">{stats.overallProgress}%</h3>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stats.overallProgress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Practice Time */}
            <motion.div 
                variants={item} 
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-white p-5 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
            >
                <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 translate-y-[-6px] rounded-full bg-blue-100 opacity-40" />
                <div className="relative z-10">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-sm">
                        <Clock className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-medium text-gray-600">เวลาในการฝึกฝน</p>
                    <div className="mt-1 flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900">{stats.totalPracticeTime} ชม.</h3>
                        <span className="text-sm text-gray-500">รวม</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
