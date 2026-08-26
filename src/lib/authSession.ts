export interface SessionUser {
  id?: number | string;
  name: string;
  nickname: string;
  email: string;
}

const USER_STORAGE_KEY = 'user';
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';

/** Swagger에 프로필 조회 API가 없어 사용하는 명시적 화면 목업. */
export const MOCK_SESSION_USER: SessionUser = {
  id: 'mock-user',
  name: '김민지',
  nickname: 'kim_minji',
  email: 'kimminji@naver.com',
};

function readString(
  value: Record<string, unknown>,
  key: string,
): string | undefined {
  const candidate = value[key];
  return typeof candidate === 'string' && candidate.trim()
    ? candidate.trim()
    : undefined;
}

export function readSessionUser(): SessionUser {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return MOCK_SESSION_USER;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return MOCK_SESSION_USER;
    }

    const record = parsed as Record<string, unknown>;
    const email = readString(record, 'email') ?? MOCK_SESSION_USER.email;
    const emailId = email.split('@')[0] || MOCK_SESSION_USER.nickname;
    return {
      id:
        typeof record.id === 'number' || typeof record.id === 'string'
          ? record.id
          : undefined,
      name:
        readString(record, 'name') ??
        readString(record, 'nickname') ??
        MOCK_SESSION_USER.name,
      nickname: readString(record, 'nickname') ?? emailId,
      email,
    };
  } catch {
    return MOCK_SESSION_USER;
  }
}

export function readSessionUserId(): number | null {
  const id = readSessionUser().id;
  const numericId = typeof id === 'string' ? Number(id) : id;

  return typeof numericId === 'number' &&
    Number.isSafeInteger(numericId) &&
    numericId > 0
    ? numericId
    : null;
}

export function writeSessionUser(user: SessionUser): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
