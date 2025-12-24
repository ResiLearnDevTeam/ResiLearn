import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  return NextResponse.json({ message: 'Google Classroom sync API - POST handler coming soon' }, { status: 501 });
}
