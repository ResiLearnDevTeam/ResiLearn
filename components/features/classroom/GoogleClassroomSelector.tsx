'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Users, FileText, Bell, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ClassroomListItem {
  id: string;
  name: string;
  section: string;
  room: string;
  enrollmentCode: string;
  description: string;
  studentsCount: number;
  assignmentsCount: number;
  announcementsCount: number;
}

interface GoogleClassroomSelectorProps {
  onSelect?: (classroomId: string) => void;
  redirectPath?: string;
}

export default function GoogleClassroomSelector({
  onSelect,
  redirectPath = '/learn/classroom/teacher/courses/create',
}: GoogleClassroomSelectorProps) {
  const router = useRouter();
  const [classrooms, setClassrooms] = useState<ClassroomListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/google-classroom/list');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch classrooms');
      }

      const data = await response.json();
      setClassrooms(data.classrooms || []);
    } catch (err: any) {
      console.error('Error fetching classrooms:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดรายการ Classroom');
      toast.error('โหลดรายการ Classroom ไม่สำเร็จ', {
        description: err.message || 'กรุณาลองใหม่อีกครั้ง',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (classroomId: string) => {
    setSelectedClassroomId(classroomId);
    
    if (onSelect) {
      onSelect(classroomId);
    } else {
      // Default behavior: redirect with selectedClassroomId
      const url = new URL(redirectPath, window.location.origin);
      url.searchParams.set('selectedClassroomId', classroomId);
      router.push(url.toString());
    }

    toast.success('เลือก Classroom สำเร็จ', {
      description: 'พร้อมเชื่อมต่อเมื่อสร้างหลักสูตร',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">กำลังโหลดรายการ Classroom...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="text-center">
          <p className="text-red-800 font-medium mb-2">เกิดข้อผิดพลาด</p>
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchClassrooms}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  if (classrooms.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-gray-600">ไม่พบ Classroom</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          เลือก Google Classroom
        </h2>
        <p className="text-sm text-gray-600">
          เลือก Classroom ที่ต้องการเชื่อมต่อกับหลักสูตรของคุณ
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classrooms.map((classroom) => {
          const isSelected = selectedClassroomId === classroom.id;
          
          return (
            <div
              key={classroom.id}
              className={`relative rounded-lg border-2 p-5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => handleSelect(classroom.id)}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
              )}

              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {classroom.name}
                </h3>
                <p className="text-sm text-gray-600">{classroom.description}</p>
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Section:</span>
                  <span>{classroom.section}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Room:</span>
                  <span>{classroom.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Code:</span>
                  <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs">
                    {classroom.enrollmentCode}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>{classroom.studentsCount} คน</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>{classroom.assignmentsCount} งาน</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                  <Bell className="h-4 w-4" />
                  <span>{classroom.announcementsCount}</span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs font-medium text-blue-700 text-center">
                    ✓ เลือกแล้ว
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
