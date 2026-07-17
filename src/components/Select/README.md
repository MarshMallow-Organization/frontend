# Select

Outlined 드롭다운(월/년 등) — MUI `Select` 래퍼. `options`로 항목을 넘긴다.
Figma: `105:841`(월/년 Select).

## Import
```tsx
import { Select } from '../components/Select';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `options` | `SelectOption[]` = `{ label: string; value: string \| number }[]` | 필수. 렌더할 옵션 |
| …나머지 | `MuiSelectProps`(`children` 제외) | `value`, `onChange`, `sx` 등 |

## 예시
```tsx
const months = Array.from({ length: 12 }, (_, i) => ({
  label: `${i + 1}월`,
  value: i + 1,
}));

<Select
  options={months}
  value={month}
  onChange={(e) => setMonth(e.target.value)}
/>
```
