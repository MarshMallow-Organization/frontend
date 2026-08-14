import { useEffect, useState } from 'react';
import LoginPage from './pages/login/LoginPage';
import ComponentsPreview from './pages/dev/ComponentsPreviewPage';
import ComponentsVerify from './pages/dev/ComponentsVerifyPage';
import TradeJournalPage from './pages/trade-journal/TradeJournalPage';

function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  if (hash === '#preview') return <ComponentsPreview />;
  if (hash === '#journal') return <TradeJournalPage />;
  if (hash.startsWith('#verify=')) {
    return (
      <ComponentsVerify
        vkey={decodeURIComponent(hash.slice('#verify='.length))}
      />
    );
  }
  return <LoginPage />;
}

export default App;
