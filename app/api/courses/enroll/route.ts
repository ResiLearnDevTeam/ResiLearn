import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ============================
// เพิ่มนักเรียนเข้าคอร์ส
// ============================
export async function POST(req: Request) {
  try {
    const { email, courseId } = await req.json();

    if (!email || !courseId) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบ email หรือ courseId หายไป" },
        { status: 400 }
      );
    }

    const user = await db.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบนักเรียนในระบบ" },
        { status: 404 }
      );
    }

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

    await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
      }
    });

    return NextResponse.json({ message: "เพิ่มนักเรียนสำเร็จ!" });
  } catch (error) {
    console.error("ENROLL ADMIN ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ============================
// ดึงรายชื่อนักเรียนทั้งหมด (limit = 5)
// ============================
export async function GET() {
  try {
    const users = await db.user.findMany({
      where: { role: "STUDENT" },
      take: 5,      // ⭐ ดึงมาแค่ 5 คน
      orderBy: {
        name: "asc", // ⭐ มี order ด้วยจะเรียงสวยขึ้น
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
