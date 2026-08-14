# 공유 컴포넌트

Figma에서 추출한 exact 값으로 만든 MUI 기반 공유 컴포넌트. 각 컴포넌트는 `src/theme` 토큰을
참조하는 얇은 래퍼다. **사용법은 각 폴더의 `README.md` 참조.**

## 사전 설정 (필수)
`main.tsx`에서 앱을 테마로 감싼다. RangeCalendar를 쓰면 `LocalizationProvider`도 필요.

```tsx
<ThemeProvider theme={theme}>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <CssBaseline />
    <App />
  </LocalizationProvider>
</ThemeProvider>
```

## 목록
| Tier | 컴포넌트 |
|---|---|
| Atoms | [Button](./Button/README.md) · [TextField](./TextField/README.md) · [SearchField](./SearchField/README.md) · [Chip](./Chip/README.md) · [Switch](./Switch/README.md) · [Fab](./Fab/README.md) · [Select](./Select/README.md) · [Pagination](./Pagination/README.md) |
| Molecules | [IconTab](./IconTab/README.md) · [BaseCard](./BaseCard/README.md) · [NewsTab](./NewsTab/README.md) · [ListRow](./ListRow/README.md) · [CtaButton](./CtaButton/README.md) |
| Organisms | [RangeCalendar](./RangeCalendar/README.md) · [AppShell](./AppShell/README.md) |

- import 경로는 사용 파일 위치에 맞게 상대경로 조정: `import { Button } from '../components/Button'`.
- 색은 항상 토큰(`tokens.color.*`) 참조 — 하드코딩 hex 금지.
- 미리보기: dev 앱 `/#preview`(갤러리) · `/#verify=<key>`(단일 격리).
- Figma 노드 매핑·QA 이력: `.ai/tasks/*/docs.md`, 값: `.ai/figma/values/*.json`.
