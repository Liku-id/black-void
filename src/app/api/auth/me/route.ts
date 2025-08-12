import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('access_token')?.value;

    if (!token) {
      return NextResponse.json({ loggedIn: false, user: null });
    }

    const { data } = await axios.get('/v1/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json({ loggedIn: true, user: data?.body });
  } catch (e) {
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
