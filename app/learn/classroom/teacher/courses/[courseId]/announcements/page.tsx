'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AnnouncementList from '@/components/features/classroom/AnnouncementList';
import { Course, Announcement, CreateAnnouncementData } from '@/types/classroom';
import { Bell, ArrowLeft, Plus, X } from 'lucide-react';

export default function TeacherAnnouncementsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateAnnouncementData>({
    title: '',
    content: '',
  });

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [courseResponse, announcementsResponse] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/courses/${courseId}/announcements`),
      ]);

      if (!courseResponse.ok) throw new Error('Failed to fetch course');
      if (!announcementsResponse.ok) throw new Error('Failed to fetch announcements');

      const courseData = await courseResponse.json();
      const announcementsData = await announcementsResponse.json();

      setCourse(courseData);
      setAnnouncements(announcementsData);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create announcement');
      }

      setShowCreateForm(false);
      setFormData({ title: '', content: '' });
      fetchData(); // Refresh
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการสร้างประกาศ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (announcement: Announcement) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}/announcements/${announcement.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete announcement');
      }

      fetchData(); // Refresh
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบประกาศ');
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

  if (error || !course) {
    return (
      <div
        className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
      >
        <main className="w-full h-full px-4 py-6 lg:px-8">
          <div className="rounded-xl bg-white p-12 text-center shadow-md">
            <p className="text-red-600 mb-4">{error || 'ไม่พบหลักสูตร'}</p>
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

  return (
    <div
      className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <main className="w-full h-full px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link
                href={`/learn/classroom/teacher/courses/${courseId}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับไปหน้าหลักสูตร
              </Link>
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">จัดการประกาศ</h1>
            </div>
            <p className="mt-2 text-gray-600">{course.name}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            สร้างประกาศใหม่
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">สร้างประกาศใหม่</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    หัวข้อ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="เช่น ประกาศเรื่องการสอบ"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    เนื้อหา <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="กรอกเนื้อหาประกาศ..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-purple-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังสร้าง...' : 'สร้างประกาศ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Announcements List */}
      <AnnouncementList
        announcements={announcements}
        isTeacherView={true}
        onDelete={handleDeleteAnnouncement}
      />
      </main>
    </div>
  );
}
