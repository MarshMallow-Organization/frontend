# Routing Architecture

> 상태: temporary-active  
> 최종 확인: 2026-08-27  
> 근거: `src/app.tsx`, `src/lib/navigation.ts`, `src/components/AppShell/AppShell.tsx`

현재 라우팅은 정식 라우터 도입 전의 변경 가능한 경량 구현이다. 경로 문자열을 영구 API로 간주하지 않는다.

## 현재 책임

| 파일                                   | 책임                                                      |
| -------------------------------------- | --------------------------------------------------------- |
| `src/app.tsx`                          | pathname/hash를 읽어 페이지를 선택하고 이동 이벤트를 구독 |
| `src/lib/navigation.ts`                | History API 이동과 `app:navigate` 이벤트 발행             |
| `src/components/AppShell/AppShell.tsx` | 공통 탭의 임시 경로와 활성 상태                           |
| `src/components/AppShell/README.md`    | AppShell 사용 계약과 현재 연결 경로                       |

## 현재 경로

| 경로                                     | 화면            | 비고                                                                 |
| ---------------------------------------- | --------------- | -------------------------------------------------------------------- |
| `/` 및 그 외 기본 경로                   | 로그인          | 세션이 있으면 `/home`으로 이동할 수 있음                 |
| `/signup`                                | 회원가입        | 성공 시 `/register-key`                                  |
| `/register-key`                          | 토스 API Key 등록 | `/api-key`는 Vite `/api` 프록시에 걸려 쓰지 않음. 저장 API는 후속 |
| `/auth/google/callback`                  | Google 콜백     | 백엔드 교환 API는 후속. 이메일은 `/`                     |
| `/news*`                                 | 뉴스            | 인기종목 탭은 `/news/popular`                                        |
| `/journal`, `/trade-journal`, `#journal` | 매매일지        | 이전 경로 alias 포함                                                 |
| `/home`, `#home`                         | 홈              | 로그인·키 등록 완료 도착지                                           |
| `/account`, `#account`                   | 내 계좌         | hash는 이전 주소 alias                                               |
| `/stock`, `#stock`                       | 종목 상세       |                                                                      |
| `#preview`                               | 컴포넌트 프리뷰 | 개발자용                                                             |
| `#verify=<key>`                          | 컴포넌트 검증   | 개발자용                                                             |

관심종목 탭은 실제 페이지가 없어 비활성 상태다. 내 계좌 탭은 `/account`로 이동한다.

## 변경 규칙

- 경로 변경 시 위 네 파일과 연결된 문서를 함께 확인한다.
- 같은 문자열을 새 호출부에 흩뿌리지 말고 공통 이동 함수를 사용한다.
- 공유된 이전 URL을 유지해야 하면 alias를 남긴다.
- 없는 페이지를 임의의 다른 화면으로 연결하지 않는다.
- 마이페이지 경로가 확정되기 전에는 아바타 이동을 추측해 구현하지 않는다.

## 정식 라우터 도입 시 보존할 동작

- 직접 URL 접근과 새로고침
- 브라우저 뒤로/앞으로
- 필요한 이전 URL alias
- `#preview`, `#verify` 개발 경로 또는 동등한 대체 수단
- 존재하지 않는 경로의 명시적 처리
- AppShell 탭 활성 상태와 접근성

정식 라우터 도입은 여러 중첩 화면, URL 파라미터, 인증 가드 등 현재 구현의 복잡도가 실제로 커졌을 때 별도 실행 계획으로 진행한다.
