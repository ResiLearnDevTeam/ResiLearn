'use client';

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

// ⬇️ สำคัญที่สุด ต้องมีอันนี้
import { toast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    studentId: string | null;
  };
  progress: number;
}

export default function StudentList({ courseId }: { courseId: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [openAddModal, setOpenAddModal] = useState(false);

  // ฟอร์มเพิ่มนักเรียน
  const [emailInput, setEmailInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  // =====================================
  // Suggestion email search
  // =====================================
  async function handleEmailChange(value: string) {
    setEmailInput(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const res = await fetch("/api/courses/enroll");
    const all = await res.json();

    const matches = all.filter((u: any) =>
      u.email.toLowerCase().startsWith(value.toLowerCase())
    );

    setSuggestions(matches);
  }

  // =====================================
  // load รายชื่อนักเรียนในคอร์ส
  // =====================================
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/courses/${courseId}/students`);
      const data = await res.json();
      setStudents(data);
      setLoading(false);
    }
    load();
  }, [courseId]);

  // =====================================
  // ฟังก์ชันบันทึก เพิ่มนักเรียนเข้าคอร์ส
  // =====================================
  async function handleAddStudent() {
    if (!emailInput.trim()) {
      toast({
        variant: "destructive",
        title: "กรุณากรอกอีเมลให้ถูกต้อง",
      });
      return;
    }

    const res = await fetch("/api/courses/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailInput,
        courseId: courseId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast({
        variant: "destructive",
        title: data.error || "เกิดข้อผิดพลาด",
      });
      return;
    }

    // 🎉 Toast สำเร็จ
    toast({
      title: "เพิ่มนักเรียนสำเร็จ!",
      description: `${emailInput} ถูกเพิ่มเข้าคอร์สแล้ว`,
    });

    // ปิด modal
    setOpenAddModal(false);

    // โหลดรายชื่อใหม่
    const updated = await fetch(`/api/courses/${courseId}/students`);
    setStudents(await updated.json());
  }

  if (loading) return <p className="text-gray-600">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="space-y-4">

      {/* ไม่มีนักเรียน */}
      {students.length === 0 && (
        <div className="text-center mt-10 sm:mt-14 flex flex-col items-center justify-center space-y-4">
          <p className="text-gray-600 text-base sm:text-lg">
            ยังไม่มีนักเรียนในคอร์สนี้
          </p>

          <Button onClick={() => setOpenAddModal(true)}>
            ➕ เพิ่มนักเรียน
          </Button>
        </div>
      )}

      {/* รายชื่อนักเรียน */}
      {students.map((s) => (
        <Card
          key={s.id}
          className="p-4 flex justify-between items-center shadow-sm border"
        >
          <div>
            <h3 className="font-medium text-gray-900">
              {s.user.name || "ไม่ระบุชื่อ"}
            </h3>
            <p className="text-sm text-gray-600">{s.user.email}</p>

            {s.user.studentId && (
              <p className="text-xs text-gray-500">
                รหัสนักเรียน: {s.user.studentId}
              </p>
            )}
          </div>

          <div className="w-40">
            <p className="text-sm text-gray-700 mb-1">Progress: {s.progress}%</p>
            <Progress value={s.progress} />
          </div>
        </Card>
      ))}

      {/* Modal เพิ่มนักเรียน */}
      <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มนักเรียนใหม่</DialogTitle>
            <DialogDescription>
              พิมพ์อีเมลเพื่อค้นหานักเรียนในระบบ
            </DialogDescription>
          </DialogHeader>

          {/* ฟอร์ม Email */}
          <div className="space-y-2 mt-3">

            <input
              className="w-full border rounded-md p-2"
              placeholder="พิมพ์อีเมล เช่น student@gmail.com"
              value={emailInput}
              onChange={(e) => handleEmailChange(e.target.value)}
            />

            {/* Suggestion */}
            {suggestions.length > 0 && (
              <div className="border rounded-md p-2 bg-white shadow-sm max-h-40 overflow-y-auto">
                {suggestions.map((s: any) => (
                  <div
                    key={s.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => {
                      setEmailInput(s.email);
                      setSuggestions([]);
                    }}
                  >
                    {s.name ? `${s.name} — ${s.email}` : s.email}
                  </div>
                ))}
              </div>
            )}

          </div>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setOpenAddModal(false)}>
              ยกเลิก
            </Button>

            <Button onClick={handleAddStudent}>
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
