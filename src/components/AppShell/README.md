# AppShell

로그인 이후 공통 셸. Figma `545:2232` 기준 상단 크롬(로고·홈·탭·검색·메뉴·아바타) + 콘텐츠 패널.
페이지는 패널 안쪽 콘텐츠만 자식으로 넣는다.

## Import

```tsx
import { AppShell } from '../components/AppShell';
```

## Props

| prop                         | 타입                                                        | 설명                                   |
| ---------------------------- | ----------------------------------------------------------- | -------------------------------------- |
| `activeNav`                  | `'watchlist' \| 'popular' \| 'account' \| 'journal'` (선택) | 현재 기본 탭 하이라이트                |
| `currentPageLabel`           | `string` (선택)                                             | 기본 탭 오른쪽에 표시할 세부 화면 이름 |
| `children`                   | `ReactNode`                                                 | 네모 패널 안 페이지 UI                 |
| `appBackgroundColor`         | `string` (선택)                                             | Figma 프레임별 외곽 배경색 보정        |
| `pageSx` / `panelSx`         | MUI style object (선택)                                     | 페이지·패널의 화면별 레이아웃 보정     |
| `navMarginLeft` / `navWidth` | `string \| number` (선택)                                   | 상단 탭의 화면별 위치·너비 보정        |
| `hideMenuIcon`               | `boolean` (선택)                                            | 메뉴 자리를 유지하고 글리프만 숨김     |

## 예시

```tsx
export default function TradeJournalPage() {
  return (
    <AppShell activeNav="journal">{/* 필터 / 리스트 / 상세 등 */}</AppShell>
  );
}
```

뉴스처럼 기본 탭 바깥의 세부 화면은 별도 라벨을 사용한다.

```tsx
<AppShell currentPageLabel="뉴스 상세보기">{/* 뉴스 콘텐츠 */}</AppShell>
```

현재 실제 페이지가 연결된 탭은 인기종목(`/news/popular`), 내 계좌(`/account`), 매매일지(`/journal`)다. 관심종목 탭은 해당 페이지가 추가될 때 공통 내비게이션 경로를 연결한다. 홈 버튼은 `/home`으로 이동한다.

우측 아바타는 접근 가능한 프로필 메뉴 버튼이다. 메뉴는 Google 로그인 콜백이 localStorage에 저장한 사용자 정보를 표시하고 `/my-page` 이동과 임시 로그아웃을 제공한다. 저장된 사용자가 없으면 명시적인 mock 사용자를 표시한다. 로그아웃은 서버 API가 생기기 전까지 localStorage의 사용자와 access token만 제거한다.

마이페이지는 기본 탭을 선택하지 않고 다음과 같이 별도 라벨을 사용한다.

```tsx
<AppShell currentPageLabel="마이페이지">{/* 마이페이지 카드 */}</AppShell>
```
