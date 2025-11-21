import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ==============================
// GET: ดึงข้อมูลคอร์สจาก courseId
// ==============================
export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: params.courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "ไม่พบคอร์สนี้" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("GET /api/courses/[courseId] error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการโหลดข้อมูลคอร์ส" },
      { status: 500 }
    );
  }
}

// ==============================================
// PUT: แก้ไขคอร์ส (ปกติให้ teacher แก้ แต่ยังไม่เช็ค role)
// ==============================================
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const body = await req.json();
    const { name, description, image, startDate, endDate } = body;

    const updated = await db.course.update({
      where: { id: params.courseId },
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

// ==============================================
// DELETE: ลบคอร์ส
// ==============================================
export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await db.course.delete({
      where: { id: params.courseId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/courses/[courseId] error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถลบคอร์สได้" },
      { status: 500 }
    );
  }
}
