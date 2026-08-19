# Frontend Agent Entry Point

이 파일은 규칙 전문이 아니라 문서 지도다. 작업 전에는 `docs/README.md`에서 필요한 문서를 선택해 읽는다.

## 항상 읽기

- 코딩 규칙: `docs/convention.md`
- 검증과 완료 기준: `docs/harness/verification.md`
- 변경 대상과 가장 가까운 README 및 실제 코드

## 작업별 읽기

- 폴더 경계·의존성: `docs/architecture/frontend.md`
- URL·내비게이션: `docs/architecture/routing.md`
- 백엔드 연동: `docs/contracts/backend-api.md`
- AppShell·마이페이지: `docs/product-specs/mypage.md`
- Zustand: `docs/references/zustand.md`
- 하네스 개선: `docs/harness/README.md`, `docs/harness/roadmap.md`
- 여러 단계의 고위험 작업: `docs/exec-plans/README.md`

## 필수 원칙

- 사용자 요청과 무관한 기존 변경을 수정하거나 되돌리지 않는다.
- 공용 UI, 디자인 토큰, API 래퍼를 먼저 재사용한다.
- 새 의존성이나 정식 라우터를 사용자 요청 없이 도입하지 않는다.
- 실행하지 않은 검증을 성공한 것처럼 보고하지 않는다.
- 프런트 개발 서버는 `yarn dev`로 실행한다. `yarn start:dev`는 이 저장소에 없다.
- 코드와 문서가 다르면 실제 동작을 확인하고 관련 문서를 함께 갱신한다.
