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
    <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100 transition-all hover:shadow-lg hover:border-orange-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 flex-shrink-0">
              <Bell className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{announcement.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{formatDateTime(announcement.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="ml-[52px] mt-3">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{announcement.content}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions (for teachers) */}
      {showActions && (onEdit || onDelete) && (
        <div className="mt-5 flex gap-3 border-t border-gray-200 pt-4">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
            >
              แก้ไข
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
