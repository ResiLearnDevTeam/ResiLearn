'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Course, UpdateCourseData } from '@/types/classroom';
import { Settings, ArrowLeft, Trash2 } from 'lucide-react';

export default function CourseSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateCourseData>({
    name: '',
    description: '',
    code: '',
    startDate: '',
    endDate: '',
    image: '',
    isPublished: false,
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/courses/${courseId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }

      const data = await response.json();
      setCourse(data);
      setFormData({
        name: data.name,
        description: data.description || '',
        code: data.code,
        startDate: data.startDate.split('T')[0],
        endDate: data.endDate ? data.endDate.split('T')[0] : '',
        image: data.image || '',
        isPublished: data.isPublished,
      });
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลหลักสูตร');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update course');
      }

      router.push(`/learn/classroom/teacher/courses/${courseId}`);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปเดตหลักสูตร');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหลักสูตรนี้? การกระทำนี้ไม่สามารถยกเลิกได้')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      router.push('/learn/classroom/teacher/courses');
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบหลักสูตร');
    }
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

  if (error && !course) {
    return (
      <div
        className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="w-full h-full px-4 py-6 lg:px-8">
          <div className="rounded-xl bg-white p-12 text-center shadow-md">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/learn/classroom/teacher/courses"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าหลักสูตร
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div
      className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <main className="w-full h-full px-4 py-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/learn/classroom/teacher/courses/${courseId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับไปหน้าหลักสูตร
        </Link>
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">ตั้งค่าหลักสูตร</h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Settings Form */}
      <div className="rounded-xl bg-white p-8 shadow-md">
        <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                ชื่อหลักสูตร <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                รหัสหลักสูตร <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                maxLength={20}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                คำอธิบาย
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  วันที่เริ่ม <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  วันที่สิ้นสุด
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                URL รูปภาพ
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                เผยแพร่หลักสูตร (นักเรียนสามารถลงทะเบียนได้)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition-all hover:bg-red-600"
              >
                <Trash2 className="mr-2 inline h-4 w-4" />
                ลบหลักสูตร
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
