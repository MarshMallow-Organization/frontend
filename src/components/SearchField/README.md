# SearchField

검색 입력 전용 `TextField` 래퍼(항상 돋보기 아이콘). placeholder 기본 `"검색어를 입력해주세요."`.
Figma: `16:419`(우측 아이콘 filled) · `15:378`(pill) · `16:395`(filled).

## Import
```tsx
import { SearchField } from '../components/SearchField';
```

## Props
| prop | 타입 | 기본 | 설명 |
|---|---|---|---|
| `appVariant` | `'pill' \| 'filled'` | `'pill'` | pill=흰 배경 완전 둥근 / filled=연회색(#e2eaf0) 채움 |
| `searchIconSide` | `'left' \| 'right'` | `'left'` | right일 때 돋보기 네이비(#0f59a3, 16:419), 그 외 회색(#8596a3) |
| `mic` | `boolean` | `false` | 우측 시안(#11acd0) 마이크 아이콘 |
| …나머지 | `MuiTextFieldProps`(`variant` 제외) | | `value`, `onChange`, `placeholder`, `fullWidth`, `sx` 등 |

## 예시
```tsx
<SearchField appVariant="pill" mic value={q} onChange={(e) => setQ(e.target.value)} />
<SearchField appVariant="filled" searchIconSide="right" />
```
