import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; userId: string }> }
) {
  return NextResponse.json({ message: 'Enrollment API - DELETE handler coming soon' }, { status: 501 });
}
