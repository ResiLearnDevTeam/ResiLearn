'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/courses/${courseId}/students`);
      const data = await res.json();
      setStudents(data);
      setLoading(false);
    }
    load();
  }, [courseId]);

  if (loading) return <p className="text-gray-600">กำลังโหลดข้อมูล...</p>;

  return (
    <div className="space-y-4">

      {students.length === 0 && (
        <p className="text-gray-600">ยังไม่มีนักเรียนในคอร์สนี้</p>
      )}

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
              <p className="text-xs text-gray-500">รหัสนักเรียน: {s.user.studentId}</p>
            )}
          </div>

          <div className="w-40">
            <p className="text-sm text-gray-700 mb-1">Progress: {s.progress}%</p>
            <Progress value={s.progress} />
          </div>
        </Card>
      ))}

    </div>
  );
}
