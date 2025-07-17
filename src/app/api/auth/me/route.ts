import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({ loggedIn: true });
}
