'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AnnouncementList from '@/components/features/classroom/AnnouncementList';
import { Course, Announcement, CreateAnnouncementData } from '@/types/classroom';
import { Bell, ArrowLeft, Plus, X } from 'lucide-react';

export default function TeacherAnnouncementsPage() {
  const router = useRouter();
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
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editFormData, setEditFormData] = useState<CreateAnnouncementData>({
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
      fetchData();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการสร้างประกาศ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnnouncement) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/courses/${courseId}/announcements/${editingAnnouncement.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update announcement');
      }

      setEditingAnnouncement(null);
      setEditFormData({ title: '', content: '' });
      fetchData();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการแก้ไขประกาศ');
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

      fetchData();
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการลบประกาศ');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div
          className="w-full min-h-screen flex items-center justify-center transition-all duration-200 ease-out overflow-y-auto"
          style={{
            marginLeft: 'var(--sidebar-width, 288px)',
            width: 'calc(100% - var(--sidebar-width, 288px))'
          }}
        >
          <div className="text-center">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="text-gray-600">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div
          className="w-full min-h-screen transition-all duration-200 ease-out overflow-y-auto"
          style={{
            marginLeft: 'var(--sidebar-width, 288px)',
            width: 'calc(100% - var(--sidebar-width, 288px))'
          }}
        >
          <main className="w-full h-full px-6 lg:px-12 xl:px-16 py-8">
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <p className="text-red-600 mb-4">{error || 'ไม่พบหลักสูตร'}</p>
              <button
                onClick={() => router.push('/learn/classroom/teacher/courses')}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับไปหน้าหลักสูตร
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div
        className="w-full min-h-screen transition-all duration-200 ease-out overflow-y-auto"
        style={{
          marginLeft: 'var(--sidebar-width, 288px)',
          width: 'calc(100% - var(--sidebar-width, 288px))'
        }}
      >
        <main className="w-full min-h-screen px-6 lg:px-12 xl:px-16 py-8">
          <div className="space-y-8">
            {/* Back Button */}
            <Link
              href={`/learn/classroom/teacher/courses/${courseId}/dashboard`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปหน้าแดชบอร์ด
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">จัดการประกาศ</h1>
                    <p className="mt-1 text-gray-600">{course.name}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:scale-[1.02]"
              >
                <Plus className="h-5 w-5" />
                สร้างประกาศใหม่
              </button>
            </div>

            {/* Statistics Card */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                  <Bell className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">จำนวนประกาศทั้งหมด</p>
                  <p className="text-3xl font-bold text-gray-900">{announcements.length}</p>
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <AnnouncementList
                announcements={announcements}
                isTeacherView={true}
                onDelete={handleDeleteAnnouncement}
                onEdit={(announcement) => {
                  setEditingAnnouncement(announcement);
                  setEditFormData({
                    title: announcement.title,
                    content: announcement.content,
                  });
                }}
                emptyMessage="ยังไม่มีประกาศ"
              />
            </div>
          </div>

          {/* Create Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">สร้างประกาศใหม่</h2>
                    <p className="mt-1 text-sm text-gray-500">เพิ่มประกาศใหม่ให้กับนักเรียน</p>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      หัวข้อ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                      placeholder="เช่น ประกาศเรื่องการสอบ"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      เนื้อหา <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                      placeholder="กรอกเนื้อหาประกาศ..."
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'กำลังสร้าง...' : 'สร้างประกาศ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Announcement Modal */}
          {editingAnnouncement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">แก้ไขประกาศ</h2>
                    <p className="mt-1 text-sm text-gray-500">แก้ไขข้อมูลประกาศ</p>
                  </div>
                  <button
                    onClick={() => setEditingAnnouncement(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleUpdateAnnouncement} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      หัวข้อ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.title}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, title: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      เนื้อหา <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={8}
                      required
                      value={editFormData.content}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, content: e.target.value })
                      }
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingAnnouncement(null)}
                      className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
