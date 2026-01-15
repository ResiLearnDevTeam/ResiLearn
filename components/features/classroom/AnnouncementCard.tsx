'use client';

import { Announcement } from '@/types/classroom';
import { formatDateTime } from '@/lib/classroom';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { Bell, Calendar, Pin, Flag, Save, FileText, Download } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}

export default function AnnouncementCard({
  announcement,
  showActions = false,
  onEdit,
  onDelete,
  onExport,
}: AnnouncementCardProps) {
  const priorityColors = {
    HIGH: 'bg-red-100 text-red-700',
    NORMAL: 'bg-blue-100 text-blue-700',
    LOW: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className={`rounded-xl bg-white p-6 shadow-md border transition-all hover:shadow-lg ${
      announcement.isPinned 
        ? 'border-orange-300 bg-orange-50/30' 
        : 'border-gray-100 hover:border-orange-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with badges */}
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 flex-shrink-0">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{announcement.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{formatDateTime(announcement.createdAt)}</span>
                    {announcement.publishedAt && new Date(announcement.publishedAt) > new Date() && (
                      <span className="text-orange-600">(กำหนดเผยแพร่: {formatDateTime(announcement.publishedAt)})</span>
                    )}
                  </div>
                </div>
                {announcement.isPinned && (
                  <Pin className="h-5 w-5 text-orange-600 flex-shrink-0" />
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {announcement.isPinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                    <Pin className="h-3 w-3" />
                    ปักหมุด
                  </span>
                )}
                {announcement.priority && (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    priorityColors[announcement.priority] || priorityColors.NORMAL
                  }`}>
                    <Flag className="h-3 w-3" />
                    {announcement.priority === 'HIGH' ? 'สำคัญ' : announcement.priority === 'NORMAL' ? 'ปกติ' : 'ต่ำ'}
                  </span>
                )}
                {announcement.isDraft && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                    <Save className="h-3 w-3" />
                    Draft
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="ml-[52px] mt-3">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.content) }}
            />
          </div>

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="ml-[52px] mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">ไฟล์แนบ:</p>
              <div className="space-y-2">
                {announcement.attachments.map((file: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {file.name}
                    </a>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions (for teachers) */}
      {showActions && (onEdit || onDelete || onExport) && (
        <div className="mt-5 flex gap-3 border-t border-gray-200 pt-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
            >
              แก้ไข
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-md flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              ส่งออก Word
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600 hover:shadow-md"
            >
              ลบ
            </button>
          )}
        </div>
      )}
    </div>
  );
}
