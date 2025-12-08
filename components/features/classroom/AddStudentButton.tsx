"use client";

import { useRouter } from "next/navigation";

export default function AddStudentButton({ courseId }: { courseId: string }) {
  const router = useRouter();

  return (
    <button
      className="
        w-full sm:w-auto px-6 py-3 rounded-xl 
        bg-orange-500 text-white font-medium 
        hover:bg-orange-600 transition-all shadow-md
        text-sm sm:text-base
      "
      onClick={() =>
        router.push(`/learn/classroom/teacher/courses/${courseId}/students/add`)
      }
    >
      ➕ Add Student
    </button>
  );
}
