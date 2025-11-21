'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // ✅ ใช้ของ shadcn/ui

export default function EnrollmentForm() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // ✅ ตัว toast จาก shadcn/ui

  async function handleJoinCourse(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: data.error || "ไม่สามารถเข้าร่วมคอร์สได้",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "สำเร็จ!",
        description: "เข้าร่วมคอร์สสำเร็จแล้ว 🎉",
      });

      setCode('');
    } catch (err) {
      toast({
        title: "เชื่อมต่อล้มเหลว",
        description: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleJoinCourse}
      className="bg-white shadow-md rounded-lg p-6 mt-6 border"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        ลงทะเบียนคอร์ส
      </h2>

      <Input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="กรอกรหัสคอร์ส เช่น ABC123"
        className="mb-4"
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? 'กำลังลงทะเบียน...' : 'เข้าร่วมคอร์ส'}
      </Button>
    </form>
  );
}
