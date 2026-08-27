# Backend API Contract

> 상태: active-with-known-gap
> 최종 확인: 2026-08-26
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

## 공통 래퍼 동작

`src/lib/api.ts`는 정상 응답의 `{ data: T }`를 풀어서 `T`를 반환한다. access token이 있으면 Bearer 헤더를 추가하고 `credentials: 'include'`를 기본값으로 사용한다. 오류에서는 HTTP `status`와 서버의 `code`, `message`, `traceId`를 `ApiError`에 보존한다. `204`, 비 JSON 응답, 잘못된 JSON, 요청 취소, 네트워크 단절도 공통 계층에서 구분한다.

백엔드 `dev`의 일부 API는 아직 `StubAuthGuard`를 사용한다. 로컬 개발 빌드에서는 공통 래퍼가 세션의 양의 정수 사용자 ID를 `x-stub-user-id`로 전달하고, 세션이 없거나 ID가 잘못됐으면 테스트용 기본 사용자 `1`을 사용한다. 따라서 새 브라우저에서도 로그인 없이 개발 기능을 검증할 수 있다. 운영 빌드에는 이 스텁 헤더를 추가하지 않으며, 실제 인증은 백엔드 JWT guard 전환이 필요하다.

도메인별로 Swagger에 없는 필드를 DTO에 추측해 넣지 않는다. 마이페이지의 현재 API/샘플 경계는 [`../product-specs/mypage-data-sources.md`](../product-specs/mypage-data-sources.md)에 기록한다.

## 페이지네이션·필터 공통 기준

- `page`: 0부터 시작, 기본값 0
- `size`: 기본값 10, 허용 범위 1~20
- 날짜 목록과 기간 조건은 동시에 사용하지 않음
- 시작일은 종료일보다 늦을 수 없음
- 빈 결과는 빈 `items`와 0인 합계/페이지 정보를 사용

화면이 1부터 표시되면 API 경계에서 0-based 값으로 변환한다. 도메인마다 계약이 다르면 Swagger가 우선한다.

## Diaries 화면 연결

- 작성된 일기는 `/diaries`의 모든 페이지를 조회한다.
- 작성 가능한 체결 주문은 `/trades`의 모든 페이지에서 고유 `ordersId`를 모으고, 이미 일기가 있는 `orderId`를 제외해 구성한다.
- 목록 항목을 선택하면 작성된 일기는 `/diaries/:diaryId`, 미작성 주문은 `/diaries/prefill?orderId=`로 상세 정보를 채운다.
- 작성 다이얼로그의 자동 채우기는 저장 전 서버 값을 복원하는 동작이다. 수정 중에는 `/diaries/prefill`의 거래 정보와 `/diaries/:diaryId`의 저장된 작성 내용을 함께 다시 받아 폼을 초기화한다.
- 생성·수정·삭제는 각각 `POST /diaries`, `PATCH /diaries/:diaryId`, `DELETE /diaries/:diaryId`를 사용한다.
- 서버에 회사·날짜 facet API가 없으므로 현재 화면 필터는 모두 조회한 결과에 적용한다.

BUY 상세 응답에는 현재 `customGoalHoldPeriod`가 누락되어 있다. 프런트 타입은 필드를 선택적으로 수용하지만, 기존 CUSTOM 일기의 직접 입력값을 안정적으로 수정하려면 백엔드 상세 DTO와 매핑 보완이 필요하다.

## 종목 상세 화면 연결

- 종목명·코드·숨김 상태는 `GET /stocks/:stockCode`에서 조회한다.
- 국내 6자리 종목의 관심 상태·등록·해제는 `GET/POST/DELETE /users/me/favorite-stocks` 계약을 사용한다.
- 숨김 기간 설정은 `POST /users/me/hidden-stocks`에 ISO 날짜를 전달한다. 숨김 해제 API는 아직 없다.
- 거래 팝업은 `POST /orders`에 일반/조건, 매수/매도, 시장가/지정가 선택을 전달한다.
- Swagger에 시세·차트·재무 지표 응답 필드가 없고 뉴스·AI 생성 API도 없으므로 해당 영역은 요청하지 않고 미연동 상태로 표시한다.

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
