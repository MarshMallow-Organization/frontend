# Frontend Coding Convention

> 상태: active  
> 대상: 프런트엔드 개발자와 AI 에이전트  
> 최종 확인: 2026-08-19  
> 근거: `package.json`, `tsconfig.app.json`, `src/`

이 문서는 자주 바뀌지 않는 코딩 규칙만 정의한다. 구조, 라우팅, API 계약, 검증 절차는 [`docs/README.md`](./README.md)에서 해당 문서를 찾아 읽는다.

## 1. 적용 우선순위

1. 사용자의 현재 요청과 확정된 제품/API 명세
2. 실제 코드와 설정
3. 이 문서와 기능별 문서
4. 아직 구현되지 않은 제안과 예시

문서와 코드가 다르면 추측하지 않는다. 실제 동작을 확인하고 의도된 변경이면 문서도 함께 갱신한다. 기존 작업 트리의 무관한 변경은 수정하거나 되돌리지 않는다.

## 2. 현재 기술 기준

- Yarn 4, React 19, TypeScript 6, Vite 8
- MUI 9, Emotion/MUI `sx`, Tailwind CSS 4
- Zustand 5, date-fns
- TypeScript `strict`, ESLint, Prettier

개발 서버는 `yarn dev`다. 프런트에는 `start:dev` 스크립트가 없다. 전체 명령과 비수정 검사 방법은 [`harness/verification.md`](./harness/verification.md)를 따른다.

## 3. 파일 배치

```text
src/
├── assets/       # 저장소에 포함하는 이미지와 아이콘
├── components/   # 둘 이상의 기능에서 재사용되는 공용 UI
├── features/     # 기능별 API, 변환 로직, 기능 공유 타입
├── hooks/        # 여러 컴포넌트에서 재사용되는 hook
├── lib/          # 도메인 비종속 기반 코드
├── pages/        # 라우트 화면과 페이지 전용 구성 요소
├── stores/       # 여러 화면에서 공유되는 Zustand 상태
├── theme/        # 전역 디자인 토큰과 테마
└── types/        # 여러 기능에서 공유되는 타입
```

- 한 페이지에서만 쓰는 UI는 `pages/<page>/components`에 둔다.
- 실제 재사용이 확인된 UI만 `src/components`로 올린다.
- 도메인 API와 서버 응답 타입은 `features/<domain>`에 둔다.
- 서버 DTO와 화면 모델이 다르면 변환 함수를 분리한다.
- 빈 폴더와 미래를 위한 추상화는 미리 만들지 않는다.
- 자세한 의존성 방향은 [`architecture/frontend.md`](./architecture/frontend.md)를 따른다.

## 4. React와 TypeScript

- 컴포넌트와 공개 타입에는 역할이 드러나는 이름을 쓴다.
- 페이지 기본 export는 `<Feature>Page` 형식을 권장한다.
- props, API 응답, 상태에 명시적 타입을 사용한다.
- `any` 대신 `unknown`을 쓰고 경계에서 타입을 좁힌다.
- 타입 전용 import에는 `import type`을 사용한다.
- 렌더링 중 네트워크 요청, history 변경, 상태 변경을 실행하지 않는다.
- 목록 key는 안정적인 서버 ID를 우선한다.
- 파생 값을 상태로 중복 저장하지 않는다.
- 비동기 코드는 로딩, 빈 결과, 오류, 늦은 응답을 고려한다.
- `void promise`는 기다리지 않을 의도가 분명하고 실패 처리가 있을 때만 사용한다.

## 5. 상태 소유권

1. 한 컴포넌트에서만 필요하면 `useState` 또는 `useReducer`
2. 가까운 자식과 공유하면 가장 가까운 공통 부모
3. 서버 데이터는 기능 API 계층에서 조회하고 페이지가 상태를 소유
4. 여러 라우트가 지속적으로 공유하는 클라이언트 상태만 Zustand

Zustand를 단순 props 전달 회피나 서버 캐시 대용으로 사용하지 않는다. 상세 예시는 [`references/zustand.md`](./references/zustand.md)를 참고한다.

## 6. UI와 스타일

- 로그인 이후 공통 헤더와 외부 패널은 `src/components/AppShell`을 재사용한다.
- 페이지는 `AppShell`의 `children`에 패널 내부 UI만 제공한다.
- 색상과 글꼴은 `src/theme/tokens.ts`를 먼저 확인한다.
- MUI 컴포넌트 확장은 `sx`를 우선한다.
- 한 속성을 `sx`, Tailwind, inline style로 중복 제어하지 않는다.
- Figma의 임시 asset URL을 커밋하지 않는다.
- 공용 컴포넌트 변경은 모든 사용 화면의 영향을 확인한다.

## 7. 접근성 기본선

- 동작은 `button`이나 의미 있는 링크로 구현한다.
- 아이콘 단독 버튼에는 `aria-label`을 제공한다.
- 현재 탭에는 `aria-current="page"` 또는 동등한 선택 상태를 제공한다.
- 이미지에는 목적에 맞는 `alt`를 쓰고 장식 이미지는 빈 `alt`를 사용한다.
- 키보드 포커스를 제거하지 않고 색상만으로 상태를 표현하지 않는다.

## 8. 환경과 보안

- 브라우저에 노출 가능한 변수만 `VITE_` 접두사를 사용한다.
- secret, private token, DB 정보는 프런트 환경변수에 넣지 않는다.
- 새 환경변수를 추가하면 실제 비밀값이 없는 `.env.example`도 갱신한다.
- 민감한 body, 인증 값, 개인정보를 콘솔에 출력하지 않는다.
- 목업과 실제 API는 같은 타입을 사용하고 목업 여부를 명시한다.

## 9. 변경 원칙

- 기존 공용 컴포넌트, 토큰, API 래퍼를 먼저 탐색한다.
- 새 패키지, 라우터, 상태 도구는 요청이나 팀 결정 없이 추가하지 않는다.
- 임시 경로, 목업, 추정 API를 영구 계약처럼 만들지 않는다.
- 새 패턴을 만들면 가장 가까운 README나 이 문서 지도에 연결한다.
- 완료 전 [`harness/verification.md`](./harness/verification.md)의 위험도별 검증을 실행한다.
