import { NextRequest, NextResponse } from 'next/server';
// GET: Get course details
// PUT: Update course (teacher only)
// DELETE: Delete course (teacher only)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  return NextResponse.json({ message: 'Course detail API - GET handler coming soon' }, { status: 501 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  return NextResponse.json({ message: 'Course detail API - PUT handler coming soon' }, { status: 501 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  return NextResponse.json({ message: 'Course detail API - DELETE handler coming soon' }, { status: 501 });
}
