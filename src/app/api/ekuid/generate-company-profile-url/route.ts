import { NextResponse } from 'next/server';
import client from '@/lib/api/apollo-client';
import { QUERY_GENERATE_COMPANY_PROFILE_URL } from '@/lib/api/queries/ekuid-queries';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const image_mime_type = searchParams.get('image_mime_type');
  const file_type = searchParams.get('file_type');

  try {
    const response = await client.query({
      query: QUERY_GENERATE_COMPANY_PROFILE_URL,
      variables: {
        image_mime_type,
        file_type
      },
      context: {
        headers: {
          "user-agent": req.headers.get("user-agent") || '',
        },
      },
    });

    return NextResponse.json(response.data && (response.data as any).generateCompanyProfileUrl);
  } catch (error: any) {
    if (error.graphQLErrors && error.graphQLErrors.length) {
      const ext = error.graphQLErrors[0].extensions;
      return NextResponse.json(ext, { status: ext.status_code || 400 });
    } else if (
      error.networkError &&
      error.networkError.result &&
      error.networkError.result.errors &&
      error.networkError.result.errors.length
    ) {
      const ext = error.networkError.result.errors[0].extensions;
      return NextResponse.json(ext, { status: ext.status_code || 400 });
    } else {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}
