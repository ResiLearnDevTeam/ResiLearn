'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnrollData } from '@/types/classroom';
import { Key, CheckCircle2 } from 'lucide-react';

interface EnrollmentFormProps {
  courseId: string;
  courseCode: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function EnrollmentForm({
  courseId,
  courseCode,
  onSuccess,
  onCancel,
}: EnrollmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseCodeInput, setCourseCodeInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (courseCodeInput.toUpperCase() !== courseCode.toUpperCase()) {
      setError('รหัสหลักสูตรไม่ถูกต้อง');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseCode: courseCodeInput.toUpperCase() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to enroll in course');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/learn/classroom/courses/${courseId}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="courseCode" className="mb-2 block text-sm font-semibold text-gray-700">
          รหัสหลักสูตร <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            id="courseCode"
            required
            value={courseCodeInput}
            onChange={(e) => setCourseCodeInput(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="กรอกรหัสหลักสูตร"
            maxLength={20}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          กรุณากรอกรหัสหลักสูตรที่ได้รับจากครูผู้สอน
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนเรียน'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
