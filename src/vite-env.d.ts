/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** NestJS 백엔드 API 주소. 비워두면 dev 프록시의 `/api`를 사용합니다. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
