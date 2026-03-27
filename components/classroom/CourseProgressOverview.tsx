'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Award } from 'lucide-react';

interface CourseProgressOverviewProps {
  progress: number;
  completedAssignments: number;
  totalAssignments: number;
  earnedPoints: number;
  totalPoints: number;
  courseName: string;
}

export default function CourseProgressOverview({
  progress,
  completedAssignments,
  totalAssignments,
  earnedPoints,
  totalPoints,
  courseName,
}: CourseProgressOverviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl bg-white p-6 shadow-lg"
    >
      <h2 className="mb-4 text-xl font-bold text-gray-900">ความคืบหน้าในหลักสูตร</h2>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">ความคืบหน้ารวม</span>
          <span className="text-lg font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-green-50 p-4 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-green-600" />
          <p className="text-2xl font-bold text-gray-900">{completedAssignments}</p>
          <p className="text-xs text-gray-600">งานที่เสร็จ</p>
          <p className="text-xs text-gray-500">/ {totalAssignments}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 text-center">
          <Award className="mx-auto mb-2 h-6 w-6 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900">{earnedPoints}</p>
          <p className="text-xs text-gray-600">คะแนนที่ได้</p>
          <p className="text-xs text-gray-500">/ {totalPoints}</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 text-center">
          <Clock className="mx-auto mb-2 h-6 w-6 text-purple-600" />
          <p className="text-2xl font-bold text-gray-900">
            {totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-600">อัตราเสร็จ</p>
        </div>
      </div>
    </motion.div>
  );
}

