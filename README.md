# Marshmallow Frontend

Vite + React + TypeScript 기반의 SPA 프론트엔드입니다. 백엔드(`../backend`, NestJS)와
컨벤션(Prettier, ESLint, kebab-case 파일명)을 공유합니다.

## 요구 사항

- Node.js 20 이상
- Yarn 4 (`corepack enable`로 활성화, `packageManager` 필드에 고정)

## 프로젝트 설정

```bash
corepack enable   # 최초 1회, Yarn 활성화
yarn install
```

## 환경 변수

`.env.example`을 복사해 `.env`를 만든 뒤 값을 채워주세요.

```bash
cp .env.example .env
```

- `VITE_API_URL` — 백엔드 API 주소. 개발 중에는 비워두면 dev 서버 프록시(`/api` → `http://localhost:3000`)를 사용합니다.

## 실행 및 빌드

```bash
# 개발 서버 (HMR)
yarn dev

# 프로덕션 빌드 (타입 체크 + 번들)
yarn build

# 빌드 결과 미리보기
yarn preview
```

## 코드 스타일

```bash
# Prettier 포맷 적용
yarn format

# ESLint 검사 및 자동 수정
yarn lint
```

## 폴더 구조

```
src/
  components/   재사용 UI 컴포넌트
  hooks/        커스텀 훅 (use-*.ts)
  lib/          API 래퍼 등 공용 유틸 (api.ts)
  pages/        페이지 단위 컴포넌트
  types/        공용 타입 정의
```

## 백엔드 연동

개발 시 백엔드를 먼저 실행해야 API 프록시가 동작합니다.

```bash
cd ../backend && yarn start:dev   # http://localhost:3000
```

프론트엔드에서는 `src/lib/api.ts`의 `apiFetch<T>()`로 백엔드를 호출합니다.
