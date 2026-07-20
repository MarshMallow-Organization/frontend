# Pagination

MUI `Pagination` 래퍼. Figma 4형: `17:466`(container/원형 컨테이너) · `17:499`(boxedSquare) ·
`17:500`(boxedCircular).

## Import
```tsx
import { Pagination } from '../components/Pagination';
```

## Props
| prop | 타입 | 기본 | 설명 |
|---|---|---|---|
| `appVariant` | `'container' \| 'text' \| 'boxedCircular' \| 'boxedSquare'` | `'boxedSquare'` | container=테두리 컨테이너+사각 fill / text=텍스트만(선택=시안) / boxed*=아이템별 박스(원형/사각) |
| …나머지 | `MuiPaginationProps`(`variant`·`shape` 제외) | | `count`, `page`, `defaultPage`, `onChange`, `sx` 등 |

선택색 시안(#11acd0), prev/next 화살표·ellipsis 지원.

## 예시
```tsx
<Pagination
  appVariant="boxedSquare"
  count={10}
  page={page}
  onChange={(_, v) => setPage(v)}
/>
<Pagination appVariant="text" count={10} defaultPage={2} />
```
