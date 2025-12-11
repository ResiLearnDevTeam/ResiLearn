import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ============ GET STUDENTS IN COURSE ============
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params; // <-- REQUIRED FIX

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    const students = await db.enrollment.findMany({
      where: { courseId },
      include: {
        user: true,
      },
    });

    return NextResponse.json(students);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load students" },
      { status: 500 }
    );
  }
}

// ============ ADD STUDENT ============
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;

    const body = await req.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const exists = await db.enrollment.findFirst({
      where: { userId: user.id, courseId },
    });

    if (exists) {
      return NextResponse.json(
        { error: "User already enrolled" },
        { status: 400 }
      );
    }

    const enrolled = await db.enrollment.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    return NextResponse.json(enrolled);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to enroll student" },
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
