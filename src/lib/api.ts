import { readSessionUserId } from './authSession';

/**
 * NestJS 백엔드와 통신하는 얇은 타입 지원 fetch 래퍼.
 *
 * - 개발 환경: `VITE_API_URL`을 비워두면 `/api` 경로로 요청하며,
 *   Vite dev-server 프록시(vite.config.ts)가 백엔드로 전달합니다.
 * - 운영 환경: `VITE_API_URL`에 배포된 백엔드 주소를 지정합니다.
 */
const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

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
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return isRecord(value) && Object.hasOwn(value, 'data');
}

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text || undefined;
  }

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

  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (import.meta.env.DEV && !headers.has('x-stub-user-id')) {
    // 현재 백엔드 dev의 일부 API는 Bearer 토큰 대신 StubAuthGuard를 사용한다.
    // 헤더를 생략하면 사용자 1로 처리되므로 세션 ID가 없을 때는 실패하도록 0을 보낸다.
    headers.set('x-stub-user-id', String(readSessionUserId() ?? 0));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      credentials: init?.credentials ?? 'include',
      headers,
    });
  } catch (error) {
    if (
      init?.signal?.aborted ||
      (error instanceof DOMException && error.name === 'AbortError')
    ) {
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
    const errorBody = isRecord(body) ? body : undefined;
    const fallbackMessage =
      typeof body === 'string' && body.trim().length > 0
        ? body
        : `요청 실패: ${response.status} ${response.statusText}`;
    const message =
      typeof errorBody?.message === 'string'
        ? errorBody.message
        : fallbackMessage;

    throw new ApiError(
      response.status,
      message,
      typeof errorBody?.code === 'string' ? errorBody.code : undefined,
      typeof errorBody?.traceId === 'string'
        ? errorBody.traceId
        : (response.headers.get('x-request-id') ?? undefined),
    );
  }

  return (isApiResponse(body) ? body.data : body) as T;
}
