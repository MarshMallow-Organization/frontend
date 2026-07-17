# RangeCalendar

범위 데이트픽커. 커뮤니티 `@mui/x-date-pickers` `DateCalendar` + 커스텀 Day 슬롯(유료 pro 미사용).
양 끝=시안(#11acd0) 원, 사이=연회색 fill. Figma: `17:888`.

> **필수**: 앱을 `LocalizationProvider dateAdapter={AdapterDateFns}`로 감싸야 한다(`main.tsx`).

## Import
```tsx
import { RangeCalendar } from '../components/RangeCalendar';
import type { DateRange } from '../components/RangeCalendar';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `value` | `DateRange` = `[Date \| null, Date \| null]` | 제어 값 `[시작, 끝]` |
| `onChange` | `(range: DateRange) => void` | 범위 변경. 클릭 로직: 1차=시작, 2차=끝, 역순=swap, 3차(둘 다 지정 시)=재시작 |
| `minDate` | `Date` | 선택 하한 |
| `maxDate` | `Date` | 선택 상한 |

## 예시
```tsx
const [range, setRange] = useState<DateRange>([null, null]);

<RangeCalendar value={range} onChange={setRange} />
```
