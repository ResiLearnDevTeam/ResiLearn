'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { Course } from '@/types/classroom';

interface JoinCourseFormProps {
  onSuccess?: (course: Course) => void;
}

export default function JoinCourseForm({ onSuccess }: JoinCourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseCodeInput, setCourseCodeInput] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!courseCodeInput.trim()) {
      setError('กรุณากรอกรหัสชั้นเรียน');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/courses/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseCode: courseCodeInput.toUpperCase().trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'ไม่สามารถเข้าร่วมหลักสูตรได้');
      }

      const course: Course = await response.json();
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(course);
      } else {
        // Redirect to course detail page after a short delay
        setTimeout(() => {
          router.push(`/learn/classroom/courses/${course.id}`);
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าร่วมหลักสูตร');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-gray-900">เข้าร่วมหลักสูตรด้วยรหัสชั้นเรียน</h2>
      
      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <p className="font-medium">เข้าร่วมหลักสูตรสำเร็จ! กำลังนำคุณไปยังหลักสูตร...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="courseCode" className="mb-2 block text-sm font-semibold text-gray-700">
            รหัสชั้นเรียน <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="courseCode"
              required
              value={courseCodeInput}
              onChange={(e) => {
                // Allow alphanumeric characters (letters and numbers) in both cases
                const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                setCourseCodeInput(value);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 font-mono text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="กรอกรหัสชั้นเรียน"
              maxLength={20}
              disabled={isSubmitting || success}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            กรุณากรอกรหัสชั้นเรียนที่ได้รับจากครูผู้สอน (เช่น: ABC123, MATH2024)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'กำลังเข้าร่วม...' : success ? 'เข้าร่วมสำเร็จ!' : 'เข้าร่วมหลักสูตร'}
        </button>
      </form>
    </div>
  );
}

