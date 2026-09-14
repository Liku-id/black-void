import { NextRequest, NextResponse } from 'next/server';
import axios from '@/lib/api/axios-server';
import { handleErrorAPI } from '@/lib/api/error-handler';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    const { email, phoneNumber } = formData;

    const phone = phoneNumber;

    const requests: Promise<any>[] = [];
    const fields: ('email' | 'phone')[] = [];

    if (email && typeof email === 'string' && email.trim() !== '') {
      fields.push('email');
      requests.push(
        axios.post('/v1/users/check-availability', { email: email.trim() })
      );
    }

    if (phone && typeof phone === 'string' && phone.trim() !== '') {
      fields.push('phone');
      requests.push(
        axios.post('/v1/users/check-availability', {
          ...(phoneNumber ? { phoneNumber: phoneNumber.trim() } : {}),
        })
      );
    }

    const responses = await Promise.all(requests);
    for (let i = 0; i < responses.length; i++) {
      const res = responses[i];
      const isValid = (res?.data?.body?.isValid ?? res?.data?.isValid) !== false;
      if (!isValid) {
        const field = fields[i];
        const message =
          field === 'email'
            ? 'Email is already registered. Sign in?'
            : 'Phone number is already registered';

        return NextResponse.json({
          message,
          success: true,
          isValid: false,
        });
      }
    }

    return NextResponse.json({
      message: 'User available',
      success: true,
      isValid: true,
    });
  } catch (e) {
    return handleErrorAPI(e);
  }
}
