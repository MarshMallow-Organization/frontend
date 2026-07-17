# Chip

라벨/태그용 MUI `Chip` 래퍼. Figma: `17:441`(outlineGray) · `17:442`(outlineCyan) ·
`58:1065`(시가총액) · `58:1066`(인기종목).

## Import
```tsx
import { Chip } from '../components/Chip';
```

## Props
| prop | 타입 | 기본 | 설명 |
|---|---|---|---|
| `appVariant` | `'outlineGray' \| 'outlineCyan' \| 'filledGray' \| 'filledCyan'` | `'outlineGray'` | outline=보더형 / filled=채움형(태그) |
| `shape` | `'rect' \| 'pill'` | `'rect'` | rect=둥근 사각(r10) / pill=완전 둥근 태그 |
| …나머지 | `MuiChipProps`(`variant`·`color` 제외) | | `label`, `onDelete`, `onClick`, `sx` 등 |

## 예시
```tsx
<Chip appVariant="outlineGray" label="Label" />
<Chip appVariant="outlineCyan" label="선택됨" />
<Chip shape="pill" appVariant="filledCyan" label="시가 총액" />
<Chip shape="pill" appVariant="filledGray" label="인기 종목" />
```
