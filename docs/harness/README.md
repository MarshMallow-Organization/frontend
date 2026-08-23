# Frontend Engineering Harness

> 상태: active-direction  
> 최종 확인: 2026-08-19

하네스는 AI가 코드를 더 많이 쓰게 하는 프롬프트가 아니라, 저장소를 읽기 쉽고 실행·검증 가능하게 만들어 잘못된 변경이 빠르게 드러나도록 하는 환경이다. 사람은 목표와 제약을 정하고, 에이전트는 작은 변경을 만들며, 자동 검사와 브라우저 증거가 다음 결정을 안내한다.

## 이 저장소의 구성

```text
AGENTS.md                 짧은 입구와 문서 라우터
docs/                     구조화된 장기 지식
package.json / CI         실행 가능한 검사
src/**/README.md          코드에 가까운 사용 계약
tests / browser evidence  회귀를 잡는 피드백(도입 예정 포함)
exec-plans                복잡한 작업의 진행 기록
```

## 목표 루프

1. `AGENTS.md`와 문서 지도로 필요한 맥락만 읽는다.
2. 코드·설정·백엔드 계약으로 현재 사실을 확인한다.
3. 되돌리기 쉬운 작은 변경을 만든다.
4. 정적 검사, 테스트, 빌드, 브라우저 확인을 위험도에 맞게 실행한다.
5. 실패 원인과 새 지식을 코드, 테스트, 가까운 문서에 되돌려 넣는다.
6. 검증 결과와 남은 불확실성을 인계한다.

## 운영 기준

- `AGENTS.md`는 백과사전이 아니라 목차로 유지한다.
- 현재 규칙과 미래 제안을 분리한다.
- 문서의 핵심 제약은 가능한 한 lint, 타입, 테스트, CI로 옮긴다.
- UI 작업은 빌드 성공뿐 아니라 실제 브라우저 상태를 증거로 남긴다.
- 에이전트가 반복해서 틀리는 지점은 프롬프트보다 하네스를 개선한다.
- 장기 작업은 실행 계획에 결정, 진행, 검증, 남은 위험을 기록한다.

실행할 검사는 [`verification.md`](./verification.md), 지켜야 할 원칙은 [`golden-principles.md`](./golden-principles.md), 자동화 도입 순서는 [`roadmap.md`](./roadmap.md)를 따른다.

## 참고 자료

- [OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- [OpenAI Cookbook: Codex for software engineering](https://cookbook.openai.com/examples/codex/codex_for_software_engineering)
- [OpenAI Codex docs: AGENTS.md](https://developers.openai.com/codex/guides/agents-md/)
