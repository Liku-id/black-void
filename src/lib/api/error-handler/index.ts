import { isAxiosError } from 'axios';
import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Shape of the backend error response body.
 * { code, message, detail: { error_code } }
 */
export type ErrorResponseData = {
  code?: string | number;
  message: string;
  detail?: {
    error_code?: string;
    [key: string]: any;
  };
};

// ---------------------------------------------------------------------------
// Server-side error handler — passes BE error body through directly
// ---------------------------------------------------------------------------

/**
 * Handles errors that occur in Next.js API routes (server side).
 *
 * Priority:
 * 1. If Axios error → forward `error.response.data` ({code, message, detail})
 *    and the HTTP status code as-is.
 * 2. Otherwise → return a generic 500 with whatever message is available.
 */
export function handleErrorAPI(error: unknown): NextResponse {
  if (isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const data = error.response?.data as ErrorResponseData | undefined;

    const body: ErrorResponseData = {
      code: data?.code,
      message:
        data?.message ?? error.message ?? 'An unexpected error occurred.',
      detail: data?.detail,
    };

    return NextResponse.json(body, { status });
  }

  // Non-Axios error (e.g. programming error, network issue before response)
  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred.';

  return NextResponse.json({ message } satisfies Partial<ErrorResponseData>, {
    status: 500,
  });
}

// ---------------------------------------------------------------------------
// Client-side error message extractor — reads BE message directly
// ---------------------------------------------------------------------------

/**
 * Extracts the user-facing error message from an Axios error on the client.
 *
 * Priority:
 * 1. If Axios error → reads `error.response.data.message` directly from the
 *    backend response (no mapping or transformation).
 * 2. Falls back to the axios error message, then a generic string.
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const data = error.response?.data as ErrorResponseData | undefined;
    return (
      data?.message ||
      error.message ||
      'An error occurred. Please try again later'
    );
  }
  return 'An unexpected error occurred';
};

// ---------------------------------------------------------------------------
// GraphQL error handler — unchanged
// ---------------------------------------------------------------------------

export function handleGraphQLErrorAPI(error: any) {
  if (error.graphQLErrors && error.graphQLErrors.length) {
    const extensions = error.graphQLErrors[0].extensions || {};
    const status = extensions.status_code || 500;
    return NextResponse.json(extensions, { status });
  } else if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors &&
    error.networkError.result.errors.length
  ) {
    const extensions = error.networkError.result.errors[0].extensions || {};
    const status = extensions.status_code || 500;
    return NextResponse.json(extensions, { status });
  } else {
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred.' },
      { status: 400 }
    );
  }
}
