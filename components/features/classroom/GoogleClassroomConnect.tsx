'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface GoogleClassroomConnectProps {
  courseId?: string;
  courseName?: string;
  courseDescription?: string;
  onConnected?: (classroom: any) => void;
}

// Inner component that uses useSearchParams
function GoogleClassroomConnectContent({
  courseId,
  courseName,
  courseDescription,
  onConnected,
}: GoogleClassroomConnectProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classroom, setClassroom] = useState<any>(null);
  const [hasCheckedConnection, setHasCheckedConnection] = useState(false);

  // Check if classroom was selected
  useEffect(() => {
    if (hasCheckedConnection) return;
    
    const selectedClassroomId = searchParams?.get('selectedClassroomId');
    const errorParam = searchParams?.get('error');
    
    if (errorParam === 'auth_failed') {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ Google Classroom');
      toast.error('เชื่อมต่อไม่สำเร็จ', {
        description: 'กรุณาลองใหม่อีกครั้ง',
      });
      setHasCheckedConnection(true);
      return;
    }
    
    if (selectedClassroomId) {
      setHasCheckedConnection(true);
      setIsConnected(true);
      // Store selected classroom ID for later use
      setClassroom({ id: selectedClassroomId });
    }
  }, [searchParams, hasCheckedConnection]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Redirect to auth API, which will then redirect to selection page
      const authUrl = `/api/google-classroom/auth`;
      
      console.log('Redirecting to:', authUrl);
      window.location.href = authUrl;
      
      // Show loading toast
      toast.loading('กำลังเชื่อมต่อ Google Classroom...', {
        id: 'google-classroom-connect',
      });
    } catch (err: any) {
      console.error('Error connecting to Google Classroom:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setIsConnecting(false);
      toast.error('เชื่อมต่อไม่สำเร็จ', {
        description: err.message || 'กรุณาลองใหม่อีกครั้ง',
        id: 'google-classroom-connect',
      });
    }
  };

  const handleLinkClassroom = async () => {
    if (!courseId || !courseName) {
      setError('กรุณากรอกข้อมูลหลักสูตรก่อน');
      toast.error('กรุณากรอกข้อมูลหลักสูตรก่อน');
      return;
    }

    setIsLinking(true);
    setError(null);

    try {
      toast.loading('กำลังสร้าง Google Classroom...', {
        id: 'google-classroom-link',
      });

      const response = await fetch('/api/google-classroom/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          name: courseName,
          description: courseDescription,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to link classroom');
      }

      const data = await response.json();
      setClassroom(data.classroom);
      setIsConnected(true);
      setIsLinking(false);

      toast.success('เชื่อมต่อ Google Classroom สำเร็จ!', {
        description: `Classroom: ${data.classroom.name} • นักเรียน: ${data.enrolledStudents} คน`,
        id: 'google-classroom-link',
      });

      if (onConnected) {
        onConnected(data.classroom);
      }
    } catch (err: any) {
      console.error('Error linking classroom:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setIsLinking(false);
      toast.error('เชื่อมต่อไม่สำเร็จ', {
        description: err.message || 'กรุณาลองใหม่อีกครั้ง',
        id: 'google-classroom-link',
      });
    }
  };

  // Compact version for header placement
  // Show connected state if classroom is selected (even if not yet linked to course)
  if (isConnected && classroom) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
        <span className="text-sm font-medium text-green-900">เลือก Classroom แล้ว</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting || isLinking}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>กำลังเชื่อมต่อ...</span>
        </>
      ) : (
        <>
          <ExternalLink className="h-4 w-4" />
          <span>เชื่อมต่อ Google Classroom</span>
        </>
      )}
    </button>
  );
}

// Main component with Suspense wrapper
export default function GoogleClassroomConnect(props: GoogleClassroomConnectProps) {
  return (
    <Suspense fallback={
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </div>
    }>
      <GoogleClassroomConnectContent {...props} />
    </Suspense>
  );
}
