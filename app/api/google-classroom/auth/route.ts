import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { generateMockTokens } from '@/lib/google-classroom-mock';

/**
 * GET /api/google-classroom/auth
 * 
 * Mock OAuth initiation for Google Classroom
 * Creates mock tokens immediately instead of redirecting to Google
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can connect Google Classroom' },
        { status: 403 }
      );
    }

    // Check if user already has a Google Classroom connection
    const existingAccount = await db.account.findFirst({
      where: {
        userId: session.user.id,
        provider: 'google-classroom',
      },
    });

    if (existingAccount) {
      // Already connected, redirect to selection page
      const baseUrl = request.nextUrl.origin;
      const redirectUrl = new URL('/learn/classroom/teacher/courses/create/select-classroom?connected=true', baseUrl);
      console.log('Redirecting (already connected) to:', redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    // Generate mock tokens
    const { access_token, refresh_token } = generateMockTokens();

    // Calculate expiration (1 year from now)
    const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;

    // Save tokens to Account model
    await db.account.create({
      data: {
        userId: session.user.id,
        type: 'oauth',
        provider: 'google-classroom',
        providerAccountId: session.user.id, // Use user ID as provider account ID for mock
        access_token: access_token,
        refresh_token: refresh_token,
        expires_at: expiresAt,
        token_type: 'Bearer',
        scope: 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.profile.emails',
      },
    });

    // Redirect to selection page
    const baseUrl = request.nextUrl.origin;
    const redirectUrl = new URL('/learn/classroom/teacher/courses/create/select-classroom?connected=true', baseUrl);
    console.log('Redirecting (success) to:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Error in Google Classroom auth:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
    });
    const baseUrl = request.nextUrl.origin;
    const redirectUrl = new URL('/learn/classroom/teacher/courses/create?error=auth_failed', baseUrl);
    console.log('Redirecting (error) to:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }
}
