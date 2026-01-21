'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AnnouncementList from '@/components/features/classroom/AnnouncementList';
import WordEditor from '@/components/features/classroom/WordEditor';
import FileUpload from '@/components/features/classroom/FileUpload';
import { Course, Announcement, CreateAnnouncementData } from '@/types/classroom';
import { Bell, ArrowLeft, Plus, X, Eye, EyeOff, FileText, Download, Calendar, Pin, Flag, Save } from 'lucide-react';
import { exportToWord, downloadWord } from '@/lib/wordExport';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

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
  const [showPreview, setShowPreview] = useState(false);
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<CreateAnnouncementData>({
    title: '',
    content: '',
    contentFormat: 'HTML',
    priority: 'NORMAL',
    isPinned: false,
    isDraft: false,
    publishedAt: undefined,
    attachments: [],
  });

  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editFormData, setEditFormData] = useState<CreateAnnouncementData>({
    title: '',
    content: '',
    contentFormat: 'HTML',
    priority: 'NORMAL',
    isPinned: false,
    isDraft: false,
    publishedAt: undefined,
    attachments: [],
  });

  const [formErrors, setFormErrors] = useState<{title?: string; content?: string; publishedAt?: string}>({});

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

  const validateForm = (data: CreateAnnouncementData): boolean => {
    const errors: {title?: string; content?: string; publishedAt?: string} = {};

    // Validate title
    if (!data.title || data.title.trim().length === 0) {
      errors.title = 'กรุณากรอกหัวข้อ';
    } else if (data.title.length > 200) {
      errors.title = 'หัวข้อต้องไม่เกิน 200 ตัวอักษร';
    }

    // Validate content
    const textContent = data.content.replace(/<[^>]*>/g, '').trim();
    if (!textContent || textContent.length === 0) {
      errors.content = 'กรุณากรอกเนื้อหา';
    } else if (textContent.length > 50000) {
      errors.content = 'เนื้อหาต้องไม่เกิน 50,000 ตัวอักษร';
    }

    // Validate published date
    if (data.publishedAt) {
      const publishedDate = new Date(data.publishedAt);
      const now = new Date();
      if (publishedDate <= now) {
        errors.publishedAt = 'วันที่เผยแพร่ต้องเป็นอนาคต';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/courses/${courseId}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          content: sanitizeHtml(formData.content),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create announcement');
      }

      setShowCreateForm(false);
      setFormData({
        title: '',
        content: '',
        contentFormat: 'HTML',
        priority: 'NORMAL',
        isPinned: false,
        isDraft: false,
        publishedAt: undefined,
        attachments: [],
      });
      setFormErrors({});
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

    if (!validateForm(editFormData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/courses/${courseId}/announcements/${editingAnnouncement.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...editFormData,
            content: sanitizeHtml(editFormData.content),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update announcement');
      }

      setEditingAnnouncement(null);
      setEditFormData({
        title: '',
        content: '',
        contentFormat: 'HTML',
        priority: 'NORMAL',
        isPinned: false,
        isDraft: false,
        publishedAt: undefined,
        attachments: [],
      });
      setFormErrors({});
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

  const handleExportToWord = async (announcement: Announcement) => {
    try {
      const blob = await exportToWord(announcement.title, announcement.content);
      downloadWord(blob, announcement.title);
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการส่งออกเป็น Word');
    }
  };


  const handleExportPreview = async () => {
    try {
      const blob = await exportToWord(formData.title || 'ประกาศ', formData.content);
      downloadWord(blob, formData.title || 'ประกาศ');
    } catch (err: any) {
      alert(err.message || 'เกิดข้อผิดพลาดในการส่งออกเป็น Word');
    }
  };

  // Filter and search announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    // Filter by status
    if (filter === 'published' && announcement.isDraft) return false;
    if (filter === 'drafts' && !announcement.isDraft) return false;

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        announcement.title.toLowerCase().includes(query) ||
        announcement.content.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort: Pinned first, then by priority, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const priorityOrder = { HIGH: 3, NORMAL: 2, LOW: 1 };
    const aPriority = priorityOrder[a.priority || 'NORMAL'];
    const bPriority = priorityOrder[b.priority || 'NORMAL'];
    if (aPriority !== bPriority) return bPriority - aPriority;
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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

  const publishedCount = announcements.filter(a => !a.isDraft).length;
  const draftsCount = announcements.filter(a => a.isDraft).length;

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
                onClick={() => {
                  setShowCreateForm(true);
                  setFormData({
                    title: '',
                    content: '',
                    contentFormat: 'HTML',
                    priority: 'NORMAL',
                    isPinned: false,
                    isDraft: false,
                    publishedAt: undefined,
                    attachments: [],
                  });
                  setFormErrors({});
                  setShowPreview(false);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:scale-[1.02]"
              >
                <Plus className="h-5 w-5" />
                สร้างประกาศใหม่
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
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
              <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <FileText className="h-6 w-6 text-green-600" />
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
            </div>

            {/* Filter and Search */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    ทั้งหมด ({announcements.length})
                  </button>
                  <button
                    onClick={() => setFilter('published')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === 'published'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    เผยแพร่แล้ว ({publishedCount})
                  </button>
                  <button
                    onClick={() => setFilter('drafts')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === 'drafts'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Drafts ({draftsCount})
                  </button>
                </div>

                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาประกาศ..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Announcements List */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <AnnouncementList
                announcements={sortedAnnouncements}
                isTeacherView={true}
                onDelete={handleDeleteAnnouncement}
                onEdit={(announcement) => {
                  setEditingAnnouncement(announcement);
                  setEditFormData({
                    title: announcement.title,
                    content: announcement.content,
                    contentFormat: announcement.contentFormat || 'HTML',
                    priority: announcement.priority || 'NORMAL',
                    isPinned: announcement.isPinned || false,
                    isDraft: announcement.isDraft || false,
                    publishedAt: announcement.publishedAt,
                    attachments: announcement.attachments || [],
                  });
                  setFormErrors({});
                  setShowPreview(false);
                }}
                onExport={handleExportToWord}
                emptyMessage="ยังไม่มีประกาศ"
              />
            </div>
          </div>

          {/* Create Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">สร้างประกาศใหม่</h2>
                    <p className="mt-1 text-sm text-gray-500">เพิ่มประกาศใหม่ให้กับนักเรียน</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormData({
                        title: '',
                        content: '',
                        contentFormat: 'HTML',
                        priority: 'NORMAL',
                        isPinned: false,
                        isDraft: false,
                        publishedAt: undefined,
                        attachments: [],
                      });
                      setFormErrors({});
                      setShowPreview(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-6">

                {!showPreview ? (
                  <form id="create-announcement-form" onSubmit={handleCreateAnnouncement} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        หัวข้อ <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs text-gray-500 font-normal">
                          ({formData.title.length}/200)
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={200}
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value });
                          setFormErrors({ ...formErrors, title: undefined });
                        }}
                        className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                          formErrors.title
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                        }`}
                        placeholder="เช่น ประกาศเรื่องการสอบ"
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                      )}
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        เนื้อหา <span className="text-red-500">*</span>
                      </label>
                      <WordEditor
                        content={formData.content}
                        onChange={(html) => {
                          setFormData({ ...formData, content: html });
                          setFormErrors({ ...formErrors, content: undefined });
                        }}
                        onExport={handleExportPreview}
                        placeholder="เริ่มพิมพ์ข้อความ..."
                      />
                      {formErrors.content && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
                      )}
                    </div>

                    {/* Additional Options */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Priority */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          ระดับความสำคัญ
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'HIGH' | 'NORMAL' | 'LOW' })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          <option value="LOW">ต่ำ</option>
                          <option value="NORMAL">ปกติ</option>
                          <option value="HIGH">สำคัญ</option>
                        </select>
                      </div>

                      {/* Scheduled Publishing */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          กำหนดเผยแพร่ (ไม่บังคับ)
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                          onChange={(e) => {
                            const value = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                            setFormData({ ...formData, publishedAt: value });
                            setFormErrors({ ...formErrors, publishedAt: undefined });
                          }}
                          min={new Date().toISOString().slice(0, 16)}
                          className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                            formErrors.publishedAt
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                          }`}
                        />
                        {formErrors.publishedAt && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.publishedAt}</p>
                        )}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPinned}
                          onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex items-center gap-2">
                          <Pin className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">ปักหมุด</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isDraft}
                          onChange={(e) => setFormData({ ...formData, isDraft: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">บันทึกเป็น Draft</span>
                        </div>
                      </label>
                    </div>

                    {/* File Attachments */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        ไฟล์แนบ
                      </label>
                      <FileUpload
                        files={formData.attachments || []}
                        onFilesChange={(files) => setFormData({ ...formData, attachments: files })}
                        maxFiles={5}
                        maxSize={10 * 1024 * 1024}
                      />
                    </div>

                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Preview Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900">ตัวอย่างประกาศ</h3>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <EyeOff className="h-4 w-4" />
                        ปิดตัวอย่าง
                      </button>
                    </div>

                    {/* Preview Content */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                      <div className="mb-4 flex items-center gap-3">
                        {formData.isPinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            <Pin className="h-3 w-3" />
                            ปักหมุด
                          </span>
                        )}
                        {formData.priority && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            formData.priority === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : formData.priority === 'NORMAL'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            <Flag className="h-3 w-3" />
                            {formData.priority === 'HIGH' ? 'สำคัญ' : formData.priority === 'NORMAL' ? 'ปกติ' : 'ต่ำ'}
                          </span>
                        )}
                        {formData.isDraft && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            <Save className="h-3 w-3" />
                            Draft
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.title || 'ไม่มีหัวข้อ'}</h2>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(formData.content || '<p>ไม่มีเนื้อหา</p>') }}
                      />
                      {formData.attachments && formData.attachments.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-3">ไฟล์แนบ:</p>
                          <div className="space-y-2">
                            {formData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <FileText className="h-4 w-4" />
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
                </div>

                {/* Footer - Fixed for Preview */}
                {showPreview && (
                  <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                      <button
                        onClick={handleExportPreview}
                        className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white transition-all"
                      >
                        <Download className="h-4 w-4" />
                        ส่งออกเป็น Word
                      </button>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
                      >
                        แก้ไขต่อ
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer - Fixed */}
                {!showPreview && (
                  <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white transition-all"
                      >
                        <Eye className="h-4 w-4" />
                        ดูตัวอย่าง
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const form = document.getElementById('create-announcement-form') as HTMLFormElement;
                          if (form) {
                            form.requestSubmit();
                          }
                        }}
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'กำลังสร้าง...' : formData.isDraft ? 'บันทึกเป็น Draft' : 'สร้างประกาศ'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setFormData({
                            title: '',
                            content: '',
                            contentFormat: 'HTML',
                            priority: 'NORMAL',
                            isPinned: false,
                            isDraft: false,
                            publishedAt: undefined,
                            attachments: [],
                          });
                          setFormErrors({});
                          setShowPreview(false);
                        }}
                        className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white transition-all"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit Announcement Modal */}
          {editingAnnouncement && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
                {/* Header - Fixed */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">แก้ไขประกาศ</h2>
                    <p className="mt-1 text-sm text-gray-500">แก้ไขข้อมูลประกาศ</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAnnouncement(null);
                      setEditFormData({
                        title: '',
                        content: '',
                        contentFormat: 'HTML',
                        priority: 'NORMAL',
                        isPinned: false,
                        isDraft: false,
                        publishedAt: undefined,
                        attachments: [],
                      });
                      setFormErrors({});
                      setShowPreview(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 py-6">

                {!showPreview ? (
                  <form id="edit-announcement-form" onSubmit={handleUpdateAnnouncement} className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        หัวข้อ <span className="text-red-500">*</span>
                        <span className="ml-2 text-xs text-gray-500 font-normal">
                          ({editFormData.title.length}/200)
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={200}
                        value={editFormData.title}
                        onChange={(e) => {
                          setEditFormData({ ...editFormData, title: e.target.value });
                          setFormErrors({ ...formErrors, title: undefined });
                        }}
                        className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                          formErrors.title
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                        }`}
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                      )}
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        เนื้อหา <span className="text-red-500">*</span>
                      </label>
                      <WordEditor
                        content={editFormData.content}
                        onChange={(html) => {
                          setEditFormData({ ...editFormData, content: html });
                          setFormErrors({ ...formErrors, content: undefined });
                        }}
                        onExport={() => {
                          const announcement = editingAnnouncement;
                          if (announcement) {
                            handleExportToWord({
                              ...announcement,
                              title: editFormData.title,
                              content: editFormData.content,
                            });
                          }
                        }}
                        placeholder="เริ่มพิมพ์ข้อความ..."
                      />
                      {formErrors.content && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
                      )}
                    </div>

                    {/* Additional Options */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Priority */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          ระดับความสำคัญ
                        </label>
                        <select
                          value={editFormData.priority}
                          onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value as 'HIGH' | 'NORMAL' | 'LOW' })}
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                        >
                          <option value="LOW">ต่ำ</option>
                          <option value="NORMAL">ปกติ</option>
                          <option value="HIGH">สำคัญ</option>
                        </select>
                      </div>

                      {/* Scheduled Publishing */}
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          กำหนดเผยแพร่ (ไม่บังคับ)
                        </label>
                        <input
                          type="datetime-local"
                          value={editFormData.publishedAt ? new Date(editFormData.publishedAt).toISOString().slice(0, 16) : ''}
                          onChange={(e) => {
                            const value = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                            setEditFormData({ ...editFormData, publishedAt: value });
                            setFormErrors({ ...formErrors, publishedAt: undefined });
                          }}
                          min={new Date().toISOString().slice(0, 16)}
                          className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                            formErrors.publishedAt
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                          }`}
                        />
                        {formErrors.publishedAt && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.publishedAt}</p>
                        )}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editFormData.isPinned}
                          onChange={(e) => setEditFormData({ ...editFormData, isPinned: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex items-center gap-2">
                          <Pin className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">ปักหมุด</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editFormData.isDraft}
                          onChange={(e) => setEditFormData({ ...editFormData, isDraft: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">บันทึกเป็น Draft</span>
                        </div>
                      </label>
                    </div>

                    {/* File Attachments */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        ไฟล์แนบ
                      </label>
                      <FileUpload
                        files={editFormData.attachments || []}
                        onFilesChange={(files) => setEditFormData({ ...editFormData, attachments: files })}
                        maxFiles={5}
                        maxSize={10 * 1024 * 1024}
                      />
                    </div>

                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Preview Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900">ตัวอย่างประกาศ</h3>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <EyeOff className="h-4 w-4" />
                        ปิดตัวอย่าง
                      </button>
                    </div>

                    {/* Preview Content */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                      <div className="mb-4 flex items-center gap-3">
                        {editFormData.isPinned && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            <Pin className="h-3 w-3" />
                            ปักหมุด
                          </span>
                        )}
                        {editFormData.priority && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            editFormData.priority === 'HIGH'
                              ? 'bg-red-100 text-red-700'
                              : editFormData.priority === 'NORMAL'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            <Flag className="h-3 w-3" />
                            {editFormData.priority === 'HIGH' ? 'สำคัญ' : editFormData.priority === 'NORMAL' ? 'ปกติ' : 'ต่ำ'}
                          </span>
                        )}
                        {editFormData.isDraft && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                            <Save className="h-3 w-3" />
                            Draft
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{editFormData.title || 'ไม่มีหัวข้อ'}</h2>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(editFormData.content || '<p>ไม่มีเนื้อหา</p>') }}
                      />
                      {editFormData.attachments && editFormData.attachments.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-3">ไฟล์แนบ:</p>
                          <div className="space-y-2">
                            {editFormData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <FileText className="h-4 w-4" />
                                <span>{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                )}
                </div>

                {/* Footer - Fixed for Preview */}
                {showPreview && (
                  <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const announcement = editingAnnouncement;
                          if (announcement) {
                            handleExportToWord({
                              ...announcement,
                              title: editFormData.title,
                              content: editFormData.content,
                            });
                          }
                        }}
                        className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white transition-all"
                      >
                        <Download className="h-4 w-4" />
                        ส่งออกเป็น Word
                      </button>
                      <button
                        onClick={() => setShowPreview(false)}
                        className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
                      >
                        แก้ไขต่อ
                      </button>
                    </div>
                  </div>
                )}

                {/* Footer - Fixed */}
                {!showPreview && (
                  <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white transition-all"
                      >
                        <Eye className="h-4 w-4" />
                        ดูตัวอย่าง
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const form = document.getElementById('edit-announcement-form') as HTMLFormElement;
                          if (form) {
                            form.requestSubmit();
                          }
                        }}
                        disabled={isSubmitting}
                        className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAnnouncement(null);
                          setEditFormData({
                            title: '',
                            content: '',
                            contentFormat: 'HTML',
                            priority: 'NORMAL',
                            isPinned: false,
                            isDraft: false,
                            publishedAt: undefined,
                            attachments: [],
                          });
                          setFormErrors({});
                          setShowPreview(false);
                        }}
                        className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-white transition-all"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
