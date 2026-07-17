# BaseCard

카드 표면 — MUI `Paper` 래퍼(elevation 0, radius 17). Figma: `156:623`(plain) · `161:638`(tinted).

## Import
```tsx
import { BaseCard } from '../components/BaseCard';
```

## Props
| prop | 타입 | 기본 | 설명 |
|---|---|---|---|
| `appVariant` | `'plain' \| 'tinted'` | `'plain'` | plain=흰 배경+회색(#dbdbdb) 보더 / tinted=연블루(#f6fbff) 배경+블루(#0165e2) 보더 |
| `children` | `ReactNode` | — | 내용 |
| …나머지 | `PaperProps`(`variant` 제외) | | `sx`, `onClick` 등 |

## 예시
```tsx
<BaseCard>
  <h3>기본 카드</h3>
</BaseCard>

<BaseCard appVariant="tinted" sx={{ p: 3 }}>
  강조 카드
</BaseCard>
```
