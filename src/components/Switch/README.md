# Switch

토글 스위치 — MUI `Switch` 래퍼. 두툼한 pill 형태로 override. on=시안(#11acd0) 트랙,
off=회색(#e2eaf0). Figma: `17:447`(off) · `17:448`(on).

## Import
```tsx
import { Switch } from '../components/Switch';
```

## Props
`AppSwitchProps = SwitchProps` — MUI `Switch` props를 그대로 받는다
(`checked`, `defaultChecked`, `onChange`, `disabled`, `sx` 등).

## 예시
```tsx
<Switch checked={on} onChange={(_, v) => setOn(v)} />
<Switch defaultChecked />
```
