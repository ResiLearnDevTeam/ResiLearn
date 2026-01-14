'use client';

interface EndPracticeDialogProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function EndPracticeDialog({
  show,
  onConfirm,
  onCancel,
}: EndPracticeDialogProps) {
  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        backdropFilter: 'blur(6px) saturate(180%)',
        WebkitBackdropFilter: 'blur(6px) saturate(180%)',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">จบเซสชันการฝึกฝน?</h3>
        </div>
        <p className="mb-6 text-gray-600">
          คุณแน่ใจหรือไม่ว่าต้องการจบเซสชันการฝึกฝนนี้? ความคืบหน้าของคุณจะถูกบันทึก
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            ไม่ ฝึกต่อ
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700"
          >
            ใช่ จบการฝึกฝน
          </button>
        </div>
      </div>
    </div>
  );
}
