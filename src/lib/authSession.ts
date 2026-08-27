export interface SessionUser {
  id: number;
  email: string;
  name: string;
  tossApiConnected: boolean;
}

/** 로그인 성공·키 등록 완료·건너뛰기 도착지 */
export const AFTER_LOGIN_PATH = '/home';

/**
 * 회원가입 직후 API Key 등록 화면.
 * `/api-key`는 Vite `/api` 프록시에 걸려 백엔드로 넘어가므로 쓰지 않는다.
 */
export const AFTER_SIGNUP_PATH = '/register-key';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}

export function writeAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export function readSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    if (
      typeof record.id !== 'number' ||
      typeof record.email !== 'string' ||
      typeof record.name !== 'string'
    ) {
      return null;
    }

    return {
      id: record.id,
      email: record.email,
      name: record.name,
      tossApiConnected: record.tossApiConnected === true,
    };
  } catch {
    return null;
  }
}

export function writeSessionUser(user: SessionUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function writeAuthSession(accessToken: string, user: SessionUser): void {
  writeAccessToken(accessToken);
  writeSessionUser(user);
}

export function markTossApiConnected(): void {
  const user = readSessionUser();
  if (!user) return;
  writeSessionUser({ ...user, tossApiConnected: true });
}

export function clearAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** 토스 API 키가 없으면 등록 화면, 있으면 홈. */
export function destinationAfterAuth(
  user: Pick<SessionUser, 'tossApiConnected'>,
): string {
  return user.tossApiConnected ? AFTER_LOGIN_PATH : AFTER_SIGNUP_PATH;
}
