import { NextRequest, NextResponse } from 'next/server';
// GET: List courses (for student: enrolled courses, for teacher: created courses)
// POST: Create new course (teacher only)

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Courses API - GET handler coming soon' }, { status: 501 });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Courses API - POST handler coming soon' }, { status: 501 });
}
