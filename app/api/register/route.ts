import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 🔍 เช็ค email ซ้ำ
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // 🔐 HASH PASSWORD (เหมือน seed แต่ปลอดภัย)
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await db.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role,
        currentLevel: 1,
        levelsUnlocked: [1],
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(
      { user },
      { status: 201 }
    );
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
