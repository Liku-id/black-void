import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.user) {
      return NextResponse.json({ loggedIn: false, user: null });
    }

    return NextResponse.json({
      loggedIn: true,
      user: session.user,
    });
  } catch (error) {
    console.error('Session validation failed:', error);
    return NextResponse.json({ loggedIn: false, user: null });
  }
}
