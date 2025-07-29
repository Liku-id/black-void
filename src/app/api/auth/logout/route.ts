import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from '@/lib/api/axios-server';
import { AxiosErrorResponse, handleErrorAPI } from '@/lib/api/error-handler';
import { clearSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Get access token from cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    if (!accessToken) {
      // If no access token, just clear session locally
      await clearSession();
      return NextResponse.json({ message: 'Logout successful' });
    }

    // Call backend logout with access token
    await axios.post('/v1/auth/logout', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Clear session
    await clearSession();

    return NextResponse.json({ message: 'Logout successful' });
  } catch (e) {
    // Even if backend call fails, clear session locally
    await clearSession();
    return handleErrorAPI(e as AxiosErrorResponse);
  }
}
