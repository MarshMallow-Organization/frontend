# Zustand 사용 가이드

## 1. Zustand란?

Zustand는 React 애플리케이션에서 여러 컴포넌트가 함께 사용하는 상태를 관리하기 위한 경량 상태 관리 라이브러리다.

Zustand의 store는 크게 두 요소로 구성된다.

- **상태(state)**: 애플리케이션이 기억해야 하는 값
- **액션(action)**: 상태를 읽거나 변경하는 함수

React 컴포넌트는 store 전체가 아니라 필요한 값이나 액션을 선택해서 구독할 수 있다. 선택한 값이 변경되면 해당 컴포넌트만 다시 렌더링된다.

```text
컴포넌트 ── 액션 호출 ──> Store
컴포넌트 <── 상태 구독 ── Store
```

이 프로젝트는 Zustand 5와 TypeScript를 사용한다.

## 2. 왜 사용하는가?

### Props 전달을 줄일 수 있다

서로 멀리 떨어진 컴포넌트가 같은 상태를 사용하면 중간 컴포넌트가 사용하지 않는 값까지 props로 전달해야 할 수 있다. Zustand store를 사용하면 필요한 컴포넌트가 상태를 직접 구독할 수 있다.

### 구조가 단순하다

별도의 Provider 없이 hook 형태의 store를 만들어 사용할 수 있다. 상태와 상태 변경 로직을 같은 위치에 둘 수 있어 흐름을 추적하기 쉽다.

### 필요한 상태만 구독할 수 있다

selector로 필요한 조각만 선택하면 관련 없는 상태 변경으로 인한 렌더링을 줄일 수 있다.

### React 외부에서도 사용할 수 있다

store는 `getState`, `setState`, `subscribe` API를 제공한다. 따라서 API 클라이언트, 이벤트 처리 코드 등 React 컴포넌트 밖에서도 필요할 때 접근할 수 있다.

### 기능을 점진적으로 확장할 수 있다

기본 store는 작게 유지하면서 middleware로 Redux DevTools 연동, 로컬 저장소 영속화 등의 기능을 추가할 수 있다.

## 3. 언제 사용해야 하는가?

다음처럼 여러 화면이나 컴포넌트가 함께 사용하고 변경하는 클라이언트 상태에 적합하다.

- 로그인한 사용자 정보
- 전역 모달이나 토스트 상태
- 여러 단계 폼의 진행 상태
- 검색 조건이나 필터
- 장바구니
- 오디오 플레이어 상태

반대로 다음 상태는 우선 다른 방법을 고려한다.

| 상태 종류                                                | 우선 고려할 방법                  |
| -------------------------------------------------------- | --------------------------------- |
| 한 컴포넌트에서만 쓰는 입력값, 열림 여부                 | `useState`, `useReducer`          |
| 부모와 가까운 자식 몇 개만 공유하는 값                   | props, Context                    |
| URL로 공유하거나 새로고침 후에도 복원해야 하는 검색 조건 | URL search params                 |
| 서버에서 가져온 데이터의 캐시, 재요청, 동기화            | 서버 상태 관리 도구 또는 API 계층 |

모든 상태를 전역 store에 넣으면 상태의 소유권이 불분명해지고 store 간 의존성이 커질 수 있다. **둘 이상의 멀리 떨어진 컴포넌트가 실제로 공유하는가**를 기준으로 판단한다.

## 4. 기본 store 만들기

이 프로젝트의 `src/stores/counterStore.ts`는 다음 구조를 사용한다.

```ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    { name: 'counter-store' },
  ),
);
```

핵심 요소는 다음과 같다.

- `create<CounterState>()`: 타입이 지정된 React hook store를 생성한다.
- `set`: 새로운 상태를 반영한다.
- `state`: 함수형 업데이트에서 현재 상태를 나타낸다.
- `devtools`: 상태와 액션을 Redux DevTools에서 확인할 수 있게 한다.

현재 값에 의존하는 업데이트는 함수형 `set`을 사용한다.

```ts
increment: () => set((state) => ({ count: state.count + 1 }));
```

현재 값과 무관하게 특정 값으로 바꾸는 경우 객체를 바로 전달할 수 있다.

```ts
reset: () => set({ count: 0 });
```

`set`에 전달한 객체는 기본적으로 기존 상태와 얕게 병합된다. 따라서 변경할 필드만 반환하면 된다.

## 5. 컴포넌트에서 사용하기

store에서 필요한 값만 selector로 선택한다.

```tsx
import { useCounterStore } from '../stores/counterStore';

export function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const reset = useCounterStore((state) => state.reset);

  return (
    <section>
      <p>현재 값: {count}</p>
      <button onClick={increment}>증가</button>
      <button onClick={reset}>초기화</button>
    </section>
  );
}
```

다음처럼 selector 없이 store 전체를 구독하는 방식은 피한다.

```tsx
// store의 어떤 값이 바뀌어도 다시 렌더링될 수 있다.
const store = useCounterStore();
```

여러 값을 하나의 객체로 선택하면 매 렌더링마다 새 객체가 생성된다. 이 경우 `useShallow`를 사용하거나 각각 구독한다.

```tsx
import { useShallow } from 'zustand/react/shallow';

const { count, increment } = useCounterStore(
  useShallow((state) => ({
    count: state.count,
    increment: state.increment,
  })),
);
```

## 6. 상태와 액션 설계

상태를 변경하는 로직은 가능한 한 store의 액션 안에 둔다.

```ts
interface PlayerState {
  isPlaying: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>()((set) => ({
  isPlaying: false,
  volume: 1,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  setVolume: (volume) => set({ volume: Math.min(1, Math.max(0, volume)) }),
}));
```

컴포넌트가 `setState`로 상태를 직접 조작하기 시작하면 유효성 검사와 비즈니스 규칙이 여러 곳에 흩어진다. `play`, `pause`, `setVolume`처럼 의도가 드러나는 액션 이름을 사용한다.

store는 기능이나 도메인 단위로 나눈다.

```text
src/stores/
├── authStore.ts
├── playerStore.ts
└── searchStore.ts
```

하나의 거대한 store에 모든 상태를 넣거나, 값 하나마다 store를 만드는 두 극단을 모두 피한다.

## 7. 객체와 배열 업데이트

Zustand는 상태를 자동으로 깊은 복사하지 않는다. 객체나 배열을 변경할 때는 새로운 값을 만들어 반환한다.

```ts
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  toggleTodo: (id: number) => void;
}

export const useTodoStore = create<TodoState>()((set) => ({
  todos: [],
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    })),
}));
```

다음처럼 기존 상태를 직접 변경하지 않는다.

```ts
// 잘못된 예
state.todos[0].completed = true;
```

## 8. 비동기 액션

액션 함수 안에서 비동기 작업을 수행한 뒤 `set`으로 결과를 반영할 수 있다.
이 프로젝트에서는 컴포넌트나 store가 `fetch`를 직접 호출하지 않고 `src/lib/api.ts`의 공통 래퍼를 사용한다.

```ts
import { apiFetch } from '../lib/api';

interface ApiResponse<T> {
  data: T;
}

interface User {
  id: number;
  name: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchUser: async (id) => {
    set({ isLoading: true, error: null });

    try {
      // 현재 apiFetch는 응답을 자동으로 unwrap하지 않으므로 data를 꺼낸다.
      const { data: user } = await apiFetch<ApiResponse<User>>(`/users/${id}`);
      set({ user, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error ? error.message : '알 수 없는 오류입니다.',
      });
    }
  },
}));
```

Zustand는 비동기 데이터 캐시 도구가 아니다. 단순한 요청 상태는 관리할 수 있지만 캐시 만료, 중복 요청 제거, 자동 재요청, 서버 데이터 동기화가 중요하다면 서버 상태 전용 도구 도입을 검토한다.

## 9. `get`으로 현재 상태 읽기

store를 생성하는 함수의 두 번째 인자인 `get`으로 액션 안에서 현재 상태나 다른 액션에 접근할 수 있다.

```ts
interface SessionState {
  accessToken: string | null;
  isLoggedIn: () => boolean;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set, get) => ({
  accessToken: null,
  isLoggedIn: () => get().accessToken !== null,
  clearSession: () => set({ accessToken: null }),
}));
```

화면에 표시할 수 있는 파생 값은 store에 중복 저장하기보다 selector에서 계산하는 편이 좋다.

```tsx
const completedCount = useTodoStore(
  (state) => state.todos.filter((todo) => todo.completed).length,
);
```

원본과 파생 값을 함께 저장하면 둘의 값이 어긋날 가능성이 생긴다.

## 10. Middleware

### Redux DevTools

`devtools` middleware를 사용하면 상태 변경을 브라우저 Redux DevTools에서 추적할 수 있다.

```ts
import { devtools } from 'zustand/middleware';

const useStore = create<State>()(
  devtools(
    (set) => ({
      // 상태와 액션
    }),
    { name: 'store-name' },
  ),
);
```

store마다 구분 가능한 이름을 부여한다. 디버깅할 때 액션 이름까지 명확히 표시하려면 `set`의 세 번째 인자에 액션 이름을 전달할 수 있다.

```ts
increment: () =>
  set((state) => ({ count: state.count + 1 }), false, 'counter/increment');
```

### Persist

`persist` middleware는 상태 일부를 `localStorage` 같은 저장소에 보관하고 새로고침 후 복원한다.

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferenceState {
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      themeMode: 'light',
      setThemeMode: (themeMode) => set({ themeMode }),
    }),
    {
      name: 'preferences',
      partialize: (state) => ({ themeMode: state.themeMode }),
    },
  ),
);
```

다음 값은 저장하지 않거나 특별히 주의한다.

- 비밀번호, access token 등 민감한 정보
- 함수나 DOM 객체처럼 직렬화할 수 없는 값
- 서버에서 다시 조회해야 하는 오래된 데이터
- 용량이 큰 데이터

`partialize`로 실제 복원이 필요한 값만 저장한다.

## 11. React 외부에서 사용하기

hook store에는 React 외부에서 사용할 수 있는 API가 포함되어 있다.

```ts
const count = useCounterStore.getState().count;

useCounterStore.getState().increment();

const unsubscribe = useCounterStore.subscribe((state) => {
  console.log(state.count);
});

unsubscribe();
```

React 컴포넌트 안에서는 반응형 렌더링을 위해 selector hook을 사용한다. `getState()`로 읽은 값은 변경되어도 컴포넌트를 다시 렌더링하지 않는다.

## 12. 초기화와 테스트

store 테스트에서는 액션 실행 전후의 상태를 직접 확인할 수 있다.

```ts
beforeEach(() => {
  useCounterStore.setState({ count: 0 });
});

it('count를 1 증가시킨다', () => {
  useCounterStore.getState().increment();

  expect(useCounterStore.getState().count).toBe(1);
});
```

테스트 간 상태가 공유되지 않도록 각 테스트 전에 초기화한다. store가 복잡해지면 초기 상태를 별도 상수로 정의하고 `reset` 액션에서도 재사용할 수 있다.

```ts
const initialState = {
  count: 0,
};

export const useCounterStore = create<CounterState>()((set) => ({
  ...initialState,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set(initialState),
}));
```

## 13. 프로젝트 권장 규칙

1. 컴포넌트 로컬 상태는 우선 `useState` 또는 `useReducer`를 사용한다.
2. 여러 영역에서 실제로 공유하는 클라이언트 상태만 Zustand로 올린다.
3. store 파일은 `src/stores`에 기능 단위로 둔다.
4. 상태 타입과 액션 타입을 명확히 작성한다.
5. 컴포넌트에서는 selector로 필요한 값만 구독한다.
6. 상태 변경 규칙은 컴포넌트가 아니라 store 액션에 둔다.
7. 객체와 배열은 직접 수정하지 않고 새 값으로 교체한다.
8. 파생 값은 가능한 한 원본 상태에서 계산한다.
9. 영속화는 필요한 값에만 제한적으로 사용한다.
10. 서버 상태와 클라이언트 전역 상태의 역할을 구분한다.

## 14. 요약

Zustand는 React 컴포넌트 여러 곳에서 공유하는 클라이언트 상태를 간결하게 관리하는 도구다. store에 상태와 액션을 정의하고, 컴포넌트에서는 selector를 통해 필요한 상태만 구독한다.

가장 중요한 원칙은 Zustand를 많이 사용하는 것이 아니라 **상태를 적절한 위치에 두는 것**이다. 로컬 상태는 컴포넌트에 유지하고, 실제로 공유해야 하는 상태만 작고 명확한 store로 관리한다.
