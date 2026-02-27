import { NextResponse } from 'next/server';
import { handleErrorAPI } from '@/lib/api/error-handler';
import axios from '@/lib/api/axios-server';

export async function GET() {
  try {
    const { data } = await axios.get('/v1/event-asset');
    return NextResponse.json(data.body);
  } catch (error: any) {
    return handleErrorAPI(error);
  }
}
