'use client';

import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CourseAssignment } from '@/types/classroom';

interface RecentAssignmentsProps {
  assignments: CourseAssignment[];
  courseId: string;
}

export default function RecentAssignments({ assignments, courseId }: RecentAssignmentsProps) {
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

  const sortedAssignments = [...assignments].sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    return dateB - dateA;
  }).slice(0, 5);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">งานล่าสุด</h3>
          <p className="text-sm text-gray-500">งานที่ได้รับมอบหมายล่าสุด</p>
        </div>
        <Link
          href={`/learn/classroom/courses/${courseId}/assignments`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ดูทั้งหมด
        </Link>
      </div>

      {sortedAssignments.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {sortedAssignments.map((assignment) => {
            const isCompleted = assignment.completed || false;
            const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date() && !isCompleted;
            
            return (
              <Link
                key={assignment.id}
                href={`/learn/classroom/courses/${courseId}/assignments`}
              >
                <motion.div
                  variants={item}
                  className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isCompleted ? 'bg-green-100 text-green-600' : 
                      isOverdue ? 'bg-red-100 text-red-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isOverdue ? (
                        <AlertCircle className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                      {assignment.level && (
                        <p className="text-xs text-gray-500">
                          ระดับ {assignment.level.number}: {assignment.level.name}
                        </p>
                      )}
                      {assignment.dueDate && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          กำหนดส่ง: {new Date(assignment.dueDate).toLocaleDateString('th-TH')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {isCompleted && assignment.bestScore !== undefined && (
                        <p className="font-bold text-green-600">
                          {Math.round(assignment.bestScore)}%
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {assignment.maxPoints} คะแนน
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
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-900 font-medium">ยังไม่มีงาน</p>
          <p className="text-sm text-gray-500">ครูจะมอบหมายงานให้คุณในเร็วๆ นี้</p>
        </div>
      )}
    </div>
  );
}

