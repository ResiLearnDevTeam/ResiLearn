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
      <div className="rounded-xl bg-white p-12 text-center shadow-md">
        <p className="text-gray-600">{emptyMessage}</p>
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
