import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ============================
// เพิ่มนักเรียนเข้าคอร์ส (ADMIN ใช้)
// ============================
export async function POST(req: Request) {
  try {
    const { email, courseId } = await req.json();

    // 1) ตรวจสอบว่ากรอกข้อมูลครบ
    if (!email || !courseId) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบ email หรือ courseId หายไป" },
        { status: 400 }
      );
    }

    // 2) หา user จาก email
    const user = await db.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบนักเรียนในระบบ" },
        { status: 404 }
      );
    }

    // 3) ตรวจสอบว่ามี enrollment อยู่แล้วหรือยัง
    const exist = await db.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId,
      }
    });

    if (exist) {
      return NextResponse.json(
        { error: "นักเรียนคนนี้อยู่ในคอร์สแล้ว" },
        { status: 400 }
      );
    }

    // 4) เพิ่มเข้า enrollment
    await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
      }
    });

    return NextResponse.json({ message: "เพิ่มนักเรียนสำเร็จ!" });
  } catch (error) {
    console.error("ENROLL ADMIN ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// ============================
// ดึงรายชื่อนักเรียนทั้งหมด (ไว้ใช้ Suggestion)
// ============================
export async function GET() {
  try {
    const users = await db.user.findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
