import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ==============================
// GET: Students in course
// ==============================
export async function GET(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await context.params;

  try {
    const students = await db.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
          },
        },
      },
      orderBy: {
        enrolledAt: "asc",
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("GET /api/courses/[courseId]/students error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงรายชื่อนักเรียนได้" },
      { status: 500 }
    );
  }
}
