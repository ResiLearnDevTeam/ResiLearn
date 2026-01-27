'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Users, FileText, CheckCircle2, XCircle, Loader2, Download, ArrowRightLeft } from 'lucide-react';
import { SyncStatus } from '@/types/classroom';

interface GoogleClassroomSyncPanelProps {
  courseId: string;
}

export default function GoogleClassroomSyncPanel({ courseId }: GoogleClassroomSyncPanelProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSyncStatus();
  }, [courseId]);

  const fetchSyncStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/google-classroom/sync-status?courseId=${courseId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch sync status');
      }

      const data = await response.json();
      setSyncStatus(data);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncGrades = async () => {
    setIsSyncing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/google-classroom/sync-grades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sync grades');
      }

      const data = await response.json();
      setSuccessMessage(`ซิงค์คะแนนสำเร็จ: ${data.syncedCount} รายการ`);
      fetchSyncStatus(); // Refresh status
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการซิงค์คะแนน');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncAssignments = async () => {
    setIsSyncing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/google-classroom/sync-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to sync assignments');
      }

      const data = await response.json();
      setSuccessMessage(`ซิงค์งานสำเร็จ: ${data.syncedCount} รายการ`);
      fetchSyncStatus(); // Refresh status
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการซิงค์งาน');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImportStudents = async () => {
    if (!syncStatus?.sync) return;

    setIsImporting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/google-classroom/import-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          classroomId: syncStatus.sync.classroomId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to import students');
      }

      const data = await response.json();
      setSuccessMessage(`นำเข้านักเรียนสำเร็จ: ${data.importedCount} คน`);
      fetchSyncStatus(); // Refresh status
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการนำเข้านักเรียน');
    } finally {
      setIsImporting(false);
    }
  };

  const handleToggleAutoSync = async (enabled: boolean) => {
    // This would require an API endpoint to update sync settings
    // For now, we'll just show a message
    setSuccessMessage(enabled ? 'เปิดใช้งาน Auto-sync แล้ว' : 'ปิดใช้งาน Auto-sync แล้ว');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!syncStatus?.linked) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">หลักสูตรนี้ยังไม่ได้เชื่อมต่อกับ Google Classroom</p>
      </div>
    );
  }

  const { sync, statistics, history } = syncStatus;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">สถานะการซิงค์</h3>
          <button
            onClick={fetchSyncStatus}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {sync && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">เชื่อมต่อแล้ว</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Classroom:</span> {sync.classroomName}
              </p>
              <p>
                <span className="font-medium">ซิงค์ล่าสุด:</span>{' '}
                {new Date(sync.lastSyncAt).toLocaleString('th-TH')}
              </p>
            </div>
          </div>
        )}

        {statistics && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <div className="flex items-center gap-2 text-blue-600">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">นักเรียน</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-blue-900">
                {statistics.studentsCount}
              </p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <div className="flex items-center gap-2 text-green-600">
                <FileText className="h-4 w-4" />
                <span className="text-xs font-medium">งาน</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-green-900">
                {statistics.assignmentsCount}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <div className="flex items-center gap-2 text-purple-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">คะแนน</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-purple-900">
                {statistics.gradesSynced}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Sync Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">การซิงค์</h3>
        
        <div className="space-y-3">
          <button
            onClick={handleSyncGrades}
            disabled={isSyncing}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังซิงค์...
              </>
            ) : (
              <>
                <ArrowRightLeft className="h-4 w-4" />
                ซิงค์คะแนนตอนนี้
              </>
            )}
          </button>

          <button
            onClick={handleSyncAssignments}
            disabled={isSyncing}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังซิงค์...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                ซิงค์งาน
              </>
            )}
          </button>

          <button
            onClick={handleImportStudents}
            disabled={isImporting}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                กำลังนำเข้า...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                นำเข้านักเรียนเพิ่มเติม
              </>
            )}
          </button>
        </div>

        {/* Auto-sync Toggle */}
        {sync && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div>
              <p className="font-medium text-gray-900">Auto-sync คะแนน</p>
              <p className="text-xs text-gray-600">
                ซิงค์คะแนนอัตโนมัติเมื่อนักเรียนทำ Quiz เสร็จ
              </p>
            </div>
            <button
              onClick={() => handleToggleAutoSync(!sync.autoSyncGrades)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                sync.autoSyncGrades ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  sync.autoSyncGrades ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* Sync History */}
      {history && history.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">ประวัติการซิงค์</h3>
          <div className="space-y-2">
            {history.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <div className="flex items-center gap-3">
                  {item.status === 'SUCCESS' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.type === 'GRADES' && 'ซิงค์คะแนน'}
                      {item.type === 'ASSIGNMENTS' && 'ซิงค์งาน'}
                      {item.type === 'STUDENTS' && 'นำเข้านักเรียน'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(item.syncedAt).toLocaleString('th-TH')} • {item.itemsCount} รายการ
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    item.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {item.status === 'SUCCESS' ? 'สำเร็จ' : 'ล้มเหลว'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
