# Button

MUI `Button` 위 얇은 래퍼. hover/pressed/disabled는 테마가 처리하는 상호작용 상태(별도 variant 아님).
Figma: `14:359`(filled) · `14:367`(outline) · `22:546`(outlineSelected).

## Import
```tsx
import { Button } from '../components/Button';
```

## Props
| prop | 타입 | 기본 | 설명 |
|---|---|---|---|
| `appVariant` | `'filled' \| 'outline' \| 'outlineSelected'` | `'filled'` | filled=시안(#2fc4d1) 채움 / outline=네이비 보더+텍스트 / outlineSelected=선택 시안(#11acd0)+연틴트 |
| …나머지 | `MuiButtonProps`(`variant`·`color` 제외) | | `fullWidth`, `disabled`, `type`, `onClick`, `sx` 등 |

## 예시
```tsx
<Button appVariant="filled" onClick={submit}>확인</Button>
<Button appVariant="outline">취소</Button>
<Button appVariant="outlineSelected">선택됨</Button>

// 크기/모양 커스텀은 sx로 override (예: 로그인 풀폭 pill)
<Button appVariant="filled" fullWidth sx={{ borderRadius: '50px', height: 63, fontSize: 30 }}>
  로그인
</Button>
```
