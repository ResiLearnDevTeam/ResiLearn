import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> }
) {
  return NextResponse.json({ message: 'Assignment detail API - GET handler coming soon' }, { status: 501 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> }
) {
  return NextResponse.json({ message: 'Assignment detail API - PUT handler coming soon' }, { status: 501 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; assignmentId: string }> }
) {
  return NextResponse.json({ message: 'Assignment detail API - DELETE handler coming soon' }, { status: 501 });
}
