/**
 * NestJS 백엔드와 통신하는 얇은 타입 지원 fetch 래퍼.
 *
 * - `VITE_API_URL`이 없거나 비어 있으면 `/api`로 요청하고,
 *   Vite 프록시(vite.config.ts)가 http://localhost:3000 으로 넘긴다.
 * - 백엔드를 다른 포트(예: 3001)에서 띄우면 `.env`에
 *   `VITE_API_URL=http://localhost:3001` 을 넣는다.
 */
import { getAccessToken } from './authSession';

const configuredApiUrl = import.meta.env?.VITE_API_URL?.trim();
const BASE_URL = (configuredApiUrl || '/api').replace(/\/$/, '');

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

  const accessToken = getAccessToken();
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      credentials: init?.credentials ?? 'include',
      headers,
    });
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
