# Fab

원형 add 버튼(`IconButton` 기반). 기본 아이콘은 `+`. Figma: `16:428`(cyan) · `16:429`(navy).

## Import
```tsx
import { Fab } from '../components/Fab';
```

## Props
| prop | 타입 | 기본 | 설명 |
|---|---|---|---|
| `appVariant` | `'cyanFilled' \| 'cyanOutline' \| 'navyFilled' \| 'navyOutline'` | `'cyanFilled'` | 시안(#11acd0)/네이비(#0f59a3) × 채움/보더(1.5px) |
| `diameter` | `number` | `55` | 지름(px) |
| `children` | `ReactNode` | `<AddIcon/>` | 아이콘 커스텀 |
| …나머지 | `IconButtonProps`(`color`·`size` 제외) | | `onClick`, `sx` 등 |

## 예시
```tsx
<Fab appVariant="cyanFilled" onClick={add} />
<Fab appVariant="navyOutline" diameter={40} />
```
