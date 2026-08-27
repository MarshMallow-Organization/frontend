import { apiFetch } from '../../lib/api';
import {
  writeAccessToken,
  writeSessionUser,
  type SessionUser,
} from '../../lib/authSession';

export interface MeResponse {
  id: number;
  email: string;
  name: string;
  tossApiConnected?: boolean;
}

/** POST /auths/signup 요청 바디 (backend SignupDto 기준: password는 8자 이상) */
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  code: string;
  redirectUri: string;
}

/** 회원가입·로그인 공통 응답. refreshToken은 httpOnly 쿠키로 내려온다. */
export interface AuthTokenResponse {
  accessToken: string;
}

export function signup(body: SignupRequest) {
  return apiFetch<AuthTokenResponse>('/auths/signup', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function login(body: LoginRequest) {
  return apiFetch<AuthTokenResponse>('/auths/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function loginWithGoogle(body: GoogleLoginRequest) {
  return apiFetch<AuthTokenResponse>('/auths/google', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getMe() {
  return apiFetch<MeResponse>('/auths/me');
}

export interface RegisterTossAccountRequest {
  apiKey: string;
  secretKey: string;
}

export interface TossAccountStatus {
  connected: boolean;
  connectedAt: string;
}

/** POST /users/me/toss-account — JWT 필요. 키 값은 응답에 내려오지 않는다. */
export function registerTossAccount(body: RegisterTossAccountRequest) {
  return apiFetch<TossAccountStatus>('/users/me/toss-account', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** access token을 저장한 뒤 GET /auths/me로 세션 사용자를 채운다. */
export async function persistAuthSession(
  accessToken: string,
  fallback?: Pick<SessionUser, 'email' | 'name'>,
): Promise<SessionUser> {
  writeAccessToken(accessToken);

  try {
    const me = await getMe();
    const user: SessionUser = {
      id: me.id,
      email: me.email || fallback?.email || '',
      name: me.name || fallback?.name || me.email,
      tossApiConnected: me.tossApiConnected === true,
    };
    writeSessionUser(user);
    return user;
  } catch {
    const user: SessionUser = {
      id: 0,
      email: fallback?.email ?? '',
      name: fallback?.name ?? fallback?.email ?? '',
      tossApiConnected: false,
    };
    writeSessionUser(user);
    return user;
  }
}
