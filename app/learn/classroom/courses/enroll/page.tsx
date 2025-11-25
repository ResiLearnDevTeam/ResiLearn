'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LeftSidebar from '@/components/layout/LeftSidebar';

export default function EnrollCoursePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return alert('กรุณากรอกรหัสคอร์ส');

    setLoading(true);

    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'ลงทะเบียนไม่สำเร็จ');
        return;
      }

      alert('🎉 ลงทะเบียนสำเร็จ!');
      router.push('/learn/classroom/courses');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64 px-6 py-10 md:p-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🔑 ลงทะเบียนเข้าคอร์ส
        </h1>

        <p className="text-gray-600 mb-8">
          กรุณากรอกรหัสคอร์สที่ได้รับจากอาจารย์
        </p>

        <form
          onSubmit={handleEnroll}
          className="max-w-md bg-white rounded-2xl shadow-md p-6 border border-orange-100"
        >
          <label className="block mb-3 text-gray-700 font-medium">
            รหัสคอร์ส
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="เช่น ABC123"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 
                       focus:ring-orange-400 focus:outline-none mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 text-white py-2.5 rounded-lg 
                       font-medium hover:bg-orange-700 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? 'กำลังดำเนินการ...' : 'เข้าร่วมคอร์ส'}
          </button>
        </form>
      </div>
    </div>
  );
}
