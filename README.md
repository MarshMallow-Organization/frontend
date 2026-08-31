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
# Prettier 포맷 적용(파일 수정)
yarn format

# ESLint 검사 및 자동 수정(파일 수정)
yarn lint
```

검사만 수행하는 비수정 명령과 변경 위험도별 검증 기준은 [`docs/harness/verification.md`](./docs/harness/verification.md)를 참고한다.

## 개발 문서와 AI 하네스

- 문서 지도: [`docs/README.md`](./docs/README.md)
- 코딩 규칙: [`docs/convention.md`](./docs/convention.md)
- AI 에이전트 진입점: [`AGENTS.md`](./AGENTS.md)
- 하네스 운영·도입 계획: [`docs/harness/README.md`](./docs/harness/README.md)

기능을 변경할 때는 실제 코드와 가장 가까운 README를 먼저 확인하고, 계약이 바뀌면 관련 문서도 같은 변경에서 갱신한다.
