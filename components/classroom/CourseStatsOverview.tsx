'use client';

import { motion } from 'framer-motion';
import { FileText, Clock, Target, TrendingUp } from 'lucide-react';

interface CourseStatsOverviewProps {
  assignmentsCompleted: number;
  totalAssignments: number;
  totalTimeSpent: number; // in hours
  averageScore: number;
  recentActivity: number; // activities in last 7 days
}

export default function CourseStatsOverview({
  assignmentsCompleted,
  totalAssignments,
  totalTimeSpent,
  averageScore,
  recentActivity,
}: CourseStatsOverviewProps) {
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
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {/* Assignments Completed */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-white p-5 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
      >
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 translate-y-[-6px] rounded-full bg-blue-100 opacity-40" />
        <div className="relative z-10">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-600">งานที่เสร็จสิ้น</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{assignmentsCompleted}</h3>
            <span className="text-sm text-gray-500">/ {totalAssignments}</span>
          </div>
        </div>
      </motion.div>

      {/* Time Spent */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-white p-5 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
      >
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 translate-y-[-6px] rounded-full bg-green-100 opacity-40" />
        <div className="relative z-10">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-100 to-green-200 text-green-600 shadow-sm">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-600">เวลาที่ใช้</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{totalTimeSpent}</h3>
            <span className="text-sm text-gray-500">ชม.</span>
          </div>
        </div>
      </motion.div>

      {/* Average Score */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-white p-5 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
      >
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 translate-y-[-6px] rounded-full bg-orange-100 opacity-40" />
        <div className="relative z-10">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 shadow-sm">
            <Target className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-600">คะแนนเฉลี่ย</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{averageScore}%</h3>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-white p-5 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
      >
        <div className="absolute right-0 top-0 h-20 w-20 translate-x-6 translate-y-[-6px] rounded-full bg-purple-100 opacity-40" />
        <div className="relative z-10">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 shadow-sm">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-gray-600">กิจกรรมล่าสุด</p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{recentActivity}</h3>
            <span className="text-sm text-gray-500">ครั้ง</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">7 วันที่ผ่านมา</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

