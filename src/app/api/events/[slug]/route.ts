import { NextRequest, NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';
import { encryptUtils } from '@/lib/utils/encryptUtils';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(req.url);
    const partnerCode = searchParams.get('partner_code');
    const previewToken = req.cookies.get('preview_token')?.value;

    // Build query string for backend API
    const queryParams = new URLSearchParams();
    if (partnerCode) {
      queryParams.append('partner_code', partnerCode);
    }

    const queryString = queryParams.toString();
    const url = queryString 
      ? `/v1/events/${slug}?${queryString}`
      : `/v1/events/${slug}`;

    // Decrypt preview_token and use as Authorization header
    const config: { headers?: Record<string, string> } = {};
    if (previewToken) {
      try {
        // Decrypt the preview token to get the actual access token
        const decryptedToken = encryptUtils.decrypt(previewToken);
        config.headers = {
          Authorization: `Bearer ${decryptedToken}`
        };
      } catch (error) {
        console.error('Error decrypting preview_token:', error);
        // If decryption fails, try using it as-is (backward compatibility)
        config.headers = {
          Authorization: `Bearer ${previewToken}`
        };
      }
    }

    const res = await axios.get(url, config);
    const data = res.data;

    if (res.status !== 200) {
      return handleErrorAPI({
        message: data.message || 'Event not found',
        status: res.status,
      });
    }
    if (data.statusCode !== 0 || !data.body) {
      return handleErrorAPI({
        message: data.message || 'Invalid response from backend',
        status: 500,
      });
    }
    return NextResponse.json(data.body);
  } catch (error: any) {
    return handleErrorAPI(error);
  }
}
