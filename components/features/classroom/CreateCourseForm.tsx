'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateCourseData } from '@/types/classroom';
import { Plus, X, Loader2 } from 'lucide-react';
import GoogleClassroomConnect from './GoogleClassroomConnect';
import { toast } from 'sonner';

interface CreateCourseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Inner component that uses useSearchParams
function CreateCourseFormContent({ onSuccess, onCancel }: CreateCourseFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCourseData>({
    name: '',
    description: '',
    code: '', 
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    image: '',
    isPublished: true,
  });

  // Check if classroom was selected
  useEffect(() => {
    const classroomId = searchParams?.get('selectedClassroomId');
    if (classroomId) {
      setSelectedClassroomId(classroomId);
      toast.success('เลือก Classroom สำเร็จ', {
        description: 'พร้อมเชื่อมต่อเมื่อสร้างหลักสูตร',
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { code, ...payload } = formData; 

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create course');
      }

      const course = await response.json();

      // If classroom was selected, link it automatically
      if (selectedClassroomId && course.id) {
        try {
          toast.loading('กำลังเชื่อมต่อ Google Classroom...', {
            id: 'auto-link-classroom',
          });

          const linkResponse = await fetch('/api/google-classroom/link', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              courseId: course.id,
              name: course.name,
              description: course.description,
              classroomId: selectedClassroomId,
            }),
          });

          if (linkResponse.ok) {
            const linkData = await linkResponse.json();
            console.log('Google Classroom linked:', linkData);
            toast.success('เชื่อมต่อ Google Classroom สำเร็จ!', {
              description: `Classroom: ${linkData.classroom.name} • นักเรียน: ${linkData.enrolledStudents} คน`,
              id: 'auto-link-classroom',
            });
          } else {
            const errorData = await linkResponse.json();
            throw new Error(errorData.error || 'Failed to link classroom');
          }
        } catch (linkError: any) {
          console.error('Error linking Google Classroom:', linkError);
          toast.error('เชื่อมต่อ Google Classroom ไม่สำเร็จ', {
            description: linkError.message || 'กรุณาเชื่อมต่อใหม่ในหน้า Settings',
            id: 'auto-link-classroom',
          });
          // Don't fail the course creation if linking fails
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/learn/classroom/teacher/courses/${course.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสร้างหลักสูตร');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Course Name */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
          ชื่อหลักสูตร <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="เช่น หลักสูตรการอ่านค่าตัวต้านทานพื้นฐาน"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-semibold text-gray-700">
          คำอธิบาย
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="อธิบายเกี่ยวกับหลักสูตรนี้..."
        />
      </div>

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="mb-2 block text-sm font-semibold text-gray-700">
            วันที่เริ่ม <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="startDate"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="mb-2 block text-sm font-semibold text-gray-700">
            วันที่สิ้นสุด (ไม่บังคับ)
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            min={formData.startDate}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="mb-2 block text-sm font-semibold text-gray-700">
          URL รูปภาพ (ไม่บังคับ)
        </label>
        <input
          type="url"
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Published */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
          เผยแพร่หลักสูตรทันที (นักเรียนสามารถลงทะเบียนได้)
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'กำลังสร้าง...' : 'สร้างหลักสูตร'}
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

// Main component with Suspense wrapper
export default function CreateCourseForm(props: CreateCourseFormProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    }>
      <CreateCourseFormContent {...props} />
    </Suspense>
  );
}
