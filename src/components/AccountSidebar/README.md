# AccountSidebar

"내 계좌" 화면 전용 좌측 서브 내비게이션 (자산 현황 / 가상 계좌 / 숨기기).

## Import
```tsx
import { AccountSidebar } from '../components/AccountSidebar';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `active` | `AccountSubTab` | 현재 선택된 서브 탭 |
| `onSelect` | `(tab: AccountSubTab) => void` | 탭 클릭 핸들러 |

## 예시
```tsx
<AccountSidebar active={subTab} onSelect={setSubTab} />
```
