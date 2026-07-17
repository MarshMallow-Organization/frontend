# TextField

디자인 시스템 텍스트 입력 — MUI `TextField` 얇은 래퍼. `label`을 주면 입력 위에 연결된 라벨을
렌더한다. Figma(로그인 필드): `92:646`(라벨) · `92:647`(입력, 625×58 r40 보더 #d8d8d8).

## Import
```tsx
import { TextField } from '../components/TextField';
```

## Props
| prop | 타입 | 기본 | 설명 |
|---|---|---|---|
| `label` | `ReactNode` | — | 있으면 입력 위에 `<label htmlFor={id}>` 렌더. a11y 위해 `id`도 함께 지정 |
| `appVariant` | `'outlined' \| 'pill'` | `'outlined'` | pill=둥근(r40) 반투명 폼 입력(로그인 스타일) / outlined=표준 |
| …나머지 | `MuiTextFieldProps`(`variant` 제외) | | `value`, `onChange`, `type`, `fullWidth`, `placeholder`, `sx` 등 |

## 예시
```tsx
<TextField
  label="이름"
  id="name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<TextField appVariant="pill" label="비밀번호" id="pw" type="password" fullWidth />
```
