/**
 * NestJS 백엔드와 통신하는 얇은 타입 지원 fetch 래퍼.
 *
 * - 개발 환경: `VITE_API_URL`을 비워두면 `/api` 경로로 요청하며,
 *   Vite dev-server 프록시(vite.config.ts)가 백엔드로 전달합니다.
 * - 운영 환경: `VITE_API_URL`에 배포된 백엔드 주소를 지정합니다.
 */
const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `요청 실패: ${response.status} ${response.statusText}`,
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  return (
    contentType.includes('application/json')
      ? await response.json()
      : await response.text()
  ) as T;
}
