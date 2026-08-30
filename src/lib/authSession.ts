export interface SessionUser {
  id: number;
  email: string;
  name: string;
  nickname: string;
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

/**
 * 프로필 조회 API가 아직 없어 화면 확인용으로만 쓰는 목업.
 * 실제 로그인 여부 판단에는 절대 쓰지 않는다.
 */
export const MOCK_SESSION_USER: SessionUser = {
  id: 0,
  email: 'kimminji@naver.com',
  name: '김민지',
  nickname: 'kim_minji',
  tossApiConnected: false,
};

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}

export function writeAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

/** 객체에서 비어 있지 않은 문자열 필드만 꺼낸다. */
function readString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  const candidate = record[key];
  return typeof candidate === 'string' && candidate.trim()
    ? candidate.trim()
    : undefined;
}

/** 백엔드가 nickname을 안 주는 경우 이메일 아이디 부분으로 대체한다. */
function nicknameFromEmail(email: string): string {
  return email.split('@')[0] || email;
}

/** 저장된 세션 사용자. 로그인 상태가 아니면 null. */
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
    const email = readString(record, 'email');
    const name = readString(record, 'name');
    if (typeof record.id !== 'number' || !email || !name) {
      return null;
    }

    return {
      id: record.id,
      email,
      name,
      nickname: readString(record, 'nickname') ?? nicknameFromEmail(email),
      tossApiConnected: record.tossApiConnected === true,
    };
  } catch {
    return null;
  }
}

/**
 * 로그인 전에도 화면을 그려야 하는 컴포넌트용.
 * 세션이 없으면 목업을 돌려준다. 인증 판단에는 쓰지 말 것.
 */
export function readSessionUserOrMock(): SessionUser {
  return readSessionUser() ?? MOCK_SESSION_USER;
}

/**
 * 저장된 세션 사용자의 id. dev 백엔드 StubAuthGuard용 `x-stub-user-id`
 * 헤더에서 쓴다 (src/lib/api.ts). 세션이 없으면 null.
 */
export function readSessionUserId(): number | null {
  return readSessionUser()?.id ?? null;
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
