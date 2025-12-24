import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  return NextResponse.json({ message: 'Announcements API - GET handler coming soon' }, { status: 501 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  return NextResponse.json({ message: 'Announcements API - POST handler coming soon' }, { status: 501 });
}
