// src/lib/googleAuth.ts
// Google OAuth 2.0 Authorization Code Flow (프론트 주도)
// API 통신은 src/lib/api.ts의 apiFetch를 재사용하므로 BASE_URL을 여기서 다루지 않는다.

const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const STATE_KEY = 'google_oauth_state';

/**
 * 콜백 경로. app.tsx의 pathname 분기, Google Console의 승인된 리디렉션 URI,
 * .env의 VITE_GOOGLE_REDIRECT_URI 세 곳이 이 값을 공유한다.
 *
 * AI/개발자 주의: 라우터 도입 시 이 상수를 라우트 정의에 그대로 넘기면 되고,
 * 값 자체는 Google Console 설정과 묶여 있으므로 임의로 바꾸지 않는다.
 */
export const GOOGLE_CALLBACK_PATH = '/auth/google/callback';

// Google Cloud Console의 "승인된 리디렉션 URI"와 문자열이 정확히 일치해야 한다.
export const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI ??
  `${window.location.origin}${GOOGLE_CALLBACK_PATH}`;

/** CSRF 방지용 state 생성 후 sessionStorage에 저장 */
function issueState(): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);
  return state;
}

/** 콜백에서 state를 꺼내고 즉시 제거(1회용) */
export function popStoredState(): string | null {
  const state = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return state;
}

/** 로그인/서비스 이용 등록 → Google 동의 화면으로 이동 */
export function redirectToGoogle(): void {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('VITE_GOOGLE_CLIENT_ID가 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    state: issueState(),
    prompt: 'select_account',
    access_type: 'offline', // 백엔드에서 refresh token이 필요하면 유지
  });

  // 외부 도메인 이동이므로 navigation.ts의 navigate()가 아니라 브라우저 이동을 쓴다.
  window.location.href = `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}
