import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params; // ✅ unwrap params

    if (!courseId) return NextResponse.json({ error: "Missing courseId" }, { status: 400 });

    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

    return NextResponse.json(course);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await context.params;

    if (!courseId) return NextResponse.json({ error: "Missing courseId" }, { status: 400 });

    const body = await req.json();

    const updated = await db.course.update({
      where: { id: courseId },
      data: {
        name: body.title,
        description: body.description,
        image: body.image,
        isPublished: body.isPublished,
        isResistorContent: body.isResistorContent,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}
