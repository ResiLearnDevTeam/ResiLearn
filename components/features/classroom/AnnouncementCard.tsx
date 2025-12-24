'use client';

import { Announcement } from '@/types/classroom';
import { formatDateTime } from '@/lib/classroom';
import { Bell, Calendar } from 'lucide-react';

interface AnnouncementCardProps {
  announcement: Announcement;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function AnnouncementCard({
  announcement,
  showActions = false,
  onEdit,
  onDelete,
}: AnnouncementCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
          </div>

          <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{formatDateTime(announcement.createdAt)}</span>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">{announcement.content}</p>
          </div>
        </div>
      </div>

      {/* Actions (for teachers) */}
      {showActions && (onEdit || onDelete) && (
        <div className="mt-4 flex gap-2 border-t border-gray-200 pt-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600"
            >
              แก้ไข
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-600"
            >
              ลบ
            </button>
          )}
        </div>
      )}
    </div>
  );
}
