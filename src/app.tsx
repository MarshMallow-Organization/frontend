import { useEffect, useState } from 'react';
import { APP_NAVIGATE_EVENT } from './lib/navigation';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from './pages/signup/SignUpPage';
import ComponentsPreview from './pages/dev/ComponentsPreviewPage';
import ComponentsVerify from './pages/dev/ComponentsVerifyPage';
import NewsPage from './pages/news/NewsPage';
import TradeJournalPage from './pages/trade-journal/TradeJournalPage';

function App() {
  const [location, setLocation] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
  }));

  useEffect(() => {
    const onChange = () =>
      setLocation({
        pathname: window.location.pathname,
        hash: window.location.hash,
      });

    window.addEventListener('hashchange', onChange);
    window.addEventListener('popstate', onChange);
    window.addEventListener(APP_NAVIGATE_EVENT, onChange);

    return () => {
      window.removeEventListener('hashchange', onChange);
      window.removeEventListener('popstate', onChange);
      window.removeEventListener(APP_NAVIGATE_EVENT, onChange);
    };
  }, []);

  if (location.hash === '#preview') return <ComponentsPreview />;
  if (location.hash.startsWith('#verify=')) {
    return (
      <ComponentsVerify
        vkey={decodeURIComponent(location.hash.slice('#verify='.length))}
      />
    );
  }
  /**
   * AI/개발자 주의: 아래 pathname 분기는 정식 라우터 도입 전 임시 라우트다.
   * 경로를 바꿀 때는 AppShell의 NAV_TABS와 navigation.ts를 함께 확인하고,
   * 이전 주소 호환이 필요하면 기존 경로를 alias로 남긴다.
   */
  if (location.pathname === '/signup') return <SignUpPage />;
  if (
    location.pathname === '/journal' ||
    location.pathname === '/trade-journal' ||
    location.hash === '#journal'
  ) {
    return <TradeJournalPage />;
  }
  if (location.pathname.startsWith('/news')) return <NewsPage />;
  return <LoginPage />; //api key 구현 이후 수정 예정
}

export default App;
