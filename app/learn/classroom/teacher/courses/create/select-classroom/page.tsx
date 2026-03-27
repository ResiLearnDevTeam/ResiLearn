'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import GoogleClassroomSelector from '@/components/features/classroom/GoogleClassroomSelector';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect } from 'react';

function SelectClassroomContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const connected = searchParams?.get('connected');
    if (connected === 'true') {
      toast.success('เชื่อมต่อ Google Classroom สำเร็จ', {
        description: 'กรุณาเลือก Classroom ที่ต้องการเชื่อมต่อ',
      });
    }
  }, [searchParams]);

  return (
    <div
      className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
      style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
    >
      <main className="w-full h-full px-4 py-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/learn/classroom/teacher/courses/create"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับไปหน้าสร้างหลักสูตร
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">เลือก Google Classroom</h1>
          <p className="mt-2 text-gray-600">
            เลือก Classroom ที่ต้องการเชื่อมต่อกับหลักสูตรของคุณ
          </p>
        </div>

        {/* Classroom Selector */}
        <div className="rounded-xl bg-white p-8 shadow-md">
          <GoogleClassroomSelector
            redirectPath="/learn/classroom/teacher/courses/create"
          />
        </div>
      </main>
    </div>
  );
}

export default function SelectClassroomPage() {
  return (
    <Suspense
      fallback={
        <div
          className="w-full h-screen transition-all duration-200 ease-out overflow-y-auto"
          style={{ marginLeft: 'var(--sidebar-width, 288px)' }}
        >
          <main className="w-full h-full px-4 py-6 lg:px-8">
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">กำลังโหลด...</p>
              </div>
            </div>
          </main>
        </div>
      }
    >
      <SelectClassroomContent />
    </Suspense>
  );
}
