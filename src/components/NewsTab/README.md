# NewsTab

텍스트 탭 strip. 선택 탭 = 파랑 Black(#11acd0) + 시안 밑줄, 미선택 = 회색(#b4b4b4).
Figma: `127:500`(default) · `127:499`(selected).

## Import
```tsx
import { NewsTab } from '../components/NewsTab';
```

## Props
| prop | 타입 | 설명 |
|---|---|---|
| `tabs` | `string[]` | 탭 라벨 배열 |
| `value` | `number` | 선택 인덱스 |
| `onChange` | `(index: number) => void` | 탭 클릭 콜백 |
| …나머지 | `BoxProps`(`onChange` 제외) | `sx` 등 |

## 예시
```tsx
const [idx, setIdx] = useState(0);

<NewsTab tabs={['인기 뉴스', '최신', '급등']} value={idx} onChange={setIdx} />
```
