# IconTab

아이콘 + 라벨 탭 버튼(선택 상태). Figma: `151:1043`(default) · `151:1045`(selected) ·
`151:1275`(hover). 아이콘은 **outlined 변형 권장**(예: `CalendarMonthOutlined`).

## Import
```tsx
import { IconTab } from '../components/IconTab';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
```

## Props
| prop | 타입 | 기본 | 설명 |
|---|---|---|---|
| `icon` | `ReactNode` | — | leading 아이콘(outlined 권장) |
| `label` | `ReactNode` | 필수 | 라벨 |
| `selected` | `boolean` | `false` | 선택 시 연블루(#edf4fa) bg + 파랑(#0165e2) 텍스트·아이콘 |
| …나머지 | `ButtonBaseProps`(`color` 제외) | | `onClick`, `sx` 등 |

## 예시
```tsx
<IconTab
  icon={<CalendarMonthOutlined />}
  label="날짜별 조회"
  selected={tab === 'date'}
  onClick={() => setTab('date')}
/>
```
