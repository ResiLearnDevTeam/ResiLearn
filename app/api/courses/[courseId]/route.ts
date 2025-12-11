import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ==============================
// GET: ดึง Course + Teacher name
// ==============================
export async function GET(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await context.params;

  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "ไม่พบคอร์สนี้" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("GET /api/courses/[courseId] error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// ==============================
// PUT: อัปเดตคอร์ส
// ==============================
export async function PUT(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await context.params;

  try {
    const body = await req.json();
    const { name, description, image, startDate, endDate } = body;

    const updated = await db.course.update({
      where: { id: courseId },
      data: {
        name,
        description,
        image,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/courses/[courseId] error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถอัปเดตคอร์สได้" },
      { status: 500 }
    );
  }
}

// ==============================
// DELETE: Soft Delete Course  (จบคอร์ส)
// ==============================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await context.params;

  try {
    const now = new Date();

    const updated = await db.course.update({
      where: { id: courseId },
      data: {
        courseStatus: "end",   // เปลี่ยนเป็นสถานะ end
        endDate: now,          // เวลาปัจจุบัน
      },
    });

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error("DELETE /api/courses/[courseId] error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถยุติคอร์สได้" },
      { status: 500 }
    );
  }
}

