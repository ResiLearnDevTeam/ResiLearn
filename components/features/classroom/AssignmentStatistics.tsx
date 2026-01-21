'use client';

import { CourseAssignment } from '@/types/classroom';
import { FileText, Save, BookOpen, Shield } from 'lucide-react';

interface AssignmentStatisticsProps {
  assignments: CourseAssignment[];
}

export default function AssignmentStatistics({ assignments }: AssignmentStatisticsProps) {
  const draftsCount = assignments.filter(a => a.isDraft).length;
  const practiceCount = assignments.filter(a => a.assignmentMode === 'PRACTICE').length;
  const examCount = assignments.filter(a => a.assignmentMode === 'EXAM').length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* All Assignments */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-green-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">จำนวนงานทั้งหมด</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{assignments.length}</h3>
              <span className="text-lg text-gray-400">งาน</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Practice Assignments */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-blue-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">แบบฝึกหัด</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{practiceCount}</h3>
              <span className="text-lg text-gray-400">งาน</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Exam Assignments */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-red-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">แบบทดสอบ</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{examCount}</h3>
              <span className="text-lg text-gray-400">งาน</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
            <Shield className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Drafts */}
      <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-yellow-500">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">บันทึกเป็น Draft</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-900">{draftsCount}</h3>
              <span className="text-lg text-gray-400">งาน</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
            <Save className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
