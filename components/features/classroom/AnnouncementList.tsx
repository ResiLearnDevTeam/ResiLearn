'use client';

import { Announcement } from '@/types/classroom';
import AnnouncementCard from './AnnouncementCard';

interface AnnouncementListProps {
  announcements: Announcement[];
  showActions?: boolean;
  isTeacherView?: boolean;
  onEdit?: (announcement: Announcement) => void;
  onDelete?: (announcement: Announcement) => void;
  emptyMessage?: string;
}

export default function AnnouncementList({
  announcements,
  showActions = false,
  isTeacherView = false,
  onEdit,
  onDelete,
  emptyMessage = 'ยังไม่มีประกาศ',
}: AnnouncementListProps) {
  if (announcements.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-12 text-center border-2 border-dashed border-gray-200">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <svg className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{emptyMessage}</p>
            <p className="mt-1 text-sm text-gray-500">เริ่มสร้างประกาศแรกของคุณ</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          showActions={showActions || isTeacherView}
          onEdit={onEdit ? () => onEdit(announcement) : undefined}
          onDelete={onDelete ? () => onDelete(announcement) : undefined}
        />
      ))}
    </div>
  );
}
