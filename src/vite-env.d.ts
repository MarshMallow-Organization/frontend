/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** NestJS 백엔드 API 주소. 비워두면 dev 프록시의 `/api`를 사용합니다. */
  readonly VITE_API_URL?: string;
  /** Google OAuth 클라이언트 ID. Google Cloud Console에서 발급합니다. */
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  /** Google OAuth 리디렉션 URI. Console의 승인된 리디렉션 URI와 일치해야 합니다. */
  readonly VITE_GOOGLE_REDIRECT_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
