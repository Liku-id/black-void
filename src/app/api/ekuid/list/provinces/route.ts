import { NextResponse } from 'next/server';
import client from '@/lib/api/apollo-client';
import { QUERY_PROVINCE } from '@/lib/api/queries/ekuid-queries';
import { handleGraphQLErrorAPI } from '@/lib/api/error-handler';

// Define types for response
interface Province {
  id: string;
  name: string;
}

interface ProvincesData {
  provinces: Province[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const response = await client.query<ProvincesData>({
      query: QUERY_PROVINCE,
      variables: {
        search: search,
      },
      context: {
        headers: {
          "user-agent": request.headers.get("user-agent") || "",
        },
        fetchPolicy: "no-cache"
      },
    });

    return NextResponse.json(response.data && response.data.provinces);
  } catch (error: any) {
    return handleGraphQLErrorAPI(error);
  }
}
