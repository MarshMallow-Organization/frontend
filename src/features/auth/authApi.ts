import { apiFetch } from '../../lib/api';

/** POST /auths/signup 요청 바디 (backend SignupDto 기준: password는 8자 이상) */
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
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

/**
 * Google OAuth 시작 지점.
 *
 * apiFetch가 아니라 전체 페이지 이동이 필요해 BASE_URL을 여기서 다시 계산한다.
 * (lib/api.ts의 BASE_URL은 export되어 있지 않다.)
 *
 * 주의: 백엔드 auth 컨트롤러는 `@Controller('auths')`이고 아직 Google 핸들러가
 * 없다. 실제 경로가 정해지면 이 상수만 고치면 로그인·회원가입에 함께 반영된다.
 */
const API_BASE = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '');
const GOOGLE_OAUTH_URL = `${API_BASE}/auth/google`;

export function startGoogleOAuth() {
  window.location.href = GOOGLE_OAUTH_URL;
}
