import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "กรุณากรอกรหัสคอร์ส" }, { status: 400 });
    }

    // ค้นหาคอร์สด้วย code
    const course = await db.course.findFirst({
      where: { code },
    });

    if (!course) {
      return NextResponse.json({ error: "ไม่พบคอร์สนี้" }, { status: 404 });
    }

    // เช็คว่านักเรียนเข้าร่วมแล้วหรือยัง
    const alreadyJoined = await db.enrollment.findFirst({
      where: {
        courseId: course.id,
        userId: session.user.id,
      },
    });

    if (alreadyJoined) {
      return NextResponse.json(
        { error: "คุณเข้าร่วมคอร์สนี้แล้ว" },
        { status: 400 }
      );
    }

    // บันทึกการเข้าร่วมคอร์ส
    await db.enrollment.create({
      data: {
        courseId: course.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "เข้าร่วมคอร์สสำเร็จ!" });
  } catch (error) {
    console.error("Enroll error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}
