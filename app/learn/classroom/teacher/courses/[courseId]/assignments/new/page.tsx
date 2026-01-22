'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AssignmentForm from '@/components/features/classroom/AssignmentForm';
import { CreateAssignmentData } from '@/types/classroom';
import { ArrowLeft, Rocket, ArrowRight, X } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface Level {
  id: string;
  number: number;
  name: string;
  description: string;
}

export default function NewAssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/levels');
      if (!response.ok) throw new Error('Failed to fetch levels');
      const data = await response.json();
      setLevels(data);
    } catch (err: any) {
      console.error('Error fetching levels:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CreateAssignmentData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          description: data.descriptionFormat === 'HTML' ? sanitizeHtml(data.description || '') : data.description,
          instructions: data.instructions ? sanitizeHtml(data.instructions) : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create assignment');
      }

      // Redirect back to assignments page
      router.push(`/learn/classroom/teacher/courses/${courseId}/assignments`);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสร้างงาน');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/learn/classroom/teacher/courses/${courseId}/assignments`);
  };

  if (isLoading) {
    return (
      <div
        className="w-full h-screen flex items-center justify-center transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen transition-all duration-200 ease-out overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-blue-50"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <main className="w-full h-full px-6 lg:px-12 xl:px-16 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/learn/classroom/teacher/courses/${courseId}/assignments`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้างาน
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">สร้างงานใหม่</h1>
          <p className="mt-2 text-gray-600">เพิ่มงานใหม่ให้กับนักเรียน</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border-2 border-red-200 bg-red-50 p-4 flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Form */}
        <div className="rounded-xl bg-white p-8 shadow-md">
          <AssignmentForm
            onSubmit={handleSubmit}
            levels={levels}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="assignment-form"
            disabled={isSubmitting}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
              ${isSubmitting
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
              }
            `}
          >
            <Rocket className="h-5 w-5" />
            {isSubmitting ? 'กำลังบันทึก...' : 'สร้างงาน'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
