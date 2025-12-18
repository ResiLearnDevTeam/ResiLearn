import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* =========================
   GET: students / search
   ========================= */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    // หา enrollment ของคอร์สนี้
    const enrollments = await db.enrollment.findMany({
      where: { courseId },
      select: { userId: true },
    });

    const enrolledUserIds = enrollments.map(e => e.userId);

    /**
     * 🔍 search student (ยังไม่อยู่ในคอร์ส)
     */
    if (search) {
      const users = await db.user.findMany({
        where: {
          role: "STUDENT",
          email: {
            contains: search,
            mode: "insensitive",
          },
          NOT: {
            id: {
              in: enrolledUserIds.length ? enrolledUserIds : ["__none__"],
            },
          },
        },
        orderBy: { email: "asc" },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      return NextResponse.json(users);
    }

    /**
     * 👩‍🎓 students ที่ลงทะเบียนแล้ว
     */
    const students = await db.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            studentId: true, // ✅ FIX ตรงนี้
          },
        },
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =========================
   POST: add student
   ========================= */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const exists = await db.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId,
      },
    });

    if (exists) {
      return NextResponse.json(
        { message: "User already enrolled" },
        { status: 400 }
      );
    }

    await db.enrollment.create({
      data: {
        course: {
          connect: { id: courseId },
        },
        user: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADD STUDENT ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ============ REMOVE STUDENT ============
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    await db.enrollment.deleteMany({
      where: { userId, courseId },
    });

    return NextResponse.json({ message: "Student removed" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to remove student" },
      { status: 500 }
    );
  }
}
