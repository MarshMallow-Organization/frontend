import { useEffect, useState } from 'react';

/**
 * 화면/탭 전환 시 부드러운 페이드를 적용하기 위한 훅.
 * opacity + CSS transition만 사용 (별도 애니메이션 라이브러리 없음).
 */
export function useScreenTransition<T>(initial: T) {
  const [target, setTarget] = useState<T>(initial);
  const [displayed, setDisplayed] = useState<T>(initial);
  const [visible, setVisible] = useState(true);

  const navigate = (next: T) => {
    setTarget((prev) => {
      if (prev === next) return prev;
      setVisible(false);
      return next;
    });
  };

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setDisplayed(target);
        setVisible(true);
      }, 160);
      return () => clearTimeout(timer);
    }
  }, [visible, target]);

  return { displayed, visible, navigate };
}
