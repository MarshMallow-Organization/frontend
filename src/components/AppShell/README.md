# AppShell

로그인 이후 공통 셸. Figma `545:2232` 기준 상단 크롬(로고·홈·탭·검색·메뉴·아바타) + 콘텐츠 패널.
페이지는 패널 안쪽 콘텐츠만 자식으로 넣는다.

## Import

```tsx
import { AppShell } from '../components/AppShell';
```

## Props

| prop               | 타입                                                        | 설명                                   |
| ------------------ | ----------------------------------------------------------- | -------------------------------------- |
| `activeNav`        | `'watchlist' \| 'popular' \| 'account' \| 'journal'` (선택) | 현재 기본 탭 하이라이트                |
| `currentPageLabel` | `string` (선택)                                             | 기본 탭 오른쪽에 표시할 세부 화면 이름 |
| `children`         | `ReactNode`                                                 | 네모 패널 안 페이지 UI                 |

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

현재 실제 페이지가 연결된 탭은 인기종목(`/news/popular`)과 매매일지(`/journal`)다. 나머지 탭은 해당 페이지가 추가될 때 공통 내비게이션 경로를 연결한다.
