# Features

도메인별 API 호출, 서버 응답 타입, 화면 모델 변환, 여러 페이지가 공유하는 기능 로직을 둔다. 페이지 UI와 전역 레이아웃은 이 계층에 넣지 않는다.

## 현재 기능

- `news/newsApi.ts`: 뉴스 타입, 목업 선택, 뉴스 조회 API 처리
- `diaries/`: 매매일지·체결 DTO, API 호출, 화면 모델 변환

도메인 API는 컴포넌트에서 `fetch`를 직접 호출하지 않고 `src/lib/api.ts`의 공통 래퍼를 사용한다. 백엔드 계약은 `docs/contracts/backend-api.md`를 먼저 확인한다.
