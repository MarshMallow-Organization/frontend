import { useEffect, useState } from 'react';
import { APP_NAVIGATE_EVENT } from './lib/navigation';
import LoginPage from './pages/login/LoginPage';
import SignUpPage from './pages/signup/SignUpPage';
import ComponentsPreview from './pages/dev/ComponentsPreviewPage';
import ComponentsVerify from './pages/dev/ComponentsVerifyPage';
import NewsPage from './pages/news/NewsPage';
import TradeJournalPage from './pages/trade-journal/TradeJournalPage';
import HomePage from './pages/home/HomePage';
import AccountPage from './pages/account/AccountPage';
import StockDetailPage from './pages/stock/StockDetailPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';
import { GOOGLE_CALLBACK_PATH } from './lib/googleAuth';

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
  /* 구글 로그인용 임시 라우트*/
  if (location.pathname === GOOGLE_CALLBACK_PATH) {
    return <GoogleCallbackPage />;
  }

  /**
   * AI/개발자 주의: 아래 pathname 분기는 정식 라우터 도입 전 임시 라우트다.
   * 경로를 바꿀 때는 AppShell의 NAV_TABS와 navigation.ts를 함께 확인하고,
   * 이전 주소 호환이 필요하면 기존 경로를 alias로 남긴다.
   */
<<<<<<< Updated upstream
  if (location.pathname === '/signup') return <SignUpPage />;
=======

>>>>>>> Stashed changes
  if (
    location.pathname === '/journal' ||
    location.pathname === '/trade-journal' ||
    location.hash === '#journal'
  ) {
    return <TradeJournalPage />;
  }
  if (location.pathname.startsWith('/news')) return <NewsPage />;

  // AppShell 홈 버튼(navigate('/home'))·내 계좌 탭(navigate('/account'))의 실제
  // 도착지. #home/#account/#stock 해시는 이전 주소 alias로 남겨둔다.
  if (location.pathname === '/home' || location.hash === '#home') {
    return <HomePage />;
  }
  if (location.pathname === '/account' || location.hash === '#account') {
    return <AccountPage />;
  }
  if (location.pathname === '/stock' || location.hash === '#stock') {
    return <StockDetailPage />;
  }
  return <LoginPage />;
}

export default App;
