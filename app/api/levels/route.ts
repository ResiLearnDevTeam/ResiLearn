import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const levels = await db.level.findMany({
      orderBy: {
        number: 'asc',
      },
    });

    return NextResponse.json(levels);
  } catch (error: any) {
    console.error('Error fetching levels:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

