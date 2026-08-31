# Frontend Documentation Map

> 상태: active  
> 최종 확인: 2026-08-19

이 디렉터리는 프런트엔드의 장기 지식 저장소다. `AGENTS.md`에는 문서 경로만 두고, 상세 규칙과 근거는 아래 문서에서 관리한다. 한 내용을 여러 파일에 복제하지 않고 가장 가까운 원본 문서로 연결한다.

## 문서 선택표

| 작업 상황                  | 먼저 읽을 문서                                                                                                                           | 성격                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| 모든 코드 변경             | [`convention.md`](./convention.md)                                                                                                       | 안정적인 코딩 규칙           |
| 폴더 배치·의존성 결정      | [`architecture/frontend.md`](./architecture/frontend.md)                                                                                 | 현재 구조와 경계             |
| 경로·탭·뒤로가기 변경      | [`architecture/routing.md`](./architecture/routing.md)                                                                                   | 임시 라우팅 계약             |
| API·DTO·오류 처리          | [`contracts/backend-api.md`](./contracts/backend-api.md)                                                                                 | 백엔드 연동 계약             |
| 모든 변경의 검증           | [`harness/verification.md`](./harness/verification.md)                                                                                   | 실행 가능한 검사와 완료 기준 |
| 하네스의 목적·원칙         | [`harness/README.md`](./harness/README.md), [`harness/golden-principles.md`](./harness/golden-principles.md)                             | 운영 모델                    |
| 하네스 자동화 개선         | [`harness/roadmap.md`](./harness/roadmap.md)                                                                                             | 도입 순서와 현황             |
| 마이페이지·AppShell 작업   | [`product-specs/mypage.md`](./product-specs/mypage.md), [`product-specs/mypage-data-sources.md`](./product-specs/mypage-data-sources.md) | 제품·데이터 소스 경계        |
| 복잡한 작업 계획·기술 부채 | [`exec-plans/README.md`](./exec-plans/README.md), [`exec-plans/tech-debt.md`](./exec-plans/tech-debt.md)                                 | 실행 기록                    |
| Zustand 설계               | [`references/zustand.md`](./references/zustand.md)                                                                                       | 선택적 참고 자료             |

공용 컴포넌트의 사용법은 `src/components/README.md`와 각 컴포넌트 폴더 README가 원본이다. 실제 API 계약은 백엔드 Swagger와 `../backend/src/docs`가 최종 원본이다.

## 유지 규칙

- 코드 변경으로 계약이 달라지면 같은 변경에서 관련 문서를 갱신한다.
- 검증되지 않은 아이디어는 현재 규칙처럼 쓰지 않고 `roadmap.md`나 `tech-debt.md`에 둔다.
- 새 문서는 목적, 상태, 최종 확인일, 근거가 되는 코드 경로를 밝힌다.
- 오래된 문서는 방치하지 말고 갱신, 통합, 삭제 중 하나를 선택한다.
- 장문의 기능 설명을 `AGENTS.md`에 추가하지 않는다.
