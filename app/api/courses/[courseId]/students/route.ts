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

// DELETE: ลบนักเรียนออกจากคอร์ส
export async function DELETE(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await context.params;
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // ลบจาก Enrollment แทน CourseEnrollment
    const deleted = await db.enrollment.deleteMany({
      where: { userId, courseId },
    });

    return NextResponse.json(deleted);
  } catch (error: any) {
    console.error("DELETE /api/courses/[courseId]/students error:", error);
    return NextResponse.json(
      { error: error.message || "ไม่สามารถลบผู้เรียนได้" },
      { status: 500 }
    );
  }
}
