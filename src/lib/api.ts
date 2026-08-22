/**
 * NestJS 백엔드와 통신하는 얇은 타입 지원 fetch 래퍼.
 *
 * - 개발 환경: `VITE_API_URL`을 비워두면 `/api` 경로로 요청하며,
 *   Vite dev-server 프록시(vite.config.ts)가 백엔드로 전달합니다.
 * - 운영 환경: `VITE_API_URL`에 배포된 백엔드 주소를 지정합니다.
 */
const BASE_URL = (import.meta.env?.VITE_API_URL ?? '/api').replace(/\/$/, '');

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  traceId: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly traceId?: string;

  constructor(
    status: number,
    message: string,
    code?: string,
    traceId?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.traceId = traceId;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return isRecord(value) && Object.hasOwn(value, 'data');
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    typeof value.code === 'string' &&
    typeof value.message === 'string' &&
    typeof value.traceId === 'string'
  );
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return response.text();

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError(
      response.status,
      '서버 응답을 해석할 수 없습니다.',
      'INVALID_RESPONSE',
      response.headers.get('x-request-id') ?? undefined,
      { cause: error },
    );
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);

  if (init?.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }

    throw new ApiError(
      0,
      '네트워크 연결을 확인해 주세요.',
      'NETWORK_ERROR',
      undefined,
      { cause: error },
    );
  }

  const body = await readResponseBody(response);

  if (!response.ok) {
    const apiError = isApiErrorResponse(body) ? body : undefined;
    const fallbackMessage =
      typeof body === 'string' && body.trim().length > 0
        ? body
        : `요청 실패: ${response.status} ${response.statusText}`;

    throw new ApiError(
      response.status,
      apiError?.message ?? fallbackMessage,
      apiError?.code,
      apiError?.traceId ?? response.headers.get('x-request-id') ?? undefined,
    );
  }

  return (isApiResponse(body) ? body.data : body) as T;
}
