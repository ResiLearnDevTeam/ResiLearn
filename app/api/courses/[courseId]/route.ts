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
// PUT: update course or end course
// ==============================
export async function PUT(
  req: Request,
  context: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await context.params;
  const body = await req.json();

  try {
    // ถ้า action === 'end' ให้จบคอร์ส
    if (body.action === "end") {
      const course = await db.course.findUnique({
        where: { id: courseId },
        select: { id: true, courseStatus: true },
      });

      if (!course) return NextResponse.json({ error: "ไม่พบคอร์สนี้" }, { status: 404 });
      if (course.courseStatus === "end")
        return NextResponse.json({ message: "คอร์สนี้ถูกจบไปแล้ว" }, { status: 400 });

      const updated = await db.course.update({
        where: { id: courseId },
        data: { courseStatus: "end", endDate: new Date() },
      });

      return NextResponse.json({ success: true, course: updated });
    }

    // ถ้าไม่ใช่ action end => ปกติ update course
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
    return NextResponse.json({ error: "ไม่สามารถอัปเดตคอร์สได้" }, { status: 500 });
  }
}

