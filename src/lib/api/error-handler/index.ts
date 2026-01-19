import { isAxiosError } from 'axios';
import { NextResponse } from 'next/server';

type ErrorLike = {
  message?: string;
  traceId?: string;
  status?: number;
  response?: {
    data?: { message: string; traceId: string };
    status?: number;
    message?: string;
    traceId?: string;
  };
};

type ApiErrorResponse = {
  message: string;
  meta?: {
    debug_param?: string;
  };
};

export type AxiosErrorResponse = {
  message: string;
  status: number;
};

// Error hit server side
export function handleErrorAPI(error: ErrorLike) {
  const statusCode = error?.response?.status || error?.status || 500;

  const message =
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred.';

  const traceId = error?.response?.data?.traceId || error?.traceId || '';

  return NextResponse.json(
    { message, traceId, success: false },
    { status: statusCode }
  );
}

// Error hit client side
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse;
    return apiError?.message || 'An error occurred. Please try again later';
  }
  return 'An unexpected error occurred';
};
// Error handler for GraphQL
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
