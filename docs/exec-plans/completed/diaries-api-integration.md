# Diaries API Integration

> 상태: completed
> 기간: 2026-08-21
> 근거: `/swagger`, `../backend/src/domains/diaries`, `../backend/src/domains/trades`, `src/features/diaries`, `src/pages/trade-journal`

## 문제와 완료 조건

매매일지 화면이 목업 배열에서만 동작했다. 화면을 실제 `/diaries` API에 연결하고, 작성 가능한 체결 주문은 `/trades`와 `/diaries/prefill`을 조합해 표시한다. 조회·상세·자동채우기·생성·수정·삭제가 공통 API 계층을 사용하고 로딩·오류 상태를 제공하면 완료한다.

## 완료 범위

- Diaries/Trades DTO와 API 함수
- 서버 DTO와 화면 모델 변환
- 목록 전체 페이지 조회, 상세 지연 조회, CRUD와 prefill 연결
- 요청 중 중복 동작 방지와 사용자 오류 표시
- 사용하지 않는 매매일지 목업 데이터 제거

## 비범위

- 백엔드 스키마와 데이터 생성
- 새 라이브러리, 전역 서버 캐시, 정식 라우터
- 서버에 없는 회사·날짜 facet API

## 구현·검증

- [x] API 타입, 쿼리 직렬화, DTO 변환을 `src/features/diaries`에 구현
- [x] 화면 목업 상태를 서버 조회 상태로 교체
- [x] 상세·자동채우기·생성·수정·삭제 연결
- [x] 로딩·빈 결과·오류·중복 요청 상태 반영
- [x] 타입, ESLint, Prettier, 빌드, API 입출력 시나리오 검증

검증 결과:

- ESLint, `tsc -b`, Prettier, `git diff --check` 통과
- 프로덕션 빌드 통과. 기존 500 kB 초과 chunk 경고는 유지
- API 응답·매핑·페이지 순회·CRUD body 13개 시나리오 통과
- 개발 서버 프록시에서 `/api/diaries`, `/api/trades` 200 응답 확인

## 결정 기록

- `/diaries`는 작성된 일기만 반환하므로 `/trades`의 고유 `ordersId`를 작성 후보로 사용한다.
- 화면 키는 `orderId`로 유지하고 `diaryId`를 별도 필드로 둔다.
- 별도 facet API가 없으므로 현재는 모든 diary/trade 페이지를 조회한 뒤 회사·날짜 필터를 화면에서 적용한다.
- 로컬 스텁 인증은 백엔드 기본 사용자 1을 사용하며 프런트에서 전용 헤더를 강제하지 않는다.
- 저장 성공 후 상세 재조회만 실패하면 POST를 반복하지 않고 목록을 새로 불러온다.

## 남은 백엔드 제약

- BUY 상세 응답에 `customGoalHoldPeriod`가 없어 기존 CUSTOM 값은 완전히 복원할 수 없다.
- 회사·날짜 facet API가 없어 목록 전체 페이지를 읽어야 한다.
- 현재 로컬 사용자 1의 diaries와 trades 데이터가 모두 비어 있어 실제 데이터 기반 CRUD 수동 조작은 수행하지 않았다.

## 롤백

기능 API와 페이지 연결 변경을 되돌리고 Git에서 제거된 `mock-data.ts`를 복원하면 기존 목업 화면으로 돌아갈 수 있다. 이번 작업은 백엔드 데이터를 변경하지 않았다.
