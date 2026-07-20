# CtaButton

시안 pill 강조 CTA(아이콘 + 라벨) — `Button` 래퍼. 솔리드 #2fc4d1, radius 60, hover #0095b7.
Figma: `112:1128`(default) · `112:1130`(hover).

## Import
```tsx
import { CtaButton } from '../components/CtaButton';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `icon` | `ReactNode` | leading 아이콘(선택). 인라인 이모지는 `children`에 직접 넣어도 됨 |
| `children` | `ReactNode` | 필수. 라벨 |
| …나머지 | `MuiButtonProps`(`variant`·`color` 제외) | `onClick`, `disabled`, `sx` 등 |

## 예시
```tsx
// Figma는 라벨에 이모지 인라인
<CtaButton onClick={check}>✨AI 재무 상태 체크</CtaButton>

// 아이콘 컴포넌트로도 가능
<CtaButton icon={<AutoAwesomeIcon />}>AI 재무 상태 체크</CtaButton>
```
