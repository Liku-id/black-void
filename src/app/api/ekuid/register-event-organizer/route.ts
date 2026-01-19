import { NextResponse } from 'next/server';
import client from '@/lib/api/apollo-client';
import { MUTATE_REGISTER_PROJECT_OWNER } from '@/lib/api/queries/ekuid-queries';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    const response = await client.mutate({
      mutation: MUTATE_REGISTER_PROJECT_OWNER,
      variables: {
        input: payload,
      },
      context: {
        headers: {
          "user-agent": req.headers.get("user-agent") || '',
        },
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("API Error:", error);

    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const ext = error.graphQLErrors[0].extensions;
      return NextResponse.json(
        ext,
        { status: ext.status_code || 400 }
      );
    } else if (
      error.networkError &&
      error.networkError.result &&
      error.networkError.result.errors &&
      error.networkError.result.errors.length > 0
    ) {
      const ext = error.networkError.result.errors[0].extensions;
      return NextResponse.json(
        ext,
        { status: ext.status_code || 400 }
      );
    } else {
      return NextResponse.json(
        { message: error.message || "Internal Server Error" },
        { status: 400 }
      );
    }
  }
}
