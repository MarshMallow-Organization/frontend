# Backend API Contract

> 상태: active-with-known-gap  
> 최종 확인: 2026-08-19  
> 근거: `../backend/src/docs/common-response.md`, `../backend/src/docs/swagger-api.md`, `../backend/src/domains/domain.md`, `src/lib/api.ts`

API 구현 전에는 실행 중인 백엔드의 Swagger UI(`/swagger`) 또는 OpenAPI JSON(`/swagger-json`)과 관련 DTO를 확인한다. 이 문서는 공통 규칙의 요약이며 실제 Swagger가 최종 계약이다.

## 응답 형태

정상 응답은 전역 인터셉터가 감싼다.

```ts
export type ApiResponse<T> = {
  data: T;
};
```

오류 응답은 `data`로 감싸지지 않는다.

```ts
export type ApiErrorResponse = {
  code: string;
  message: string;
  traceId: string;
};
```

- `code`: UI 분기와 오류 유형 판별
- `message`: 사용자에게 노출 가능한 서버 메시지
- `traceId`: 서버 로그 추적과 문의
- 같은 추적 ID가 `x-request-id` 응답 헤더에 포함될 수 있음

`code`와 `traceId`를 문자열 오류 하나로 축약해 버리지 않는다. 내부 stack, query, token은 사용자에게 표시하지 않는다.

## 프런트 호출 규칙

- 컴포넌트와 store에서 `fetch`를 직접 호출하지 않는다.
- 공통 전송은 `src/lib/api.ts`, 도메인 URL과 타입은 `src/features/<domain>`에서 관리한다.
- HTTP 상태와 서버 `code`를 함께 사용해 실패를 구분한다.
- `204`, 비 JSON 응답, 요청 취소, 네트워크 단절을 고려한다.
- 인증이 확정되면 쿠키/토큰 처리는 공통 API 계층에 둔다.
- 서버 DTO와 화면 모델이 다르면 명시적 변환 함수를 둔다.

## 현재 알려진 간극

현재 `src/lib/api.ts`는 HTTP 성공 body를 그대로 반환하며 `{ data: T }`를 자동으로 풀지 않는다. 오류에서도 `status`와 생성한 메시지만 보존하고 서버의 `code`, `message`, `traceId`를 보존하지 않는다. 이 동작을 개선하기 전까지 호출부는 실제 응답 형태를 확인해야 하며, 개선 작업은 [`../exec-plans/tech-debt.md`](../exec-plans/tech-debt.md)에 추적한다.

## 페이지네이션·필터 공통 기준

- `page`: 0부터 시작, 기본값 0
- `size`: 기본값 10, 허용 범위 1~20
- 날짜 목록과 기간 조건은 동시에 사용하지 않음
- 시작일은 종료일보다 늦을 수 없음
- 빈 결과는 빈 `items`와 0인 합계/페이지 정보를 사용

화면이 1부터 표시되면 API 경계에서 0-based 값으로 변환한다. 도메인마다 계약이 다르면 Swagger가 우선한다.

## 도메인 지도

| API 경로   | 책임                 |
| ---------- | -------------------- |
| `/auths`   | 로그인·회원가입·인증 |
| `/orders`  | 매수·매도 주문       |
| `/trades`  | 체결 내역            |
| `/markets` | 종목 조회·숨김       |
| `/assets`  | 자산 현황·숨김       |
| `/users`   | 사용자·관심 종목     |
| `/diaries` | 투자 일지 CRUD       |
| `/ai-chat` | AI 채팅              |

새 도메인 이름이나 필드를 추측하기 전에 백엔드 경로, DTO, Swagger를 확인한다.
