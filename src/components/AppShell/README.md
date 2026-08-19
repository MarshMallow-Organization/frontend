# AppShell

로그인 이후 공통 셸. 상단 크롬(로고·홈·탭·검색·아바타) + 네모 콘텐츠 패널.
페이지는 자식 페이지만 넣으면 된다. 탭 네비게이션 및 검색 라우터는 아직 미 구현

## Import
```tsx
import { AppShell } from '../components/AppShell';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `activeNav` | `'watchlist' \| 'popular' \| 'account' \| 'journal'` | 현재 탭 하이라이트 |
| `children` | `ReactNode` | 네모 패널 안 페이지 UI |

## 예시
```tsx
export default function TradeJournalPage() {
  return (
    <AppShell activeNav="journal">
      {/* 필터 / 리스트 / 상세 등 */}
    </AppShell>
  );
}
```
