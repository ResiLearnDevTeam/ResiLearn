'use client';

import { CourseAssignment } from '@/types/classroom';
import { FileText, Save, Calendar } from 'lucide-react';

interface AssignmentStatisticsProps {
  assignments: CourseAssignment[];
}

export default function AssignmentStatistics({ assignments }: AssignmentStatisticsProps) {
  const publishedCount = assignments.filter(a => !a.isDraft).length;
  const draftsCount = assignments.filter(a => a.isDraft).length;
  const overdueCount = assignments.filter(a => {
    if (!a.dueDate || a.completed) return false;
    const dueDate = new Date(a.dueDate);
    const now = new Date();
    return dueDate < now;
  }).length;
  const customQuizCount = assignments.filter(a => a.assignmentType === 'CUSTOM_QUIZ').length;
  const fixedQuestionsCount = assignments.filter(a => a.assignmentType === 'FIXED_QUESTIONS').length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">จำนวนงานทั้งหมด</p>
            <p className="text-3xl font-bold text-gray-900">{assignments.length}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">เผยแพร่แล้ว</p>
            <p className="text-3xl font-bold text-gray-900">{publishedCount}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
            <Save className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">บันทึกเป็น Draft</p>
            <p className="text-3xl font-bold text-gray-900">{draftsCount}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
            <Calendar className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">เกินกำหนด</p>
            <p className="text-3xl font-bold text-gray-900">{overdueCount}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Custom Quiz</p>
            <p className="text-3xl font-bold text-gray-900">{customQuizCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
