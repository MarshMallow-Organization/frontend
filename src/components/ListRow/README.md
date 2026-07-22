# ListRow

슬롯 기반 리스트 행 — 뉴스 row와 보유종목 row를 하나로 커버하는 레이아웃 프리미티브.
타입 스케일은 용례별로 `titleSx`/`subtitleSx`로 지정. Figma: `123:464`(뉴스) · `127:2355`(보유종목).

## Import
```tsx
import { ListRow } from '../components/ListRow';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `leading` | `ReactNode` | 좌측 썸네일/아이콘 박스 |
| `title` | `ReactNode` | 필수. 제목(기본 weight 400, `ink`) |
| `subtitle` | `ReactNode` | 부제(`textSecondary`) |
| `trailing` | `ReactNode` | 우측 슬롯(Chip/버튼/meta 텍스트) |
| `titleSx` | `SxProps` | 제목 스타일 override(용례별 크기/색) |
| `subtitleSx` | `SxProps` | 부제 스타일 override |
| …나머지 | `BoxProps`(`title` 제외) | `onClick`, `sx` 등 |

## 예시
```tsx
// 뉴스 row
<ListRow
  leading={<img src={thumb} width={76} height={76} />}
  title="TSLA"
  titleSx={{ color: '#3f3f3f', fontSize: 13 }}
  subtitle="분할 매수함"
  trailing={<Chip shape="pill" appVariant="filledGray" label="1일 전" />}
/>

// 보유종목 row
<ListRow
  leading={<Box sx={{ width: 34, height: 34, bgcolor: 'primary.light', borderRadius: 1 }} />}
  title="898,975원"
  titleSx={{ fontSize: '1.25rem', fontWeight: 500 }}
  subtitle="삼성 전자"
  trailing={<Button appVariant="filled">송금</Button>}
/>
```
