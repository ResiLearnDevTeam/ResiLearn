import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  return NextResponse.json({ message: 'Students API - GET handler coming soon' }, { status: 501 });
}
