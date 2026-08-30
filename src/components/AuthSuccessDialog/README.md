# AuthSuccessDialog

회원가입 완료·API Key 등록 완료 후 다음 화면으로 넘어가기 전에 띄우는 완료 팝업.
Figma "회원가입 완료 팝업" (`1197:6846`). 확인 버튼으로만 닫힌다(backdrop·ESC 차단).

- 회원가입: [`SignUpPage`](../../pages/signup/SignUpPage.tsx) — `signup()` 성공 후, 확인 시 `/register-key`
- API Key 등록: [`RegisterKeyPage`](../../pages/register-key/RegisterKeyPage.tsx) — `registerTossAccount()` 성공 후, 확인 시 `/home`

## Import
```tsx
import { AuthSuccessDialog } from '../components/AuthSuccessDialog';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `open` | `boolean` | 표시 여부 |
| `title` | `string?` | 카드 제목 (기본 `"회원가입 완료"`) |
| `userName` | `string?` | 굵게 표시할 사용자 이름. 없으면 인사말 줄 생략 |
| `message` | `string?` | 이름 줄 아래 안내 문구 (기본 `"지금 바로 Marsh Mallow를 경험해보세요!"`) |
| `onConfirm` | `() => void` | "확인" 클릭 시 (보통 `navigate(...)`) |
