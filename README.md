# Marshmallow Frontend

## 요구 사항

- Node.js 20 이상
- Yarn 4 (`corepack enable`로 활성화, `packageManager` 필드에 고정)

## 프로젝트 설정

```bash
corepack enable   # 최초 1회, Yarn 활성화
yarn install
```

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
