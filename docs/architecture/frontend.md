# Frontend Architecture

> 상태: active  
> 최종 확인: 2026-08-19  
> 근거: `src/`, `src/components/README.md`

## 의존성 방향

```text
app / pages
    ↓
features / page components / hooks / stores
    ↓
components / lib / theme / shared types / assets
```

위쪽 계층은 아래쪽 계층을 조합할 수 있다. 아래쪽 공용 계층은 특정 페이지를 import하지 않는다. 순환 참조나 페이지 간 직접 import 대신 공용 책임을 가장 가까운 하위 계층으로 추출한다.

## 계층별 책임

| 위치             | 책임                                           | 넣지 않는 것            |
| ---------------- | ---------------------------------------------- | ----------------------- |
| `src/app.tsx`    | 앱 진입과 현재 경량 라우트 선택                | 페이지 비즈니스 로직    |
| `src/pages`      | 라우트 단위 조합, 페이지 전용 상태와 UI        | 다른 페이지의 전용 구현 |
| `src/features`   | 도메인 API, DTO/화면 모델 변환, 기능 공유 로직 | 전역 레이아웃           |
| `src/components` | 검증된 공용 UI와 AppShell                      | 특정 페이지 API와 문구  |
| `src/hooks`      | 여러 컴포넌트가 공유하는 React 동작            | 단일 화면 전용 hook     |
| `src/stores`     | 여러 라우트가 공유하는 클라이언트 상태         | 서버 데이터 전체 캐시   |
| `src/lib`        | 도메인 비종속 API·내비게이션 기반 코드         | 페이지 UI               |
| `src/theme`      | 공통 토큰과 테마                               | 페이지 한정 색상        |
| `src/types`      | 여러 도메인이 공유하는 타입                    | 단일 기능 DTO           |

## AppShell 경계

`src/components/AppShell`은 로그인 이후 화면의 공통 상단 크롬과 외부 콘텐츠 패널을 소유한다. 페이지는 로고, 홈, 주요 탭, 검색, 메뉴, 프로필 아이콘을 복제하지 않고 패널 내부만 렌더링한다.

AppShell 변경은 뉴스와 매매일지 등 모든 사용 페이지에 영향을 준다. 페이지 전용 조회, 폼, 다이얼로그 상태는 AppShell로 올리지 않는다.

## 새 코드의 배치 질문

1. 한 페이지에만 필요한가? 해당 페이지 아래에 둔다.
2. 같은 도메인의 여러 화면이 공유하는가? `features/<domain>`을 검토한다.
3. 도메인과 무관한 UI 또는 기반 코드인가? `components`나 `lib`을 검토한다.
4. 실제 사용처가 둘 이상인가? 아니라면 공용 추상화를 미룬다.
5. 새 의존성이 위 방향을 거슬러 올라가는가? 책임을 다시 나눈다.
