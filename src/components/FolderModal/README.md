# FolderModal

가상 계좌 화면의 "폴더 추가" 모달. `TextField` + `Button` 조합.

## Import
```tsx
import { FolderModal } from '../components/FolderModal';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `open` | `boolean` | 표시 여부 |
| `value` | `string` | 입력 중인 폴더 이름 |
| `onChange` | `(v: string) => void` | 입력 변경 |
| `onCancel` | `() => void` | 취소/닫기 |
| `onConfirm` | `() => void` | 완료(폴더 이름이 비어있으면 비활성) |
