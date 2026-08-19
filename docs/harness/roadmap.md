# Harness Improvement Roadmap

> 상태: active-backlog  
> 최종 확인: 2026-08-19

체크된 항목은 저장소에서 실제로 확인한 상태만 의미한다. 제안을 완료된 기능처럼 문서화하지 않는다.

## 현재 기반

- [x] 짧은 `AGENTS.md`와 문서 지도
- [x] 규칙·아키텍처·계약·검증·제품 문서 분리
- [x] 코드 가까이의 공용 컴포넌트 README
- [x] ESLint CI
- [ ] 비수정 통합 검사 명령
- [ ] 자동 테스트와 브라우저 검증

## P0: 반복 가능한 정적 검증

- [ ] `format:check`, `lint:check`, `typecheck`, `check` 스크립트 추가
- [ ] CI에서 `yarn check`와 `yarn build` 실행
- [ ] Markdown 포맷과 로컬 링크 검사 자동화
- [ ] `.env.example`에 지원하는 `VITE_*` 키와 안전한 기본값 기록
- [ ] `src/lib/api.ts`에서 `{ data: T }` unwrap과 `code/message/traceId` 보존

첫 자동화 PR은 동작 변경 없이 스크립트와 CI만 다루고, 로컬과 CI가 같은 명령을 실행하게 한다.

## P1: 로직 회귀 방지

- [ ] Vitest와 React Testing Library 도입
- [ ] API 래퍼의 성공·오류 계약 테스트
- [ ] 필터, 페이지네이션, 날짜 변환 순수 함수 테스트
- [ ] AppShell과 주요 화면 접근성 smoke test
- [ ] 직접 URL과 뒤로/앞으로 라우팅 테스트

## P2: UI·통합 피드백

- [ ] Playwright 핵심 사용자 흐름
- [ ] Mock Service Worker로 성공·빈 결과·4xx·5xx·지연 재현
- [ ] Figma 기준 시각 회귀 테스트
- [ ] 브라우저 콘솔 오류를 실패로 처리
- [ ] 실제 오류 수집과 백엔드 `traceId` 연결

## P3: 지속 운영

- [ ] 실행 계획의 active/completed 정리 자동화
- [ ] 문서 최종 확인일과 끊어진 링크 점검
- [ ] 번들 크기 예산과 Vite chunk 경고 기준
- [ ] 반복 실패 유형과 평균 수정 루프 측정
- [ ] 사용되지 않는 코드·문서·의존성 정기 정리

## 효과 지표

- 로컬 `check`와 CI 결과가 달라지는 횟수
- 첫 시도에 통과한 변경 비율
- 동일 유형 회귀의 반복 횟수
- UI 변경에서 브라우저 증거가 남은 비율
- 문서와 실제 코드의 불일치 발견 건수와 해결 시간

구체적인 미해결 항목과 영향은 [`../exec-plans/tech-debt.md`](../exec-plans/tech-debt.md)에서 추적한다.
